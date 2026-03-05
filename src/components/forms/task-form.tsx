'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TaskFormData {
  title: string
  description: string
  projectId: string
  projectName?: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'test' | 'research'
  assigneeId: string
  assigneeName?: string
  reporterId: string
  reporterName?: string
  storyPoints: number
  estimatedHours: number
  actualHours: number
  dueDate: string
  startDate: string
  completedDate: string
  labels: string[]
  tags: string[]
  attachments: File[]
  existingAttachments?: Attachment[]
  comments: Comment[]
  subtasks: Subtask[]
  dependencies: Dependency[]
  relatedTasks: string[]
  sprint: {
    id: string
    name: string
    startDate: string
    endDate: string
  }
  epic: {
    id: string
    name: string
  }
  board: {
    id: string
    name: string
    column: string
  }
  customFields: Record<string, any>
  metadata: {
    createdAt: string
    createdBy: string
    lastModified: string
    modifiedBy: string
  }
}

interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
  attachments?: string[]
  mentions?: string[]
  isEdited: boolean
}

interface Subtask {
  id: string
  title: string
  status: 'todo' | 'done'
  assigneeId?: string
  estimatedHours?: number
  actualHours?: number
}

interface Dependency {
  id: string
  taskId: string
  taskTitle: string
  type: 'blocks' | 'blocked-by' | 'relates-to' | 'duplicate-of'
  status: TaskFormData['status']
}

interface TaskFormProps {
  taskId?: string
  projectId?: string
  initialData?: Partial<TaskFormData>
  onSubmit?: (data: TaskFormData) => Promise<void>
  isEditing?: boolean
  isModal?: boolean
  onClose?: () => void
}

export default function TaskForm({ 
  taskId, 
  projectId,
  initialData, 
  onSubmit,
  isEditing = false,
  isModal = false,
  onClose
}: TaskFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId: projectId || '',
    status: 'todo',
    priority: 'medium',
    type: 'feature',
    assigneeId: '',
    reporterId: 'current-user-id',
    storyPoints: 0,
    estimatedHours: 0,
    actualHours: 0,
    dueDate: '',
    startDate: '',
    completedDate: '',
    labels: [],
    tags: [],
    attachments: [],
    comments: [],
    subtasks: [],
    dependencies: [],
    relatedTasks: [],
    sprint: {
      id: '',
      name: '',
      startDate: '',
      endDate: ''
    },
    epic: {
      id: '',
      name: ''
    },
    board: {
      id: '',
      name: '',
      column: ''
    },
    customFields: {},
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: 'current-user-id',
      lastModified: new Date().toISOString(),
      modifiedBy: 'current-user-id'
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [labelInput, setLabelInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [showSubtaskForm, setShowSubtaskForm] = useState(false)
  const [showDependencyForm, setShowDependencyForm] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [selectedSubtask, setSelectedSubtask] = useState<Partial<Subtask>>({})
  const [selectedDependency, setSelectedDependency] = useState<Partial<Dependency>>({})
  const [timeTracking, setTimeTracking] = useState({
    isRunning: false,
    startTime: null as Date | null,
    elapsedSeconds: 0
  })

  const projects = [
    { id: 'proj-1', name: 'E-commerce Platform' },
    { id: 'proj-2', name: 'Mobile App Redesign' },
    { id: 'proj-3', name: 'API Gateway Migration' },
    { id: 'proj-4', name: 'Customer Dashboard' },
    { id: 'proj-5', name: 'Inventory Management System' }
  ]

  const teamMembers = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user-3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 'user-4', name: 'Sarah Williams', email: 'sarah@example.com' },
    { id: 'user-5', name: 'David Brown', email: 'david@example.com' }
  ]

  const sprints = [
    { id: 'sprint-1', name: 'Sprint 24', startDate: '2024-01-01', endDate: '2024-01-14' },
    { id: 'sprint-2', name: 'Sprint 25', startDate: '2024-01-15', endDate: '2024-01-28' },
    { id: 'sprint-3', name: 'Sprint 26', startDate: '2024-01-29', endDate: '2024-02-11' }
  ]

  const epics = [
    { id: 'epic-1', name: 'User Authentication' },
    { id: 'epic-2', name: 'Payment Processing' },
    { id: 'epic-3', name: 'Reporting Dashboard' },
    { id: 'epic-4', name: 'Mobile Responsiveness' }
  ]

  const boards = [
    { id: 'board-1', name: 'Development Board', columns: ['Todo', 'In Progress', 'Review', 'Done'] },
    { id: 'board-2', name: 'Bug Tracking', columns: ['Backlog', 'In Analysis', 'Fixing', 'Testing'] }
  ]

  const taskTypes = [
    { value: 'bug', label: 'Bug', icon: '🐛', color: 'red' },
    { value: 'feature', label: 'Feature', icon: '✨', color: 'green' },
    { value: 'enhancement', label: 'Enhancement', icon: '🚀', color: 'blue' },
    { value: 'documentation', label: 'Documentation', icon: '📚', color: 'purple' },
    { value: 'test', label: 'Test', icon: '🧪', color: 'yellow' },
    { value: 'research', label: 'Research', icon: '🔍', color: 'indigo' }
  ]

  const statuses = [
    { value: 'todo', label: 'To Do', icon: '📝', color: 'gray' },
    { value: 'in-progress', label: 'In Progress', icon: '⚙️', color: 'blue' },
    { value: 'review', label: 'Review', icon: '👀', color: 'purple' },
    { value: 'done', label: 'Done', icon: '✅', color: 'green' },
    { value: 'blocked', label: 'Blocked', icon: '🚫', color: 'red' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', icon: '⬇️', color: 'gray' },
    { value: 'medium', label: 'Medium', icon: '➡️', color: 'yellow' },
    { value: 'high', label: 'High', icon: '⬆️', color: 'orange' },
    { value: 'critical', label: 'Critical', icon: '🔥', color: 'red' }
  ]

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timeTracking.isRunning && timeTracking.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - timeTracking.startTime!.getTime()) / 1000)
        setTimeTracking(prev => ({ ...prev, elapsedSeconds: elapsed }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timeTracking.isRunning, timeTracking.startTime])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title) newErrors.title = 'Task title is required'
    if (!formData.projectId) newErrors.projectId = 'Project is required'
    if (!formData.assigneeId) newErrors.assigneeId = 'Assignee is required'
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past'
    }
    if (formData.startDate && formData.dueDate && 
        new Date(formData.startDate) > new Date(formData.dueDate)) {
      newErrors.startDate = 'Start date cannot be after due date'
    }
    if (formData.estimatedHours < 0) newErrors.estimatedHours = 'Estimated hours cannot be negative'
    if (formData.storyPoints < 0) newErrors.storyPoints = 'Story points cannot be negative'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      setActiveTab('details')
      return
    }
    setIsLoading(true)
    try {
      const updatedData = {
        ...formData,
        metadata: {
          ...formData.metadata,
          lastModified: new Date().toISOString(),
          modifiedBy: 'current-user-id'
        }
      }
      if (onSubmit) {
        await onSubmit(updatedData)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Task saved:', updatedData)
      }
      if (isModal && onClose) {
        onClose()
      } else {
        router.push(`/projects/${formData.projectId}/tasks`)
      }
    } catch (error) {
      console.error('Error saving task:', error)
      setErrors({ submit: 'Failed to save task. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value)
    }))
  }

  const addLabel = () => {
    if (labelInput && !formData.labels.includes(labelInput)) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput]
      }))
      setLabelInput('')
    }
  }

  const removeLabel = (label: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== label)
    }))
  }

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addSubtask = () => {
    if (selectedSubtask.title) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: selectedSubtask.title,
        status: 'todo',
        assigneeId: selectedSubtask.assigneeId,
        estimatedHours: selectedSubtask.estimatedHours,
        actualHours: 0
      }
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask]
      }))
      setSelectedSubtask({})
      setShowSubtaskForm(false)
    }
  }

  const updateSubtaskStatus = (subtaskId: string, status: 'todo' | 'done') => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(s => 
        s.id === subtaskId ? { ...s, status } : s
      )
    }))
  }

  const removeSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
    }))
  }

  const addDependency = () => {
    if (selectedDependency.taskId && selectedDependency.type) {
      const task = projects.find(p => p.id === selectedDependency.taskId)
      if (task) {
        const newDependency: Dependency = {
          id: Date.now().toString(),
          taskId: selectedDependency.taskId,
          taskTitle: task.name,
          type: selectedDependency.type as Dependency['type'],
          status: 'todo'
        }
        setFormData(prev => ({
          ...prev,
          dependencies: [...prev.dependencies, newDependency]
        }))
      }
      setSelectedDependency({})
      setShowDependencyForm(false)
    }
  }

  const removeDependency = (dependencyId: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d.id !== dependencyId)
    }))
  }

  const addComment = () => {
    if (commentInput.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        userName: 'Current User',
        content: commentInput,
        createdAt: new Date().toISOString(),
        isEdited: false
      }
      setFormData(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }))
      setCommentInput('')
      setShowCommentForm(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const startTimeTracking = () => {
    setTimeTracking({
      isRunning: true,
      startTime: new Date(),
      elapsedSeconds: 0
    })
  }

  const stopTimeTracking = () => {
    if (timeTracking.startTime) {
      const hoursLogged = timeTracking.elapsedSeconds / 3600
      setFormData(prev => ({
        ...prev,
        actualHours: prev.actualHours + hoursLogged
      }))
      setTimeTracking({
        isRunning: false,
        startTime: null,
        elapsedSeconds: 0
      })
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = taskTypes.find(t => t.value === type)
    return typeConfig?.icon || '📋'
  }

  const calculateSubtaskProgress = () => {
    if (formData.subtasks.length === 0) return 0
    const completed = formData.subtasks.filter(s => s.status === 'done').length
    return Math.round((completed / formData.subtasks.length) * 100)
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isModal ? 'max-w-4xl mx-auto' : ''}`}>
      
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getTypeIcon(formData.type)}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEditing ? `Task ID: ${taskId}` : 'Add a new task to your project'}
              </p>
            </div>
          </div>
          {isModal && onClose ? (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
          ) : (
            <Link href={projectId ? `/projects/${projectId}/tasks` : '/tasks'} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </Link>
          )}
        </div>
        {isEditing && taskId && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-xs font-mono text-gray-600">{taskId}</span>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 px-6 min-w-max">
          {['details', 'subtasks', 'dependencies', 'comments', 'attachments', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm capitalize border-b-2 ${
                activeTab === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
              {tab === 'comments' && formData.comments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">{formData.comments.length}</span>
              )}
              {tab === 'subtasks' && formData.subtasks.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {formData.subtasks.filter(s => s.status === 'done').length}/{formData.subtasks.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                }`}
                placeholder="e.g., Implement user authentication"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                <select
                  id="projectId" name="projectId" value={formData.projectId} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.projectId ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                >
                  <option value="">Select project</option>
                  {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
                {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                <select
                  id="type" name="type" value={formData.type} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  {taskTypes.map(type => <option key={type.value} value={type.value}>{type.icon} {type.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  id="status" name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  {statuses.map(status => <option key={status.value} value={status.value}>{status.icon} {status.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  id="priority" name="priority" value={formData.priority} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  {priorities.map(priority => <option key={priority.value} value={priority.value}>{priority.icon} {priority.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">Assignee *</label>
                <select
                  id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.assigneeId ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                >
                  <option value="">Select assignee</option>
                  {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
                {errors.assigneeId && <p className="mt-1 text-sm text-red-600">{errors.assigneeId}</p>}
              </div>
              <div>
                <label htmlFor="reporterId" className="block text-sm font-medium text-gray-700 mb-2">Reporter</label>
                <select
                  id="reporterId" name="reporterId" value={formData.reporterId} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.startDate ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.dueDate ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                />
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="storyPoints" className="block text-sm font-medium text-gray-700 mb-2">Story Points</label>
                <input
                  type="number" id="storyPoints" name="storyPoints" value={formData.storyPoints || ''} onChange={handleNumberChange}
                  min="0" step="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.storyPoints ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                  placeholder="0"
                />
                {errors.storyPoints && <p className="mt-1 text-sm text-red-600">{errors.storyPoints}</p>}
              </div>
              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                <input
                  type="number" id="estimatedHours" name="estimatedHours" value={formData.estimatedHours || ''} onChange={handleNumberChange}
                  min="0" step="0.5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.estimatedHours ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'
                  }`}
                  placeholder="0"
                />
                {errors.estimatedHours && <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>}
              </div>
              <div>
                <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
                <div className="relative">
                  <input
                    type="number" id="actualHours" name="actualHours" value={formData.actualHours.toFixed(1)} readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                  />
                  {timeTracking.isRunning ? (
                    <button type="button" onClick={stopTimeTracking}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                      ⏱️ {formatTime(timeTracking.elapsedSeconds)}
                    </button>
                  ) : (
                    <button type="button" onClick={startTimeTracking}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                      Start Timer
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sprint.id" className="block text-sm font-medium text-gray-700 mb-2">Sprint</label>
                <select
                  id="sprint.id" name="sprint.id" value={formData.sprint.id}
                  onChange={(e) => {
                    const sprint = sprints.find(s => s.id === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      sprint: sprint ? { 
                        id: sprint.id, 
                        name: sprint.name, 
                        startDate: sprint.startDate, 
                        endDate: sprint.endDate 
                      } : { id: '', name: '', startDate: '', endDate: '' }
                    }))
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  <option value="">No sprint</option>
                  {sprints.map(sprint => <option key={sprint.id} value={sprint.id}>{sprint.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="epic.id" className="block text-sm font-medium text-gray-700 mb-2">Epic</label>
                <select
                  id="epic.id" name="epic.id" value={formData.epic.id}
                  onChange={(e) => {
                    const selectedEpic = epics.find(epic => epic.id === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      epic: selectedEpic ? { id: selectedEpic.id, name: selectedEpic.name } : { id: '', name: '' }
                    }))
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  <option value="">No epic</option>
                  {epics.map(epic => <option key={epic.id} value={epic.id}>{epic.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="board.id" className="block text-sm font-medium text-gray-700 mb-2">Board</label>
                <select
                  id="board.id" name="board.id" value={formData.board.id}
                  onChange={(e) => {
                    const board = boards.find(b => b.id === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      board: board ? { 
                        id: board.id, 
                        name: board.name, 
                        column: prev.board.column 
                      } : { id: '', name: '', column: '' }
                    }))
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  <option value="">No board</option>
                  {boards.map(board => <option key={board.id} value={board.id}>{board.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="board.column" className="block text-sm font-medium text-gray-700 mb-2">Column</label>
                <select
                  id="board.column" name="board.column" value={formData.board.column} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                >
                  <option value="">Select column</option>
                  {formData.board.id && boards.find(b => b.id === formData.board.id)?.columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description" name="description" value={formData.description} onChange={handleChange}
                rows={6} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                placeholder="Describe the task in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={labelInput} onChange={(e) => setLabelInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., bug, frontend"
                  />
                  <button type="button" onClick={addLabel} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.labels.map(label => (
                    <span key={label} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                      {label}
                      <button type="button" onClick={() => removeLabel(label)} className="text-blue-500 hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                    placeholder="Add a tag"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(formData.customFields).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Custom Fields</h3>
                <div className="space-y-4">
                  {Object.entries(formData.customFields).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm text-gray-600 mb-1">{key}</label>
                      <input type="text" value={value as string}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          customFields: { ...prev.customFields, [key]: e.target.value }
                        }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subtasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Subtasks</h3>
                {formData.subtasks.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Progress: {calculateSubtaskProgress()}% ({formData.subtasks.filter(s => s.status === 'done').length}/{formData.subtasks.length})
                  </p>
                )}
              </div>
              <button type="button" onClick={() => setShowSubtaskForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                + Add Subtask
              </button>
            </div>

            {formData.subtasks.length > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 rounded-full h-2" style={{ width: `${calculateSubtaskProgress()}%` }}></div>
              </div>
            )}

            {showSubtaskForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Add Subtask</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input type="text" value={selectedSubtask.title || ''}
                        onChange={(e) => setSelectedSubtask({ ...selectedSubtask, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                      <select value={selectedSubtask.assigneeId || ''}
                        onChange={(e) => setSelectedSubtask({ ...selectedSubtask, assigneeId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      >
                        <option value="">Unassigned</option>
                        {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                      <input type="number" value={selectedSubtask.estimatedHours || ''}
                        onChange={(e) => setSelectedSubtask({ ...selectedSubtask, estimatedHours: parseInt(e.target.value) })}
                        min="0" step="0.5" className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setShowSubtaskForm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                    <button type="button" onClick={addSubtask} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Add Subtask
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formData.subtasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No subtasks added yet</p>
            ) : (
              <div className="space-y-3">
                {formData.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <input type="checkbox" checked={subtask.status === 'done'}
                        onChange={(e) => updateSubtaskStatus(subtask.id, e.target.checked ? 'done' : 'todo')}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <div>
                        <p className={`font-medium ${subtask.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {subtask.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>Assignee: {teamMembers.find(m => m.id === subtask.assigneeId)?.name || 'Unassigned'}</span>
                          {subtask.estimatedHours && <span>Est: {subtask.estimatedHours}h</span>}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeSubtask(subtask.id)} className="text-red-600 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Dependencies</h3>
              <button type="button" onClick={() => setShowDependencyForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                + Add Dependency
              </button>
            </div>

            {showDependencyForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Add Dependency</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
                      <select value={selectedDependency.taskId || ''}
                        onChange={(e) => setSelectedDependency({ ...selectedDependency, taskId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      >
                        <option value="">Select task</option>
                        <option value="task-1">Implement login</option>
                        <option value="task-2">Create database schema</option>
                        <option value="task-3">Design API endpoints</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dependency Type</label>
                      <select value={selectedDependency.type || ''}
                        onChange={(e) => setSelectedDependency({ ...selectedDependency, type: e.target.value as Dependency['type'] })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      >
                        <option value="blocks">Blocks</option>
                        <option value="blocked-by">Blocked By</option>
                        <option value="relates-to">Relates To</option>
                        <option value="duplicate-of">Duplicate Of</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setShowDependencyForm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                    <button type="button" onClick={addDependency} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Add Dependency
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formData.dependencies.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No dependencies added yet</p>
            ) : (
              <div className="space-y-3">
                {formData.dependencies.map((dependency) => (
                  <div key={dependency.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dependency.type === 'blocks' ? 'bg-red-100 text-red-700' :
                        dependency.type === 'blocked-by' ? 'bg-yellow-100 text-yellow-700' :
                        dependency.type === 'relates-to' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {dependency.type}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{dependency.taskTitle}</p>
                        <p className="text-xs text-gray-500">ID: {dependency.taskId}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeDependency(dependency.id)} className="text-red-600 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
              <button type="button" onClick={() => setShowCommentForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                + Add Comment
              </button>
            </div>

            {showCommentForm && (
              <div className="bg-gray-50 rounded-lg p-4">
                <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                  rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="Write a comment..."
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button type="button" onClick={() => setShowCommentForm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                  <button type="button" onClick={addComment} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {formData.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet</p>
            ) : (
              <div className="space-y-4">
                {formData.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-white font-medium">{comment.userName[0]}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-800">{comment.userName}</span>
                            <span className="text-xs text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                            {comment.isEdited && <span className="text-xs text-gray-400 ml-2">(edited)</span>}
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Attachments</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500">
              <input type="file" id="attachments" multiple onChange={handleFileUpload} className="hidden" />
              <label htmlFor="attachments" className="cursor-pointer">
                <span className="text-4xl mb-2 block">📎</span>
                <p className="text-gray-600 mb-1">Click to upload files</p>
                <p className="text-xs text-gray-400">Images, PDFs, Documents up to 50MB</p>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">New Uploads</h4>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{file.type?.startsWith('image/') ? '🖼️' : '📄'}</span>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeAttachment(index)} className="text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Activity History</h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6 relative">
                <div className="flex gap-4">
                  <div className="relative z-10">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">📝</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-medium text-gray-800">Task created</span>
                      <span className="text-xs text-gray-500 ml-2">{new Date(formData.metadata.createdAt).toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">by {formData.metadata.createdBy}</p>
                  </div>
                </div>

                {formData.metadata.lastModified !== formData.metadata.createdAt && (
                  <div className="flex gap-4">
                    <div className="relative z-10">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">✏️</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <p className="text-sm">
                        <span className="font-medium text-gray-800">Task updated</span>
                        <span className="text-xs text-gray-500 ml-2">{new Date(formData.metadata.lastModified).toLocaleString()}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">by {formData.metadata.modifiedBy}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Metadata</h4>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div><dt className="text-gray-500">Created</dt><dd className="text-gray-900">{new Date(formData.metadata.createdAt).toLocaleString()}</dd></div>
                <div><dt className="text-gray-500">Created By</dt><dd className="text-gray-900">{formData.metadata.createdBy}</dd></div>
                <div><dt className="text-gray-500">Last Modified</dt><dd className="text-gray-900">{new Date(formData.metadata.lastModified).toLocaleString()}</dd></div>
                <div><dt className="text-gray-500">Modified By</dt><dd className="text-gray-900">{formData.metadata.modifiedBy}</dd></div>
              </dl>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          {isModal && onClose ? (
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          ) : (
            <Link href={projectId ? `/projects/${projectId}/tasks` : '/tasks'} className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </Link>
          )}
          <button type="submit" disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2">
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}