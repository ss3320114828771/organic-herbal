'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BoardProps {
  project: any
}

export default function Board({ project }: BoardProps) {
  const [mounted, setMounted] = useState(false)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [tasks, setTasks] = useState<any>({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  })

  useEffect(() => {
    setMounted(true)
    // Initialize tasks from project data
    if (project?.tasks) {
      const categorized = {
        todo: project.tasks.filter((t: any) => t.status === 'TODO' || t.status === 'todo'),
        inProgress: project.tasks.filter((t: any) => t.status === 'IN_PROGRESS' || t.status === 'inProgress'),
        review: project.tasks.filter((t: any) => t.status === 'REVIEW' || t.status === 'review'),
        done: project.tasks.filter((t: any) => t.status === 'DONE' || t.status === 'done')
      }
      setTasks(categorized)
    }
  }, [project])

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      color: 'from-blue-500 to-cyan-500',
      icon: '📝',
      description: 'Tasks that need to be started'
    },
    { 
      id: 'inProgress', 
      title: 'In Progress', 
      color: 'from-yellow-500 to-orange-500',
      icon: '⚙️',
      description: 'Tasks currently being worked on'
    },
    { 
      id: 'review', 
      title: 'Review', 
      color: 'from-purple-500 to-pink-500',
      icon: '👀',
      description: 'Tasks waiting for review'
    },
    { 
      id: 'done', 
      title: 'Done', 
      color: 'from-green-500 to-emerald-500',
      icon: '✅',
      description: 'Completed tasks'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch(priority?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch(priority?.toLowerCase()) {
      case 'critical':
        return '🔴'
      case 'high':
        return '⚠️'
      case 'medium':
        return '📌'
      case 'low':
        return '🔽'
      default:
        return '📌'
    }
  }

  const onDragStart = (e: React.DragEvent, task: any, sourceColumn: string) => {
    setDraggedItem({ task, sourceColumn })
    e.dataTransfer.setData('text/plain', JSON.stringify({ task, sourceColumn }))
    e.currentTarget.classList.add('opacity-50')
  }

  const onDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50')
    setDraggedItem(null)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-white/5')
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-white/5')
  }

  const onDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-white/5')
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { task, sourceColumn } = data

      if (sourceColumn === targetColumn) return

      // Update tasks state
      setTasks((prev: any) => {
        const newTasks = { ...prev }
        
        // Remove from source
        newTasks[sourceColumn] = prev[sourceColumn].filter((t: any) => t.id !== task.id)
        
        // Add to target with updated status
        const updatedTask = { ...task, status: targetColumn }
        newTasks[targetColumn] = [...prev[targetColumn], updatedTask]
        
        return newTasks
      })

      console.log(`Moving task ${task.id} from ${sourceColumn} to ${targetColumn}`)
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const getFilteredTasks = (columnTasks: any[]) => {
    if (!columnTasks || !Array.isArray(columnTasks)) return []
    
    return columnTasks.filter(task => {
      if (!task) return false
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

      // Priority filter
      const matchesPriority = filterPriority === 'all' || 
        (task.priority && task.priority.toLowerCase() === filterPriority.toLowerCase())

      // Assignee filter
      const matchesAssignee = filterAssignee === 'all' || 
        (task.assigneeId && task.assigneeId === filterAssignee)

      return matchesSearch && matchesPriority && matchesAssignee
    })
  }

  const getAssigneeOptions = () => {
    const assignees = new Set()
    
    // Safely iterate through tasks
    const allTasks = [
      ...(tasks.todo || []),
      ...(tasks.inProgress || []),
      ...(tasks.review || []),
      ...(tasks.done || [])
    ]
    
    allTasks.forEach((task: any) => {
      if (task && task.assigneeId) {
        assignees.add(task.assigneeId)
      }
    })
    
    return Array.from(assignees)
  }

  const getTaskCountByPriority = (columnId: string) => {
    const columnTasks = tasks[columnId] || []
    
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    
    columnTasks.forEach((task: any) => {
      if (task && task.priority) {
        const priority = task.priority.toLowerCase()
        if (priority === 'critical') critical++
        else if (priority === 'high') high++
        else if (priority === 'medium') medium++
        else if (priority === 'low') low++
      }
    })
    
    return { critical, high, medium, low }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Board</h2>
          <p className="text-white/60">
            Drag and drop tasks to update their status
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 text-sm w-48"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee Filter */}
          {getAssigneeOptions().length > 0 && (
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="all">All Assignees</option>
              {getAssigneeOptions().map((assignee: any) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks[column.id] || []
          const filteredTasks = getFilteredTasks(columnTasks)
          const priorityCounts = getTaskCountByPriority(column.id)

          return (
            <div
              key={column.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${column.color} rounded-xl p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{column.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{column.title}</h3>
                      <p className="text-white/80 text-xs">{column.description}</p>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {filteredTasks.length}
                  </span>
                </div>

                {/* Priority Summary */}
                {(priorityCounts.critical > 0 || priorityCounts.high > 0) && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-white/20">
                    {priorityCounts.critical > 0 && (
                      <span className="text-xs bg-red-500/30 text-red-200 px-2 py-1 rounded-full">
                        🔴 {priorityCounts.critical}
                      </span>
                    )}
                    {priorityCounts.high > 0 && (
                      <span className="text-xs bg-orange-500/30 text-orange-200 px-2 py-1 rounded-full">
                        ⚠️ {priorityCounts.high}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-3 min-h-[200px] max-h-[500px] overflow-y-auto">
                {filteredTasks.map((task: any) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task, column.id)}
                    onDragEnd={onDragEnd}
                    className="bg-white/5 rounded-xl p-4 cursor-move transform hover:scale-102 transition-all duration-300 hover:shadow-xl border border-white/10 group"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold line-clamp-2 flex-1">
                        {task.title || 'Untitled Task'}
                      </h4>
                      {task.priority && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                          <span>{getPriorityIcon(task.priority)}</span>
                          <span className="capitalize">{task.priority}</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Task Footer */}
                    <div className="flex items-center justify-between">
                      {/* Assignee */}
                      {task.assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {task.assignee.name ? task.assignee.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="text-white/40 text-xs">
                            {task.assignee.name || 'Unassigned'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/20 text-xs">Unassigned</span>
                      )}

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <span className="text-white/40 text-xs">📅</span>
                          <span className="text-white/40 text-xs">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Subtasks Progress */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40">Subtasks</span>
                          <span className="text-white/60">
                            {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{
                              width: `${(task.subtasks.filter((s: any) => s.completed).length / task.subtasks.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {filteredTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-4xl mb-2 opacity-30">📋</div>
                    <p className="text-white/30 text-sm">No tasks in this column</p>
                    <p className="text-white/20 text-xs mt-1">Drag tasks here or create new</p>
                  </div>
                )}
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setSelectedColumn(column.id)
                  setShowAddTask(true)
                }}
                className="w-full mt-4 py-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>Add Task</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Task Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Priority</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Assignee</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="">Unassigned</option>
                    <option value="user1">John Doe</option>
                    <option value="user2">Jane Smith</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false)
                    // Add task logic here
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}