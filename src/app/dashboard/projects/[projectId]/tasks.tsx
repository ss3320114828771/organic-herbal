'use client'

import { useState, useEffect } from 'react'

interface TasksProps {
  project: any
}

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  createdAt: string
  comments?: number
  attachments?: number
  tags?: string[]
}

export default function Tasks({ project }: TasksProps) {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setMounted(true)
    // Initialize tasks from project data
    if (project?.tasks) {
      const todoTasks = project.tasks.todo || []
      const inProgressTasks = project.tasks.inProgress || []
      const reviewTasks = project.tasks.review || []
      const doneTasks = project.tasks.done || []
      
      const allTasks = [
        ...todoTasks,
        ...inProgressTasks,
        ...reviewTasks,
        ...doneTasks
      ].map((task: any, index: number) => ({
        id: task.id || `task-${Date.now()}-${index}`,
        title: task.title || 'Untitled Task',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        dueDate: task.dueDate || '',
        createdAt: task.createdAt || new Date().toISOString(),
        comments: task.comments || Math.floor(Math.random() * 10),
        attachments: task.attachments || Math.floor(Math.random() * 5),
        tags: task.tags || []
      }))
      setTasks(allTasks)
    }
  }, [project])

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'from-blue-500 to-cyan-500', icon: '📝' },
    { value: 'inProgress', label: 'In Progress', color: 'from-yellow-500 to-orange-500', icon: '⚙️' },
    { value: 'review', label: 'Review', color: 'from-purple-500 to-pink-500', icon: '👀' },
    { value: 'done', label: 'Done', color: 'from-green-500 to-emerald-500', icon: '✅' }
  ]

  const priorityOptions = [
    { value: 'critical', label: 'Critical', color: 'from-red-600 to-red-700', icon: '🔴' },
    { value: 'high', label: 'High', color: 'from-orange-500 to-red-500', icon: '⚠️' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500', icon: '📌' },
    { value: 'low', label: 'Low', color: 'from-green-500 to-emerald-500', icon: '🔽' }
  ]

  const getPriorityColor = (priority: string): string => {
    const found = priorityOptions.find(p => p.value === priority)
    return found?.color || 'from-gray-500 to-gray-600'
  }

  const getPriorityIcon = (priority: string): string => {
    const found = priorityOptions.find(p => p.value === priority)
    return found?.icon || '📌'
  }

  const getStatusColor = (status: string): string => {
    const found = statusOptions.find(s => s.value === status)
    return found?.color || 'from-gray-500 to-gray-600'
  }

  const getStatusIcon = (status: string): string => {
    const found = statusOptions.find(s => s.value === status)
    return found?.icon || '📋'
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No date'
    
    try {
      const date = new Date(dateString)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      if (date.toDateString() === today.toDateString()) return 'Today'
      if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const isOverdue = (dateString: string): boolean => {
    if (!dateString) return false
    
    try {
      const date = new Date(dateString)
      const today = new Date()
      return date < today && date.toDateString() !== today.toDateString()
    } catch {
      return false
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    try {
      switch(sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder: {[key: string]: number} = { critical: 0, high: 1, medium: 2, low: 3 }
          return (priorityOrder[a.priority] ?? 999) - (priorityOrder[b.priority] ?? 999)
        case 'status':
          const statusOrder: {[key: string]: number} = { todo: 0, inProgress: 1, review: 2, done: 3 }
          return (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999)
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    } catch {
      return 0
    }
  })

  const tasksByStatus: {[key: string]: Task[]} = {}
  
  statusOptions.forEach(status => {
    tasksByStatus[status.value] = filteredTasks.filter(t => t.status === status.value)
  })

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleAllTasks = () => {
    if (selectedTasks.length === sortedTasks.length && sortedTasks.length > 0) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(sortedTasks.map(t => t.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on tasks:`, selectedTasks)
    // Implement bulk actions here
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
        setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)))
        setSelectedTasks([])
      }
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId))
      setSelectedTasks(prev => prev.filter(id => id !== taskId))
    }
  }

  const getAssigneeOptions = (): string[] => {
    const assignees = new Set<string>()
    tasks.forEach(task => {
      if (task.assignee) {
        assignees.add(task.assignee)
      }
    })
    return Array.from(assignees)
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'inProgress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.dueDate && isOverdue(t.dueDate) && t.status !== 'done').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length
  }

  const handleCreateTask = () => {
    // Get form values
    const titleInput = document.getElementById('taskTitle') as HTMLInputElement
    const descInput = document.getElementById('taskDescription') as HTMLTextAreaElement
    const statusSelect = document.getElementById('taskStatus') as HTMLSelectElement
    const prioritySelect = document.getElementById('taskPriority') as HTMLSelectElement
    const assigneeSelect = document.getElementById('taskAssignee') as HTMLSelectElement
    const dueDateInput = document.getElementById('taskDueDate') as HTMLInputElement
    
    if (!titleInput?.value) {
      alert('Task title is required')
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: titleInput.value,
      description: descInput?.value || '',
      status: statusSelect?.value || 'todo',
      priority: prioritySelect?.value || 'medium',
      assignee: assigneeSelect?.value || '',
      dueDate: dueDateInput?.value || '',
      createdAt: new Date().toISOString(),
      comments: 0,
      attachments: 0,
      tags: []
    }

    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...newTask, id: t.id } : t))
    } else {
      // Add new task
      setTasks(prev => [...prev, newTask])
    }

    setShowTaskModal(false)
    setEditingTask(null)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Tasks</h2>
          <p className="text-white/60">
            Manage and track all project tasks
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
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                viewMode === 'calendar' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="mr-2">📅</span>
              Calendar
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTask(null)
              setShowTaskModal(true)
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            New Task
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Priorities</option>
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
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
            </select>

            {getAssigneeOptions().length > 0 && (
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
              >
                <option value="all">All Assignees</option>
                {getAssigneeOptions().map((assignee) => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            )}
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
      {viewMode === 'list' && (
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
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Assignee</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Due Date</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Stats</th>
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
                    <div>
                      <p className="text-white font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-white/40 text-sm line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(task.status)} text-white`}>
                      {getStatusIcon(task.status)} {statusOptions.find(s => s.value === task.status)?.label || task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {task.assignee.charAt(0)}
                        </div>
                        <span className="text-white">{task.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-white/40">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? (
                      <span className={`${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white'}`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && task.status !== 'done' && ' ⚠️'}
                      </span>
                    ) : (
                      <span className="text-white/40">No date</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {task.comments && task.comments > 0 && (
                        <span className="text-white/40 text-sm" title="Comments">
                          💬 {task.comments}
                        </span>
                      )}
                      {task.attachments && task.attachments > 0 && (
                        <span className="text-white/40 text-sm" title="Attachments">
                          📎 {task.attachments}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Delete"
                      >
                        🗑️
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
      )}

      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusOptions.map((status) => (
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
                  <div
                    key={task.id}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold line-clamp-2 flex-1">
                        {task.title}
                      </h4>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                        {getPriorityIcon(task.priority)} {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {task.assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-white/40 text-xs">{task.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-white/20 text-xs">Unassigned</span>
                      )}

                      {task.dueDate && (
                        <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white/40'}`}>
                          📅 {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {(!tasksByStatus[status.value] || tasksByStatus[status.value].length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-white/30 text-sm">No tasks</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setEditingTask(null)
                  setShowTaskModal(true)
                }}
                className="w-full mt-4 py-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>Add Task</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Calendar View</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-30">📅</div>
            <p className="text-white/40">Calendar view coming soon</p>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Task Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task title"
                  defaultValue={editingTask?.title || ''}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  id="taskDescription"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task description"
                  defaultValue={editingTask?.description || ''}
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Status</label>
                  <select
                    id="taskStatus"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingTask?.status || 'todo'}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Priority</label>
                  <select
                    id="taskPriority"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingTask?.priority || 'medium'}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Assignee</label>
                  <select
                    id="taskAssignee"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingTask?.assignee || ''}
                  >
                    <option value="">Unassigned</option>
                    {project?.team?.map((member: any) => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Due Date</label>
                  <input
                    id="taskDueDate"
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingTask?.dueDate || ''}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Tags</label>
                <input
                  id="taskTags"
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter tags separated by commas"
                  defaultValue={editingTask?.tags?.join(', ') || ''}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}