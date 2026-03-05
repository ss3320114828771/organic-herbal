import { NextResponse } from 'next/server'

// Mock data
let projectTasks: Record<string, any[]> = {
  'project1': [
    { id: 'task1', title: 'Design homepage', status: 'DONE', priority: 'HIGH' },
    { id: 'task2', title: 'Implement API', status: 'IN_PROGRESS', priority: 'HIGH' },
    { id: 'task3', title: 'Write tests', status: 'TODO', priority: 'MEDIUM' }
  ],
  'project2': [
    { id: 'task4', title: 'Setup database', status: 'DONE', priority: 'HIGH' },
    { id: 'task5', title: 'Create models', status: 'IN_PROGRESS', priority: 'MEDIUM' }
  ]
}

// GET /api/projects/[projectId]/tasks
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { projectId } = await params  // CHANGE 2: await params
    
    const tasks = projectTasks[projectId] || []
    
    return NextResponse.json({ 
      success: true, 
      tasks,
      count: tasks.length 
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[projectId]/tasks
export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { projectId } = await params  // CHANGE 2: await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }
    
    // Initialize if not exists
    if (!projectTasks[projectId]) {
      projectTasks[projectId] = []
    }
    
    const newTask = {
      id: `task${Date.now()}`,
      title: body.title,
      description: body.description || '',
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      createdAt: new Date().toISOString()
    }
    
    projectTasks[projectId].push(newTask)
    
    return NextResponse.json({ 
      success: true, 
      task: newTask 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[projectId]/tasks - Update task
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { taskId, ...updates } = body
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!projectTasks[projectId]) {
      return NextResponse.json(
        { error: 'No tasks found for this project' },
        { status: 404 }
      )
    }
    
    const taskIndex = projectTasks[projectId].findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // Update task
    projectTasks[projectId][taskIndex] = {
      ...projectTasks[projectId][taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      task: projectTasks[projectId][taskIndex] 
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[projectId]/tasks - Partially update task
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { taskId, ...updates } = body
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!projectTasks[projectId]) {
      return NextResponse.json(
        { error: 'No tasks found for this project' },
        { status: 404 }
      )
    }
    
    const taskIndex = projectTasks[projectId].findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // Partially update task
    projectTasks[projectId][taskIndex] = {
      ...projectTasks[projectId][taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      task: projectTasks[projectId][taskIndex] 
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[projectId]/tasks
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { projectId } = await params  // CHANGE 2: await params
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!projectTasks[projectId]) {
      return NextResponse.json(
        { error: 'No tasks found for this project' },
        { status: 404 }
      )
    }
    
    const taskExists = projectTasks[projectId].some((t: any) => t.id === taskId)
    
    if (!taskExists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    projectTasks[projectId] = projectTasks[projectId].filter(
      (t: any) => t.id !== taskId
    )
    
    return NextResponse.json({ 
      success: true,
      message: 'Task deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}