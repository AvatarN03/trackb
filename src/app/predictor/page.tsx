'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { showToast } from '@/components/common/Toast'
import { LoadingState } from '@/components/common/LoadingStates'

interface PredictionResult {
  collegeId: string
  name: string
  location: string
  fees: number
  rating: number
  probability: string
}

export default function PredictorPage() {
  const [exam, setExam] = useState<'JEE' | 'NEET' | 'CET'>('JEE')
  const [rank, setRank] = useState('')
  const [results, setResults] = useState<PredictionResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rank) {
      showToast('Please enter your rank', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, rank: parseInt(rank) }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.data.predictions)
      } else {
        showToast(data.error || 'Prediction failed', 'error')
      }
    } catch (err) {
      showToast('Failed to predict colleges', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState />

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'High':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-3">🎯 College Predictor</h1>
          <p className="section-subtitle">Get smart predictions for your dream colleges based on your exam scores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-950 mb-6">Get Predictions</h2>

              <form onSubmit={handlePredict} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">📝 Exam Type</label>
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value as 'JEE' | 'NEET' | 'CET')}
                    className="input-field"
                  >
                    <option value="JEE">JEE Main</option>
                    <option value="NEET">NEET</option>
                    <option value="CET">CET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🏆 Your Rank</label>
                  <input
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g., 500"
                    className="input-field"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-2">Enter your all-India rank</p>
                </div>

                <button type="submit" className="btn-primary w-full text-lg" disabled={loading}>
                  {loading ? 'Predicting...' : '⚡ Predict Now'}
                </button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-medium">💡 Tip: Lower rank numbers indicate better chances</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading ? (
              <LoadingState />
            ) : results && results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-950">Predictions</h2>
                  <span className="badge-primary">{results.length} colleges</span>
                </div>
                {results.map((result, idx) => (
                  <Link
                    key={idx}
                    href={`/college/${result.collegeId}`}
                    className="card p-6 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-amber-600 transition">
                          {result.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                          <span>📍 {result.location}</span>
                          <span>⭐ {result.rating.toFixed(1)}</span>
                          <span>💰 ₹{(result.fees / 100000).toFixed(2)}L</span>
                        </div>
                      </div>
                      <div className={`${getProbabilityColor(result.probability)} px-4 py-2 rounded-full font-bold text-sm`}>
                        {result.probability}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">🔮</div>
                <p className="text-slate-600 text-lg">Enter your exam details to see predictions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
