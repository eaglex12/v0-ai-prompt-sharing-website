import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Only protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    const token = request.cookies.get('admin-token')?.value
    
    if (!token || !verifyAuthToken(token)) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
