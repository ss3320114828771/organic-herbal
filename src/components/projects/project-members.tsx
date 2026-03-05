'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectMembersProps {
  projectId: string
  members: ProjectMember[]
  roles?: MemberRole[]
  onAddMember?: (memberId: string, roleId: string) => void
  onRemoveMember?: (memberId: string) => void
  onUpdateRole?: (memberId: string, roleId: string) => void
  onInviteMember?: (email: string, roleId: string) => void
  onSearch?: (query: string) => void
  isLoading?: boolean
  currentUserId?: string
  canManage?: boolean
  showInvite?: boolean
  showFilters?: boolean
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  className?: string
}

interface ProjectMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: {
    id: string
    name: string
    color?: string
  }
  joinedAt: string
  lastActive?: string
  tasksAssigned?: number
  tasksCompleted?: number
  status?: 'active' | 'inactive' | 'pending'
}

interface MemberRole {
  id: string
  name: string
  description?: string
  color?: string
  permissions?: string[]
}

export default function ProjectMembers({
  projectId,
  members = [],
  roles = [],
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  onInviteMember,
  onSearch,
  isLoading = false,
  currentUserId,
  canManage = true,
  showInvite = true,
  showFilters = true,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}: ProjectMembersProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [inviteRole, setInviteRole] = React.useState('')
  const [showRoleModal, setShowRoleModal] = React.useState(false)
  const [selectedMember, setSelectedMember] = React.useState<ProjectMember | null>(null)
  const [newRole, setNewRole] = React.useState('')
  const [showConfirmDelete, setShowConfirmDelete] = React.useState<string | null>(null)

  // Filter members
  const filteredMembers = members.filter(member => {
    // Search filter
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !member.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Role filter
    if (selectedRole !== 'all' && member.role.id !== selectedRole) {
      return false
    }
    
    // Status filter
    if (selectedStatus !== 'all' && member.status !== selectedStatus) {
      return false
    }
    
    return true
  })

  const handleInvite = () => {
    if (inviteEmail && inviteRole) {
      onInviteMember?.(inviteEmail, inviteRole)
      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRole('')
    }
  }

  const handleUpdateRole = () => {
    if (selectedMember && newRole) {
      onUpdateRole?.(selectedMember.userId, newRole)
      setShowRoleModal(false)
      setSelectedMember(null)
      setNewRole('')
    }
  }

  const handleRemoveMember = (memberId: string) => {
    onRemoveMember?.(memberId)
    setShowConfirmDelete(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'inactive':
        return 'bg-gray-100 text-gray-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleColor = (color?: string) => {
    return color || 'bg-blue-100 text-blue-700'
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
            <p className="text-sm text-gray-500">
              {members.length} member{members.length !== 1 ? 's' : ''} in this project
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* View mode toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <ListIcon />
              </button>
            </div>

            {/* Invite button */}
            {showInvite && canManage && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                + Invite Member
              </button>
            )}
          </div>
        </div>

        {/* Search and filters */}
        {showFilters && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                placeholder="Search members..."
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <SearchIcon />
            </div>

            {/* Role filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        )}
      </div>

      {/* Members list */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No members found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedRole !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Invite team members to get started'}
            </p>
            {showInvite && canManage && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Invite Members
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-2'
          }>
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`relative group ${
                  viewMode === 'grid'
                    ? 'p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors'
                    : 'p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors flex items-center'
                }`}
              >
                {/* Avatar */}
                <div className={viewMode === 'grid' ? 'text-center mb-3' : 'mr-3'}>
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={`rounded-full object-cover ${
                        viewMode === 'grid' ? 'w-20 h-20 mx-auto' : 'w-10 h-10'
                      }`}
                    />
                  ) : (
                    <div
                      className={`rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-medium ${
                        viewMode === 'grid' ? 'w-20 h-20 mx-auto text-2xl' : 'w-10 h-10 text-sm'
                      }`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Member info */}
                <div className={viewMode === 'grid' ? 'text-center' : 'flex-1'}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    {member.userId === currentUserId && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        You
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(member.role.color)}`}>
                      {member.role.name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(member.status)}`}>
                      {member.status || 'active'}
                    </span>
                  </div>

                  {viewMode === 'list' && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Joined {formatDate(member.joinedAt)}</span>
                      {member.lastActive && (
                        <>
                          <span>•</span>
                          <span>Active {formatDate(member.lastActive)}</span>
                        </>
                      )}
                      {member.tasksAssigned !== undefined && (
                        <>
                          <span>•</span>
                          <span>{member.tasksAssigned} tasks</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {canManage && member.userId !== currentUserId && (
                  <div className={`absolute ${
                    viewMode === 'grid'
                      ? 'top-2 right-2 opacity-0 group-hover:opacity-100'
                      : 'right-2 opacity-0 group-hover:opacity-100 flex space-x-1'
                  } transition-opacity`}>
                    <button
                      onClick={() => {
                        setSelectedMember(member)
                        setNewRole(member.role.id)
                        setShowRoleModal(true)
                      }}
                      className="p-1 bg-white rounded-lg shadow hover:bg-gray-100"
                      title="Change role"
                    >
                      <RoleIcon />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(member.id)}
                      className="p-1 bg-white rounded-lg shadow hover:bg-red-100 text-red-600"
                      title="Remove member"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.description ? `- ${role.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false)
                  setInviteEmail('')
                  setInviteRole('')
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || !inviteRole}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Change Role</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Change role for <span className="font-medium">{selectedMember.name}</span>
            </p>

            <div className="space-y-3">
              {roles.map(role => (
                <label
                  key={role.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    newRole === role.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={newRole === role.id}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{role.name}</div>
                    {role.description && (
                      <div className="text-sm text-gray-500">{role.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRoleModal(false)
                  setSelectedMember(null)
                  setNewRole('')
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={!newRole || newRole === selectedMember.role.id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Remove Member</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this member from the project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(showConfirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple member list
export function SimpleMemberList({ members }: { members: ProjectMember[] }) {
  return (
    <ProjectMembers
      projectId="1"
      members={members}
      canManage={false}
      showInvite={false}
      showFilters={false}
    />
  )
}

// Project team grid
export function ProjectTeamGrid({ projectId }: { projectId: string }) {
  const mockMembers: ProjectMember[] = [
    {
      id: '1',
      userId: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: { id: 'lead', name: 'Project Lead', color: 'bg-purple-100 text-purple-700' },
      joinedAt: '2024-01-15',
      lastActive: '2024-02-20',
      tasksAssigned: 12,
      tasksCompleted: 8,
      status: 'active'
    },
    {
      id: '2',
      userId: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: { id: 'dev', name: 'Developer', color: 'bg-blue-100 text-blue-700' },
      joinedAt: '2024-01-20',
      lastActive: '2024-02-19',
      tasksAssigned: 15,
      tasksCompleted: 10,
      status: 'active'
    },
    {
      id: '3',
      userId: 'user3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: { id: 'designer', name: 'Designer', color: 'bg-pink-100 text-pink-700' },
      joinedAt: '2024-02-01',
      lastActive: '2024-02-18',
      tasksAssigned: 8,
      tasksCompleted: 5,
      status: 'active'
    }
  ]

  const roles = [
    { id: 'lead', name: 'Project Lead', description: 'Can manage all aspects of the project' },
    { id: 'dev', name: 'Developer', description: 'Can view and edit tasks' },
    { id: 'designer', name: 'Designer', description: 'Can view and edit design assets' },
    { id: 'viewer', name: 'Viewer', description: 'Can only view project content' }
  ]

  return (
    <ProjectMembers
      projectId={projectId}
      members={mockMembers}
      roles={roles}
      canManage={true}
    />
  )
}

// Member directory with filters
export function MemberDirectory() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  
  return (
    <ProjectMembers
      projectId="1"
      members={[]}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      isLoading={true}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function RoleIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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