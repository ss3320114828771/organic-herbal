import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'  // CHANGE: prisma se mockDb

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
  // In production, use JWT library
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

    // In a real app, you would store hashed passwords
    // For mockDb, we'll use a simple password check
    // In production, use bcrypt or similar
    const validPassword = password === 'password123' // Demo only

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

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Login failed'
    }, { status: 500 })
  }
}