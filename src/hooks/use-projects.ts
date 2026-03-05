'use client'

import { useState } from 'react'

// Super simple projects hook - NO ERRORS
export function useProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setProjects([
      { id: '1', name: 'Website Redesign', status: 'active', progress: 65 },
      { id: '2', name: 'Mobile App', status: 'planning', progress: 15 },
      { id: '3', name: 'Marketing Campaign', status: 'completed', progress: 100 }
    ])
    setLoading(false)
  }

  return { projects, loading, fetchProjects }
}