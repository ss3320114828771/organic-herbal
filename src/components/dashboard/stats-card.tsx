'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  change?: number
  changeLabel?: string
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange'
  link?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  valuePrefix?: string
  valueSuffix?: string
  loading?: boolean
  onClick?: () => void
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  changeLabel = 'vs last period',
  color = 'green',
  link,
  trend,
  subtitle,
  valuePrefix,
  valueSuffix,
  loading = false,
  onClick
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getColorClasses = () => {
    const colors = {
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
        iconText: 'text-green-600',
        border: 'border-green-200',
        text: 'text-green-700',
        hover: 'hover:shadow-green-100'
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
        iconText: 'text-blue-600',
        border: 'border-blue-200',
        text: 'text-blue-700',
        hover: 'hover:shadow-blue-100'
      },
      yellow: {
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        iconBg: 'bg-gradient-to-br from-yellow-100 to-amber-100',
        iconText: 'text-yellow-600',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        hover: 'hover:shadow-yellow-100'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
        iconBg: 'bg-gradient-to-br from-red-100 to-rose-100',
        iconText: 'text-red-600',
        border: 'border-red-200',
        text: 'text-red-700',
        hover: 'hover:shadow-red-100'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100',
        iconText: 'text-purple-600',
        border: 'border-purple-200',
        text: 'text-purple-700',
        hover: 'hover:shadow-purple-100'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
        iconText: 'text-orange-600',
        border: 'border-orange-200',
        text: 'text-orange-700',
        hover: 'hover:shadow-orange-100'
      }
    }
    return colors[color]
  }

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <span className="text-green-600">↑</span>
    } else if (trend === 'down') {
      return <span className="text-red-600">↓</span>
    }
    return <span className="text-gray-400">→</span>
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-500'
  }

  const formatValue = () => {
    let formattedValue = value.toString()
    if (valuePrefix) formattedValue = `${valuePrefix}${formattedValue}`
    if (valueSuffix) formattedValue = `${formattedValue}${valueSuffix}`
    return formattedValue
  }

  const colors = getColorClasses()

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
    )
  }

  // Card content
  const CardContent = () => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${colors.border} transition-all duration-300 ${
        link || onClick ? `cursor-pointer hover:shadow-xl ${colors.hover}` : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {formatValue()}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center text-2xl transition-transform duration-300 ${
          isHovered ? 'scale-110' : ''
        }`}>
          <span className={colors.iconText}>{icon}</span>
        </div>
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-400">{changeLabel}</span>
        </div>
      )}

      {/* Link indicator */}
      {link && (
        <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
          <span>Click to view</span>
          <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
        </div>
      )}
    </div>
  )

  // Wrap with Link if provided
  if (link) {
    return (
      <Link href={link} className="block">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}

// Mini Stats Card (smaller version)
export function MiniStatsCard({
  title,
  value,
  icon,
  color = 'green'
}: {
  title: string
  value: string | number
  icon: string
  color?: 'green' | 'blue' | 'yellow' | 'red'
}) {
  const getColorClasses = () => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color] || colors.green
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">{title}</p>
        <div className={`w-8 h-8 rounded-lg ${getColorClasses()} flex items-center justify-center text-sm`}>
          {icon}
        </div>
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  )
}

// Horizontal Stats Card
export function HorizontalStatsCard({
  title,
  value,
  icon,
  change,
  color = 'green'
}: {
  title: string
  value: string | number
  icon: string
  change?: number
  color?: 'green' | 'blue' | 'yellow' | 'red'
}) {
  const getColorClasses = () => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color] || colors.green
  }

  const getChangeColor = () => {
    if (!change) return 'text-gray-400'
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${getColorClasses()} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-800">{value}</p>
            {change !== undefined && (
              <span className={`text-xs font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Group
export function StatsCardGroup({
  children,
  columns = 4
}: {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  )
}

// Usage example component
export function StatsCardExample() {
  return (
    <div className="space-y-6">
      {/* Main stats cards */}
      <StatsCardGroup columns={4}>
        <StatsCard
          title="Total Revenue"
          value="24,567"
          valuePrefix="$"
          icon="💰"
          change={12.5}
          trend="up"
          color="green"
          link="/analytics/revenue"
        />
        <StatsCard
          title="Total Orders"
          value="1,234"
          icon="📦"
          change={8.2}
          trend="up"
          color="blue"
          link="/orders"
        />
        <StatsCard
          title="New Customers"
          value="567"
          icon="👥"
          change={23.1}
          trend="up"
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value="3.45"
          valueSuffix="%"
          icon="📈"
          change={-0.5}
          trend="down"
          color="red"
        />
      </StatsCardGroup>

      {/* Mini stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <MiniStatsCard
          title="Today"
          value="$2,345"
          icon="💰"
          color="green"
        />
        <MiniStatsCard
          title="Week"
          value="$12,567"
          icon="📊"
          color="blue"
        />
        <MiniStatsCard
          title="Month"
          value="$48,901"
          icon="📈"
          color="yellow"
        />
        <MiniStatsCard
          title="Year"
          value="$524,678"
          icon="🎯"
          color="red"
        />
      </div>

      {/* Horizontal stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <HorizontalStatsCard
          title="Average Order Value"
          value="$78.50"
          icon="🛒"
          change={4.3}
          color="green"
        />
        <HorizontalStatsCard
          title="Refund Rate"
          value="2.1%"
          icon="↩️"
          change={-1.2}
          color="red"
        />
      </div>
    </div>
  )
}