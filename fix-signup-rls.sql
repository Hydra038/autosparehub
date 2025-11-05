-- Fix sign-up issue: Allow users to create their own profile
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

-- 1. Allow users to insert their own profile during sign-up
CREATE POLICY "Users can insert their own profile" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Allow users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Allow admins to read all users
CREATE POLICY "Admins can read all users" 
ON users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Enable RLS (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. Verify policies were created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'users';
