-- Fix foreign key relationship between products and inventory tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

-- Step 1: Check if foreign key already exists
SELECT conname AS constraint_name
FROM pg_constraint
WHERE conrelid = 'inventory'::regclass
  AND confrelid = 'products'::regclass;

-- Step 2: Drop the foreign key if it exists (to recreate it properly)
-- ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_product_id_fkey;

-- Step 3: Add the foreign key constraint
ALTER TABLE inventory
ADD CONSTRAINT inventory_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- Step 4: Verify the foreign key was created
SELECT conname AS constraint_name, contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'inventory'::regclass;

-- Step 5: Test the relationship by querying
SELECT 
  p.id, 
  p.sku, 
  p.title,
  i.quantity,
  i.reserved_quantity
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id
LIMIT 5;

-- Step 6: Check RLS policies on inventory table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'inventory';

-- Step 7: If no SELECT policy exists, create one for public read access
CREATE POLICY "Enable read access for all users" ON inventory
  FOR SELECT
  USING (true);

-- Step 8: Make sure RLS is enabled
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
