import { NextResponse } from 'next/server'

// Mock data
let projectTasks: any = {
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

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const tasks = projectTasks[params.projectId] || []
  return NextResponse.json({ success: true, tasks })
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const body = await request.json()
  
  if (!projectTasks[params.projectId]) {
    projectTasks[params.projectId] = []
  }
  
  const newTask = {
    id: `task${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString()
  }
  
  projectTasks[params.projectId].push(newTask)
  
  return NextResponse.json({ success: true, task: newTask })
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')
  
  if (projectTasks[params.projectId]) {
    projectTasks[params.projectId] = projectTasks[params.projectId].filter(
      (t: any) => t.id !== taskId
    )
  }
  
  return NextResponse.json({ success: true })
}