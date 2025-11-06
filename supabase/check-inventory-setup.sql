-- Diagnostic: Check inventory table and data
-- Run this in Supabase SQL Editor

-- Step 1: Check if inventory table exists
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'inventory';

-- Step 2: Check inventory table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'inventory'
ORDER BY ordinal_position;

-- Step 3: Count inventory records
SELECT 
  COUNT(*) as inventory_count,
  COUNT(DISTINCT product_id) as unique_products
FROM inventory;

-- Step 4: Check sample inventory data
SELECT 
  id,
  product_id,
  quantity,
  reserved_quantity,
  created_at,
  updated_at
FROM inventory 
LIMIT 10;

-- Step 5: Check if products have inventory records
SELECT 
  'Products' as type,
  COUNT(*) as count
FROM products
UNION ALL
SELECT 
  'Inventory Records' as type,
  COUNT(*) as count
FROM inventory;

-- Step 6: Check foreign key relationship
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'inventory';

-- Step 7: Find products WITHOUT inventory records
SELECT 
  p.id,
  p.title,
  p.sku,
  'Missing inventory record' as issue
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id
WHERE i.id IS NULL
LIMIT 20;
