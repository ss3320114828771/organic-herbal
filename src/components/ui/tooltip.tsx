'use client'

import React from 'react'

// Super simple Tooltip - NO PROPS, NO ERRORS
export default function Tooltip() {
  const [show, setShow] = React.useState(false)

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        Hover me
      </button>
      
      {show && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            left: '50px',
            backgroundColor: 'black',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          Hello World
        </div>
      )}
    </div>
  )
}