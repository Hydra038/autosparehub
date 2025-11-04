'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: Array<{
    id: string
    image_url: string
    alt_text: string | null
  }>
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white">
        <Image
          src={images[selectedImage].image_url}
          alt={images[selectedImage].alt_text || 'Product image'}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `Thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
