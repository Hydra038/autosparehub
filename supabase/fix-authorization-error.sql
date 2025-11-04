-- ============================================
-- FIX AUTHORIZATION ERROR
-- ============================================
-- This script fixes "Failed to perform authorization check" errors

-- STEP 1: Disable RLS on users table
-- ========================================
-- RLS (Row Level Security) can block admin operations
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'users';
-- Expected: rowsecurity = false

-- ============================================

-- STEP 2: Grant necessary permissions
-- ========================================
-- Ensure the authenticated and anon roles have access

-- Grant SELECT, INSERT, UPDATE to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT USAGE ON SEQUENCE users_id_seq TO authenticated;

-- Grant SELECT to anonymous users (for public read)
GRANT SELECT ON public.users TO anon;

-- ============================================

-- STEP 3: Check current table permissions
-- ========================================
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'users'
  AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- Expected: Should see grants for 'authenticated', 'anon', 'postgres'

-- ============================================

-- STEP 4: Verify you can query the table
-- ========================================
SELECT COUNT(*) FROM public.users;

-- Expected: Should return a number (even if 0)
-- If this fails, there's still a permission issue

-- ============================================

-- STEP 5: Check auth.users table
-- ========================================
-- Note: This requires service_role key to access
SELECT 
  id,
  email,
  created_at,
  confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Expected: Should show users from auth system
-- If "permission denied", you're using anon key (not service_role)

-- ============================================
-- IMPORTANT NOTES
-- ============================================

-- 1. USE SERVICE_ROLE KEY in Supabase SQL Editor:
--    - Click on SQL Editor in left sidebar
--    - Make sure you're using "service_role" connection
--    - NOT the anon key (which has RLS restrictions)

-- 2. If using API/Code:
--    - Use SUPABASE_SERVICE_ROLE_KEY (not SUPABASE_ANON_KEY)
--    - Service role bypasses RLS policies

-- 3. After fixing:
--    - Re-run verify-admin-users.sql
--    - It should now work without authorization errors

-- ============================================
-- ALTERNATIVE: Check if users table exists
-- ============================================

SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'users'
  AND table_schema = 'public';

-- Expected: Should show 1 row
-- If empty, the users table doesn't exist!

-- ============================================
-- IF TABLE DOESN'T EXIST: Create it
-- ============================================

-- Run this only if the table is missing:
/*
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_role enum if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
  END IF;
END $$;

-- Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
*/

-- ============================================
