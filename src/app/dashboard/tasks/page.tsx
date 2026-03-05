'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  projectId: string
  projectName: string
  projectColor: string
  assigneeId: string
  assigneeName: string
  assigneeAvatar: string
  dueDate: string
  createdAt: string
  comments: number
  attachments: number
  subtasks: {
    total: number
    completed: number
  }
}

export default function TasksPage() {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterProject, setFilterProject] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [showFilters, setShowFilters] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setMounted(true)
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    // Mock data - replace with actual API call
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design homepage wireframes',
        description: 'Create wireframes for the new homepage design including header, hero section, features grid, and footer.',
        status: 'in-progress',
        priority: 'high',
        projectId: 'proj-1',
        projectName: 'Website Redesign',
        projectColor: 'from-blue-500 to-cyan-500',
        assigneeId: 'user-2',
        assigneeName: 'Jane Smith',
        assigneeAvatar: 'JS',
        dueDate: '2024-02-01',
        createdAt: '2024-01-15',
        comments: 5,
        attachments: 3,
        subtasks: {
          total: 8,
          completed: 4
        }
      },
      {
        id: '2',
        title: 'Implement authentication API',
        description: 'Create login, register, and password reset endpoints with JWT authentication.',
        status: 'todo',
        priority: 'high',
        projectId: 'proj-1',
        projectName: 'Website Redesign',
        projectColor: 'from-blue-500 to-cyan-500',
        assigneeId: 'user-3',
        assigneeName: 'Mike Johnson',
        assigneeAvatar: 'MJ',
        dueDate: '2024-02-15',
        createdAt: '2024-01-16',
        comments: 2,
        attachments: 1,
        subtasks: {
          total: 6,
          completed: 0
        }
      },
      {
        id: '3',
        title: 'Create marketing email template',
        description: 'Design and code email template for Q2 marketing campaign.',
        status: 'review',
        priority: 'medium',
        projectId: 'proj-3',
        projectName: 'Marketing Campaign',
        projectColor: 'from-green-500 to-emerald-500',
        assigneeId: 'user-4',
        assigneeName: 'Sarah Wilson',
        assigneeAvatar: 'SW',
        dueDate: '2024-01-30',
        createdAt: '2024-01-10',
        comments: 8,
        attachments: 4,
        subtasks: {
          total: 5,
          completed: 4
        }
      },
      {
        id: '4',
        title: 'Test payment integration',
        description: 'Test Stripe payment integration in staging environment.',
        status: 'done',
        priority: 'critical',
        projectId: 'proj-2',
        projectName: 'Mobile App',
        projectColor: 'from-purple-500 to-pink-500',
        assigneeId: 'user-5',
        assigneeName: 'Tom Brown',
        assigneeAvatar: 'TB',
        dueDate: '2024-01-20',
        createdAt: '2024-01-05',
        comments: 12,
        attachments: 2,
        subtasks: {
          total: 4,
          completed: 4
        }
      },
      {
        id: '5',
        title: 'Write user documentation',
        description: 'Create user guide and API documentation for the platform.',
        status: 'in-progress',
        priority: 'low',
        projectId: 'proj-1',
        projectName: 'Website Redesign',
        projectColor: 'from-blue-500 to-cyan-500',
        assigneeId: 'user-6',
        assigneeName: 'Alice Green',
        assigneeAvatar: 'AG',
        dueDate: '2024-02-10',
        createdAt: '2024-01-12',
        comments: 3,
        attachments: 5,
        subtasks: {
          total: 7,
          completed: 3
        }
      },
      {
        id: '6',
        title: 'Fix navigation bug',
        description: 'Fix mobile navigation menu not closing after click.',
        status: 'todo',
        priority: 'medium',
        projectId: 'proj-1',
        projectName: 'Website Redesign',
        projectColor: 'from-blue-500 to-cyan-500',
        assigneeId: 'user-7',
        assigneeName: 'David Kim',
        assigneeAvatar: 'DK',
        dueDate: '2024-01-25',
        createdAt: '2024-01-18',
        comments: 1,
        attachments: 0,
        subtasks: {
          total: 3,
          completed: 0
        }
      }
    ]
    setTasks(mockTasks)
  }

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: '📊' },
    { value: 'todo', label: 'To Do', icon: '📝', color: 'from-blue-500 to-cyan-500' },
    { value: 'in-progress', label: 'In Progress', icon: '⚙️', color: 'from-yellow-500 to-orange-500' },
    { value: 'review', label: 'Review', icon: '👀', color: 'from-purple-500 to-pink-500' },
    { value: 'done', label: 'Done', icon: '✅', color: 'from-green-500 to-emerald-500' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: '🔽' },
    { value: 'low', label: 'Low', icon: '🔽', color: 'from-green-500 to-emerald-500' },
    { value: 'medium', label: 'Medium', icon: '📌', color: 'from-yellow-500 to-orange-500' },
    { value: 'high', label: 'High', icon: '⚠️', color: 'from-orange-500 to-red-500' },
    { value: 'critical', label: 'Critical', icon: '🔴', color: 'from-red-600 to-red-700' }
  ]

  const getStatusColor = (status: string): string => {
    const found = statusOptions.find(s => s.value === status)
    return found?.color || 'from-gray-500 to-gray-600'
  }

  const getPriorityColor = (priority: string): string => {
    const found = priorityOptions.find(p => p.value === priority)
    return found?.color || 'from-gray-500 to-gray-600'
  }

  const getPriorityIcon = (priority: string): string => {
    const found = priorityOptions.find(p => p.value === priority)
    return found?.icon || '📌'
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dateString: string): boolean => {
    const date = new Date(dateString)
    const today = new Date()
    return date < today && date.toDateString() !== today.toDateString()
  }

  const calculateProgress = (subtasks: { total: number; completed: number }): number => {
    if (subtasks.total === 0) return 0
    return Math.round((subtasks.completed / subtasks.total) * 100)
  }

  const getUniqueProjects = (): { id: string; name: string }[] => {
    const projects = tasks.map(t => ({ id: t.projectId, name: t.projectName }))
    const unique = projects.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    return unique
  }

  const getUniqueAssignees = (): { id: string; name: string; avatar: string }[] => {
    const assignees = tasks.map(t => ({ 
      id: t.assigneeId, 
      name: t.assigneeName, 
      avatar: t.assigneeAvatar 
    }))
    const unique = assignees.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    return unique
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesProject = filterProject === 'all' || task.projectId === filterProject
    const matchesAssignee = filterAssignee === 'all' || task.assigneeId === filterAssignee

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    try {
      switch(sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          const priorityOrder: {[key: string]: number} = { critical: 0, high: 1, medium: 2, low: 3 }
          return (priorityOrder[a.priority] ?? 999) - (priorityOrder[b.priority] ?? 999)
        case 'status':
          const statusOrder: {[key: string]: number} = { todo: 0, 'in-progress': 1, review: 2, done: 3 }
          return (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    } catch {
      return 0
    }
  })

  const tasksByStatus = statusOptions.reduce((acc: {[key: string]: Task[]}, option) => {
    if (option.value !== 'all') {
      acc[option.value] = filteredTasks.filter(t => t.status === option.value)
    }
    return acc
  }, {})

  const toggleTaskSelection = (taskId: string): void => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleAllTasks = (): void => {
    if (selectedTasks.length === sortedTasks.length && sortedTasks.length > 0) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(sortedTasks.map(t => t.id))
    }
  }

  const handleBulkAction = (action: string): void => {
    console.log(`Bulk action ${action} on tasks:`, selectedTasks)
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
        setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)))
        setSelectedTasks([])
      }
    }
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-white/60">
            Manage and track all your tasks across projects
          </p>
        </div>

        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="mr-2">📋</span>
              List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                viewMode === 'board' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="mr-2">📊</span>
              Board
            </button>
          </div>

          <Link
            href="/dashboard/tasks/new"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            New Task
          </Link>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <p className="text-white/40 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{taskStats.total}</p>
        </div>
        <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
          <p className="text-blue-300 text-sm">To Do</p>
          <p className="text-2xl font-bold text-blue-300">{taskStats.todo}</p>
        </div>
        <div className="bg-yellow-500/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
          <p className="text-yellow-300 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-yellow-300">{taskStats.inProgress}</p>
        </div>
        <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-300 text-sm">Review</p>
          <p className="text-2xl font-bold text-purple-300">{taskStats.review}</p>
        </div>
        <div className="bg-green-500/10 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
          <p className="text-green-300 text-sm">Done</p>
          <p className="text-2xl font-bold text-green-300">{taskStats.done}</p>
        </div>
        <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
          <p className="text-red-300 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-300">{taskStats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-colors flex items-center ${
              showFilters ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="mr-2">⚙️</span>
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            {/* Status Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Project</label>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">📁 All Projects</option>
                {getUniqueProjects().map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Assignee</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">👥 All Assignees</option>
                {getUniqueAssignees().map(assignee => (
                  <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Sort and Bulk Actions */}
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedTasks.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">
                {selectedTasks.length} selected
              </span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="status-todo">Move to To Do</option>
                <option value="status-progress">Move to In Progress</option>
                <option value="status-review">Move to Review</option>
                <option value="status-done">Move to Done</option>
                <option value="priority-high">Set Priority High</option>
                <option value="priority-medium">Set Priority Medium</option>
                <option value="priority-low">Set Priority Low</option>
                <option value="delete">Delete Selected</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === sortedTasks.length && sortedTasks.length > 0}
                    onChange={toggleAllTasks}
                    className="rounded border-white/30 bg-white/10"
                  />
                </th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Task</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Priority</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Project</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Assignee</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Due Date</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Progress</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/tasks/${task.id}`} className="block hover:opacity-80">
                      <p className="text-white font-medium">{task.title}</p>
                      <p className="text-white/40 text-sm line-clamp-1">{task.description}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(task.status)} text-white`}>
                      {statusOptions.find(s => s.value === task.status)?.icon} {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white flex items-center w-fit`}>
                      <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/projects/${task.projectId}`} className="text-purple-400 hover:text-purple-300">
                      {task.projectName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {task.assigneeAvatar}
                      </div>
                      <span className="text-white text-sm">{task.assigneeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white'}`}>
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate) && task.status !== 'done' && ' ⚠️'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm">{calculateProgress(task.subtasks)}%</span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${calculateProgress(task.subtasks)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/tasks/${task.id}`}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="View"
                      >
                        👁️
                      </Link>
                      <Link
                        href={`/dashboard/tasks/${task.id}/edit`}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="More"
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">✅</div>
              <p className="text-white/40">No tasks found</p>
            </div>
          )}
        </div>
      ) : (
        /* Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusOptions.filter(s => s.value !== 'all').map((status) => (
            <div
              key={status.value}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            >
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${status.color} rounded-xl p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{status.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{status.label}</h3>
                      <p className="text-white/80 text-xs">
                        {tasksByStatus[status.value]?.length || 0} tasks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3 min-h-[200px] max-h-[500px] overflow-y-auto">
                {(tasksByStatus[status.value] || []).map((task: Task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="block bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold line-clamp-2 flex-1">
                        {task.title}
                      </h4>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                        {getPriorityIcon(task.priority)} {task.priority}
                      </span>
                    </div>

                    <p className="text-white/60 text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {task.assigneeAvatar}
                        </div>
                        <span className="text-white/40 text-xs">{task.assigneeName}</span>
                      </div>

                      <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white/40'}`}>
                        📅 {formatDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Subtask Progress */}
                    {task.subtasks.total > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40">Subtasks</span>
                          <span className="text-white/60">
                            {task.subtasks.completed}/{task.subtasks.total}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: `${calculateProgress(task.subtasks)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}

                {(!tasksByStatus[status.value] || tasksByStatus[status.value].length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-white/30 text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}