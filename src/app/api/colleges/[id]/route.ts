import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            user: { select: { email: true } },
            answers: {
              include: {
                user: { select: { email: true } },
              },
            },
          },
        },
      },
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

    const response: ApiResponse<any> = {
      success: true,
      data: college,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('College detail error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch college details',
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
