import ProductCard from '@/components/ProductCard'
import FiltersPanel from '@/components/FiltersPanel'
import { getAllProducts, searchProducts } from '@/lib/db/products'
import { getAllCategories, getCategoryBySlug } from '@/lib/db/categories'

interface ProductsPageProps {
  searchParams: {
    q?: string
    category?: string
    make?: string
    model?: string
    year?: string
    condition?: string
    min_price?: string
    max_price?: string
    sort?: string
    featured?: string
  }
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  // If there's a search query, use search
  if (searchParams.q) {
    return await searchProducts(searchParams.q)
  }

  // Otherwise get all products with optional category filter
  let categoryId: string | undefined
  if (searchParams.category) {
    const category = await getCategoryBySlug(searchParams.category)
    categoryId = category?.id
  }

  return await getAllProducts(categoryId)
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getAllCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {searchParams.q
            ? `Search Results for "${searchParams.q}"`
            : searchParams.category
            ? `${categories.find((c) => c.slug === searchParams.category)?.name || 'Products'}`
            : 'All Products'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <FiltersPanel categories={categories} searchParams={searchParams} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mb-2 text-xl font-semibold">No products found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
