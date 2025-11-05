-- =====================================================
-- DIRECT POSTGRESQL CONNECTION TEST
-- =====================================================
-- Connection Details:
-- Host: db.hfkksqchjubxvxatzrae.supabase.co
-- Port: 5432
-- Database: postgres
-- User: postgres
-- Password: Derq@038!
-- =====================================================

-- Test connection
SELECT NOW() as current_time, 
       version() as postgres_version,
       current_database() as database_name;

-- Check if we can access tables
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Quick inventory check
SELECT 
  COUNT(*) as total_products,
  COUNT(i.id) as products_with_inventory,
  COUNT(CASE WHEN i.quantity > 0 THEN 1 END) as products_in_stock,
  COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as products_out_of_stock
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id;

-- Show sample products with their inventory
SELECT 
  p.sku,
  p.title,
  COALESCE(i.quantity, 0) as quantity,
  COALESCE(i.reserved_quantity, 0) as reserved,
  CASE 
    WHEN i.quantity IS NULL THEN '❌ NO INVENTORY RECORD'
    WHEN i.quantity = 0 THEN '❌ OUT OF STOCK'
    WHEN i.quantity <= 5 THEN '⚠️ LOW STOCK'
    ELSE '✅ IN STOCK'
  END as status
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
ORDER BY p.created_at DESC
LIMIT 20;
