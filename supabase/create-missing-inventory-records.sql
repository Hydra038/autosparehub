-- Create inventory records for all products that don't have one
-- Run this in Supabase SQL Editor AFTER running check-inventory-setup.sql

-- Insert inventory records for products that don't have them
INSERT INTO inventory (product_id, quantity, reserved_quantity)
SELECT 
  p.id,
  0 as quantity,  -- Start with 0, admin can update
  0 as reserved_quantity
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id
WHERE i.id IS NULL;

-- Verify the insert worked
SELECT 
  COUNT(*) as total_inventory_records,
  COUNT(DISTINCT product_id) as unique_products_with_inventory,
  SUM(quantity) as total_units_in_stock
FROM inventory;

-- Show products that now have inventory
SELECT 
  p.id,
  p.title,
  p.sku,
  i.quantity,
  i.reserved_quantity,
  CASE 
    WHEN i.quantity = 0 THEN 'Out of Stock'
    WHEN i.quantity <= 5 THEN 'Low Stock'
    ELSE 'In Stock'
  END as status
FROM products p
JOIN inventory i ON i.product_id = p.id
ORDER BY i.quantity ASC, p.title
LIMIT 20;

-- Success message
SELECT 
  CONCAT(
    '✓ Created inventory records! ',
    'Total products: ', COUNT(DISTINCT p.id), ', ',
    'With inventory: ', COUNT(DISTINCT i.product_id)
  ) as result
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id;
