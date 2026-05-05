// Utility functions for API responses

export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  }
}

export function createErrorResponse(error: string, statusCode: number = 400) {
  return { success: false, error, statusCode }
}

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Pagination helper
export function calculatePagination(total: number, page: number = 1, pageSize: number = 10) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page < Math.ceil(total / pageSize),
    hasPreviousPage: page > 1,
  }
}
