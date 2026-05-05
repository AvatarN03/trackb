'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            🎓 College Hub
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/colleges" className="text-gray-600 hover:text-primary">
              Colleges
            </Link>
            <Link href="/compare" className="text-gray-600 hover:text-primary">
              Compare
            </Link>
            <Link href="/predictor" className="text-gray-600 hover:text-primary">
              Predictor
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-primary">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
