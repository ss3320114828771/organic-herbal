// lib/validators/task.ts

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}

// Task title validation
export function validateTaskTitle(title: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!title) {
    errors.push({ field: 'title', message: 'Task title is required' })
  } else if (typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Task title must be a string' })
  } else {
    if (title.length < 3) {
      errors.push({ field: 'title', message: 'Task title must be at least 3 characters' })
    }
    if (title.length > 200) {
      errors.push({ field: 'title', message: 'Task title must be less than 200 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Task description validation
export function validateTaskDescription(description?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (description) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' })
    } else if (description.length > 5000) {
      errors.push({ field: 'description', message: 'Description must be less than 5000 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Task status validation
export function validateTaskStatus(status: string): ValidationResult {
  const errors: ValidationError[] = []
  const validStatuses = ['todo', 'in-progress', 'review', 'done', 'blocked']

  if (!status) {
    errors.push({ field: 'status', message: 'Status is required' })
  } else if (!validStatuses.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Task priority validation
export function validateTaskPriority(priority: string): ValidationResult {
  const errors: ValidationError[] = []
  const validPriorities = ['low', 'medium', 'high', 'critical']

  if (!priority) {
    errors.push({ field: 'priority', message: 'Priority is required' })
  } else if (!validPriorities.includes(priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${validPriorities.join(', ')}` })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Project ID validation
export function validateProjectId(projectId: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!projectId) {
    errors.push({ field: 'projectId', message: 'Project ID is required' })
  } else if (typeof projectId !== 'string') {
    errors.push({ field: 'projectId', message: 'Project ID must be a string' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Assignee ID validation
export function validateAssigneeId(assigneeId?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (assigneeId && typeof assigneeId !== 'string') {
    errors.push({ field: 'assigneeId', message: 'Assignee ID must be a string' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Due date validation
export function validateDueDate(dueDate?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (dueDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dueDate)) {
      errors.push({ field: 'dueDate', message: 'Due date must be in YYYY-MM-DD format' })
    } else {
      const date = new Date(dueDate)
      if (isNaN(date.getTime())) {
        errors.push({ field: 'dueDate', message: 'Please enter a valid date' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Start date validation
export function validateStartDate(startDate?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (startDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(startDate)) {
      errors.push({ field: 'startDate', message: 'Start date must be in YYYY-MM-DD format' })
    } else {
      const date = new Date(startDate)
      if (isNaN(date.getTime())) {
        errors.push({ field: 'startDate', message: 'Please enter a valid date' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Date range validation
export function validateTaskDateRange(startDate?: string, dueDate?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (startDate && dueDate) {
    const start = new Date(startDate)
    const due = new Date(dueDate)
    if (due < start) {
      errors.push({ field: 'dueDate', message: 'Due date cannot be before start date' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Estimated hours validation
export function validateEstimatedHours(hours?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (hours !== undefined && hours !== null) {
    if (typeof hours !== 'number') {
      errors.push({ field: 'estimatedHours', message: 'Estimated hours must be a number' })
    } else if (isNaN(hours)) {
      errors.push({ field: 'estimatedHours', message: 'Estimated hours must be a valid number' })
    } else if (hours < 0) {
      errors.push({ field: 'estimatedHours', message: 'Estimated hours cannot be negative' })
    } else if (hours > 1000) {
      errors.push({ field: 'estimatedHours', message: 'Estimated hours cannot exceed 1000' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Actual hours validation
export function validateActualHours(hours?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (hours !== undefined && hours !== null) {
    if (typeof hours !== 'number') {
      errors.push({ field: 'actualHours', message: 'Actual hours must be a number' })
    } else if (isNaN(hours)) {
      errors.push({ field: 'actualHours', message: 'Actual hours must be a valid number' })
    } else if (hours < 0) {
      errors.push({ field: 'actualHours', message: 'Actual hours cannot be negative' })
    } else if (hours > 1000) {
      errors.push({ field: 'actualHours', message: 'Actual hours cannot exceed 1000' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Story points validation
export function validateStoryPoints(points?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (points !== undefined && points !== null) {
    if (typeof points !== 'number') {
      errors.push({ field: 'storyPoints', message: 'Story points must be a number' })
    } else if (isNaN(points)) {
      errors.push({ field: 'storyPoints', message: 'Story points must be a valid number' })
    } else if (!Number.isInteger(points)) {
      errors.push({ field: 'storyPoints', message: 'Story points must be a whole number' })
    } else if (points < 0) {
      errors.push({ field: 'storyPoints', message: 'Story points cannot be negative' })
    } else if (points > 100) {
      errors.push({ field: 'storyPoints', message: 'Story points cannot exceed 100' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Labels validation
export function validateTaskLabels(labels: string[]): ValidationResult {
  const errors: ValidationError[] = []

  if (labels) {
    if (!Array.isArray(labels)) {
      errors.push({ field: 'labels', message: 'Labels must be an array' })
    } else {
      if (labels.length > 20) {
        errors.push({ field: 'labels', message: 'Cannot have more than 20 labels' })
      }

      labels.forEach((label, index) => {
        if (typeof label !== 'string') {
          errors.push({ field: `labels[${index}]`, message: 'Each label must be a string' })
        } else if (label.length < 1) {
          errors.push({ field: `labels[${index}]`, message: 'Label cannot be empty' })
        } else if (label.length > 30) {
          errors.push({ field: `labels[${index}]`, message: 'Label must be less than 30 characters' })
        }
      })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Subtask validation
export function validateSubtask(subtask: {
  title: string
  completed?: boolean
  assigneeId?: string
}): ValidationResult {
  const errors: ValidationError[] = []

  if (!subtask.title) {
    errors.push({ field: 'title', message: 'Subtask title is required' })
  } else if (typeof subtask.title !== 'string') {
    errors.push({ field: 'title', message: 'Subtask title must be a string' })
  } else if (subtask.title.length < 1) {
    errors.push({ field: 'title', message: 'Subtask title must be at least 1 character' })
  } else if (subtask.title.length > 200) {
    errors.push({ field: 'title', message: 'Subtask title must be less than 200 characters' })
  }

  if (subtask.assigneeId && typeof subtask.assigneeId !== 'string') {
    errors.push({ field: 'assigneeId', message: 'Assignee ID must be a string' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Subtasks validation
export function validateSubtasks(subtasks: any[]): ValidationResult {
  const errors: ValidationError[] = []

  if (subtasks) {
    if (!Array.isArray(subtasks)) {
      errors.push({ field: 'subtasks', message: 'Subtasks must be an array' })
    } else {
      if (subtasks.length > 50) {
        errors.push({ field: 'subtasks', message: 'Cannot have more than 50 subtasks' })
      }

      subtasks.forEach((subtask, index) => {
        const result = validateSubtask(subtask)
        result.errors.forEach(error => {
          errors.push({
            field: `subtasks[${index}].${error.field}`,
            message: error.message
          })
        })
      })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Comment validation
export function validateComment(comment: {
  content: string
  userId: string
}): ValidationResult {
  const errors: ValidationError[] = []

  if (!comment.content) {
    errors.push({ field: 'content', message: 'Comment content is required' })
  } else if (typeof comment.content !== 'string') {
    errors.push({ field: 'content', message: 'Comment content must be a string' })
  } else if (comment.content.length < 1) {
    errors.push({ field: 'content', message: 'Comment cannot be empty' })
  } else if (comment.content.length > 2000) {
    errors.push({ field: 'content', message: 'Comment must be less than 2000 characters' })
  }

  if (!comment.userId) {
    errors.push({ field: 'userId', message: 'User ID is required' })
  } else if (typeof comment.userId !== 'string') {
    errors.push({ field: 'userId', message: 'User ID must be a string' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Complete task validation
export function validateTask(data: {
  title: string
  description?: string
  status: string
  priority: string
  projectId: string
  assigneeId?: string
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  actualHours?: number
  storyPoints?: number
  labels?: string[]
  subtasks?: any[]
}): ValidationResult {
  const titleValidation = validateTaskTitle(data.title)
  const descriptionValidation = validateTaskDescription(data.description)
  const statusValidation = validateTaskStatus(data.status)
  const priorityValidation = validateTaskPriority(data.priority)
  const projectIdValidation = validateProjectId(data.projectId)
  const assigneeValidation = validateAssigneeId(data.assigneeId)
  const dueDateValidation = validateDueDate(data.dueDate)
  const startDateValidation = validateStartDate(data.startDate)
  const dateRangeValidation = validateTaskDateRange(data.startDate, data.dueDate)
  const estimatedHoursValidation = validateEstimatedHours(data.estimatedHours)
  const actualHoursValidation = validateActualHours(data.actualHours)
  const storyPointsValidation = validateStoryPoints(data.storyPoints)
  const labelsValidation = validateTaskLabels(data.labels || [])
  const subtasksValidation = validateSubtasks(data.subtasks || [])

  const errors = [
    ...titleValidation.errors,
    ...descriptionValidation.errors,
    ...statusValidation.errors,
    ...priorityValidation.errors,
    ...projectIdValidation.errors,
    ...assigneeValidation.errors,
    ...dueDateValidation.errors,
    ...startDateValidation.errors,
    ...dateRangeValidation.errors,
    ...estimatedHoursValidation.errors,
    ...actualHoursValidation.errors,
    ...storyPointsValidation.errors,
    ...labelsValidation.errors,
    ...subtasksValidation.errors
  ]

  return {
    success: errors.length === 0,
    errors
  }
}

// Task update validation
export function validateTaskUpdate(data: Partial<{
  title: string
  description: string
  status: string
  priority: string
  assigneeId: string
  dueDate: string
  startDate: string
  estimatedHours: number
  actualHours: number
  storyPoints: number
  labels: string[]
}>): ValidationResult {
  const errors: ValidationError[] = []

  if (data.title !== undefined) {
    const titleValidation = validateTaskTitle(data.title)
    errors.push(...titleValidation.errors)
  }

  if (data.description !== undefined) {
    const descValidation = validateTaskDescription(data.description)
    errors.push(...descValidation.errors)
  }

  if (data.status !== undefined) {
    const statusValidation = validateTaskStatus(data.status)
    errors.push(...statusValidation.errors)
  }

  if (data.priority !== undefined) {
    const priorityValidation = validateTaskPriority(data.priority)
    errors.push(...priorityValidation.errors)
  }

  if (data.assigneeId !== undefined) {
    const assigneeValidation = validateAssigneeId(data.assigneeId)
    errors.push(...assigneeValidation.errors)
  }

  if (data.dueDate !== undefined) {
    const dueDateValidation = validateDueDate(data.dueDate)
    errors.push(...dueDateValidation.errors)
  }

  if (data.startDate !== undefined) {
    const startDateValidation = validateStartDate(data.startDate)
    errors.push(...startDateValidation.errors)
  }

  if (data.startDate !== undefined || data.dueDate !== undefined) {
    const dateRangeValidation = validateTaskDateRange(data.startDate, data.dueDate)
    errors.push(...dateRangeValidation.errors)
  }

  if (data.estimatedHours !== undefined) {
    const estimatedValidation = validateEstimatedHours(data.estimatedHours)
    errors.push(...estimatedValidation.errors)
  }

  if (data.actualHours !== undefined) {
    const actualValidation = validateActualHours(data.actualHours)
    errors.push(...actualValidation.errors)
  }

  if (data.storyPoints !== undefined) {
    const storyValidation = validateStoryPoints(data.storyPoints)
    errors.push(...storyValidation.errors)
  }

  if (data.labels !== undefined) {
    const labelsValidation = validateTaskLabels(data.labels)
    errors.push(...labelsValidation.errors)
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Get formatted error messages
export function getFormattedErrors(result: ValidationResult): Record<string, string> {
  const formatted: Record<string, string> = {}
  result.errors.forEach(error => {
    formatted[error.field] = error.message
  })
  return formatted
}

// Check if field has error
export function hasError(result: ValidationResult, field: string): boolean {
  return result.errors.some(error => error.field === field)
}

// Get error message for field
export function getError(result: ValidationResult, field: string): string | undefined {
  const error = result.errors.find(e => e.field === field)
  return error?.message
}

// Example usage
export function example() {
  // Validate new task
  const taskData = {
    title: 'Implement user authentication',
    description: 'Add login and signup functionality',
    status: 'todo',
    priority: 'high',
    projectId: 'proj-123',
    assigneeId: 'user-456',
    dueDate: '2024-03-15',
    estimatedHours: 8,
    storyPoints: 3,
    labels: ['backend', 'security'],
    subtasks: [
      { title: 'Create login form' },
      { title: 'Implement JWT', assigneeId: 'user-456' }
    ]
  }

  const result = validateTask(taskData)
  
  if (!result.success) {
    const errors = getFormattedErrors(result)
    console.log('Validation errors:', errors)
  }

  // Validate update
  const updateResult = validateTaskUpdate({
    status: 'in-progress',
    actualHours: 2
  })

  // Check specific field
  const titleResult = validateTaskTitle('New Task')
  if (hasError(titleResult, 'title')) {
    console.log('Title error:', getError(titleResult, 'title'))
  }
}