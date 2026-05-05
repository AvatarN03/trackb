import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/jwt'
import prisma from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
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

    const saved = await prisma.savedCollege.findMany({
      where: { userId: auth.userId },
      include: {
        college: true,
      },
    })

    const response: ApiResponse<any> = {
      success: true,
      data: saved.map((s) => s.college),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get saved colleges error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch saved colleges',
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
