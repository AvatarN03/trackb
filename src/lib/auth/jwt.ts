import { jwtVerify, SignJWT } from 'jose'
import type { JWTPayload } from 'jose'
import { cookies } from 'next/headers'

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
  return cookieStore.get('auth-token')?.value
}

export async function verifyAuth(): Promise<AuthPayload | null> {
  const token = await getAuthToken()
  if (!token) return null

  return await verifyToken(token)
}
