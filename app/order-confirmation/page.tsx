'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatPrice } from '@/lib/currency'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabaseClient'

interface OrderItem {
  product_id: string
  title: string
  sku: string
  quantity: number
  price_eur: number
  image_url: string
}

interface ShippingInfo {
  full_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  postal_code: string
  country: string
}

interface Order {
  id: string
  order_number: string
  total_eur: number
  subtotal_eur: number
  shipping_cost_eur: number
  tax_amount_eur: number
  status: string
  payment_status: string
  payment_method: string
  created_at: string
  items: OrderItem[]
  shipping_address: ShippingInfo
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const order_id = searchParams.get('order_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order_id) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        // Fetch order from Supabase with items
        const { data: orderData, error: orderError } = await supabase
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
          .eq('id', order_id)
          .single()

        if (orderError) throw orderError

        if (orderData) {
          // Transform the data to match interface
          const transformedOrder = {
            ...orderData,
            items: orderData.order_items?.map((item: any) => ({
              product_id: item.product_id,
              title: item.product_title,
              sku: item.product_sku,
              image_url: item.product_image_url,
              price_eur: item.unit_price_eur,
              quantity: item.quantity,
            })) || [],
            shipping_address: {
              full_name: orderData.shipping_full_name,
              email: orderData.shipping_email,
              phone: orderData.shipping_phone,
              address_line1: orderData.shipping_address_line1,
              address_line2: orderData.shipping_address_line2,
              city: orderData.shipping_city,
              postal_code: orderData.shipping_postal_code,
              country: orderData.shipping_country,
            },
            subtotal_eur: orderData.subtotal_eur,
            shipping_cost_eur: orderData.shipping_eur,
            tax_amount_eur: orderData.tax_eur,
            total_eur: orderData.total_eur,
          }
          setOrder(transformedOrder as any)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [order_id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    )
  }

  if (!order_id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          No order ID was provided.
        </p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          We couldn't find an order with that ID.
        </p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Success Message */}
        <div className="mb-8 rounded-lg bg-green-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
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
          </div>
          <h1 className="mb-2 text-3xl font-bold text-green-900">
            Order Confirmed!
          </h1>
          <p className="text-green-700">
            Thank you for your order. We've sent a confirmation email to{' '}
            <strong>{order.shipping_address.email}</strong>
          </p>
        </div>

        {/* Order Details */}
        <div className="mb-6 rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-muted-foreground">
                Order #{order.order_number}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Order Date</div>
              <div className="font-medium">
                {new Date(order.created_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4 space-y-3">
            <h3 className="font-semibold">Items Ordered</h3>
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded border p-3"
              >
                <Image
                  src={item.image_url || '/placeholder.jpg'}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.sku} | Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(item.price_eur * item.quantity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price_eur)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal_eur || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_cost_eur || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT (19%)</span>
              <span>{formatPrice(order.tax_amount_eur || 0)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(order.total_eur || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6 rounded-lg border bg-white p-6">
          <h3 className="mb-3 font-semibold">Shipping Address</h3>
          <div className="text-sm">
            <p className="font-medium">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
            {order.shipping_address.phone && <p className="mt-2">Tel: {order.shipping_address.phone}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6 rounded-lg border bg-white p-6">
          <h3 className="mb-3 font-semibold">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">
                {order.payment_method === 'paypal' ? 'PayPal' : 
                 order.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                 order.payment_method === 'iban' ? 'IBAN Direct Transfer' : 
                 'Not specified'}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  order.payment_status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="mb-3 font-semibold text-blue-900">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>We'll send you an email confirmation shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your order will be processed within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Track your order status using the order number above</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Need help? Contact our support team anytime</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/my-orders" className="btn-primary flex-1">
            View My Orders
          </Link>
          <Link href="/products" className="btn-secondary flex-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
