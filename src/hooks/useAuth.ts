// Example of how to use the authentication in frontend components

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('auth-token')
    setIsAuthenticated(false)
    router.push('/')
  }

  return { isAuthenticated, loading, logout }
}

/**
 * Hook for protected routes
 */
export function useProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  return { isAuthenticated, loading }
}

/**
 * Hook for API calls with authentication
 */
export async function authenticatedFetch(url: string, options?: RequestInit) {
  const token = localStorage.getItem('auth-token')

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })
}
