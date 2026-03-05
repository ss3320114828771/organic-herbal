'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const adminMenuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: '🌿',
      color: 'from-green-500 to-emerald-500',
      count: 156
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: '📦',
      color: 'from-purple-500 to-pink-500',
      count: 2847
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: '👥',
      color: 'from-yellow-500 to-orange-500',
      count: 1432
    },
    {
      title: 'Categories',
      path: '/admin/categories',
      icon: '📑',
      color: 'from-indigo-500 to-purple-500',
      count: 12
    },
    {
      title: 'Reviews',
      path: '/admin/reviews',
      icon: '⭐',
      color: 'from-yellow-500 to-amber-500',
      count: 2341
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: '⚙️',
      color: 'from-gray-500 to-slate-500'
    }
  ]

  const quickActions = [
    { label: 'Add Product', icon: '➕', path: '/admin/products/add', color: 'green' },
    { label: 'New Order', icon: '📝', path: '/admin/orders/new', color: 'blue' },
    { label: 'Add User', icon: '👤', path: '/admin/users/add', color: 'purple' },
    { label: 'Export Data', icon: '📊', path: '/admin/export', color: 'orange' }
  ]

  const recentActivities = [
    { action: 'New order #ORD-2024-001', time: '2 minutes ago', icon: '🛒' },
    { action: 'Product added: Turmeric Powder', time: '15 minutes ago', icon: '🌿' },
    { action: 'New user registered: John Doe', time: '1 hour ago', icon: '👤' },
    { action: 'Order #ORD-2024-002 shipped', time: '3 hours ago', icon: '🚚' },
    { action: 'Review submitted: 5 stars', time: '5 hours ago', icon: '⭐' }
  ]

  const getPageTitle = () => {
    const currentItem = adminMenuItems.find(item => item.path === pathname)
    return currentItem?.title || 'Admin Dashboard'
  }

  const getCurrentIcon = () => {
    const currentItem = adminMenuItems.find(item => item.path === pathname)
    return currentItem?.icon || '⚡'
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      
      {/* Bismillah at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="text-center py-2">
          <p className="text-white/90 text-lg font-arabic animate-glow">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-[52px] left-0 h-[calc(100vh-52px)] w-72 bg-gradient-to-b from-gray-900/95 to-purple-900/95 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-in-out z-40 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Admin Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold transform rotate-3 hover:rotate-6 transition-transform">
                HS
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white/20"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Hafiz Sajid Syed</h3>
              <p className="text-white/60 text-sm flex items-center">
                <span className="text-yellow-400 mr-1">👑</span>
                Super Admin
              </p>
              <p className="text-white/40 text-xs mt-1">sajid.syed@gmail.com</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Products</p>
              <p className="text-white font-bold">156</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Orders</p>
              <p className="text-white font-bold">2.8k</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/10">
          <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                href={action.path}
                className={`bg-${action.color}-500/10 hover:bg-${action.color}-500/20 rounded-lg p-3 text-center transition-all group`}
              >
                <span className={`text-${action.color}-400 text-xl block group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </span>
                <span className={`text-${action.color}-400 text-xs mt-1 block`}>
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Main Menu
          </h4>
          <ul className="space-y-1">
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-xl ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.count && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Recent Activity */}
        <div className="p-4 border-t border-white/10 mt-4">
          <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Recent Activity</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </h4>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-white/40 text-lg">{activity.icon}</span>
                <div>
                  <p className="text-white/80 text-sm">{activity.action}</p>
                  <p className="text-white/40 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 mt-4">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all group">
            <span className="group-hover:scale-110 transition-transform">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-72' : 'ml-0'
        } pt-[52px]`}
      >
        {/* Top Bar */}
        <header className="fixed top-[52px] right-0 left-0 lg:left-72 bg-white/10 backdrop-blur-lg border-b border-white/10 z-30 transition-all duration-300"
          style={{
            left: isSidebarOpen ? '18rem' : '0'
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCurrentIcon()}</span>
                <h1 className="text-xl font-bold text-white">
                  {getPageTitle()}
                </h1>
              </div>

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                <Link href="/admin" className="text-white/40 hover:text-white/60">
                  Admin
                </Link>
                <span className="text-white/20">/</span>
                <span className="text-white/80">{getPageTitle()}</span>
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-white hover:bg-white/20 transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages */}
              <button className="relative p-2 rounded-xl text-white hover:bg-white/20 transition-colors">
                <span className="text-xl">💬</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>

              {/* Date/Time */}
              <div className="hidden lg:block text-white/60 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Admin Avatar */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                  HS
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 mt-[73px]">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-auto">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-white/40">
                © {new Date().getFullYear()} Herbal Heaven. All rights reserved.
              </p>
              <p className="text-white/40">
                Administered by <span className="text-yellow-400">Hafiz Sajid Syed</span>
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-white/40">v2.0.0</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span className="text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                  Live
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Action Button for Mobile */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl z-50 hover:scale-110 transition-transform"
        >
          ☰
        </button>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #a855f7; }
          to { text-shadow: 0 0 20px #fff, 0 0 30px #ec4899, 0 0 40px #a855f7; }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}