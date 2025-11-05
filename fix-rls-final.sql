-- BETTER FIX: Avoid recursion by checking auth.uid() directly
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

-- Step 1: View what's causing the recursion
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- Step 2: Drop ALL existing policies on users table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON users';
    END LOOP;
END $$;

-- Step 3: Create simple, non-recursive policies

-- 1. Allow any authenticated user to insert a row where the ID matches their auth.uid()
CREATE POLICY "allow_insert_own_profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- 2. Allow users to read their own row
CREATE POLICY "allow_read_own_profile"
ON users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 3. Allow users to update their own row
CREATE POLICY "allow_update_own_profile"
ON users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 4. Allow service role to do everything (for admin operations)
CREATE POLICY "allow_service_role_all"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 5: Show the new policies
SELECT 
    policyname,
    cmd as command,
    roles,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING clause exists'
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK clause exists'
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
