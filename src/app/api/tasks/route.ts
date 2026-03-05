import { NextResponse } from 'next/server'

// Mock data
let tasks = [
  {
    id: '1',
    title: 'Design homepage',
    description: 'Create wireframes',
    status: 'DONE',
    priority: 'HIGH',
    projectId: 'project1',
    assigneeId: 'user2',
    reporterId: 'user1',
    dueDate: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Implement API',
    description: 'Create REST endpoints',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectId: 'project1',
    assigneeId: 'user3',
    reporterId: 'user1',
    dueDate: '2024-02-15T00:00:00Z',
    createdAt: '2024-01-05T00:00:00Z'
  }
]

// Valid statuses and priorities
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED']
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

// GET /api/tasks - Get all tasks with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigneeId = searchParams.get('assigneeId')
    const search = searchParams.get('search')
    
    let filteredTasks = [...tasks]
    
    // Apply filters
    if (projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === projectId)
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status)
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === priority)
    }
    
    if (assigneeId) {
      filteredTasks = filteredTasks.filter(t => t.assigneeId === assigneeId)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTasks = filteredTasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks,
      total: filteredTasks.length
    })

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// GET /api/tasks/[id] - Get single task by ID
export async function GET_BY_ID(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = tasks.find(t => t.id === params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      task
    })

  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create new task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.projectId) {
      return NextResponse.json(
        { error: 'Title and projectId are required' },
        { status: 400 }
      )
    }
    
    // Validate status if provided
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validate priority if provided
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      )
    }
    
    const newTask = {
      id: (tasks.length + 1).toString(),
      title: body.title,
      description: body.description || '',
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      projectId: body.projectId,
      assigneeId: body.assigneeId || null,
      reporterId: body.reporterId || 'user1',
      dueDate: body.dueDate || null,
      createdAt: new Date().toISOString()
    }
    
    tasks.push(newTask)

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

// PUT /api/tasks - Update task
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const taskIndex = tasks.findIndex(t => t.id === body.id)
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // Validate status if updating
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validate priority if updating
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      task: tasks[taskIndex]
    })

  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks - Partially update task
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const taskIndex = tasks.findIndex(t => t.id === body.id)
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // Validate status if updating
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validate priority if updating
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Update only provided fields
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      task: tasks[taskIndex]
    })

  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks - Delete task(s)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const taskExists = tasks.some(t => t.id === id)
    
    if (!taskExists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    tasks = tasks.filter(t => t.id !== id)

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

// DELETE /api/tasks/bulk - Delete multiple tasks
export async function DELETE_BULK(request: Request) {
  try {
    const body = await request.json()
    const { ids } = body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Task IDs array is required' },
        { status: 400 }
      )
    }
    
    const initialCount = tasks.length
    tasks = tasks.filter(t => !ids.includes(t.id))
    const deletedCount = initialCount - tasks.length

    return NextResponse.json({
      success: true,
      message: `${deletedCount} tasks deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting tasks:', error)
    return NextResponse.json(
      { error: 'Failed to delete tasks' },
      { status: 500 }
    )
  }
}