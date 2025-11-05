'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { formatPrice } from '@/lib/currency'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const total = getTotalPrice()
  const itemCount = items.length
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [])

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
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
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-muted-foreground">
            Add some products to get started
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:mb-8 md:text-3xl">Shopping Cart</h1>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:gap-4 sm:p-4"
              >
                <div className="relative mx-auto h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 sm:mx-0">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="text-sm font-medium hover:text-primary sm:text-base"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    SKU: {item.sku}
                  </p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    {formatPrice(item.price_eur)}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-medium sm:w-12">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Remove item"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-xs text-red-600 hover:underline sm:text-sm"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-bold sm:text-xl">Order Summary</h2>
            
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Shipping</span>
                <span className="text-green-600">At checkout</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-base font-bold sm:text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            {!loading && (
              user ? (
                <Link href="/checkout" className="btn-primary mt-6 w-full text-sm sm:text-base">
                  Proceed to Checkout
                </Link>
              ) : (
                <Link href="/sign-in?redirect=/checkout" className="btn-primary mt-6 w-full text-sm sm:text-base">
                  Sign In to Checkout
                </Link>
              )
            )}

            <Link
              href="/products"
              className="btn-secondary mt-3 w-full text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
