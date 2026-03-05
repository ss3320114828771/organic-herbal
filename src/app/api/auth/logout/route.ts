import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    const secure = process.env.NODE_ENV === 'production'

    // Clear all cookies individually
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('isAuthenticated', '', {
      httpOnly: false,
      secure: secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('userRole', '', {
      httpOnly: false,
      secure: secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('cart', '', {
      httpOnly: false,
      secure: secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  return POST(request)
}