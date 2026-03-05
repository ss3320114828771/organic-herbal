import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// GET /api/projects/[projectId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    
    const project = await mockDb.findById('projects', projectId)

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      project 
    })
  } catch (error) {
    console.error('Error in GET project:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch project' 
    }, { status: 500 })
  }
}

// PUT /api/projects/[projectId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Project name is required' 
      }, { status: 400 })
    }
    
    const project = await mockDb.update('projects', projectId, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      project 
    })
  } catch (error) {
    console.error('Error in PUT project:', error)
    return NextResponse.json({ 
      error: 'Failed to update project' 
    }, { status: 500 })
  }
}

// DELETE /api/projects/[projectId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    
    const deleted = await mockDb.delete('projects', projectId)

    if (!deleted) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE project:', error)
    return NextResponse.json({ 
      error: 'Failed to delete project' 
    }, { status: 500 })
  }
}