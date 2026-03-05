import { NextResponse } from 'next/server'

// Mock data
let taskComments: any = {
  'task1': [
    { id: 'c1', content: 'Great progress!', userId: 'user1', userName: 'John Doe', createdAt: '2024-01-15T10:30:00Z' },
    { id: 'c2', content: 'I can help with this', userId: 'user2', userName: 'Jane Smith', createdAt: '2024-01-15T11:45:00Z' }
  ],
  'task2': [
    { id: 'c3', content: 'Need more details', userId: 'user1', userName: 'John Doe', createdAt: '2024-01-14T09:15:00Z' }
  ]
}

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const comments = taskComments[params.taskId] || []
  return NextResponse.json({ success: true, comments })
}

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const body = await request.json()
  const { content, userId, userName } = body
  
  if (!taskComments[params.taskId]) {
    taskComments[params.taskId] = []
  }
  
  const newComment = {
    id: `c${Date.now()}`,
    content,
    userId,
    userName,
    createdAt: new Date().toISOString()
  }
  
  taskComments[params.taskId].push(newComment)
  
  return NextResponse.json({ success: true, comment: newComment })
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const { searchParams } = new URL(request.url)
  const commentId = searchParams.get('commentId')
  
  if (taskComments[params.taskId]) {
    taskComments[params.taskId] = taskComments[params.taskId].filter(
      (c: any) => c.id !== commentId
    )
  }
  
  return NextResponse.json({ success: true })
}