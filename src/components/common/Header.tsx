'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold text-slate-950 tracking-tight hover:opacity-80 transition">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-950 to-slate-800 text-lg shadow-lg">
              🎓
            </span>
            <span>College Discover</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/colleges" className="text-slate-700 font-medium hover:text-amber-600 transition duration-300">
              Colleges
            </Link>
            <Link href="/compare" className="text-slate-700 font-medium hover:text-amber-600 transition duration-300">
              Compare
            </Link>
            <Link href="/predictor" className="text-slate-700 font-medium hover:text-amber-600 transition duration-300">
              Predictor
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-slate-700 font-medium hover:text-amber-600 transition duration-300">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500/10 text-red-600 font-semibold ring-1 ring-red-200 hover:bg-red-500/20 hover:ring-red-300 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-700 font-medium hover:text-amber-600 transition duration-300">
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
