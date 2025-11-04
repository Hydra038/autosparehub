# ✅ Complete Fix Checklist

## Current Issues
1. ❌ PostgreSQL RLS Error (42P17) - **BLOCKING**
2. ❌ Only 20 products showing (should be 240)
3. ❌ Product images not displaying

## Fix Steps (Do in Order!)

### 1️⃣ Fix Database RLS Error (CRITICAL!)

Open **Supabase Dashboard** → **SQL Editor**

Copy/paste and **Run**:
```sql
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

✅ **Expected Result**: "Success. No rows returned"

---

### 2️⃣ Update Product Images

Still in **Supabase SQL Editor**, copy/paste and **Run**:

```sql
DELETE FROM product_images;

INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN c.slug = 'engine-parts' THEN 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop'
    WHEN c.slug = 'brakes' THEN 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop'
    WHEN c.slug = 'suspension' THEN 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop'
    WHEN c.slug = 'electrical' THEN 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=600&fit=crop'
    WHEN c.slug = 'filters' THEN 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop'
    WHEN c.slug = 'exhaust' THEN 'https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=600&h=600&fit=crop'
    WHEN c.slug = 'cooling' THEN 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=600&fit=crop'
    WHEN c.slug = 'transmission' THEN 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop'
    WHEN c.slug = 'interior' THEN 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=600&fit=crop'
    WHEN c.slug = 'exterior' THEN 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=600&fit=crop'
    WHEN c.slug = 'wheels-tyres' THEN 'https://images.unsplash.com/photo-1606767661833-23a3cd01c136?w=600&h=600&fit=crop'
    WHEN c.slug = 'steering' THEN 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop'
  END,
  p.title,
  0,
  true
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;
```

✅ **Expected Result**: "Success. 240 rows affected"

---

### 3️⃣ Restart Development Server

In your PowerShell terminal:
```powershell
npm run dev
```

✅ **Expected Result**: Server starts without errors on `http://localhost:3000`

---

### 4️⃣ Test Everything

Visit these URLs and verify:

1. **Homepage** (`http://localhost:3000`)
   - ✅ Featured products display with images
   - ✅ All categories visible

2. **All Products** (`http://localhost:3000/products`)
   - ✅ Shows "240 products found"
   - ✅ All products have images
   - ✅ Pagination/scroll works

3. **Single Category** (`http://localhost:3000/products?category=engine-parts`)
   - ✅ Shows "20 products found"
   - ✅ All engine parts displayed
   - ✅ Images load correctly

4. **Product Detail** (Click any product)
   - ✅ Product details load
   - ✅ Image displays
   - ✅ Add to cart works
   - ✅ Price shows in EUR (€)

---

## Code Changes Made

### Files Updated:
1. ✅ `lib/db/products.ts` - Increased limits 50→500
2. ✅ `components/ProductCard.tsx` - Better image fallback
3. ✅ `supabase/seed-240-products.sql` - Updated image URLs
4. ✅ `next.config.js` - Already configured for Unsplash ✓

### Files Created:
1. ✅ `public/placeholder-product.svg` - Fallback image
2. ✅ `supabase/update-product-images.sql` - Image fix script
3. ✅ `supabase/fix-rls-policies.sql` - RLS fix script
4. ✅ `FIX_IMAGES_AND_PRODUCTS.md` - This guide

---

## Verification SQL (Optional)

Run in Supabase to verify everything:

```sql
-- Check total products
SELECT COUNT(*) as total_products FROM products;
-- Should return: 240

-- Check products per category
SELECT c.name, COUNT(p.id) as count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.name
ORDER BY c.name;
-- Should show 20 per category

-- Check images
SELECT COUNT(*) as total_images FROM product_images;
-- Should return: 240

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
-- rowsecurity should be 'false'
```

---

## Success Criteria ✅

When everything is working:
- [ ] No PostgreSQL errors in terminal
- [ ] 240 products visible on products page
- [ ] All product images load (Unsplash photos)
- [ ] All prices show in EUR (€)
- [ ] Cart system works
- [ ] Can view product details
- [ ] All 12 categories work

---

## Troubleshooting

### "Still seeing RLS error"
- Did you run the SQL in Supabase? (Not in terminal)
- Did you click "Run" in SQL Editor?
- Try browser refresh + clear cache

### "Images not loading"
- Check browser console (F12) for errors
- Verify internet connection (images from Unsplash)
- Check if Unsplash.com is accessible

### "Only 20 products showing"
- Did you restart `npm run dev` after code changes?
- Check terminal for compilation errors
- Hard refresh browser (Ctrl+Shift+R)

### "Products showing but no images"
- Run the UPDATE images SQL in Supabase
- Verify SQL returned "240 rows affected"
- Restart dev server

---

## Next Steps After Fix

1. ✅ Run admin user seeding script
2. ✅ Test complete checkout flow
3. ✅ Test admin product creation
4. ✅ Deploy to production (optional)

---

## Need Help?

If issues persist:
1. Check browser console (F12 → Console tab)
2. Check terminal for error messages
3. Verify all SQL commands succeeded in Supabase
4. Make sure dev server restarted after code changes
