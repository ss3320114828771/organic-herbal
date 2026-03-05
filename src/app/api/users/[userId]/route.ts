import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// GET /api/users/[userId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    const user = await mockDb.findById('users', userId)

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Error in GET user:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user' 
    }, { status: 500 })
  }
}

// PUT /api/users/[userId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Name is required' 
      }, { status: 400 })
    }
    
    const user = await mockDb.update('users', userId, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Error in PUT user:', error)
    return NextResponse.json({ 
      error: 'Failed to update user' 
    }, { status: 500 })
  }
}

// DELETE /api/users/[userId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    const deleted = await mockDb.delete('users', userId)

    if (!deleted) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE user:', error)
    return NextResponse.json({ 
      error: 'Failed to delete user' 
    }, { status: 500 })
  }
}