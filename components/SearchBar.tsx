'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SearchBarProps {
  variant?: 'default' | 'hero'
}

export default function SearchBar({ variant = 'default' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const isHero = variant === 'hero'

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by part name, SKU, or vehicle..."
        className={`w-full rounded-lg border pr-12 shadow-sm transition-all ${
          isHero 
            ? 'h-12 border-white/20 bg-white px-5 text-base text-gray-900 placeholder:text-gray-500 focus:border-white focus:ring-4 focus:ring-white/30' 
            : 'input border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
        }`}
      />
      <button
        type="submit"
        className={`absolute flex items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90 ${
          isHero ? 'right-2 top-2 h-8 w-8' : 'right-2 top-1 h-8 w-8'
        }`}
        aria-label="Search"
      >
        <svg
          className={isHero ? 'h-5 w-5' : 'h-4 w-4'}
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
      </button>
    </form>
  )
}
