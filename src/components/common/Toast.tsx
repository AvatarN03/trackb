'use client'

import { useEffect, useState } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const listeners: Set<(toast: Toast) => void> = new Set()

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = `toast-${toastId++}`
  const toast = { id, message, type }
  listeners.forEach((listener) => listener(toast))

  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

function removeToast(id: string) {
  listeners.forEach((listener) => listener({ id, message: '', type: 'info' }))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => {
        if (toast.message === '') {
          return prev.filter((t) => t.id !== toast.id)
        }
        return [...prev, toast]
      })
    }

    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-white ${
            toast.type === 'success'
              ? 'bg-green-500'
              : toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
