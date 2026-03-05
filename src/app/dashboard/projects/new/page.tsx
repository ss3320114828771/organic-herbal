'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    category: 'development',
    priority: 'medium',
    
    // Timeline
    startDate: '',
    dueDate: '',
    
    // Budget & Resources
    budget: '',
    estimatedHours: '',
    teamSize: '5',
    
    // Settings
    visibility: 'private',
    allowComments: true,
    allowAttachments: true,
    notifyMembers: true,
    
    // Templates
    useTemplate: false,
    templateId: '',
    
    // Team
    members: [] as { id: string; role: string }[]
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    { value: 'development', label: 'Software Development', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'research', label: 'Research', icon: '🔬' },
    { value: 'sales', label: 'Sales', icon: '💰' },
    { value: 'other', label: 'Other', icon: '📁' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'from-green-500 to-emerald-500', icon: '🔽' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500', icon: '📌' },
    { value: 'high', label: 'High', color: 'from-orange-500 to-red-500', icon: '⚠️' },
    { value: 'critical', label: 'Critical', color: 'from-red-600 to-red-700', icon: '🔴' }
  ]

  const templates = [
    { id: 'agile', name: 'Agile Development', icon: '🔄', tasks: 15, members: 6 },
    { id: 'design', name: 'Design Sprint', icon: '🎨', tasks: 12, members: 4 },
    { id: 'marketing', name: 'Marketing Campaign', icon: '📢', tasks: 10, members: 5 },
    { id: 'research', name: 'Research Project', icon: '🔬', tasks: 8, members: 3 }
  ]

  const teamMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', role: 'member' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', role: 'member' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', role: 'member' },
    { id: '5', name: 'Tom Brown', email: 'tom@example.com', avatar: 'TB', role: 'viewer' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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

  const handleMemberToggle = (memberId: string, role: string = 'member') => {
    setFormData(prev => {
      const exists = prev.members.find(m => m.id === memberId)
      if (exists) {
        return {
          ...prev,
          members: prev.members.filter(m => m.id !== memberId)
        }
      } else {
        return {
          ...prev,
          members: [...prev.members, { id: memberId, role }]
        }
      }
    })
  }

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must be less than 100 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate)
      const due = new Date(formData.dueDate)
      if (due < start) {
        newErrors.dueDate = 'Due date cannot be before start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget cannot be negative'
    }
    
    if (formData.estimatedHours && parseInt(formData.estimatedHours) < 0) {
      newErrors.estimatedHours = 'Estimated hours cannot be negative'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = true
    
    if (currentStep === 1) {
      isValid = validateStep1()
    } else if (currentStep === 2) {
      isValid = validateStep2()
    } else if (currentStep === 3) {
      isValid = validateStep3()
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Project created:', formData)
      
      // Redirect to projects list
      router.push('/dashboard/projects?created=true')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, name: 'Basic Info', icon: '📋' },
    { number: 2, name: 'Timeline', icon: '📅' },
    { number: 3, name: 'Resources', icon: '💰' },
    { number: 4, name: 'Team', icon: '👥' }
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/dashboard/projects"
          className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center mb-4"
        >
          <span className="mr-2">←</span>
          Back to Projects
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-white/60">
          Set up a new project with all the details and configurations
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 w-full h-1 bg-white/10 rounded-full"></div>
          
          {/* Active Progress */}
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isActive = step.number <= currentStep
              const isCurrent = step.number === currentStep

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-white/10 text-white/40'
                    } ${isCurrent ? 'scale-110 ring-4 ring-white/30' : ''}`}
                  >
                    {isActive ? step.icon : step.number}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            
            {/* Project Name */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:border-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="e.g., Website Redesign"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                placeholder="Describe your project goals and objectives..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.category === cat.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                        : 'border-white/20 hover:border-purple-500 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Priority</label>
              <div className="flex gap-3">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.priority === priority.value
                        ? `bg-gradient-to-r ${priority.color} text-white border-transparent`
                        : 'border-white/20 hover:border-purple-500'
                    }`}
                  >
                    <div className="text-xl mb-1">{priority.icon}</div>
                    <div className="text-sm font-medium">{priority.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Toggle */}
            <div className="pt-4">
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                <div>
                  <span className="text-white font-medium block">Use Template</span>
                  <span className="text-white/40 text-sm">Start with a pre-configured template</span>
                </div>
                <input
                  type="checkbox"
                  name="useTemplate"
                  checked={formData.useTemplate}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                />
              </label>
            </div>

            {/* Template Selection */}
            {formData.useTemplate && (
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, templateId: template.id }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.templateId === template.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                        : 'border-white/20 hover:border-purple-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-sm opacity-80 mt-1">
                      {template.tasks} tasks · {template.members} members
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Timeline */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Project Timeline</h2>
            
            {/* Start Date */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:border-purple-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            {/* Timeline Preview */}
            {formData.startDate && formData.dueDate && (
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Timeline Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white">
                    {Math.ceil(
                      (new Date(formData.dueDate).getTime() - new Date(formData.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Resources */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Budget & Resources</h2>
            
            {/* Budget */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Budget ($)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:border-purple-500 ${
                  errors.budget ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="50000"
              />
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Estimated Hours</label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:border-purple-500 ${
                  errors.estimatedHours ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="320"
              />
              {errors.estimatedHours && (
                <p className="text-red-400 text-sm mt-1">{errors.estimatedHours}</p>
              )}
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Team Size</label>
              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} members</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Team */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Team Members</h2>
            
            {/* Member Selection */}
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-white/40 text-sm">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={formData.members.find(m => m.id === member.id)?.role || 'member'}
                      onChange={(e) => {
                        const exists = formData.members.find(m => m.id === member.id)
                        if (exists) {
                          handleMemberToggle(member.id, e.target.value)
                          handleMemberToggle(member.id) // Toggle off
                          handleMemberToggle(member.id, e.target.value) // Toggle on with new role
                        }
                      }}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      onClick={() => handleMemberToggle(member.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        formData.members.some(m => m.id === member.id)
                          ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {formData.members.some(m => m.id === member.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Members Summary */}
            {formData.members.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Selected Members ({formData.members.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.members.map((member) => {
                    const user = teamMembers.find(m => m.id === member.id)
                    return (
                      <div
                        key={member.id}
                        className="flex items-center space-x-1 bg-white/10 rounded-full pl-2 pr-3 py-1"
                      >
                        <span className="text-white text-sm">{user?.name}</span>
                        <span className="text-white/40 text-xs ml-1">({member.role})</span>
                        <button
                          onClick={() => handleMemberToggle(member.id)}
                          className="ml-2 text-white/40 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            ← Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Project...
                </>
              ) : (
                'Create Project →'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tips Card */}
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          💡 <span className="font-semibold">Tip:</span> You can always change these settings later from the project settings page.
        </p>
      </div>
    </div>
  )
}