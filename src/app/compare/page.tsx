'use client'

import React, { useState, useEffect } from 'react'
import { showToast } from '@/components/common/Toast'
import { LoadingState, ErrorState } from '@/components/common/LoadingStates'

interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
}

interface ComparisonData {
  collegeId: string
  name: string
  location: string
  fees: number
  rating: number
  placementPercentage: number
  avgPackage: number
  imageUrl?: string
}

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [comparison, setComparison] = useState<ComparisonData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchAllColleges()
  }, [])

  const fetchAllColleges = async () => {
    try {
      const response = await fetch('/api/colleges?page=1')
      const data = await response.json()
      if (data.success) {
        setAllColleges(data.data.data)
      }
    } catch (err) {
      showToast('Failed to fetch colleges', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCollege = (collegeId: string) => {
    setSelected((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId)
      }
      if (prev.length < 3) {
        return [...prev, collegeId]
      }
      showToast('You can compare up to 3 colleges', 'info')
      return prev
    })
    setComparison(null)
  }

  const handleCompare = async () => {
    if (selected.length < 2) {
      showToast('Select at least 2 colleges', 'error')
      return
    }

    setSearching(true)
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: selected }),
      })

      const data = await response.json()
      if (data.success) {
        setComparison(data.data.comparison)
        showToast('Comparison created successfully!', 'success')
      } else {
        showToast(data.error || 'Comparison failed', 'error')
      }
    } catch (err) {
      showToast('Failed to create comparison', 'error')
    } finally {
      setSearching(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Compare Colleges</h1>

      {/* College Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Colleges to Compare</h2>
        <p className="text-gray-600 mb-4">Choose 2-3 colleges to compare side by side</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {allColleges.map((college) => (
            <div
              key={college.id}
              onClick={() => handleSelectCollege(college.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                selected.includes(college.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{college.name}</h3>
                  <p className="text-sm text-gray-600">📍 {college.location}</p>
                  <p className="text-sm text-gray-600">⭐ {college.rating}</p>
                </div>
                {selected.includes(college.id) && (
                  <div className="text-2xl">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCompare}
            disabled={selected.length < 2 || searching}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? 'Creating Comparison...' : 'Compare'}
          </button>
          <button
            onClick={() => {
              setSelected([])
              setComparison(null)
            }}
            className="btn-secondary"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      {comparison && (
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6">Comparison Result</h2>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Criteria</th>
                {comparison.map((college) => (
                  <th key={college.collegeId} className="px-4 py-3 text-left font-bold text-gray-900">
                    {college.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3 font-semibold">Location</td>
                {comparison.map((college) => (
                  <td key={college.collegeId} className="px-4 py-3">
                    {college.location}
                  </td>
                ))}
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="px-4 py-3 font-semibold">Annual Fees</td>
                {comparison.map((college) => (
                  <td key={college.collegeId} className="px-4 py-3">
                    ₹{(college.fees / 100000).toFixed(2)}L
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-semibold">Rating</td>
                {comparison.map((college) => (
                  <td key={college.collegeId} className="px-4 py-3">
                    ⭐ {college.rating.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="px-4 py-3 font-semibold">Placement %</td>
                {comparison.map((college) => (
                  <td key={college.collegeId} className="px-4 py-3">
                    {college.placementPercentage}%
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-semibold">Avg Package</td>
                {comparison.map((college) => (
                  <td key={college.collegeId} className="px-4 py-3">
                    ₹{college.avgPackage}L
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                const token = localStorage.getItem('auth-token')
                if (!token) {
                  showToast('Login to save comparisons', 'info')
                  return
                }
                showToast('Comparison saved!', 'success')
              }}
              className="btn-primary"
            >
              Save Comparison
            </button>
            <button onClick={() => window.print()} className="btn-secondary">
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
