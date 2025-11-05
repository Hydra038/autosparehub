-- Check if payment_methods table exists and show its structure
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'payment_methods'
) as table_exists;

-- If table exists, show sample data
SELECT * FROM payment_methods ORDER BY display_order LIMIT 5;

-- Show RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'payment_methods';
