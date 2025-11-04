export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-24 w-24">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Loading...
        </h2>
        <p className="text-gray-600">
          Finding the best parts for your vehicle
        </p>

        {/* Loading Animation Dots */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  )
}
