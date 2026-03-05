'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FilesProps {
  project: any
}

export default function Files({ project }: FilesProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock files data
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'project-proposal.pdf',
      type: 'pdf',
      size: 2450000, // 2.45 MB
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15T10:30:00Z',
      url: '#',
      thumbnail: '/pdf-icon.png',
      downloads: 24,
      category: 'documents',
      tags: ['proposal', 'client'],
      version: '1.0',
      description: 'Initial project proposal for client review'
    },
    {
      id: '2',
      name: 'design-mockup.fig',
      type: 'figma',
      size: 5600000, // 5.6 MB
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-14T15:45:00Z',
      url: '#',
      thumbnail: '/figma-icon.png',
      downloads: 12,
      category: 'design',
      tags: ['ui', 'wireframe'],
      version: '2.1',
      description: 'Homepage and dashboard mockups'
    },
    {
      id: '3',
      name: 'requirements.docx',
      type: 'doc',
      size: 1200000, // 1.2 MB
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-14T09:20:00Z',
      url: '#',
      thumbnail: '/doc-icon.png',
      downloads: 18,
      category: 'documents',
      tags: ['requirements', 'specs'],
      version: '1.2',
      description: 'Project requirements and specifications'
    },
    {
      id: '4',
      name: 'screenshot-1.png',
      type: 'image',
      size: 350000, // 350 KB
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-13T11:15:00Z',
      url: '#',
      thumbnail: '/image-icon.png',
      downloads: 8,
      category: 'images',
      tags: ['screenshot', 'ui'],
      version: '1.0',
      description: 'Screenshot of current progress'
    },
    {
      id: '5',
      name: 'api-specs.yaml',
      type: 'yaml',
      size: 45000, // 45 KB
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-13T08:30:00Z',
      url: '#',
      thumbnail: '/code-icon.png',
      downloads: 15,
      category: 'code',
      tags: ['api', 'backend'],
      version: '1.5',
      description: 'OpenAPI specification for the backend'
    },
    {
      id: '6',
      name: 'presentation.pptx',
      type: 'ppt',
      size: 8900000, // 8.9 MB
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-12T14:10:00Z',
      url: '#',
      thumbnail: '/ppt-icon.png',
      downloads: 32,
      category: 'presentations',
      tags: ['client', 'meeting'],
      version: '3.0',
      description: 'Client presentation for milestone review'
    },
    {
      id: '7',
      name: 'database-schema.png',
      type: 'image',
      size: 520000, // 520 KB
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-12T10:45:00Z',
      url: '#',
      thumbnail: '/image-icon.png',
      downloads: 21,
      category: 'images',
      tags: ['database', 'design'],
      version: '1.0',
      description: 'Database schema diagram'
    },
    {
      id: '8',
      name: 'source-code.zip',
      type: 'zip',
      size: 15600000, // 15.6 MB
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-11T16:30:00Z',
      url: '#',
      thumbnail: '/zip-icon.png',
      downloads: 45,
      category: 'code',
      tags: ['source', 'backend'],
      version: '0.9',
      description: 'Current source code archive'
    }
  ])

  const fileTypes = [
    { id: 'all', label: 'All Files', icon: '📁' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'code', label: 'Code', icon: '💻' },
    { id: 'presentations', label: 'Presentations', icon: '📊' },
    { id: 'archives', label: 'Archives', icon: '🗜️' }
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getFileIcon = (type: string) => {
    const icons: {[key: string]: string} = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      ppt: '📙',
      pptx: '📙',
      fig: '🎨',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      gif: '🖼️',
      svg: '🖼️',
      yaml: '📋',
      json: '📋',
      js: '💻',
      ts: '💻',
      jsx: '💻',
      tsx: '💻',
      html: '🌐',
      css: '🎨',
      zip: '🗜️',
      rar: '🗜️',
      '7z': '🗜️',
      mp4: '🎥',
      mp3: '🎵'
    }
    return icons[type] || '📄'
  }

  const getFileColor = (type: string) => {
    const colors: {[key: string]: string} = {
      pdf: 'from-red-500 to-red-600',
      doc: 'from-blue-500 to-blue-600',
      xls: 'from-green-500 to-green-600',
      ppt: 'from-orange-500 to-orange-600',
      fig: 'from-purple-500 to-pink-500',
      image: 'from-yellow-500 to-amber-500',
      code: 'from-cyan-500 to-blue-500',
      zip: 'from-gray-500 to-gray-600'
    }
    return colors[type] || 'from-purple-500 to-pink-500'
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = searchTerm === '' || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || file.category === filterType
    
    return matchesSearch && matchesType
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'oldest':
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'size-desc':
        return b.size - a.size
      case 'size-asc':
        return a.size - b.size
      case 'downloads':
        return b.downloads - a.downloads
      default:
        return 0
    }
  })

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const totalDownloads = files.reduce((acc, file) => acc + file.downloads, 0)

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const toggleAllFiles = () => {
    if (selectedFiles.length === sortedFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(sortedFiles.map(f => f.id))
    }
  }

  const handleDownload = (fileId: string) => {
    console.log('Downloading file:', fileId)
    // Implement download logic
  }

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId))
      setSelectedFiles(prev => prev.filter(id => id !== fileId))
    }
  }

  const handleBulkDownload = () => {
    console.log('Downloading selected files:', selectedFiles)
    // Implement bulk download
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)))
      setSelectedFiles([])
    }
  }

  const simulateUpload = (files: FileList) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      type: file.name.split('.').pop() || 'unknown',
      size: file.size,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      url: '#',
      thumbnail: '/file-icon.png',
      downloads: 0,
      category: 'documents',
      tags: [],
      version: '1.0',
      description: ''
    }))

    // Simulate upload progress
    newFiles.forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setFiles(prev => [...prev, file])
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.id]
            return newProgress
          })
        } else {
          setUploadProgress(prev => ({ ...prev, [file.id]: progress }))
        }
      }, 500)
    })
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Files</h2>
          <p className="text-white/60">
            Manage and share project documents, images, and resources
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center"
          >
            {viewMode === 'grid' ? '📋 List View' : '📊 Grid View'}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center"
          >
            <span className="mr-2">📤</span>
            Upload Files
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Files</p>
              <p className="text-2xl font-bold text-white">{files.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-white">{formatFileSize(totalSize)}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">💾</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Downloads</p>
              <p className="text-2xl font-bold text-white">{totalDownloads}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">⬇️</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Storage Used</p>
              <p className="text-2xl font-bold text-white">45%</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
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
                placeholder="Search files by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* File Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {fileTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  filterType === type.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">
                {selectedFiles.length} selected
              </span>
              <button
                onClick={handleBulkDownload}
                className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                ⬇️ Download
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
            >
              {/* File Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${getFileColor(file.type)} rounded-2xl flex items-center justify-center text-3xl`}>
                  {getFileIcon(file.type)}
                </div>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="rounded border-white/30 bg-white/10"
                />
              </div>

              {/* File Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{file.name}</h3>
                <p className="text-white/40 text-sm line-clamp-2">{file.description}</p>
              </div>

              {/* Tags */}
              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {file.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* File Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Size</span>
                  <span className="text-white">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Uploaded</span>
                  <span className="text-white">{formatDate(file.uploadedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">By</span>
                  <span className="text-white">{file.uploadedBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Downloads</span>
                  <span className="text-white">{file.downloads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Version</span>
                  <span className="text-white">{file.version}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleDownload(file.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Download"
                >
                  ⬇️
                </button>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Share"
                >
                  🔗
                </button>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Info"
                >
                  ℹ️
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
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
                    checked={selectedFiles.length === sortedFiles.length && sortedFiles.length > 0}
                    onChange={toggleAllFiles}
                    className="rounded border-white/30 bg-white/10"
                  />
                </th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Size</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Uploaded</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">By</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Downloads</th>
                <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((file) => (
                <tr key={file.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getFileColor(file.type)} rounded-lg flex items-center justify-center`}>
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-white/40 text-xs line-clamp-1">{file.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white uppercase">{file.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{formatFileSize(file.size)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{formatDate(file.uploadedAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{file.uploadedBy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{file.downloads}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Share"
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedFiles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📁</div>
              <p className="text-white/40">No files found</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Upload Files</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Drop Zone */}
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      simulateUpload(e.target.files)
                      setShowUploadModal(false)
                    }
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📤</div>
                  <p className="text-white font-semibold mb-2">Click to upload or drag and drop</p>
                  <p className="text-white/40 text-sm">Any file up to 100MB</p>
                </label>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Uploading...</h4>
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">File {fileId.slice(-4)}</span>
                        <span className="text-white">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}