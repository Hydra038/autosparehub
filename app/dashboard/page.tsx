'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'

export default function DashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      router.push('/sign-in?redirect=/dashboard')
      return
    }

    // Load user's orders
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
    setOrders(userOrders.reverse().slice(0, 5)) // Most recent 5 orders
    setIsLoading(false)
  }, [router])

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('user')
      router.push('/')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Link
          href="/products"
          className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">Shop Parts</div>
            <div className="text-sm text-muted-foreground">Browse catalog</div>
          </div>
        </Link>

        <Link
          href="/my-orders"
          className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">My Orders</div>
            <div className="text-sm text-muted-foreground">{orders.length} total</div>
          </div>
        </Link>

        <Link
          href="/track-order"
          className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">Track Order</div>
            <div className="text-sm text-muted-foreground">Check status</div>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">Sign Out</div>
            <div className="text-sm text-muted-foreground">Logout</div>
          </div>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/my-orders" className="text-sm text-primary hover:underline">
              View All Orders →
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center">
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
            <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
            <p className="mt-2 text-muted-foreground">
              Start shopping to see your orders here
            </p>
            <Link href="/products" className="btn-primary mt-6 inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation?order_id=${order.id}`}
                className="block rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Order #{order.order_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('de-DE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(order.total_gbp)}
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        {order.status}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          order.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {order.items?.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="text-sm text-muted-foreground">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
