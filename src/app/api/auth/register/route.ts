import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Generate email verification token
function generateVerificationToken(): string {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone, newsletter } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name, email and password are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name must be between 2 and 50 characters',
          code: 'INVALID_NAME'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Password must be at least 8 characters',
          code: 'WEAK_PASSWORD'
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User with this email already exists',
          code: 'EMAIL_EXISTS'
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        newsletter: newsletter || false,
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        verificationTokenExpiry: verificationExpiry,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerified: true,
        newsletter: true,
        createdAt: true,
        profile: true
      }
    })

    // In a real app, send verification email here
    console.log(`
      ==================================
      VERIFICATION EMAIL
      To: ${email}
      Name: ${name}
      Verification Token: ${verificationToken}
      Verification Link: ${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}
      ==================================
    `)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        emailVerified: user.emailVerified,
        newsletter: user.newsletter,
        createdAt: user.createdAt
      },
      message: 'Registration successful. Please check your email to verify your account.',
      requiresVerification: true
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred during registration',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}