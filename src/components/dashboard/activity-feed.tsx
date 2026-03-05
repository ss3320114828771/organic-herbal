'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'order' | 'user' | 'product' | 'review' | 'payment'
  action: string
  description: string
  user: string
  timestamp: string
  status?: 'success' | 'pending' | 'failed'
  link?: string
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'order',
          action: 'New Order',
          description: 'Order #ORD-1234 was placed',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: 'success',
          link: '/admin/orders/1234'
        },
        {
          id: '2',
          type: 'user',
          action: 'New User',
          description: 'New customer registered',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          status: 'success',
          link: '/admin/users/2'
        },
        {
          id: '3',
          type: 'payment',
          action: 'Payment Received',
          description: 'Payment of $234.50 received',
          user: 'Ahmed Khan',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: 'success',
          link: '/admin/orders/1235'
        },
        {
          id: '4',
          type: 'product',
          action: 'Low Stock',
          description: 'Turmeric Powder is running low',
          user: 'System',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          status: 'pending',
          link: '/admin/products/1'
        },
        {
          id: '5',
          type: 'review',
          action: 'New Review',
          description: '5-star review received',
          user: 'Fatima Ali',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          status: 'success',
          link: '/admin/reviews/5'
        },
        {
          id: '6',
          type: 'order',
          action: 'Order Cancelled',
          description: 'Order #ORD-1236 was cancelled',
          user: 'Omar Hassan',
          timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
          status: 'failed',
          link: '/admin/orders/1236'
        },
        {
          id: '7',
          type: 'user',
          action: 'User Blocked',
          description: 'User account was blocked',
          user: 'Admin',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          status: 'failed',
          link: '/admin/users/7'
        },
        {
          id: '8',
          type: 'payment',
          action: 'Payment Failed',
          description: 'Payment for order #ORD-1237 failed',
          user: 'Ali Raza',
          timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
          status: 'failed',
          link: '/admin/orders/1237'
        }
      ]
      setActivities(mockActivities)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      order: '📦',
      user: '👤',
      product: '🌿',
      review: '⭐',
      payment: '💰'
    }
    return icons[type] || '📋'
  }

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return status ? colors[status] || colors.pending : ''
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          
          {/* Filter Buttons */}
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
              onClick={() => setFilter('order')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'order' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              
              {/* Activity Item */}
              <div className="flex gap-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getTypeIcon(activity.type)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.action}
                        {activity.status && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>👤 {activity.user}</span>
                        <span>•</span>
                        <span>🕐 {getTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>

                    {/* Action Link */}
                    {activity.link && (
                      <Link
                        href={activity.link}
                        className="text-green-600 hover:text-green-700 text-sm whitespace-nowrap"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/admin/activity"
          className="block text-center text-sm text-green-600 hover:text-green-700"
        >
          View All Activity
        </Link>
      </div>
    </div>
  )
}