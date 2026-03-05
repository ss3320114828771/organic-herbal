import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// Valid statuses and priorities
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED']
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

// GET /api/tasks/[taskId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params

    const task = await mockDb.findById('tasks', taskId)

    if (!task) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      task 
    })
  } catch (error) {
    console.error('Error in GET task:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch task' 
    }, { status: 500 })
  }
}

// PUT /api/tasks/[taskId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 })
    }
    
    if (!body.projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 })
    }
    
    // Validate status if provided
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      }, { status: 400 })
    }
    
    // Validate priority if provided
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json({ 
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` 
      }, { status: 400 })
    }
    
    const task = await mockDb.update('tasks', taskId, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    if (!task) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      task 
    })
  } catch (error) {
    console.error('Error in PUT task:', error)
    return NextResponse.json({ 
      error: 'Failed to update task' 
    }, { status: 500 })
  }
}

// DELETE /api/tasks/[taskId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params
    
    const deleted = await mockDb.delete('tasks', taskId)

    if (!deleted) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Task deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE task:', error)
    return NextResponse.json({ 
      error: 'Failed to delete task' 
    }, { status: 500 })
  }
}