-- Add IBAN payment method if it doesn't exist
-- Run this in Supabase SQL Editor

-- Check what payment methods currently exist
SELECT id, name, type, is_enabled, display_order 
FROM payment_methods 
ORDER BY display_order;

-- Insert IBAN if it doesn't exist
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
  instructions = EXCLUDED.instructions,
  config = EXCLUDED.config,
  display_order = EXCLUDED.display_order;

-- Verify the result
SELECT id, name, type, is_enabled, display_order 
FROM payment_methods 
ORDER BY display_order;

SELECT 'IBAN payment method added/updated successfully!' as status;
