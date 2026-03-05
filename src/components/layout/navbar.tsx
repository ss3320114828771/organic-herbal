'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  brandName?: string
  menuItems?: NavItem[]
  rightItems?: NavItem[]
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  sticky?: boolean
  transparent?: boolean
  variant?: 'light' | 'dark' | 'colored'
  color?: string
  className?: string
  containerClassName?: string
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
  onClick?: () => void
  external?: boolean
  active?: boolean
}

export default function Navbar({
  logo,
  brandName = 'Logo',
  menuItems = [],
  rightItems = [],
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  sticky = true,
  transparent = false,
  variant = 'light',
  color,
  className = '',
  containerClassName = '',
  mobileBreakpoint = 'lg'
}: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Handle scroll effect
  React.useEffect(() => {
    if (!sticky) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
      setSearchQuery('')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = 'w-full transition-all duration-300 z-50'
    
    if (transparent && !isScrolled) {
      return `${baseStyles} bg-transparent absolute text-white`
    }

    switch (variant) {
      case 'dark':
        return `${baseStyles} bg-gray-900 text-white ${
          isScrolled ? 'shadow-lg' : ''
        }`
      case 'colored':
        return `${baseStyles} ${color || 'bg-green-600'} text-white ${
          isScrolled ? 'shadow-lg' : ''
        }`
      default: // light
        return `${baseStyles} bg-white text-gray-800 ${
          isScrolled ? 'shadow-md' : 'border-b border-gray-200'
        }`
    }
  }

  const linkStyles = {
    light: 'text-gray-600 hover:text-green-600',
    dark: 'text-gray-300 hover:text-white',
    colored: 'text-white/90 hover:text-white'
  }

  const activeStyles = {
    light: 'text-green-600 font-medium',
    dark: 'text-white font-medium',
    colored: 'text-white font-medium border-b-2 border-white'
  }

  const mobileBreakpointClass = {
    'sm': 'sm:flex',
    'md': 'md:flex',
    'lg': 'lg:flex',
    'xl': 'xl:flex',
    '2xl': '2xl:flex'
  }

  // Icons
  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isItemActive = item.active || isActive(item.href)
    const isDropdownOpen = openDropdown === item.label

    if (hasChildren) {
      return (
        <div key={item.label} className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors w-full ${
              isMobile ? 'justify-between' : ''
            } ${
              isItemActive
                ? activeStyles[variant as keyof typeof activeStyles] || activeStyles.light
                : linkStyles[variant as keyof typeof linkStyles] || linkStyles.light
            }`}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </span>
            <ChevronDownIcon />
          </button>

          {/* Dropdown Menu */}
          {(isMobile ? true : isDropdownOpen) && (
            <div className={`${
              isMobile
                ? 'pl-4 mt-1 space-y-1'
                : 'absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2'
            }`}>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  target={child.external ? '_blank' : undefined}
                  rel={child.external ? 'noopener noreferrer' : undefined}
                  className={`block px-4 py-2 text-sm ${
                    isMobile
                      ? 'text-gray-600 hover:text-green-600'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                  onClick={() => {
                    setOpenDropdown(null)
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="flex items-center">
                    {child.icon && <span className="mr-2">{child.icon}</span>}
                    {child.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        onClick={() => {
          if (item.onClick) item.onClick()
          if (isMobile) setIsMobileMenuOpen(false)
        }}
        className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
          isItemActive
            ? activeStyles[variant as keyof typeof activeStyles] || activeStyles.light
            : linkStyles[variant as keyof typeof linkStyles] || linkStyles.light
        }`}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
        {item.badge && (
          <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <nav className={`${getVariantStyles()} ${className}`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logo ? (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={logo.height || 40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold">{brandName}</span>
              )}
            </Link>
          </div>

          {/* Desktop Menu - Left */}
          {menuItems.length > 0 && (
            <div className={`hidden ${mobileBreakpointClass[mobileBreakpoint]} items-center space-x-1`}>
              {menuItems.map(item => renderNavItem(item))}
            </div>
          )}

          {/* Desktop Menu - Right */}
          <div className="flex items-center space-x-2">
            {rightItems.length > 0 && (
              <div className={`hidden ${mobileBreakpointClass[mobileBreakpoint]} items-center space-x-1 mr-2`}>
                {rightItems.map(item => renderNavItem(item))}
              </div>
            )}

            {/* Search */}
            {showSearch && (
              <div className="hidden sm:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={`w-48 lg:w-64 px-3 py-1.5 pl-8 text-sm rounded-lg border ${
                      variant === 'dark' || (transparent && !isScrolled)
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/60'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-200`}
                  />
                  <SearchIcon />
                </form>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg ${
                variant === 'dark' || (transparent && !isScrolled)
                  ? 'hover:bg-white/10'
                  : 'hover:bg-gray-100'
              } ${mobileBreakpointClass[mobileBreakpoint] ? `hidden ${mobileBreakpointClass[mobileBreakpoint]}` : ''}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`py-4 border-t ${
            variant === 'dark' || (transparent && !isScrolled)
              ? 'border-white/10'
              : 'border-gray-200'
          }`}>
            {/* Mobile Search */}
            {showSearch && (
              <div className="px-3 pb-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={`w-full px-3 py-2 pl-8 text-sm rounded-lg border ${
                      variant === 'dark' || (transparent && !isScrolled)
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/60'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-200`}
                  />
                  <SearchIcon />
                </form>
              </div>
            )}

            {/* Mobile Menu Items */}
            <div className="space-y-1">
              {menuItems.map(item => renderNavItem(item, true))}
              {rightItems.map(item => renderNavItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple Navbar
export function SimpleNavbar() {
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  return <Navbar brandName="Logo" menuItems={menuItems} />
}

// E-commerce Navbar
export function EcommerceNavbar() {
  const menuItems: NavItem[] = [
    { label: 'Shop', href: '/shop' },
    { label: 'New Arrivals', href: '/new', badge: 'New' },
    { label: 'Deals', href: '/deals', badge: '50% off' },
    {
      label: 'Categories',
      href: '#',
      children: [
        { label: 'Electronics', href: '/category/electronics' },
        { label: 'Fashion', href: '/category/fashion' },
        { label: 'Home & Garden', href: '/category/home' },
        { label: 'Sports', href: '/category/sports' }
      ]
    }
  ]

  const rightItems: NavItem[] = [
    { label: 'Cart', href: '/cart', icon: <CartIcon /> },
    { label: 'Account', href: '/account', icon: <UserIcon /> }
  ]

  return (
    <Navbar
      brandName="ShopHub"
      menuItems={menuItems}
      rightItems={rightItems}
      showSearch={true}
      variant="light"
      sticky={true}
    />
  )
}

// Dark Navbar
export function DarkNavbar() {
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' }
  ]

  return (
    <Navbar
      brandName="DarkTheme"
      menuItems={menuItems}
      variant="dark"
      sticky={true}
    />
  )
}

// Transparent Navbar (for hero sections)
export function TransparentNavbar() {
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <Navbar
      brandName="Brand"
      menuItems={menuItems}
      transparent={true}
      variant="light"
    />
  )
}

// Admin Navbar
export function AdminNavbar() {
  const rightItems: NavItem[] = [
    { label: 'Profile', href: '/admin/profile', icon: <UserIcon /> },
    { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> }
  ]

  return (
    <Navbar
      brandName="Admin Panel"
      rightItems={rightItems}
      variant="dark"
      sticky={true}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}