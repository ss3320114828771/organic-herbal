'use client'

import React from 'react'

interface LoadingScreenProps {
  isLoading?: boolean
  text?: string
  subtext?: string
  variant?: 'spinner' | 'dots' | 'pulse' | 'progress' | 'skeleton' | 'fullscreen'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'gray'
  progress?: number
  showProgress?: boolean
  fullscreen?: boolean
  overlay?: boolean
  backdropBlur?: boolean
  minHeight?: string
  className?: string
  spinnerClassName?: string
  textClassName?: string
  children?: React.ReactNode
}

export default function LoadingScreen({
  isLoading = true,
  text = 'Loading...',
  subtext,
  variant = 'spinner',
  size = 'md',
  color = 'green',
  progress = 0,
  showProgress = false,
  fullscreen = false,
  overlay = false,
  backdropBlur = false,
  minHeight = '200px',
  className = '',
  spinnerClassName = '',
  textClassName = '',
  children
}: LoadingScreenProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  // Size mappings
  const sizeClasses = {
    sm: {
      spinner: 'w-6 h-6',
      dot: 'w-2 h-2',
      pulse: 'w-12 h-12',
      text: 'text-sm',
      icon: 'text-lg'
    },
    md: {
      spinner: 'w-10 h-10',
      dot: 'w-3 h-3',
      pulse: 'w-16 h-16',
      text: 'text-base',
      icon: 'text-2xl'
    },
    lg: {
      spinner: 'w-14 h-14',
      dot: 'w-4 h-4',
      pulse: 'w-24 h-24',
      text: 'text-lg',
      icon: 'text-3xl'
    },
    xl: {
      spinner: 'w-20 h-20',
      dot: 'w-5 h-5',
      pulse: 'w-32 h-32',
      text: 'text-xl',
      icon: 'text-4xl'
    }
  }

  // Color mappings
  const colorClasses = {
    green: {
      spinner: 'border-green-600 border-t-transparent',
      bg: 'bg-green-600',
      text: 'text-green-600',
      light: 'bg-green-100'
    },
    blue: {
      spinner: 'border-blue-600 border-t-transparent',
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-100'
    },
    red: {
      spinner: 'border-red-600 border-t-transparent',
      bg: 'bg-red-600',
      text: 'text-red-600',
      light: 'bg-red-100'
    },
    yellow: {
      spinner: 'border-yellow-600 border-t-transparent',
      bg: 'bg-yellow-600',
      text: 'text-yellow-600',
      light: 'bg-yellow-100'
    },
    purple: {
      spinner: 'border-purple-600 border-t-transparent',
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-100'
    },
    gray: {
      spinner: 'border-gray-600 border-t-transparent',
      bg: 'bg-gray-600',
      text: 'text-gray-600',
      light: 'bg-gray-100'
    }
  }

  // Spinner variant
  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size].spinner} border-4 rounded-full animate-spin ${colorClasses[color].spinner} ${spinnerClassName}`}
      />
    </div>
  )

  // Dots variant
  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size].dot} ${colorClasses[color].bg} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )

  // Pulse variant
  const renderPulse = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size].pulse} rounded-full ${colorClasses[color].light} animate-ping opacity-75`}
      />
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size].icon}`}
      >
        ⏳
      </div>
    </div>
  )

  // Progress variant
  const renderProgress = () => (
    <div className="w-full max-w-md space-y-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color].bg} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showProgress && (
        <p className={`text-sm text-center ${colorClasses[color].text}`}>
          {Math.min(progress, 100)}% Complete
        </p>
      )}
    </div>
  )

  // Skeleton variant
  const renderSkeleton = () => (
    <div className="w-full space-y-3">
      <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-full animate-pulse w-5/6" />
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  )

  // Render based on variant
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'progress':
        return renderProgress()
      case 'skeleton':
        return renderSkeleton()
      default:
        return renderSpinner()
    }
  }

  // Fullscreen mode
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {overlay && (
          <div
            className={`absolute inset-0 bg-white ${backdropBlur ? 'backdrop-blur-sm bg-opacity-80' : ''}`}
          />
        )}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          {renderLoader()}
          {text && (
            <p className={`font-medium ${colorClasses[color].text} ${sizeClasses[size].text} ${textClassName}`}>
              {text}
            </p>
          )}
          {subtext && (
            <p className="text-sm text-gray-500">{subtext}</p>
          )}
        </div>
      </div>
    )
  }

  // Inline loader
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ minHeight }}
    >
      {renderLoader()}
      {text && (
        <p className={`mt-4 font-medium ${colorClasses[color].text} ${sizeClasses[size].text} ${textClassName}`}>
          {text}
        </p>
      )}
      {subtext && (
        <p className="mt-2 text-sm text-gray-500">{subtext}</p>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Full page loading screen
export function FullPageLoading({
  text = 'Loading...',
  subtext,
  variant = 'spinner'
}: {
  text?: string
  subtext?: string
  variant?: 'spinner' | 'dots' | 'pulse'
}) {
  return (
    <LoadingScreen
      isLoading={true}
      variant={variant}
      text={text}
      subtext={subtext}
      fullscreen
      overlay
      size="lg"
    />
  )
}

// Content loading skeleton
export function ContentSkeleton() {
  return (
    <LoadingScreen
      variant="skeleton"
      text=""
      isLoading={true}
    />
  )
}

// Button loading spinner
export function ButtonSpinner({ color = 'green' }: { color?: 'green' | 'blue' | 'red' | 'white' }) {
  let colorClass = 'border-green-600 border-t-transparent'
  
  if (color === 'white') {
    colorClass = 'border-white border-t-transparent'
  } else if (color === 'blue') {
    colorClass = 'border-blue-600 border-t-transparent'
  } else if (color === 'red') {
    colorClass = 'border-red-600 border-t-transparent'
  }

  return (
    <div className="inline-flex">
      <div className={`w-4 h-4 border-2 rounded-full animate-spin ${colorClass}`} />
    </div>
  )
}

// Progress bar
export function ProgressBar({
  progress,
  color = 'green',
  showLabel = false,
  height = 'h-2'
}: {
  progress: number
  color?: 'green' | 'blue' | 'red' | 'yellow'
  showLabel?: boolean
  height?: string
}) {
  const colorClass = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  }[color]

  return (
    <div className="w-full space-y-1">
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${colorClass} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 text-right">{Math.min(progress, 100)}%</p>
      )}
    </div>
  )
}

// ==================== SKELETON COMPONENTS ====================

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse" />
      <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

// ==================== HOOK ====================

// Custom hook for loading state
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)
  const [progress, setProgress] = React.useState(0)

  const startLoading = () => {
    setIsLoading(true)
    setProgress(0)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setProgress(0)
  }

  const updateProgress = (value: number) => {
    setProgress(Math.min(value, 100))
  }

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
    updateProgress
  }
}