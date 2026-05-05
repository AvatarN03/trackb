'use client'

import React, { useState, useCallback } from 'react'
import { CollegeCard } from '@/components/colleges/CollegeCard'
import { LoadingState, ErrorState, EmptyState } from '@/components/common/LoadingStates'
import { showToast } from '@/components/common/Toast'

interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  imageUrl?: string
}

interface PaginatedResponse {
  data: College[]
  total: number
  page: number
  totalPages: number
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minFees, setMinFees] = useState('')
  const [maxFees, setMaxFees] = useState('')
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set())

  const fetchColleges = useCallback(async (pageNum: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('page', pageNum.toString())
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      if (minFees) params.append('minFees', minFees)
      if (maxFees) params.append('maxFees', maxFees)

      const response = await fetch(`/api/colleges?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      const paginatedData = data.data as PaginatedResponse
      setColleges(paginatedData.data)
      setTotalPages(paginatedData.totalPages)
      setPage(pageNum)

      // Fetch saved colleges if logged in
      const token = localStorage.getItem('auth-token')
      if (token) {
        fetchSavedColleges()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch colleges')
    } finally {
      setLoading(false)
    }
  }, [search, location, minFees, maxFees])

  const fetchSavedColleges = async () => {
    try {
      const response = await fetch('/api/user/saved')
      const data = await response.json()
      if (data.success) {
        setSavedColleges(new Set(data.data.map((c: College) => c.id)))
      }
    } catch (err) {
      console.error('Failed to fetch saved colleges:', err)
    }
  }

  const handleToggleSave = async (collegeId: string) => {
    try {
      const response = await fetch(`/api/user/saved/${collegeId}`, { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        setSavedColleges((prev) => {
          const newSet = new Set(prev)
          if (data.data.saved) {
            newSet.add(collegeId)
            showToast('College saved!', 'success')
          } else {
            newSet.delete(collegeId)
            showToast('College removed from saved', 'info')
          }
          return newSet
        })
      }
    } catch (err) {
      showToast('Failed to save college', 'error')
    }
  }

  React.useEffect(() => {
    fetchColleges(1)
  }, [search, location, minFees, maxFees, fetchColleges])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Colleges</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="College name..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Fees</label>
            <input
              type="number"
              value={minFees}
              onChange={(e) => setMinFees(e.target.value)}
              placeholder="₹"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Fees</label>
            <input
              type="number"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
              placeholder="₹"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={() => fetchColleges(page)} />}
      {!loading && !error && colleges.length === 0 && <EmptyState message="No colleges found" />}

      {!loading && !error && colleges.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                {...college}
                onSave={() => handleToggleSave(college.id)}
                isSaved={savedColleges.has(college.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => fetchColleges(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchColleges(p)}
                  className={`px-4 py-2 rounded ${
                    page === p ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => fetchColleges(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
