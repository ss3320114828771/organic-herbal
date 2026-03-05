'use client'

import { useState, useEffect } from 'react'

// Super simple realtime counter - NO ERRORS
export function useRealtimeCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return count
}