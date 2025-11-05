-- =====================================================
-- INVENTORY STATUS CHECK
-- =====================================================
-- Run this in Supabase SQL Editor to check your inventory

-- 1. Check total inventory records
SELECT 
  COUNT(*) as total_inventory_records,
  COUNT(CASE WHEN quantity > 0 THEN 1 END) as products_in_stock,
  COUNT(CASE WHEN quantity = 0 THEN 1 END) as products_out_of_stock,
  COUNT(CASE WHEN quantity <= 5 AND quantity > 0 THEN 1 END) as products_low_stock
FROM inventory;

-- 2. Check inventory with product details
SELECT 
  p.id,
  p.sku,
  p.title,
  p.price_eur,
  i.quantity as stock_quantity,
  i.reserved_quantity,
  (i.quantity - i.reserved_quantity) as available_stock,
  CASE 
    WHEN i.quantity IS NULL THEN 'NO INVENTORY RECORD'
    WHEN i.quantity = 0 THEN 'OUT OF STOCK'
    WHEN i.quantity <= 5 THEN 'LOW STOCK'
    ELSE 'IN STOCK'
  END as stock_status
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
ORDER BY i.quantity ASC NULLS FIRST
LIMIT 50;

-- 3. Check products WITHOUT inventory records
SELECT 
  p.id,
  p.sku,
  p.title,
  'NO INVENTORY' as issue
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
WHERE i.id IS NULL
LIMIT 20;

-- 4. Count products by stock status
SELECT 
  CASE 
    WHEN i.quantity IS NULL THEN 'No Inventory Record'
    WHEN i.quantity = 0 THEN 'Out of Stock'
    WHEN i.quantity <= 5 THEN 'Low Stock (1-5)'
    WHEN i.quantity <= 20 THEN 'Medium Stock (6-20)'
    ELSE 'High Stock (20+)'
  END as stock_level,
  COUNT(*) as product_count
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
GROUP BY 
  CASE 
    WHEN i.quantity IS NULL THEN 'No Inventory Record'
    WHEN i.quantity = 0 THEN 'Out of Stock'
    WHEN i.quantity <= 5 THEN 'Low Stock (1-5)'
    WHEN i.quantity <= 20 THEN 'Medium Stock (6-20)'
    ELSE 'High Stock (20+)'
  END
ORDER BY product_count DESC;

-- 5. Sample of products showing in stock vs out of stock
SELECT 
  p.title,
  p.sku,
  COALESCE(i.quantity, 0) as quantity,
  COALESCE(i.reserved_quantity, 0) as reserved,
  CASE 
    WHEN i.quantity IS NULL OR i.quantity = 0 THEN '❌ OUT OF STOCK'
    ELSE '✅ IN STOCK'
  END as display_status
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
ORDER BY p.created_at DESC
LIMIT 20;

-- =====================================================
-- IF PRODUCTS ARE OUT OF STOCK, RUN THIS TO FIX:
-- =====================================================

-- OPTION 1: Add inventory for products that don't have any
/*
INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
SELECT 
  id, 
  50,  -- Set to 50 units
  0,   -- No reserved
  10,  -- Reorder when below 10
  50   -- Reorder 50 units
FROM products
WHERE id NOT IN (SELECT product_id FROM inventory WHERE product_id IS NOT NULL);
*/

-- OPTION 2: Update existing inventory to add stock
/*
UPDATE inventory
SET quantity = 50,
    reserved_quantity = 0,
    last_restocked_at = NOW()
WHERE quantity = 0;
*/

-- OPTION 3: Set ALL products to 50 units (use carefully!)
/*
INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
SELECT 
  id, 
  50, 
  0, 
  10, 
  50
FROM products
ON CONFLICT (product_id) 
DO UPDATE SET 
  quantity = 50,
  reserved_quantity = 0,
  last_restocked_at = NOW();
*/
