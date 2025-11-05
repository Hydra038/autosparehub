-- Since the foreign key already exists, we only need to fix the RLS policy
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

-- Step 1: Drop existing policy if it exists (in case it's misconfigured)
DROP POLICY IF EXISTS "Enable read access for all users" ON inventory;

-- Step 2: Create RLS policy for public read access
CREATE POLICY "Enable read access for all users" 
ON inventory 
FOR SELECT 
USING (true);

-- Step 3: Make sure RLS is enabled
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify - this should return the policy we just created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'inventory';

-- Step 5: Test the query that your website uses
SELECT 
  p.id, 
  p.sku, 
  p.title,
  i.quantity,
  i.reserved_quantity
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id
LIMIT 5;
