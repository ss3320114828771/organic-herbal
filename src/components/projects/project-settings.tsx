'use client'

import React from 'react'
import Link from 'next/link'

interface ProjectSettingsProps {
  projectId: string
  projectName: string
  initialData?: ProjectSettingsData
  onSave?: (data: ProjectSettingsData) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

interface ProjectSettingsData {
  // General
  name: string
  description: string
  category: string
  status: 'active' | 'completed' | 'on-hold' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  
  // Dates
  startDate: string
  endDate: string
  estimatedHours: number
  
  // Client
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  
  // Budget
  budget: number
  currency: string
  hourlyRate: number
  
  // Repository
  repositoryUrl: string
  repositoryProvider: 'github' | 'gitlab' | 'bitbucket' | 'other'
  mainBranch: string
  
  // Documentation
  documentationUrl: string
  wikiUrl: string
  
  // Notifications
  notifyOnTaskComplete: boolean
  notifyOnMilestoneComplete: boolean
  notifyOnNewComment: boolean
  notifyOnStatusChange: boolean
  
  // Privacy
  visibility: 'private' | 'team' | 'public'
  allowPublicComments: boolean
  allowGuestAccess: boolean
  
  // Advanced
  autoArchive: boolean
  autoArchiveDays: number
  requireApproval: boolean
  enableTimeTracking: boolean
}

export default function ProjectSettings({
  projectId,
  projectName,
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  className = ''
}: ProjectSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('general')
  const [formData, setFormData] = React.useState<ProjectSettingsData>({
    // General
    name: projectName,
    description: '',
    category: '',
    status: 'active',
    priority: 'medium',
    
    // Dates
    startDate: '',
    endDate: '',
    estimatedHours: 0,
    
    // Client
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    
    // Budget
    budget: 0,
    currency: 'USD',
    hourlyRate: 0,
    
    // Repository
    repositoryUrl: '',
    repositoryProvider: 'github',
    mainBranch: 'main',
    
    // Documentation
    documentationUrl: '',
    wikiUrl: '',
    
    // Notifications
    notifyOnTaskComplete: true,
    notifyOnMilestoneComplete: true,
    notifyOnNewComment: true,
    notifyOnStatusChange: false,
    
    // Privacy
    visibility: 'private',
    allowPublicComments: false,
    allowGuestAccess: false,
    
    // Advanced
    autoArchive: false,
    autoArchiveDays: 30,
    requireApproval: false,
    enableTimeTracking: true,
    ...initialData
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date'
    }

    if (formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative'
    }

    if (formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Estimated hours cannot be negative'
    }

    if (formData.repositoryUrl && !formData.repositoryUrl.match(/^https?:\/\/.+/)) {
      newErrors.repositoryUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setActiveTab('general')
      return
    }

    setSaveStatus('saving')
    
    // Simulate API call
    setTimeout(() => {
      onSave?.(formData)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // Handle delete
      console.log('Delete project')
    }
    setShowDeleteConfirm(false)
  }

  const handleArchive = () => {
    setFormData(prev => ({ ...prev, status: 'archived' }))
    setShowArchiveConfirm(false)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <GeneralIcon /> },
    { id: 'client', label: 'Client', icon: <ClientIcon /> },
    { id: 'dates', label: 'Dates & Budget', icon: <CalendarIcon /> },
    { id: 'repository', label: 'Repository', icon: <RepoIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
    { id: 'privacy', label: 'Privacy', icon: <PrivacyIcon /> },
    { id: 'advanced', label: 'Advanced', icon: <AdvancedIcon /> }
  ]

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ]

  const categories = [
    'Software Development',
    'Marketing',
    'Design',
    'Research',
    'Business Development',
    'Education',
    'Construction',
    'Event Planning'
  ]

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Project Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure settings for {projectName}
            </p>
          </div>
          <Link
            href={`/projects/${projectId}`}
            className="text-sm text-gray-600 hover:text-green-600"
          >
            ← Back to project
          </Link>
        </div>

        {/* Save status */}
        {saveStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            Settings saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            Error saving settings. Please try again.
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex px-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-green-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Project description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex space-x-4">
                {['low', 'medium', 'high', 'critical'].map((priority) => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="mr-2 text-green-600"
                    />
                    <span className="text-sm text-gray-700 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Client Settings */}
        {activeTab === 'client' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dates & Budget */}
        {activeTab === 'dates' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.endDate
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-green-200'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleNumberChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.estimatedHours
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-green-200'
                }`}
              />
              {errors.estimatedHours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="flex">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 border border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleNumberChange}
                    min="0"
                    step="100"
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 ${
                      errors.budget
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-green-200'
                    }`}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleNumberChange}
                  min="0"
                  step="5"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Repository Settings */}
        {activeTab === 'repository' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository URL
              </label>
              <input
                type="url"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.repositoryUrl
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-green-200'
                }`}
              />
              {errors.repositoryUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.repositoryUrl}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  name="repositoryProvider"
                  value={formData.repositoryProvider}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                  <option value="bitbucket">Bitbucket</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Branch
                </label>
                <input
                  type="text"
                  name="mainBranch"
                  value={formData.mainBranch}
                  onChange={handleChange}
                  placeholder="main"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentation URL
              </label>
              <input
                type="url"
                name="documentationUrl"
                value={formData.documentationUrl}
                onChange={handleChange}
                placeholder="https://docs.example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wiki URL
              </label>
              <input
                type="url"
                name="wikiUrl"
                value={formData.wikiUrl}
                onChange={handleChange}
                placeholder="https://wiki.example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Email Notifications</h3>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Task completed</span>
                <p className="text-xs text-gray-500">Get notified when a task is marked as complete</p>
              </div>
              <input
                type="checkbox"
                name="notifyOnTaskComplete"
                checked={formData.notifyOnTaskComplete}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Milestone completed</span>
                <p className="text-xs text-gray-500">Get notified when a milestone is reached</p>
              </div>
              <input
                type="checkbox"
                name="notifyOnMilestoneComplete"
                checked={formData.notifyOnMilestoneComplete}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">New comments</span>
                <p className="text-xs text-gray-500">Get notified when someone comments on a task</p>
              </div>
              <input
                type="checkbox"
                name="notifyOnNewComment"
                checked={formData.notifyOnNewComment}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Status changes</span>
                <p className="text-xs text-gray-500">Get notified when project status changes</p>
              </div>
              <input
                type="checkbox"
                name="notifyOnStatusChange"
                checked={formData.notifyOnStatusChange}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 rounded"
              />
            </label>
          </div>
        )}

        {/* Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={handleChange}
                    className="mr-3 text-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Private</span>
                    <p className="text-xs text-gray-500">Only invited team members can access</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="team"
                    checked={formData.visibility === 'team'}
                    onChange={handleChange}
                    className="mr-3 text-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Team</span>
                    <p className="text-xs text-gray-500">All team members in organization can access</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={handleChange}
                    className="mr-3 text-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Public</span>
                    <p className="text-xs text-gray-500">Anyone with the link can view</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Allow public comments</span>
                  <p className="text-xs text-gray-500">Non-members can comment on public projects</p>
                </div>
                <input
                  type="checkbox"
                  name="allowPublicComments"
                  checked={formData.allowPublicComments}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Allow guest access</span>
                  <p className="text-xs text-gray-500">Share read-only access with external users</p>
                </div>
                <input
                  type="checkbox"
                  name="allowGuestAccess"
                  checked={formData.allowGuestAccess}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* Advanced */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable time tracking</span>
                  <p className="text-xs text-gray-500">Track time spent on tasks</p>
                </div>
                <input
                  type="checkbox"
                  name="enableTimeTracking"
                  checked={formData.enableTimeTracking}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Require approval</span>
                  <p className="text-xs text-gray-500">Tasks require approval before completion</p>
                </div>
                <input
                  type="checkbox"
                  name="requireApproval"
                  checked={formData.requireApproval}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Auto-archive</span>
                  <p className="text-xs text-gray-500">Automatically archive completed projects</p>
                </div>
                <input
                  type="checkbox"
                  name="autoArchive"
                  checked={formData.autoArchive}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </label>

              {formData.autoArchive && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archive after (days)
                  </label>
                  <input
                    type="number"
                    name="autoArchiveDays"
                    value={formData.autoArchiveDays}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-red-800">Archive project</span>
                    <p className="text-xs text-red-600">Move project to archived state</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowArchiveConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Archive
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-red-800">Delete project</span>
                    <p className="text-xs text-red-600">Permanently delete this project</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || saveStatus === 'saving'}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Archive Project</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to archive this project? It will be moved to archived state and won't appear in active projects.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Archive Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this project? This action cannot be undone. All tasks, files, and data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== ICON COMPONENTS ====================

function GeneralIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClientIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function RepoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function PrivacyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function AdvancedIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  )
}