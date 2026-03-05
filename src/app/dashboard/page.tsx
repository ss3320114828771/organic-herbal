'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Activity {
  id: string
  user: string
  userAvatar: string
  action: string
  target: string
  time: string
  type: 'task' | 'project' | 'comment' | 'file'
}

interface Project {
  id: string
  name: string
  progress: number
  status: string
  priority: string
  dueDate: string
  team: { avatar: string }[]
  color: string
}

interface Task {
  id: string
  title: string
  project: string
  priority: string
  dueDate: string
  assignee: string
  assigneeAvatar: string
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Mock data
  const stats = [
    { 
      label: 'Total Projects', 
      value: '12', 
      change: '+2', 
      trend: 'up', 
      icon: '📁', 
      color: 'from-blue-500 to-cyan-500',
      details: '3 in progress, 2 completed'
    },
    { 
      label: 'Active Tasks', 
      value: '48', 
      change: '+8', 
      trend: 'up', 
      icon: '✅', 
      color: 'from-green-500 to-emerald-500',
      details: '12 due this week'
    },
    { 
      label: 'Team Members', 
      value: '8', 
      change: '0', 
      trend: 'neutral', 
      icon: '👥', 
      color: 'from-purple-500 to-pink-500',
      details: '3 online now'
    },
    { 
      label: 'Completion Rate', 
      value: '76%', 
      change: '+5%', 
      trend: 'up', 
      icon: '📊', 
      color: 'from-yellow-500 to-orange-500',
      details: '32 tasks completed'
    }
  ]

  const recentActivities: Activity[] = [
    { id: '1', user: 'John Doe', userAvatar: 'JD', action: 'completed task', target: 'Design homepage', time: '5 min ago', type: 'task' },
    { id: '2', user: 'Jane Smith', userAvatar: 'JS', action: 'uploaded file', target: 'wireframes.fig', time: '15 min ago', type: 'file' },
    { id: '3', user: 'Mike Johnson', userAvatar: 'MJ', action: 'commented on', target: 'API documentation', time: '1 hour ago', type: 'comment' },
    { id: '4', user: 'Sarah Wilson', userAvatar: 'SW', action: 'created project', target: 'Marketing Campaign', time: '3 hours ago', type: 'project' },
    { id: '5', user: 'Tom Brown', userAvatar: 'TB', action: 'assigned task', target: 'Fix navigation bug', time: '5 hours ago', type: 'task' }
  ]

  const projects: Project[] = [
    { 
      id: '1', 
      name: 'Website Redesign', 
      progress: 75, 
      status: 'in-progress', 
      priority: 'high', 
      dueDate: '2024-02-15',
      team: [{ avatar: 'JD' }, { avatar: 'JS' }, { avatar: 'MJ' }],
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: '2', 
      name: 'Mobile App', 
      progress: 45, 
      status: 'in-progress', 
      priority: 'medium', 
      dueDate: '2024-03-01',
      team: [{ avatar: 'SW' }, { avatar: 'TB' }],
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: '3', 
      name: 'Marketing Campaign', 
      progress: 90, 
      status: 'review', 
      priority: 'high', 
      dueDate: '2024-01-30',
      team: [{ avatar: 'JD' }, { avatar: 'MJ' }],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const upcomingTasks: Task[] = [
    { id: '1', title: 'Design homepage wireframes', project: 'Website Redesign', priority: 'high', dueDate: '2024-01-25', assignee: 'Jane Smith', assigneeAvatar: 'JS' },
    { id: '2', title: 'Implement authentication API', project: 'Mobile App', priority: 'high', dueDate: '2024-01-26', assignee: 'Mike Johnson', assigneeAvatar: 'MJ' },
    { id: '3', title: 'Create email template', project: 'Marketing Campaign', priority: 'medium', dueDate: '2024-01-27', assignee: 'Sarah Wilson', assigneeAvatar: 'SW' },
    { id: '4', title: 'Fix navigation bug', project: 'Website Redesign', priority: 'low', dueDate: '2024-01-28', assignee: 'Tom Brown', assigneeAvatar: 'TB' }
  ]

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12, 19, 15, 22, 24, 18, 14]
  }

  const getPriorityColor = (priority: string): string => {
    switch(priority) {
      case 'high': return 'bg-red-500/20 text-red-300'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'low': return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'in-progress': return 'bg-blue-500/20 text-blue-300'
      case 'review': return 'bg-purple-500/20 text-purple-300'
      case 'completed': return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = (dateString: string): boolean => {
    const date = new Date(dateString)
    const today = new Date()
    return date < today && date.toDateString() !== today.toDateString()
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, Hafiz Sajid! 👋
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Welcome back to your dashboard. Here's what's happening with your projects today.
          </p>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-white/60 text-sm">Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-white/60 text-sm">Tasks</p>
              <p className="text-2xl font-bold">48</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-white/60 text-sm">Team</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-white/60 text-sm">Due</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-white/40 text-xs mt-2">{stat.details}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="flex items-center">
              {stat.trend === 'up' && <span className="text-green-400 text-sm mr-2">↑</span>}
              {stat.trend === 'down' && <span className="text-red-400 text-sm mr-2">↓</span>}
              <span className={stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-white/40'}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 group-hover:from-purple-600 group-hover:to-pink-600 relative"
                     style={{ height: `${(chartData.values[index] / 30) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {chartData.values[index]} tasks
                  </div>
                </div>
                <span className="text-white/60 text-xs mt-2">{label}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/40 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-white">124</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">86</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-400">38</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Link href="/dashboard/activity" className="text-purple-400 hover:text-purple-300 text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {activity.userAvatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="text-purple-400">{activity.target}</span>
                  </p>
                  <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.type === 'task' ? 'bg-blue-500/20 text-blue-300' :
                  activity.type === 'project' ? 'bg-green-500/20 text-green-300' :
                  activity.type === 'file' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Active Projects</h3>
            <Link href="/dashboard/projects" className="text-purple-400 hover:text-purple-300 text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${project.color} rounded-lg flex items-center justify-center text-white`}>
                      📁
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs ${isOverdue(project.dueDate) ? 'text-red-400' : 'text-white/40'}`}>
                    Due {formatDate(project.dueDate)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${project.color} rounded-full`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.map((member, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/10 flex items-center justify-center text-white text-xs font-bold"
                      >
                        {member.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">Team: {project.team.length}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Upcoming Tasks</h3>
            <Link href="/dashboard/tasks" className="text-purple-400 hover:text-purple-300 text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-white font-medium">{task.title}</p>
                    <p className="text-white/40 text-xs">{task.project}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-white/40'}`}>
                    {formatDate(task.dueDate)}
                  </span>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {task.assigneeAvatar}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Task Summary */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/40 text-xs">Due Today</p>
              <p className="text-xl font-bold text-white">4</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs">This Week</p>
              <p className="text-xl font-bold text-white">12</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs">Overdue</p>
              <p className="text-xl font-bold text-red-400">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Project', icon: '➕', color: 'from-purple-500 to-pink-500', href: '/dashboard/projects/new' },
          { label: 'New Task', icon: '✅', color: 'from-green-500 to-emerald-500', href: '/dashboard/tasks/new' },
          { label: 'Invite Member', icon: '👥', color: 'from-blue-500 to-cyan-500', href: '/dashboard/team/invite' },
          { label: 'Generate Report', icon: '📊', color: 'from-yellow-500 to-orange-500', href: '/dashboard/reports/new' }
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-all duration-300 group`}
          >
            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
        <p className="text-white/60 italic">
          "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one."
        </p>
        <p className="text-white/40 text-sm mt-2">— Mark Twain</p>
      </div>
    </div>
  )
}