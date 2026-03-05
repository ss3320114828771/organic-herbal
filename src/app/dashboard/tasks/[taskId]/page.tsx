'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  project: {
    id: string
    name: string
    color: string
  }
  projectId: string
  assignee: {
    id: string
    name: string
    email: string
    avatar: string
    role: string
  }
  reporter: {
    id: string
    name: string
    email: string
    avatar: string
    role: string
  }
  createdAt: string
  updatedAt: string
  dueDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
  attachments: Attachment[]
  comments: Comment[]
  subtasks: Subtask[]
  activity: Activity[]
}

interface Attachment {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  url: string
}

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  attachments: CommentAttachment[]
}

interface CommentAttachment {
  name: string
  size: string
}

interface Subtask {
  id: string
  title: string
  completed: boolean
  assignee: string
}

interface Activity {
  id: string
  user: string
  action: string
  target: string
  time: string
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.taskId as string
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockTask: Task = {
        id: taskId,
        title: 'Design homepage wireframes',
        description: 'Create wireframes for the new homepage design including header, hero section, features grid, and footer. Ensure mobile responsiveness and accessibility standards.',
        status: 'in-progress',
        priority: 'high',
        project: {
          id: 'proj-1',
          name: 'Website Redesign',
          color: 'from-blue-500 to-cyan-500'
        },
        projectId: 'proj-1',
        assignee: {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'JS',
          role: 'Lead Designer'
        },
        reporter: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'JD',
          role: 'Project Manager'
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
        dueDate: '2024-02-01T00:00:00Z',
        estimatedHours: 8,
        actualHours: 6,
        tags: ['design', 'homepage', 'wireframe'],
        attachments: [
          { id: 'att-1', name: 'homepage-wireframe.fig', size: '2.4 MB', uploadedBy: 'Jane Smith', uploadedAt: '2024-01-15T11:30:00Z', url: '#' },
          { id: 'att-2', name: 'design-specs.pdf', size: '1.2 MB', uploadedBy: 'Jane Smith', uploadedAt: '2024-01-15T11:35:00Z', url: '#' }
        ],
        comments: [
          {
            id: 'cmt-1',
            content: 'Great progress! Let me know if you need any clarification on the requirements.',
            user: { id: 'user-1', name: 'John Doe', avatar: 'JD' },
            createdAt: '2024-01-15T14:30:00Z',
            attachments: []
          },
          {
            id: 'cmt-2',
            content: 'I have uploaded the initial wireframes for review. Please check the attached file.',
            user: { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
            createdAt: '2024-01-15T15:45:00Z',
            attachments: [
              { name: 'wireframe-v1.fig', size: '1.8 MB' }
            ]
          }
        ],
        subtasks: [
          { id: 'sub-1', title: 'Research competitor websites', completed: true, assignee: 'Jane Smith' },
          { id: 'sub-2', title: 'Create low-fidelity wireframes', completed: true, assignee: 'Jane Smith' },
          { id: 'sub-3', title: 'Design high-fidelity mockups', completed: false, assignee: 'Jane Smith' },
          { id: 'sub-4', title: 'Create responsive variants', completed: false, assignee: 'Jane Smith' }
        ],
        activity: [
          { id: 'act-1', user: 'John Doe', action: 'assigned task to', target: 'Jane Smith', time: '2 days ago' },
          { id: 'act-2', user: 'Jane Smith', action: 'updated status to', target: 'In Progress', time: '1 day ago' },
          { id: 'act-3', user: 'Jane Smith', action: 'uploaded', target: 'homepage-wireframe.fig', time: '1 day ago' },
          { id: 'act-4', user: 'John Doe', action: 'added comment', target: '', time: '5 hours ago' }
        ]
      }
      setTask(mockTask)
      setLoading(false)
    }, 1000)
  }

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'from-blue-500 to-cyan-500', icon: '📝' },
    { value: 'in-progress', label: 'In Progress', color: 'from-yellow-500 to-orange-500', icon: '⚙️' },
    { value: 'review', label: 'Review', color: 'from-purple-500 to-pink-500', icon: '👀' },
    { value: 'done', label: 'Done', color: 'from-green-500 to-emerald-500', icon: '✅' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'from-green-500 to-emerald-500', icon: '🔽' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500', icon: '📌' },
    { value: 'high', label: 'High', color: 'from-orange-500 to-red-500', icon: '⚠️' },
    { value: 'critical', label: 'Critical', color: 'from-red-600 to-red-700', icon: '🔴' }
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
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return 'Unknown'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays === 1) return 'Yesterday'
      return `${diffDays} days ago`
    } catch {
      return 'Unknown'
    }
  }

  const isOverdue = (dateString: string): boolean => {
    if (!dateString) return false
    try {
      const date = new Date(dateString)
      const today = new Date()
      return date < today
    } catch {
      return false
    }
  }

  const calculateProgress = (): number => {
    if (!task?.subtasks || task.subtasks.length === 0) return 0
    const total = task.subtasks.length
    const completed = task.subtasks.filter((s: Subtask) => s.completed).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const handleAddComment = (): void => {
    if (!newComment.trim()) return
    console.log('Adding comment:', newComment)
    setNewComment('')
  }

  const handleDeleteTask = (): void => {
    console.log('Deleting task:', taskId)
    setShowDeleteModal(false)
    router.push('/dashboard/tasks')
  }

  const handleStatusChange = (newStatus: string): void => {
    if (task) {
      setTask({ ...task, status: newStatus })
      console.log('Status changed to:', newStatus)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading task...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Not Found</h2>
          <p className="text-white/60 mb-6">The task you're looking for doesn't exist or you don't have access.</p>
          <Link
            href="/dashboard/tasks"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/tasks"
              className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center"
            >
              <span className="mr-1">←</span>
              Back to Tasks
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href={`/dashboard/projects/${task.projectId}`}
              className="text-white/60 hover:text-white transition-colors"
            >
              {task.project?.name}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{task.title}</h1>
          <p className="text-white/60">{task.description}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center"
          >
            <span className="mr-2">✏️</span>
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors flex items-center"
          >
            <span className="mr-2">🗑️</span>
            Delete
          </button>
        </div>
      </div>

      {/* Status and Priority Bar */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-white/60">Status:</span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getStatusColor(task.status)} text-white border-0 focus:ring-2 focus:ring-white/30`}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white/60">Priority:</span>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white flex items-center`}>
                <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                {task.priority}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">
              Created {formatRelativeTime(task.createdAt)}
            </span>
            {task.dueDate && (
              <span className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white/60'}`}>
                Due {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && task.status !== 'done' && ' ⚠️'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b border-white/10">
            <div className="flex space-x-8">
              {['overview', 'subtasks', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 capitalize font-semibold transition-all relative ${
                    activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                <p className="text-white/80 leading-relaxed">{task.description}</p>
              </div>

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Attachments</h3>
                  <div className="space-y-3">
                    {task.attachments.map((file: Attachment) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                            📎
                          </div>
                          <div>
                            <p className="text-white font-medium">{file.name}</p>
                            <p className="text-white/40 text-xs">
                              {file.size} • Uploaded by {file.uploadedBy} • {formatRelativeTime(file.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                            ⬇️
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Preview">
                            👁️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subtasks Tab */}
          {activeTab === 'subtasks' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Subtasks</h3>
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  + Add Subtask
                </button>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white font-semibold">{calculateProgress()}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3">
                {task.subtasks.map((subtask: Subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-white/30 bg-white/10"
                      />
                      <span className={`${subtask.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                        {subtask.title}
                      </span>
                    </div>
                    {subtask.assignee && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {subtask.assignee.charAt(0)}
                        </div>
                        <span className="text-white/40 text-sm">{subtask.assignee}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6">Activity Log</h3>
              <div className="space-y-4">
                {task.activity.map((activity: Activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                        {activity.target && <span className="text-purple-400">{activity.target}</span>}
                      </p>
                      <p className="text-white/40 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* People */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">People</h3>
            
            {/* Assignee */}
            {task.assignee && (
              <div className="mb-4">
                <p className="text-white/40 text-sm mb-2">Assignee</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {task.assignee.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{task.assignee.name}</p>
                    <p className="text-white/40 text-xs">{task.assignee.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reporter */}
            {task.reporter && (
              <div>
                <p className="text-white/40 text-sm mb-2">Reporter</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {task.reporter.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{task.reporter.name}</p>
                    <p className="text-white/40 text-xs">{task.reporter.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/40">Project</span>
                <Link href={`/dashboard/projects/${task.projectId}`} className="text-purple-400 hover:text-purple-300">
                  {task.project?.name}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Status</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getStatusColor(task.status)} text-white`}>
                  {statusOptions.find(s => s.value === task.status)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Priority</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} text-white flex items-center`}>
                  <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                  {task.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Created</span>
                <span className="text-white/80">{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Updated</span>
                <span className="text-white/80">{formatDate(task.updatedAt)}</span>
              </div>
              {task.dueDate && (
                <div className="flex justify-between">
                  <span className="text-white/40">Due Date</span>
                  <span className={isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white/80'}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
              {task.estimatedHours && (
                <div className="flex justify-between">
                  <span className="text-white/40">Est. Hours</span>
                  <span className="text-white/80">{task.estimatedHours}h</span>
                </div>
              )}
              {task.actualHours && (
                <div className="flex justify-between">
                  <span className="text-white/40">Actual Hours</span>
                  <span className="text-white/80">{task.actualHours}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="mr-2">👤</span>
                Change Assignee
              </button>
              <button className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="mr-2">📅</span>
                Update Due Date
              </button>
              <button className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="mr-2">🏷️</span>
                Add Tags
              </button>
              <button className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center">
                <span className="mr-2">📎</span>
                Add Attachment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-6">Comments</h3>

        {/* Comments List */}
        <div className="space-y-4 mb-6">
          {task.comments.map((comment: Comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.user.avatar}
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold">{comment.user.name}</span>
                    <span className="text-white/40 text-xs">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-white/80">{comment.content}</p>
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      {comment.attachments.map((att: CommentAttachment, idx: number) => (
                        <div key={idx} className="flex items-center space-x-1 bg-white/10 rounded-lg px-3 py-1">
                          <span className="text-white/40">📎</span>
                          <span className="text-white/60 text-sm">{att.name}</span>
                          <span className="text-white/40 text-xs">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            HS
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Task</h3>
              <p className="text-white/60 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}