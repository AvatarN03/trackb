import { NextRequest, NextResponse } from 'next/server'
import { predictSchema } from '@/types/validation'
import { ApiResponse } from '@/types'
import prisma from '@/lib/db/prisma'

// Prediction rules based on exam and rank
function getPredictedColleges(exam: string, rank: number): string[] {
  const topCollegeNames: { [key: string]: string[] } = {
    JEE: ['Indian Institute of Technology Delhi', 'Indian Institute of Technology Mumbai', 'IIT Kanpur'],
    NEET: ['All India Institute of Medical Sciences'],
    CET: ['National Institute of Technology Delhi', 'Manipal Institute of Technology'],
  }

  if (exam === 'JEE') {
    if (rank < 1000) return topCollegeNames['JEE']
    if (rank < 5000) return ['National Institute of Technology Delhi', 'Shiv Nadar University', 'Manipal Institute of Technology']
    return ['Symbiosis International University']
  } else if (exam === 'NEET') {
    if (rank < 5000) return [topCollegeNames['NEET'][0]]
    return ['All India Institute of Medical Sciences']
  } else {
    return ['National Institute of Technology Delhi', 'Manipal Institute of Technology']
  }
}

function calculateProbability(rank: number, exam: string): 'High' | 'Medium' | 'Low' {
  if (exam === 'JEE') {
    if (rank < 1000) return 'High'
    if (rank < 5000) return 'Medium'
    return 'Low'
  } else if (exam === 'NEET') {
    if (rank < 5000) return 'High'
    return 'Medium'
  } else {
    return 'Medium'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = predictSchema.parse(body)

    const predictedCollegeNames = getPredictedColleges(validated.exam, validated.rank)

    // Fetch colleges by name
    const colleges = await prisma.college.findMany({
      where: {
        name: { in: predictedCollegeNames },
      },
    })

    const probability = calculateProbability(validated.rank, validated.exam)

    const results = colleges.map((college) => ({
      collegeId: college.id,
      name: college.name,
      location: college.location,
      fees: college.fees,
      rating: college.rating,
      probability,
    }))

    const response: ApiResponse<any> = {
      success: true,
      data: {
        exam: validated.exam,
        rank: validated.rank,
        predictions: results,
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Predict error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to predict colleges',
      } as ApiResponse<null>,
      { status: 400 }
    )
  }
}
