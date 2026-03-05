'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('today')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for dashboard
  const stats = {
    revenue: {
      today: 12580.75,
      week: 84590.50,
      month: 352890.25,
      year: 4125890.75
    },
    orders: {
      today: 145,
      week: 987,
      month: 4123,
      year: 48975
    },
    customers: {
      today: 89,
      week: 654,
      month: 2789,
      year: 32456
    },
    products: {
      total: 156,
      lowStock: 12,
      outOfStock: 5,
      views: 45678
    }
  }

  const recentOrders = [
    { id: 'ORD-2024-001', customer: 'John Doe', amount: 156.75, status: 'delivered', date: '2024-01-15', items: 3 },
    { id: 'ORD-2024-002', customer: 'Jane Smith', amount: 89.97, status: 'processing', date: '2024-01-15', items: 2 },
    { id: 'ORD-2024-003', customer: 'Robert Johnson', amount: 234.50, status: 'shipped', date: '2024-01-14', items: 4 },
    { id: 'ORD-2024-004', customer: 'Sarah Williams', amount: 67.99, status: 'pending', date: '2024-01-14', items: 2 },
    { id: 'ORD-2024-005', customer: 'Michael Brown', amount: 145.50, status: 'cancelled', date: '2024-01-13', items: 3 },
  ]

  const topProducts = [
    { name: 'Organic Turmeric Powder', sales: 234, revenue: 5847.66, stock: 156, trend: '+12%' },
    { name: 'Ashwagandha Root', sales: 189, revenue: 6613.11, stock: 89, trend: '+8%' },
    { name: 'Moringa Leaf Powder', sales: 156, revenue: 4678.44, stock: 45, trend: '+15%' },
    { name: 'Holy Basil (Tulsi)', sales: 134, revenue: 2678.66, stock: 23, trend: '+5%' },
    { name: 'Triphala Powder', sales: 112, revenue: 3134.88, stock: 0, trend: '-2%' },
  ]

  const recentActivities = [
    { user: 'Hafiz Sajid', action: 'added new product', target: 'Organic Turmeric', time: '2 min ago', icon: '➕' },
    { user: 'System', action: 'processed order', target: '#ORD-2024-001', time: '5 min ago', icon: '⚙️' },
    { user: 'John Doe', action: 'registered as new customer', target: '', time: '15 min ago', icon: '👤' },
    { user: 'Ali', action: 'updated product stock', target: 'Ashwagandha', time: '1 hour ago', icon: '📦' },
    { user: 'System', action: 'sent newsletter', target: 'to 2,345 subscribers', time: '3 hours ago', icon: '📧' },
    { user: 'Fatima', action: 'responded to review', target: '5-star review', time: '5 hours ago', icon: '⭐' },
  ]

  const lowStockProducts = [
    { name: 'Holy Basil', stock: 3, threshold: 10, category: 'Herbs' },
    { name: 'Neem Powder', stock: 5, threshold: 10, category: 'Herbs' },
    { name: 'Brahmi Powder', stock: 7, threshold: 15, category: 'Brain Health' },
    { name: 'Guduchi', stock: 4, threshold: 10, category: 'Ayurvedic' },
    { name: 'Shilajit', stock: 2, threshold: 8, category: 'Supplements' },
  ]

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12500, 15000, 18500, 17000, 21000, 19500, 22500]
  }

  const categoryDistribution = [
    { category: 'Spices', count: 45, percentage: 29, color: 'from-orange-500 to-red-500' },
    { category: 'Adaptogens', count: 32, percentage: 20, color: 'from-purple-500 to-pink-500' },
    { category: 'Superfoods', count: 28, percentage: 18, color: 'from-green-500 to-emerald-500' },
    { category: 'Herbs', count: 35, percentage: 22, color: 'from-blue-500 to-cyan-500' },
    { category: 'Ayurvedic', count: 16, percentage: 11, color: 'from-yellow-500 to-amber-500' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-500/20 text-green-300'
      case 'processing': return 'bg-blue-500/20 text-blue-300'
      case 'shipped': return 'bg-purple-500/20 text-purple-300'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300'
      case 'cancelled': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <span className="text-4xl mr-3 animate-wave">👋</span>
            Welcome back, Hafiz Sajid!
          </h1>
          <p className="text-white/90 text-lg">
            Here's what's happening with your store today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/60 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatCurrency(stats.revenue[selectedTimeframe as keyof typeof stats.revenue])}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-400 text-sm flex items-center">
              <span className="mr-1">↑</span> 12.5%
            </span>
            <span className="text-white/40 text-xs">vs last {selectedTimeframe}</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/60 text-sm">Orders</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatNumber(stats.orders[selectedTimeframe as keyof typeof stats.orders])}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-400 text-sm flex items-center">
              <span className="mr-1">↑</span> 8.2%
            </span>
            <span className="text-white/40 text-xs">vs last {selectedTimeframe}</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/60 text-sm">New Customers</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatNumber(stats.customers[selectedTimeframe as keyof typeof stats.customers])}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-400 text-sm flex items-center">
              <span className="mr-1">↑</span> 5.7%
            </span>
            <span className="text-white/40 text-xs">vs last {selectedTimeframe}</span>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/60 text-sm">Products</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.products.total}</p>
              <p className="text-white/40 text-xs mt-1">{stats.products.views} views</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌿</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-sm">
              {stats.products.lowStock} low stock
            </span>
            <span className="text-red-400 text-xs">
              {stats.products.outOfStock} out
            </span>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-end space-x-2">
        {['today', 'week', 'month', 'year'].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              selectedTimeframe === timeframe
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
            <select className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 group-hover:from-purple-600 group-hover:to-pink-600 relative"
                     style={{ height: `${(salesData.values[index] / 25000) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(salesData.values[index])}
                  </div>
                </div>
                <span className="text-white/60 text-xs mt-2">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Category Distribution</h3>
          <div className="space-y-4">
            {categoryDistribution.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{cat.category}</span>
                  <span className="text-white font-semibold">{cat.count} items</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.customer}</p>
                    <p className="text-white/40 text-xs">{order.id} • {order.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{formatCurrency(order.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Top Products</h3>
            <Link href="/admin/products" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                    index === 0 ? 'from-yellow-500 to-amber-500' :
                    index === 1 ? 'from-gray-400 to-gray-500' :
                    index === 2 ? 'from-orange-500 to-red-500' :
                    'from-purple-500 to-pink-500'
                  } flex items-center justify-center text-white font-bold text-sm`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/40 text-xs">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{formatCurrency(product.revenue)}</p>
                  <p className={`text-xs ${product.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    {activity.target && <span className="text-purple-400">{activity.target}</span>}
                  </p>
                  <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <span className="text-yellow-400 mr-2">⚠️</span>
            Low Stock Alert
          </h3>
          
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.name} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white font-medium">{product.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.stock <= 3 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {product.stock} left
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">{product.category}</span>
                  <span className="text-white/60">Threshold: {product.threshold}</span>
                </div>
                <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${product.stock <= 3 ? 'bg-red-500' : 'bg-yellow-500'} rounded-full`}
                    style={{ width: `${(product.stock / product.threshold) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/admin/products?filter=low-stock" className="block mt-4 text-center text-purple-400 hover:text-purple-300 text-sm">
            View all low stock items →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Product', icon: '➕', color: 'from-green-500 to-emerald-500', href: '/admin/products/add' },
          { label: 'Create Order', icon: '📝', color: 'from-blue-500 to-cyan-500', href: '/admin/orders/new' },
          { label: 'Add User', icon: '👤', color: 'from-purple-500 to-pink-500', href: '/admin/users/add' },
          { label: 'View Reports', icon: '📊', color: 'from-yellow-500 to-orange-500', href: '/admin/analytics' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-all duration-300 group`}
          >
            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Admin Note */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          <span className="text-yellow-400 mr-1">👑</span>
          Logged in as: Hafiz Sajid Syed (sajid.syed@gmail.com) | 
          Last login: {new Date().toLocaleString()} | 
          IP: 192.168.1.1
        </p>
      </div>
    </div>
  )
}