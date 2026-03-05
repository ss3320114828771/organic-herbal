'use client'

import React from 'react'
import Link from 'next/link'

interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  folderId?: string
  createdAt: string
}

interface Folder {
  id: string
  name: string
  parentId?: string
  fileCount?: number
}

interface ProjectFilesProps {
  projectId: string
  projectName?: string
  files?: ProjectFile[]
  folders?: Folder[]
  onFileUpload?: (files: FileList) => void
  onFileDelete?: (fileId: string) => void
  onFolderCreate?: (folderName: string) => void
  onFolderDelete?: (folderId: string) => void
  onFileDownload?: (fileId: string) => void
  currentFolderId?: string
  onFolderChange?: (folderId: string) => void
  isLoading?: boolean
  className?: string
}

export default function ProjectFiles({
  projectId,
  projectName = 'Project Files',
  files = [],
  folders = [],
  onFileUpload,
  onFileDelete,
  onFolderCreate,
  onFolderDelete,
  onFileDownload,
  currentFolderId = 'root',
  onFolderChange,
  isLoading = false,
  className = ''
}: ProjectFilesProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)

  // Drag and drop handlers
  React.useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = e.dataTransfer?.files
      if (droppedFiles && droppedFiles.length > 0) {
        onFileUpload?.(droppedFiles)
      }
    }

    dropZone.addEventListener('dragover', handleDragOver)
    dropZone.addEventListener('dragleave', handleDragLeave)
    dropZone.addEventListener('drop', handleDrop)

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver)
      dropZone.removeEventListener('dragleave', handleDragLeave)
      dropZone.removeEventListener('drop', handleDrop)
    }
  }, [onFileUpload])

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDelete = (id: string, type: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'file') {
        onFileDelete?.(id)
      } else {
        onFolderDelete?.(id)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('word')) return '📘'
    if (fileType.includes('excel')) return '📗'
    if (fileType.includes('zip')) return '🗜️'
    return '📄'
  }

  const currentFolders = folders.filter(f => f.parentId === currentFolderId)
  const currentFiles = files.filter(f => f.folderId === currentFolderId)

  // Simple breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: { id: string; name: string }[] = [{ id: 'root', name: projectName }]
    let currentId = currentFolderId

    while (currentId !== 'root') {
      const folder = folders.find(f => f.id === currentId)
      if (!folder) break
      crumbs.push({ id: folder.id, name: folder.name })
      currentId = folder.parentId || 'root'
    }
    return crumbs
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Project Files</h2>
            <p className="text-sm text-gray-500">{projectName}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              + New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && onFileUpload?.(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mt-2 flex items-center space-x-2 text-sm">
          {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => onFolderChange?.(crumb.id)}
                className={`hover:text-green-600 ${
                  crumb.id === currentFolderId ? 'text-gray-800 font-medium' : 'text-gray-500'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        className={`p-6 min-h-[400px] transition-colors ${
          isDragging ? 'bg-green-50 border-2 border-dashed border-green-400' : ''
        }`}
      >
        {isDragging && (
          <div className="text-center text-green-600 mb-4">
            <p className="text-lg">Drop files here to upload</p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Folders */}
            {currentFolders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Folders</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {currentFolders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => onFolderChange?.(folder.id)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer group relative"
                    >
                      <div className="text-center">
                        <span className="text-3xl block mb-1">📁</span>
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {folder.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {folder.fileCount || 0} items
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(folder.id, 'folder')
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 hover:bg-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {currentFiles.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Files</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {currentFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`p-3 border rounded-lg hover:border-green-300 cursor-pointer group relative ${
                        selectedFiles.includes(file.id) ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      <div className="text-center">
                        <span className="text-3xl block mb-1">{getFileIcon(file.type)}</span>
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(file.createdAt)}
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onFileDownload?.(file.id)
                          }}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id, 'file')
                          }}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {currentFolders.length === 0 && currentFiles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No files yet</h3>
                <p className="text-gray-500 mb-4">Upload files or create folders to get started</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upload Files
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewFolderModal(false)
                  setNewFolderName('')
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    onFolderCreate?.(newFolderName)
                    setShowNewFolderModal(false)
                    setNewFolderName('')
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection bar */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="mr-4">{selectedFiles.length} file(s) selected</span>
          <button
            onClick={() => setSelectedFiles([])}
            className="text-gray-300 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}