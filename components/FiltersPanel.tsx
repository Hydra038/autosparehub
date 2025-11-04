'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface FiltersPanelProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  searchParams: {
    category?: string
    condition?: string
    min_price?: string
    max_price?: string
    sort?: string
    make?: string
    model?: string
    year?: string
  }
}

export default function FiltersPanel({ categories, searchParams }: FiltersPanelProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  
  const [minPrice, setMinPrice] = useState(searchParams.min_price || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price || '')
  const [make, setMake] = useState(searchParams.make || '')
  const [model, setModel] = useState(searchParams.model || '')
  const [year, setYear] = useState(searchParams.year || '')

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(currentSearchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(currentSearchParams.toString())
    
    if (minPrice) params.set('min_price', minPrice)
    else params.delete('min_price')
    
    if (maxPrice) params.set('max_price', maxPrice)
    else params.delete('max_price')

    router.push(`/products?${params.toString()}`)
  }

  const applyVehicleFilter = () => {
    const params = new URLSearchParams(currentSearchParams.toString())
    
    if (make) params.set('make', make)
    else params.delete('make')
    
    if (model) params.set('model', model)
    else params.delete('model')
    
    if (year) params.set('year', year)
    else params.delete('year')

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const query = currentSearchParams.get('q')
    if (query) params.set('q', query)
    
    setMinPrice('')
    setMaxPrice('')
    setMake('')
    setModel('')
    setYear('')
    
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">Sort By</h3>
        <select
          value={searchParams.sort || 'created_at'}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="input w-full"
        >
          <option value="created_at">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Category</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateFilters('category', '')}
              className={`w-full text-left text-sm hover:text-primary ${
                !searchParams.category ? 'font-medium text-primary' : ''
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => updateFilters('category', category.slug)}
                className={`w-full text-left text-sm hover:text-primary ${
                  searchParams.category === category.slug ? 'font-medium text-primary' : ''
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Condition</h3>
        <div className="space-y-2">
          {['new', 'refurbished', 'used'].map((condition) => (
            <label key={condition} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="condition"
                value={condition}
                checked={searchParams.condition === condition}
                onChange={(e) => updateFilters('condition', e.target.value)}
                className="h-4 w-4 text-primary"
              />
              <span className="capitalize">{condition}</span>
            </label>
          ))}
          {searchParams.condition && (
            <button
              onClick={() => updateFilters('condition', '')}
              className="text-sm text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Price Range (€)</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input w-full"
          />
          <button
            onClick={applyPriceFilter}
            className="btn-secondary w-full text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Vehicle Compatibility</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Make (e.g., Toyota)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Model (e.g., Corolla)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="input w-full"
          />
          <input
            type="number"
            placeholder="Year (e.g., 2020)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input w-full"
          />
          <button
            onClick={applyVehicleFilter}
            className="btn-secondary w-full text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full text-sm text-red-600 hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  )
}
