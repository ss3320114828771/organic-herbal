'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface Language {
  code: string
  name: string
  nativeName?: string
  flag?: string
  dir?: 'ltr' | 'rtl'
}

interface LanguageSelectorProps {
  languages?: Language[]
  currentLanguage?: string
  onLanguageChange?: (languageCode: string) => void
  variant?: 'dropdown' | 'buttons' | 'flags' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  showFlag?: boolean
  className?: string
}

export default function LanguageSelector({
  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ],
  currentLanguage,
  onLanguageChange,
  variant = 'dropdown',
  size = 'md',
  showName = true,
  showFlag = true,
  className = ''
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(currentLanguage || languages[0]?.code || 'en')
  const menuRef = React.useRef<HTMLDivElement>(null)
  
  const currentLang = languages.find(l => l.code === selected) || languages[0]

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code: string) => {
    setSelected(code)
    setIsOpen(false)
    onLanguageChange?.(code)
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3'
  }

  // Simple dropdown
  if (variant === 'dropdown') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${sizeClasses[size]} ${className}`}
        >
          {showFlag && <span>{currentLang.flag}</span>}
          {showName && <span>{currentLang.name}</span>}
          <span>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                  selected === lang.code ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                {showFlag && <span>{lang.flag}</span>}
                <span>{lang.name}</span>
                {selected === lang.code && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Simple buttons
  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-3 py-2 rounded-lg border ${
              selected === lang.code
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } ${sizeClasses[size]}`}
          >
            {showFlag && lang.flag} {showName && lang.name}
          </button>
        ))}
      </div>
    )
  }

  // Simple flags
  return (
    <div className={`flex gap-1 ${className}`}>
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`p-1.5 rounded-lg text-xl ${
            selected === lang.code ? 'bg-green-100 ring-2 ring-green-600' : 'hover:bg-gray-100'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  )
}

// Simple preset
export function SimpleLanguageSelector() {
  return <LanguageSelector variant="dropdown" size="sm" />
}