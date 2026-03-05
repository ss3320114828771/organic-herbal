'use client'

import React from 'react'

// Simplest possible Switch
export default function Switch() {
  const [isOn, setIsOn] = React.useState(false)

  return (
    <div 
      onClick={() => setIsOn(!isOn)}
      style={{
        width: '44px',
        height: '24px',
        backgroundColor: isOn ? '#10b981' : '#e5e7eb',
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        display: 'inline-block'
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: isOn ? '22px' : '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </div>
  )
}