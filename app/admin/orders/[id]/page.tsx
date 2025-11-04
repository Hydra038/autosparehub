import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabaseServer'
import { formatPrice } from '@/lib/currency'
import { OrderStatusSelector } from '@/components/OrderStatusSelector'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getOrder(id: string) {
  const supabase = await createServerClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    return null
  }

  return order
}

async function getOrderItems(orderId: string) {
  const supabase = await createServerClient()

  const { data: items, error } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(
        id,
        sku,
        title,
        manufacturer,
        product_images(image_url, is_primary)
      )
    `)
    .eq('order_id', orderId)

  if (error) {
    console.error('Error fetching order items:', error)
    return []
  }

  return items || []
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  const items = await getOrderItems(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-primary hover:underline"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="mt-2 text-muted-foreground">
            Order #{order.order_number}
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border bg-white">
            <div className="border-b p-6">
              <h2 className="text-xl font-bold">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      {item.product?.product_images?.[0]?.image_url ? (
                        <img
                          src={item.product.product_images[0].image_url}
                          alt={item.product_title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product_title}</h3>
                      {item.product?.sku && (
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product.sku}
                        </p>
                      )}
                      {item.product?.manufacturer && (
                        <p className="text-sm text-muted-foreground">
                          {item.product.manufacturer}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: {formatPrice(item.unit_price_eur)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPrice(item.total_price_eur)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal_eur)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_cost_eur)}</span>
                </div>
                {order.tax_eur > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax_eur)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.total_eur)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Customer Name
                </div>
                <div className="mt-1">{order.shipping_name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="mt-1">{order.shipping_email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Phone
                </div>
                <div className="mt-1">{order.shipping_phone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Address
                </div>
                <div className="mt-1">
                  {order.shipping_address}
                  {order.shipping_address_line2 && (
                    <>
                      <br />
                      {order.shipping_address_line2}
                    </>
                  )}
                  <br />
                  {order.shipping_city}, {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Manage Status</h2>
            <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Order Information */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Order Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Order Number
                </div>
                <div className="mt-1 font-mono">{order.order_number}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Order Date
                </div>
                <div className="mt-1">
                  {new Date(order.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </div>
                <div className="mt-1 capitalize">{order.payment_method}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Payment Status
                </div>
                <div className="mt-1 capitalize">{order.payment_status}</div>
              </div>
              {order.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Notes
                  </div>
                  <div className="mt-1 text-sm">{order.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
