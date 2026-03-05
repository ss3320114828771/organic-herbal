'use client'

import React from 'react'
import Link from 'next/link'

interface TaskTimelineProps {
  tasks?: TimelineTask[]
  milestones?: Milestone[]
  startDate?: string
  endDate?: string
  onTaskClick?: (taskId: string) => void
  onMilestoneClick?: (milestoneId: string) => void
  viewMode?: 'day' | 'week' | 'month'
  onViewModeChange?: (mode: 'day' | 'week' | 'month') => void
  isLoading?: boolean
  className?: string
}

interface TimelineTask {
  id: string
  title: string
  startDate: string
  endDate: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  progress?: number
}

interface Milestone {
  id: string
  title: string
  date: string
  status: 'pending' | 'completed' | 'delayed'
}

export default function TaskTimeline({
  tasks = [],
  milestones = [],
  startDate,
  endDate,
  onTaskClick,
  onMilestoneClick,
  viewMode = 'week',
  onViewModeChange,
  isLoading = false,
  className = ''
}: TaskTimelineProps) {
  const [hoveredTask, setHoveredTask] = React.useState<string | null>(null)
  const timelineRef = React.useRef<HTMLDivElement>(null)

  // Calculate date range
  const getDateRange = () => {
    const allDates = [
      ...tasks.map(t => new Date(t.startDate)),
      ...tasks.map(t => new Date(t.endDate)),
      ...milestones.map(m => new Date(m.date))
    ]
    
    if (allDates.length === 0) {
      const now = new Date()
      const start = new Date(now)
      const end = new Date(now)
      
      if (viewMode === 'week') {
        start.setDate(now.getDate() - 3)
        end.setDate(now.getDate() + 4)
      } else if (viewMode === 'month') {
        start.setMonth(now.getMonth() - 1)
        end.setMonth(now.getMonth() + 2)
      } else {
        start.setDate(now.getDate() - 1)
        end.setDate(now.getDate() + 1)
      }
      
      return { start, end }
    }

    const minDate = startDate ? new Date(startDate) : new Date(Math.min(...allDates.map(d => d.getTime())))
    const maxDate = endDate ? new Date(endDate) : new Date(Math.max(...allDates.map(d => d.getTime())))

    // Add padding based on view mode
    if (viewMode === 'week') {
      minDate.setDate(minDate.getDate() - 2)
      maxDate.setDate(maxDate.getDate() + 2)
    } else if (viewMode === 'month') {
      minDate.setMonth(minDate.getMonth() - 1)
      maxDate.setMonth(maxDate.getMonth() + 1)
    }

    return { start: minDate, end: maxDate }
  }

  const { start, end } = getDateRange()
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const getTaskPosition = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    
    const startOffset = Math.max(0, (taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1
    
    const left = (startOffset / totalDays) * 100
    const width = (duration / totalDays) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  const getMilestonePosition = (milestone: Milestone) => {
    const milestoneDate = new Date(milestone.date)
    const offset = (milestoneDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    const left = (offset / totalDays) * 100
    return { left: `${left}%` }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'todo': 'bg-gray-200',
      'in-progress': 'bg-blue-200',
      'review': 'bg-purple-200',
      'done': 'bg-green-200',
      'blocked': 'bg-red-200',
      'pending': 'bg-yellow-200',
      'completed': 'bg-green-200',
      'delayed': 'bg-red-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-200'
  }

  const getPriorityIcon = (priority: string) => {
    const icons = {
      'low': '⬇️',
      'medium': '➡️',
      'high': '⬆️',
      'critical': '🔥'
    }
    return icons[priority as keyof typeof icons] || '•'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getDayHeaders = () => {
    const headers = []
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isToday = date.toDateString() === new Date().toDateString()
      
      headers.push(
        <div
          key={i}
          className={`flex-1 text-center py-2 border-r border-gray-200 ${
            isWeekend ? 'bg-gray-50' : ''
          } ${isToday ? 'bg-blue-50 font-medium' : ''}`}
        >
          <div className="text-xs text-gray-500">
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {date.getDate()}
          </div>
        </div>
      )
    }
    return headers
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Task Timeline</h3>
          
          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange?.('day')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'day'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => onViewModeChange?.('week')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onViewModeChange?.('month')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Date range */}
        <p className="text-sm text-gray-500 mt-2">
          {formatDate(start)} - {formatDate(end)}
        </p>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto" ref={timelineRef}>
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-48 flex-shrink-0 p-2 font-medium text-gray-600 border-r border-gray-200">
              Tasks
            </div>
            <div className="flex flex-1">
              {getDayHeaders()}
            </div>
          </div>

          {/* Milestones row */}
          {milestones.length > 0 && (
            <div className="relative border-b border-gray-200">
              <div className="flex">
                <div className="w-48 flex-shrink-0 p-2 text-sm font-medium text-gray-600 border-r border-gray-200">
                  Milestones
                </div>
                <div className="flex-1 relative h-12">
                  {milestones.map((milestone) => {
                    const position = getMilestonePosition(milestone)
                    return (
                      <button
                        key={milestone.id}
                        onClick={() => onMilestoneClick?.(milestone.id)}
                        className="absolute group"
                        style={{ left: position.left, transform: 'translateX(-50%)' }}
                      >
                        <div className={`w-4 h-4 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'delayed' ? 'bg-red-500' :
                          'bg-yellow-500'
                        } group-hover:scale-125 transition-transform`} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {milestone.title}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="space-y-2 py-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks in this timeframe
              </div>
            ) : (
              tasks.map((task) => {
                const position = getTaskPosition(task)
                return (
                  <div key={task.id} className="flex group">
                    {/* Task info */}
                    <div className="w-48 flex-shrink-0 p-2 border-r border-gray-200">
                      <button
                        onClick={() => onTaskClick?.(task.id)}
                        className="text-left hover:text-green-600"
                      >
                        <div className="font-medium text-gray-800 text-sm truncate">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {getPriorityIcon(task.priority)} {task.priority}
                          </span>
                          {task.assignee && (
                            <span className="text-xs text-gray-400">
                              {task.assignee.name}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Timeline bar */}
                    <div className="flex-1 relative p-2">
                      <div
                        className={`absolute h-8 rounded-lg ${getStatusColor(task.status)} 
                          hover:ring-2 hover:ring-green-400 cursor-pointer transition-all`}
                        style={{
                          left: position.left,
                          width: position.width,
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                        onClick={() => onTaskClick?.(task.id)}
                      >
                        {/* Progress indicator */}
                        {task.progress !== undefined && task.progress > 0 && (
                          <div
                            className="absolute inset-y-0 left-0 bg-green-600 bg-opacity-30 rounded-l-lg"
                            style={{ width: `${task.progress}%` }}
                          />
                        )}

                        {/* Task label (only show if enough width) */}
                        {parseFloat(position.width) > 15 && (
                          <span className="absolute inset-0 flex items-center px-2 text-xs text-gray-700 truncate">
                            {task.title}
                          </span>
                        )}
                      </div>

                      {/* Hover tooltip */}
                      {hoveredTask === task.id && (
                        <div
                          className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10"
                          style={{ left: position.left }}
                        >
                          <div className="font-medium mb-1">{task.title}</div>
                          <div className="flex gap-2 text-gray-300">
                            <span>{formatDate(new Date(task.startDate))}</span>
                            <span>→</span>
                            <span>{formatDate(new Date(task.endDate))}</span>
                          </div>
                          <div className="mt-1 text-gray-300">
                            Status: {task.status} • Priority: {task.priority}
                          </div>
                          {task.progress !== undefined && (
                            <div className="mt-1">Progress: {task.progress}%</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200"></span>
            <span className="text-gray-600">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-200"></span>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-200"></span>
            <span className="text-gray-600">Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-200"></span>
            <span className="text-gray-600">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-200"></span>
            <span className="text-gray-600">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple task list (non-timeline)
export function SimpleTaskList({ tasks, onTaskClick }: {
  tasks: TimelineTask[]
  onTaskClick?: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onTaskClick?.(task.id)}
          className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{new Date(task.startDate).toLocaleDateString()}</span>
                <span>→</span>
                <span>{new Date(task.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.status === 'done' ? 'bg-green-100 text-green-700' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'review' ? 'bg-purple-100 text-purple-700' :
              task.status === 'blocked' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {task.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

// Gantt chart view
export function GanttChart({ tasks, milestones }: {
  tasks: TimelineTask[]
  milestones?: Milestone[]
}) {
  return (
    <TaskTimeline
      tasks={tasks}
      milestones={milestones}
      viewMode="week"
    />
  )
}

// ==================== HOOK ====================

// Custom hook for timeline
export function useTaskTimeline(initialTasks: TimelineTask[] = []) {
  const [tasks, setTasks] = React.useState<TimelineTask[]>(initialTasks)
  const [viewMode, setViewMode] = React.useState<'day' | 'week' | 'month'>('week')

  const addTask = (task: Omit<TimelineTask, 'id'>) => {
    const newTask: TimelineTask = {
      id: Date.now().toString(),
      ...task
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<TimelineTask>) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const getTasksByDateRange = (start: Date, end: Date) => {
    return tasks.filter(t => {
      const taskStart = new Date(t.startDate)
      const taskEnd = new Date(t.endDate)
      return taskStart <= end && taskEnd >= start
    })
  }

  return {
    tasks,
    viewMode,
    setViewMode,
    addTask,
    updateTask,
    removeTask,
    getTasksByDateRange
  }
}