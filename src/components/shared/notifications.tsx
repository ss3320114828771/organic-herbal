'use client'

import React from 'react'
import Link from 'next/link'

interface NotificationsProps {
  notifications?: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (notificationId: string) => void
  onClearAll?: () => void
  onView?: (notification: Notification) => void
  isLoading?: boolean
  maxHeight?: string
  showHeader?: boolean
  showFooter?: boolean
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'message'
  title: string
  message?: string
  timestamp: string
  read: boolean
  actionable?: boolean
  actionUrl?: string
  actionLabel?: string
  avatar?: string
  sender?: string
  metadata?: Record<string, any>
}

export default function Notifications({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onView,
  isLoading = false,
  maxHeight = '400px',
  showHeader = true,
  showFooter = true,
  emptyMessage = 'No notifications',
  className = '',
  itemClassName = ''
}: NotificationsProps) {
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all')

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'message': return '💬'
      default: return 'ℹ️'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'error': return 'bg-red-100 text-red-700'
      case 'message': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (onView) {
      onView(notification)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'unread' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            
            <div className="flex-1" />
            
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-green-600 hover:text-green-700"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notifications list */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-green-50' : ''
                } ${itemClassName}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  {/* Avatar/Icon */}
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt={notification.sender || 'Avatar'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-800">
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-2">
                      {notification.sender && (
                        <span className="text-xs text-gray-500">
                          From: {notification.sender}
                        </span>
                      )}
                      
                      {notification.actionable && notification.actionLabel && (
                        <span className="text-xs text-green-600 hover:text-green-700">
                          {notification.actionLabel} →
                        </span>
                      )}

                      <div className="flex-1" />

                      {/* Actions */}
                      {!notification.read && onMarkAsRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkAsRead(notification.id)
                          }}
                          className="text-xs text-gray-400 hover:text-green-600"
                        >
                          Mark read
                        </button>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(notification.id)
                          }}
                          className="text-xs text-gray-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {showFooter && notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 flex justify-between items-center text-xs">
          <Link 
            href="/notifications" 
            className="text-green-600 hover:text-green-700"
          >
            View all
          </Link>
          
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-gray-400 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple notification badge
export function NotificationBadge({ count, onClick }: { count: number; onClick?: () => void }) {
  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className="relative inline-flex"
    >
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  )
}

// Toast notification
export function Toast({
  notification,
  onClose,
  duration = 5000
}: {
  notification: Notification
  onClose: () => void
  duration?: number
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    message: 'bg-purple-50 border-purple-200'
  }

  return (
    <div className={`fixed top-4 right-4 w-80 p-4 rounded-lg border shadow-lg animate-slide-in ${typeStyles[notification.type]}`}>
      <div className="flex gap-3">
        <div className="text-xl">{getTypeIcon(notification.type)}</div>
        <div className="flex-1">
          <p className="font-medium text-gray-800">{notification.title}</p>
          {notification.message && (
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Dropdown notifications panel
export function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onViewAll
}: {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onViewAll?: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-green-600"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <Notifications
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            showFooter={true}
            maxHeight="300px"
          />
          {onViewAll && (
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => {
                  onViewAll()
                  setIsOpen(false)
                }}
                className="w-full text-center text-sm text-green-600 hover:text-green-700 py-1"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== ICON HELPER ====================

function getTypeIcon(type: string): string {
  switch (type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    case 'error': return '❌'
    case 'message': return '💬'
    default: return 'ℹ️'
  }
}

// ==================== HOOK ====================

// Custom hook for notifications
export function useNotifications(initialNotifications: Notification[] = []) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }
}