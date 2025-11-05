-- Fix payment_method enum to include 'iban' instead of 'stripe'
-- Run this in Supabase SQL Editor

-- Step 1: Add 'iban' to the enum (this needs to be in its own transaction)
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'iban';

-- IMPORTANT: After running Step 1, you MUST run the rest separately
-- Copy and paste the SQL below AFTER Step 1 completes successfully

-- Step 2: Update any existing 'stripe' payments to 'iban' (if any exist)
-- UPDATE orders SET payment_method = 'iban' WHERE payment_method = 'stripe';

-- Step 3: Create a new enum with only the values you want
-- CREATE TYPE payment_method_new AS ENUM ('bank_transfer', 'iban', 'paypal');

-- Step 4: Alter the orders table to use the new enum
-- ALTER TABLE orders 
--   ALTER COLUMN payment_method TYPE payment_method_new 
--   USING payment_method::text::payment_method_new;

-- Step 5: Drop the old enum and rename the new one
-- DROP TYPE payment_method;
-- ALTER TYPE payment_method_new RENAME TO payment_method;

-- Step 6: Verify the change
-- SELECT enumlabel 
-- FROM pg_enum 
-- WHERE enumtypid = 'payment_method'::regtype 
-- ORDER BY enumsortorder;
