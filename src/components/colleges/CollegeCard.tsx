'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface CollegeCardProps {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  imageUrl?: string
  onSave?: () => void
  isSaved?: boolean
}

export function CollegeCard({
  id,
  name,
  location,
  fees,
  rating,
  imageUrl,
  onSave,
  isSaved = false,
}: CollegeCardProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>📍 {location}</p>
          <p>💰 ₹{fees?.toLocaleString()} / year</p>
          <p>⭐ {rating.toFixed(1)} / 5.0</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/college/${id}`)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className={`px-3 py-2 rounded transition ${
                isSaved
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isSaved ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
