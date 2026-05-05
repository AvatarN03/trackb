'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { LoadingState, ErrorState } from '@/components/common/LoadingStates'
import { showToast } from '@/components/common/Toast'

interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  description: string
  courses: string[]
  imageUrl?: string
  placements: {
    avgPackage: number
    placementPercentage: number
    topRecruiters: string[]
  }
}

export default function CollegeDetailPage() {
  const params = useParams()
  const collegeId = params.id as string
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await fetch(`/api/colleges/${collegeId}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error)
        }

        setCollege(data.data)
        checkIfSaved(collegeId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch college')
      } finally {
        setLoading(false)
      }
    }

    fetchCollege()
  }, [collegeId])

  const checkIfSaved = async (id: string) => {
    try {
      const response = await fetch('/api/user/saved')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setIsSaved(data.data.some((c: College) => c.id === id))
        }
      }
    } catch (err) {
      console.error('Failed to check saved status:', err)
    }
  }

  const handleToggleSave = async () => {
    try {
      const response = await fetch(`/api/user/saved/${collegeId}`, { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        setIsSaved(data.data.saved)
        showToast(data.data.saved ? 'College saved!' : 'College removed', 'success')
      } else {
        showToast('Login to save colleges', 'info')
      }
    } catch (err) {
      showToast('Failed to save college', 'error')
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!college) return <ErrorState message="College not found" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {college.imageUrl && (
            <img src={college.imageUrl} alt={college.name} className="w-full md:w-64 h-48 object-cover rounded-lg" />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{college.name}</h1>
                <p className="text-gray-600 text-lg">📍 {college.location}</p>
              </div>
              <button
                onClick={handleToggleSave}
                className={`px-4 py-2 rounded-lg transition ${
                  isSaved
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isSaved ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Annual Fees</p>
                <p className="text-2xl font-bold text-primary">₹{(college.fees / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-primary">⭐ {college.rating.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-600">Placement %</p>
                <p className="text-2xl font-bold text-primary">{college.placements.placementPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{college.description}</p>
          </div>

          {/* Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Courses Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {college.courses.map((course) => (
                <div key={course} className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800">{course}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Placements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Placement Statistics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-2">Average Package</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((college.placements.avgPackage / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">₹{college.placements.avgPackage}L</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Top Recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {college.placements.topRecruiters.map((recruiter) => (
                    <span key={recruiter} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View on Official Site
              </button>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Request Brochure
              </button>
              <a
                href={`/college/${college.id}/qa`}
                className="w-full inline-block text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Ask Questions
              </a>
            </div>
          </div>

          {/* Key Facts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Key Facts</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{college.location}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Annual Fees:</span>
                <span className="font-semibold">₹{(college.fees / 100000).toFixed(2)}L</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-semibold">{college.rating} / 5</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Avg Package:</span>
                <span className="font-semibold">₹{college.placements.avgPackage}L</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
