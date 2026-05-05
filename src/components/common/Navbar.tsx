'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const router = useRouter()
  const { isAuthenticated, loading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/80 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                🎓
              </span>
              <span>
                College Discover
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium sm:gap-6">
            <Link href="/colleges" className="transition hover:text-amber-600">
              Colleges
            </Link>
            <Link href="/compare" className="transition hover:text-amber-600">
              Compare
            </Link>
            <Link href="/predictor" className="transition hover:text-amber-600">
              Predictor
            </Link>
            {loading ? (
              <span className="h-9 w-24 rounded-full bg-slate-100" aria-hidden="true" />
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard" className="transition hover:text-amber-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="transition hover:text-amber-600">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
