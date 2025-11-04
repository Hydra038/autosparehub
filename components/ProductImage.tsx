'use client'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = '/placeholder-product.svg'
      }}
    />
  )
}
