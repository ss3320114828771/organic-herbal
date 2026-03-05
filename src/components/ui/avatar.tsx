'use client'

import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square' | 'rounded'
  status?: 'online' | 'offline' | 'away' | 'busy'
  bordered?: boolean
  borderColor?: string
  className?: string
  onClick?: () => void
  fallback?: React.ReactNode
}

export default function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  shape = 'circle',
  status,
  bordered = false,
  borderColor = 'border-white',
  className = '',
  onClick,
  fallback
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4'
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomColor = (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  const renderContent = () => {
    // If image exists and no error, show image
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${shapeClasses[shape]}`}
          onError={() => setImageError(true)}
        />
      )
    }

    // If custom fallback provided
    if (fallback) {
      return fallback
    }

    // If name provided, show initials
    if (name) {
      return (
        <div className="w-full h-full flex items-center justify-center font-medium text-white">
          {getInitials(name)}
        </div>
      )
    }

    // Default fallback
    return (
      <svg
        className="w-full h-full text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }

  const bgColor = name && !src ? getRandomColor(name) : ''

  return (
    <div
      className={`relative inline-flex ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Avatar content */}
      <div
        className={`
          w-full h-full overflow-hidden ${shapeClasses[shape]} 
          ${bgColor} flex items-center justify-center
          ${bordered ? `border-2 ${borderColor}` : ''}
          ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        `}
      >
        {renderContent()}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block ${statusSizes[size]} 
            rounded-full ${statusColors[status]} 
            ring-2 ring-white
          `}
        />
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// User avatar with name
export function UserAvatar({ user, size = 'md', onClick }: {
  user: { name: string; avatar?: string }
  size?: AvatarProps['size']
  onClick?: () => void
}) {
  return (
    <Avatar
      src={user.avatar}
      name={user.name}
      size={size}
      onClick={onClick}
    />
  )
}

// Team avatar (multiple avatars stacked)
export function TeamAvatar({ users, limit = 3, size = 'sm' }: {
  users: Array<{ name: string; avatar?: string }>
  limit?: number
  size?: AvatarProps['size']
}) {
  const displayUsers = users.slice(0, limit)
  const remaining = users.length - limit

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.avatar}
          name={user.name}
          size={size}
          bordered={true}
          borderColor="border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${size === 'xs' ? 'w-6 h-6 text-xs' :
              size === 'sm' ? 'w-8 h-8 text-sm' :
              size === 'md' ? 'w-10 h-10 text-base' :
              size === 'lg' ? 'w-12 h-12 text-lg' :
              'w-16 h-16 text-xl'}
            rounded-full bg-gray-200 flex items-center justify-center
            text-gray-600 font-medium border-2 border-white
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

// Avatar with name and email
export function AvatarWithDetails({ user, size = 'md' }: {
  user: { name: string; email?: string; avatar?: string }
  size?: AvatarProps['size']
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={user.avatar} name={user.name} size={size} />
      <div>
        <p className="font-medium text-gray-800">{user.name}</p>
        {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
      </div>
    </div>
  )
}

// Avatar menu (clickable with dropdown)
export function AvatarMenu({ user, children }: {
  user: { name: string; avatar?: string }
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <Avatar src={user.avatar} name={user.name} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          {children}
        </div>
      )}
    </div>
  )
}

// ==================== ICON COMPONENTS ====================

// Upload avatar component
export function UploadAvatar({ currentSrc, onUpload }: {
  currentSrc?: string
  onUpload: (file: File) => void
}) {
  const [preview, setPreview] = React.useState<string | undefined>(currentSrc)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onUpload(file)
    }
  }

  return (
    <div className="relative group">
      <Avatar src={preview} size="xl" />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span className="text-white text-sm">Upload</span>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

// ==================== HOOK ====================

// Custom hook for avatar
export function useAvatar(initialSrc?: string) {
  const [src, setSrc] = React.useState<string | undefined>(initialSrc)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const uploadAvatar = async (file: File) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      setSrc(url)
      
      return url
    } catch (err) {
      setError('Failed to upload avatar')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeAvatar = () => {
    if (src?.startsWith('blob:')) {
      URL.revokeObjectURL(src)
    }
    setSrc(undefined)
  }

  return {
    src,
    loading,
    error,
    uploadAvatar,
    removeAvatar
  }
}