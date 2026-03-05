'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProjectFormData {
  name: string
  slug: string
  description: string
  category: string
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  endDate: string
  estimatedHours: number
  actualHours: number
  budget: number
  currency: string
  client: {
    id: string
    name: string
    email: string
    company: string
    phone: string
  }
  team: TeamMember[]
  tasks: Task[]
  milestones: Milestone[]
  attachments: File[]
  existingAttachments?: Attachment[]
  technologies: string[]
  tags: string[]
  repository: {
    url: string
    provider: 'github' | 'gitlab' | 'bitbucket' | 'other'
    branch: string
  }
  documentation: {
    url: string
    notes: string
  }
  metadata: {
    createdAt: string
    createdBy: string
    lastModified: string
    modifiedBy: string
  }
  customFields: Record<string, any>
}

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  avatar?: string
  permissions: {
    canEdit: boolean
    canDelete: boolean
    canAddMembers: boolean
    canManageTasks: boolean
  }
  hoursAllocated: number
  hoursLogged: number
}

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  dueDate: string
  estimatedHours: number
  actualHours: number
  dependsOn: string[]
  attachments: string[]
  comments: TaskComment[]
  tags: string[]
}

interface TaskComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  attachments?: string[]
}

interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  completedDate?: string
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  tasks: string[]
  deliverables: string[]
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

interface ProjectFormProps {
  projectId?: string
  initialData?: Partial<ProjectFormData>
  onSubmit?: (data: ProjectFormData) => Promise<void>
  isEditing?: boolean
  isAdmin?: boolean
}

export default function ProjectForm({ 
  projectId, 
  initialData, 
  onSubmit,
  isEditing = false,
  isAdmin = false
}: ProjectFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    slug: '',
    description: '',
    category: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    estimatedHours: 0,
    actualHours: 0,
    budget: 0,
    currency: 'USD',
    client: {
      id: '',
      name: '',
      email: '',
      company: '',
      phone: ''
    },
    team: [],
    tasks: [],
    milestones: [],
    attachments: [],
    technologies: [],
    tags: [],
    repository: {
      url: '',
      provider: 'github',
      branch: 'main'
    },
    documentation: {
      url: '',
      notes: ''
    },
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: '',
      lastModified: new Date().toISOString(),
      modifiedBy: ''
    },
    customFields: {}
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [tagInput, setTagInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Partial<TeamMember>>({})
  const [selectedTask, setSelectedTask] = useState<Partial<Task>>({})
  const [selectedMilestone, setSelectedMilestone] = useState<Partial<Milestone>>({})

  // Mock data
  const categories = [
    'Web Development',
    'Mobile App',
    'Desktop Application',
    'API Development',
    'Cloud Migration',
    'DevOps',
    'Machine Learning',
    'Data Science',
    'IoT',
    'Blockchain',
    'Game Development',
    'E-commerce',
    'CMS',
    'CRM',
    'ERP'
  ]

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
  ]

  const teamRoles = [
    'Project Manager',
    'Tech Lead',
    'Senior Developer',
    'Developer',
    'Junior Developer',
    'UI/UX Designer',
    'QA Engineer',
    'DevOps Engineer',
    'Business Analyst',
    'Product Owner',
    'Scrum Master',
    'Stakeholder'
  ]

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Tech Lead' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'QA' },
    { id: '5', name: 'David Brown', email: 'david@example.com', role: 'DevOps' }
  ]

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
      
      // Generate slug from name if not provided
      if (!initialData.slug && initialData.name) {
        setFormData(prev => ({
          ...prev,
          slug: generateSlug(initialData.name || '')
        }))
      }
    }
  }, [initialData])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = 'Project name is required'
    if (!formData.slug) newErrors.slug = 'Slug is required'
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date'
    }

    if (formData.budget < 0) newErrors.budget = 'Budget cannot be negative'
    if (formData.estimatedHours < 0) newErrors.estimatedHours = 'Estimated hours cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setActiveTab('basic')
      return
    }

    setIsLoading(true)

    try {
      // Update metadata
      const updatedData = {
        ...formData,
        metadata: {
          ...formData.metadata,
          lastModified: new Date().toISOString(),
          modifiedBy: 'current-user-id' // Replace with actual user ID
        }
      }

      if (onSubmit) {
        await onSubmit(updatedData)
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Project saved:', updatedData)
      }
      
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error saving project:', error)
      setErrors({ submit: 'Failed to save project. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    // Handle nested objects
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

    // Auto-generate slug from name
    if (name === 'name' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }

    // Clear error for this field
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
      [name]: value === '' ? 0 : parseFloat(value)
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

  const addTechnology = () => {
    if (techInput && !formData.technologies.includes(techInput)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const addTeamMember = () => {
    if (selectedMember.userId) {
      const member = mockUsers.find(u => u.id === selectedMember.userId)
      if (member) {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          userId: member.id,
          name: member.name,
          email: member.email,
          role: selectedMember.role || 'Developer',
          permissions: {
            canEdit: false,
            canDelete: false,
            canAddMembers: false,
            canManageTasks: false
          },
          hoursAllocated: selectedMember.hoursAllocated || 40,
          hoursLogged: 0
        }
        setFormData(prev => ({
          ...prev,
          team: [...prev.team, newMember]
        }))
      }
      setSelectedMember({})
      setShowAddMember(false)
    }
  }

  const removeTeamMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m.id !== memberId)
    }))
  }

  const updateMemberPermissions = (memberId: string, permission: keyof TeamMember['permissions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map(m => 
        m.id === memberId 
          ? { ...m, permissions: { ...m.permissions, [permission]: value } }
          : m
      )
    }))
  }

  const addTask = () => {
    if (selectedTask.title) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: selectedTask.title,
        description: selectedTask.description || '',
        status: 'todo',
        priority: selectedTask.priority || 'medium',
        assignee: selectedTask.assignee,
        dueDate: selectedTask.dueDate || '',
        estimatedHours: selectedTask.estimatedHours || 0,
        actualHours: 0,
        dependsOn: [],
        attachments: [],
        comments: [],
        tags: []
      }
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }))
      setSelectedTask({})
      setShowAddTask(false)
    }
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, status } : t
      )
    }))
  }

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }))
  }

  const addMilestone = () => {
    if (selectedMilestone.name) {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        name: selectedMilestone.name,
        description: selectedMilestone.description || '',
        dueDate: selectedMilestone.dueDate || '',
        status: 'pending',
        tasks: [],
        deliverables: []
      }
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }))
      setSelectedMilestone({})
      setShowAddMilestone(false)
    }
  }

  const updateMilestoneStatus = (milestoneId: string, status: Milestone['status']) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId 
          ? { 
              ...m, 
              status,
              completedDate: status === 'completed' ? new Date().toISOString() : undefined
            }
          : m
      )
    }))
  }

  const removeMilestone = (milestoneId: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== milestoneId)
    }))
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

  // Calculate project progress
  const calculateProgress = () => {
    if (formData.tasks.length === 0) return 0
    const completedTasks = formData.tasks.filter(t => t.status === 'done').length
    return Math.round((completedTasks / formData.tasks.length) * 100)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing 
                ? `Editing project: ${formData.name}` 
                : 'Start a new project'}
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Progress Bar (for editing) */}
        {isEditing && formData.tasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-green-600">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 px-6 min-w-max">
          {['basic', 'team', 'tasks', 'milestones', 'resources', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        
        {/* Error Summary */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                  placeholder="e.g., E-commerce Platform Redesign"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.slug 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                  placeholder="e-commerce-platform-redesign"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Used in URLs: /projects/{formData.slug || 'project-name'}
                </p>
              </div>

              {/* Category and Status */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.category 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority and Dates */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.startDate 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.endDate 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>

              {/* Budget and Hours */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="flex gap-2">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-24 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>{curr.code}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget || ''}
                    onChange={handleNumberChange}
                    min="0"
                    step="1000"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.budget 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div>
                <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  id="estimatedHours"
                  name="estimatedHours"
                  value={formData.estimatedHours || ''}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.estimatedHours 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                  placeholder="0"
                />
                {errors.estimatedHours && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Hours Logged
                  </label>
                  <input
                    type="number"
                    id="actualHours"
                    name="actualHours"
                    value={formData.actualHours}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="0"
                    readOnly
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                }`}
                placeholder="Detailed project description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies / Stack
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-blue-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
              <button
                type="button"
                onClick={() => setShowAddMember(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Member
              </button>
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select User
                      </label>
                      <select
                        value={selectedMember.userId || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, userId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="">Choose a user...</option>
                        {mockUsers.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={selectedMember.role || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="">Select role...</option>
                        {teamRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours Allocated
                      </label>
                      <input
                        type="number"
                        value={selectedMember.hoursAllocated || 40}
                        onChange={(e) => setSelectedMember({ ...selectedMember, hoursAllocated: parseInt(e.target.value) })}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members List */}
            {formData.team.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No team members added yet</p>
            ) : (
              <div className="space-y-4">
                {formData.team.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-800">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-xs text-gray-400 mt-1">Role: {member.role}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Hours Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Hours Progress</span>
                        <span className="font-medium text-gray-700">
                          {member.hoursLogged} / {member.hoursAllocated} hrs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 rounded-full h-1.5"
                          style={{ width: `${(member.hoursLogged / member.hoursAllocated) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={member.permissions.canEdit}
                            onChange={(e) => updateMemberPermissions(member.id, 'canEdit', e.target.checked)}
                            className="w-3 h-3 text-green-600 rounded"
                          />
                          <span className="text-xs text-gray-600">Can Edit</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={member.permissions.canDelete}
                            onChange={(e) => updateMemberPermissions(member.id, 'canDelete', e.target.checked)}
                            className="w-3 h-3 text-green-600 rounded"
                          />
                          <span className="text-xs text-gray-600">Can Delete</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={member.permissions.canAddMembers}
                            onChange={(e) => updateMemberPermissions(member.id, 'canAddMembers', e.target.checked)}
                            className="w-3 h-3 text-green-600 rounded"
                          />
                          <span className="text-xs text-gray-600">Can Add Members</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={member.permissions.canManageTasks}
                            onChange={(e) => updateMemberPermissions(member.id, 'canManageTasks', e.target.checked)}
                            className="w-3 h-3 text-green-600 rounded"
                          />
                          <span className="text-xs text-gray-600">Can Manage Tasks</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Client Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="client.name" className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="client.name"
                    name="client.name"
                    value={formData.client.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Client name"
                  />
                </div>

                <div>
                  <label htmlFor="client.company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="client.company"
                    name="client.company"
                    value={formData.client.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label htmlFor="client.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="client.email"
                    name="client.email"
                    value={formData.client.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="client.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="client.phone"
                    name="client.phone"
                    value={formData.client.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Project Tasks</h3>
              <button
                type="button"
                onClick={() => setShowAddTask(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Task
              </button>
            </div>

            {/* Add Task Modal */}
            {showAddTask && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={selectedTask.title || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Task title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={selectedTask.description || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Task description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={selectedTask.priority || 'medium'}
                          onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value as Task['priority'] })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assignee
                        </label>
                        <select
                          value={selectedTask.assignee || ''}
                          onChange={(e) => setSelectedTask({ ...selectedTask, assignee: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        >
                          <option value="">Unassigned</option>
                          {formData.team.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={selectedTask.dueDate || ''}
                          onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Est. Hours
                        </label>
                        <input
                          type="number"
                          value={selectedTask.estimatedHours || ''}
                          onChange={(e) => setSelectedTask({ ...selectedTask, estimatedHours: parseInt(e.target.value) })}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addTask}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {formData.tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks added yet</p>
            ) : (
              <div className="space-y-4">
                {formData.tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'review' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Assignee: {task.assignee ? formData.team.find(m => m.id === task.assignee)?.name || 'Unknown' : 'Unassigned'}</span>
                          <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                          <span>Est: {task.estimatedHours}h</span>
                          <span>Actual: {task.actualHours}h</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Project Milestones</h3>
              <button
                type="button"
                onClick={() => setShowAddMilestone(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Milestone
              </button>
            </div>

            {/* Add Milestone Modal */}
            {showAddMilestone && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Add Milestone</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={selectedMilestone.name || ''}
                        onChange={(e) => setSelectedMilestone({ ...selectedMilestone, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Milestone name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={selectedMilestone.description || ''}
                        onChange={(e) => setSelectedMilestone({ ...selectedMilestone, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Milestone description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={selectedMilestone.dueDate || ''}
                        onChange={(e) => setSelectedMilestone({ ...selectedMilestone, dueDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddMilestone(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones List */}
            {formData.milestones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No milestones added yet</p>
            ) : (
              <div className="space-y-4">
                {formData.milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-800">{milestone.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            milestone.status === 'delayed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          {milestone.completedDate && (
                            <span>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                          )}
                          <span>Tasks: {milestone.tasks.length}</span>
                          <span>Deliverables: {milestone.deliverables.length}</span>
                        </div>
                      </div>

                      <select
                        value={milestone.status}
                        onChange={(e) => updateMilestoneStatus(milestone.id, e.target.value as Milestone['status'])}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Repository */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Repository</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="repository.url" className="block text-sm font-medium text-gray-700 mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    id="repository.url"
                    name="repository.url"
                    value={formData.repository.url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label htmlFor="repository.provider" className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    id="repository.provider"
                    name="repository.provider"
                    value={formData.repository.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="repository.branch" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Branch
                  </label>
                  <input
                    type="text"
                    id="repository.branch"
                    name="repository.branch"
                    value={formData.repository.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="main"
                  />
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentation</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="documentation.url" className="block text-sm font-medium text-gray-700 mb-2">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    id="documentation.url"
                    name="documentation.url"
                    value={formData.documentation.url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="https://docs.example.com"
                  />
                </div>

                <div>
                  <label htmlFor="documentation.notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Documentation Notes
                  </label>
                  <textarea
                    id="documentation.notes"
                    name="documentation.notes"
                    value={formData.documentation.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Additional documentation notes..."
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors mb-4">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="attachments" className="cursor-pointer">
                  <span className="text-4xl mb-2 block">📎</span>
                  <p className="text-gray-600 mb-1">Click to upload files</p>
                  <p className="text-xs text-gray-400">PDF, DOC, Images, ZIP up to 50MB</p>
                </label>
              </div>

              {/* Attachments List */}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Attachments */}
              {formData.existingAttachments && formData.existingAttachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Existing Files</p>
                  <div className="space-y-2">
                    {formData.existingAttachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="font-medium text-sm">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded by {attachment.uploadedBy} on {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Custom Fields */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Fields</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add custom metadata fields specific to your project
              </p>
              
              <div className="space-y-3">
                {Object.entries(formData.customFields).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={key}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                      readOnly
                    />
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [key]: e.target.value
                        }
                      }))}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFields = { ...formData.customFields }
                        delete newFields[key]
                        setFormData(prev => ({
                          ...prev,
                          customFields: newFields
                        }))
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const key = prompt('Enter field name:')
                  if (key) {
                    setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        [key]: ''
                      }
                    }))
                  }
                }}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + Add Custom Field
              </button>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Metadata</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <dt className="text-gray-600">Created At</dt>
                  <dd className="text-gray-900">
                    {formData.metadata.createdAt 
                      ? new Date(formData.metadata.createdAt).toLocaleString() 
                      : 'Not set'}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <dt className="text-gray-600">Created By</dt>
                  <dd className="text-gray-900">{formData.metadata.createdBy || 'Not set'}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <dt className="text-gray-600">Last Modified</dt>
                  <dd className="text-gray-900">
                    {formData.metadata.lastModified 
                      ? new Date(formData.metadata.lastModified).toLocaleString() 
                      : 'Not set'}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <dt className="text-gray-600">Modified By</dt>
                  <dd className="text-gray-900">{formData.metadata.modifiedBy || 'Not set'}</dd>
                </div>
              </dl>
            </div>

            {/* Danger Zone */}
            {isAdmin && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                  Irreversible actions that will affect this project.
                </p>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => {
                      if (confirm('Are you sure you want to archive this project?')) {
                        setFormData(prev => ({ ...prev, status: 'completed' }))
                      }
                    }}
                  >
                    Archive Project
                  </button>
                  
                  <button
                    type="button"
                    className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 border border-red-300"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                        console.log('Delete project')
                        router.push('/admin/projects')
                      }
                    }}
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/admin/projects"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              'Save Project'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}