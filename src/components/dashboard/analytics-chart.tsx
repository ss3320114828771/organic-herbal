'use client'

import { useState, useEffect } from 'react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}

interface AnalyticsChartProps {
  title?: string
  type?: 'line' | 'bar' | 'area'
  height?: number
}

export default function AnalyticsChart({ 
  title = 'Revenue Overview', 
  type = 'line',
  height = 300 
}: AnalyticsChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate different data based on period
      let labels: string[] = []
      let revenueData: number[] = []
      let ordersData: number[] = []

      if (selectedPeriod === 'week') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        revenueData = [1250, 1450, 1680, 1890, 2100, 2450, 1980]
        ordersData = [12, 15, 18, 21, 24, 28, 22]
      } else if (selectedPeriod === 'month') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        revenueData = [8450, 9200, 10800, 12450]
        ordersData = [85, 94, 112, 128]
      } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        revenueData = [32500, 29800, 35600, 38900, 41200, 45800, 49500, 52300, 56700, 59800, 63400, 68700]
        ordersData = [325, 298, 356, 389, 412, 458, 495, 523, 567, 598, 634, 687]
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Revenue ($)',
            data: revenueData,
            color: '#10b981' // green-500
          },
          {
            label: 'Orders',
            data: ordersData,
            color: '#3b82f6' // blue-500
          }
        ]
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedPeriod])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getMaxValue = () => {
    if (!chartData) return 100
    const allValues = chartData.datasets.flatMap(d => d.data)
    return Math.max(...allValues) * 1.1 // Add 10% padding
  }

  const getMinValue = () => {
    if (!chartData) return 0
    const allValues = chartData.datasets.flatMap(d => d.data)
    return Math.min(0, ...allValues) * 0.9
  }

  const getYAxisLabels = () => {
    const max = getMaxValue()
    const min = getMinValue()
    const steps = 5
    const labels = []
    
    for (let i = 0; i <= steps; i++) {
      const value = min + (max - min) * (i / steps)
      labels.push(Math.round(value))
    }
    
    return labels.reverse()
  }

  const getBarHeight = (value: number) => {
    const max = getMaxValue()
    const min = getMinValue()
    const range = max - min
    return ((value - min) / range) * 100
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    )
  }

  const yAxisLabels = getYAxisLabels()
  const maxValue = getMaxValue()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedPeriod === 'week' && 'Last 7 days'}
            {selectedPeriod === 'month' && 'Last 4 weeks'}
            {selectedPeriod === 'year' && 'Last 12 months'}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedPeriod === 'week' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedPeriod === 'month' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedPeriod === 'year' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative" style={{ height: `${height}px` }}>
        
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
          {yAxisLabels.map((label, i) => (
            <div key={i} className="text-right pr-2">
              {label >= 1000 ? `${(label / 1000).toFixed(1)}k` : label}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="absolute left-16 right-0 top-0 bottom-0">
          
          {/* Grid Lines */}
          <div className="relative w-full h-full">
            {yAxisLabels.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${(i / (yAxisLabels.length - 1)) * 100}%` }}
              ></div>
            ))}

            {/* Bars or Line Chart */}
            {type === 'bar' ? (
              /* Bar Chart */
              <div className="absolute inset-0 flex items-end justify-around px-2">
                {chartData.labels.map((label, index) => (
                  <div key={index} className="flex flex-col items-center w-8">
                    {chartData.datasets.map((dataset, dIndex) => (
                      <div
                        key={dIndex}
                        className="w-6 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${getBarHeight(dataset.data[index])}%`,
                          backgroundColor: dataset.color,
                          marginBottom: dIndex === 0 ? '2px' : '0'
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* Line Chart */
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {chartData.datasets.map((dataset, dIndex) => {
                  const points = dataset.data.map((value, i) => {
                    const x = (i / (chartData.labels.length - 1)) * 100
                    const y = 100 - (value / maxValue) * 90 // Leave 10% padding at top
                    return `${x}%,${y}%`
                  }).join(' ')

                  return (
                    <g key={dIndex}>
                      {/* Area fill */}
                      {type === 'area' && (
                        <polygon
                          points={`0%,100% ${points} 100%,100%`}
                          fill={dataset.color}
                          fillOpacity="0.1"
                          className="transition-opacity duration-300"
                        />
                      )}
                      
                      {/* Line */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke={dataset.color}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      
                      {/* Data points */}
                      {dataset.data.map((value, i) => {
                        const x = (i / (chartData.labels.length - 1)) * 100
                        const y = 100 - (value / maxValue) * 90
                        
                        return (
                          <circle
                            key={i}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r={hoveredPoint === i ? '6' : '4'}
                            fill={dataset.color}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </svg>
            )}

            {/* X-Axis Labels */}
            <div className="absolute left-0 right-0 bottom-0 transform translate-y-6">
              <div className="flex justify-around text-xs text-gray-500">
                {chartData.labels.map((label, index) => (
                  <div key={index} className="text-center">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8">
        {chartData.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.color }}
            ></div>
            <span className="text-sm text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip (simplified) */}
      {hoveredPoint !== null && (
        <div className="mt-4 p-3 bg-gray-800 text-white rounded-lg text-sm">
          <p className="font-medium mb-1">{chartData.labels[hoveredPoint]}</p>
          {chartData.datasets.map((dataset, index) => (
            <p key={index} className="flex justify-between gap-4">
              <span>{dataset.label}:</span>
              <span className="font-mono">
                {dataset.label.includes('Revenue') 
                  ? formatCurrency(dataset.data[hoveredPoint])
                  : dataset.data[hoveredPoint]
                }
              </span>
            </p>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(chartData.datasets[0].data.reduce((a, b) => a + b, 0))}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">
            {chartData.datasets[1].data.reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}