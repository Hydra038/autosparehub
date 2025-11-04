-- =====================================================
-- FIX: Remove infinite recursion in users table RLS
-- =====================================================
-- Run this in Supabase SQL Editor to fix the RLS policy error

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Step 2: Create a better policy that doesn't cause recursion
-- This policy allows users to view their own profile OR allows service role access
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() = id  -- Users can view their own profile
    OR auth.jwt()->>'role' = 'service_role'  -- Service role can view all
  );

-- Alternative Option: If you want admins to view all users, 
-- you'll need to store the role in the auth.users metadata
-- and check it there instead of querying the public.users table

-- For now, during development, you can also just disable RLS on users:
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- After running this, restart your dev server
