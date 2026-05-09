import { NextRequest, NextResponse } from 'next/server'
import { questionSchema } from '@/types/validation'
import { verifyAuth } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collegeId = searchParams.get('collegeId')

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'collegeId is required',
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    const questions = await prisma.question.findMany({
      where: { collegeId },
      include: {
        user: { select: { email: true } },
        answers: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const response: ApiResponse<any> = {
      success: true,
      data: questions,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get questions error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch questions',
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        } as ApiResponse<null>,
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, body: questionBody, collegeId } = body

    // Validate inputs are provided
    if (!title || !questionBody || !collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: !title ? 'Title is required' : !questionBody ? 'Description is required' : 'College ID is required',
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Validate
    const validated = questionSchema.parse({ title, body: questionBody })

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'collegeId is required',
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    })

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          error: 'College not found',
        } as ApiResponse<null>,
        { status: 404 }
      )
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        userId: auth.userId,
        collegeId,
        title: validated.title,
        body: validated.body,
      },
      include: {
        user: { select: { email: true } },
        answers: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    })

    const response: ApiResponse<any> = {
      success: true,
      data: question,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Create question error:', error)
    
    // Handle Zod validation errors
    if (error.name === 'ZodError' && Array.isArray(error.errors)) {
      const validationErrors = error.errors
        .map((err: any) => {
          const path = Array.isArray(err.path) ? err.path.join('.') : 'field'
          return `${path}: ${err.message}`
        })
        .join(', ')
      return NextResponse.json(
        {
          success: false,
          error: validationErrors,
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create question',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}
