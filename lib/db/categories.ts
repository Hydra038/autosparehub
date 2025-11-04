// Database queries for categories
import { createServerClient } from '@/lib/supabaseServer'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Get all active categories
export async function getAllCategories() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}

// Get top-level categories (no parent)
export async function getTopCategories() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data as Category
}

// Get subcategories of a category
export async function getSubcategories(parentId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}
