'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate: string
  project: string
  projectId: string
  tags?: string[]
  completedAt?: string
}

interface TaskListProps {
  limit?: number
  showProject?: boolean
  filter?: string
  onTaskUpdate?: (taskId: string, status: Task['status']) => void
}

export default function TaskList({ 
  limit = 5, 
  showProject = true,
  filter = 'all',
  onTaskUpdate 
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string>(filter)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Design homepage wireframes',
          description: 'Create wireframes for the new homepage layout',
          status: 'in-progress',
          priority: 'high',
          assignee: { id: '1', name: 'John Doe' },
          dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
          project: 'Website Redesign',
          projectId: 'p1',
          tags: ['design', 'ui']
        },
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add login and registration functionality',
          status: 'todo',
          priority: 'critical',
          assignee: { id: '2', name: 'Jane Smith' },
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
          project: 'Mobile App',
          projectId: 'p2',
          tags: ['backend', 'security']
        },
        {
          id: '3',
          title: 'Write API documentation',
          status: 'review',
          priority: 'medium',
          assignee: { id: '3', name: 'Ahmed Khan' },
          dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
          project: 'API Development',
          projectId: 'p3',
          tags: ['docs']
        },
        {
          id: '4',
          title: 'Fix checkout bug',
          description: 'Resolve issue with payment processing',
          status: 'in-progress',
          priority: 'high',
          assignee: { id: '4', name: 'Fatima Ali' },
          dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
          project: 'E-commerce Platform',
          projectId: 'p4',
          tags: ['bug', 'urgent']
        },
        {
          id: '5',
          title: 'Update dependencies',
          status: 'completed',
          priority: 'low',
          assignee: { id: '5', name: 'Omar Hassan' },
          dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          project: 'Backend Services',
          projectId: 'p5',
          tags: ['maintenance']
        },
        {
          id: '6',
          title: 'User testing session',
          description: 'Conduct user testing for new features',
          status: 'todo',
          priority: 'medium',
          assignee: { id: '6', name: 'Aisha Rahman' },
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          project: 'Website Redesign',
          projectId: 'p1',
          tags: ['testing', 'ux']
        }
      ]
      setTasks(mockTasks)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      todo: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || colors.todo
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `In ${diffDays} days`
  }

  const getDueDateColor = (dateString: string, status: string) => {
    if (status === 'completed') return 'text-gray-400'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-red-600 font-medium'
    if (diffDays === 0) return 'text-orange-600 font-medium'
    if (diffDays <= 2) return 'text-yellow-600'
    return 'text-gray-500'
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt
            }
          : task
      )
    )
    onTaskUpdate?.(taskId, newStatus)
  }

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'todo') return task.status === 'todo'
    if (selectedFilter === 'in-progress') return task.status === 'in-progress'
    if (selectedFilter === 'review') return task.status === 'review'
    if (selectedFilter === 'completed') return task.status === 'completed'
    if (selectedFilter === 'overdue') {
      return new Date(task.dueDate) < new Date() && task.status !== 'completed'
    }
    return true
  })

  const displayedTasks = filteredTasks.slice(0, limit)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
            <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredTasks.length} pending tasks
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
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
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewMode === 'board' 
                    ? 'bg-white text-gray-800 shadow' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Board
              </button>
            </div>

            <Link
              href="/tasks"
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              New Task
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['all', 'todo', 'in-progress', 'review', 'completed', 'overdue'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task List/Board */}
      <div className="p-6">
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-3">
            {displayedTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks found</p>
            ) : (
              displayedTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={(e) => 
                          handleStatusChange(task.id, e.target.checked ? 'completed' : 'todo')
                        }
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                          )}
                        </div>

                        {/* Priority Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)} {task.priority}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        {/* Status */}
                        <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>

                        {/* Assignee */}
                        {task.assignee && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <span>👤</span>
                            {task.assignee.name}
                          </span>
                        )}

                        {/* Due Date */}
                        <span className={`flex items-center gap-1 ${getDueDateColor(task.dueDate, task.status)}`}>
                          <span>📅</span>
                          {formatDate(task.dueDate)}
                        </span>

                        {/* Project */}
                        {showProject && (
                          <Link
                            href={`/projects/${task.projectId}`}
                            className="flex items-center gap-1 text-gray-500 hover:text-green-600"
                          >
                            <span>📁</span>
                            {task.project}
                          </Link>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1 mt-3">
                          {task.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStatusChange(task.id, 'todo')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Move to Todo"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Start Progress"
                      >
                        ▶️
                      </button>
                      <button
                        onClick={() => handleStatusChange(task.id, 'review')}
                        className="p-1 text-gray-400 hover:text-yellow-600"
                        title="Move to Review"
                      >
                        👀
                      </button>
                      <Link
                        href={`/tasks/${task.id}/edit`}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Edit Task"
                      >
                        ✏️
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Board View */
          <div className="grid grid-cols-4 gap-4">
            {['todo', 'in-progress', 'review', 'completed'].map((status) => (
              <div key={status} className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-3 capitalize">
                  {status.replace('-', ' ')}
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </h3>

                <div className="space-y-2 min-h-[200px]">
                  {tasks
                    .filter(t => t.status === status)
                    .slice(0, 3)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow cursor-move"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-gray-800">{task.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {task.assignee && (
                            <span>{task.assignee.name}</span>
                          )}
                          <span className={getDueDateColor(task.dueDate, task.status)}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {tasks.filter(t => t.status === status).length > 3 && (
                  <button className="w-full mt-2 text-xs text-gray-500 hover:text-green-600">
                    +{tasks.filter(t => t.status === status).length - 3} more
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredTasks.length > limit && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link
            href="/tasks"
            className="block text-center text-sm text-green-600 hover:text-green-700"
          >
            View All Tasks ({filteredTasks.length})
          </Link>
        </div>
      )}
    </div>
  )
}

// Compact Task List (for sidebars)
export function CompactTaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review pull request',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
        project: 'Development',
        projectId: 'p1'
      },
      {
        id: '2',
        title: 'Update documentation',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        project: 'Docs',
        projectId: 'p2'
      },
      {
        id: '3',
        title: 'Fix navigation bug',
        status: 'todo',
        priority: 'critical',
        dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        project: 'Website',
        projectId: 'p3'
      }
    ]
    setTasks(mockTasks)
  }, [])

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Your Tasks</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2">
            <input type="checkbox" className="w-3 h-3 text-green-600 rounded" />
            <span className={`flex-1 text-sm ${
              task.priority === 'critical' ? 'text-red-600 font-medium' : 'text-gray-600'
            }`}>
              {task.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
      <Link href="/tasks" className="block text-center text-xs text-green-600 mt-3 hover:text-green-700">
        View all tasks
      </Link>
    </div>
  )
}

// Helper function for priority colors (reused)
function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return colors[priority] || colors.low
}