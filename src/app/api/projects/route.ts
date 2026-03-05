import { NextResponse } from 'next/server'

// Mock data
let projects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign company website',
    status: 'IN_PROGRESS',
    ownerId: 'user1',
    owner: { id: 'user1', name: 'John Doe' },
    members: [
      { id: 'user2', name: 'Jane Smith', role: 'MEMBER' }
    ],
    tasks: [],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create new mobile app',
    status: 'PLANNING',
    ownerId: 'user1',
    owner: { id: 'user1', name: 'John Doe' },
    members: [],
    tasks: [],
    createdAt: '2024-01-15T00:00:00Z'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let filteredProjects = [...projects]
    
    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status)
    }

    return NextResponse.json({
      success: true,
      projects: filteredProjects
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newProject = {
      id: (projects.length + 1).toString(),
      ...body,
      owner: { id: 'user1', name: 'John Doe' },
      members: [],
      tasks: [],
      createdAt: new Date().toISOString()
    }
    
    projects.push(newProject)

    return NextResponse.json({
      success: true,
      project: newProject
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      projects = projects.filter(p => p.id !== id)
    } else {
      projects = []
    }

    return NextResponse.json({
      success: true,
      message: 'Projects deleted'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete projects' },
      { status: 500 }
    )
  }
}