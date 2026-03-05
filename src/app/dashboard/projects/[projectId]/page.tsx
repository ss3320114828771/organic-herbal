'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Board from './board'
import Files from './files'
import Settings from './settings'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setProject({
          id: projectId,
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design, improved UX, and mobile responsiveness.',
          status: 'In Progress',
          progress: 75,
          priority: 'High',
          startDate: '2024-01-01',
          dueDate: '2024-03-30',
          estimatedHours: 320,
          actualHours: 240,
          budget: 50000,
          spent: 37500,
          owner: {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'JD',
            role: 'Project Owner'
          },
          team: [
            { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', role: 'Lead Developer' },
            { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', role: 'UI/UX Designer' },
            { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', role: 'Backend Developer' },
            { id: 'user5', name: 'Tom Brown', email: 'tom@example.com', avatar: 'TB', role: 'QA Engineer' }
          ],
          tasks: {
            todo: [
              { id: 't1', title: 'Design homepage', priority: 'High', assignee: 'JD', dueDate: '2024-02-15' },
              { id: 't2', title: 'Create style guide', priority: 'Medium', assignee: 'MJ', dueDate: '2024-02-20' },
              { id: 't3', title: 'Setup development environment', priority: 'High', assignee: 'JS', dueDate: '2024-02-10' }
            ],
            inProgress: [
              { id: 't4', title: 'Develop components', priority: 'High', assignee: 'JS', dueDate: '2024-02-28' },
              { id: 't5', title: 'Content migration', priority: 'Medium', assignee: 'SW', dueDate: '2024-03-05' }
            ],
            review: [
              { id: 't6', title: 'Code review', priority: 'Low', assignee: 'TB', dueDate: '2024-02-25' }
            ],
            done: [
              { id: 't7', title: 'Project kickoff', priority: 'High', assignee: 'JD', dueDate: '2024-01-15' },
              { id: 't8', title: 'Requirements gathering', priority: 'High', assignee: 'JD', dueDate: '2024-01-20' }
            ]
          },
          files: [
            { id: 'f1', name: 'project-proposal.pdf', size: '2.4 MB', uploadedBy: 'John Doe', date: '2024-01-15' },
            { id: 'f2', name: 'design-mockups.fig', size: '5.6 MB', uploadedBy: 'Jane Smith', date: '2024-01-20' },
            { id: 'f3', name: 'requirements.docx', size: '1.2 MB', uploadedBy: 'Mike Johnson', date: '2024-01-22' }
          ],
          milestones: [
            { id: 'm1', title: 'Design Phase', dueDate: '2024-02-15', completed: true },
            { id: 'm2', title: 'Development Phase', dueDate: '2024-03-15', completed: false },
            { id: 'm3', title: 'Testing Phase', dueDate: '2024-03-25', completed: false },
            { id: 'm4', title: 'Launch', dueDate: '2024-03-30', completed: false }
          ],
          activity: [
            { id: 'a1', user: 'John Doe', action: 'created task', target: 'Design homepage', time: '2 hours ago' },
            { id: 'a2', user: 'Jane Smith', action: 'uploaded file', target: 'design-mockups.fig', time: '5 hours ago' },
            { id: 'a3', user: 'Mike Johnson', action: 'commented on', target: 'Code review', time: '1 day ago' },
            { id: 'a4', user: 'Sarah Wilson', action: 'completed task', target: 'Content migration', time: '2 days ago' }
          ]
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching project:', error)
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'board', name: 'Board', icon: '📋' },
    { id: 'tasks', name: 'Tasks', icon: '✅' },
    { id: 'files', name: 'Files', icon: '📁' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/20 text-green-300'
      case 'In Progress': return 'bg-blue-500/20 text-blue-300'
      case 'On Hold': return 'bg-yellow-500/20 text-yellow-300'
      case 'Cancelled': return 'bg-red-500/20 text-red-300'
      default: return 'bg-purple-500/20 text-purple-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-500/20 text-red-300'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'Low': return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateProgress = () => {
    if (!project) return 0
    const totalTasks = Object.values(project.tasks).flat().length
    const completedTasks = project.tasks.done?.length || 0
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-white/60 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
          <Link
            href="/dashboard/projects"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Back to Projects
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
              href="/dashboard/projects"
              className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center"
            >
              <span className="mr-1">←</span>
              Back to Projects
            </Link>
            <span className="text-white/20">|</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
              {project.priority} Priority
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-white/60 max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            Add Task
          </button>
          <button
            onClick={() => setShowMemberModal(true)}
            className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center"
          >
            <span className="mr-2">👥</span>
            Add Member
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center">
            <span className="mr-2">✎</span>
            Edit Project
          </button>
        </div>
      </div>

      {/* Project Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Progress</p>
              <p className="text-2xl font-bold text-white">{calculateProgress()}%</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Timeline</p>
              <p className="text-2xl font-bold text-white">
                {Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">Due {formatDate(project.dueDate)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Team Members</p>
              <p className="text-2xl font-bold text-white">{project.team.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
          <div className="flex -space-x-2 mt-2">
            {project.team.slice(0, 4).map((member: any) => (
              <div
                key={member.id}
                className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                title={member.name}
              >
                {member.avatar}
              </div>
            ))}
            {project.team.length > 4 && (
              <div className="w-6 h-6 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs">
                +{project.team.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Budget</p>
              <p className="text-2xl font-bold text-white">${project.spent.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">of ${project.budget.toLocaleString()}</p>
          <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              style={{ width: `${(project.spent / project.budget) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-sm">Start Date</p>
                    <p className="text-white font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Due Date</p>
                    <p className="text-white font-semibold">{formatDate(project.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Estimated Hours</p>
                    <p className="text-white font-semibold">{project.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Actual Hours</p>
                    <p className="text-white font-semibold">{project.actualHours}h</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Budget</p>
                    <p className="text-white font-semibold">${project.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Spent</p>
                    <p className="text-white font-semibold">${project.spent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {project.activity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                          <span className="text-purple-400">{activity.target}</span>
                        </p>
                        <p className="text-white/40 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Project Owner */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Project Owner</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {project.owner.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{project.owner.name}</p>
                    <p className="text-white/60 text-sm">{project.owner.role}</p>
                    <p className="text-white/40 text-xs">{project.owner.email}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">View All →</button>
                </div>
                <div className="space-y-3">
                  {project.team.slice(0, 3).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-white/40 text-xs">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-white/20">•••</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                      }`}>
                        {milestone.completed ? '✓' : '○'}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${milestone.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-white/40 text-xs">Due {formatDate(milestone.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'board' && <Board project={project} />}
        {activeTab === 'files' && <Files project={project} />}
        {activeTab === 'settings' && <Settings project={project} />}

        {activeTab === 'tasks' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">All Tasks</h3>
            <p className="text-white/60">Tasks view coming soon...</p>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Team Management</h3>
            <p className="text-white/60">Team management view coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Project Analytics</h3>
            <p className="text-white/60">Analytics view coming soon...</p>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add Team Member</h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Select User</label>
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                  <option value="">Choose a user...</option>
                  <option value="user6">Alice Brown</option>
                  <option value="user7">Bob Wilson</option>
                  <option value="user8">Carol Davis</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Role</label>
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" defaultChecked />
                    <span className="text-white/80">Can edit tasks</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" defaultChecked />
                    <span className="text-white/80">Can upload files</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-white/30" />
                    <span className="text-white/80">Can add members</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Create New Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Task Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Priority</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Assignee</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option value="">Unassigned</option>
                    {project.team.map((member: any) => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}