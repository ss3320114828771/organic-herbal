'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ProjectHeaderProps {
  projectId: string
  projectName: string
  projectDescription?: string
  projectStatus?: 'active' | 'completed' | 'on-hold' | 'archived'
  projectProgress?: number
  startDate?: string
  endDate?: string
  teamMembers?: TeamMember[]
  projectLead?: {
    id: string
    name: string
    avatar?: string
  }
  client?: {
    name: string
    company?: string
  }
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onExport?: () => void
  onArchive?: () => void
  onDuplicate?: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
  showBreadcrumbs?: boolean
  showActions?: boolean
  showProgress?: boolean
  showTeam?: boolean
  showDates?: boolean
}

interface TeamMember {
  id: string
  name: string
  avatar?: string
  role?: string
}

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  count?: number
}

export default function ProjectHeader({
  projectId,
  projectName,
  projectDescription,
  projectStatus = 'active',
  projectProgress = 0,
  startDate,
  endDate,
  teamMembers = [],
  projectLead,
  client,
  tabs = [],
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onShare,
  onExport,
  onArchive,
  onDuplicate,
  isFavorite = false,
  onToggleFavorite,
  className = '',
  variant = 'default',
  showBreadcrumbs = true,
  showActions = true,
  showProgress = true,
  showTeam = true,
  showDates = true
}: ProjectHeaderProps) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700'
      case 'archived':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'completed':
        return 'Completed'
      case 'on-hold':
        return 'On Hold'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Variant styles
  const variantStyles = {
    default: 'py-6',
    compact: 'py-4',
    minimal: 'py-3'
  }

  const titleSize = {
    default: 'text-2xl',
    compact: 'text-xl',
    minimal: 'text-lg'
  }

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${variantStyles[variant]}`}>
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/projects" className="hover:text-green-600">
              Projects
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{projectName}</span>
          </div>
        )}

        {/* Main header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left section - Title and meta */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`${titleSize[variant]} font-bold text-gray-800`}>
                {projectName}
              </h1>
              
              {/* Favorite button */}
              {onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className={`p-1 rounded-lg transition-colors ${
                    isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? '★' : '☆'}
                </button>
              )}

              {/* Status badge */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(projectStatus)}`}>
                {getStatusLabel(projectStatus)}
              </span>
            </div>

            {/* Description */}
            {projectDescription && variant !== 'minimal' && (
              <p className="text-gray-600 text-sm mb-3 max-w-3xl">
                {projectDescription}
              </p>
            )}

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Project lead */}
              {projectLead && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Lead:</span>
                  <div className="flex items-center gap-1">
                    {projectLead.avatar ? (
                      <img
                        src={projectLead.avatar}
                        alt={projectLead.name}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
                        {projectLead.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">{projectLead.name}</span>
                  </div>
                </div>
              )}

              {/* Client */}
              {client && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Client:</span>
                  <span className="text-gray-700 font-medium">
                    {client.name}
                    {client.company && ` (${client.company})`}
                  </span>
                </div>
              )}

              {/* Dates */}
              {showDates && (startDate || endDate) && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Timeline:</span>
                  <span className="text-gray-700">
                    {formatDate(startDate)} - {formatDate(endDate) || 'No end date'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right section - Actions */}
          {showActions && (
            <div className="flex items-center gap-2">
              {/* Share button */}
              {onShare && (
                <button
                  onClick={onShare}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share project"
                >
                  <ShareIcon />
                </button>
              )}

              {/* Export button */}
              {onExport && (
                <button
                  onClick={onExport}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Export project"
                >
                  <ExportIcon />
                </button>
              )}

              {/* Edit button */}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit project"
                >
                  <EditIcon />
                </button>
              )}

              {/* More actions menu */}
              {(onDelete || onArchive || onDuplicate) && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="More actions"
                  >
                    <MoreIcon />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {onDuplicate && (
                        <button
                          onClick={() => {
                            onDuplicate()
                            setShowMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Duplicate project
                        </button>
                      )}
                      {onArchive && projectStatus !== 'archived' && (
                        <button
                          onClick={() => {
                            onArchive()
                            setShowMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Archive project
                        </button>
                      )}
                      {onDelete && (
                        <>
                          {(onDuplicate || onArchive) && <div className="border-t border-gray-200 my-1" />}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this project?')) {
                                onDelete()
                              }
                              setShowMenu(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete project
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && projectProgress > 0 && variant !== 'minimal' && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-300"
                    style={{ width: `${projectProgress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {projectProgress}% complete
              </span>
            </div>
          </div>
        )}

        {/* Team avatars */}
        {showTeam && teamMembers.length > 0 && variant !== 'minimal' && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Team:</span>
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="relative group"
                  title={`${member.name}${member.role ? ` (${member.role})` : ''}`}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 border-2 border-white flex items-center justify-center text-xs font-medium">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
              {teamMembers.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 border-2 border-white flex items-center justify-center text-xs font-medium">
                  +{teamMembers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id || (tab.href && pathname === tab.href)
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.href) {
                        // If href is provided, navigate to that page
                        window.location.href = tab.href
                      } else {
                        onTabChange?.(tab.id)
                      }
                    }}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                      isActive
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                          isActive
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple project header
export function SimpleProjectHeader({ projectName }: { projectName: string }) {
  return (
    <ProjectHeader
      projectId="1"
      projectName={projectName}
      variant="minimal"
      showActions={false}
      showProgress={false}
      showTeam={false}
    />
  )
}

// Project header with tabs
export function ProjectHeaderWithTabs({ projectName }: { projectName: string }) {
  const [activeTab, setActiveTab] = React.useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', count: 1 },
    { id: 'tasks', label: 'Tasks', count: 12 },
    { id: 'files', label: 'Files', count: 8 },
    { id: 'team', label: 'Team', count: 5 },
    { id: 'activity', label: 'Activity' }
  ]

  return (
    <ProjectHeader
      projectId="1"
      projectName={projectName}
      projectDescription="This is a sample project description that gives an overview of what this project is about and its main goals."
      projectStatus="active"
      projectProgress={65}
      startDate="2024-01-15"
      endDate="2024-03-30"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      projectLead={{ id: '1', name: 'John Doe' }}
      client={{ name: 'Acme Corp', company: 'Acme Inc.' }}
      teamMembers={[
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Mike Johnson' },
        { id: '4', name: 'Sarah Williams' },
        { id: '5', name: 'David Brown' },
        { id: '6', name: 'Emily Davis' }
      ]}
      isFavorite={true}
    />
  )
}

// Project header with all actions
export function FullProjectHeader({ projectName }: { projectName: string }) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  return (
    <ProjectHeader
      projectId="1"
      projectName={projectName}
      projectDescription="Complete overhaul of the company website with new design system, improved performance, and better user experience."
      projectStatus="active"
      projectProgress={42}
      startDate="2024-02-01"
      endDate="2024-05-30"
      onEdit={() => console.log('Edit clicked')}
      onDelete={() => console.log('Delete clicked')}
      onShare={() => console.log('Share clicked')}
      onExport={() => console.log('Export clicked')}
      onArchive={() => console.log('Archive clicked')}
      onDuplicate={() => console.log('Duplicate clicked')}
      isFavorite={isFavorite}
      onToggleFavorite={() => setIsFavorite(!isFavorite)}
      projectLead={{ id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' }}
      client={{ name: 'TechCorp', company: 'TechCorp Inc.' }}
      teamMembers={[
        { id: '1', name: 'John Doe', role: 'Lead' },
        { id: '2', name: 'Jane Smith', role: 'Designer' },
        { id: '3', name: 'Mike Johnson', role: 'Developer' }
      ]}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function ShareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function ExportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  )
}