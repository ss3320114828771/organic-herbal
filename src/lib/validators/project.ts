// lib/validators/project.ts

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}

// Project name validation
export function validateProjectName(name: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!name) {
    errors.push({ field: 'name', message: 'Project name is required' })
  } else if (typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Project name must be a string' })
  } else {
    if (name.length < 3) {
      errors.push({ field: 'name', message: 'Project name must be at least 3 characters' })
    }
    if (name.length > 100) {
      errors.push({ field: 'name', message: 'Project name must be less than 100 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Project description validation
export function validateProjectDescription(description?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (description) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' })
    } else if (description.length > 2000) {
      errors.push({ field: 'description', message: 'Description must be less than 2000 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Project status validation
export function validateProjectStatus(status: string): ValidationResult {
  const errors: ValidationError[] = []
  const validStatuses = ['planning', 'active', 'on-hold', 'completed', 'archived']

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

// Project priority validation
export function validateProjectPriority(priority: string): ValidationResult {
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

// Date validation
export function validateDate(date: string, field: string = 'date'): ValidationResult {
  const errors: ValidationError[] = []

  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      errors.push({ field, message: 'Date must be in YYYY-MM-DD format' })
    } else {
      const d = new Date(date)
      if (isNaN(d.getTime())) {
        errors.push({ field, message: 'Please enter a valid date' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Date range validation
export function validateDateRange(startDate: string, endDate?: string): ValidationResult {
  const errors: ValidationError[] = []

  const startValidation = validateDate(startDate, 'startDate')
  errors.push(...startValidation.errors)

  if (endDate) {
    const endValidation = validateDate(endDate, 'endDate')
    errors.push(...endValidation.errors)

    if (startValidation.success && endValidation.success) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end < start) {
        errors.push({ field: 'endDate', message: 'End date cannot be before start date' })
      }
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Budget validation
export function validateBudget(budget?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (budget !== undefined && budget !== null) {
    if (typeof budget !== 'number') {
      errors.push({ field: 'budget', message: 'Budget must be a number' })
    } else if (isNaN(budget)) {
      errors.push({ field: 'budget', message: 'Budget must be a valid number' })
    } else if (budget < 0) {
      errors.push({ field: 'budget', message: 'Budget cannot be negative' })
    } else if (budget > 1000000000) {
      errors.push({ field: 'budget', message: 'Budget cannot exceed 1,000,000,000' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Spent validation
export function validateSpent(spent?: number, budget?: number): ValidationResult {
  const errors: ValidationError[] = []

  if (spent !== undefined && spent !== null) {
    if (typeof spent !== 'number') {
      errors.push({ field: 'spent', message: 'Spent amount must be a number' })
    } else if (isNaN(spent)) {
      errors.push({ field: 'spent', message: 'Spent amount must be a valid number' })
    } else if (spent < 0) {
      errors.push({ field: 'spent', message: 'Spent amount cannot be negative' })
    }

    if (budget !== undefined && spent > budget) {
      errors.push({ field: 'spent', message: 'Spent amount cannot exceed budget' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Progress validation
export function validateProgress(progress: number): ValidationResult {
  const errors: ValidationError[] = []

  if (progress === undefined || progress === null) {
    errors.push({ field: 'progress', message: 'Progress is required' })
  } else if (typeof progress !== 'number') {
    errors.push({ field: 'progress', message: 'Progress must be a number' })
  } else if (isNaN(progress)) {
    errors.push({ field: 'progress', message: 'Progress must be a valid number' })
  } else if (progress < 0) {
    errors.push({ field: 'progress', message: 'Progress cannot be negative' })
  } else if (progress > 100) {
    errors.push({ field: 'progress', message: 'Progress cannot exceed 100' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Team member validation
export function validateTeamMember(member: {
  id?: string
  name: string
  email: string
  role: string
}): ValidationResult {
  const errors: ValidationError[] = []

  if (!member.name) {
    errors.push({ field: 'name', message: 'Member name is required' })
  } else if (typeof member.name !== 'string') {
    errors.push({ field: 'name', message: 'Member name must be a string' })
  } else if (member.name.length < 2) {
    errors.push({ field: 'name', message: 'Member name must be at least 2 characters' })
  } else if (member.name.length > 50) {
    errors.push({ field: 'name', message: 'Member name must be less than 50 characters' })
  }

  if (!member.email) {
    errors.push({ field: 'email', message: 'Member email is required' })
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(member.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
  }

  const validRoles = ['owner', 'admin', 'member', 'viewer']
  if (!member.role) {
    errors.push({ field: 'role', message: 'Member role is required' })
  } else if (!validRoles.includes(member.role)) {
    errors.push({ field: 'role', message: `Role must be one of: ${validRoles.join(', ')}` })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Team members validation
export function validateTeamMembers(members: any[]): ValidationResult {
  const errors: ValidationError[] = []

  if (!Array.isArray(members)) {
    errors.push({ field: 'members', message: 'Members must be an array' })
  } else {
    members.forEach((member, index) => {
      const result = validateTeamMember(member)
      result.errors.forEach(error => {
        errors.push({
          field: `members[${index}].${error.field}`,
          message: error.message
        })
      })
    })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Tags validation
export function validateProjectTags(tags: string[]): ValidationResult {
  const errors: ValidationError[] = []

  if (tags) {
    if (!Array.isArray(tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' })
    } else {
      if (tags.length > 20) {
        errors.push({ field: 'tags', message: 'Cannot have more than 20 tags' })
      }

      tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string' })
        } else if (tag.length < 1) {
          errors.push({ field: `tags[${index}]`, message: 'Tag cannot be empty' })
        } else if (tag.length > 30) {
          errors.push({ field: `tags[${index}]`, message: 'Tag must be less than 30 characters' })
        }
      })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Complete project validation
export function validateProject(data: {
  name: string
  description?: string
  status: string
  priority: string
  startDate: string
  endDate?: string
  budget?: number
  spent?: number
  progress: number
  members?: any[]
  tags?: string[]
}): ValidationResult {
  const nameValidation = validateProjectName(data.name)
  const descriptionValidation = validateProjectDescription(data.description)
  const statusValidation = validateProjectStatus(data.status)
  const priorityValidation = validateProjectPriority(data.priority)
  const dateRangeValidation = validateDateRange(data.startDate, data.endDate)
  const budgetValidation = validateBudget(data.budget)
  const spentValidation = validateSpent(data.spent, data.budget)
  const progressValidation = validateProgress(data.progress)
  const membersValidation = validateTeamMembers(data.members || [])
  const tagsValidation = validateProjectTags(data.tags || [])

  const errors = [
    ...nameValidation.errors,
    ...descriptionValidation.errors,
    ...statusValidation.errors,
    ...priorityValidation.errors,
    ...dateRangeValidation.errors,
    ...budgetValidation.errors,
    ...spentValidation.errors,
    ...progressValidation.errors,
    ...membersValidation.errors,
    ...tagsValidation.errors
  ]

  return {
    success: errors.length === 0,
    errors
  }
}

// Project update validation
export function validateProjectUpdate(data: Partial<{
  name: string
  description: string
  status: string
  priority: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  progress: number
  tags: string[]
}>): ValidationResult {
  const errors: ValidationError[] = []

  if (data.name !== undefined) {
    const nameValidation = validateProjectName(data.name)
    errors.push(...nameValidation.errors)
  }

  if (data.description !== undefined) {
    const descValidation = validateProjectDescription(data.description)
    errors.push(...descValidation.errors)
  }

  if (data.status !== undefined) {
    const statusValidation = validateProjectStatus(data.status)
    errors.push(...statusValidation.errors)
  }

  if (data.priority !== undefined) {
    const priorityValidation = validateProjectPriority(data.priority)
    errors.push(...priorityValidation.errors)
  }

  if (data.startDate !== undefined || data.endDate !== undefined) {
    const startDate = data.startDate || ''
    const endDate = data.endDate || ''
    const dateValidation = validateDateRange(startDate, endDate)
    errors.push(...dateValidation.errors)
  }

  if (data.budget !== undefined) {
    const budgetValidation = validateBudget(data.budget)
    errors.push(...budgetValidation.errors)
  }

  if (data.spent !== undefined) {
    const spentValidation = validateSpent(data.spent, data.budget)
    errors.push(...spentValidation.errors)
  }

  if (data.progress !== undefined) {
    const progressValidation = validateProgress(data.progress)
    errors.push(...progressValidation.errors)
  }

  if (data.tags !== undefined) {
    const tagsValidation = validateProjectTags(data.tags)
    errors.push(...tagsValidation.errors)
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
  // Validate new project
  const projectData = {
    name: 'Website Redesign',
    description: 'Redesign company website with modern UI',
    status: 'planning',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    budget: 15000,
    progress: 0,
    members: [
      { name: 'John Doe', email: 'john@example.com', role: 'owner' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'member' }
    ],
    tags: ['design', 'frontend']
  }

  const result = validateProject(projectData)
  
  if (!result.success) {
    const errors = getFormattedErrors(result)
    console.log('Validation errors:', errors)
  }

  // Validate update
  const updateResult = validateProjectUpdate({
    status: 'active',
    progress: 25
  })

  // Check specific field
  const nameResult = validateProjectName('New Project')
  if (hasError(nameResult, 'name')) {
    console.log('Name error:', getError(nameResult, 'name'))
  }
}