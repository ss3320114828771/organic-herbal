import { NextResponse } from 'next/server'

// Mock data
let users = [
  {
    id: '1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-03T00:00:00Z'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    let filteredUsers = [...users]
    
    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role)
    }

    return NextResponse.json({
      success: true,
      users: filteredUsers
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newUser = {
      id: (users.length + 1).toString(),
      ...body,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)

    return NextResponse.json({
      success: true,
      user: newUser
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      users = users.filter(u => u.id !== id)
    }

    return NextResponse.json({
      success: true,
      message: 'Users deleted'
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to delete users' },
      { status: 500 }
    )
  }
}