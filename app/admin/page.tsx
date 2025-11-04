import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import { createServerClient } from '@/lib/supabaseServer'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getAdminData() {
  const supabase = await createServerClient()

  // Check if user is admin (in production, use proper auth)
  // For now, this is a placeholder

  // Fetch summary statistics
  const [productsResult, ordersResult, recentOrdersResult] = await Promise.all([
    supabase.from('products').select('id, is_active', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total_eur, status', { count: 'exact' }),
    supabase
      .from('orders')
      .select('id, order_number, created_at, status, total_eur, shipping_email')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return {
    totalProducts: productsResult.count || 0,
    totalOrders: ordersResult.count || 0,
    recentOrders: recentOrdersResult.data || [],
    revenue: ordersResult.data?.reduce((sum, order) => sum + (order.total_eur || 0), 0) || 0,
  }
}

export default async function AdminPage() {
  const data = await getAdminData()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/products/new" className="btn-primary">
            + Add Product
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Total Products
          </div>
          <div className="text-3xl font-bold">{data.totalProducts}</div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Total Orders
          </div>
          <div className="text-3xl font-bold">{data.totalOrders}</div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="text-3xl font-bold text-green-600">
            {formatPrice(data.revenue)}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {data.recentOrders.filter((o) => o.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Link
          href="/admin/products"
          className="flex flex-col items-center gap-2 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
        >
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="font-semibold">Manage Products</span>
          <span className="text-sm text-muted-foreground">
            Add, edit, or remove products
          </span>
        </Link>

        <Link
          href="/admin/orders"
          className="flex flex-col items-center gap-2 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
        >
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="font-semibold">Manage Orders</span>
          <span className="text-sm text-muted-foreground">
            View and update order status
          </span>
        </Link>

        <Link
          href="/admin/inventory"
          className="flex flex-col items-center gap-2 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
        >
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="font-semibold">Inventory Management</span>
          <span className="text-sm text-muted-foreground">
            Track and update stock levels
          </span>
        </Link>

        <Link
          href="/admin/users"
          className="flex flex-col items-center gap-2 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
        >
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="font-semibold">Manage Users</span>
          <span className="text-sm text-muted-foreground">
            View and manage user accounts
          </span>
        </Link>

        <Link
          href="/admin/payment-methods"
          className="flex flex-col items-center gap-2 rounded-lg border p-6 transition-all hover:border-primary hover:shadow-md"
        >
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span className="font-semibold">Payment Methods</span>
          <span className="text-sm text-muted-foreground">
            Configure payment options
          </span>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentOrders.map((order) => (
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
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{order.shipping_email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(order.total_eur)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
