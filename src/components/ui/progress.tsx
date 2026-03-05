'use client'

import React from 'react'

// Simple Progress Bar - NO ERRORS
export default function Progress({ value = 0 }: any) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: '#10b981',
          transition: 'width 0.3s'
        }} />
      </div>
    </div>
  )
}

// Simple Circular Progress - NO ERRORS
export function CircularProgress({ value = 0, size = 100 }: any) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `conic-gradient(#10b981 ${value}%, #e5e7eb ${value}%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: size - 20,
        height: size - 20,
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        {value}%
      </div>
    </div>
  )
}

// Simple Steps - NO ERRORS
export function Steps({ current = 1, total = 3 }: any) {
  const steps = []
  for (let i = 1; i <= total; i++) {
    steps.push(i)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {steps.map((step) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: step <= current ? '#10b981' : '#e5e7eb',
            color: step <= current ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {step < current ? '✓' : step}
          </div>
          {step < total && (
            <div style={{
              width: '40px',
              height: '2px',
              backgroundColor: step < current ? '#10b981' : '#e5e7eb',
              margin: '0 4px'
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// Simple Skeleton - NO ERRORS
export function Skeleton({ width = '100%', height = '20px' }: any) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      animation: 'pulse 1.5s infinite'
    }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Simple Skeleton Card - NO ERRORS
export function SkeletonCard() {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <Skeleton height="150px" />
      <div style={{ marginTop: '12px' }}>
        <Skeleton width="60%" height="16px" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="80%" height="16px" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="40%" height="16px" />
      </div>
    </div>
  )
}

// Simple hook
export function useProgress(initial = 0) {
  const [value, setValue] = React.useState(initial)
  const increment = () => setValue(v => Math.min(v + 10, 100))
  const decrement = () => setValue(v => Math.max(v - 10, 0))
  const reset = () => setValue(0)
  return { value, increment, decrement, reset }
}