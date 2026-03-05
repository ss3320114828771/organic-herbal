// app/api/projects/[projectId]/members/route.ts

import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// GET /api/projects/[projectId]/members - Get all project members
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // Find project
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    // Get members from project
    const members = project.members || []

    return NextResponse.json({ 
      success: true, 
      members,
      count: members.length
    })

  } catch (error) {
    console.error('Error fetching project members:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch project members' 
    }, { status: 500 })
  }
}

// POST /api/projects/[projectId]/members - Add a new member
export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { userId, name, email, role } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required' 
      }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 })
    }

    if (!role) {
      return NextResponse.json({ 
        error: 'Role is required' 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['owner', 'admin', 'member', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      }, { status: 400 })
    }

    // Find project
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    // Initialize members array if it doesn't exist
    if (!project.members) {
      project.members = []
    }

    // Check if user is already a member
    const existingMember = project.members.find((m: any) => m.userId === userId)
    if (existingMember) {
      return NextResponse.json({ 
        error: 'User is already a member of this project' 
      }, { status: 409 })
    }

    // Create new member
    const newMember = {
      id: `m${Date.now()}`,
      userId,
      name,
      email,
      role,
      joinedAt: new Date().toISOString()
    }

    // Add to project
    project.members.push(newMember)

    // Update project in database
    await mockDb.update('projects', projectId, {
      members: project.members,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      member: newMember 
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding project member:', error)
    return NextResponse.json({ 
      error: 'Failed to add project member' 
    }, { status: 500 })
  }
}

// PUT /api/projects/[projectId]/members - Update member role
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { memberId, role } = body

    // Validate required fields
    if (!memberId) {
      return NextResponse.json({ 
        error: 'Member ID is required' 
      }, { status: 400 })
    }

    if (!role) {
      return NextResponse.json({ 
        error: 'Role is required' 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['owner', 'admin', 'member', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      }, { status: 400 })
    }

    // Find project
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    // Check if project has members
    if (!project.members) {
      return NextResponse.json({ 
        error: 'No members found in this project' 
      }, { status: 404 })
    }

    // Find member
    const memberIndex = project.members.findIndex((m: any) => m.id === memberId)

    if (memberIndex === -1) {
      return NextResponse.json({ 
        error: 'Member not found' 
      }, { status: 404 })
    }

    // Cannot change owner role if it's the last owner
    if (project.members[memberIndex].role === 'owner' && 
        project.members.filter((m: any) => m.role === 'owner').length === 1) {
      return NextResponse.json({ 
        error: 'Cannot change role of the last owner' 
      }, { status: 400 })
    }

    // Update member role
    project.members[memberIndex].role = role
    project.members[memberIndex].updatedAt = new Date().toISOString()

    // Update project in database
    await mockDb.update('projects', projectId, {
      members: project.members,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      member: project.members[memberIndex] 
    })

  } catch (error) {
    console.error('Error updating project member:', error)
    return NextResponse.json({ 
      error: 'Failed to update project member' 
    }, { status: 500 })
  }
}

// PATCH /api/projects/[projectId]/members - Partially update member
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { memberId, ...updates } = body

    if (!memberId) {
      return NextResponse.json({ 
        error: 'Member ID is required' 
      }, { status: 400 })
    }

    // Find project
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    if (!project.members) {
      return NextResponse.json({ 
        error: 'No members found in this project' 
      }, { status: 404 })
    }

    // Find member
    const memberIndex = project.members.findIndex((m: any) => m.id === memberId)

    if (memberIndex === -1) {
      return NextResponse.json({ 
        error: 'Member not found' 
      }, { status: 404 })
    }

    // Update member
    project.members[memberIndex] = {
      ...project.members[memberIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Update project in database
    await mockDb.update('projects', projectId, {
      members: project.members,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      member: project.members[memberIndex] 
    })

  } catch (error) {
    console.error('Error updating project member:', error)
    return NextResponse.json({ 
      error: 'Failed to update project member' 
    }, { status: 500 })
  }
}

// DELETE /api/projects/[projectId]/members - Remove a member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json({ 
        error: 'Member ID is required' 
      }, { status: 400 })
    }

    // Find project
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    if (!project.members) {
      return NextResponse.json({ 
        error: 'No members found in this project' 
      }, { status: 404 })
    }

    // Find member
    const member = project.members.find((m: any) => m.id === memberId)

    if (!member) {
      return NextResponse.json({ 
        error: 'Member not found' 
      }, { status: 404 })
    }

    // Cannot remove the last owner
    if (member.role === 'owner' && 
        project.members.filter((m: any) => m.role === 'owner').length === 1) {
      return NextResponse.json({ 
        error: 'Cannot remove the last owner' 
      }, { status: 400 })
    }

    // Remove member
    project.members = project.members.filter((m: any) => m.id !== memberId)

    // Update project in database
    await mockDb.update('projects', projectId, {
      members: project.members,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Member removed successfully' 
    })

  } catch (error) {
    console.error('Error removing project member:', error)
    return NextResponse.json({ 
      error: 'Failed to remove project member' 
    }, { status: 500 })
  }
}