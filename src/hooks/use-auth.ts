'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  avatar?: string
  createdAt: string
  lastLogin?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })
  
  const router = useRouter()

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')
        
        if (storedUser && storedToken) {
          setState({
            user: JSON.parse(storedUser),
            isLoading: false,
            error: null
          })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: 'Failed to load user'
        })
      }
    }
    
    loadUser()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required')
      }
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: credentials.email.includes('admin') ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      if (credentials.remember) {
        localStorage.setItem('remember', 'true')
      }
      
      setState({
        user: mockUser,
        isLoading: false,
        error: null
      })
      
      return { success: true, user: mockUser }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Login failed'
      })
      return { success: false, error: error.message }
    }
  }, [])

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validate
      if (!data.name || !data.email || !data.password) {
        throw new Error('All fields are required')
      }
      
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      // Mock user data
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      setState({
        user: mockUser,
        isLoading: false,
        error: null
      })
      
      return { success: true, user: mockUser }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Registration failed'
      })
      return { success: false, error: error.message }
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('remember')
    
    setState({
      user: null,
      isLoading: false,
      error: null
    })
    
    router.push('/login')
  }, [router])

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!state.user) {
      return { success: false, error: 'Not authenticated' }
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = { ...state.user, ...data }
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      setState({
        user: updatedUser,
        isLoading: false,
        error: null
      })
      
      return { success: true, user: updatedUser }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }, [state.user])

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!state.user) {
      return { success: false, error: 'Not authenticated' }
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters')
      }
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      return { success: true }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }, [state.user])

  // Check if user has role
  const hasRole = useCallback((role: User['role'] | User['role'][]) => {
    if (!state.user) return false
    
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(state.user.role)
  }, [state.user])

  // Check if authenticated
  const isAuthenticated = !!state.user

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole
  }
}

// Admin hook with additional permissions
export function useAdminAuth() {
  const auth = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(auth.hasRole('admin'))
  }, [auth.user])

  return {
    ...auth,
    isAdmin,
    canManageUsers: isAdmin,
    canManageContent: isAdmin || auth.hasRole('moderator')
  }
}

// Mock auth for development/testing
export function useMockAuth(initialUser?: Partial<User>) {
  const mockUser: User = {
    id: 'mock-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...initialUser
  }

  return {
    user: mockUser,
    isLoading: false,
    error: null,
    isAuthenticated: true,
    login: async () => ({ success: true, user: mockUser }),
    register: async () => ({ success: true, user: mockUser }),
    logout: () => {},
    updateProfile: async (data: any) => ({ success: true, user: { ...mockUser, ...data } }),
    changePassword: async () => ({ success: true }),
    hasRole: (role: any) => mockUser.role === role
  }
}