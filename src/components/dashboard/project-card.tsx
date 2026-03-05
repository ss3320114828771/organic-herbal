'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'on-hold' | 'planning'
  progress: number
  startDate: string
  endDate?: string
  budget: number
  spent: number
  team: {
    id: string
    name: string
    avatar?: string
    role: string
  }[]
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  image?: string
}

interface ProjectCardProps {
  project: Project
  variant?: 'default' | 'compact' | 'detailed'
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export default function ProjectCard({ 
  project, 
  variant = 'default',
  onEdit,
  onDelete,
  onView 
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      planning: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.planning
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.low
  }

  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, string> = {
      low: '⬇️',
      medium: '➡️',
      high: '⬆️',
      critical: '⚠️'
    }
    return icons[priority] || '•'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 60) return 'bg-yellow-500'
    if (progress < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getBudgetStatus = () => {
    const percentSpent = (project.spent / project.budget) * 100
    if (percentSpent > 100) return 'text-red-600'
    if (percentSpent > 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-800">{project.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{project.category}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(project.progress)} rounded-full`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Team avatars */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, i) => (
              <div
                key={member.id}
                className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full border-2 border-white flex items-center justify-center text-xs"
                title={member.name}
              >
                {member.avatar ? (
                  <Image src={member.avatar} alt={member.name} width={24} height={24} className="rounded-full" />
                ) : (
                  <span>{member.name.charAt(0)}</span>
                )}
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{project.team.length - 3}
              </div>
            )}
          </div>
          <button
            onClick={() => onView?.(project.id)}
            className="text-xs text-green-600 hover:text-green-700"
          >
            View →
          </button>
        </div>
      </div>
    )
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with image */}
        <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600 relative">
          {project.image && (
            <Image src={project.image} alt={project.title} fill className="object-cover opacity-30" />
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {getPriorityIcon(project.priority)} {project.priority}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{project.category}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

          {/* Dates */}
          <div className="flex gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Start:</span>
              <span className="ml-1 font-medium">{formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div>
                <span className="text-gray-500">End:</span>
                <span className="ml-1 font-medium">{formatDate(project.endDate)}</span>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Budget</span>
              <span className={`font-medium ${getBudgetStatus()}`}>
                {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(project.spent / project.budget) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(project.progress)} rounded-full`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Team ({project.team.length})</p>
            <div className="flex flex-wrap gap-2">
              {project.team.map((member) => (
                <div key={member.id} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-xs">
                    {member.avatar ? (
                      <Image src={member.avatar} alt={member.name} width={20} height={20} className="rounded-full" />
                    ) : (
                      <span>{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => onView?.(project.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              View Details
            </button>
            <button
              onClick={() => onEdit?.(project.id)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(project.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {getPriorityIcon(project.priority)} {project.priority}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{project.category}</p>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ⋮
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 py-1">
                <button
                  onClick={() => {
                    onView?.(project.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit?.(project.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    onDelete?.(project.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(project.progress)} rounded-full transition-all duration-500`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-sm mb-4">
        <div>
          <span className="text-gray-500">Start:</span>
          <span className="ml-1 font-medium">{formatDate(project.startDate)}</span>
        </div>
        {project.endDate && (
          <div>
            <span className="text-gray-500">End:</span>
            <span className="ml-1 font-medium">{formatDate(project.endDate)}</span>
          </div>
        )}
      </div>

      {/* Budget */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Budget</span>
        <span className={`font-medium ${getBudgetStatus()}`}>
          {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
        </span>
      </div>

      {/* Team */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.slice(0, 4).map((member, i) => (
            <div
              key={member.id}
              className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium hover:z-10 transition-all"
              title={member.name}
            >
              {member.avatar ? (
                <Image src={member.avatar} alt={member.name} width={32} height={32} className="rounded-full" />
              ) : (
                <span>{member.name.charAt(0)}</span>
              )}
            </div>
          ))}
          {project.team.length > 4 && (
            <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{project.team.length - 4}
            </div>
          )}
        </div>

        <button
          onClick={() => onView?.(project.id)}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          View →
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-gray-100">
        {project.tags.slice(0, 3).map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            #{tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{project.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  )
}