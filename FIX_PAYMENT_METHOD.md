# Payment Method Enum Fix

## Problem
The database had `payment_method` enum as `('stripe', 'paypal', 'bank_transfer')` but the application uses `('bank_transfer', 'iban', 'paypal')`.

This caused the error:
```
Failed to create order: invalid input value for enum payment_method: "iban"
```

## Solution

### ✅ Files Updated

1. **supabase/schema.sql** - Updated the enum definition:
   ```sql
   CREATE TYPE payment_method AS ENUM ('bank_transfer', 'iban', 'paypal');
   ```

2. **app/checkout/page.tsx** - Already has correct TypeScript types:
   ```typescript
   payment_method: 'paypal' as 'paypal' | 'bank_transfer' | 'iban'
   ```

### 🔧 Database Migration Required

**You MUST run this SQL in your Supabase SQL Editor:**

Open the file: `supabase/fix-payment-method-enum.sql`

Or copy this SQL and run it in Supabase:

```sql
-- Fix payment_method enum to include 'iban' instead of 'stripe'

-- Step 1: Add 'iban' to the enum
ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'iban';

-- Step 2: Update any existing 'stripe' payments to 'iban' (if any exist)
UPDATE orders SET payment_method = 'iban' WHERE payment_method = 'stripe';

-- Step 3: Create a new enum with only the values you want
CREATE TYPE payment_method_new AS ENUM ('bank_transfer', 'iban', 'paypal');

-- Step 4: Alter the orders table to use the new enum
ALTER TABLE orders 
  ALTER COLUMN payment_method TYPE payment_method_new 
  USING payment_method::text::payment_method_new;

-- Step 5: Drop the old enum and rename the new one
DROP TYPE payment_method;
ALTER TYPE payment_method_new RENAME TO payment_method;

-- Step 6: Verify the change
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'payment_method'::regtype 
ORDER BY enumsortorder;
```

### 📋 Payment Methods Available

After this fix, customers can choose:

1. **PayPal** - Online payment via PayPal
2. **Bank Transfer** - Traditional bank transfer with full details
3. **IBAN Direct Transfer** - Direct IBAN transfer option

### ⚠️ IMPORTANT: Run the Migration First!

Before testing checkout again:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql
2. Copy and paste the SQL from `supabase/fix-payment-method-enum.sql`
3. Click "Run"
4. Verify the result shows: `bank_transfer`, `iban`, `paypal`

Then you can test placing an order with any payment method!
