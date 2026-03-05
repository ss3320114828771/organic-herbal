// lib/validators/auth.ts

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  success: boolean
  errors: ValidationError[]
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (typeof email !== 'string') {
    errors.push({ field: 'email', message: 'Email must be a string' })
  } else {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
    
    // Length validation
    if (email.length > 255) {
      errors.push({ field: 'email', message: 'Email must be less than 255 characters' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' })
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password must be a string' })
  } else {
    // Length validation
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' })
    }
    if (password.length > 128) {
      errors.push({ field: 'password', message: 'Password must be less than 128 characters' })
    }

    // Complexity validation
    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' })
    }
    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' })
    }
    if (!/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' })
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character (!@#$%^&*)' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Confirm password validation
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: ValidationError[] = []

  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password' })
  } else if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Name validation
export function validateName(name: string, field: string = 'name'): ValidationResult {
  const errors: ValidationError[] = []

  if (!name) {
    errors.push({ field, message: `${field === 'name' ? 'Name' : field} is required` })
  } else if (typeof name !== 'string') {
    errors.push({ field, message: `${field === 'name' ? 'Name' : field} must be a string` })
  } else {
    // Length validation
    if (name.length < 2) {
      errors.push({ field, message: `${field === 'name' ? 'Name' : field} must be at least 2 characters` })
    }
    if (name.length > 50) {
      errors.push({ field, message: `${field === 'name' ? 'Name' : field} must be less than 50 characters` })
    }

    // Character validation (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[A-Za-z\s\-']+$/
    if (!nameRegex.test(name)) {
      errors.push({ field, message: `${field === 'name' ? 'Name' : field} can only contain letters, spaces, hyphens, and apostrophes` })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Login validation
export function validateLogin(email: string, password: string): ValidationResult {
  const emailValidation = validateEmail(email)
  const passwordValidation = validatePassword(password)

  const errors = [...emailValidation.errors, ...passwordValidation.errors]

  return {
    success: errors.length === 0,
    errors
  }
}

// Register validation
export function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const nameValidation = validateName(name, 'name')
  const emailValidation = validateEmail(email)
  const passwordValidation = validatePassword(password)
  const confirmValidation = validateConfirmPassword(password, confirmPassword)

  const errors = [
    ...nameValidation.errors,
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...confirmValidation.errors
  ]

  return {
    success: errors.length === 0,
    errors
  }
}

// Profile update validation
export function validateProfileUpdate(
  name?: string,
  email?: string
): ValidationResult {
  const errors: ValidationError[] = []

  if (name !== undefined) {
    const nameValidation = validateName(name, 'name')
    errors.push(...nameValidation.errors)
  }

  if (email !== undefined) {
    const emailValidation = validateEmail(email)
    errors.push(...emailValidation.errors)
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Password change validation
export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): ValidationResult {
  const errors: ValidationError[] = []

  // Current password validation
  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' })
  }

  // New password validation
  const newPasswordValidation = validatePassword(newPassword)
  errors.push(...newPasswordValidation.errors.map(e => ({
    ...e,
    field: 'newPassword'
  })))

  // Confirm password validation
  if (newPassword !== confirmNewPassword) {
    errors.push({ field: 'confirmNewPassword', message: 'Passwords do not match' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Username validation
export function validateUsername(username: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!username) {
    errors.push({ field: 'username', message: 'Username is required' })
  } else if (typeof username !== 'string') {
    errors.push({ field: 'username', message: 'Username must be a string' })
  } else {
    // Length validation
    if (username.length < 3) {
      errors.push({ field: 'username', message: 'Username must be at least 3 characters' })
    }
    if (username.length > 30) {
      errors.push({ field: 'username', message: 'Username must be less than 30 characters' })
    }

    // Character validation (letters, numbers, underscores, hyphens)
    const usernameRegex = /^[A-Za-z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      errors.push({ field: 'username', message: 'Username can only contain letters, numbers, underscores, and hyphens' })
    }
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Phone number validation
export function validatePhone(phone: string): ValidationResult {
  const errors: ValidationError[] = []

  if (phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/
    if (!phoneRegex.test(phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
    }
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
  // Validate login
  const loginResult = validateLogin('test@example.com', 'Password123!')
  if (!loginResult.success) {
    console.log('Login errors:', loginResult.errors)
  }

  // Validate registration
  const registerResult = validateRegister(
    'John Doe',
    'john@example.com',
    'Password123!',
    'Password123!'
  )
  
  if (!registerResult.success) {
    const errors = getFormattedErrors(registerResult)
    console.log('Email error:', errors.email)
    console.log('Password error:', errors.password)
  }

  // Validate individual fields
  const emailResult = validateEmail('test@example.com')
  if (emailResult.success) {
    console.log('Email is valid')
  }

  // Check specific field
  const passwordResult = validatePassword('weak')
  if (hasError(passwordResult, 'password')) {
    console.log('Password error:', getError(passwordResult, 'password'))
  }
}