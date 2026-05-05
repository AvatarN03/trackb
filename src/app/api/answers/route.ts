import { NextRequest, NextResponse } from 'next/server'
import { answerSchema } from '@/types/validation'
import { verifyAuth } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth()

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
    const { questionId, body: answerBody } = body

    // Validate
    const validated = answerSchema.parse({ body: answerBody })

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'questionId is required',
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question not found',
        } as ApiResponse<null>,
        { status: 404 }
      )
    }

    // Create answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId: auth.userId,
        body: validated.body,
      },
      include: {
        user: { select: { email: true } },
      },
    })

    const response: ApiResponse<any> = {
      success: true,
      data: answer,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Create answer error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create answer',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}
