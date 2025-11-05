-- Check the actual structure of payment_methods table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'payment_methods'
ORDER BY ordinal_position;

-- Show sample data without display_order
SELECT id, name, type, is_enabled FROM payment_methods LIMIT 5;
