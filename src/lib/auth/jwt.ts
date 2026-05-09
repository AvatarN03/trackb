import { jwtVerify, SignJWT } from 'jose'
import type { JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-in-production')

export type AuthPayload = JWTPayload & {
  userId: string
  email?: string
}

export async function signToken(payload: any, expiresIn: string = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    const payload = verified.payload as Partial<AuthPayload>

    if (!payload.userId || typeof payload.userId !== 'string') {
      return null
    }

    return {
      ...payload,
      userId: payload.userId,
    } as AuthPayload
  } catch (err) {
    return null
  }
}

export async function getAuthToken() {
  const cookieStore = cookies()
  return cookieStore.get('auth-token')?.value ?? null
}

export async function getAuthTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Try to get from Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Fall back to cookie
  const cookieValue = request.cookies.get('auth-token')?.value
  return cookieValue ?? null
}

export async function verifyAuth(request?: NextRequest): Promise<AuthPayload | null> {
  let token: string | null = null

  if (request) {
    // If request is provided, check both Authorization header and cookies
    token = await getAuthTokenFromRequest(request)
  } else {
    // Server-side only: get from cookies
    token = await getAuthToken()
  }

  if (!token) return null

  return await verifyToken(token)
}
