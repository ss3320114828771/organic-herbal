'use client'

import React from 'react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  children?: React.ReactNode
  onClose?: () => void
  dismissible?: boolean
  autoClose?: number
  className?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export default function Alert({
  type = 'info',
  title,
  message,
  children,
  onClose,
  dismissible = false,
  autoClose,
  className = '',
  icon,
  action
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isClosing, setIsClosing] = React.useState(false)

  React.useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-400',
          button: 'hover:bg-green-100 text-green-600'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-400',
          button: 'hover:bg-yellow-100 text-yellow-600'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-400',
          button: 'hover:bg-red-100 text-red-600'
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-400',
          button: 'hover:bg-blue-100 text-blue-600'
        }
    }
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border rounded-lg p-4
        transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icon || getDefaultIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles.text}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${styles.text} ${title ? 'mt-1' : ''}`}>
              {message}
            </div>
          )}
          {children && (
            <div className={`text-sm ${styles.text} ${title || message ? 'mt-2' : ''}`}>
              {children}
            </div>
          )}

          {/* Action button */}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`text-sm font-medium ${styles.button} transition-colors`}
              >
                {action.label} →
              </button>
            </div>
          )}
        </div>

        {/* Close button */}
        {(dismissible || onClose) && (
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-3 ${styles.button} transition-colors rounded-lg p-1`}
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Success alert
export function SuccessAlert({ title, message, onClose }: {
  title?: string
  message?: string
  onClose?: () => void
}) {
  return (
    <Alert
      type="success"
      title={title}
      message={message}
      onClose={onClose}
      dismissible={!!onClose}
    />
  )
}

// Error alert
export function ErrorAlert({ title, message, onClose }: {
  title?: string
  message?: string
  onClose?: () => void
}) {
  return (
    <Alert
      type="error"
      title={title}
      message={message}
      onClose={onClose}
      dismissible={!!onClose}
    />
  )
}

// Warning alert
export function WarningAlert({ title, message, onClose }: {
  title?: string
  message?: string
  onClose?: () => void
}) {
  return (
    <Alert
      type="warning"
      title={title}
      message={message}
      onClose={onClose}
      dismissible={!!onClose}
    />
  )
}

// Info alert
export function InfoAlert({ title, message, onClose }: {
  title?: string
  message?: string
  onClose?: () => void
}) {
  return (
    <Alert
      type="info"
      title={title}
      message={message}
      onClose={onClose}
      dismissible={!!onClose}
    />
  )
}

// Toast alert (for notifications)
export function ToastAlert({ type, message, onClose }: {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <Alert
        type={type}
        message={message}
        onClose={onClose}
        dismissible={true}
        autoClose={5000}
      />
    </div>
  )
}

// Banner alert (full width)
export function BannerAlert({ type, message, onClose }: {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}) {
  return (
    <div className="w-full">
      <Alert
        type={type}
        message={message}
        onClose={onClose}
        dismissible={!!onClose}
        className="rounded-none border-x-0 border-t-0"
      />
    </div>
  )
}

// ==================== HOOK ====================

// Custom hook for alert management
export function useAlert() {
  const [alerts, setAlerts] = React.useState<Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    title?: string
  }>>([])

  const showAlert = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    title?: string
  ) => {
    const id = Date.now().toString()
    setAlerts(prev => [...prev, { id, type, message, title }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeAlert(id)
    }, 5000)

    return id
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  return {
    alerts,
    showAlert,
    removeAlert,
    clearAlerts,
    success: (message: string, title?: string) => showAlert(message, 'success', title),
    error: (message: string, title?: string) => showAlert(message, 'error', title),
    warning: (message: string, title?: string) => showAlert(message, 'warning', title),
    info: (message: string, title?: string) => showAlert(message, 'info', title)
  }
}