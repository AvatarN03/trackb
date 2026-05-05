import { NextRequest, NextResponse } from 'next/server'
import { signupSchema, loginSchema } from '@/types/validation'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse, AuthToken } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = signupSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
      },
    })

    // Create token
    const token = await signToken({ userId: user.id, email: user.email })

    // Set cookie
    const response = NextResponse.json({
      success: true,
      data: {
        token,
        expiresIn: 7 * 24 * 60 * 60, // 7 days
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
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Signup failed',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}
