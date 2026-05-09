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
    <div 
      className="card-elevated overflow-hidden group cursor-pointer hover:border-amber-300 transition-all duration-300"
      onClick={() => router.push(`/college/${id}`)}
    >
      {/* Image */}
      {imageUrl ? (
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span className="text-6xl">🎓</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-950 mb-3 line-clamp-2 group-hover:text-amber-600 transition">{name}</h3>
        
        {/* Stats */}
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center text-slate-600">
            <span className="mr-2">📍</span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <span className="mr-2">💰</span>
            <span className="font-medium">₹{(fees / 100000).toFixed(2)}L per year</span>
          </div>
          <div className="flex items-center text-slate-600">
            <span className="mr-2">⭐</span>
            <span className="font-medium">{rating.toFixed(1)}/5.0 Rating</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/college/${id}`)
            }}
            className="btn-primary flex-1 text-sm"
          >
            View Details →
          </button>
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSave()
              }}
              className={`px-4 py-2.5 rounded-lg font-semibold transition duration-300 text-lg ${
                isSaved 
                  ? 'bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100 hover:ring-red-300'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200 hover:ring-slate-300'
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
