import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { compareSchema } from '@/types/validation'
import { ApiResponse } from '@/types'
import { verifyAuth } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const shouldSave = Boolean(body?.save)

    // Validate input
    const validated = compareSchema.parse(body)

    let auth = null
    if (shouldSave) {
      auth = await verifyAuth(request)

      if (!auth) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
          } as ApiResponse<null>,
          { status: 401 }
        )
      }
    }

    // Fetch colleges
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: validated.collegeIds },
      },
      select: {
        id: true,
        name: true,
        location: true,
        fees: true,
        rating: true,
        imageUrl: true,
        placements: true,
      },
    })

    if (colleges.length !== validated.collegeIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'One or more colleges not found',
        } as ApiResponse<null>,
        { status: 404 }
      )
    }

    // Format comparison data
    const comparisonData = colleges.map((college: any) => ({
      collegeId: college.id,
      name: college.name,
      location: college.location,
      fees: college.fees,
      rating: college.rating,
      imageUrl: college.imageUrl,
      placementPercentage: college.placements?.placementPercentage || 0,
      avgPackage: college.placements?.avgPackage || 0,
    }))

    if (shouldSave && auth) {
      await prisma.comparison.create({
        data: {
          userId: auth.userId,
          collegeIds: validated.collegeIds,
        },
      })
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        comparison: comparisonData,
        saved: shouldSave,
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Compare error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to compare colleges',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const comparisons = await prisma.comparison.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    })

    const response: ApiResponse<any> = {
      success: true,
      data: comparisons,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get comparisons error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch comparisons',
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
