'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold' | 'planning'
  progress: number
  dueDate: string
  team: {
    id: string
    name: string
    avatar?: string
  }[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  tasks: {
    total: number
    completed: number
  }
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'E-commerce Website Redesign',
          description: 'Complete overhaul of the online store with new features',
          status: 'active',
          progress: 75,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          team: [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Ahmed Khan' }
          ],
          priority: 'high',
          category: 'Development',
          tasks: { total: 24, completed: 18 }
        },
        {
          id: '2',
          name: 'Mobile App Development',
          description: 'Native mobile app for iOS and Android platforms',
          status: 'active',
          progress: 45,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          team: [
            { id: '4', name: 'Fatima Ali' },
            { id: '5', name: 'Omar Hassan' }
          ],
          priority: 'critical',
          category: 'Mobile',
          tasks: { total: 32, completed: 14 }
        },
        {
          id: '3',
          name: 'Marketing Campaign Q2',
          description: 'Digital marketing campaign for summer products',
          status: 'planning',
          progress: 10,
          dueDate: new Date(Date.now() + 21 * 86400000).toISOString(),
          team: [
            { id: '6', name: 'Aisha Rahman' },
            { id: '7', name: 'Yusuf Ibrahim' },
            { id: '8', name: 'Zainab Malik' }
          ],
          priority: 'medium',
          category: 'Marketing',
          tasks: { total: 15, completed: 2 }
        },
        {
          id: '4',
          name: 'Customer Portal',
          description: 'Self-service portal for customers to manage orders',
          status: 'on-hold',
          progress: 30,
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          team: [
            { id: '9', name: 'Ali Raza' },
            { id: '10', name: 'Sara Ahmed' }
          ],
          priority: 'low',
          category: 'Development',
          tasks: { total: 18, completed: 5 }
        },
        {
          id: '5',
          name: 'Inventory Management System',
          description: 'Track and manage product inventory in real-time',
          status: 'completed',
          progress: 100,
          dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
          team: [
            { id: '11', name: 'Bilal Khan' },
            { id: '12', name: 'Huda Ali' }
          ],
          priority: 'high',
          category: 'Backend',
          tasks: { total: 28, completed: 28 }
        }
      ]
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      planning: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.planning
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.low
  }

  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, string> = {
      low: '⬇️',
      medium: '➡️',
      high: '⬆️',
      critical: '⚠️'
    }
    return icons[priority] || '•'
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 60) return 'bg-yellow-500'
    if (progress < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `Due in ${diffDays} days`
  }

  const getDueDateColor = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-red-600'
    if (diffDays <= 3) return 'text-orange-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} active projects
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-800 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {getPriorityIcon(project.priority)} {project.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.category}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(project.progress)} rounded-full`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-gray-500">
                    Tasks: {project.tasks.completed}/{project.tasks.total}
                  </span>
                  <span className={getDueDateColor(project.dueDate)}>
                    {formatDate(project.dueDate)}
                  </span>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full border-2 border-white flex items-center justify-center text-xs"
                        title={member.name}
                      >
                        {member.avatar ? (
                          <Image src={member.avatar} alt={member.name} width={24} height={24} className="rounded-full" />
                        ) : (
                          <span>{member.name.charAt(0)}</span>
                        )}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Project Info */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Status Indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'active' ? 'bg-green-500' :
                    project.status === 'completed' ? 'bg-blue-500' :
                    project.status === 'on-hold' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{project.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{project.category}</span>
                      <span>•</span>
                      <span>Tasks: {project.tasks.completed}/{project.tasks.total}</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Due Date */}
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(project.progress)} rounded-full`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <span className={`text-xs w-24 ${getDueDateColor(project.dueDate)}`}>
                    {formatDate(project.dueDate)}
                  </span>

                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/projects"
          className="block text-center text-sm text-green-600 hover:text-green-700"
        >
          View All Projects
        </Link>
      </div>
    </div>
  )
}