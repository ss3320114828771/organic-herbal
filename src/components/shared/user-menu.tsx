'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface UserMenuProps {
  user?: User
  menuItems?: MenuItem[]
  onLogin?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  variant?: 'default' | 'minimal' | 'compact'
  position?: 'left' | 'right'
  showAvatar?: boolean
  showName?: boolean
  showEmail?: boolean
  avatarSize?: 'sm' | 'md' | 'lg'
  className?: string
  buttonClassName?: string
  menuClassName?: string
  loading?: boolean
}

interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
}

interface MenuItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
  divider?: boolean
  disabled?: boolean
  badge?: string | number
}

export default function UserMenu({
  user,
  menuItems = [],
  onLogin,
  onLogout,
  onProfileClick,
  onSettingsClick,
  variant = 'default',
  position = 'right',
  showAvatar = true,
  showName = true,
  showEmail = false,
  avatarSize = 'md',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  loading = false
}: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Default menu items if none provided
  const defaultMenuItems: MenuItem[] = [
    { id: 'profile', label: 'Profile', href: '/profile', onClick: onProfileClick },
    { id: 'settings', label: 'Settings', href: '/settings', onClick: onSettingsClick },
    { id: 'divider-1', label: '', divider: true },
    { id: 'logout', label: 'Logout', onClick: onLogout }
  ]

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  // Loading state
  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className={`${avatarSizes[avatarSize]} rounded-full bg-gray-200 animate-pulse`} />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <button
        onClick={onLogin}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${className}`}
      >
        <span>🔐</span>
        <span>Sign In</span>
      </button>
    )
  }

  // Minimal variant - just avatar
  if (variant === 'minimal') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center focus:outline-none ${buttonClassName}`}
          aria-label="User menu"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={`${avatarSizes[avatarSize]} rounded-full object-cover border-2 border-transparent hover:border-green-500 transition-colors`}
            />
          ) : (
            <div
              className={`${avatarSizes[avatarSize]} rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white font-medium hover:ring-2 hover:ring-green-500 transition-all`}
            >
              {getInitials(user.name)}
            </div>
          )}
        </button>

        {isOpen && (
          <div
            className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 ${menuClassName}`}
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              {user.email && <p className="text-xs text-gray-500 mt-1">{user.email}</p>}
            </div>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                {item.divider ? (
                  <div className="my-1 border-t border-gray-200" />
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      item.disabled ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    onClick={() => {
                      item.onClick?.()
                      setIsOpen(false)
                    }}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.()
                      setIsOpen(false)
                    }}
                    disabled={item.disabled}
                    className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Compact variant - avatar with name
  if (variant === 'compact') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors ${buttonClassName}`}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={`${avatarSizes[avatarSize]} rounded-full object-cover`}
            />
          ) : (
            <div
              className={`${avatarSizes[avatarSize]} rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white font-medium`}
            >
              {getInitials(user.name)}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            {user.role && <p className="text-xs text-gray-500">{user.role}</p>}
          </div>
        </button>

        {isOpen && (
          <div
            className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 ${menuClassName}`}
          >
            {items.map((item) => (
              <React.Fragment key={item.id}>
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
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default variant - full featured
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors ${buttonClassName}`}
      >
        {showAvatar && (
          <>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={`${avatarSizes[avatarSize]} rounded-full object-cover`}
              />
            ) : (
              <div
                className={`${avatarSizes[avatarSize]} rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white font-medium`}
              >
                {getInitials(user.name)}
              </div>
            )}
          </>
        )}
        <div className="text-left">
          {showName && <p className="text-sm font-medium text-gray-800">{user.name}</p>}
          {showEmail && user.email && <p className="text-xs text-gray-500">{user.email}</p>}
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 ${menuClassName}`}
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.divider ? (
                <div className="my-1 border-t border-gray-200" />
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    item.disabled ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple avatar with dropdown
export function AvatarMenu({ user, onLogout }: { user: User; onLogout?: () => void }) {
  return (
    <UserMenu
      user={user}
      onLogout={onLogout}
      variant="minimal"
      showName={false}
    />
  )
}

// Header user menu with name
export function HeaderUserMenu({ user, onLogout }: { user: User; onLogout?: () => void }) {
  return (
    <UserMenu
      user={user}
      onLogout={onLogout}
      variant="compact"
      position="right"
    />
  )
}

// Dashboard user menu
export function DashboardUserMenu({ user, onLogout }: { user: User; onLogout?: () => void }) {
  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { id: 'billing', label: 'Billing', href: '/dashboard/billing', icon: '💳' },
    { id: 'divider', label: '', divider: true },
    { id: 'logout', label: 'Logout', icon: '🚪', onClick: onLogout }
  ]

  return (
    <UserMenu
      user={user}
      menuItems={menuItems}
      variant="default"
      showEmail={true}
    />
  )
}

// Login button
export function LoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <span>🔐</span>
      <span>Sign In</span>
    </button>
  )
}

// ==================== HOOK ====================

// Custom hook for user menu state
export function useUserMenu(initialUser?: User) {
  const [user, setUser] = React.useState<User | undefined>(initialUser)
  const [loading, setLoading] = React.useState(false)

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: 'User'
      }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem('user')
  }

  React.useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved user')
      }
    }
  }, [])

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }
}