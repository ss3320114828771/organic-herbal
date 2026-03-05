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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    
    let filteredTasks = [...tasks]
    
    if (projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === projectId)
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status)
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newTask = {
      id: (tasks.length + 1).toString(),
      ...body,
      reporterId: 'user1',
      createdAt: new Date().toISOString()
    }
    
    tasks.push(newTask)

    return NextResponse.json({
      success: true,
      task: newTask
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      tasks = tasks.filter(t => t.id !== id)
    }

    return NextResponse.json({
      success: true,
      message: 'Tasks deleted'
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to delete tasks' },
      { status: 500 }
    )
  }
}