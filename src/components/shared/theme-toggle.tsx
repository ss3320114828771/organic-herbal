'use client'

import React from 'react'

interface ThemeToggleProps {
  onChange?: (theme: 'light' | 'dark') => void
  defaultTheme?: 'light' | 'dark'
  className?: string
}

export default function ThemeToggle({
  onChange,
  defaultTheme = 'light',
  className = ''
}: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(saved)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    onChange?.(newTheme)
  }

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'light' 
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
          : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

// Simple hook
export function useTheme() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
    }
  }, [])

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return { theme, toggle, isDark: theme === 'dark' }
}