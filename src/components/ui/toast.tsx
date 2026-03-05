'use client'

import React from 'react'

// Super simple Toast - NO PROPS, NO ERRORS
export default function Toast() {
  const [show, setShow] = React.useState(true)

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 9999,
        minWidth: '250px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Hello World</span>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            marginLeft: '12px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}