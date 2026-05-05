import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest, { params }: { params: { collegeId: string } }) {
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

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: params.collegeId },
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

    // Check if already saved
    const existing = await prisma.savedCollege.findFirst({
      where: {
        userId: auth.userId,
        collegeId: params.collegeId,
      },
    })

    if (existing) {
      // Remove from saved
      await prisma.savedCollege.delete({
        where: { id: existing.id },
      })

      return NextResponse.json({
        success: true,
        data: { saved: false },
      } as ApiResponse<any>)
    } else {
      // Add to saved
      await prisma.savedCollege.create({
        data: {
          userId: auth.userId,
          collegeId: params.collegeId,
        },
      })

      return NextResponse.json({
        success: true,
        data: { saved: true },
      } as ApiResponse<any>)
    }
  } catch (error: any) {
    console.error('Toggle saved error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle saved college',
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
