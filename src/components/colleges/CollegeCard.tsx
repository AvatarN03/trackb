'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '../ui/card'
import { Button } from '../ui/Button'

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
    <Card className="overflow-hidden" variant="default">
      {imageUrl ? (
        <div className="w-full h-48 overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover transform transition group-hover:scale-105" />
        </div>
      ) : (
        <div className="w-full h-48 bg-[color:var(--color-muted)]"></div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-medium text-[color:var(--color-foreground)] mb-2">{name}</h3>
        <div className="space-y-1 text-sm text-[color:var(--md-on-surface-variant)] mb-4">
          <p>📍 {location}</p>
          <p>💰 ₹{fees?.toLocaleString()} / year</p>
          <p>⭐ {rating.toFixed(1)} / 5.0</p>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => router.push(`/college/${id}`)}>
            View Details
          </Button>
          {onSave && (
            <Button
              variant={isSaved ? 'tonal' : 'outlined'}
              aria-pressed={isSaved}
              onClick={onSave}
              className="w-12 h-10 p-0 flex items-center justify-center"
            >
              {isSaved ? '❤️' : '🤍'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
