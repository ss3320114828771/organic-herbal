'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  brandName?: string
  menuItems?: SidebarItem[]
  bottomItems?: SidebarItem[]
  userInfo?: {
    name: string
    email?: string
    avatar?: string
    role?: string
  }
  showSearch?: boolean
  onSearch?: (query: string) => void
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  position?: 'left' | 'right'
  variant?: 'light' | 'dark' | 'colored'
  color?: string
  collapsible?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  className?: string
  overlay?: boolean
  closeOnRouteChange?: boolean
}

interface SidebarItem {
  id?: string
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: SidebarItem[]
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  divider?: boolean
  section?: string
}

export default function Sidebar({
  isOpen,
  onClose,
  logo,
  brandName = 'Sidebar',
  menuItems = [],
  bottomItems = [],
  userInfo,
  showSearch = false,
  onSearch,
  width = 'md',
  position = 'left',
  variant = 'light',
  color,
  collapsible = false,
  collapsed = false,
  onCollapse,
  className = '',
  overlay = true,
  closeOnRouteChange = true
}: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // Close sidebar on route change
  React.useEffect(() => {
    if (closeOnRouteChange && window.innerWidth < 1024) {
      onClose()
    }
  }, [pathname, closeOnRouteChange, onClose])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  React.useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Update internal collapsed state when prop changes
  React.useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

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
    }
  }

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapse?.(newCollapsed)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  // Width classes
  const widthClasses = {
    sm: 'w-64',
    md: 'w-72',
    lg: 'w-80',
    xl: 'w-96',
    full: 'w-full'
  }

  // Variant styles
  const variantStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-700',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
      active: 'bg-green-50 text-green-600',
      icon: 'text-gray-400'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-200',
      textMuted: 'text-gray-400',
      border: 'border-gray-800',
      hover: 'hover:bg-gray-800',
      active: 'bg-gray-800 text-green-400',
      icon: 'text-gray-500'
    },
    colored: {
      bg: color || 'bg-green-600',
      text: 'text-white',
      textMuted: 'text-white/70',
      border: 'border-white/20',
      hover: 'hover:bg-white/10',
      active: 'bg-white/20 text-white',
      icon: 'text-white/60'
    }
  }

  const styles = variantStyles[variant]

  // Icons
  const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  const ChevronRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  const CollapseLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  )

  const CollapseRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  )

  const renderMenuItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isItemActive = item.active || isActive(item.href)
    const isExpanded = expandedItems.includes(item.label)
    const paddingLeft = level > 0 ? `pl-${level * 4 + (isCollapsed ? 0 : 3)}` : ''

    if (item.divider) {
      return (
        <div
          key={item.id || `divider-${level}`}
          className={`my-2 border-t ${styles.border}`}
        />
      )
    }

    if (isCollapsed && !hasChildren) {
      return (
        <div key={item.href} className="relative group">
          <Link
            href={item.disabled ? '#' : item.href}
            onClick={(e) => {
              if (item.disabled) e.preventDefault()
              if (item.onClick) item.onClick()
              if (window.innerWidth < 1024) onClose()
            }}
            className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
              item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : isItemActive
                ? styles.active
                : `${styles.hover} ${styles.text}`
            }`}
          >
            <span className="text-xl">{item.icon}</span>
          </Link>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
            {item.label}
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      )
    }

    return (
      <div key={item.href} className="relative">
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpand(item.label)}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : styles.hover
              } ${paddingLeft}`}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-3 text-xl">{item.icon}</span>}
                {!isCollapsed && (
                  <>
                    <span className={styles.text}>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                        variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </span>
              {!isCollapsed && (
                <span className={styles.icon}>
                  {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </span>
              )}
            </button>

            {isExpanded && !isCollapsed && (
              <div className="mt-1 space-y-1">
                {item.children?.map((child, index) => renderMenuItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.disabled ? '#' : item.href}
            onClick={(e) => {
              if (item.disabled) e.preventDefault()
              if (item.onClick) item.onClick()
              if (window.innerWidth < 1024) onClose()
            }}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : isItemActive
                ? styles.active
                : styles.hover
            } ${paddingLeft}`}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-3 text-xl">{item.icon}</span>}
              {!isCollapsed && (
                <>
                  <span className={styles.text}>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </span>
          </Link>
        )}
      </div>
    )
  }

  // Group items by section
  const groupedItems = menuItems.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    const section = item.section || 'default'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {})

  const sections = Object.entries(groupedItems)

  return (
    <>
      {/* Overlay */}
      {overlay && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full ${styles.bg} shadow-xl z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
        } ${isCollapsed ? 'w-16' : widthClasses[width]} ${className}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${styles.border}`}>
          <div className="flex items-center">
            {logo ? (
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 32}
                height={logo.height || 32}
                className="h-8 w-auto"
              />
            ) : (
              !isCollapsed && <span className={`font-semibold ${styles.text}`}>{brandName}</span>
            )}
            {isCollapsed && logo && (
              <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {collapsible && (
              <button
                onClick={toggleCollapse}
                className={`p-1 rounded-lg ${styles.hover} ${styles.icon}`}
              >
                {position === 'left' ? <CollapseLeftIcon /> : <CollapseRightIcon />}
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1 rounded-lg lg:hidden ${styles.hover} ${styles.icon}`}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Search */}
        {showSearch && !isCollapsed && (
          <div className="p-4 border-b ${styles.border}">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full px-3 py-2 pl-8 text-sm rounded-lg border ${
                  variant === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : variant === 'colored'
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/60'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-200`}
              />
              <SearchIcon />
            </form>
          </div>
        )}

        {/* User Info */}
        {userInfo && !isCollapsed && (
          <div className={`p-4 border-b ${styles.border}`}>
            <div className="flex items-center space-x-3">
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  variant === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <span className="text-lg font-semibold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${styles.text}`}>
                  {userInfo.name}
                </div>
                {userInfo.email && (
                  <div className={`text-xs truncate ${styles.textMuted}`}>
                    {userInfo.email}
                  </div>
                )}
                {userInfo.role && (
                  <div className={`text-xs mt-1 ${styles.textMuted}`}>
                    {userInfo.role}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          <div className="p-3 space-y-2">
            {sections.map(([section, items]) => (
              <div key={section}>
                {section !== 'default' && !isCollapsed && (
                  <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider ${styles.textMuted} mb-2`}>
                    {section}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map(item => renderMenuItem(item))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Items */}
          {bottomItems.length > 0 && (
            <div className={`p-3 border-t ${styles.border} mt-4`}>
              <div className="space-y-1">
                {bottomItems.map(item => renderMenuItem(item))}
              </div>
            </div>
          )}
        </div>

        {/* Collapsed User Indicator */}
        {isCollapsed && userInfo && (
          <div className={`absolute bottom-0 left-0 right-0 p-3 border-t ${styles.border}`}>
            <div className="relative group">
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                variant === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <span className="text-lg font-semibold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {userInfo.name}
                {userInfo.role && <span className="block text-xs text-gray-400">{userInfo.role}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Dashboard Sidebar
export function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
      section: 'Main'
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <AnalyticsIcon />,
      section: 'Main'
    },
    {
      label: 'Products',
      href: '/products',
      icon: <ProductsIcon />,
      badge: 12,
      children: [
        { label: 'All Products', href: '/products' },
        { label: 'Add New', href: '/products/add' },
        { label: 'Categories', href: '/categories' },
        { label: 'Inventory', href: '/inventory' }
      ],
      section: 'Management'
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: <OrdersIcon />,
      badge: 5,
      children: [
        { label: 'All Orders', href: '/orders' },
        { label: 'Pending', href: '/orders/pending', badge: 3 },
        { label: 'Completed', href: '/orders/completed' },
        { label: 'Returns', href: '/orders/returns' }
      ],
      section: 'Management'
    },
    {
      label: 'Customers',
      href: '/customers',
      icon: <CustomersIcon />,
      section: 'Management'
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <ReportsIcon />,
      children: [
        { label: 'Sales Report', href: '/reports/sales' },
        { label: 'Customer Report', href: '/reports/customers' },
        { label: 'Inventory Report', href: '/reports/inventory' }
      ],
      section: 'Analytics'
    }
  ]

  const bottomItems: SidebarItem[] = [
    {
      label: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    },
    {
      label: 'Logout',
      href: '/logout',
      icon: <LogoutIcon />
    }
  ]

  const userInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Administrator',
    avatar: '/avatars/john.jpg'
  }

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      brandName="Dashboard"
      menuItems={menuItems}
      bottomItems={bottomItems}
      userInfo={userInfo}
      showSearch={true}
      variant="light"
      collapsible={true}
      width="md"
    />
  )
}

// Dark Admin Sidebar
export function DarkAdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
    { label: 'Users', href: '/admin/users', icon: <UsersIcon />, badge: 3 },
    { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> }
  ]

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      brandName="Admin"
      menuItems={menuItems}
      variant="dark"
      width="sm"
      position="left"
    />
  )
}

// E-commerce Sidebar
export function EcommerceSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems: SidebarItem[] = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Shop', href: '/shop', icon: <ShopIcon /> },
    {
      label: 'Categories',
      href: '#',
      icon: <CategoriesIcon />,
      children: [
        { label: 'Electronics', href: '/category/electronics' },
        { label: 'Fashion', href: '/category/fashion' },
        { label: 'Home & Garden', href: '/category/home' },
        { label: 'Sports', href: '/category/sports' }
      ]
    },
    { label: 'Deals', href: '/deals', icon: <DealsIcon />, badge: 'Hot' },
    { label: 'Wishlist', href: '/wishlist', icon: <WishlistIcon /> }
  ]

  const bottomItems: SidebarItem[] = [
    { label: 'Account', href: '/account', icon: <UsersIcon /> },
    { label: 'Help', href: '/help', icon: <HelpIcon /> }
  ]

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      brandName="ShopHub"
      menuItems={menuItems}
      bottomItems={bottomItems}
      variant="light"
      width="sm"
      position="left"
    />
  )
}

// ==================== ICON COMPONENTS ====================

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function AnalyticsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function CustomersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function ReportsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function CategoriesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function DealsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  )
}

function WishlistIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}