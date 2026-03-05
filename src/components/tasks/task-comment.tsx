'use client'

import React from 'react'

interface TaskCommentProps {
  comments?: SimpleComment[]
  onAddComment?: (content: string) => void
  className?: string
}

interface SimpleComment {
  id: string
  content: string
  createdAt: string
  userName: string
}

export default function TaskComment({
  comments = [],
  onAddComment,
  className = ''
}: TaskCommentProps) {
  const [newComment, setNewComment] = React.useState('')

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment)
      setNewComment('')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments list */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                {comment.userName.charAt(0).toUpperCase()}
              </div>

              {/* Comment */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{comment.userName}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add comment */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}