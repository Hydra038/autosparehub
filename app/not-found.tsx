import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
          <br />
          The part you're searching for might have been moved or discontinued.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/products"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browse Products
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">Need help finding a part?</h3>
          <p className="text-sm text-gray-600">
            Try our search feature or browse by category. Our expert team is also here to help you find the right parts for your vehicle.
          </p>
        </div>
      </div>
    </div>
  )
}
