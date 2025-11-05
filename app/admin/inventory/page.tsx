import Link from 'next/link'
import { createServerClient } from '@/lib/supabaseServer'
import { formatPrice } from '@/lib/currency'
import { ProductImage } from '@/components/ProductImage'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getInventory() {
  const supabase = await createServerClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      inventory(quantity, reserved_quantity)
    `)
    .order('inventory.quantity', { ascending: true })

  if (error) {
    console.error('Error fetching inventory:', error)
    return []
  }

  return products || []
}

export default async function AdminInventoryPage() {
  const products = await getInventory()

  const stats = {
    total: products.length,
    lowStock: products.filter(
      (p) => p.inventory && p.inventory.quantity > 0 && p.inventory.quantity <= 5
    ).length,
    outOfStock: products.filter(
      (p) => !p.inventory || p.inventory.quantity === 0
    ).length,
    inStock: products.filter(
      (p) => p.inventory && p.inventory.quantity > 5
    ).length,
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
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor and manage product stock levels
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Total Products
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            In Stock
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.inStock}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Low Stock (≤5)
          </div>
          <div className="text-3xl font-bold text-yellow-600">{stats.lowStock}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Out of Stock
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.outOfStock}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">Stock Levels</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const quantity = product.inventory?.quantity || 0
                  const stockStatus =
                    quantity === 0
                      ? 'Out of Stock'
                      : quantity <= 5
                      ? 'Low Stock'
                      : 'In Stock'

                  const stockColor =
                    quantity === 0
                      ? 'bg-red-100 text-red-800'
                      : quantity <= 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <ProductImage
                          src={
                            product.product_images?.[0]?.image_url || '/placeholder-product.svg'
                          }
                          alt={product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{product.title}</div>
                        {product.manufacturer && (
                          <div className="text-sm text-muted-foreground">
                            {product.manufacturer}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">{product.sku}</td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatPrice(product.price_eur)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${stockColor}`}
                        >
                          {stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{quantity}</span>
                          <span className="text-sm text-muted-foreground">units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-primary hover:underline"
                          >
                            Update Stock
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
