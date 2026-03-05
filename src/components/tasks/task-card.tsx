'use client'

import React from 'react'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  onClick?: (taskId: string) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onAssign?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: Task['status']) => void
  onPriorityChange?: (taskId: string, priority: Task['priority']) => void
  draggable?: boolean
  compact?: boolean
  showDescription?: boolean
  showAssignee?: boolean
  showDueDate?: boolean
  showLabels?: boolean
  showAttachments?: boolean
  showComments?: boolean
  showChecklist?: boolean
  showActions?: boolean
  className?: string
}

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: {
    id: string
    name: string
    avatar?: string
    email?: string
  }
  reporter?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  startDate?: string
  completedDate?: string
  labels?: string[]
  attachments?: {
    count: number
    items?: Array<{ id: string; name: string; url: string }>
  }
  comments?: {
    count: number
    latest?: Array<{ id: string; text: string; user: string; date: string }>
  }
  checklist?: {
    total: number
    completed: number
    items?: Array<{ id: string; text: string; completed: boolean }>
  }
  project?: {
    id: string
    name: string
    color?: string
  }
  sprint?: {
    id: string
    name: string
  }
  storyPoints?: number
  timeEstimate?: number
  timeSpent?: number
}

export default function TaskCard({
  task,
  onClick,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
  onPriorityChange,
  draggable = false,
  compact = false,
  showDescription = true,
  showAssignee = true,
  showDueDate = true,
  showLabels = true,
  showAttachments = true,
  showComments = true,
  showChecklist = true,
  showActions = true,
  className = ''
}: TaskCardProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [showDetails, setShowDetails] = React.useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    onClick?.(task.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(task.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id)
    }
  }

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAssign?.(task.id)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    onStatusChange?.(task.id, e.target.value as Task['status'])
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    onPriorityChange?.(task.id, e.target.value as Task['priority'])
  }

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'review': 'bg-purple-100 text-purple-700',
      'done': 'bg-green-100 text-green-700',
      'blocked': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'critical': 'bg-red-100 text-red-700'
    }
    return colors[priority] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    const icons = {
      'low': '⬇️',
      'medium': '➡️',
      'high': '⬆️',
      'critical': '🔥'
    }
    return icons[priority] || '•'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `${diffDays} days`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const checklistProgress = task.checklist 
    ? Math.round((task.checklist.completed / task.checklist.total) * 100)
    : 0

  // Compact card
  if (compact) {
    return (
      <div
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className={`bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
          isDragging ? 'opacity-50 rotate-1 scale-95' : ''
        } ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{task.title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)} {task.priority}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              📅 {formatDate(task.dueDate)}
            </span>
          )}
          {task.assignee && (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
              {task.assignee.avatar ? (
                <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full" />
              ) : (
                getInitials(task.assignee.name)
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default card
  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDragging ? 'opacity-50 rotate-1 scale-95' : ''
      } ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
            {task.project && (
              <Link
                href={`/projects/${task.project.id}`}
                className="text-xs text-gray-500 hover:text-green-600 inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: task.project.color || '#10b981' }}
                />
                {task.project.name}
              </Link>
            )}
          </div>

          {/* Status badge */}
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {/* Description */}
        {showDescription && task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Labels */}
        {showLabels && task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Metadata row */}
        <div className="flex items-center justify-between mb-3">
          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)} {task.priority}
            </span>

            {/* Story points */}
            {task.storyPoints && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {task.storyPoints} pts
              </span>
            )}
          </div>

          {/* Sprint */}
          {task.sprint && (
            <span className="text-xs text-gray-500">
              {task.sprint.name}
            </span>
          )}
        </div>

        {/* Progress bars */}
        <div className="space-y-2 mb-3">
          {/* Checklist progress */}
          {showChecklist && task.checklist && task.checklist.total > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Checklist</span>
                <span>{task.checklist.completed}/{task.checklist.total}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Time tracking */}
          {(task.timeEstimate || task.timeSpent) && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Time tracked</span>
                <span>{task.timeSpent || 0}h / {task.timeEstimate || 0}h</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${((task.timeSpent || 0) / (task.timeEstimate || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* Left side - Dates & Assignee */}
          <div className="flex items-center gap-3">
            {/* Due date */}
            {showDueDate && task.dueDate && (
              <span
                className={`text-xs flex items-center gap-1 ${
                  new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                📅 {formatDate(task.dueDate)}
              </span>
            )}

            {/* Assignee */}
            {showAssignee && task.assignee && (
              <div className="flex items-center gap-1 group relative">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                  {task.assignee.avatar ? (
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    getInitials(task.assignee.name)
                  )}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {task.assignee.name}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Stats & Actions */}
          <div className="flex items-center gap-3">
            {/* Attachments */}
            {showAttachments && task.attachments && task.attachments.count > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                📎 {task.attachments.count}
              </span>
            )}

            {/* Comments */}
            {showComments && task.comments && task.comments.count > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                💬 {task.comments.count}
              </span>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                  title="Edit task"
                >
                  ✎
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  title="Delete task"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                  title="More details"
                >
                  ⋯
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {/* Status change */}
            {onStatusChange && (
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-gray-500">Status:</label>
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            )}

            {/* Priority change */}
            {onPriorityChange && (
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-gray-500">Priority:</label>
                <select
                  value={task.priority}
                  onChange={handlePriorityChange}
                  className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            )}

            {/* Assign button */}
            {onAssign && (
              <button
                onClick={handleAssign}
                className="w-full mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
              >
                + Assign to someone
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple task item
export function SimpleTaskItem({ task, onClick }: { task: Task; onClick?: (id: string) => void }) {
  return (
    <TaskCard
      task={task}
      onClick={onClick}
      compact={true}
      showDescription={false}
      showAssignee={false}
      showDueDate={false}
      showLabels={false}
      showAttachments={false}
      showComments={false}
      showChecklist={false}
      showActions={false}
    />
  )
}

// Task with details
export function DetailedTaskCard({ task, onEdit, onDelete }: { 
  task: Task
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <TaskCard
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      compact={false}
      showDescription={true}
      showAssignee={true}
      showDueDate={true}
      showLabels={true}
      showAttachments={true}
      showComments={true}
      showChecklist={true}
      showActions={true}
    />
  )
}

// Kanban task card
export function KanbanTaskCard({ task, onDragStart }: { 
  task: Task
  onDragStart?: (e: React.DragEvent, taskId: string) => void 
}) {
  return (
    <TaskCard
      task={task}
      draggable={true}
      compact={false}
      showDescription={false}
      showAssignee={true}
      showDueDate={true}
      showLabels={true}
      showAttachments={true}
      showComments={true}
      showActions={false}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function PriorityIcon({ priority }: { priority: Task['priority'] }) {
  const icons = {
    low: '⬇️',
    medium: '➡️',
    high: '⬆️',
    critical: '🔥'
  }
  return <span>{icons[priority]}</span>
}

function StatusIcon({ status }: { status: Task['status'] }) {
  const icons = {
    'todo': '📝',
    'in-progress': '⚙️',
    'review': '👀',
    'done': '✅',
    'blocked': '🚫'
  }
  return <span>{icons[status]}</span>
}