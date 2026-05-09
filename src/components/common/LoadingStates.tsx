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
    <div className="flex flex-col items-center justify-center py-20 h-96 w-full">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-500"></div>
        </div>
      </div>
      <p className="text-slate-600 font-medium text-lg">Loading...</p>
      <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-red-200 bg-red-50">
      <div className="text-6xl mb-4">❌</div>
      <p className="text-slate-900 font-semibold text-lg mb-2">Oops! Something went wrong</p>
      <p className="text-slate-600 mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          🔄 Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-slate-200 bg-slate-50">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-slate-900 font-semibold text-lg mb-2">No Results</p>
      <p className="text-slate-600 text-center max-w-md">{message}</p>
    </div>
  )
}
