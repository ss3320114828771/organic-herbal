'use client'

import React from 'react'

interface BadgeProps {
  children?: React.ReactNode
  text?: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  shape?: 'pill' | 'rounded' | 'square'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  count?: number
  maxCount?: number
  dot?: boolean
  pulsating?: boolean
  removable?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export default function Badge({
  children,
  text,
  variant = 'default',
  size = 'md',
  shape = 'pill',
  icon,
  iconPosition = 'left',
  count,
  maxCount = 99,
  dot = false,
  pulsating = false,
  removable = false,
  onRemove,
  onClick,
  className = ''
}: BadgeProps) {
  const content = text || children

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  }

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-sm px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const shapeClasses = {
    pill: 'rounded-full',
    rounded: 'rounded-md',
    square: 'rounded-none'
  }

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }

  const getCountDisplay = () => {
    if (count === undefined) return null
    if (count > maxCount) return `${maxCount}+`
    return count
  }

  // If dot mode is enabled
  if (dot) {
    return (
      <span
        className={`
          relative inline-flex
          ${pulsating ? 'animate-pulse' : ''}
          ${className}
        `}
      >
        <span
          className={`
            block ${dotSizeClasses[size]} rounded-full
            ${variantClasses[variant].split(' ')[0]}
            ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          `}
          onClick={onClick}
        />
        {count !== undefined && (
          <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-0.5">
            {getCountDisplay()}
          </span>
        )}
      </span>
    )
  }

  // If count badge (no content, just number)
  if (count !== undefined && !content) {
    return (
      <span
        className={`
          inline-flex items-center justify-center
          ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses[shape]}
          font-medium
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        {getCountDisplay()}
      </span>
    )
  }

  // Regular badge with content
  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses[shape]}
        font-medium whitespace-nowrap
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      <span>{content}</span>
      
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="flex-shrink-0 ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Status badge
export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    blocked: { variant: 'error', label: 'Blocked' },
    archived: { variant: 'secondary', label: 'Archived' },
    completed: { variant: 'success', label: 'Completed' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    review: { variant: 'warning', label: 'Review' }
  }

  const { variant, label } = statusMap[status] || { variant: 'default', label: status }

  return <Badge variant={variant} text={label} />
}

// Priority badge
export function PriorityBadge({ priority }: { priority: string }) {
  const priorityMap: Record<string, { variant: BadgeProps['variant']; icon: string }> = {
    low: { variant: 'success', icon: '⬇️' },
    medium: { variant: 'info', icon: '➡️' },
    high: { variant: 'warning', icon: '⬆️' },
    critical: { variant: 'error', icon: '🔥' }
  }

  const { variant, icon } = priorityMap[priority] || { variant: 'default', icon: '•' }

  return <Badge variant={variant} text={priority} icon={icon} iconPosition="left" />
}

// Notification badge
export function NotificationBadge({ count, onClick }: { count: number; onClick?: () => void }) {
  if (count === 0) return null

  return (
    <Badge
      count={count}
      variant="error"
      size="xs"
      shape="pill"
      onClick={onClick}
    />
  )
}

// Online status dot
export function OnlineStatusDot({ isOnline }: { isOnline: boolean }) {
  return (
    <Badge
      dot
      variant={isOnline ? 'success' : 'default'}
      pulsating={isOnline}
    />
  )
}

// Tag badge (removable)
export function TagBadge({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <Badge
      text={label}
      variant="secondary"
      removable={!!onRemove}
      onRemove={onRemove}
    />
  )
}

// Category badge
export function CategoryBadge({ category, count }: { category: string; count?: number }) {
  return (
    <Badge
      text={category}
      variant="outline"
      count={count}
      className="hover:bg-gray-100 cursor-pointer"
    />
  )
}

// ==================== ICON COMPONENTS ====================

// Badge group (multiple badges together)
export function BadgeGroup({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  )
}

// Filter badges (for active filters)
export function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge
      text={label}
      variant="primary"
      removable={true}
      onRemove={onRemove}
    />
  )
}

// ==================== HOOK ====================

// Custom hook for badge management
export function useBadge(initialCount = 0) {
  const [count, setCount] = React.useState(initialCount)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => Math.max(0, prev - 1))
  const reset = () => setCount(0)
  const set = (newCount: number) => setCount(Math.max(0, newCount))

  return {
    count,
    increment,
    decrement,
    reset,
    set
  }
}