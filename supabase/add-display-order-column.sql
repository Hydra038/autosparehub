-- Add missing display_order column to payment_methods table
-- Run this if you get "column display_order does not exist" error

-- Step 1: Add the display_order column if it doesn't exist
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Step 2: Update existing records with display_order values
UPDATE payment_methods SET display_order = 1 WHERE type = 'paypal' OR name ILIKE '%paypal%';
UPDATE payment_methods SET display_order = 2 WHERE type = 'bank_transfer' OR name ILIKE '%bank%';
UPDATE payment_methods SET display_order = 3 WHERE type = 'iban' OR name ILIKE '%iban%';

-- Step 3: Set any remaining records to a high number
UPDATE payment_methods 
SET display_order = 999 
WHERE display_order = 0;

-- Step 4: Verify the update
SELECT id, name, type, is_enabled, display_order 
FROM payment_methods 
ORDER BY display_order;

-- Success message
SELECT 'display_order column added successfully!' as status;
