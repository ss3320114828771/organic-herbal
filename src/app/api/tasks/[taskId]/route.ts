import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// Valid statuses and priorities
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED']
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

// GET /api/tasks/[taskId] - Get single task
export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    
    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }

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

// PUT /api/tasks/[taskId] - Update entire task
export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    const body = await request.json()
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }
    
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
    
    // Check if task exists
    const existingTask = await mockDb.findById('tasks', taskId)
    if (!existingTask) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }
    
    // Update task
    const updatedTask = await mockDb.update('tasks', taskId, {
      title: body.title,
      description: body.description || existingTask.description,
      status: body.status || existingTask.status,
      priority: body.priority || existingTask.priority,
      projectId: body.projectId,
      assigneeId: body.assigneeId || existingTask.assigneeId,
      dueDate: body.dueDate || existingTask.dueDate,
      updatedAt: new Date().toISOString()
    })
    
    return NextResponse.json({ 
      success: true, 
      task: updatedTask,
      message: 'Task updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT task:', error)
    return NextResponse.json({ 
      error: 'Failed to update task' 
    }, { status: 500 })
  }
}

// PATCH /api/tasks/[taskId] - Partially update task
export async function PATCH(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    const body = await request.json()
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }
    
    // Check if task exists
    const existingTask = await mockDb.findById('tasks', taskId)
    if (!existingTask) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }
    
    // Validate status if updating
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      }, { status: 400 })
    }
    
    // Validate priority if updating
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json({ 
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` 
      }, { status: 400 })
    }
    
    // Prepare update data (only provided fields)
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.projectId !== undefined) updateData.projectId = body.projectId
    if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate
    
    // Update task
    const updatedTask = await mockDb.update('tasks', taskId, updateData)
    
    return NextResponse.json({ 
      success: true, 
      task: updatedTask,
      message: 'Task updated successfully'
    })
  } catch (error) {
    console.error('Error in PATCH task:', error)
    return NextResponse.json({ 
      error: 'Failed to update task' 
    }, { status: 500 })
  }
}

// DELETE /api/tasks/[taskId] - Delete task
export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }
    
    // Check if task exists
    const existingTask = await mockDb.findById('tasks', taskId)
    if (!existingTask) {
      return NextResponse.json({ 
        error: 'Task not found' 
      }, { status: 404 })
    }
    
    // Delete task
    const deleted = await mockDb.delete('tasks', taskId)
    
    if (!deleted) {
      return NextResponse.json({ 
        error: 'Failed to delete task' 
      }, { status: 500 })
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