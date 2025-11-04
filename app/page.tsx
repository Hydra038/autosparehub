import Link from 'next/link'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'
import { getFeaturedProducts } from '@/lib/db/products'
import { getAllCategories } from '@/lib/db/categories'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8), // Get 8 featured products
    getAllCategories(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
              Quality Car Parts for Every Make & Model
            </h1>
            <p className="mb-8 text-base text-blue-100 md:text-lg">
              Find the perfect spare parts for your vehicle. Fast Europe-wide delivery, expert support, and competitive prices in EUR.
            </p>
            <div className="mx-auto max-w-2xl">
              <SearchBar variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
            >
              {category.image_url ? (
                <div className="relative h-20 w-20">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary/10">
                  <svg
                    className="h-10 w-10 text-gray-400 group-hover:text-primary"
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
                </div>
              )}
              <span className="text-center text-sm font-medium">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
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
              <h3 className="mb-2 text-lg font-semibold">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                All parts tested and certified to meet OEM standards
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Quick shipping available across Europe
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Our team helps you find the right parts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products?featured=true" className="text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Can't Find What You're Looking For?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Our expert team can help you locate the exact part you need
          </p>
          <Link href="/contact" className="btn-secondary bg-white text-primary hover:bg-gray-100">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
