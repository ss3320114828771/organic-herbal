'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnalyticsCard {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: string
  color: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange'
  link?: string
  trend: 'up' | 'down' | 'neutral'
  secondaryValue?: string
  secondaryLabel?: string
}

interface ChartData {
  labels: string[]
  values: number[]
}

export default function AnalyticsCards() {
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week')
  const [cards, setCards] = useState<AnalyticsCard[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockCards: AnalyticsCard[] = [
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: '$24,567',
          change: 12.5,
          changeLabel: 'vs last period',
          icon: '💰',
          color: 'green',
          link: '/admin/analytics/revenue',
          trend: 'up',
          secondaryValue: '$3,245',
          secondaryLabel: 'today'
        },
        {
          id: 'orders',
          title: 'Total Orders',
          value: '1,234',
          change: 8.2,
          changeLabel: 'vs last period',
          icon: '📦',
          color: 'blue',
          link: '/admin/orders',
          trend: 'up',
          secondaryValue: '45',
          secondaryLabel: 'pending'
        },
        {
          id: 'customers',
          title: 'New Customers',
          value: '567',
          change: 23.1,
          changeLabel: 'vs last period',
          icon: '👥',
          color: 'purple',
          link: '/admin/customers',
          trend: 'up',
          secondaryValue: '89',
          secondaryLabel: 'this week'
        },
        {
          id: 'products',
          title: 'Products Sold',
          value: '2,345',
          change: 5.7,
          changeLabel: 'vs last period',
          icon: '🌿',
          color: 'yellow',
          link: '/admin/products',
          trend: 'up',
          secondaryValue: '156',
          secondaryLabel: 'unique items'
        },
        {
          id: 'conversion',
          title: 'Conversion Rate',
          value: '3.45%',
          change: -0.5,
          changeLabel: 'vs last period',
          icon: '📈',
          color: 'red',
          link: '/admin/analytics/conversion',
          trend: 'down',
          secondaryValue: '2.1%',
          secondaryLabel: 'cart rate'
        },
        {
          id: 'avgOrder',
          title: 'Avg. Order Value',
          value: '$78.50',
          change: 4.3,
          changeLabel: 'vs last period',
          icon: '🛒',
          color: 'orange',
          link: '/admin/analytics/orders',
          trend: 'up',
          secondaryValue: '$92.40',
          secondaryLabel: 'high ticket'
        }
      ]
      setCards(mockCards)
      setLoading(false)
    }, 1000)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'bg-green-100 text-green-600',
        hover: 'hover:bg-green-100'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'hover:bg-blue-100'
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: 'bg-yellow-100 text-yellow-600',
        hover: 'hover:bg-yellow-100'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'bg-red-100 text-red-600',
        hover: 'hover:bg-red-100'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: 'bg-purple-100 text-purple-600',
        hover: 'hover:bg-purple-100'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: 'bg-orange-100 text-orange-600',
        hover: 'hover:bg-orange-100'
      }
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <span className="text-green-600">↑ {change}%</span>
    } else if (trend === 'down') {
      return <span className="text-red-600">↓ {Math.abs(change)}%</span>
    } else {
      return <span className="text-gray-600">→ {change}%</span>
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
          {(['today', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const colors = getColorClasses(card.color)
          
          return (
            <div
              key={card.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 ${colors.border}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-sm font-semibold ${card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {getTrendIcon(card.trend, card.change)}
                </span>
                <span className="text-xs text-gray-400">{card.changeLabel}</span>
              </div>

              {/* Secondary Stats */}
              {card.secondaryValue && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">{card.secondaryLabel}</p>
                    <p className="text-sm font-semibold text-gray-700">{card.secondaryValue}</p>
                  </div>
                  
                  {/* Action Link */}
                  {card.link && (
                    <Link
                      href={card.link}
                      className={`text-xs ${colors.text} hover:underline flex items-center gap-1`}
                    >
                      View Details
                      <span>→</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-green-100 text-sm mb-1">Total Profit</p>
          <p className="text-2xl font-bold">$8,945</p>
          <p className="text-xs text-green-200 mt-1">↑ 15.3% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm mb-1">Expenses</p>
          <p className="text-2xl font-bold">$3,420</p>
          <p className="text-xs text-blue-200 mt-1">↓ 5.2% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm mb-1">Refunds</p>
          <p className="text-2xl font-bold">$234</p>
          <p className="text-xs text-purple-200 mt-1">↓ 12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 text-white">
          <p className="text-orange-100 text-sm mb-1">Pending Orders</p>
          <p className="text-2xl font-bold">23</p>
          <p className="text-xs text-orange-200 mt-1">Need attention</p>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Top Product</p>
            <p className="font-semibold text-gray-800">Turmeric Powder</p>
            <p className="text-xs text-green-600">234 units sold</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Top Category</p>
            <p className="font-semibold text-gray-800">Herbs</p>
            <p className="text-xs text-green-600">$8.4k revenue</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Peak Hours</p>
            <p className="font-semibold text-gray-800">2 PM - 5 PM</p>
            <p className="text-xs text-green-600">45% of orders</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Return Rate</p>
            <p className="font-semibold text-gray-800">2.3%</p>
            <p className="text-xs text-green-600">Below average</p>
          </div>
        </div>
      </div>

      {/* Admin Signature */}
      <p className="text-xs text-gray-400 text-center">
        Admin: Hafiz Sajid Syed • Last updated: {new Date().toLocaleString()}
      </p>
    </div>
  )
}