'use client'

import React from 'react'
import clsx from 'clsx'

export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  )
}

interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  onClose: () => void
}

export function Toast({ type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }[type]

  return (
    <div className={clsx('px-4 py-3 rounded-lg shadow-lg', bgColor)}>
      {message}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 h-96 w-full">
      <Spinner />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-red-600 text-xl mb-4">⚠️</div>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-4xl mb-4">📭</div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}
