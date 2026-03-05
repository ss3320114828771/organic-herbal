'use client'

import { useRef, useCallback } from 'react'

// Super simple throttle hook - NO ERRORS
export function useThrottle(fn: (...args: any[]) => void, limit: number) {
  const lastRan = useRef(0)

  return useCallback((...args: any[]) => {
    const now = Date.now()
    if (now - lastRan.current >= limit) {
      fn(...args)
      lastRan.current = now
    }
  }, [fn, limit])
}