// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({
        error: 'Name, email and password are required'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: 'Password must be at least 6 characters'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await mockDb.find('users', { email })
    if (existingUsers.length > 0) {
      return NextResponse.json({
        error: 'Email already registered'
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = await mockDb.create('users', {
      name,
      email,
      password: hashedPassword, // In production, store hashed password
      role: 'user',
      createdAt: new Date().toISOString()
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: 'Registration failed'
    }, { status: 500 })
  }
}