// Database queries for products
import { createServerClient } from '@/lib/supabaseServer'
import { createClient } from '@/lib/supabaseClient'

export interface Product {
  id: string
  sku: string
  title: string
  description: string | null
  long_description: string | null
  category_id: string | null
  price_eur: number
  compare_at_price_eur: number | null
  condition: 'new' | 'refurbished' | 'used'
  manufacturer: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  warranty_months?: number
  weight_kg?: number | null
  dimensions_cm?: string | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
  images?: {
    id: string
    image_url: string
    alt_text: string | null
    is_primary: boolean
    display_order: number
  }[]
  inventory?: {
    quantity: number
    reserved_quantity: number
  }[]
  product_images?: {
    id: string
    image_url: string
    alt_text: string | null
    is_primary: boolean
    display_order: number
  }[]
  compatibility?: any[]
}

// Get all active products
export async function getAllProducts(categoryId?: string, limit = 500) {
  const supabase = await createServerClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('is_active', true)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

// Get featured products
export async function getFeaturedProducts(limit = 8) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

// Get product by ID
export async function getProductById(id: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data as Product
}

// Get products by category
export async function getProductsByCategory(categorySlug: string, limit = 500) {
  const supabase = await createServerClient()
  
  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (categoryError) throw categoryError

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

// Search products
export async function searchProducts(query: string, limit = 500) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

// Client-side function to get products
export async function getProductsClient(limit = 500) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}
