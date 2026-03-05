import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const project = await mockDb.findById('projects', params.projectId)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }
    
    const project = await mockDb.update('projects', params.projectId, {
      ...body,
      updatedAt: new Date().toISOString()
    })
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const deleted = await mockDb.delete('projects', params.projectId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}