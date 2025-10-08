import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Environment variables for credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME 
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD 

// Rate limiting configuration
const MAX_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds

// In-memory store for rate limiting (in production, you'd use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; firstAttempt: number }>()

export interface AuthResult {
  success: boolean
  message: string
  remainingAttempts?: number
  lockoutTime?: number
}

export function checkRateLimit(ip: string): AuthResult {
  const now = Date.now()
  const userAttempts = rateLimitStore.get(ip)

  if (!userAttempts) {
    return { success: true, message: 'OK' }
  }

  // Reset if window has passed
  if (now - userAttempts.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.delete(ip)
    return { success: true, message: 'OK' }
  }

  // Check if user is locked out
  if (userAttempts.attempts >= MAX_ATTEMPTS) {
    const lockoutTime = RATE_LIMIT_WINDOW - (now - userAttempts.firstAttempt)
    return {
      success: false,
      message: 'Too many failed attempts. Please try again later.',
      lockoutTime: Math.ceil(lockoutTime / 1000) // Return seconds
    }
  }

  return {
    success: true,
    message: 'OK',
    remainingAttempts: MAX_ATTEMPTS - userAttempts.attempts
  }
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const userAttempts = rateLimitStore.get(ip)

  if (!userAttempts) {
    rateLimitStore.set(ip, { attempts: 1, firstAttempt: now })
  } else {
    userAttempts.attempts++
    rateLimitStore.set(ip, userAttempts)
  }
}

export function clearFailedAttempts(ip: string): void {
  rateLimitStore.delete(ip)
}

export function authenticateUser(username: string, password: string, ip: string): AuthResult {
  // Check rate limit first
  const rateLimitCheck = checkRateLimit(ip)
  if (!rateLimitCheck.success) {
    return rateLimitCheck
  }

  // Check credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    clearFailedAttempts(ip)
    return { success: true, message: 'Authentication successful' }
  }

  // Record failed attempt
  recordFailedAttempt(ip)
  const updatedRateLimitCheck = checkRateLimit(ip)
  
  return {
    success: false,
    message: 'Invalid username or password',
    remainingAttempts: updatedRateLimitCheck.remainingAttempts
  }
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

export function createAuthToken(): string {
  // Simple token generation (in production, use JWT or similar)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return Buffer.from(`${timestamp}-${random}`).toString('base64')
}

export function verifyAuthToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [timestamp] = decoded.split('-')
    const tokenTime = parseInt(timestamp)
    
    // Token expires after 24 hours
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    return (now - tokenTime) < maxAge
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  
  if (!token) {
    return false
  }
  
  return verifyAuthToken(token)
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin-token')?.value || null
}
