// Type definitions for the application

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ComparisonData {
  collegeId: string
  name: string
  location: string
  fees: number
  rating: number
  placementPercentage: number
  avgPackage: number
  imageUrl?: string
}

export interface PredictionResult {
  collegeId: string
  name: string
  location: string
  fees: number
  rating: number
  probability: 'High' | 'Medium' | 'Low'
}

export interface QuestionWithAnswers {
  id: string
  title: string
  body: string
  createdAt: string
  user: {
    email: string
  }
  answers: Array<{
    id: string
    body: string
    createdAt: string
    user: {
      email: string
    }
  }>
}

export type AuthToken = {
  token: string
  expiresIn: number
}
