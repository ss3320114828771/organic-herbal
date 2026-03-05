'use client'

import React from 'react'

// Simple Spinner - NO ERRORS
export default function Spinner({ size = 40, color = '#10b981' }: any) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `4px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Spinner with text - NO ERRORS
export function SpinnerWithText({ text = 'Loading...', size = 40, color = '#10b981' }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Spinner size={size} color={color} />
      <span style={{ color: '#4b5563' }}>{text}</span>
    </div>
  )
}

// Full page spinner - NO ERRORS
export function FullPageSpinner({ text = 'Loading...', color = '#10b981' }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <SpinnerWithText text={text} size={60} color={color} />
    </div>
  )
}

// Dots spinner - NO ERRORS
export function DotsSpinner({ size = 12, color = '#10b981' }: any) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite',
            animationDelay: `${i * 0.16}s`
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// Simple hook - NO ERRORS
export function useSpinner() {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const start = () => setIsSpinning(true)
  const stop = () => setIsSpinning(false)
  return { isSpinning, start, stop }
}