'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Task assigned to you', message: 'Design homepage wireframes', time: '5 min ago', read: false },
    { id: 2, title: 'Project deadline', message: 'Website redesign due tomorrow', time: '1 hour ago', read: false },
    { id: 3, title: 'Comment on your task', message: 'John commented on your task', time: '3 hours ago', read: true },
    { id: 4, title: 'Task completed', message: 'Authentication API is done', time: '1 day ago', read: true }
  ])

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

  const navigation = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: '📊', color: 'from-blue-500 to-cyan-500' },
        { name: 'Projects', href: '/dashboard/projects', icon: '📁', color: 'from-purple-500 to-pink-500' },
        { name: 'Tasks', href: '/dashboard/tasks', icon: '✅', color: 'from-green-500 to-emerald-500' },
        { name: 'Calendar', href: '/dashboard/calendar', icon: '📅', color: 'from-orange-500 to-red-500' }
      ]
    },
    {
      title: 'Workspace',
      items: [
        { name: 'Team', href: '/dashboard/team', icon: '👥', color: 'from-indigo-500 to-purple-500' },
        { name: 'Files', href: '/dashboard/files', icon: '📁', color: 'from-yellow-500 to-amber-500' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📈', color: 'from-pink-500 to-rose-500' },
        { name: 'Reports', href: '/dashboard/reports', icon: '📊', color: 'from-teal-500 to-cyan-500' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', color: 'from-gray-500 to-slate-500' },
        { name: 'Support', href: '/dashboard/support', icon: '❓', color: 'from-emerald-500 to-teal-500' }
      ]
    }
  ]

  const quickActions = [
    { name: 'New Project', icon: '➕', href: '/dashboard/projects/new', color: 'from-purple-500 to-pink-500' },
    { name: 'New Task', icon: '✅', href: '/dashboard/tasks/new', color: 'from-green-500 to-emerald-500' },
    { name: 'Invite', icon: '👥', href: '/dashboard/team/invite', color: 'from-blue-500 to-cyan-500' }
  ]

  const recentProjects = [
    { id: 1, name: 'Website Redesign', progress: 75, color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Mobile App', progress: 45, color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Marketing Campaign', progress: 90, color: 'from-green-500 to-emerald-500' }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900/95 to-purple-900/95 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-in-out z-50 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl animate-pulse"></div>
              <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  H
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Herbal Heaven</h1>
              <p className="text-xs text-white/40">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                HS
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Hafiz Sajid</h3>
              <p className="text-white/40 text-sm">Administrator</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Projects</p>
              <p className="text-white font-bold">12</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Tasks</p>
              <p className="text-white font-bold">48</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/10">
          <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`bg-gradient-to-r ${action.color} rounded-lg p-3 text-center transition-all hover:scale-105`}
              >
                <span className="text-xl block mb-1">{action.icon}</span>
                <span className="text-white text-xs">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className={`text-xl ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                        {item.name === 'Tasks' && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            3
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Recent Projects */}
        <div className="p-4 border-t border-white/10">
          <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Recent Projects
          </h4>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-medium">{project.name}</span>
                  <span className="text-white/40 text-xs">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${project.color} rounded-full`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
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
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/10 backdrop-blur-lg border-b border-white/10">
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

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                <Link href="/dashboard" className="text-white/40 hover:text-white/60">
                  Dashboard
                </Link>
                {pathname !== '/dashboard' && (
                  <>
                    <span className="text-white/20">/</span>
                    <span className="text-white/80 capitalize">
                      {pathname.split('/').pop()?.replace(/-/g, ' ')}
                    </span>
                  </>
                )}
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
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-purple-500/5' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-white/60 text-xs mb-1">{notification.message}</p>
                          <p className="text-white/40 text-xs">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10 text-center">
                      <Link href="/dashboard/notifications" className="text-sm text-purple-400 hover:text-purple-300">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    HS
                  </div>
                  <span className="hidden lg:block text-white">Hafiz Sajid</span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>👤</span>
                      <span className="text-white">Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>⚙️</span>
                      <span className="text-white">Settings</span>
                    </Link>
                    <hr className="border-white/10" />
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors text-red-400"
                      onClick={() => {
                        setShowUserMenu(false)
                        // Handle logout
                      }}
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl z-40 hover:scale-110 transition-transform"
        >
          ☰
        </button>
      )}
    </div>
  )
}