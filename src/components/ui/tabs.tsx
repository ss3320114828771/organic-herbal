'use client'

import React from 'react'

// Super simple Tabs
export default function Tabs({ tabs = [], activeIndex = 0, setActiveIndex }: any) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {tabs.map((tab: string, i: number) => (
        <button
          key={i}
          onClick={() => setActiveIndex?.(i)}
          style={{
            padding: '8px 16px',
            backgroundColor: i === activeIndex ? '#10b981' : '#f3f4f6',
            color: i === activeIndex ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

// Tabs with content - SUPER SIMPLE
export function TabsWithContent({ tabs = [] }: any) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {tabs.map((tab: any, i: number) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: '8px 16px',
              backgroundColor: i === activeIndex ? '#10b981' : '#f3f4f6',
              color: i === activeIndex ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {tab.label || `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        {tabs[activeIndex]?.content || `Content ${activeIndex + 1}`}
      </div>
    </div>
  )
}

// Simple hook
export function useTabs() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  return { activeIndex, setActiveIndex }
}