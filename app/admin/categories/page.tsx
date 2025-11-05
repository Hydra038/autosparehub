import Link from 'next/link'
import { createServerClient } from '@/lib/supabaseServer'

async function getCategories() {
  const supabase = await createServerClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parts Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage product categories for better organization
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          + Add Category
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Categories</div>
          <div className="text-2xl font-bold">{categories.length}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.is_active).length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">
            {categories.filter(c => !c.is_active).length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-muted-foreground">With Products</div>
          <div className="text-2xl font-bold text-blue-600">
            {categories.filter(c => c.product_count && c.product_count > 0).length}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="rounded-lg border bg-white">
        {categories.length === 0 ? (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
            <p className="mt-2 text-muted-foreground">
              Get started by creating your first category
            </p>
            <Link href="/admin/categories/new" className="btn-primary mt-6 inline-block">
              + Add Category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Products</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image_url && (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="max-w-xs truncate" title={category.description}>
                        {category.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {category.product_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Showing {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
      </div>
    </div>
  )
}
