// Client-side Supabase client (uses anon key)
// Use this in client components for public data and authenticated requests

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
