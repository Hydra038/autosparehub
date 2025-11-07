'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    description: '',
    long_description: '',
    price_eur: '',
    compare_at_price_eur: '',
    condition: 'new' as 'new' | 'refurbished' | 'used',
    manufacturer: '',
    manufacturer_part_number: '',
    warranty_months: '12',
    weight_kg: '',
    dimensions_cm: '',
    category_id: '',
    is_active: true,
    is_featured: false,
  })

  const [inventory, setInventory] = useState({
    quantity: '0',
    reorder_level: '10',
    reorder_quantity: '50',
  })

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        return
      }

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles(files)

      // Create preview URLs
      const previews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews(previews)
    }
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // 1. Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          sku: formData.sku,
          title: formData.title,
          description: formData.description,
          long_description: formData.long_description || null,
          price_eur: parseFloat(formData.price_eur),
          compare_at_price_eur: formData.compare_at_price_eur
            ? parseFloat(formData.compare_at_price_eur)
            : null,
          condition: formData.condition,
          manufacturer: formData.manufacturer || null,
          manufacturer_part_number: formData.manufacturer_part_number || null,
          warranty_months: parseInt(formData.warranty_months),
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          dimensions_cm: formData.dimensions_cm || null,
          category_id: formData.category_id || null,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
        })
        .select()
        .single()

      if (productError) throw productError

      // 2. Create inventory record
      const { error: inventoryError } = await supabase.from('inventory').insert({
        product_id: product.id,
        quantity: parseInt(inventory.quantity),
        reorder_level: parseInt(inventory.reorder_level),
        reorder_quantity: parseInt(inventory.reorder_quantity),
      })

      if (inventoryError) throw inventoryError

      // 3. Upload images to Supabase Storage
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const fileName = `${product.id}/${Date.now()}-${file.name}`

          // Upload to Supabase Storage bucket 'product-images'
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Image upload error:', uploadError)
            continue
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

          // Insert image record
          await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: urlData.publicUrl,
            alt_text: formData.title,
            display_order: i,
            is_primary: i === 0,
          })
        }
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div className="rounded bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  SKU <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Condition <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      condition: e.target.value as 'new' | 'refurbished' | 'used',
                    })
                  }
                  className="input w-full"
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Detailed Description
              </label>
              <textarea
                value={formData.long_description}
                onChange={(e) =>
                  setFormData({ ...formData, long_description: e.target.value })
                }
                rows={5}
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="input w-full"
              >
                <option value="">Select a category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  No categories found. Please create categories first.
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Manufacturer</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  className="input w-full"
                  placeholder="e.g., Bosch, Brembo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Manufacturer Part Number
                </label>
                <input
                  type="text"
                  value={formData.manufacturer_part_number}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer_part_number: e.target.value })
                  }
                  className="input w-full"
                  placeholder="e.g., BP1234"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Pricing (EUR)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Price (€) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price_eur}
                onChange={(e) =>
                  setFormData({ ...formData, price_eur: e.target.value })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Compare at Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.compare_at_price_eur}
                onChange={(e) =>
                  setFormData({ ...formData, compare_at_price_eur: e.target.value })
                }
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={inventory.quantity}
                onChange={(e) =>
                  setInventory({ ...inventory, quantity: e.target.value })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Reorder Level</label>
              <input
                type="number"
                value={inventory.reorder_level}
                onChange={(e) =>
                  setInventory({ ...inventory, reorder_level: e.target.value })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Reorder Quantity
              </label>
              <input
                type="number"
                value={inventory.reorder_quantity}
                onChange={(e) =>
                  setInventory({ ...inventory, reorder_quantity: e.target.value })
                }
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Product Images</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Upload Images (first image will be primary)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="input w-full"
            />
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  {imageFiles.length} image(s) selected
                  {imageFiles.length > 0 && ' - First image will be the primary display'}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                          Primary
                        </span>
                      )}
                      <div className="mt-1 text-center text-xs text-muted-foreground">
                        {imageFiles[index].name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Active (visible to customers)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
