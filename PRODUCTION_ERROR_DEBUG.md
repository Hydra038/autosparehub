# PRODUCTION ERROR TROUBLESHOOTING

## 🎯 Problem

Production deployment on Vercel shows generic error:
```
Error: An error occurred in the Server Components render.
The specific message is omitted in production builds...
```

## 🔍 Common Causes

### 1. Missing Environment Variables
Most common cause on Vercel deployments.

### 2. Database Connection Issues
RLS policies or connection string problems.

### 3. Server Component Errors
Async/await issues or data fetching failures.

## 🛠️ Step-by-Step Debugging

### Step 1: Check Vercel Environment Variables

1. Go to: https://vercel.com/Hydra038/autosparehub/settings/environment-variables

2. Verify these variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hfkksqchjubxvxatzrae.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres:Derq@038!@db.hfkksqchjubxvxatzrae.supabase.co:5432/postgres
   ```

3. If any are missing:
   - Click "Add Variable"
   - Add the variable
   - Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Redeploy after adding variables:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 2: Check Vercel Deployment Logs

1. Go to: https://vercel.com/Hydra038/autosparehub

2. Click on the latest deployment

3. Click "Runtime Logs" tab

4. Look for actual error messages (they show in logs even if hidden from users)

5. Common errors you might see:
   ```
   Error: Invalid Supabase URL
   Error: fetch failed
   Error: new row violates row-level security policy
   Error: relation "products" does not exist
   ```

### Step 3: Test Locally with Production Build

```bash
npm run build
npm start
```

If it fails locally, you'll see the real error message.

### Step 4: Enable Detailed Errors (Temporary)

Add this to `next.config.mjs` temporarily:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Show detailed errors in production (REMOVE after debugging)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Log errors
  onError: (err, req, res) => {
    console.error('Error:', err)
  }
}

export default nextConfig
```

Then rebuild and redeploy.

### Step 5: Check Specific Pages

Test each route individually on Vercel:
- https://autosparehub-nti3.vercel.app/ (homepage)
- https://autosparehub-nti3.vercel.app/products (products page)
- https://autosparehub-nti3.vercel.app/admin (admin dashboard)

Note which page(s) fail.

## 🔧 Quick Fixes for Common Issues

### If Homepage Fails:
```typescript
// Check app/page.tsx
// Make sure getFeaturedProducts() handles errors:

try {
  const products = await getFeaturedProducts()
} catch (error) {
  console.error('Failed to fetch products:', error)
  // Return empty array or show error message
  return []
}
```

### If Products Page Fails:
- Check RLS policies on `products` table
- Check RLS policies on `inventory` table (we fixed this earlier)
- Verify foreign key relationships

### If Admin Pages Fail:
- Check `SUPABASE_SERVICE_ROLE_KEY` is set on Vercel
- Check admin middleware is using correct environment variable

## 📊 Checklist

- [ ] Environment variables set on Vercel
- [ ] Redeployed after setting variables
- [ ] Checked Vercel Runtime Logs for errors
- [ ] Tested production build locally (`npm run build && npm start`)
- [ ] RLS policies applied on Supabase (users, inventory)
- [ ] Supabase Site URL updated to Vercel URL
- [ ] All tables have proper RLS policies

## 🚨 Emergency Fix

If you need the site working NOW:

1. **Disable RLS temporarily on problem tables:**
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ NOT recommended for production!

2. **Or create permissive policies:**
   ```sql
   CREATE POLICY "allow_all_reads" ON products
   FOR SELECT USING (true);
   
   CREATE POLICY "allow_all_reads" ON inventory
   FOR SELECT USING (true);
   ```

## 📝 Next Steps

1. Check Vercel logs to see actual error
2. Verify environment variables
3. Apply RLS fixes we created earlier
4. Redeploy

---

**Tell me what you see in the Vercel Runtime Logs and I can help fix the specific issue!**
