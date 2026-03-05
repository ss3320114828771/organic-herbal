// lib/services/auth-service.ts

// Super simple auth service - NO ERRORS
export interface User {
  id: string
  email: string
  name: string
}

const users: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin' },
  { id: '2', email: 'user@example.com', name: 'User' }
]

export async function login(email: string, password: string) {
  const user = users.find(u => u.email === email)
  
  if (!user || password !== 'password') {
    return { success: false, error: 'Invalid credentials' }
  }

  return { 
    success: true, 
    user,
    token: 'mock-token-123'
  }
}

export async function getCurrentUser(token?: string) {
  if (!token) return null
  return users[0] // Mock user
}