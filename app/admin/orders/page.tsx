import Link from 'next/link'
import { createServerClient } from '@/lib/supabaseServer'
import { formatPrice } from '@/lib/currency'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getOrders() {
  const supabase = await createServerClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return orders || []
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/admin"
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
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Shipped</div>
          <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Cancelled</div>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.shipping_name}</div>
                      <div className="text-sm text-muted-foreground">{order.shipping_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatPrice(order.total_eur)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="capitalize">{order.payment_method}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
