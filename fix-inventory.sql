-- =====================================================
-- FIX ALL INVENTORY - SET PRODUCTS TO IN STOCK
-- =====================================================
-- Run this after test-connection.sql confirms the issue
-- =====================================================

-- STEP 1: Check current state
SELECT 
  'BEFORE UPDATE' as status,
  COUNT(*) as total_products,
  COUNT(i.id) as has_inventory_record,
  COUNT(CASE WHEN i.quantity > 0 THEN 1 END) as in_stock,
  COUNT(CASE WHEN i.quantity = 0 OR i.quantity IS NULL THEN 1 END) as out_of_stock
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id;

-- STEP 2: Add inventory records for products that don't have any
INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
SELECT 
  p.id, 
  50,   -- Set to 50 units
  0,    -- No reserved stock
  10,   -- Reorder when below 10
  50    -- Reorder 50 units at a time
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM inventory i WHERE i.product_id = p.id
);

-- STEP 3: Update existing inventory that has 0 quantity
UPDATE inventory
SET quantity = 50,
    reserved_quantity = 0,
    last_restocked_at = NOW(),
    updated_at = NOW()
WHERE quantity = 0;

-- STEP 4: Verify the fix
SELECT 
  'AFTER UPDATE' as status,
  COUNT(*) as total_products,
  COUNT(i.id) as has_inventory_record,
  COUNT(CASE WHEN i.quantity > 0 THEN 1 END) as in_stock,
  COUNT(CASE WHEN i.quantity = 0 OR i.quantity IS NULL THEN 1 END) as out_of_stock
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id;

-- STEP 5: Show sample of updated products
SELECT 
  p.sku,
  p.title,
  i.quantity,
  i.reserved_quantity,
  (i.quantity - i.reserved_quantity) as available,
  '✅ IN STOCK' as status
FROM products p
INNER JOIN inventory i ON p.id = i.product_id
WHERE i.quantity > 0
ORDER BY p.created_at DESC
LIMIT 20;

-- STEP 6: Summary by category
SELECT 
  c.name as category,
  COUNT(p.id) as total_products,
  COUNT(CASE WHEN i.quantity > 0 THEN 1 END) as in_stock,
  SUM(i.quantity) as total_quantity
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN inventory i ON p.id = i.product_id
GROUP BY c.name
ORDER BY total_products DESC;

-- =====================================================
-- ✅ DONE! All products should now be in stock
-- =====================================================
-- Refresh your website to see products available!
-- =====================================================
