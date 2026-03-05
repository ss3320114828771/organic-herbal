'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TaskAttachmentProps {
  attachments?: Attachment[]
  onUpload?: (files: FileList) => void
  onDelete?: (attachmentId: string) => void
  onDownload?: (attachmentId: string) => void
  onPreview?: (attachmentId: string) => void
  onAddComment?: (attachmentId: string, comment: string) => void
  maxSize?: number // in MB
  allowedTypes?: string[]
  readOnly?: boolean
  showComments?: boolean
  showPreview?: boolean
  className?: string
  isLoading?: boolean
}

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnail?: string
  uploadedBy: {
    id: string
    name: string
    avatar?: string
  }
  uploadedAt: string
  comments?: AttachmentComment[]
  version?: number
  isStarred?: boolean
}

interface AttachmentComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

export default function TaskAttachment({
  attachments = [],
  onUpload,
  onDelete,
  onDownload,
  onPreview,
  onAddComment,
  maxSize = 10, // 10MB default
  allowedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  readOnly = false,
  showComments = false,
  showPreview = true,
  className = '',
  isLoading = false
}: TaskAttachmentProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})
  const [selectedAttachment, setSelectedAttachment] = React.useState<string | null>(null)
  const [commentText, setCommentText] = React.useState('')
  const [showCommentInput, setShowCommentInput] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)

  // Drag and drop handlers
  React.useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone || readOnly) return

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        handleFileUpload(files)
      }
    }

    dropZone.addEventListener('dragenter', handleDragEnter)
    dropZone.addEventListener('dragover', handleDragOver)
    dropZone.addEventListener('dragleave', handleDragLeave)
    dropZone.addEventListener('drop', handleDrop)

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter)
      dropZone.removeEventListener('dragover', handleDragOver)
      dropZone.removeEventListener('dragleave', handleDragLeave)
      dropZone.removeEventListener('drop', handleDrop)
    }
  }, [readOnly])

  const handleFileUpload = (fileList: FileList) => {
    // Validate file types
    const invalidFiles = Array.from(fileList).filter(file => {
      return !allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0]
          return file.type.startsWith(category)
        }
        return type === file.type
      })
    })

    if (invalidFiles.length > 0) {
      alert(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    // Validate file size
    const oversizedFiles = Array.from(fileList).filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Files exceed maximum size of ${maxSize}MB: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    // Simulate upload progress
    Array.from(fileList).forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[file.name]
              return newProgress
            })
          }, 1000)
        }
      }, 200)
    })

    onUpload?.(fileList)
  }

  const handleDelete = (attachmentId: string) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      onDelete?.(attachmentId)
    }
  }

  const handleAddComment = (attachmentId: string) => {
    if (commentText.trim()) {
      onAddComment?.(attachmentId, commentText)
      setCommentText('')
      setShowCommentInput(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('word') || fileType.includes('document')) return '📘'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📗'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📙'
    if (fileType.includes('zip') || fileType.includes('archive')) return '🗜️'
    if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('html')) return '📄'
    return '📎'
  }

  const getFileColor = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'bg-purple-100 text-purple-600'
    if (fileType.includes('pdf')) return 'bg-red-100 text-red-600'
    if (fileType.includes('word')) return 'bg-blue-100 text-blue-600'
    if (fileType.includes('excel')) return 'bg-green-100 text-green-600'
    if (fileType.includes('powerpoint')) return 'bg-orange-100 text-orange-600'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Attachments ({attachments.length})
          </h3>
          {!readOnly && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              + Upload Files
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <p className="text-sm font-medium text-blue-800 mb-2">Uploading...</p>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="flex items-center gap-2">
                <span className="text-xs text-blue-700 w-32 truncate">{fileName}</span>
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-blue-700">{progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!readOnly && (
        <div
          ref={dropZoneRef}
          className={`p-8 border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📎</div>
            <p className="text-gray-600 mb-1">Drag and drop files here</p>
            <p className="text-xs text-gray-400">
              or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-green-600 hover:text-green-700"
              >
                browse
              </button>{' '}
              to upload
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max size: {maxSize}MB • Supported: {allowedTypes.map(t => t.split('/')[1] || t).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Attachments list */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : attachments.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📂</div>
          <p>No attachments yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                selectedAttachment === attachment.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${getFileColor(
                    attachment.type
                  )}`}
                >
                  {getFileIcon(attachment.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Filename and preview link */}
                      {showPreview && attachment.type.startsWith('image/') ? (
                        <button
                          onClick={() => onPreview?.(attachment.id)}
                          className="font-medium text-gray-800 hover:text-green-600 text-left"
                        >
                          {attachment.name}
                        </button>
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-800 hover:text-green-600"
                        >
                          {attachment.name}
                        </a>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(attachment.size)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(attachment.uploadedAt)}</span>
                        <span>•</span>
                        <span>by {attachment.uploadedBy.name}</span>
                        {attachment.version && attachment.version > 1 && (
                          <>
                            <span>•</span>
                            <span>v{attachment.version}</span>
                          </>
                        )}
                        {attachment.isStarred && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-500">⭐</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDownload?.(attachment.id)}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        {showComments && (
                          <button
                            onClick={() => setShowCommentInput(attachment.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                            title="Comment"
                          >
                            💬
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(attachment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail preview for images */}
                  {attachment.thumbnail && (
                    <div className="mt-2">
                      <img
                        src={attachment.thumbnail}
                        alt={attachment.name}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Comments section */}
                  {showComments && attachment.comments && attachment.comments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachment.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
                            {comment.userAvatar ? (
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              comment.userName.charAt(0)
                            )}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-700">{comment.userName}</span>
                              <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-600">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input */}
                  {showCommentInput === attachment.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddComment(attachment.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Post
                      </button>
                      <button
                        onClick={() => {
                          setShowCommentInput(null)
                          setCommentText('')
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple file list (read-only)
export function FileList({ files }: { files: Attachment[] }) {
  return (
    <TaskAttachment
      attachments={files}
      readOnly={true}
      showComments={false}
      showPreview={false}
    />
  )
}

// Image gallery
export function ImageGallery({ images }: { images: Attachment[] }) {
  const imageAttachments = images.filter(img => img.type.startsWith('image/'))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {imageAttachments.map((image) => (
        <div key={image.id} className="relative group aspect-square">
          <img
            src={image.thumbnail || image.url}
            alt={image.name}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full"
            >
              🔍
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

// Upload button
export function UploadButton({ onUpload }: { onUpload?: (files: FileList) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        <span>📎</span>
        Upload Files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => e.target.files && onUpload?.(e.target.files)}
        className="hidden"
      />
    </>
  )
}

// ==================== HOOK ====================

// Custom hook for attachments
export function useAttachments(initialAttachments: Attachment[] = []) {
  const [attachments, setAttachments] = React.useState<Attachment[]>(initialAttachments)
  const [loading, setLoading] = React.useState(false)

  const addAttachment = (newAttachment: Attachment) => {
    setAttachments(prev => [...prev, newAttachment])
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId))
  }

  const addComment = (attachmentId: string, comment: string) => {
    setAttachments(prev =>
      prev.map(a =>
        a.id === attachmentId
          ? {
              ...a,
              comments: [
                ...(a.comments || []),
                {
                  id: Date.now().toString(),
                  userId: 'current-user',
                  userName: 'Current User',
                  content: comment,
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : a
      )
    )
  }

  const toggleStar = (attachmentId: string) => {
    setAttachments(prev =>
      prev.map(a =>
        a.id === attachmentId ? { ...a, isStarred: !a.isStarred } : a
      )
    )
  }

  return {
    attachments,
    loading,
    setLoading,
    addAttachment,
    removeAttachment,
    addComment,
    toggleStar
  }
}