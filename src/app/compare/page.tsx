"use client"

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { showToast } from '@/components/common/Toast'
import { LoadingState, ErrorState } from '@/components/common/LoadingStates'
import { useAuth } from '@/hooks/useAuth'

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
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [comparison, setComparison] = useState<ComparisonData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    fetchAllColleges()
  }, [])

  useEffect(() => {
    if (savedIds.length >= 2 && !comparison && !searching && !loading) {
      setSelected(savedIds.slice(0, 3))
      void handleCompareIds(savedIds.slice(0, 3))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, searching, comparison, savedIds.join(',')])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ids = params.get('ids')?.split(',').map((id) => id.trim()).filter(Boolean) ?? []
      setSavedIds(ids)
    } catch (e) {
      setSavedIds([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCompareIds = async (collegeIds: string[]) => {
    setSearching(true)
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds }),
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

  const handleCompare = async () => {
    if (selected.length < 2) {
      showToast('Select at least 2 colleges', 'error')
      return
    }

    await handleCompareIds(selected)
  }

  const handleSaveComparison = async () => {
    if (!comparison) {
      showToast('Create a comparison first', 'info')
      return
    }

    if (!isAuthenticated) {
      showToast('Login to save comparisons', 'info')
      return
    }

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: selected, save: true }),
      })

      const data = await response.json()

      if (data.success) {
        showToast('Comparison saved!', 'success')
      } else {
        showToast(data.error || 'Failed to save comparison', 'error')
      }
    } catch (error) {
      showToast('Failed to save comparison', 'error')
    }
  }

  if (loading || authLoading) return <LoadingState />

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-3">⚖️ Compare Colleges</h1>
          <p className="section-subtitle">Select 2-3 colleges and see a detailed side-by-side comparison</p>
        </div>

        {/* College Selection */}
        <div className="card-elevated p-8 mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-2">🎓 Select Colleges</h2>
            <div className="flex items-center gap-3">
              <span className={`badge ${selected.length >= 2 ? 'badge-success' : 'badge-primary'}`}>
                {selected.length}/3 selected
              </span>
              <p className="text-slate-600">Choose 2-3 colleges to compare</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {allColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => handleSelectCollege(college.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selected.includes(college.id)
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-50/50 shadow-lg shadow-amber-200/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-950 mb-2">{college.name}</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>📍 {college.location}</p>
                      <p>⭐ {college.rating.toFixed(1)}/5</p>
                      <p>💰 ₹{(college.fees / 100000).toFixed(2)}L</p>
                    </div>
                  </div>
                  {selected.includes(college.id) && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCompare}
              disabled={selected.length < 2 || searching}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
            >
              {searching ? '⚡ Creating Comparison...' : '📊 Compare'}
            </button>
            <button
              onClick={() => {
                setSelected([])
                setComparison(null)
              }}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        {comparison && (
          <div className="card-elevated p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-6">📊 Comparison Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                    <th className="px-4 py-3 text-left font-bold text-slate-950">Criteria</th>
                    {comparison.map((college) => (
                      <th key={college.collegeId} className="px-4 py-3 text-left font-bold text-slate-950">
                        {college.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-950">📍 Location</td>
                    {comparison.map((college) => (
                      <td key={college.collegeId} className="px-4 py-3 text-slate-700">
                        {college.location}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-950">💰 Annual Fees</td>
                    {comparison.map((college) => (
                      <td key={college.collegeId} className="px-4 py-3 text-slate-700">
                        ₹{(college.fees / 100000).toFixed(2)}L
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-950">⭐ Rating</td>
                    {comparison.map((college) => (
                      <td key={college.collegeId} className="px-4 py-3 text-slate-700 font-semibold">
                        {college.rating.toFixed(1)}/5.0
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-950">✅ Placement %</td>
                    {comparison.map((college) => (
                      <td key={college.collegeId} className="px-4 py-3 text-slate-700">
                        <span className="badge-success">{college.placementPercentage}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-950">💼 Avg Package</td>
                    {comparison.map((college) => (
                      <td key={college.collegeId} className="px-4 py-3 text-slate-700 font-semibold">
                        ₹{college.avgPackage}L
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveComparison}
                className="btn-primary flex-1 sm:flex-none"
              >
                💾 Save Comparison
              </button>
              <button 
                onClick={() => window.print()} 
                className="btn-secondary flex-1 sm:flex-none"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
