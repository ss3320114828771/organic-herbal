'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SettingsProps {
  project: any
}

export default function Settings({ project }: SettingsProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    category: '',
    startDate: '',
    dueDate: '',
    budget: '',
    estimatedHours: '',
    visibility: 'private',
    allowComments: true,
    allowAttachments: true,
    notifyMembers: true,
    autoCloseTasks: false
  })

  useEffect(() => {
    setMounted(true)
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'In Progress',
        priority: project.priority || 'Medium',
        category: project.category || 'Development',
        startDate: project.startDate || '',
        dueDate: project.dueDate || '',
        budget: project.budget?.toString() || '',
        estimatedHours: project.estimatedHours?.toString() || '',
        visibility: project.visibility || 'private',
        allowComments: project.allowComments !== false,
        allowAttachments: project.allowAttachments !== false,
        notifyMembers: project.notifyMembers !== false,
        autoCloseTasks: project.autoCloseTasks || false
      })
    }
  }, [project])

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'permissions', name: 'Permissions', icon: '🔐' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔌' },
    { id: 'advanced', name: 'Advanced', icon: '🚀' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 1500)
  }

  const handleDeleteProject = () => {
    console.log('Deleting project:', project.id)
    setShowDeleteModal(false)
    // Redirect to projects list
    window.location.href = '/dashboard/projects'
  }

  const handleArchiveProject = () => {
    console.log('Archiving project:', project.id)
    setShowArchiveModal(false)
    // Update project status
  }

  const statusOptions = [
    'Planning',
    'In Progress',
    'Review',
    'Completed',
    'On Hold',
    'Cancelled'
  ]

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical']
  
  const categoryOptions = [
    'Development',
    'Design',
    'Marketing',
    'Research',
    'Sales',
    'Support',
    'Other'
  ]

  const visibilityOptions = [
    { value: 'private', label: 'Private', description: 'Only invited members can access' },
    { value: 'team', label: 'Team', description: 'All team members can access' },
    { value: 'public', label: 'Public', description: 'Anyone with the link can view' }
  ]

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Settings</h2>
          <p className="text-white/60">
            Configure project preferences, team access, and advanced options
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowArchiveModal(true)}
            className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 transition-colors"
          >
            Archive Project
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-white/10">
        <div className="flex space-x-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 flex items-center space-x-2 font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">General Settings</h3>
            
            <div className="space-y-6">
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter project name"
                  required
                />
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
                  placeholder="Enter project description"
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {priorityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-white/80 text-sm mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Budget and Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Budget ($)</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Settings */}
        {activeTab === 'team' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">Team Management</h3>
            
            <div className="space-y-6">
              {/* Current Team */}
              <div>
                <label className="block text-white/80 text-sm mb-3">Current Team Members</label>
                <div className="space-y-3">
                  {project?.team?.map((member: any, index: number) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-white/40 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <select
                        defaultValue={member.role}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Member */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Add Team Member</label>
                <div className="flex gap-3">
                  <select className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="">Select user...</option>
                    <option value="user6">Alice Brown</option>
                    <option value="user7">Bob Wilson</option>
                    <option value="user8">Carol Davis</option>
                  </select>
                  <select className="w-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors">
                    Add
                  </button>
                </div>
              </div>

              {/* Team Settings */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Allow members to invite others</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/30 bg-white/10"
                    defaultChecked
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Allow members to remove members</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/30 bg-white/10"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Settings */}
        {activeTab === 'permissions' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">Permissions & Access</h3>
            
            <div className="space-y-6">
              {/* Visibility */}
              <div>
                <label className="block text-white/80 text-sm mb-3">Project Visibility</label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start p-3 bg-white/5 rounded-xl cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="text-white font-medium block">{option.label}</span>
                        <span className="text-white/40 text-sm">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Role Permissions */}
              <div>
                <label className="block text-white/80 text-sm mb-3">Role Permissions</label>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-semibold mb-3">Admin</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Create tasks', 'Edit tasks', 'Delete tasks', 'Manage members', 'Edit project', 'Delete project'].map(perm => (
                        <label key={perm} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-white/30" defaultChecked />
                          <span className="text-white/60 text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-semibold mb-3">Member</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Create tasks', 'Edit own tasks', 'Comment', 'Upload files'].map(perm => (
                        <label key={perm} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-white/30" defaultChecked />
                          <span className="text-white/60 text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-semibold mb-3">Viewer</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['View tasks', 'View files', 'View comments'].map(perm => (
                        <label key={perm} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-white/30" defaultChecked />
                          <span className="text-white/60 text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">Notification Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white font-medium">Task Created</span>
                  <p className="text-white/40 text-sm">Notify when new tasks are created</p>
                </div>
                <input
                  type="checkbox"
                  name="notifyTaskCreated"
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                  defaultChecked
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white font-medium">Task Completed</span>
                  <p className="text-white/40 text-sm">Notify when tasks are completed</p>
                </div>
                <input
                  type="checkbox"
                  name="notifyTaskCompleted"
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                  defaultChecked
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white font-medium">New Comments</span>
                  <p className="text-white/40 text-sm">Notify when comments are added</p>
                </div>
                <input
                  type="checkbox"
                  name="notifyComments"
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                  defaultChecked
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white font-medium">File Uploads</span>
                  <p className="text-white/40 text-sm">Notify when files are uploaded</p>
                </div>
                <input
                  type="checkbox"
                  name="notifyFiles"
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                  defaultChecked
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <span className="text-white font-medium">Member Changes</span>
                  <p className="text-white/40 text-sm">Notify when team members are added/removed</p>
                </div>
                <input
                  type="checkbox"
                  name="notifyMembers"
                  checked={formData.notifyMembers}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/30 bg-white/10"
                />
              </label>

              <div className="pt-4">
                <label className="block text-white/80 text-sm mb-2">Notification Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="notifications@example.com"
                  defaultValue={project?.owner?.email}
                />
              </div>
            </div>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">Integrations</h3>
            
            <div className="space-y-4">
              {[
                { name: 'GitHub', icon: '🐙', description: 'Connect repository and track commits', connected: true },
                { name: 'Slack', icon: '💬', description: 'Get notifications in Slack channels', connected: false },
                { name: 'Jira', icon: '📊', description: 'Sync tasks with Jira issues', connected: false },
                { name: 'Figma', icon: '🎨', description: 'Embed Figma designs', connected: true },
                { name: 'Google Drive', icon: '📁', description: 'Attach files from Google Drive', connected: false },
                { name: 'Dropbox', icon: '📦', description: 'Link Dropbox files', connected: false }
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold">{integration.name}</h4>
                      <p className="text-white/40 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      integration.connected
                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {integration.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6">Advanced Settings</h3>
            
            <div className="space-y-6">
              {/* Project Features */}
              <div className="space-y-3">
                <h4 className="text-white/80 font-semibold">Project Features</h4>
                
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Allow comments on tasks</span>
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/30 bg-white/10"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Allow file attachments</span>
                  <input
                    type="checkbox"
                    name="allowAttachments"
                    checked={formData.allowAttachments}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/30 bg-white/10"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Auto-close completed tasks</span>
                  <input
                    type="checkbox"
                    name="autoCloseTasks"
                    checked={formData.autoCloseTasks}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/30 bg-white/10"
                  />
                </label>
              </div>

              {/* API Access */}
              <div className="space-y-3">
                <h4 className="text-white/80 font-semibold">API Access</h4>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white">API Key</span>
                    <button className="text-purple-400 hover:text-purple-300 text-sm">Generate New</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-black/30 rounded-lg text-white/60 font-mono text-sm">
                      pk_proj_••••••••••••••••
                    </code>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      📋
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-2">Use this key to access project data via API</p>
                </div>
              </div>

              {/* Webhooks */}
              <div className="space-y-3">
                <h4 className="text-white/80 font-semibold">Webhooks</h4>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white">Endpoint URL</span>
                    <button className="text-purple-400 hover:text-purple-300 text-sm">+ Add</button>
                  </div>
                  <p className="text-white/40 text-sm">No webhooks configured</p>
                </div>
              </div>

              {/* Data Export */}
              <div className="space-y-3">
                <h4 className="text-white/80 font-semibold">Data Export</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left">
                    <span className="text-2xl block mb-2">📊</span>
                    <span className="text-white font-medium">Export as CSV</span>
                    <p className="text-white/40 text-xs">Download all tasks and data</p>
                  </button>
                  <button className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left">
                    <span className="text-2xl block mb-2">📄</span>
                    <span className="text-white font-medium">Export as PDF</span>
                    <p className="text-white/40 text-xs">Generate project report</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Project</h3>
              <p className="text-white/60 mb-6">
                Are you sure you want to delete "{project?.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Archive Project</h3>
              <p className="text-white/60 mb-6">
                Move "{project?.name}" to archive? You can restore it later.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleArchiveProject}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}