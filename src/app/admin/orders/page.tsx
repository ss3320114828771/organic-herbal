'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for orders
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: 'JD'
      },
      date: '2024-01-15T10:30:00',
      total: 156.75,
      status: 'delivered',
      payment: 'paid',
      items: 3,
      products: [
        { name: 'Organic Turmeric Powder', quantity: 2, price: 24.99 },
        { name: 'Ashwagandha Root', quantity: 1, price: 34.99 },
        { name: 'Moringa Powder', quantity: 1, price: 29.99 }
      ],
      shipping: {
        address: '123 Main St, New York, NY 10001',
        method: 'Express Delivery'
      }
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        avatar: 'JS'
      },
      date: '2024-01-14T15:45:00',
      total: 89.97,
      status: 'processing',
      payment: 'paid',
      items: 2,
      products: [
        { name: 'Holy Basil (Tulsi)', quantity: 3, price: 19.99 },
        { name: 'Triphala Powder', quantity: 1, price: 27.99 }
      ],
      shipping: {
        address: '456 Oak Ave, Los Angeles, CA 90001',
        method: 'Standard Shipping'
      }
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Robert Johnson',
        email: 'robert.j@email.com',
        avatar: 'RJ'
      },
      date: '2024-01-14T09:15:00',
      total: 234.50,
      status: 'shipped',
      payment: 'paid',
      items: 4,
      products: [
        { name: 'Brahmi Powder', quantity: 2, price: 32.99 },
        { name: 'Organic Turmeric Powder', quantity: 3, price: 24.99 },
        { name: 'Ashwagandha Root', quantity: 2, price: 34.99 },
        { name: 'Moringa Powder', quantity: 1, price: 29.99 }
      ],
      shipping: {
        address: '789 Pine Rd, Chicago, IL 60601',
        method: 'Express Delivery'
      }
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Sarah Williams',
        email: 'sarah.w@email.com',
        avatar: 'SW'
      },
      date: '2024-01-13T14:20:00',
      total: 67.99,
      status: 'pending',
      payment: 'pending',
      items: 1,
      products: [
        { name: 'Organic Turmeric Powder', quantity: 1, price: 24.99 },
        { name: 'Ashwagandha Root', quantity: 1, price: 34.99 }
      ],
      shipping: {
        address: '321 Elm St, Houston, TX 77001',
        method: 'Standard Shipping'
      }
    },
    {
      id: 'ORD-2024-005',
      customer: {
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        avatar: 'MB'
      },
      date: '2024-01-13T11:30:00',
      total: 145.50,
      status: 'cancelled',
      payment: 'refunded',
      items: 3,
      products: [
        { name: 'Triphala Powder', quantity: 2, price: 27.99 },
        { name: 'Brahmi Powder', quantity: 1, price: 32.99 },
        { name: 'Holy Basil', quantity: 2, price: 19.99 }
      ],
      shipping: {
        address: '654 Maple Dr, Miami, FL 33101',
        method: 'Express Delivery'
      }
    },
    {
      id: 'ORD-2024-006',
      customer: {
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        avatar: 'ED'
      },
      date: '2024-01-12T16:45:00',
      total: 198.75,
      status: 'delivered',
      payment: 'paid',
      items: 4,
      products: [
        { name: 'Ashwagandha Root', quantity: 3, price: 34.99 },
        { name: 'Moringa Powder', quantity: 2, price: 29.99 },
        { name: 'Brahmi Powder', quantity: 1, price: 32.99 }
      ],
      shipping: {
        address: '987 Cedar Ln, Seattle, WA 98101',
        method: 'Standard Shipping'
      }
    },
    {
      id: 'ORD-2024-007',
      customer: {
        name: 'David Wilson',
        email: 'david.w@email.com',
        avatar: 'DW'
      },
      date: '2024-01-12T10:15:00',
      total: 324.75,
      status: 'processing',
      payment: 'paid',
      items: 5,
      products: [
        { name: 'Organic Turmeric', quantity: 4, price: 24.99 },
        { name: 'Ashwagandha', quantity: 3, price: 34.99 },
        { name: 'Triphala', quantity: 2, price: 27.99 },
        { name: 'Brahmi', quantity: 1, price: 32.99 },
        { name: 'Holy Basil', quantity: 2, price: 19.99 }
      ],
      shipping: {
        address: '147 Birch Way, Boston, MA 02101',
        method: 'Express Delivery'
      }
    },
    {
      id: 'ORD-2024-008',
      customer: {
        name: 'Lisa Anderson',
        email: 'lisa.a@email.com',
        avatar: 'LA'
      },
      date: '2024-01-11T13:20:00',
      total: 54.99,
      status: 'delivered',
      payment: 'paid',
      items: 2,
      products: [
        { name: 'Moringa Powder', quantity: 1, price: 29.99 },
        { name: 'Holy Basil', quantity: 1, price: 19.99 }
      ],
      shipping: {
        address: '753 Spruce Ct, Denver, CO 80201',
        method: 'Standard Shipping'
      }
    }
  ]

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    avgOrderValue: orders.reduce((sum, o) => sum + o.total, 0) / orders.length,
  }

  // Filter orders based on search, status, and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    let matchesDate = true
    const orderDate = new Date(order.date)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    if (dateRange === 'today') {
      matchesDate = orderDate.toDateString() === today.toDateString()
    } else if (dateRange === 'week') {
      matchesDate = orderDate >= weekAgo
    } else if (dateRange === 'month') {
      matchesDate = orderDate >= monthAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortBy === 'highest') {
      return b.total - a.total
    } else if (sortBy === 'lowest') {
      return a.total - b.total
    }
    return 0
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'shipped': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPaymentColor = (payment: string) => {
    switch(payment) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'refunded': return 'text-orange-400'
      default: return 'text-gray-400'
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

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on orders:`, selectedOrders)
    // Implement bulk actions
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
            <span className="mr-3">📦</span>
            Orders Management
          </h1>
          <p className="text-white/60">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="mr-2">📊</span>
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center">
            <span className="mr-2">+</span>
            New Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              <p className="text-green-400 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.revenue.toFixed(2)}</p>
              <p className="text-green-400 text-sm mt-2">↑ 8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Avg Order Value</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.avgOrderValue.toFixed(2)}</p>
              <p className="text-green-400 text-sm mt-2">↑ 5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.pending}</p>
              <p className="text-yellow-400 text-sm mt-2">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Pending', count: stats.pending, color: 'yellow', icon: '⏳' },
          { label: 'Processing', count: stats.processing, color: 'blue', icon: '⚙️' },
          { label: 'Shipped', count: stats.shipped, color: 'purple', icon: '🚚' },
          { label: 'Delivered', count: stats.delivered, color: 'green', icon: '✅' },
          { label: 'Cancelled', count: stats.cancelled, color: 'red', icon: '❌' },
        ].map((status) => (
          <button
            key={status.label}
            onClick={() => setStatusFilter(status.label.toLowerCase())}
            className={`bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-${status.color}-500/50 transition-all ${
              statusFilter === status.label.toLowerCase() ? `ring-2 ring-${status.color}-500` : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{status.icon}</span>
              <span className={`text-${status.color}-400 font-bold text-xl`}>{status.count}</span>
            </div>
            <p className={`text-${status.color}-400 text-sm mt-2`}>{status.label}</p>
          </button>
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
                placeholder="Search orders by ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
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
              <option value="highest">Highest Value</option>
              <option value="lowest">Lowest Value</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-sm">
                  {selectedOrders.length} selected
                </span>
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="process">Mark as Processing</option>
                  <option value="ship">Mark as Shipped</option>
                  <option value="deliver">Mark as Delivered</option>
                  <option value="cancel">Cancel Orders</option>
                  <option value="export">Export Selected</option>
                </select>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                📋 Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                📊 Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
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
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleAllOrders}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded border-white/30 bg-white/10"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-mono font-semibold">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {order.customer.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.customer.name}</p>
                          <p className="text-white/40 text-xs">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatDate(order.date)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{order.items} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getPaymentColor(order.payment)}>
                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                          👁️
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Update Status">
                          ✏️
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Print Invoice">
                          🖨️
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
              Showing {sortedOrders.length} of {orders.length} orders
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-white/40 text-sm">Order ID</span>
                  <p className="text-white font-mono font-bold">{order.id}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleOrderSelection(order.id)}
                  className="rounded border-white/30 bg-white/10"
                />
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {order.customer.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{order.customer.name}</p>
                  <p className="text-white/40 text-sm">{order.customer.email}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Date:</span>
                  <span className="text-white">{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Items:</span>
                  <span className="text-white">{order.items} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total:</span>
                  <span className="text-white font-bold text-xl">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Payment:</span>
                  <span className={getPaymentColor(order.payment)}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </span>
                </div>
              </div>

              {/* Products Summary */}
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-2">Products:</p>
                <div className="space-y-1">
                  {order.products.slice(0, 2).map((product, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/80">{product.name} x{product.quantity}</span>
                      <span className="text-white">${(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <p className="text-white/40 text-sm">+{order.products.length - 2} more items</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-4 p-3 bg-white/5 rounded-xl">
                <p className="text-white/60 text-xs mb-1">Shipping to:</p>
                <p className="text-white/80 text-sm">{order.shipping.address}</p>
                <p className="text-white/40 text-xs mt-1">{order.shipping.method}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                  👁️
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Update Status">
                  ✏️
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Print Invoice">
                  🖨️
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Contact Customer">
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Footer Note */}
      <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          <span className="text-yellow-400 mr-1">👑</span>
          Admin: Hafiz Sajid Syed | Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}