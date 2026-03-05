'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  submenu?: MenuItem[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard'])

  // Menu items
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '/admin'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '📦',
      href: '/admin/orders',
      badge: 12
    },
    {
      id: 'products',
      label: 'Products',
      icon: '🌿',
      href: '/admin/products',
      submenu: [
        {
          id: 'all-products',
          label: 'All Products',
          icon: '📋',
          href: '/admin/products'
        },
        {
          id: 'add-product',
          label: 'Add New',
          icon: '➕',
          href: '/admin/products/add'
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: '📑',
          href: '/admin/categories'
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: '📊',
          href: '/admin/inventory'
        }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      href: '/admin/customers',
      badge: 5
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: '⭐',
      href: '/admin/reviews',
      badge: 3
    },
    {
      id: 'discounts',
      label: 'Discounts',
      icon: '🏷️',
      href: '/admin/discounts'
    },
    {
      id: 'content',
      label: 'Content',
      icon: '📝',
      href: '/admin/content',
      submenu: [
        {
          id: 'pages',
          label: 'Pages',
          icon: '📄',
          href: '/admin/pages'
        },
        {
          id: 'blog',
          label: 'Blog Posts',
          icon: '✍️',
          href: '/admin/blog'
        },
        {
          id: 'banners',
          label: 'Banners',
          icon: '🖼️',
          href: '/admin/banners'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '/admin/settings',
      submenu: [
        {
          id: 'general',
          label: 'General',
          icon: '🔧',
          href: '/admin/settings/general'
        },
        {
          id: 'payment',
          label: 'Payment',
          icon: '💳',
          href: '/admin/settings/payment'
        },
        {
          id: 'shipping',
          label: 'Shipping',
          icon: '🚚',
          href: '/admin/settings/shipping'
        },
        {
          id: 'users',
          label: 'Users',
          icon: '👤',
          href: '/admin/settings/users'
        }
      ]
    }
  ]

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm">{isCollapsed ? '→' : '←'}</span>
      </button>

      {/* Logo Area */}
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          {!isCollapsed && (
            <div>
              <span className="font-bold text-lg block">Admin Panel</span>
              <span className="text-xs text-gray-400">Hafiz Sajid Syed</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-2 overflow-y-auto max-h-[calc(100vh-80px)]">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.submenu ? (
                // Menu with submenu
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span className="text-xs">
                        {expandedMenus.includes(item.id) ? '▼' : '▶'}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {!isCollapsed && expandedMenus.includes(item.id) && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              isActive(subItem.href)
                                ? 'bg-green-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            <span className="text-sm">{subItem.icon}</span>
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular menu item
                <Link
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Stats (Collapsed) */}
        {isCollapsed && (
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <span className="text-xl block">📦</span>
                <span className="text-xs text-gray-400">12</span>
              </div>
              <div className="text-center">
                <span className="text-xl block">👥</span>
                <span className="text-xs text-gray-400">5</span>
              </div>
              <div className="text-center">
                <span className="text-xl block">⭐</span>
                <span className="text-xs text-gray-400">3</span>
              </div>
            </div>
          </div>
        )}

        {/* Admin Info (Expanded) */}
        {!isCollapsed && (
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Quick Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-lg block">📦</span>
                  <span className="text-xs text-gray-300">12 orders</span>
                </div>
                <div>
                  <span className="text-lg block">👥</span>
                  <span className="text-xs text-gray-300">5 customers</span>
                </div>
                <div>
                  <span className="text-lg block">⭐</span>
                  <span className="text-xs text-gray-300">3 reviews</span>
                </div>
                <div>
                  <span className="text-lg block">📉</span>
                  <span className="text-xs text-gray-300">$2.4k today</span>
                </div>
              </div>
            </div>

            {/* Store Link */}
            <Link
              href="/shop"
              className="mt-3 flex items-center gap-2 p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <span>🛍️</span>
              <span className="text-sm">View Store</span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => {/* Handle logout */}}
              className="mt-2 flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors w-full"
            >
              <span>🚪</span>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  )
}