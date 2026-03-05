// lib/services/task-service.ts

// Types
export interface TaskComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

export interface TaskAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

export interface TaskSubtask {
  id: string
  title: string
  completed: boolean
  assigneeId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  projectId: string
  projectName?: string
  assigneeId?: string
  assigneeName?: string
  reporterId: string
  reporterName?: string
  labels: string[]
  dueDate?: string
  startDate?: string
  completedDate?: string
  estimatedHours?: number
  actualHours?: number
  storyPoints?: number
  attachments: TaskAttachment[]
  comments: TaskComment[]
  subtasks: TaskSubtask[]
  createdAt: string
  updatedAt?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  projectId: string
  assigneeId?: string
  labels?: string[]
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  storyPoints?: number
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  assigneeId?: string
  labels?: string[]
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  actualHours?: number
  storyPoints?: number
  completedDate?: string
}

// Mock database
let tasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage',
    description: 'Create wireframes and mockups for the new homepage',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p1',
    projectName: 'Website Redesign',
    assigneeId: 'u2',
    assigneeName: 'Jane Smith',
    reporterId: 'u1',
    reporterName: 'John Doe',
    labels: ['design', 'ui'],
    dueDate: '2024-03-15',
    estimatedHours: 8,
    actualHours: 3,
    storyPoints: 3,
    attachments: [
      {
        id: 'a1',
        name: 'wireframes.pdf',
        url: '/files/wireframes.pdf',
        type: 'application/pdf',
        size: 2048576,
        uploadedBy: 'Jane Smith',
        uploadedAt: '2024-03-10'
      }
    ],
    comments: [
      {
        id: 'c1',
        userId: 'u1',
        userName: 'John Doe',
        content: 'Looking good! Can we make the header larger?',
        createdAt: '2024-03-11'
      },
      {
        id: 'c2',
        userId: 'u2',
        userName: 'Jane Smith',
        content: 'Sure, I\'ll update it.',
        createdAt: '2024-03-11'
      }
    ],
    subtasks: [
      {
        id: 's1',
        title: 'Create wireframes',
        completed: true,
        assigneeId: 'u2'
      },
      {
        id: 's2',
        title: 'Design mobile version',
        completed: false,
        assigneeId: 'u2'
      }
    ],
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add login/signup functionality with JWT',
    status: 'todo',
    priority: 'critical',
    projectId: 'p1',
    projectName: 'Website Redesign',
    assigneeId: 'u3',
    assigneeName: 'Mike Johnson',
    reporterId: 'u1',
    reporterName: 'John Doe',
    labels: ['backend', 'security'],
    dueDate: '2024-03-10',
    estimatedHours: 12,
    storyPoints: 5,
    attachments: [],
    comments: [],
    subtasks: [],
    createdAt: '2024-03-02'
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Create user documentation for the API',
    status: 'review',
    priority: 'low',
    projectId: 'p2',
    projectName: 'API Development',
    assigneeId: 'u1',
    assigneeName: 'John Doe',
    reporterId: 'u2',
    reporterName: 'Jane Smith',
    labels: ['docs'],
    dueDate: '2024-03-05',
    estimatedHours: 4,
    actualHours: 4,
    storyPoints: 1,
    attachments: [],
    comments: [],
    subtasks: [],
    createdAt: '2024-02-28'
  },
  {
    id: '4',
    title: 'Fix navigation bug',
    description: 'Menu doesn\'t work on mobile devices',
    status: 'blocked',
    priority: 'high',
    projectId: 'p1',
    projectName: 'Website Redesign',
    assigneeId: 'u3',
    assigneeName: 'Mike Johnson',
    reporterId: 'u2',
    reporterName: 'Jane Smith',
    labels: ['bug', 'frontend'],
    dueDate: '2024-03-08',
    estimatedHours: 2,
    storyPoints: 2,
    attachments: [],
    comments: [],
    subtasks: [],
    createdAt: '2024-03-03'
  },
  {
    id: '5',
    title: 'Deploy to production',
    description: 'Deploy the application to production server',
    status: 'done',
    priority: 'medium',
    projectId: 'p2',
    projectName: 'API Development',
    assigneeId: 'u1',
    assigneeName: 'John Doe',
    reporterId: 'u3',
    reporterName: 'Mike Johnson',
    labels: ['devops'],
    completedDate: '2024-03-04',
    estimatedHours: 2,
    actualHours: 1.5,
    storyPoints: 1,
    attachments: [],
    comments: [],
    subtasks: [],
    createdAt: '2024-03-01'
  }
]

// Generate task ID
function generateId(): string {
  return String(tasks.length + 1)
}

// Create new task
export async function createTask(
  data: CreateTaskData,
  reporterId: string,
  reporterName: string
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    if (!data.title) {
      return { success: false, error: 'Task title is required' }
    }

    if (!data.projectId) {
      return { success: false, error: 'Project ID is required' }
    }

    const now = new Date().toISOString()

    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      reporterId,
      reporterName,
      labels: data.labels || [],
      dueDate: data.dueDate,
      startDate: data.startDate,
      estimatedHours: data.estimatedHours,
      storyPoints: data.storyPoints,
      attachments: [],
      comments: [],
      subtasks: [],
      createdAt: now
    }

    tasks.push(newTask)
    
    return { success: true, task: newTask }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create task' }
  }
}

// Get task by ID
export async function getTask(taskId: string): Promise<Task | undefined> {
  return tasks.find(t => t.id === taskId)
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  return tasks.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Get tasks by project
export async function getProjectTasks(projectId: string): Promise<Task[]> {
  return tasks
    .filter(t => t.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get tasks by assignee
export async function getUserTasks(userId: string): Promise<Task[]> {
  return tasks
    .filter(t => t.assigneeId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get tasks by status
export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  return tasks.filter(t => t.status === status)
}

// Update task - FIXED line 330
export async function updateTask(
  taskId: string,
  data: UpdateTaskData
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const updates: any = { ...data, updatedAt: new Date().toISOString() }

    // If status is being set to 'done' and it wasn't done before, set completed date
    if (data.status === 'done' && task.status !== 'done') {
      updates.completedDate = new Date().toISOString()
    }

    Object.assign(task, updates)
    
    return { success: true, task }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete task
export async function deleteTask(taskId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = tasks.findIndex(t => t.id === taskId)
    
    if (index === -1) {
      return { success: false, error: 'Task not found' }
    }

    tasks.splice(index, 1)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update task status
export async function updateTaskStatus(
  taskId: string,
  status: Task['status']
): Promise<{ success: boolean; error?: string }> {
  const result = await updateTask(taskId, { status })
  return { success: result.success, error: result.error }
}

// Assign task to user
export async function assignTask(
  taskId: string,
  assigneeId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await updateTask(taskId, { assigneeId })
  return { success: result.success, error: result.error }
}

// Add comment to task
export async function addTaskComment(
  taskId: string,
  userId: string,
  userName: string,
  content: string
): Promise<{ success: boolean; comment?: TaskComment; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const newComment: TaskComment = {
      id: String(task.comments.length + 1),
      userId,
      userName,
      content,
      createdAt: new Date().toISOString()
    }

    task.comments.push(newComment)
    
    return { success: true, comment: newComment }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete comment
export async function deleteTaskComment(
  taskId: string,
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    task.comments = task.comments.filter(c => c.id !== commentId)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Add subtask
export async function addSubtask(
  taskId: string,
  title: string,
  assigneeId?: string
): Promise<{ success: boolean; subtask?: TaskSubtask; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const newSubtask: TaskSubtask = {
      id: String(task.subtasks.length + 1),
      title,
      completed: false,
      assigneeId
    }

    task.subtasks.push(newSubtask)
    
    return { success: true, subtask: newSubtask }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update subtask
export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const subtask = task.subtasks.find(s => s.id === subtaskId)
    if (subtask) {
      subtask.completed = completed
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete subtask
export async function deleteSubtask(
  taskId: string,
  subtaskId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Add attachment
export async function addTaskAttachment(
  taskId: string,
  attachment: Omit<TaskAttachment, 'id'>
): Promise<{ success: boolean; attachment?: TaskAttachment; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    const newAttachment: TaskAttachment = {
      id: String(task.attachments.length + 1),
      ...attachment
    }

    task.attachments.push(newAttachment)
    
    return { success: true, attachment: newAttachment }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete attachment
export async function deleteTaskAttachment(
  taskId: string,
  attachmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    task.attachments = task.attachments.filter(a => a.id !== attachmentId)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get task statistics
export async function getTaskStats(): Promise<{
  total: number
  todo: number
  inProgress: number
  review: number
  done: number
  blocked: number
  totalEstimatedHours: number
  totalActualHours: number
  completionRate: number
}> {
  const total = tasks.length
  const todo = tasks.filter(t => t.status === 'todo').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const review = tasks.filter(t => t.status === 'review').length
  const done = tasks.filter(t => t.status === 'done').length
  const blocked = tasks.filter(t => t.status === 'blocked').length
  
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0)
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  return {
    total,
    todo,
    inProgress,
    review,
    done,
    blocked,
    totalEstimatedHours,
    totalActualHours,
    completionRate
  }
}

// Search tasks
export async function searchTasks(query: string): Promise<Task[]> {
  const lowercaseQuery = query.toLowerCase()
  
  return tasks.filter(t => 
    t.title.toLowerCase().includes(lowercaseQuery) ||
    t.description?.toLowerCase().includes(lowercaseQuery) ||
    t.labels.some(label => label.toLowerCase().includes(lowercaseQuery))
  )
}

// Get overdue tasks
export async function getOverdueTasks(): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0]
  
  return tasks.filter(t => 
    t.dueDate && t.dueDate < today && t.status !== 'done'
  )
}

// Get tasks by label
export async function getTasksByLabel(label: string): Promise<Task[]> {
  return tasks.filter(t => t.labels.includes(label))
}

// Get tasks by date range
export async function getTasksByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Task[]> {
  return tasks.filter(t => {
    const taskDate = new Date(t.createdAt)
    return taskDate >= startDate && taskDate <= endDate
  })
}

// Example usage
export async function example() {
  // Create task
  const newTask = await createTask({
    title: 'New Task',
    description: 'Task description',
    priority: 'high',
    projectId: 'p1',
    assigneeId: 'u2',
    dueDate: '2024-03-20',
    estimatedHours: 8
  }, 'u1', 'John Doe')

  if (newTask.success && newTask.task) {
    console.log('Task created:', newTask.task.title)

    // Add comment
    await addTaskComment(newTask.task.id, 'u1', 'John Doe', 'Great work!')

    // Add subtask
    await addSubtask(newTask.task.id, 'Step 1', 'u2')
  }

  // Get project tasks
  const projectTasks = await getProjectTasks('p1')
  console.log('Project tasks:', projectTasks.length)

  // Update task status
  if (newTask.task) {
    await updateTaskStatus(newTask.task.id, 'in-progress')
  }

  // Get stats
  const stats = await getTaskStats()
  console.log('Completion rate:', stats.completionRate + '%')
}