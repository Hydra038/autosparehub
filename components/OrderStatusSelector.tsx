'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrderStatusSelectorProps {
  orderId: string
  currentStatus: string
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status')
      }

      setStatus(newStatus)
      setSuccess(true)
      
      // Refresh the page to show updated data
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update order status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Status
        </label>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((statusOption) => (
            <button
              key={statusOption.value}
              onClick={() => handleStatusChange(statusOption.value)}
              disabled={loading || status === statusOption.value}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${
                  status === statusOption.value
                    ? statusOption.color + ' ring-2 ring-offset-2 ring-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {statusOption.label}
              {status === statusOption.value && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Updating order status...
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Order status updated successfully!
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}
