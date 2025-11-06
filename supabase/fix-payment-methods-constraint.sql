-- Fix payment_methods table to allow 'iban' type
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing check constraint
ALTER TABLE payment_methods 
DROP CONSTRAINT IF EXISTS payment_methods_type_check;

-- Step 2: Add new check constraint with 'iban' included
ALTER TABLE payment_methods 
ADD CONSTRAINT payment_methods_type_check 
CHECK (type IN ('bank_transfer', 'paypal', 'iban', 'cash', 'other', 'stripe'));

-- Step 3: Add display_order column if missing
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Step 4: Now insert/update all payment methods
INSERT INTO payment_methods (name, type, is_enabled, instructions, config, display_order)
VALUES (
  'PayPal',
  'paypal',
  true,
  'Send payment to our PayPal account with your order number in the note.',
  '{"PayPal Email": "payments@autosparehub.eu"}'::jsonb,
  1
)
ON CONFLICT (name) DO UPDATE 
SET 
  type = EXCLUDED.type,
  display_order = EXCLUDED.display_order;

INSERT INTO payment_methods (name, type, is_enabled, instructions, config, display_order)
VALUES (
  'Bank Transfer',
  'bank_transfer',
  true,
  'Transfer the total amount and include your order number as reference. Processing takes 1-3 business days.',
  '{
    "Bank Name": "Deutsche Bank AG",
    "Account Holder": "Autospare Hub GmbH",
    "IBAN": "DE89 3704 0044 0532 0130 00",
    "BIC/SWIFT": "COBADEFFXXX"
  }'::jsonb,
  2
)
ON CONFLICT (name) DO UPDATE 
SET 
  type = EXCLUDED.type,
  display_order = EXCLUDED.display_order;

INSERT INTO payment_methods (name, type, is_enabled, instructions, config, display_order)
VALUES (
  'IBAN Direct Transfer',
  'iban',
  true,
  'Use your order number as the payment reference for faster processing.',
  '{
    "Account Holder": "Autospare Hub GmbH",
    "IBAN": "DE89 3704 0044 0532 0130 00",
    "BIC": "COBADEFFXXX",
    "Bank": "Deutsche Bank AG"
  }'::jsonb,
  3
)
ON CONFLICT (name) DO UPDATE 
SET 
  type = EXCLUDED.type,
  display_order = EXCLUDED.display_order;

-- Step 5: Delete any unwanted payment methods
DELETE FROM payment_methods 
WHERE type = 'stripe' OR name ILIKE '%stripe%' OR name ILIKE '%card payment%';

-- Step 6: Verify final result
SELECT 
  id, 
  name, 
  type, 
  is_enabled,
  display_order,
  CASE WHEN is_enabled THEN '✓ Active' ELSE '✗ Disabled' END as status
FROM payment_methods 
ORDER BY display_order;

-- Success message
SELECT '✓ All payment methods set up! IBAN type is now allowed.' as result;
