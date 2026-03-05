'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock analytics data
  const analytics = {
    revenue: {
      today: 12580.75,
      yesterday: 11230.50,
      week: 84590.50,
      month: 352890.25,
      year: 4125890.75,
      growth: 12.5,
      projected: 4850000.00
    },
    orders: {
      today: 145,
      yesterday: 132,
      week: 987,
      month: 4123,
      year: 48975,
      growth: 8.3,
      average: 84.50
    },
    customers: {
      total: 32456,
      new: {
        today: 89,
        week: 654,
        month: 2789,
        year: 12453
      },
      returning: {
        today: 56,
        week: 432,
        month: 1897,
        year: 8765
      },
      growth: 15.7,
      lifetime: 189.75
    },
    products: {
      total: 156,
      views: 45678,
      viewsGrowth: 23.4,
      topSelling: [
        { name: 'Organic Turmeric Powder', sales: 1234, revenue: 30846.66, growth: '+12%' },
        { name: 'Ashwagandha Root', sales: 987, revenue: 34523.13, growth: '+8%' },
        { name: 'Moringa Leaf Powder', sales: 856, revenue: 25677.44, growth: '+15%' },
        { name: 'Holy Basil (Tulsi)', sales: 734, revenue: 14682.66, growth: '+5%' },
        { name: 'Triphala Powder', sales: 612, revenue: 17129.88, growth: '-2%' }
      ],
      lowStock: [
        { name: 'Holy Basil', stock: 3, threshold: 10 },
        { name: 'Neem Powder', stock: 5, threshold: 10 },
        { name: 'Brahmi Powder', stock: 7, threshold: 15 }
      ]
    },
    traffic: {
      visitors: 45678,
      pageViews: 98765,
      bounceRate: 32.5,
      avgSession: '4m 32s',
      sources: [
        { source: 'Direct', percentage: 35, value: 15987 },
        { source: 'Organic Search', percentage: 28, value: 12790 },
        { source: 'Social Media', percentage: 22, value: 10049 },
        { source: 'Email', percentage: 10, value: 4568 },
        { source: 'Referral', percentage: 5, value: 2284 }
      ]
    },
    conversion: {
      rate: 3.2,
      cart: 65.4,
      checkout: 78.9,
      purchase: 82.3,
      funnel: [
        { stage: 'Visitors', count: 45678, dropoff: 0 },
        { stage: 'Product Views', count: 32456, dropoff: 28.9 },
        { stage: 'Add to Cart', count: 18765, dropoff: 42.2 },
        { stage: 'Checkout', count: 12345, dropoff: 34.2 },
        { stage: 'Purchase', count: 9876, dropoff: 20.0 }
      ]
    },
    salesData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [45000, 52000, 48000, 58000, 62000, 68000, 72000, 78000, 82000, 88000, 94000, 12580],
      previous: [42000, 48000, 45000, 52000, 56000, 61000, 65000, 70000, 74000, 79000, 85000, 98000]
    },
    categoryData: [
      { category: 'Spices', sales: 125000, percentage: 28, color: 'from-orange-500 to-red-500' },
      { category: 'Adaptogens', sales: 98000, percentage: 22, color: 'from-purple-500 to-pink-500' },
      { category: 'Superfoods', sales: 87000, percentage: 19, color: 'from-green-500 to-emerald-500' },
      { category: 'Herbs', sales: 76000, percentage: 17, color: 'from-blue-500 to-cyan-500' },
      { category: 'Ayurvedic', sales: 62000, percentage: 14, color: 'from-yellow-500 to-amber-500' }
    ],
    geoData: [
      { country: 'United States', sales: 245000, percentage: 55 },
      { country: 'Canada', sales: 67000, percentage: 15 },
      { country: 'United Kingdom', sales: 45000, percentage: 10 },
      { country: 'Australia', sales: 34000, percentage: 8 },
      { country: 'Germany', sales: 28000, percentage: 6 },
      { country: 'Others', sales: 27000, percentage: 6 }
    ]
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getMetricValue = () => {
    switch(selectedMetric) {
      case 'revenue':
        return formatCurrency(analytics.revenue.month)
      case 'orders':
        return formatNumber(analytics.orders.month)
      case 'customers':
        return formatNumber(analytics.customers.new.month)
      case 'conversion':
        return formatPercentage(analytics.conversion.rate)
      default:
        return formatCurrency(analytics.revenue.month)
    }
  }

  const getMetricGrowth = () => {
    switch(selectedMetric) {
      case 'revenue':
        return analytics.revenue.growth
      case 'orders':
        return analytics.orders.growth
      case 'customers':
        return analytics.customers.growth
      case 'conversion':
        return 0.5
      default:
        return analytics.revenue.growth
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-white/60">
            Comprehensive insights into your store's performance
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-xl transition-all ${
              showComparison 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {showComparison ? 'Hide Comparison' : 'Compare Period'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className={`bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 ${
            selectedMetric === 'revenue' ? 'ring-4 ring-white/30' : ''
          }`}
          onClick={() => setSelectedMetric('revenue')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(analytics.revenue.month)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-300 text-sm flex items-center">
              <span className="mr-1">↑</span> {analytics.revenue.growth}%
            </span>
            <span className="text-white/60 text-xs">vs last {timeframe}</span>
          </div>
          {showComparison && (
            <div className="mt-2 pt-2 border-t border-white/20 text-sm">
              <span className="text-white/60">Previous: </span>
              <span className="font-semibold">{formatCurrency(analytics.revenue.month * 0.89)}</span>
            </div>
          )}
        </div>

        <div 
          className={`bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 ${
            selectedMetric === 'orders' ? 'ring-4 ring-white/30' : ''
          }`}
          onClick={() => setSelectedMetric('orders')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Orders</p>
              <p className="text-3xl font-bold mt-1">{formatNumber(analytics.orders.month)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-300 text-sm flex items-center">
              <span className="mr-1">↑</span> {analytics.orders.growth}%
            </span>
            <span className="text-white/60 text-xs">vs last {timeframe}</span>
          </div>
          {showComparison && (
            <div className="mt-2 pt-2 border-t border-white/20 text-sm">
              <span className="text-white/60">Previous: </span>
              <span className="font-semibold">{formatNumber(analytics.orders.month * 0.92)}</span>
            </div>
          )}
        </div>

        <div 
          className={`bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 ${
            selectedMetric === 'customers' ? 'ring-4 ring-white/30' : ''
          }`}
          onClick={() => setSelectedMetric('customers')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">New Customers</p>
              <p className="text-3xl font-bold mt-1">{formatNumber(analytics.customers.new.month)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-300 text-sm flex items-center">
              <span className="mr-1">↑</span> {analytics.customers.growth}%
            </span>
            <span className="text-white/60 text-xs">vs last {timeframe}</span>
          </div>
          {showComparison && (
            <div className="mt-2 pt-2 border-t border-white/20 text-sm">
              <span className="text-white/60">Previous: </span>
              <span className="font-semibold">{formatNumber(analytics.customers.new.month * 0.85)}</span>
            </div>
          )}
        </div>

        <div 
          className={`bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 ${
            selectedMetric === 'conversion' ? 'ring-4 ring-white/30' : ''
          }`}
          onClick={() => setSelectedMetric('conversion')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold mt-1">{analytics.conversion.rate}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-300 text-sm flex items-center">
              <span className="mr-1">↑</span> 0.5%
            </span>
            <span className="text-white/60 text-xs">vs last {timeframe}</span>
          </div>
          {showComparison && (
            <div className="mt-2 pt-2 border-t border-white/20 text-sm">
              <span className="text-white/60">Previous: </span>
              <span className="font-semibold">2.9%</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Metric Highlight */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Selected Metric</p>
            <p className="text-4xl font-bold mt-1">{getMetricValue()}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Growth</p>
            <p className={`text-2xl font-bold ${getMetricGrowth() >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {getMetricGrowth() >= 0 ? '↑' : '↓'} {Math.abs(getMetricGrowth())}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-white/20">Daily</button>
              <button className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm">Monthly</button>
              <button className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-white/20">Yearly</button>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.salesData.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 group-hover:from-purple-600 group-hover:to-pink-600 relative"
                     style={{ height: `${(analytics.salesData.values[index] / 100000) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(analytics.salesData.values[index])}
                  </div>
                </div>
                <span className="text-white/60 text-xs mt-2">{label}</span>
              </div>
            ))}
          </div>

          {showComparison && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-white/60 text-sm">Current Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-white/60 text-sm">Previous Period</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {analytics.traffic.sources.map((source) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{source.source}</span>
                  <span className="text-white font-semibold">{source.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <p className="text-white/40 text-xs mt-1">{formatNumber(source.value)} visitors</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {analytics.conversion.funnel.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{stage.stage}</span>
                  <span className="text-white font-semibold">{formatNumber(stage.count)}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${(stage.count / analytics.conversion.funnel[0].count) * 100}%` }}
                  ></div>
                </div>
                {index > 0 && (
                  <p className="text-white/40 text-xs mt-1">
                    {stage.dropoff}% dropoff
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {analytics.categoryData.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{cat.category}</span>
                  <span className="text-white font-semibold">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <p className="text-white/40 text-xs mt-1">{formatCurrency(cat.sales)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Top Countries</h3>
          <div className="space-y-4">
            {analytics.geoData.map((country) => (
              <div key={country.country}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{country.country}</span>
                  <span className="text-white font-semibold">{country.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
                <p className="text-white/40 text-xs mt-1">{formatCurrency(country.sales)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Top Selling Products</h3>
            <Link href="/dashboard/products" className="text-purple-400 hover:text-purple-300 text-sm">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {analytics.products.topSelling.map((product, index) => (
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
                  <p className={`text-xs ${product.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {product.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic & Engagement */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-6">Traffic & Engagement</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-sm">Visitors</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(analytics.traffic.visitors)}</p>
              <p className="text-green-400 text-xs mt-1">↑ 12.3%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(analytics.traffic.pageViews)}</p>
              <p className="text-green-400 text-xs mt-1">↑ 8.7%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics.traffic.bounceRate}%</p>
              <p className="text-red-400 text-xs mt-1">↓ 2.1%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics.traffic.avgSession}</p>
              <p className="text-green-400 text-xs mt-1">↑ 0.3%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white/80 text-sm font-semibold">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/60">Cart Abandonment</span>
                <span className="text-white font-semibold">{100 - analytics.conversion.cart}%</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/60">Checkout Rate</span>
                <span className="text-white font-semibold">{analytics.conversion.checkout}%</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/60">Purchase Rate</span>
                <span className="text-white font-semibold">{analytics.conversion.purchase}%</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/60">Return Rate</span>
                <span className="text-white font-semibold">24.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {analytics.products.lowStock.length > 0 && (
        <div className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="text-yellow-400 mr-2">⚠️</span>
              Low Stock Alert
            </h3>
            <Link href="/dashboard/products" className="text-yellow-400 hover:text-yellow-300 text-sm">
              Manage Inventory →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.products.lowStock.map((product) => (
              <div key={product.name} className="bg-white/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white font-medium">{product.name}</p>
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                    {product.stock} left
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(product.stock / product.threshold) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/40 text-xs mt-2">Threshold: {product.threshold}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
          <span className="mr-2">📊</span>
          Export as PDF
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
          <span className="mr-2">📈</span>
          Export as CSV
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center">
          <span className="mr-2">📧</span>
          Schedule Report
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-center text-white/40 text-sm">
        Last updated: {new Date().toLocaleString()} | Auto-refreshes every 5 minutes
      </div>
    </div>
  )
}