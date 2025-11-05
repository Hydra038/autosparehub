# Payment Methods Admin Page - Current Status

## Current Implementation
The payment methods page (`/admin/payment-methods`) is currently a **demo/static implementation**:

- ✅ Shows the 3 payment methods (PayPal, Bank Transfer, IBAN)
- ✅ Has UI for enable/disable
- ❌ Changes are NOT saved (only in component state)
- ❌ Changes do NOT affect checkout page
- ❌ No database integration

## How Payment Methods Actually Work

### In Database:
```sql
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'iban', 'paypal');
```
This is used in the `orders` table to record which payment method was chosen.

### In Checkout Page:
Payment methods are **hardcoded** in `app/checkout/page.tsx`:
- PayPal radio button
- Bank Transfer radio button  
- IBAN radio button

All three are always shown and active.

## Options to Fix

### Option 1: Simple Configuration File
Create a config file that controls which methods are active:
```typescript
// lib/paymentConfig.ts
export const PAYMENT_METHODS = {
  paypal: { active: true, name: 'PayPal' },
  bank_transfer: { active: true, name: 'Bank Transfer' },
  iban: { active: true, name: 'IBAN Direct Transfer' },
}
```
- Admin page updates this file
- Checkout page reads from it
- Requires rebuild to take effect

### Option 2: Database Table (Recommended)
Create a `payment_method_settings` table:
```sql
CREATE TABLE payment_method_settings (
  id UUID PRIMARY KEY,
  method_type payment_method NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT true,
  display_name TEXT,
  instructions TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```
- Admin page updates database
- Checkout page fetches from database
- Changes take effect immediately

### Option 3: Keep As Demo
Leave it as-is for demonstration purposes since all 3 methods should be available anyway.

## Recommendation

Since you have only 3 payment methods and they should all probably be active, I recommend **Option 3** - keep it as a demo page for showing payment information.

However, if you want to actually control which payment methods appear at checkout, we should implement **Option 2** (database integration).

**Which would you prefer?**
