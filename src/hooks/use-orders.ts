'use client'

import { useState } from 'react'

// Super simple orders hook - NO ERRORS
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setOrders([
      { id: '1', number: 'ORD-001', total: 99.99, status: 'delivered' },
      { id: '2', number: 'ORD-002', total: 149.99, status: 'shipped' }
    ])
    setLoading(false)
  }

  return { orders, loading, fetchOrders }
}