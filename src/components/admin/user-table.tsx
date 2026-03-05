'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer' | 'manager'
  status: 'active' | 'inactive' | 'blocked'
  orders: number
  spent: number
  joined: string
  lastLogin: string
  avatar?: string
}

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
        id: (i + 1).toString(),
        name: [
          'John Doe', 'Jane Smith', 'Ahmed Khan', 'Fatima Ali', 'Omar Hassan',
          'Aisha Rahman', 'Yusuf Ibrahim', 'Zainab Malik', 'Ali Raza', 'Sara Ahmed'
        ][i % 10],
        email: `user${i + 1}@example.com`,
        role: i === 0 ? 'admin' : i % 5 === 0 ? 'manager' : 'customer',
        status: i % 8 === 0 ? 'inactive' : i % 10 === 0 ? 'blocked' : 'active',
        orders: Math.floor(Math.random() * 50),
        spent: Math.floor(Math.random() * 5000) / 100,
        joined: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString().split('T')[0]
      }))
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      customer: 'bg-gray-100 text-gray-800'
    }
    return colors[role] || colors.customer
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.inactive
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <div>
            <h2 className="text-xl font-bold text-gray-800">Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total: {users.length} users
            </p>
          </div>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add User
          </button>
        </div>

        {/* Simple Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Orders</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Spent</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Last Login</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.slice(0, 10).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 font-medium">{user.orders}</td>
                <td className="p-4 font-medium text-green-600">{formatCurrency(user.spent)}</td>
                <td className="p-4 text-sm text-gray-600">{user.joined}</td>
                <td className="p-4 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Pagination */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing 1 to 10 of {users.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Previous
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}