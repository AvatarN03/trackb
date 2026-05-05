'use client'

import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncFromStorage = () => {
      setToken(localStorage.getItem('auth-token'))
      setLoading(false)
    }

    syncFromStorage()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'auth-token') {
        setToken(event.newValue)
      }
    }

    const handleAuthChange = () => {
      setToken(localStorage.getItem('auth-token'))
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('auth-change', handleAuthChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('auth-change', handleAuthChange as EventListener)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: !!token,
      loading,
      login: (nextToken: string) => {
        localStorage.setItem('auth-token', nextToken)
        setToken(nextToken)
        window.dispatchEvent(new Event('auth-change'))
      },
      logout: () => {
        localStorage.removeItem('auth-token')
        setToken(null)
        window.dispatchEvent(new Event('auth-change'))
      },
      refreshAuth: () => {
        setToken(localStorage.getItem('auth-token'))
      },
    }),
    [loading, token]
  )

  return createElement(AuthContext.Provider, { value }, children)
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const context = useContext(AuthContext)
  const router = useRouter()

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const logout = () => {
    context.logout()
    router.push('/')
  }

  return { ...context, logout }
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
