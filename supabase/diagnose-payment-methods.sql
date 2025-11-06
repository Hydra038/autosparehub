-- Quick Diagnostic Script for Payment Methods
-- Run this in Supabase SQL Editor to check the status

-- 1. Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'payment_methods'
    ) THEN 'Table EXISTS ✓'
    ELSE 'Table DOES NOT EXIST ✗ - Run create-payment-methods-table.sql'
  END as table_status;

-- 2. If table exists, show all data
SELECT 
  name, 
  type, 
  is_enabled,
  display_order,
  CASE 
    WHEN is_enabled THEN '✓ ACTIVE'
    ELSE '✗ DISABLED'
  END as status
FROM payment_methods 
ORDER BY display_order;

-- 3. Count enabled vs disabled
SELECT 
  COUNT(*) FILTER (WHERE is_enabled = true) as enabled_count,
  COUNT(*) FILTER (WHERE is_enabled = false) as disabled_count,
  COUNT(*) as total_count
FROM payment_methods;

-- 4. Check RLS policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'payment_methods';

-- 5. Show what customers will see (enabled only)
SELECT 
  name,
  type,
  instructions,
  config
FROM payment_methods 
WHERE is_enabled = true
ORDER BY display_order;
