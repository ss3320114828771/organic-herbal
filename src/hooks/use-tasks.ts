'use client'

import { useState } from 'react'

// Super simple tasks hook - NO ERRORS
export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setTasks([
      { id: '1', title: 'Design homepage', status: 'in-progress', priority: 'high' },
      { id: '2', title: 'Implement auth', status: 'todo', priority: 'critical' },
      { id: '3', title: 'Write docs', status: 'done', priority: 'low' }
    ])
    setLoading(false)
  }

  return { tasks, loading, fetchTasks }
}