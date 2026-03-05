'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    phone: '+1 (555) 123-4567',
    company: 'Herbal Heaven',
    position: 'Founder & CEO',
    bio: 'Passionate about organic herbal products and natural wellness. With over 20 years of experience in herbal medicine.',
    location: 'New York, USA',
    website: 'https://herbalheaven.com',
    language: 'english',
    timezone: 'america_newyork',
    dateFormat: 'MM/DD/YYYY',
    avatar: '/avatars/admin.jpg'
  })

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    comments: true,
    mentions: true,
    teamUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    monthlyReport: true,
    securityAlerts: true
  })

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30',
    loginAlerts: true,
    deviceManagement: true,
    ipWhitelisting: false
  })

  const [teamData, setTeamData] = useState({
    members: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', avatar: 'JD', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'member', avatar: 'JS', status: 'active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'member', avatar: 'MJ', status: 'active' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'viewer', avatar: 'SW', status: 'inactive' },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'member', avatar: 'TB', status: 'active' }
    ],
    pendingInvites: [
      { email: 'alice@example.com', role: 'member', invitedAt: '2024-01-15' },
      { email: 'bob@example.com', role: 'admin', invitedAt: '2024-01-14' }
    ]
  })

  const [billingData, setBillingData] = useState({
    plan: 'professional',
    status: 'active',
    nextBilling: '2024-03-15',
    amount: 49.99,
    paymentMethod: {
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      name: 'Hafiz Sajid Syed'
    },
    invoices: [
      { id: 'INV-001', date: '2024-01-15', amount: 49.99, status: 'paid' },
      { id: 'INV-002', date: '2023-12-15', amount: 49.99, status: 'paid' },
      { id: 'INV-003', date: '2023-11-15', amount: 49.99, status: 'paid' }
    ]
  })

  const [apiData, setApiData] = useState({
    apiKeys: [
      { id: 1, name: 'Production Key', key: 'pk_live_••••••••••••••••', lastUsed: '2024-01-15', created: '2023-01-01' },
      { id: 2, name: 'Development Key', key: 'pk_test_••••••••••••••••', lastUsed: '2024-01-14', created: '2023-06-15' }
    ],
    webhooks: [
      { id: 1, url: 'https://api.example.com/webhook', events: ['project.created', 'task.updated'], active: true },
      { id: 2, url: 'https://app.example.com/hook', events: ['user.registered'], active: false }
    ]
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤', description: 'Manage your personal information' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Configure how you receive alerts' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Password and security settings' },
    { id: 'team', name: 'Team', icon: '👥', description: 'Manage team members and permissions' },
    { id: 'billing', name: 'Billing', icon: '💰', description: 'Subscription and payment methods' },
    { id: 'api', name: 'API', icon: '🔌', description: 'API keys and webhooks' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️', description: 'Appearance and regional settings' }
  ]

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (setting: string) => {
    setNotificationData(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof notificationData] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    alert('Settings saved successfully!')
  }

  const plans = [
    { id: 'basic', name: 'Basic', price: 19.99, features: ['5 projects', '10 team members', 'Basic analytics'] },
    { id: 'professional', name: 'Professional', price: 49.99, features: ['Unlimited projects', '25 team members', 'Advanced analytics', 'API access'] },
    { id: 'enterprise', name: 'Enterprise', price: 199.99, features: ['Unlimited everything', 'Priority support', 'Custom integrations', 'SLA'] }
  ]

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
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

      {/* Settings Navigation */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <div className="text-left">
                <p className="font-medium">{tab.name}</p>
                <p className="text-xs opacity-70 hidden lg:block">{tab.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/20">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    HS
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 hover:scale-110 transition-transform">
                    ✎
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl">{profileData.name}</h3>
                  <p className="text-white/60">{profileData.position}</p>
                  <p className="text-white/40 text-sm mt-1">Member since Jan 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={profileData.position}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Language</label>
                  <select
                    name="language"
                    value={profileData.language}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="text-white font-semibold mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Twitter URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                <h3 className="text-white/80 font-semibold">General Notifications</h3>
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { id: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' }
                ].map(item => (
                  <label key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationData[item.id as keyof typeof notificationData]}
                      onChange={() => handleNotificationChange(item.id)}
                      className="w-5 h-5 rounded border-white/30 bg-white/10"
                    />
                  </label>
                ))}

                <h3 className="text-white/80 font-semibold mt-6">Project Updates</h3>
                {[
                  { id: 'taskAssignments', label: 'Task Assignments', desc: 'When you are assigned to a task' },
                  { id: 'taskUpdates', label: 'Task Updates', desc: 'When tasks are updated' },
                  { id: 'projectUpdates', label: 'Project Updates', desc: 'When project details change' },
                  { id: 'comments', label: 'Comments', desc: 'When someone comments on your tasks' },
                  { id: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                  { id: 'teamUpdates', label: 'Team Updates', desc: 'When team members join or leave' }
                ].map(item => (
                  <label key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationData[item.id as keyof typeof notificationData]}
                      onChange={() => handleNotificationChange(item.id)}
                      className="w-5 h-5 rounded border-white/30 bg-white/10"
                    />
                  </label>
                ))}

                <h3 className="text-white/80 font-semibold mt-6">Reports & Marketing</h3>
                {[
                  { id: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' },
                  { id: 'monthlyReport', label: 'Monthly Report', desc: 'Detailed monthly performance report' },
                  { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and promotions' },
                  { id: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' }
                ].map(item => (
                  <label key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationData[item.id as keyof typeof notificationData]}
                      onChange={() => handleNotificationChange(item.id)}
                      className="w-5 h-5 rounded border-white/30 bg-white/10"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

              {/* Password */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Password</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80">Last changed 30 days ago</p>
                    <p className="text-white/40 text-sm">Recommended to change every 90 days</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
                    <p className="text-white/40 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setShowTwoFactorModal(true)}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Configure
                  </button>
                </div>
                {securityData.twoFactorEnabled && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center">
                      <span className="mr-2">✅</span>
                      Two-factor authentication is enabled
                    </p>
                  </div>
                )}
              </div>

              {/* Session Settings */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Session Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Session Timeout (minutes)</label>
                    <select
                      value={securityData.sessionTimeout}
                      onChange={(e) => setSecurityData({ ...securityData, sessionTimeout: e.target.value })}
                      className="w-full md:w-48 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                    <span className="text-white/80">Login Alerts</span>
                    <input
                      type="checkbox"
                      checked={securityData.loginAlerts}
                      onChange={(e) => setSecurityData({ ...securityData, loginAlerts: e.target.checked })}
                      className="w-5 h-5 rounded border-white/30 bg-white/10"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                    <span className="text-white/80">Device Management</span>
                    <input
                      type="checkbox"
                      checked={securityData.deviceManagement}
                      onChange={(e) => setSecurityData({ ...securityData, deviceManagement: e.target.checked })}
                      className="w-5 h-5 rounded border-white/30 bg-white/10"
                    />
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💻</span>
                      <div>
                        <p className="text-white font-medium">Current Session</p>
                        <p className="text-white/40 text-sm">Chrome on Windows • New York, USA</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">Active now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="text-white font-medium">iPhone 14</p>
                        <p className="text-white/40 text-sm">Safari • Last active 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Settings */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Team Management</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                  + Invite Member
                </button>
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <h3 className="text-white/80 font-semibold">Team Members</h3>
                {teamData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
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
                        value={member.role}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {member.status}
                      </span>
                      <button className="text-red-400 hover:text-red-300">✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Invites */}
              {teamData.pendingInvites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white/80 font-semibold">Pending Invites</h3>
                  {teamData.pendingInvites.map((invite, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{invite.email}</p>
                        <p className="text-white/40 text-sm">Invited {invite.invitedAt} • Role: {invite.role}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30">Resend</button>
                        <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>

              {/* Current Plan */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm">Current Plan</p>
                    <h3 className="text-3xl font-bold mt-1 capitalize">{billingData.plan}</h3>
                    <p className="text-white/90 mt-2">${billingData.amount}/month</p>
                    <p className="text-white/60 text-sm mt-1">Next billing: {billingData.nextBilling}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Active</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">💳</span>
                    <div>
                      <p className="text-white font-medium">Visa ending in {billingData.paymentMethod.last4}</p>
                      <p className="text-white/40 text-sm">Expires {billingData.paymentMethod.expMonth}/{billingData.paymentMethod.expYear}</p>
                    </div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300">Update</button>
                </div>
              </div>

              {/* Available Plans */}
              <div>
                <h3 className="text-white font-semibold mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-white/5 rounded-xl p-6 border-2 transition-all ${
                        billingData.plan === plan.id ? 'border-purple-500' : 'border-transparent'
                      }`}
                    >
                      <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                      <p className="text-3xl font-bold text-white mb-4">${plan.price}<span className="text-sm text-white/40">/mo</span></p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="text-white/60 text-sm flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-2 rounded-lg transition-colors ${
                          billingData.plan === plan.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {billingData.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="text-white font-semibold mb-4">Billing History</h3>
                <div className="bg-white/5 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-3 text-left text-white/60 text-sm">Invoice</th>
                        <th className="px-6 py-3 text-left text-white/60 text-sm">Date</th>
                        <th className="px-6 py-3 text-left text-white/60 text-sm">Amount</th>
                        <th className="px-6 py-3 text-left text-white/60 text-sm">Status</th>
                        <th className="px-6 py-3 text-left text-white/60 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingData.invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-white/10">
                          <td className="px-6 py-3 text-white">{invoice.id}</td>
                          <td className="px-6 py-3 text-white/80">{invoice.date}</td>
                          <td className="px-6 py-3 text-white">${invoice.amount}</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <button className="text-purple-400 hover:text-purple-300 text-sm">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">API & Integrations</h2>

              {/* API Keys */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">API Keys</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                    + Generate New Key
                  </button>
                </div>
                <div className="space-y-3">
                  {apiData.apiKeys.map((key) => (
                    <div key={key.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{key.name}</h4>
                        <div className="flex space-x-2">
                          <button className="text-white/40 hover:text-white">📋</button>
                          <button className="text-red-400 hover:text-red-300">🗑️</button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="flex-1 p-2 bg-black/30 rounded-lg text-white/60 font-mono text-sm">
                          {key.key}
                        </code>
                      </div>
                      <div className="flex text-xs text-white/40">
                        <span className="mr-4">Created: {key.created}</span>
                        <span>Last used: {key.lastUsed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhooks */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Webhooks</h3>
                  <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                    + Add Webhook
                  </button>
                </div>
                <div className="space-y-3">
                  {apiData.webhooks.map((webhook) => (
                    <div key={webhook.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`w-2 h-2 rounded-full ${webhook.active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <code className="text-white font-mono text-sm">{webhook.url}</code>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-white/40 hover:text-white">✏️</button>
                          <button className="text-red-400 hover:text-red-300">🗑️</button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {webhook.events.map((event, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-lg text-white/60 text-xs">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate Limits */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Rate Limits</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">API Requests</span>
                      <span className="text-white">2,345 / 10,000</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '23.45%' }}></div>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm">Resets in 12 days</p>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

              {/* Appearance */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
                    <span className="text-2xl block mb-2">🌙</span>
                    Dark
                  </button>
                  <button className="p-4 bg-white/10 rounded-xl text-white/60 hover:bg-white/20 transition-colors">
                    <span className="text-2xl block mb-2">☀️</span>
                    Light
                  </button>
                  <button className="p-4 bg-white/10 rounded-xl text-white/60 hover:bg-white/20 transition-colors">
                    <span className="text-2xl block mb-2">⚙️</span>
                    System
                  </button>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Language</label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="arabic">Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Timezone</label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                    >
                      <option value="america_newyork">Eastern Time (NY)</option>
                      <option value="america_chicago">Central Time (Chicago)</option>
                      <option value="america_denver">Mountain Time (Denver)</option>
                      <option value="america_losangeles">Pacific Time (LA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Date Format</label>
                    <select
                      value={profileData.dateFormat}
                      onChange={(e) => setProfileData({ ...profileData, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Time Format</label>
                    <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none">
                      <option value="12h">12-hour (12:00 PM)</option>
                      <option value="24h">24-hour (24:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Accessibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                    <span className="text-white/80">Reduce Motion</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 bg-white/10" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                    <span className="text-white/80">High Contrast</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 bg-white/10" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                    <span className="text-white/80">Large Text</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 bg-white/10" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
                <input type="password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}