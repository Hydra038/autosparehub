// Authentication helper functions
import { createServerClient } from '@/lib/supabaseServer'
import { createClient } from '@/lib/supabaseClient'

// Server-side: Get current user with role
export async function getCurrentUser() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, role, phone, created_at')
    .eq('id', user.id)
    .single()

  return profile
}

// Server-side: Check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

// Client-side: Get current user with role
export async function getCurrentUserClient() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, role, phone, created_at')
    .eq('id', user.id)
    .single()

  return profile
}

// Client-side: Check if user is admin
export async function isAdminClient() {
  const user = await getCurrentUserClient()
  return user?.role === 'admin'
}

// Sign out helper
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

// User type
export type User = {
  id: string
  email: string
  full_name: string | null
  role: 'customer' | 'admin'
  phone: string | null
  created_at: string
}
