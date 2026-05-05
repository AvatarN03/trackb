'use client'

import React, { useState } from 'react'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">College Predictor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Get Predictions</h2>

            <form onSubmit={handlePredict} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rank</label>
                <input
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g., 150"
                  className="input-field"
                  min="1"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-2">
                Predict
              </button>
            </form>

            {/* Info */}
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">ℹ️ How it works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enter your exam type and rank</li>
                <li>• Get list of colleges you can get into</li>
                <li>• See admission probability</li>
                <li>• Compare your options</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {results === null ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter your details</h3>
              <p className="text-gray-600">Fill in the form to get predictions for colleges you can apply to</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try a different rank or exam type</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Predicted Colleges for {exam} Rank {rank}
              </h2>
              {results.map((college) => (
                <div key={college.collegeId} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                      <p className="text-gray-600">📍 {college.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getProbabilityColor(college.probability)}`}>
                      {college.probability} Chance
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Annual Fees</p>
                      <p className="text-lg font-bold text-primary">₹{(college.fees / 100000).toFixed(2)}L</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Rating</p>
                      <p className="text-lg font-bold text-primary">⭐ {college.rating.toFixed(1)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = `/college/${college.collegeId}`}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
