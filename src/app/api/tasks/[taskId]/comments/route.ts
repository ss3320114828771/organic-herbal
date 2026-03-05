import { NextResponse } from 'next/server'

// Mock data
let taskComments: Record<string, any[]> = {
  'task1': [
    { id: 'c1', content: 'Great progress!', userId: 'user1', userName: 'John Doe', createdAt: '2024-01-15T10:30:00Z' },
    { id: 'c2', content: 'I can help with this', userId: 'user2', userName: 'Jane Smith', createdAt: '2024-01-15T11:45:00Z' }
  ],
  'task2': [
    { id: 'c3', content: 'Need more details', userId: 'user1', userName: 'John Doe', createdAt: '2024-01-14T09:15:00Z' }
  ]
}

// GET /api/tasks/[taskId]/comments - Get all comments for a task
export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const comments = taskComments[taskId] || []
    
    // Sort by newest first
    const sortedComments = [...comments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ 
      success: true, 
      comments: sortedComments,
      count: comments.length
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/tasks/[taskId]/comments - Add a new comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    const body = await request.json()
    const { content, userId, userName } = body
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }
    
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    if (!userName) {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      )
    }
    
    // Initialize comments array if it doesn't exist
    if (!taskComments[taskId]) {
      taskComments[taskId] = []
    }
    
    const newComment = {
      id: `c${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content,
      userId,
      userName,
      createdAt: new Date().toISOString()
    }
    
    taskComments[taskId].push(newComment)

    return NextResponse.json({ 
      success: true, 
      comment: newComment,
      message: 'Comment added successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[taskId]/comments - Update a comment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    const body = await request.json()
    const { commentId, content, userId } = body
    
    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }
    
    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }
    
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Check if task has comments
    if (!taskComments[taskId]) {
      return NextResponse.json(
        { error: 'No comments found for this task' },
        { status: 404 }
      )
    }
    
    // Find the comment
    const commentIndex = taskComments[taskId].findIndex(c => c.id === commentId)
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the comment
    if (taskComments[taskId][commentIndex].userId !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }
    
    // Update comment
    taskComments[taskId][commentIndex] = {
      ...taskComments[taskId][commentIndex],
      content,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      comment: taskComments[taskId][commentIndex],
      message: 'Comment updated successfully'
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[taskId]/comments - Partially update a comment
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    const body = await request.json()
    const { commentId, content, userId } = body
    
    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Check if task has comments
    if (!taskComments[taskId]) {
      return NextResponse.json(
        { error: 'No comments found for this task' },
        { status: 404 }
      )
    }
    
    // Find the comment
    const commentIndex = taskComments[taskId].findIndex(c => c.id === commentId)
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the comment
    if (taskComments[taskId][commentIndex].userId !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }
    
    // Update only content if provided
    if (content) {
      if (content.length > 1000) {
        return NextResponse.json(
          { error: 'Comment cannot exceed 1000 characters' },
          { status: 400 }
        )
      }
      
      taskComments[taskId][commentIndex] = {
        ...taskComments[taskId][commentIndex],
        content,
        updatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json({ 
      success: true, 
      comment: taskComments[taskId][commentIndex],
      message: 'Comment updated successfully'
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[taskId]/comments - Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    const userId = searchParams.get('userId')
    
    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Check if task has comments
    if (!taskComments[taskId]) {
      return NextResponse.json(
        { error: 'No comments found for this task' },
        { status: 404 }
      )
    }
    
    // Find the comment
    const commentIndex = taskComments[taskId].findIndex(c => c.id === commentId)
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the comment (optional - based on your requirements)
    // if (taskComments[taskId][commentIndex].userId !== userId) {
    //   return NextResponse.json(
    //     { error: 'You can only delete your own comments' },
    //     { status: 403 }
    //   )
    // }
    
    // Delete comment
    taskComments[taskId] = taskComments[taskId].filter(c => c.id !== commentId)

    return NextResponse.json({ 
      success: true,
      message: 'Comment deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[taskId]/comments/all - Delete all comments for a task
export async function DELETE_ALL(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }  // CHANGE 1: Promise type
) {
  try {
    const { taskId } = await params  // CHANGE 2: await params
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    if (taskComments[taskId]) {
      delete taskComments[taskId]
    }

    return NextResponse.json({ 
      success: true,
      message: 'All comments deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting all comments:', error)
    return NextResponse.json(
      { error: 'Failed to delete comments' },
      { status: 500 }
    )
  }
}