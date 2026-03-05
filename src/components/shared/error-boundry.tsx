'use client'

import React from 'react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: any[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // You could also send to your error tracking service
    // if (typeof window !== 'undefined' && window.errorTracking) {
    //   window.errorTracking.captureException(error, { errorInfo })
    // }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const hasChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )
      if (hasChanged) {
        this.reset()
      }
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.reset)
        }
        return this.props.fallback
      }

      // Default error UI
      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          reset={this.reset} 
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback UI
interface DefaultErrorFallbackProps {
  error: Error
  reset: () => void
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-xs overflow-auto max-h-48">
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  )
}

// API Error Boundary (for data fetching errors)
interface APIErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onReset?: () => void
}

interface APIErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class APIErrorBoundary extends React.Component<APIErrorBoundaryProps, APIErrorBoundaryState> {
  constructor(props: APIErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): APIErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('API Error:', error)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🌐</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Failed to load data
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || 'There was an error fetching data'}
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Route Error Boundary (for page-level errors)
export function RouteErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🛑</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Page Error
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, something went wrong loading this page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

// Suspense Error Boundary (for loading errors)
interface SuspenseErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface SuspenseErrorBoundaryState {
  hasError: boolean
}

export class SuspenseErrorBoundary extends React.Component<SuspenseErrorBoundaryProps, SuspenseErrorBoundaryState> {
  constructor(props: SuspenseErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): SuspenseErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// ==================== HOOKS ====================

// Hook for using error boundary in functional components
export function useErrorHandler(givenError?: unknown): (error: unknown) => void {
  const [error, setError] = React.useState<unknown>(null)
  
  if (givenError != null) {
    throw givenError
  }
  
  if (error != null) {
    throw error
  }
  
  return setError
}

// Hook for async error handling
export function useAsyncError() {
  const [, setError] = React.useState()
  
  return React.useCallback(
    (e: unknown) => {
      setError(() => {
        throw e
      })
    },
    [setError]
  )
}

// ==================== WITH ERROR BOUNDARY HOC ====================

// Higher-order component to wrap a component with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WithErrorBoundary.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`
  
  return WithErrorBoundary
}

// ==================== USAGE EXAMPLES ====================

/*
// Basic usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <MyComponent />
</ErrorBoundary>

// With function fallback
<ErrorBoundary 
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>

// With error handler
<ErrorBoundary onError={(error, errorInfo) => {
  logErrorToService(error, errorInfo)
}}>
  <MyComponent />
</ErrorBoundary>

// With reset keys
<ErrorBoundary resetKeys={[userId, pageId]}>
  <UserProfile userId={userId} />
</ErrorBoundary>

// API error boundary
<APIErrorBoundary>
  <DataComponent />
</APIErrorBoundary>

// Using hook
function MyComponent() {
  const handleError = useErrorHandler()
  
  const fetchData = async () => {
    try {
      await apiCall()
    } catch (error) {
      handleError(error)
    }
  }
  
  return <button onClick={fetchData}>Fetch Data</button>
}

// HOC usage
const SafeComponent = withErrorBoundary(MyComponent, {
  fallback: <div>Error occurred</div>
})
*/