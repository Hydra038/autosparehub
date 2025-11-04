import Link from 'next/link'
import Image from 'next/image'
import { getAllCategories } from '@/lib/db/categories'
import { createServerClient } from '@/lib/supabaseServer'

async function getCategoriesWithCounts() {
  const categories = await getAllCategories()
  const supabase = await createServerClient()

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)

      return {
        ...category,
        productCount: count || 0,
      }
    })
  )

  return categoriesWithCounts
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Shop by Category</h1>
        <p className="text-muted-foreground">
          Browse our complete range of car parts organized by category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group overflow-hidden rounded-lg border bg-white transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex flex-col">
              {/* Category Icon/Image */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
                {category.image_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <svg
                    className="h-20 w-20 text-primary transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                )}
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                  </span>
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    Browse →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 rounded-lg border bg-gray-50 p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Can't Find Your Part?</h2>
        <p className="mb-4 text-muted-foreground">
          Use our search function or contact our expert team for assistance
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="btn-primary"
          >
            View All Products
          </Link>
          <Link
            href="/contact"
            className="btn-secondary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
