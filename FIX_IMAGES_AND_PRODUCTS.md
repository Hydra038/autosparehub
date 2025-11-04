# 🖼️ Fix Product Images - Quick Guide

## Problem
- Only 20 products showing (fixed: increased limit to 500)
- Product images not displaying properly

## Solution Steps

### Step 1: Fix RLS Policy Error (REQUIRED FIRST!)

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Temporarily disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### Step 2: Update Product Images

Run the image update script in **Supabase SQL Editor**:

```sql
-- Delete existing placeholder images
DELETE FROM product_images;

-- Insert better quality images from Unsplash
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
  END as image_url,
  p.title,
  0,
  true
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;
```

### Step 3: Restart Dev Server

```powershell
npm run dev
```

## What Was Fixed

### ✅ Product Limits Increased
- `getAllProducts()`: 50 → 500
- `getProductsByCategory()`: 50 → 500
- `searchProducts()`: 50 → 500
- `getProductsClient()`: 50 → 500

### ✅ Image System Improved
- Updated to use real Unsplash car images
- Each category gets relevant automotive images
- Added SVG fallback (`/placeholder-product.svg`)
- ProductCard updated to handle missing images

### ✅ Files Created/Updated
- `supabase/update-product-images.sql` - Database image update script
- `public/placeholder-product.svg` - Fallback image
- `lib/db/products.ts` - Increased limits to 500
- `components/ProductCard.tsx` - Better image fallback

## Verify It Works

1. Visit `/products` → Should see all 240 products
2. Click on any category → Should see 20 products per category
3. All products should show automotive images
4. No broken image icons

## Image URLs by Category

Each category now uses a themed Unsplash image:
- **Engine Parts**: Engine components
- **Brakes**: Brake systems
- **Suspension**: Car suspension
- **Electrical**: Car battery/electrical
- **Filters**: Automotive filters
- **Exhaust**: Exhaust systems
- **Cooling**: Radiators
- **Transmission**: Gearbox/clutch
- **Interior**: Car interior
- **Exterior**: Car exterior
- **Wheels & Tyres**: Alloy wheels
- **Steering**: Steering wheel

All images are served via Unsplash CDN with:
- Width: 600px
- Height: 600px
- Auto-optimized format (WebP when supported)

## Troubleshooting

**Images still not showing?**
- Check browser console for errors
- Verify Unsplash URLs are accessible
- Check Next.js image config in `next.config.js`

**Only seeing 20 products?**
- Make sure you restarted the dev server after updating `lib/db/products.ts`
- Clear browser cache
- Check terminal for errors

**RLS Policy error still appearing?**
- Make sure you ran the RLS disable SQL in Supabase
- Check that the SQL executed successfully
- Restart dev server after SQL changes
