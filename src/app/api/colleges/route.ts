import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { collegeFilterSchema } from '@/types/validation'
import { ApiResponse, PaginatedResponse } from '@/types'

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())

    // Validate input
    const validated = collegeFilterSchema.parse(params)

    // Build filters
    const where: any = {}

    if (validated.search) {
      where.OR = [
        { name: { contains: validated.search, mode: 'insensitive' } },
        { description: { contains: validated.search, mode: 'insensitive' } },
      ]
    }

    if (validated.location) {
      where.location = { contains: validated.location, mode: 'insensitive' }
    }

    if (validated.minFees !== undefined || validated.maxFees !== undefined) {
      where.fees = {}
      if (validated.minFees !== undefined) where.fees.gte = validated.minFees
      if (validated.maxFees !== undefined) where.fees.lte = validated.maxFees
    }

    // Get total count
    const total = await prisma.college.count({ where })

    // Get paginated results
    const colleges = await prisma.college.findMany({
      where,
      skip: (validated.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { rating: 'desc' },
    })

    const totalPages = Math.ceil(total / PAGE_SIZE)

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        data: colleges,
        total,
        page: validated.page,
        pageSize: PAGE_SIZE,
        totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('College listing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch colleges',
      } as ApiResponse<null>,
      { status: error.statusCode || 500 }
    )
  }
}
