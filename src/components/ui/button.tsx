'use client'

import React from 'react'
import Link from 'next/link'

// Simple button component
export default function Button({ 
  children, 
  onClick, 
  href,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button'
}: any) {
  
  const baseClass = 'px-4 py-2 rounded-lg font-medium transition-colors'
  
  // Fixed line 19 - proper object access
  const variantStyles: any = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  const variantClass = variantStyles[variant] || 'bg-green-600 text-white hover:bg-green-700'
  
  const classes = `${baseClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  
  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Pre-made buttons - simple functions with no complex types
export function PrimaryButton(props: any) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: any) {
  return <Button variant="secondary" {...props} />
}

export function OutlineButton(props: any) {
  return <Button variant="outline" {...props} />
}

export function DangerButton(props: any) {
  return <Button variant="danger" {...props} />
}

// Icon button
export function IconButton({ icon, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg"
      aria-label={label || 'icon button'}
    >
      {icon}
    </button>
  )
}

// Google button - super simple
export function GoogleButton({ onClick }: any) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full">
      <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Sign in with Google
    </Button>
  )
}

// GitHub button - super simple
export function GithubButton({ onClick }: any) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full">
      <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
      Sign in with GitHub
    </Button>
  )
}

// Button group - super simple
export function ButtonGroup({ children }: any) {
  return (
    <div className="flex">
      {React.Children.map(children, (child: any, i: number) => {
        if (!child) return null
        const isFirst = i === 0
        const isLast = i === React.Children.count(children) - 1
        const className = `
          ${child.props.className || ''} 
          ${isFirst ? 'rounded-r-none' : ''} 
          ${isLast ? 'rounded-l-none' : ''} 
          ${!isFirst && !isLast ? 'rounded-none' : ''} 
          ${!isFirst ? '-ml-px' : ''}
        `
        return React.cloneElement(child, { className })
      })}
    </div>
  )
}

// Simple loading hook
export function useButtonLoading() {
  const [isLoading, setIsLoading] = React.useState(false)
  
  const withLoading = async (fn: () => Promise<void>) => {
    setIsLoading(true)
    try {
      await fn()
    } finally {
      setIsLoading(false)
    }
  }
  
  return { isLoading, withLoading }
}

// Loading button
export function LoadingButton({ children = 'Loading...' }: any) {
  return (
    <Button disabled loading>
      {children}
    </Button>
  )
}