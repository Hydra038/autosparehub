import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import AddToCartButton from '@/components/AddToCartButton'
import ImageCarousel from '@/components/ImageCarousel'
import { getProductById } from '@/lib/db/products'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const images = product.product_images?.sort((a, b) => a.display_order - b.display_order) || []
  const primaryImage = images.find((img) => img.is_primary) || images[0]
  
  const availableStock = product.inventory?.[0]
    ? product.inventory[0].quantity - product.inventory[0].reserved_quantity
    : 0
  
  const isInStock = availableStock > 0
  const hasDiscount = product.compare_at_price_eur && product.compare_at_price_eur > product.price_eur
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price_eur! - product.price_eur) / product.compare_at_price_eur!) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <ImageCarousel images={images} />
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
            <p className="text-sm text-muted-foreground">
              SKU: {product.sku}
              {product.manufacturer && ` | Manufacturer: ${product.manufacturer}`}
            </p>
          </div>

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(product.price_eur)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price_eur!)}
                </span>
                <span className="rounded bg-red-600 px-2 py-1 text-sm font-bold text-white">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {isInStock ? (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  In Stock ({availableStock} available)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="mb-2 font-semibold">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Condition & Warranty */}
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{product.condition}</p>
            </div>
            {product.warranty_months && product.warranty_months > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Warranty</p>
                <p className="font-medium">{product.warranty_months} months</p>
              </div>
            )}
            {product.weight_kg && (
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">{product.weight_kg} kg</p>
              </div>
            )}
            {product.dimensions_cm && (
              <div>
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">{product.dimensions_cm} cm</p>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mb-6">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                sku: product.sku,
                price_gbp: product.price_eur, // TODO: Update AddToCartButton to use price_eur
                image_url: primaryImage?.image_url || '/placeholder-product.png',
              }}
              disabled={!isInStock}
            />
          </div>

          {/* Additional Info */}
          <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
            <p>✓ Secure payment processing</p>
            <p>✓ Fast UK delivery</p>
            <p>✓ Expert customer support</p>
            {product.warranty_months && product.warranty_months > 0 && <p>✓ Warranty included</p>}
          </div>
        </div>
      </div>

      {/* Compatibility Table */}
      {product.compatibility && product.compatibility.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Vehicle Compatibility</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Make</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Years</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Engine</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trim</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {product.compatibility.map((compat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{compat.make}</td>
                    <td className="px-4 py-3 text-sm">{compat.model}</td>
                    <td className="px-4 py-3 text-sm">
                      {compat.year_from} - {compat.year_to}
                    </td>
                    <td className="px-4 py-3 text-sm">{compat.engine || '-'}</td>
                    <td className="px-4 py-3 text-sm">{compat.trim || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Long Description */}
      {product.long_description && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Detailed Information</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-muted-foreground">
              {product.long_description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
