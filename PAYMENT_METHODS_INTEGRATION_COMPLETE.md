# Payment Methods Database Integration - Setup Instructions

## Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

2. Open the SQL Editor

3. Copy and paste the contents of `supabase/create-payment-methods-table.sql`

4. Click "Run" to execute the script

5. Verify the table was created:
   - Check that you see "Success. No rows returned" message
   - Navigate to the "Table Editor" and confirm `payment_methods` table exists
   - Verify the 3 default payment methods (PayPal, Bank Transfer, IBAN) are inserted

## Step 2: Test Admin Panel

1. Build the project: `npm run build`

2. Start the development server: `npm run dev`

3. Navigate to the admin panel: http://localhost:3000/admin/payment-methods

4. You should see 3 payment methods listed (all enabled by default):
   - PayPal
   - Bank Transfer  
   - IBAN Direct Transfer

5. Test the enable/disable functionality:
   - Click "Disable" on PayPal
   - Verify the status changes to "Disabled" (red badge)
   - The database should be updated immediately

## Step 3: Test Checkout Page

1. Add some products to your cart (if not already added)

2. Navigate to checkout: http://localhost:3000/checkout

3. Sign in if prompted

4. Scroll to the "Payment Method" section

5. Verify:
   - Only enabled payment methods appear
   - If you disabled PayPal in step 2, it should NOT appear here
   - When you select a payment method, its details/instructions show below

6. Go back to admin panel and re-enable PayPal

7. Refresh the checkout page - PayPal should now appear

## Step 4: Test Full Flow

1. In admin panel (`/admin/payment-methods`):
   - Disable "Bank Transfer"
   - Keep PayPal and IBAN enabled

2. Go to checkout page:
   - Confirm only PayPal and IBAN appear
   - Bank Transfer should be hidden

3. Try disabling all payment methods:
   - Checkout should show: "No payment methods available" error message

4. Re-enable at least one method to restore normal functionality

## What Changed

### Admin Panel (`app/admin/payment-methods/page.tsx`)
- Now fetches payment methods from database (not hardcoded)
- Enable/Disable button updates `is_enabled` field in database
- Changes persist and sync across all pages
- Edit, Add, Delete all work with database

### Checkout Page (`app/checkout/page.tsx`)
- Fetches only enabled payment methods (`WHERE is_enabled = true`)
- Dynamically renders payment options
- Shows payment details from `config` JSONB field
- Displays "No payment methods available" if none are enabled

### Database (`payment_methods` table)
- **id**: UUID primary key
- **name**: Payment method name (e.g., "PayPal")
- **type**: Method type enum (paypal, bank_transfer, iban, cash, other)
- **is_enabled**: Boolean to control visibility
- **instructions**: Text shown to customers
- **config**: JSONB for payment details (email, IBAN, etc.)
- **display_order**: Control order of appearance
- **created_at/updated_at**: Timestamps

### Security (RLS Policies)
- Public users can SELECT enabled methods only
- Authenticated users can SELECT all methods
- Only admins can UPDATE, INSERT, DELETE

## Troubleshooting

**Error: "relation payment_methods does not exist"**
- You didn't run the SQL migration yet
- Go to Supabase SQL Editor and run `create-payment-methods-table.sql`

**No payment methods showing in checkout**
- All methods are disabled - go to admin panel and enable at least one
- SQL script wasn't run - check database table exists

**Changes not saving in admin panel**
- Check browser console for errors
- Verify RLS policies are set correctly
- Confirm your admin user has proper permissions

**TypeScript errors**
- Run `npm run build` to check for any compilation errors
- The `config` field is typed as `any` - modify if you want strict typing

## Next Steps

You can now:
1. Add more payment methods from the admin panel
2. Edit existing payment details and instructions
3. Reorder methods by changing `display_order`
4. Customize the styling of payment method cards
5. Add validation for required config fields
