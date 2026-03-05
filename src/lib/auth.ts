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
    // Trim whitespace
    email = email.trim()

    // Length validation
    if (email.length < 5) {
      errors.push({ field: 'email', message: 'Email must be at least 5 characters' })
    }
    if (email.length > 255) {
      errors.push({ field: 'email', message: 'Email must be less than 255 characters' })
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }

    // Domain validation
    const domain = email.split('@')[1]
    if (domain && domain.includes('..')) {
      errors.push({ field: 'email', message: 'Email domain is invalid' })
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
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' })
    }

    // No whitespace
    if (/\s/.test(password)) {
      errors.push({ field: 'password', message: 'Password cannot contain spaces' })
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
    // Trim whitespace
    name = name.trim()

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
    // Remove common phone formatting characters
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
    
    // Check if it contains only digits
    if (!/^\d+$/.test(cleaned)) {
      errors.push({ field: 'phone', message: 'Phone number can only contain digits and formatting characters' })
    } else if (cleaned.length < 10) {
      errors.push({ field: 'phone', message: 'Phone number must have at least 10 digits' })
    } else if (cleaned.length > 15) {
      errors.push({ field: 'phone', message: 'Phone number cannot have more than 15 digits' })
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
  email?: string,
  phone?: string
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

  if (phone !== undefined) {
    const phoneValidation = validatePhone(phone)
    errors.push(...phoneValidation.errors)
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

  // Check if new password is same as current
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push({ field: 'newPassword', message: 'New password must be different from current password' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Reset password validation
export function validateResetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
): ValidationResult {
  const errors: ValidationError[] = []

  if (!token) {
    errors.push({ field: 'token', message: 'Reset token is required' })
  }

  const passwordValidation = validatePassword(newPassword)
  errors.push(...passwordValidation.errors.map(e => ({
    ...e,
    field: 'newPassword'
  })))

  if (newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Forgot password validation
export function validateForgotPassword(email: string): ValidationResult {
  return validateEmail(email)
}

// OTP validation
export function validateOTP(otp: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!otp) {
    errors.push({ field: 'otp', message: 'OTP is required' })
  } else if (!/^\d+$/.test(otp)) {
    errors.push({ field: 'otp', message: 'OTP must contain only digits' })
  } else if (otp.length !== 6) {
    errors.push({ field: 'otp', message: 'OTP must be 6 digits' })
  }

  return {
    success: errors.length === 0,
    errors
  }
}

// Session validation
export function validateSession(token: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!token) {
    errors.push({ field: 'token', message: 'Session token is required' })
  } else if (typeof token !== 'string') {
    errors.push({ field: 'token', message: 'Session token must be a string' })
  } else if (token.length < 10) {
    errors.push({ field: 'token', message: 'Session token is invalid' })
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

  // Validate password change
  const passwordResult = validatePasswordChange(
    'oldPass123!',
    'newPass456!',
    'newPass456!'
  )

  // Check specific field
  const emailResult = validateEmail('test@example.com')
  if (hasError(emailResult, 'email')) {
    console.log('Email error:', getError(emailResult, 'email'))
  }
}