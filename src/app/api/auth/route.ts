// app/api/auth/route.ts

import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Simple password comparison
async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

// Generate simple token
function generateToken(user: any): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }
  
  // Simple base64 encoding (for demo only - use proper JWT in production)
  const token = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `mock-token-${token}`
}

// Verify token function
function verifyToken(token: string): any {
  try {
    if (!token || !token.startsWith('mock-token-')) {
      return null
    }
    
    const tokenData = token.replace('mock-token-', '')
    const decoded = JSON.parse(Buffer.from(tokenData, 'base64').toString())
    
    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null // Token expired
    }
    
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// POST /api/auth/login - Login endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Find user by email from mockDb
    const users = await mockDb.find('users', { email })
    const user = users[0]

    if (!user) {
      return NextResponse.json({
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // In mockDb, we'll use a simple password check
    // For demo purposes, valid password is "password123"
    const validPassword = password === 'password123'

    if (!validPassword) {
      return NextResponse.json({
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    // Update last login
    await mockDb.update('users', user.id, {
      lastLogin: new Date().toISOString()
    })

    // Return success response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Login failed'
    }, { status: 500 })
  }
}

// GET /api/auth/me - Get current user
export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({
        error: 'No token provided'
      }, { status: 401 })
    }

    // Verify token
    const userData = verifyToken(token)

    if (!userData) {
      return NextResponse.json({
        error: 'Invalid or expired token'
      }, { status: 401 })
    }

    // Get fresh user data from database
    const user = await mockDb.findById('users', userData.id)

    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      error: 'Authentication failed'
    }, { status: 500 })
  }
}

// PUT /api/auth/change-password - Change password
export async function PUT(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({
        error: 'No token provided'
      }, { status: 401 })
    }

    // Verify token
    const userData = verifyToken(token)

    if (!userData) {
      return NextResponse.json({
        error: 'Invalid or expired token'
      }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        error: 'Current password and new password are required'
      }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        error: 'New password must be at least 6 characters'
      }, { status: 400 })
    }

    // Get user from database
    const user = await mockDb.findById('users', userData.id)

    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    // Verify current password
    if (currentPassword !== 'password123') { // Mock check
      return NextResponse.json({
        error: 'Current password is incorrect'
      }, { status: 401 })
    }

    // Update password (in production, hash the new password)
    await mockDb.update('users', user.id, {
      password: await hashPassword(newPassword),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({
      error: 'Failed to change password'
    }, { status: 500 })
  }
}

// DELETE /api/auth/logout - Logout
export async function DELETE(request: Request) {
  // In a token-based auth, logout is handled client-side
  // by removing the token
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}