'use client'

import React from 'react'
import Link from 'next/link'

interface TaskBoardProps {
  columns?: TaskColumn[]
  tasks?: Task[]
  onTaskClick?: (taskId: string) => void
  onTaskDrag?: (taskId: string, sourceColumn: string, targetColumn: string) => void
  onAddTask?: (columnId: string) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onAddColumn?: () => void
  onEditColumn?: (columnId: string) => void
  onDeleteColumn?: (columnId: string) => void
  loading?: boolean
  className?: string
  draggable?: boolean
  showAddButtons?: boolean
  columnWidth?: 'sm' | 'md' | 'lg'
}

interface TaskColumn {
  id: string
  title: string
  color?: string
  limit?: number
  tasks?: string[] // task ids
}

interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  labels?: string[]
  attachments?: number
  comments?: number
}

export default function TaskBoard({
  columns = [],
  tasks = [],
  onTaskClick,
  onTaskDrag,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  loading = false,
  className = '',
  draggable = true,
  showAddButtons = true,
  columnWidth = 'md'
}: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const boardRef = React.useRef<HTMLDivElement>(null)

  // Group tasks by column
  const tasksByColumn = React.useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    columns.forEach(col => {
      grouped[col.id] = tasks.filter(t => t.columnId === col.id)
    })
    return grouped
  }, [tasks, columns])

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!draggable) return
    setDraggedTask(taskId)
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    if (!draggable) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDraggedOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    if (!draggable) return
    e.preventDefault()
    
    const taskId = e.dataTransfer.getData('text/plain')
    const task = tasks.find(t => t.id === taskId)
    
    if (task && task.columnId !== targetColumnId) {
      onTaskDrag?.(taskId, task.columnId, targetColumnId)
    }
    
    setDraggedTask(null)
    setDraggedOverColumn(null)
    setIsDragging(false)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedOverColumn(null)
    setIsDragging(false)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical': return '🔥'
      case 'high': return '⬆️'
      case 'medium': return '➡️'
      case 'low': return '⬇️'
      default: return '•'
    }
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

  const columnWidthClass = {
    sm: 'min-w-[250px]',
    md: 'min-w-[300px]',
    lg: 'min-w-[350px]'
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Board header */}
      {showAddButtons && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onAddColumn}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span>+</span>
            Add Column
          </button>
        </div>
      )}

      {/* Board columns */}
      <div
        ref={boardRef}
        className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]"
        style={{ scrollbarWidth: 'thin' }}
      >
        {columns.map((column) => {
          const columnTasks = tasksByColumn[column.id] || []
          const isOverLimit = column.limit ? columnTasks.length >= column.limit : false
          const isDraggedOver = draggedOverColumn === column.id

          return (
            <div
              key={column.id}
              className={`${columnWidthClass[columnWidth]} flex-shrink-0`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column header */}
              <div
                className="p-3 rounded-t-lg border border-gray-200 border-b-0"
                style={{ backgroundColor: column.color || '#f9fafb' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{column.title}</h3>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                      {column.limit && `/${column.limit}`}
                    </span>
                  </div>
                  
                  {showAddButtons && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onAddTask?.(column.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Add task"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onEditColumn?.(column.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Edit column"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => onDeleteColumn?.(column.id)}
                        className="p-1 hover:bg-red-200 text-red-600 rounded transition-colors"
                        title="Delete column"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column content */}
              <div
                className={`p-2 border border-gray-200 rounded-b-lg bg-gray-50 min-h-[200px] transition-colors ${
                  isDraggedOver ? 'bg-green-50 border-green-300' : ''
                } ${isOverLimit ? 'bg-red-50' : ''}`}
              >
                {/* Tasks */}
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable={draggable}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                        draggedTask === task.id ? 'opacity-50 rotate-1 scale-95' : ''
                      }`}
                      onClick={() => onTaskClick?.(task.id)}
                    >
                      {/* Task header */}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 text-sm flex-1">
                          {task.title}
                        </h4>
                        {showAddButtons && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditTask?.(task.id)
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              ✎
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteTask?.(task.id)
                              }}
                              className="p-1 hover:bg-red-100 text-red-600 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Labels */}
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.labels.map((label, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Task footer */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {/* Priority badge */}
                          {task.priority && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              <span>{getPriorityIcon(task.priority)}</span>
                              {task.priority}
                            </span>
                          )}

                          {/* Due date */}
                          {task.dueDate && (
                            <span
                              className={`text-xs flex items-center gap-1 ${
                                new Date(task.dueDate) < new Date()
                                  ? 'text-red-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              📅 {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Attachments count */}
                          {task.attachments && task.attachments > 0 && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              📎 {task.attachments}
                            </span>
                          )}

                          {/* Comments count */}
                          {task.comments && task.comments > 0 && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              💬 {task.comments}
                            </span>
                          )}

                          {/* Assignee avatar */}
                          {task.assignee && (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                              {task.assignee.avatar ? (
                                <img
                                  src={task.assignee.avatar}
                                  alt={task.assignee.name}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                task.assignee.name.charAt(0)
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty state */}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                      No tasks
                    </div>
                  )}

                  {/* Add task button (in column) */}
                  {showAddButtons && (
                    <button
                      onClick={() => onAddTask?.(column.id)}
                      className="w-full py-2 text-sm text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span>+</span>
                      Add Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty board state */}
        {columns.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No columns yet</h3>
              <p className="text-gray-500 mb-4">Create your first column to start organizing tasks</p>
              <button
                onClick={onAddColumn}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Add Column
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple task board
export function SimpleTaskBoard({ columns, tasks }: { columns: TaskColumn[]; tasks: Task[] }) {
  return (
    <TaskBoard
      columns={columns}
      tasks={tasks}
      draggable={false}
      showAddButtons={false}
    />
  )
}

// Kanban board
export function KanbanBoard({ columns, tasks, onTaskMove }: {
  columns: TaskColumn[]
  tasks: Task[]
  onTaskMove?: (taskId: string, sourceColumn: string, targetColumn: string) => void
}) {
  return (
    <TaskBoard
      columns={columns}
      tasks={tasks}
      onTaskDrag={onTaskMove}
      showAddButtons={true}
      draggable={true}
    />
  )
}

// Project board
export function ProjectBoard({ projectId }: { projectId: string }) {
  const mockColumns: TaskColumn[] = [
    { id: 'todo', title: 'To Do', color: '#f3f4f6', tasks: [] },
    { id: 'in-progress', title: 'In Progress', color: '#dbeafe', tasks: [] },
    { id: 'review', title: 'Review', color: '#fef3c7', tasks: [] },
    { id: 'done', title: 'Done', color: '#d1fae5', tasks: [] }
  ]

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Design homepage',
      description: 'Create wireframes and mockups',
      columnId: 'todo',
      priority: 'high',
      dueDate: '2024-03-15',
      labels: ['design', 'ui/ux'],
      attachments: 3,
      comments: 2
    },
    {
      id: '2',
      title: 'Implement authentication',
      description: 'Add login/signup functionality',
      columnId: 'in-progress',
      priority: 'critical',
      assignee: { id: 'user1', name: 'John Doe' },
      dueDate: '2024-03-10',
      labels: ['backend', 'security'],
      comments: 5
    },
    {
      id: '3',
      title: 'Write documentation',
      columnId: 'review',
      priority: 'low',
      assignee: { id: 'user2', name: 'Jane Smith' },
      labels: ['docs'],
      attachments: 1
    },
    {
      id: '4',
      title: 'Deploy to production',
      columnId: 'done',
      priority: 'medium',
      assignee: { id: 'user3', name: 'Mike Johnson' }
    }
  ]

  return (
    <TaskBoard
      columns={mockColumns}
      tasks={mockTasks}
      onTaskClick={(id) => console.log('Task clicked:', id)}
      onAddTask={(colId) => console.log('Add task to:', colId)}
      draggable={true}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function AddIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

// ==================== HOOK ====================

// Custom hook for task board
export function useTaskBoard(initialColumns: TaskColumn[] = [], initialTasks: Task[] = []) {
  const [columns, setColumns] = React.useState<TaskColumn[]>(initialColumns)
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)

  const addColumn = (title: string, color?: string) => {
    const newColumn: TaskColumn = {
      id: Date.now().toString(),
      title,
      color,
      tasks: []
    }
    setColumns([...columns, newColumn])
  }

  const updateColumn = (columnId: string, updates: Partial<TaskColumn>) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, ...updates } : col))
  }

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId))
    setTasks(tasks.filter(task => task.columnId !== columnId))
  }

  const addTask = (columnId: string, task: Omit<Task, 'id' | 'columnId'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      columnId,
      ...task
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updates } : task))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const moveTask = (taskId: string, targetColumnId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, columnId: targetColumnId } : task
    ))
  }

  return {
    columns,
    tasks,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  }
}