'use client'

import React from 'react'
import TaskCard from './task-card'

interface TaskColumnProps {
  column: Column
  tasks: Task[]
  onTaskClick?: (taskId: string) => void
  onTaskDragStart?: (taskId: string, columnId: string) => void
  onTaskDragOver?: (e: React.DragEvent, columnId: string) => void
  onTaskDrop?: (taskId: string, sourceColumnId: string, targetColumnId: string) => void
  onAddTask?: (columnId: string) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onEditColumn?: (columnId: string) => void
  onDeleteColumn?: (columnId: string) => void
  onStatusChange?: (taskId: string, status: Task['status']) => void
  onPriorityChange?: (taskId: string, priority: Task['priority']) => void
  draggable?: boolean
  compact?: boolean
  limit?: number
  className?: string
}

interface Column {
  id: string
  title: string
  color?: string
  icon?: string
  limit?: number
  description?: string
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
  }
  dueDate?: string
  labels?: string[]
  attachments?: { count: number }
  comments?: { count: number }
  storyPoints?: number
}

export default function TaskColumn({
  column,
  tasks = [],
  onTaskClick,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDrop,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
  onStatusChange,
  onPriorityChange,
  draggable = false,
  compact = false,
  limit,
  className = ''
}: TaskColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false)
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newTaskTitle, setNewTaskTitle] = React.useState('')
  const columnRef = React.useRef<HTMLDivElement>(null)

  const taskCount = tasks.length
  const isOverLimit = limit ? taskCount >= limit : false
  const remainingSlots = limit ? limit - taskCount : 0

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDraggingOver(true)
    onTaskDragOver?.(e, column.id)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    const taskId = e.dataTransfer.getData('text/plain')
    const sourceColumnId = e.dataTransfer.getData('sourceColumn')

    if (taskId && sourceColumnId && sourceColumnId !== column.id) {
      onTaskDrop?.(taskId, sourceColumnId, column.id)
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!draggable) return
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.setData('sourceColumn', column.id)
    e.dataTransfer.effectAllowed = 'move'
    onTaskDragStart?.(taskId, column.id)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setIsDraggingOver(false)
  }

  const handleAddTask = () => {
    if (showAddForm) {
      if (newTaskTitle.trim()) {
        onAddTask?.(column.id)
        setNewTaskTitle('')
        setShowAddForm(false)
      }
    } else {
      setShowAddForm(true)
    }
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
    setNewTaskTitle('')
  }

  const getColumnColor = () => {
    if (isDraggingOver) return 'border-green-400 bg-green-50'
    if (isOverLimit) return 'border-red-300 bg-red-50'
    return column.color || 'border-gray-200 bg-gray-50'
  }

  return (
    <div
      ref={columnRef}
      className={`flex flex-col h-full rounded-lg border ${getColumnColor()} transition-colors ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {column.icon && <span className="text-lg">{column.icon}</span>}
            <h3 className="font-semibold text-gray-800 truncate">{column.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isOverLimit ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {taskCount}
              {limit && `/${limit}`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onEditColumn && (
              <button
                onClick={() => onEditColumn(column.id)}
                className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                title="Edit column"
              >
                ✎
              </button>
            )}
            {onDeleteColumn && (
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Delete column"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {column.description && (
          <p className="text-xs text-gray-500 mt-1">{column.description}</p>
        )}

        {limit && remainingSlots > 0 && remainingSlots < 5 && (
          <p className="text-xs text-orange-600 mt-1">
            {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] max-h-[600px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable={draggable}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            className={`${draggedTaskId === task.id ? 'opacity-50' : ''} cursor-move`}
          >
            <TaskCard
              task={task}
              onClick={onTaskClick}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              onPriorityChange={onPriorityChange}
              compact={compact}
              draggable={false} // Handled by column
              showAssignee={!compact}
              showDueDate={!compact}
              showLabels={!compact}
              showAttachments={!compact}
              showComments={!compact}
            />
          </div>
        ))}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm text-gray-400 mb-2">No tasks yet</p>
            {onAddTask && (
              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs text-green-600 hover:text-green-700"
              >
                + Add a task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-gray-200 bg-white rounded-b-lg">
        {onAddTask && !showAddForm && !isOverLimit && (
          <button
            onClick={handleAddTask}
            className="w-full py-2 text-sm text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>+</span>
            Add Task
          </button>
        )}

        {isOverLimit && (
          <p className="text-xs text-center text-red-600 py-1">
            Column limit reached
          </p>
        )}

        {draggable && (
          <p className="text-xs text-center text-gray-400 mt-1">
            Drag tasks to reorder or move
          </p>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple column (read-only)
export function SimpleTaskColumn({ column, tasks }: { column: Column; tasks: Task[] }) {
  return (
    <TaskColumn
      column={column}
      tasks={tasks}
      draggable={false}
      compact={true}
    />
  )
}

// Kanban column with all features
export function KanbanColumn({ column, tasks, onTaskMove, onAddTask }: {
  column: Column
  tasks: Task[]
  onTaskMove?: (taskId: string, sourceColumn: string, targetColumn: string) => void
  onAddTask?: (columnId: string) => void
}) {
  return (
    <TaskColumn
      column={column}
      tasks={tasks}
      onTaskDrop={onTaskMove}
      onAddTask={onAddTask}
      onEditTask={(id) => console.log('Edit task:', id)}
      onDeleteTask={(id) => console.log('Delete task:', id)}
      onEditColumn={(id) => console.log('Edit column:', id)}
      onDeleteColumn={(id) => console.log('Delete column:', id)}
      draggable={true}
      compact={false}
    />
  )
}

// Column with limit
export function LimitedTaskColumn({ column, tasks, limit }: {
  column: Column
  tasks: Task[]
  limit: number
}) {
  return (
    <TaskColumn
      column={{ ...column, limit }}
      tasks={tasks}
      limit={limit}
      draggable={true}
      onAddTask={(colId) => console.log('Add task to:', colId)}
    />
  )
}

// ==================== HOOK ====================

// Custom hook for column state
export function useTaskColumn(initialColumn: Column, initialTasks: Task[] = []) {
  const [column, setColumn] = React.useState<Column>(initialColumn)
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const moveTask = (taskId: string, targetColumnId: string) => {
    // This would be handled by parent component
    console.log('Move task:', taskId, 'to:', targetColumnId)
  }

  const updateColumn = (updates: Partial<Column>) => {
    setColumn({ ...column, ...updates })
  }

  const getTaskCount = () => tasks.length
  const getCompletedCount = () => tasks.filter(t => t.status === 'done').length
  const getOverdueCount = () => tasks.filter(t => {
    if (!t.dueDate) return false
    return new Date(t.dueDate) < new Date() && t.status !== 'done'
  }).length

  return {
    column,
    tasks,
    addTask,
    updateTask,
    removeTask,
    moveTask,
    updateColumn,
    getTaskCount,
    getCompletedCount,
    getOverdueCount
  }
}