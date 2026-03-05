'use client'

import { useEffect, useRef } from 'react'

// Super simple click outside hook - NO ERRORS
export function useClickOutside(handler: () => void) {
  const ref = useRef<any>(null)

  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick)
    
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [handler])

  return ref
}