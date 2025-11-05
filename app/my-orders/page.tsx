'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'
import { createClient } from '@/lib/supabaseClient'

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/sign-in?redirect=/my-orders')
        return
      }

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', authUser.id)
        .single()

      setUser(userData || authUser)

      // Load user's orders from Supabase with items
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_title,
            product_sku,
            product_image_url,
            unit_price_eur,
            quantity,
            total_price_eur
          )
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      // Transform order_items to items for display
      const transformedOrders = userOrders?.map(order => ({
        ...order,
        items: order.order_items?.map((item: any) => ({
          product_id: item.product_id,
          title: item.product_title,
          sku: item.product_sku,
          image_url: item.product_image_url,
          price_eur: item.unit_price_eur,
          quantity: item.quantity,
        })) || [],
        shipping: {
          full_name: order.shipping_full_name,
          email: order.shipping_email,
          phone: order.shipping_phone,
          address_line1: order.shipping_address_line1,
          address_line2: order.shipping_address_line2,
          city: order.shipping_city,
          postal_code: order.shipping_postal_code,
          country: order.shipping_country,
        },
      })) || []

      setOrders(transformedOrders)
      setIsLoading(false)
    }

    checkAuth()
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Welcome back, {user?.full_name || user?.email}
          </p>
        </div>
        <Link href="/" className="btn-secondary text-sm sm:text-base">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center sm:p-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16"
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
          <h2 className="mt-4 text-lg font-semibold sm:text-xl">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            When you place an order, it will appear here
          </p>
          <Link href="/products" className="btn-primary mt-6 inline-block text-sm sm:text-base">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order, index) => (
            <div key={order.id || index} className="rounded-lg border bg-white p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold sm:text-lg">
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
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold text-primary sm:text-2xl">
                    {formatPrice(order.total_eur)}
                  </p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {order.items?.length || 0} item(s)
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4 space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.product_id} className="flex gap-3 sm:gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded bg-gray-100 sm:h-16 sm:w-16">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="text-sm font-medium hover:text-primary line-clamp-2 sm:text-base"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium sm:text-base">{formatPrice(item.price_eur)}</p>
                      <p className="text-xs text-muted-foreground">
                        each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                <h4 className="mb-2 text-xs font-semibold sm:text-sm">Shipping Address</h4>
                <p className="text-xs sm:text-sm">
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
                  <p className="mt-2 text-xs sm:text-sm">
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
