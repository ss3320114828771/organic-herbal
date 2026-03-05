'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  menuItems?: NavItem[]
  brandName?: string
  logo?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  userInfo?: {
    name: string
    email?: string
    avatar?: string
  }
  userMenuItems?: NavItem[]
  showLanguageSelector?: boolean
  showCurrencySelector?: boolean
  languages?: Language[]
  currencies?: Currency[]
  onLanguageChange?: (code: string) => void
  onCurrencyChange?: (code: string) => void
  className?: string
  position?: 'left' | 'right'
  variant?: 'default' | 'dark' | 'blur'
}

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
  onClick?: () => void
}

interface Language {
  code: string
  name: string
  flag?: string
}

interface Currency {
  code: string
  symbol: string
  name: string
}

export default function MobileNav({
  isOpen,
  onClose,
  menuItems = [],
  brandName = 'Menu',
  logo,
  showSearch = false,
  onSearch,
  userInfo,
  userMenuItems = [],
  showLanguageSelector = false,
  showCurrencySelector = false,
  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ],
  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ],
  onLanguageChange,
  onCurrencyChange,
  className = '',
  position = 'left',
  variant = 'default'
}: MobileNavProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedLanguage, setSelectedLanguage] = React.useState('en')
  const [selectedCurrency, setSelectedCurrency] = React.useState('USD')
  const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = React.useState(false)

  // Close nav when route changes
  React.useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when nav is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
      onClose()
    }
  }

  const handleLinkClick = (onClick?: () => void) => {
    if (onClick) onClick()
    onClose()
  }

  const isActive = (href: string) => pathname === href

  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    dark: 'bg-gray-900 text-white',
    blur: 'bg-white/90 backdrop-blur-md'
  }

  const textStyles = {
    default: 'text-gray-600',
    dark: 'text-gray-300',
    blur: 'text-gray-600'
  }

  const activeStyles = {
    default: 'text-green-600 bg-green-50',
    dark: 'text-green-400 bg-gray-800',
    blur: 'text-green-600 bg-green-50/50'
  }

  const borderStyles = {
    default: 'border-gray-200',
    dark: 'border-gray-800',
    blur: 'border-gray-200/50'
  }

  // Icons
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

  const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )

  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Drawer */}
      <div
        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full w-full max-w-sm ${variantStyles[variant]} shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
        } ${className}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${borderStyles[variant]}`}>
          <div className="flex items-center">
            {logo ? (
              <img src={logo} alt={brandName} className="h-8 w-auto" />
            ) : (
              <span className={`text-lg font-semibold ${variant === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {brandName}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${variant === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">
          {/* User Info */}
          {userInfo && (
            <div className={`p-4 border-b ${borderStyles[variant]}`}>
              <div className="flex items-center space-x-3">
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    variant === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <UserIcon />
                  </div>
                )}
                <div>
                  <div className={`font-medium ${variant === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {userInfo.name}
                  </div>
                  {userInfo.email && (
                    <div className={`text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {userInfo.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          {showSearch && (
            <div className="p-4 border-b ${borderStyles[variant]}">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full px-4 py-2 pl-10 rounded-lg border ${
                    variant === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-green-200`}
                />
                <SearchIcon />
              </form>
            </div>
          )}

          {/* Main Menu */}
          {menuItems.length > 0 && (
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                            variant === 'dark'
                              ? 'text-gray-300 hover:bg-gray-800'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="flex items-center">
                            {item.icon && <span className="mr-3">{item.icon}</span>}
                            {item.label}
                          </span>
                          {expandedItems.includes(item.label) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        </button>
                        {expandedItems.includes(item.label) && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => handleLinkClick(child.onClick)}
                                  className={`flex items-center px-3 py-2 rounded-lg ${
                                    isActive(child.href)
                                      ? activeStyles[variant]
                                      : variant === 'dark'
                                      ? 'text-gray-400 hover:bg-gray-800'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {child.icon && <span className="mr-3">{child.icon}</span>}
                                  {child.label}
                                  {child.badge && (
                                    <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => handleLinkClick(item.onClick)}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          isActive(item.href)
                            ? activeStyles[variant]
                            : variant === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* User Menu Items */}
          {userMenuItems.length > 0 && (
            <div className={`p-4 border-t ${borderStyles[variant]}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                variant === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Account
              </h3>
              <ul className="space-y-1">
                {userMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => handleLinkClick(item.onClick)}
                      className={`flex items-center px-3 py-2 rounded-lg ${
                        isActive(item.href)
                          ? activeStyles[variant]
                          : variant === 'dark'
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon && <span className="mr-3">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language & Currency Selectors */}
          {(showLanguageSelector || showCurrencySelector) && (
            <div className={`p-4 border-t ${borderStyles[variant]}`}>
              <div className="space-y-3">
                {showLanguageSelector && (
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                      variant === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Language
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${
                          variant === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span>
                          <span className="mr-2">
                            {languages.find(l => l.code === selectedLanguage)?.flag}
                          </span>
                          {languages.find(l => l.code === selectedLanguage)?.name}
                        </span>
                        <ChevronDownIcon />
                      </button>
                      {showLanguageDropdown && (
                        <div className={`absolute left-0 right-0 mt-1 rounded-lg border shadow-lg ${
                          variant === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}>
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguage(lang.code)
                                onLanguageChange?.(lang.code)
                                setShowLanguageDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 first:rounded-t-lg last:rounded-b-lg ${
                                variant === 'dark'
                                  ? 'hover:bg-gray-700 text-gray-300'
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <span className="mr-2">{lang.flag}</span>
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showCurrencySelector && (
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                      variant === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Currency
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${
                          variant === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span>
                          {currencies.find(c => c.code === selectedCurrency)?.symbol}{' '}
                          {currencies.find(c => c.code === selectedCurrency)?.code}
                        </span>
                        <ChevronDownIcon />
                      </button>
                      {showCurrencyDropdown && (
                        <div className={`absolute left-0 right-0 mt-1 rounded-lg border shadow-lg ${
                          variant === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}>
                          {currencies.map((currency) => (
                            <button
                              key={currency.code}
                              onClick={() => {
                                setSelectedCurrency(currency.code)
                                onCurrencyChange?.(currency.code)
                                setShowCurrencyDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 first:rounded-t-lg last:rounded-b-lg ${
                                variant === 'dark'
                                  ? 'hover:bg-gray-700 text-gray-300'
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {currency.symbol} {currency.code} - {currency.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${borderStyles[variant]}`}>
            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg ${
                variant === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <HomeIcon />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple Mobile Nav (for basic sites)
export function SimpleMobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <MobileNav
      isOpen={isOpen}
      onClose={onClose}
      menuItems={menuItems}
      brandName="Menu"
    />
  )
}

// E-commerce Mobile Nav
export function EcommerceMobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: NavItem[] = [
    {
      label: 'Shop',
      href: '/shop',
      children: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/new', badge: 'New' },
        { label: 'Best Sellers', href: '/bestsellers' },
        { label: 'Sale', href: '/sale', badge: '50% off' }
      ]
    },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/deals', badge: 'Hot' },
    { label: 'Support', href: '/support' }
  ]

  const userMenuItems: NavItem[] = [
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Settings', href: '/settings' }
  ]

  return (
    <MobileNav
      isOpen={isOpen}
      onClose={onClose}
      menuItems={menuItems}
      userMenuItems={userMenuItems}
      showSearch={true}
      showLanguageSelector={true}
      showCurrencySelector={true}
      brandName="ShopHub"
    />
  )
}

// Dashboard Mobile Nav
export function DashboardMobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Reports', href: '/reports' },
    {
      label: 'Settings',
      href: '#',
      children: [
        { label: 'Profile', href: '/settings/profile' },
        { label: 'Security', href: '/settings/security' },
        { label: 'Notifications', href: '/settings/notifications' },
        { label: 'Billing', href: '/settings/billing' }
      ]
    }
  ]

  const userInfo = {
    name: 'John Doe',
    email: 'john@example.com'
  }

  return (
    <MobileNav
      isOpen={isOpen}
      onClose={onClose}
      menuItems={menuItems}
      userInfo={userInfo}
      variant="dark"
      brandName="Dashboard"
    />
  )
}

// Bottom Sheet Mobile Nav (alternative style)
export function BottomSheetMobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' }
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu</h3>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}