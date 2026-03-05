import { NextResponse } from 'next/server'

// Mock data
let projectMembers: any = {
  'project1': [
    { id: 'user1', name: 'John Doe', role: 'OWNER' },
    { id: 'user2', name: 'Jane Smith', role: 'MEMBER' },
    { id: 'user3', name: 'Bob Johnson', role: 'MEMBER' }
  ],
  'project2': [
    { id: 'user1', name: 'John Doe', role: 'OWNER' },
    { id: 'user4', name: 'Alice Brown', role: 'MEMBER' }
  ]
}

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const members = projectMembers[params.projectId] || []
  return NextResponse.json({ success: true, members })
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const body = await request.json()
  const { userId, name, role = 'MEMBER' } = body
  
  if (!projectMembers[params.projectId]) {
    projectMembers[params.projectId] = []
  }
  
  const newMember = { id: userId, name, role }
  projectMembers[params.projectId].push(newMember)
  
  return NextResponse.json({ success: true, member: newMember })
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (projectMembers[params.projectId]) {
    projectMembers[params.projectId] = projectMembers[params.projectId].filter(
      (m: any) => m.id !== userId
    )
  }
  
  return NextResponse.json({ success: true })
}