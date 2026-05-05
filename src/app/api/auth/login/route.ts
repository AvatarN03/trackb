import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/types/validation'
import { verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse, AuthToken } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        } as ApiResponse<null>,
        { status: 401 }
      )
    }

    // Verify password
    const passwordValid = await verifyPassword(validated.password, user.password)

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        } as ApiResponse<null>,
        { status: 401 }
      )
    }

    // Create token
    const token = await signToken({ userId: user.id, email: user.email })

    // Set cookie
    const response = NextResponse.json({
      success: true,
      data: {
        token,
        expiresIn: 7 * 24 * 60 * 60,
      },
    } as ApiResponse<AuthToken>)

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}
