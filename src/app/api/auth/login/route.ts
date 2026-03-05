import { NextResponse } from 'next/server'
import db from '@/lib/db'  // Using our mock database

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user using db.findUnique (Prisma-compatible method)
    const user = await db.findUnique({
      where: { email }
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // INSECURE: Direct password comparison (for demo only)
    if (password !== user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create simple token (INSECURE - for demo only)
    const token = Buffer.from(
      JSON.stringify({ 
        id: user.id, 
        email: user.email,
        exp: Date.now() + 86400000 
      })
    ).toString('base64')

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ 
    success: true, 
    message: 'Auth API working' 
  })
}