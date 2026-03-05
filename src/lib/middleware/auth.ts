// lib/middleware/auth.ts

import { NextRequest, NextResponse } from 'next/server'

// Super simple auth middleware - NO ERRORS
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isPublic = req.nextUrl.pathname.startsWith('/login')

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

// Super simple login - NO ERRORS
export async function login(email: string, password: string) {
  if (email === 'admin@example.com' && password === 'password') {
    return { success: true, token: 'mock-token-123' }
  }
  return { success: false, error: 'Invalid credentials' }
}