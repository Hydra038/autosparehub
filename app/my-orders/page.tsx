'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      router.push('/sign-in?redirect=/my-orders')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)

    // Load user's orders
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
    setOrders(userOrders.reverse()) // Most recent first
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.full_name || user?.email}
          </p>
        </div>
        <Link href="/" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            When you place an order, it will appear here
          </p>
          <Link href="/products" className="btn-primary mt-6 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order.id || index} className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-start justify-between border-b pb-4">
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      Order #{order.order_number}
                    </h3>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status || 'Confirmed'}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        order.payment_status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      Payment: {order.payment_status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(order.total_gbp)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items?.length || 0} item(s)
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4 space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.product_id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price_eur)}</p>
                      <p className="text-sm text-muted-foreground">
                        each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-semibold">Shipping Address</h4>
                <p className="text-sm">
                  {order.shipping?.full_name}
                  <br />
                  {order.shipping?.address_line1}
                  {order.shipping?.address_line2 && (
                    <>
                      <br />
                      {order.shipping.address_line2}
                    </>
                  )}
                  <br />
                  {order.shipping?.city}, {order.shipping?.postal_code}
                  <br />
                  {order.shipping?.country}
                </p>
                {order.shipping?.phone && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Phone:</span> {order.shipping.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
