-- PART 2: Complete the payment_method enum update
-- Run this AFTER fix-payment-method-enum-part1.sql has completed

-- Step 1: Update any existing 'stripe' payments to 'iban' (if any exist)
UPDATE orders SET payment_method = 'iban' WHERE payment_method = 'stripe';

-- Step 2: Create a new enum with only the values you want
CREATE TYPE payment_method_new AS ENUM ('bank_transfer', 'iban', 'paypal');

-- Step 3: Alter the orders table to use the new enum
ALTER TABLE orders 
  ALTER COLUMN payment_method TYPE payment_method_new 
  USING payment_method::text::payment_method_new;

-- Step 4: Drop the old enum and rename the new one
DROP TYPE payment_method;
ALTER TYPE payment_method_new RENAME TO payment_method;

-- Step 5: Verify the change
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'payment_method'::regtype 
ORDER BY enumsortorder;

-- You should see:
-- bank_transfer
-- iban
-- paypal
