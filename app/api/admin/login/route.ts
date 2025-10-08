import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, getClientIP, createAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const clientIP = getClientIP(request)
    const authResult = authenticateUser(username, password, clientIP)

    if (authResult.success) {
      // Create auth token
      const token = createAuthToken()
      
      // Set cookie with token
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful'
      })

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })

      return response
    } else {
      return NextResponse.json(authResult, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
