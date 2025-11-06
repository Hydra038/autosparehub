# 🚨 FIX: "No payment methods available" Error

## Problem
The checkout page shows "No payment methods available" even though payment methods appear active in the admin dashboard.

## Root Cause
The `payment_methods` table doesn't exist in your Supabase database yet. The admin dashboard is showing demo data (not real database data).

## ✅ QUICK FIX - Use Simple Script (RECOMMENDED)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql
2. Click "New Query" or use the SQL Editor

### Step 2: Copy & Run Simple Script
1. Open file: `supabase/create-payment-methods-simple.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor
4. Click "Run" button

This script:
- ✅ Creates the table
- ✅ Inserts 3 default payment methods
- ✅ No complex RLS policies (simpler, fewer errors)
- ✅ Security handled by your app middleware

### Step 3: Verify Success
You should see 3 rows at the bottom:
```
PayPal | paypal | true | ...
Bank Transfer | bank_transfer | true | ...  
IBAN Direct Transfer | iban | true | ...
```

## Alternative - Use Main Script (If Simple Fails)

If you want RLS policies, use: `supabase/create-payment-methods-table.sql`

⚠️ Note: The main script has been updated to fix the "users table" error.

## Expected Results After Running SQL

✅ **Admin Dashboard** (`/admin/payment-methods`):
- Will now show REAL data from the database
- Enable/Disable will actually save to database
- Changes will persist after refresh

✅ **Checkout Page** (`/checkout`):
- Will show the 3 payment methods
- Only shows methods where `is_enabled = true`
- Displays payment details and instructions

## How to Test

1. **After running SQL**, go to checkout page
2. You should see 3 payment methods:
   - PayPal
   - Bank Transfer
   - IBAN Direct Transfer

3. Go to admin panel (`/admin/payment-methods`)
4. Click "Disable" on PayPal
5. Refresh checkout page
6. PayPal should now be GONE from checkout

## What the SQL Creates

### Table Structure:
```sql
payment_methods
├── id (UUID)
├── name (TEXT) - "PayPal", "Bank Transfer", etc.
├── type (TEXT) - paypal, bank_transfer, iban
├── is_enabled (BOOLEAN) ⭐ Controls visibility
├── instructions (TEXT) - Customer instructions
├── config (JSONB) - Payment details (IBAN, email, etc.)
├── display_order (INTEGER)
├── created_at, updated_at
```

### Security (RLS Policies):
- ✅ Public users can read ONLY enabled methods
- ✅ Authenticated users can read all methods
- ✅ Only admins can create/update/delete

### Default Data:
- 3 payment methods inserted
- All enabled by default
- Proper payment details in config

## Troubleshooting

### Error: "relation payment_methods already exists"
- Table exists but might be missing data
- Run this instead:
```sql
-- Check if data exists
SELECT * FROM payment_methods;

-- If empty, insert default data
INSERT INTO payment_methods (name, type, is_enabled, instructions, config, display_order)
VALUES
('PayPal', 'paypal', true, 'Send payment to our PayPal account with your order number in the note.', '{"email": "payments@autosparehub.eu"}', 1),
('Bank Transfer', 'bank_transfer', true, 'Transfer the total amount and include your order number as reference. Processing takes 1-3 business days.', '{"bank_name": "Deutsche Bank AG", "account_holder": "Autospare Hub GmbH", "iban": "DE89 3704 0044 0532 0130 00", "bic_swift": "COBADEFFXXX"}', 2),
('IBAN Direct Transfer', 'iban', true, 'Use your order number as the payment reference for faster processing.', '{"account_holder": "Autospare Hub GmbH", "iban": "DE89 3704 0044 0532 0130 00", "bic": "COBADEFFXXX", "bank": "Deutsche Bank AG"}', 3)
ON CONFLICT (name) DO NOTHING;
```

### Error: "column display_order does not exist"
- Run this to add the missing column:
```sql
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
UPDATE payment_methods SET display_order = 1 WHERE name = 'PayPal';
UPDATE payment_methods SET display_order = 2 WHERE name = 'Bank Transfer';
UPDATE payment_methods SET display_order = 3 WHERE name = 'IBAN Direct Transfer';
```

### Still showing "No payment methods available"
1. Check if table exists:
```sql
SELECT * FROM payment_methods WHERE is_enabled = true;
```

2. If no rows, insert default data (see above)

3. Check browser console for errors (F12)

4. Verify RLS policies are set correctly

## Quick Links

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql
- **SQL File**: `supabase/create-payment-methods-table.sql`
- **Table Editor**: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/editor

## After Success

Once the SQL is run successfully:
1. ✅ Checkout will show payment methods
2. ✅ Admin can enable/disable them
3. ✅ Changes save to database
4. ✅ Customers only see enabled methods

---

**Need Help?** Check the console for errors or run the check script:
```sql
-- In Supabase SQL Editor
SELECT * FROM payment_methods ORDER BY display_order;
```
