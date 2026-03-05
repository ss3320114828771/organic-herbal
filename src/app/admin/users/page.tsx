'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for users
  const users = [
    {
      id: 'USR-001',
      name: 'Hafiz Sajid Syed',
      email: 'sajid.syed@gmail.com',
      role: 'admin',
      status: 'active',
      avatar: 'HS',
      joined: '2024-01-01',
      lastActive: '2024-01-15T10:30:00',
      orders: 156,
      totalSpent: 4589.75,
      reviews: 45,
      wishlist: 23,
      phone: '+1 (555) 123-4567',
      address: '123 Admin St, New York, NY 10001',
      permissions: ['all'],
      notes: 'Founder and Chief Administrator',
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 'USR-002',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'customer',
      status: 'active',
      avatar: 'JD',
      joined: '2024-01-10',
      lastActive: '2024-01-15T09:15:00',
      orders: 12,
      totalSpent: 456.75,
      reviews: 8,
      wishlist: 15,
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      permissions: ['read'],
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR-003',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      role: 'customer',
      status: 'active',
      avatar: 'JS',
      joined: '2024-01-08',
      lastActive: '2024-01-14T16:45:00',
      orders: 8,
      totalSpent: 324.50,
      reviews: 12,
      wishlist: 9,
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, Chicago, IL 60601',
      permissions: ['read'],
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR-004',
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      role: 'moderator',
      status: 'active',
      avatar: 'RJ',
      joined: '2024-01-05',
      lastActive: '2024-01-15T08:30:00',
      orders: 23,
      totalSpent: 890.25,
      reviews: 34,
      wishlist: 12,
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Houston, TX 77001',
      permissions: ['read', 'write', 'moderate'],
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 'USR-005',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      role: 'customer',
      status: 'inactive',
      avatar: 'SW',
      joined: '2024-01-03',
      lastActive: '2024-01-10T11:20:00',
      orders: 3,
      totalSpent: 89.97,
      reviews: 2,
      wishlist: 5,
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, Miami, FL 33101',
      permissions: ['read'],
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR-006',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      role: 'customer',
      status: 'suspended',
      avatar: 'MB',
      joined: '2024-01-02',
      lastActive: '2024-01-08T14:30:00',
      orders: 1,
      totalSpent: 34.99,
      reviews: 0,
      wishlist: 3,
      phone: '+1 (555) 678-9012',
      address: '987 Cedar Ln, Seattle, WA 98101',
      permissions: [],
      emailVerified: false,
      twoFactorEnabled: false,
      suspensionReason: 'Multiple payment failures'
    },
    {
      id: 'USR-007',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      role: 'customer',
      status: 'active',
      avatar: 'ED',
      joined: '2024-01-12',
      lastActive: '2024-01-15T12:45:00',
      orders: 5,
      totalSpent: 187.45,
      reviews: 6,
      wishlist: 8,
      phone: '+1 (555) 789-0123',
      address: '147 Birch Way, Boston, MA 02101',
      permissions: ['read'],
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR-008',
      name: 'David Wilson',
      email: 'david.w@email.com',
      role: 'moderator',
      status: 'active',
      avatar: 'DW',
      joined: '2024-01-11',
      lastActive: '2024-01-14T09:30:00',
      orders: 15,
      totalSpent: 567.80,
      reviews: 21,
      wishlist: 14,
      phone: '+1 (555) 890-1234',
      address: '753 Spruce Ct, Denver, CO 80201',
      permissions: ['read', 'write', 'moderate'],
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 'USR-009',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      role: 'customer',
      status: 'active',
      avatar: 'LA',
      joined: '2024-01-09',
      lastActive: '2024-01-13T15:15:00',
      orders: 7,
      totalSpent: 234.93,
      reviews: 9,
      wishlist: 11,
      phone: '+1 (555) 901-2345',
      address: '258 Willow Rd, Portland, OR 97201',
      permissions: ['read'],
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR-010',
      name: 'James Taylor',
      email: 'james.t@email.com',
      role: 'customer',
      status: 'inactive',
      avatar: 'JT',
      joined: '2024-01-07',
      lastActive: '2024-01-09T10:00:00',
      orders: 0,
      totalSpent: 0,
      reviews: 0,
      wishlist: 2,
      phone: '+1 (555) 012-3456',
      address: '369 Ash Ave, Phoenix, AZ 85001',
      permissions: [],
      emailVerified: false,
      twoFactorEnabled: false
    }
  ]

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    moderators: users.filter(u => u.role === 'moderator').length,
    customers: users.filter(u => u.role === 'customer').length,
    totalOrders: users.reduce((sum, u) => sum + u.orders, 0),
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    verifiedEmails: users.filter(u => u.emailVerified).length,
    twoFactorEnabled: users.filter(u => u.twoFactorEnabled).length,
    averageOrdersPerUser: (users.reduce((sum, u) => sum + u.orders, 0) / users.length).toFixed(1)
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.joined).getTime() - new Date(a.joined).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.joined).getTime() - new Date(b.joined).getTime()
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name)
    } else if (sortBy === 'orders-high') {
      return b.orders - a.orders
    } else if (sortBy === 'orders-low') {
      return a.orders - b.orders
    } else if (sortBy === 'spent-high') {
      return b.totalSpent - a.totalSpent
    } else if (sortBy === 'spent-low') {
      return a.totalSpent - b.totalSpent
    } else if (sortBy === 'last-active') {
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    }
    return 0
  })

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'moderator': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'customer': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'inactive': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'suspended': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return '✅'
      case 'inactive': return '💤'
      case 'suspended': return '🚫'
      default: return '❓'
    }
  }

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return '👑'
      case 'moderator': return '🛡️'
      case 'customer': return '👤'
      default: return '❓'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on users:`, selectedUsers)
    // Implement bulk actions
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Deleting user:', userId)
      // Implement delete
    }
  }

  const handleSuspendUser = (userId: string) => {
    const reason = prompt('Enter suspension reason:')
    if (reason) {
      console.log('Suspending user:', userId, 'Reason:', reason)
      // Implement suspend
    }
  }

  const handleImpersonateUser = (user: any) => {
    console.log('Impersonating user:', user.email)
    // Implement impersonation
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      
      {/* Bismillah at Top */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20">
          <p className="text-white text-2xl font-arabic animate-glow">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">👥</span>
            Users Management
          </h1>
          <p className="text-white/60">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center"
          >
            <span className="mr-2">+</span>
            Add New User
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="mr-2">📥</span>
            Import
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="mr-2">📤</span>
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              <p className="text-green-400 text-sm mt-2">
                <span className="text-green-400">↑</span> +{stats.active} active
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-blue-400 text-sm mt-2">
                {stats.totalOrders} orders
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Avg Orders/User</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.averageOrdersPerUser}</p>
              <p className="text-purple-400 text-sm mt-2">
                {stats.verifiedEmails} verified emails
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Security</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.twoFactorEnabled}</p>
              <p className="text-yellow-400 text-sm mt-2">
                2FA enabled users
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Admins', count: stats.admins, color: 'purple', icon: '👑' },
          { label: 'Moderators', count: stats.moderators, color: 'blue', icon: '🛡️' },
          { label: 'Customers', count: stats.customers, color: 'green', icon: '👤' },
          { label: 'Active', count: stats.active, color: 'green', icon: '✅' },
          { label: 'Inactive', count: stats.inactive, color: 'yellow', icon: '💤' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-500/10 backdrop-blur-lg rounded-xl p-4 border border-${stat.color}-500/20`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-${stat.color}-400 font-bold text-xl`}>{stat.count}</span>
            </div>
            <p className={`text-${stat.color}-400 text-sm mt-2`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search users by name, email, ID or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
              <option value="customer">Customers</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="orders-high">Most Orders</option>
              <option value="orders-low">Least Orders</option>
              <option value="spent-high">Highest Spent</option>
              <option value="spent-low">Lowest Spent</option>
              <option value="last-active">Last Active</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-sm">
                  {selectedUsers.length} selected
                </span>
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="activate">Activate Users</option>
                  <option value="deactivate">Deactivate Users</option>
                  <option value="suspend">Suspend Users</option>
                  <option value="make-moderator">Make Moderator</option>
                  <option value="make-customer">Make Customer</option>
                  <option value="export">Export Selected</option>
                  <option value="delete">Delete Selected</option>
                </select>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                  viewMode === 'table' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="mr-1">📋</span> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="mr-1">📊</span> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllUsers}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Orders</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Spent</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Security</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-white/30 bg-white/10"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-white/40 text-xs">{user.id}</p>
                          {user.id === 'USR-001' && (
                            <p className="text-yellow-400 text-xs flex items-center mt-1">
                              <span className="mr-1">👑</span> Administrator
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{user.email}</p>
                      <p className="text-white/40 text-xs">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 w-fit ${getRoleColor(user.role)}`}>
                        <span>{getRoleIcon(user.role)}</span>
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 w-fit ${getStatusColor(user.status)}`}>
                        <span>{getStatusIcon(user.status)}</span>
                        <span className="capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{new Date(user.joined).toLocaleDateString()}</p>
                      <p className="text-white/40 text-xs">
                        Last: {new Date(user.lastActive).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{user.orders}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">${user.totalSpent.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.emailVerified ? (
                          <span className="text-green-400" title="Email Verified">📧✅</span>
                        ) : (
                          <span className="text-yellow-400" title="Email Not Verified">📧❌</span>
                        )}
                        {user.twoFactorEnabled ? (
                          <span className="text-green-400" title="2FA Enabled">🔒✅</span>
                        ) : (
                          <span className="text-yellow-400" title="2FA Disabled">🔒❌</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleImpersonateUser(user)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Impersonate"
                        >
                          🎭
                        </button>
                        {user.status !== 'suspended' && (
                          <button 
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                            title="Suspend User"
                          >
                            ⚠️
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-white/5 flex justify-between items-center">
            <p className="text-white/60 text-sm">
              Showing {sortedUsers.length} of {users.length} users
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Previous
              </button>
              <span className="px-3 py-1 bg-purple-500 text-white rounded-lg">1</span>
              <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
            >
              {/* User Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.avatar}
                  </div>
                  {user.id === 'USR-001' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm">
                      👑
                    </div>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="rounded border-white/30 bg-white/10"
                />
              </div>

              {/* User Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                <p className="text-white/40 text-sm mb-2">{user.email}</p>
                <p className="text-white/60 text-xs">{user.phone}</p>
              </div>

              {/* Role and Status */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                  <span>{getRoleIcon(user.role)}</span>
                  <span className="capitalize">{user.role}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                  <span>{getStatusIcon(user.status)}</span>
                  <span className="capitalize">{user.status}</span>
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-white/40 text-xs">Orders</p>
                  <p className="text-white font-bold text-xl">{user.orders}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Spent</p>
                  <p className="text-white font-bold text-xl">${user.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              {/* Reviews and Wishlist */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-white">{user.reviews} reviews</span>
                </div>
                <div className="flex items-center">
                  <span className="text-pink-400 mr-1">❤️</span>
                  <span className="text-white">{user.wishlist} items</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex space-x-2 mb-4">
                {user.emailVerified ? (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    Email Verified
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                    Email Unverified
                  </span>
                )}
                {user.twoFactorEnabled && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    2FA Enabled
                  </span>
                )}
              </div>

              {/* Join Date */}
              <div className="text-white/40 text-xs mb-4">
                Joined: {new Date(user.joined).toLocaleDateString()}
                <br />
                Last Active: {new Date(user.lastActive).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setEditingUser(user)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Edit User"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleImpersonateUser(user)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Impersonate"
                >
                  🎭
                </button>
                <button 
                  onClick={() => handleSuspendUser(user.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Suspend User"
                >
                  ⚠️
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Delete User"
                >
                  🗑️
                </button>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="View Details"
                >
                  👁️
                </button>
              </div>

              {/* Suspension Reason */}
              {user.status === 'suspended' && user.suspensionReason && (
                <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
                  <p className="text-red-300 text-xs">
                    <span className="font-bold">Reason:</span> {user.suspensionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingUser(null)
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* User Form */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter full name"
                    defaultValue={editingUser?.name}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="user@email.com"
                    defaultValue={editingUser?.email}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="+1 (555) 000-0000"
                    defaultValue={editingUser?.phone}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Role</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="customer">Customer</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Status</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Address</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter address"
                    defaultValue={editingUser?.address}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" defaultChecked={editingUser?.emailVerified} />
                    <span className="text-white/80 text-sm">Email Verified</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" defaultChecked={editingUser?.twoFactorEnabled} />
                    <span className="text-white/80 text-sm">2FA Enabled</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Permissions</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Read', 'Write', 'Delete', 'Moderate', 'Manage Users', 'Manage Products', 'Manage Orders', 'View Reports', 'Export Data'].map((perm) => (
                  <label key={perm} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" />
                    <span className="text-white/80 text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-white/80 text-sm mb-2">Admin Notes</label>
              <textarea
                rows={2}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                placeholder="Internal notes about this user"
                defaultValue={editingUser?.notes}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingUser(null)
                }}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-colors">
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer Note */}
      <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          <span className="text-yellow-400 mr-1">👑</span>
          Admin: Hafiz Sajid Syed (sajid.syed@gmail.com) | Total Users: {users.length} | 
          Active: {stats.active} | Inactive: {stats.inactive} | Suspended: {stats.suspended}
        </p>
      </div>
    </div>
  )
}