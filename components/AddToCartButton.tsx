'use client'

import { useState } from 'react'
import { useCart } from '@/store/cartStore'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    sku: string
    price_gbp: number // Accept price_gbp for backwards compatibility but convert to price_eur
    image_url: string
  }
  disabled?: boolean
  quantity?: number
}

export default function AddToCartButton({
  product,
  disabled = false,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Check if product is already in cart
  const isInCart = items.some(item => item.product_id === product.id)

  const handleAddToCart = async () => {
    if (isInCart) return // Don't add if already in cart
    
    setIsAdding(true)
    
    addItem({
      product_id: product.id,
      title: product.title,
      sku: product.sku,
      price_eur: product.price_gbp, // Map price_gbp to price_eur for compatibility
      image_url: product.image_url,
      quantity,
    })

    // Visual feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || isInCart}
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isAdding ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
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
          Adding...
        </>
      ) : isInCart ? (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Added to Cart
        </>
      ) : disabled ? (
        'Out of Stock'
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  )
}
