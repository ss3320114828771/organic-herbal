import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const task = await mockDb.findById('tasks', params.taskId)

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
    console.error('Error in GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch task' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 })
    }
    
    const task = await mockDb.update('tasks', params.taskId, {
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
    console.error('Error in PUT:', error)
    return NextResponse.json({ 
      error: 'Failed to update task' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const deleted = await mockDb.delete('tasks', params.taskId)
    
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
    console.error('Error in DELETE:', error)
    return NextResponse.json({ 
      error: 'Failed to delete task' 
    }, { status: 500 })
  }
}