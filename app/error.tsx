'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Oops! Something went wrong
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          We encountered an unexpected error while processing your request.
        </p>
        
        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm font-mono text-red-800">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">
            Still having issues?
          </h3>
          <p className="text-sm text-gray-600">
            If the problem persists, please contact our support team. We're here to help you get the parts you need.
          </p>
        </div>
      </div>
    </div>
  )
}
