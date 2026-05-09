'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LoadingState, ErrorState } from '@/components/common/LoadingStates'
import { showToast } from '@/components/common/Toast'
import { useProtectedRoute } from '@/hooks/useAuth'

interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  imageUrl?: string
}

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute()
  const [savedColleges, setSavedColleges] = useState<College[]>([])
  const [comparisons, setComparisons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      try {
        // Fetch saved colleges
        const savedResponse = await fetch('/api/user/saved')
        const savedData = await savedResponse.json()
        if (savedData.success) {
          setSavedColleges(savedData.data)
        }

        // Fetch comparisons
        const compareResponse = await fetch('/api/compare')
        const compareData = await compareResponse.json()
        if (compareData.success) {
          setComparisons(compareData.data)
        }
      } catch (err) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const handleRemoveSaved = async (collegeId: string) => {
    try {
      const response = await fetch(`/api/user/saved/${collegeId}`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setSavedColleges(savedColleges.filter((c) => c.id !== collegeId))
        showToast('College removed', 'success')
      }
    } catch (err) {
      showToast('Failed to remove college', 'error')
    }
  }

  if (authLoading || loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">📚 My Dashboard</h1>
            <p className="section-subtitle">Manage your saved colleges and comparisons</p>
          </div>
          <Link href="/colleges" className="btn-primary">
            ✨ Explore More Colleges
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
          {/* Saved Colleges */}
          <div className="card-elevated p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-6">⭐ Saved Colleges ({savedColleges.length})</h2>
            {savedColleges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-slate-600 text-lg">No saved colleges yet</p>
                <Link href="/colleges" className="btn-tertiary inline-block mt-4">
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedColleges.map((college) => (
                  <div key={college.id} className="card p-5 hover:border-amber-300">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-950 mb-2">{college.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                          <span>📍 {college.location}</span>
                          <span>⭐ {college.rating.toFixed(1)}</span>
                          <span>💰 ₹{(college.fees / 100000).toFixed(2)}L</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/college/${college.id}`}
                          className="btn-tertiary text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemoveSaved(college.id)}
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 font-medium ring-1 ring-red-200 hover:bg-red-100 hover:ring-red-300 transition text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparisons */}
          <div className="card-elevated p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-6">⚖️ Recent Comparisons ({comparisons.length})</h2>
            {comparisons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-slate-600 text-lg">No comparisons yet</p>
                <Link href="/compare" className="btn-tertiary inline-block mt-4">
                  Start Comparing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comparisons.map((comparison, idx) => (
                  <div key={idx} className="card p-5 hover:border-amber-300">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-950 mb-2">Comparison {idx + 1}</h3>
                        <p className="text-sm text-slate-600">{comparison.collegeIds.length} colleges compared</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(comparison.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href="/compare"
                        className="btn-tertiary text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
