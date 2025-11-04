import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'
import AddToCartButton from './AddToCartButton'

interface ProductCardProps {
  product: {
    id: string
    title: string
    sku: string
    price_eur: number
    compare_at_price_eur?: number | null
    condition: 'new' | 'refurbished' | 'used'
    product_images?: Array<{
      image_url: string
      is_primary: boolean
    }> | null
    inventory?: Array<{
      quantity: number
      reserved_quantity: number
    }> | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images?.find((img) => img.is_primary)
  const imageUrl = primaryImage?.image_url || product.product_images?.[0]?.image_url || '/placeholder-product.svg'
  
  const availableStock = product.inventory?.[0]
    ? product.inventory[0].quantity - product.inventory[0].reserved_quantity
    : 0
  
  const isInStock = availableStock > 0
  const hasDiscount = product.compare_at_price_eur && product.compare_at_price_eur > product.price_eur

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.condition !== 'new' && (
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white capitalize">
              {product.condition}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
              Sale
            </span>
          )}
        </div>

        {!isInStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 line-clamp-2 text-sm font-medium hover:text-primary">
            {product.title}
          </h3>
        </Link>
        
        <p className="mb-2 text-xs text-muted-foreground">
          SKU: {product.sku}
        </p>

        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price_eur)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price_eur!)}
              </span>
            )}
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              sku: product.sku,
              price_gbp: product.price_eur, // TODO: Update AddToCartButton to use price_eur
              image_url: imageUrl,
            }}
            disabled={!isInStock}
          />
        </div>
      </div>
    </div>
  )
}
