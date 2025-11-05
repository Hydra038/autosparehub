import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import { createServerClient } from '@/lib/supabaseServer'

async function getAdminData() {
  const supabase = await createServerClient()

  // Fetch summary statistics
  const [productsResult, ordersResult, recentOrdersResult] = await Promise.all([
    supabase.from('products').select('id, is_active', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total_eur, status'),
    supabase
      .from('orders')
      .select('id, order_number, created_at, status, total_eur, shipping_email')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const allOrders = ordersResult.data || []

  return {
    totalProducts: productsResult.count || 0,
    totalOrders: allOrders.length,
    recentOrders: recentOrdersResult.data || [],
    revenue: allOrders.reduce((sum, order) => sum + (order.total_eur || 0), 0),
    pendingOrders: allOrders.filter(o => o.status === 'pending').length,
    processingOrders: allOrders.filter(o => o.status === 'processing').length,
    shippedOrders: allOrders.filter(o => o.status === 'shipped').length,
  }
}

export default async function AdminPage() {
  const data = await getAdminData()

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your e-commerce platform</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm md:text-base">
          + Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 md:mb-8 grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 md:p-6">
          <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">
            Total Products
          </div>
          <div className="text-2xl md:text-3xl font-bold">{data.totalProducts}</div>
        </div>

        <div className="rounded-lg border bg-white p-4 md:p-6">
          <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">
            Total Orders
          </div>
          <div className="text-2xl md:text-3xl font-bold">{data.totalOrders}</div>
        </div>

        <div className="rounded-lg border bg-white p-4 md:p-6">
          <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {formatPrice(data.revenue)}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 md:p-6">
          <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="text-2xl md:text-3xl font-bold text-orange-600">
            {data.pendingOrders}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="mb-6 md:mb-8 grid gap-4 md:gap-6 grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Processing</div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">{data.processingOrders}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Shipped</div>
          <div className="text-xl md:text-2xl font-bold text-purple-600">{data.shippedOrders}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">{data.pendingOrders}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs md:text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold">Order #</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold hidden sm:table-cell">Date</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold hidden md:table-cell">Customer</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm hidden sm:table-cell">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm hidden md:table-cell truncate max-w-[150px]">{order.shipping_email}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
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
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium whitespace-nowrap">
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
