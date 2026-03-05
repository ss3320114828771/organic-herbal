'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock projects data
  const projects = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design, improved UX, and mobile responsiveness.',
      status: 'in-progress',
      progress: 75,
      priority: 'high',
      category: 'development',
      startDate: '2024-01-01',
      dueDate: '2024-03-30',
      budget: 50000,
      spent: 37500,
      team: [
        { id: 'u1', name: 'John Doe', avatar: 'JD' },
        { id: 'u2', name: 'Jane Smith', avatar: 'JS' },
        { id: 'u3', name: 'Mike Johnson', avatar: 'MJ' },
        { id: 'u4', name: 'Sarah Wilson', avatar: 'SW' }
      ],
      tasks: { total: 24, completed: 18 },
      owner: 'John Doe',
      starred: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Create native mobile app for iOS and Android platforms with React Native.',
      status: 'planning',
      progress: 25,
      priority: 'medium',
      category: 'development',
      startDate: '2024-02-15',
      dueDate: '2024-05-30',
      budget: 75000,
      spent: 18750,
      team: [
        { id: 'u1', name: 'John Doe', avatar: 'JD' },
        { id: 'u5', name: 'Tom Brown', avatar: 'TB' },
        { id: 'u6', name: 'Alice Green', avatar: 'AG' }
      ],
      tasks: { total: 32, completed: 8 },
      owner: 'Jane Smith',
      starred: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      name: 'Marketing Campaign Q2',
      description: 'Digital marketing campaign for new product launch including social media, email, and PPC.',
      status: 'in-progress',
      progress: 60,
      priority: 'high',
      category: 'marketing',
      startDate: '2024-01-10',
      dueDate: '2024-04-15',
      budget: 35000,
      spent: 21000,
      team: [
        { id: 'u2', name: 'Jane Smith', avatar: 'JS' },
        { id: 'u7', name: 'Emily Davis', avatar: 'ED' },
        { id: 'u8', name: 'Chris Lee', avatar: 'CL' }
      ],
      tasks: { total: 18, completed: 11 },
      owner: 'Jane Smith',
      starred: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '4',
      name: 'Research Project',
      description: 'Market research and competitor analysis for new product line.',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      category: 'research',
      startDate: '2023-11-01',
      dueDate: '2024-01-30',
      budget: 25000,
      spent: 23000,
      team: [
        { id: 'u3', name: 'Mike Johnson', avatar: 'MJ' },
        { id: 'u9', name: 'Nina Patel', avatar: 'NP' }
      ],
      tasks: { total: 15, completed: 15 },
      owner: 'Mike Johnson',
      starred: false,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '5',
      name: 'Design System',
      description: 'Create comprehensive design system with components, styles, and documentation.',
      status: 'in-progress',
      progress: 45,
      priority: 'low',
      category: 'design',
      startDate: '2024-01-20',
      dueDate: '2024-03-15',
      budget: 30000,
      spent: 13500,
      team: [
        { id: 'u4', name: 'Sarah Wilson', avatar: 'SW' },
        { id: 'u10', name: 'David Kim', avatar: 'DK' },
        { id: 'u11', name: 'Lisa Chen', avatar: 'LC' }
      ],
      tasks: { total: 22, completed: 10 },
      owner: 'Sarah Wilson',
      starred: false,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: '6',
      name: 'Sales Training Program',
      description: 'Develop and implement sales training program for new hires.',
      status: 'planning',
      progress: 10,
      priority: 'medium',
      category: 'sales',
      startDate: '2024-03-01',
      dueDate: '2024-04-30',
      budget: 20000,
      spent: 2000,
      team: [
        { id: 'u5', name: 'Tom Brown', avatar: 'TB' },
        { id: 'u12', name: 'Rachel Green', avatar: 'RG' }
      ],
      tasks: { total: 12, completed: 1 },
      owner: 'Tom Brown',
      starred: false,
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: '📊' },
    { value: 'planning', label: 'Planning', icon: '📝', color: 'from-gray-500 to-gray-600' },
    { value: 'in-progress', label: 'In Progress', icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
    { value: 'completed', label: 'Completed', icon: '✅', color: 'from-green-500 to-emerald-500' },
    { value: 'on-hold', label: 'On Hold', icon: '⏸️', color: 'from-yellow-500 to-orange-500' }
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '📁' },
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'research', label: 'Research', icon: '🔬' },
    { value: 'sales', label: 'Sales', icon: '💰' }
  ]

  const priorityColors = {
    low: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500',
    high: 'from-orange-500 to-red-500',
    critical: 'from-red-600 to-red-700'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planning': return 'from-gray-500 to-gray-600'
      case 'in-progress': return 'from-blue-500 to-cyan-500'
      case 'completed': return 'from-green-500 to-emerald-500'
      case 'on-hold': return 'from-yellow-500 to-orange-500'
      default: return 'from-purple-500 to-pink-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'low': return '🔽'
      case 'medium': return '📌'
      case 'high': return '⚠️'
      case 'critical': return '🔴'
      default: return '📌'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      case 'oldest':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'progress':
        return b.progress - a.progress
      case 'due-date':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      default:
        return 0
    }
  })

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const toggleAllProjects = () => {
    if (selectedProjects.length === sortedProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(sortedProjects.map(p => p.id))
    }
  }

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/60">
            Manage and track all your projects in one place
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="mr-2">📊</span>
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="mr-2">📋</span>
              List
            </button>
          </div>

          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <p className="text-white/40 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
          <p className="text-blue-300 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-300">{stats.inProgress}</p>
        </div>
        <div className="bg-green-500/10 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
          <p className="text-green-300 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-300">{stats.completed}</p>
        </div>
        <div className="bg-yellow-500/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
          <p className="text-yellow-300 text-sm">Planning</p>
          <p className="text-2xl font-bold text-yellow-300">{stats.planning}</p>
        </div>
        <div className="bg-purple-500/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-300 text-sm">Budget</p>
          <p className="text-2xl font-bold text-purple-300">${(stats.totalBudget / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-pink-500/10 backdrop-blur-lg rounded-xl p-4 border border-pink-500/30">
          <p className="text-pink-300 text-sm">Spent</p>
          <p className="text-2xl font-bold text-pink-300">${(stats.totalSpent / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search projects by name, description, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-colors flex items-center ${
              showFilters ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="mr-2">⚙️</span>
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            {/* Status Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="newest">🆕 Newest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="name-asc">🔤 Name (A-Z)</option>
                <option value="name-desc">🔤 Name (Z-A)</option>
                <option value="progress">📊 Progress</option>
                <option value="due-date">⏰ Due Date</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all')
                  setFilterCategory('all')
                  setSortBy('newest')
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-purple-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                📋 Archive
              </button>
              <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                📊 Update Status
              </button>
              <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${project.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {project.category === 'development' && '💻'}
                    {project.category === 'design' && '🎨'}
                    {project.category === 'marketing' && '📢'}
                    {project.category === 'research' && '🔬'}
                    {project.category === 'sales' && '💰'}
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.starred && (
                      <span className="text-yellow-400 text-xl">⭐</span>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={(e) => {
                        e.preventDefault()
                        toggleProjectSelection(project.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-white/40 text-sm line-clamp-2">{project.description}</p>
                </div>

                {/* Status and Priority */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                    {statusOptions.find(s => s.value === project.status)?.icon} {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${priorityColors[project.priority as keyof typeof priorityColors]} text-white`}>
                    {getPriorityIcon(project.priority)} {project.priority}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team and Tasks */}
                <div className="flex items-center justify-between mb-4">
                  {/* Team Avatars */}
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                    {project.team.length > 4 && (
                      <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs">
                        +{project.team.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="flex items-center space-x-1">
                    <span className="text-white/40">📋</span>
                    <span className="text-white text-sm">
                      {project.tasks.completed}/{project.tasks.total}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="text-white/40 text-sm">👤</span>
                    <span className="text-white/60 text-sm">{project.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/40 text-sm">📅</span>
                    <span className={`text-sm ${
                      calculateDaysLeft(project.dueDate) < 7 ? 'text-red-400' : 'text-white/60'
                    }`}>
                      {calculateDaysLeft(project.dueDate)} days left
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === sortedProjects.length && sortedProjects.length > 0}
                    onChange={toggleAllProjects}
                    className="rounded border-white/30 bg-white/10"
                  />
                </th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Project</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Priority</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Progress</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Team</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Due Date</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Budget</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project) => (
                <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/projects/${project.id}`} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${project.color} rounded-lg flex items-center justify-center text-xl`}>
                        {project.category === 'development' && '💻'}
                        {project.category === 'design' && '🎨'}
                        {project.category === 'marketing' && '📢'}
                        {project.category === 'research' && '🔬'}
                        {project.category === 'sales' && '💰'}
                      </div>
                      <div>
                        <p className="text-white font-medium flex items-center">
                          {project.name}
                          {project.starred && <span className="ml-2 text-yellow-400">⭐</span>}
                        </p>
                        <p className="text-white/40 text-sm line-clamp-1">{project.description}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                      {statusOptions.find(s => s.value === project.status)?.icon} {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${priorityColors[project.priority as keyof typeof priorityColors]} text-white`}>
                      {getPriorityIcon(project.priority)} {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm">{project.progress}%</span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-6 h-6 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${
                      calculateDaysLeft(project.dueDate) < 7 ? 'text-red-400' : 'text-white'
                    }`}>
                      {formatDate(project.dueDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">${(project.budget / 1000).toFixed(1)}k</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="View"
                      >
                        👁️
                      </Link>
                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="More"
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📁</div>
              <p className="text-white/40">No projects found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}