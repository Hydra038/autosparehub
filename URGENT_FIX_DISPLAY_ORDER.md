# 🚨 URGENT FIX: display_order Column Missing

## Error Message
```
Error fetching payment methods: column payment_methods.display_order does not exist
```

## Quick Fix (2 Steps)

### Step 1: Run This SQL in Supabase
1. Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql
2. Copy the content from: `supabase/add-display-order-column.sql`
3. Paste and click "Run"

**OR copy this directly:**

```sql
-- Add missing display_order column
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing records
UPDATE payment_methods SET display_order = 1 WHERE type = 'paypal';
UPDATE payment_methods SET display_order = 2 WHERE type = 'bank_transfer';
UPDATE payment_methods SET display_order = 3 WHERE type = 'iban';

-- Verify
SELECT name, type, is_enabled, display_order 
FROM payment_methods 
ORDER BY display_order;
```

### Step 2: Refresh Your Browser
After running the SQL, refresh your checkout page (Ctrl+F5 or Cmd+Shift+R)

## Why This Happened
The table was created with an older version of the script that didn't include the `display_order` column.

## Expected Result
After running the SQL, you should see:
- PayPal (display_order: 1)
- Bank Transfer (display_order: 2)
- IBAN Direct Transfer (display_order: 3)

## Verify It Worked
1. Refresh the checkout page
2. You should see the 3 payment methods
3. No more errors in console (F12)

## If Still Not Working

### Check if table has data:
```sql
SELECT * FROM payment_methods;
```

### If empty, insert default data:
```sql
INSERT INTO payment_methods (name, type, is_enabled, instructions, config, display_order)
VALUES
('PayPal', 'paypal', true, 'Send payment to our PayPal account with your order number in the note.', '{"email": "payments@autosparehub.eu"}', 1),
('Bank Transfer', 'bank_transfer', true, 'Transfer the total amount and include your order number as reference.', '{"bank_name": "Deutsche Bank AG", "account_holder": "Autospare Hub GmbH", "iban": "DE89 3704 0044 0532 0130 00", "bic_swift": "COBADEFFXXX"}', 2),
('IBAN Direct Transfer', 'iban', true, 'Use your order number as the payment reference for faster processing.', '{"account_holder": "Autospare Hub GmbH", "iban": "DE89 3704 0044 0532 0130 00", "bic": "COBADEFFXXX", "bank": "Deutsche Bank AG"}', 3)
ON CONFLICT (name) DO NOTHING;
```

---

**Quick Link**: [Supabase SQL Editor](https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql)
