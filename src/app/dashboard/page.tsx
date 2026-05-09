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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
        <Link href="/colleges" className="btn-primary">
          Explore Colleges
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-64">
        {/* Saved Colleges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Saved Colleges ({savedColleges.length})</h2>
          {savedColleges.length === 0 ? (
            <p className="text-gray-600">No saved colleges yet</p>
          ) : (
            <div className="space-y-4">
              {savedColleges.map((college) => (
                <div key={college.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{college.name}</h3>
                    <p className="text-gray-600">📍 {college.location}</p>
                    <p className="text-gray-600">⭐ {college.rating} | ₹{(college.fees / 100000).toFixed(2)}L</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/college/${college.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveSaved(college.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Comparisons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Saved Comparisons ({comparisons.length})</h2>
          {comparisons.length === 0 ? (
            <p className="text-gray-600">No saved comparisons yet</p>
          ) : (
            <div className="space-y-4">
              {comparisons.map((comparison) => (
                <div key={comparison.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Comparing {comparison.collegeIds.length} colleges</p>
                  <p className="text-xs text-gray-500">Created: {new Date(comparison.createdAt).toLocaleDateString()}</p>
                  <Link
                    href={`/compare?ids=${encodeURIComponent(comparison.collegeIds.join(','))}`}
                    className="mt-2 inline-flex px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    View Comparison
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold mb-2">Explore Colleges</h3>
          <Link href="/colleges" className="text-primary hover:underline">
            Browse colleges →
          </Link>
        </div>
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h3 className="font-bold mb-2">Compare Colleges</h3>
          <Link href="/compare" className="text-primary hover:underline">
            Create comparison →
          </Link>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold mb-2">Try Predictor</h3>
          <Link href="/predictor" className="text-primary hover:underline">
            Predict colleges →
          </Link>
        </div>
      </div>
    </div>
  )
}
