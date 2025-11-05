# Admin Dashboard Order Stats Fix

## Problem
The admin dashboard was only showing total orders, with pending, processing, and shipped all showing 0.

## Root Cause
The orders query was using `{ count: 'exact' }` which only returns the count metadata without the actual data:

```typescript
// BROKEN:
supabase.from('orders').select('id, total_eur, status', { count: 'exact' })
// This returns: { data: null, count: 150 }
// So ordersResult.data was null/empty array
```

When trying to filter the data:
```typescript
const allOrders = ordersResult.data || []  // Empty array!
pendingOrders: allOrders.filter(o => o.status === 'pending').length  // Always 0
```

## Solution
Removed `{ count: 'exact' }` from the orders query to fetch actual data:

```typescript
// FIXED:
supabase.from('orders').select('id, total_eur, status')
// This returns: { data: [{...}, {...}], count: null }
// Now ordersResult.data contains all orders
```

**File:** `app/admin/page.tsx`

**Changes:**
```typescript
// Before:
supabase.from('orders').select('id, total_eur, status', { count: 'exact' })

// After:
supabase.from('orders').select('id, total_eur, status')
```

## Result

Now the dashboard correctly shows:
- ✅ Total Orders (count of all orders)
- ✅ Pending Orders (count where status = 'pending')
- ✅ Processing Orders (count where status = 'processing')
- ✅ Shipped Orders (count where status = 'shipped')
- ✅ Total Revenue (sum of all order totals)

## How It Works Now

1. Fetches ALL orders with their status and total
2. Counts total: `allOrders.length`
3. Filters by status: `allOrders.filter(o => o.status === 'pending').length`
4. Calculates revenue: `allOrders.reduce((sum, order) => sum + order.total_eur, 0)`

All statistics are now accurate! 🎉
