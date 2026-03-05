'use client'

import React from 'react'
import Link from 'next/link'

// Simple Dropdown component - FIXED line 18
export default function Dropdown({ 
  trigger, 
  items = [], 
  align = 'left',
  className = '' 
}: any) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]
          ${align === 'left' ? 'left-0' : 'right-0'}
        `}>
          {items.map((item: any, i: number) => (
            <div key={i}>
              {item.divider ? (
                <div className="my-1 border-t border-gray-200" />
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple User Menu
export function UserMenu({ user, onLogout }: any) {
  const items = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { divider: true },
    { label: 'Logout', onClick: onLogout }
  ]

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            {user?.name?.[0] || 'U'}
          </div>
          <span>{user?.name || 'User'}</span>
        </div>
      }
      items={items}
      align="right"
    />
  )
}

// Simple Notification Bell
export function NotificationBell({ count = 0, onClick }: any) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-gray-100 rounded-lg relative">
      🔔
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}

// Simple Language Selector
export function LanguageSelector({ languages = [], onSelect, current }: any) {
  const items = languages.map((lang: any) => ({
    label: lang.name,
    onClick: () => onSelect?.(lang.code)
  }))

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
          {current?.flag || '🌐'} {current?.code?.toUpperCase() || 'EN'}
        </button>
      }
      items={items}
      align="right"
    />
  )
}

// Simple Sort Menu
export function SortMenu({ options = [], onSelect, current }: any) {
  const items = options.map((opt: any) => ({
    label: opt.label,
    onClick: () => onSelect?.(opt.value)
  }))

  return (
    <Dropdown
      trigger={
        <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          Sort: {current || 'Default'} ▼
        </button>
      }
      items={items}
    />
  )
}

// Simple Filter Menu
export function FilterMenu({ filters = [], onApply }: any) {
  const [values, setValues] = React.useState({})

  const handleApply = () => {
    onApply?.(values)
  }

  return (
    <Dropdown
      trigger={
        <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          Filter ▼
        </button>
      }
      align="right"
    >
      <div className="p-3 w-64">
        {filters.map((filter: any, i: number) => (
          <div key={i} className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm"
              onChange={(e) => setValues({ ...values, [filter.id]: e.target.value })}
            >
              <option value="">All</option>
              {filter.options?.map((opt: any, j: number) => (
                <option key={j} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleApply}
          className="w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          Apply
        </button>
      </div>
    </Dropdown>
  )
}

// Simple hook
export function useDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  return { isOpen, open, close, toggle }
}