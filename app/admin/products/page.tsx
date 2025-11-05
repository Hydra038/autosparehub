import Link from 'next/link'
import { createServerClient } from '@/lib/supabaseServer'
import { formatPrice } from '@/lib/currency'
import { ProductImage } from '@/components/ProductImage'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getProducts() {
  const supabase = await createServerClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      inventory(quantity, reserved_quantity),
      product_images(id, image_url, alt_text, is_primary, display_order)
    `)
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

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
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="mt-2 text-muted-foreground">
            View, edit, and manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/products/new" className="btn-primary">
            + Add New Product
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                      {product.inventory ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            product.inventory.quantity > 20
                              ? 'bg-green-100 text-green-800'
                              : product.inventory.quantity > 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inventory.quantity} units
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No inventory</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/products/${product.sku.toLowerCase()}`}
                          className="text-muted-foreground hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
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
