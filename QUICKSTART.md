# Quick Start Guide - Autospare Hub 🚀

Get your car parts e-commerce store running in 15 minutes!

## ⚡ Fast Setup (15 minutes)

### Step 1: Install Dependencies (2 min)
```powershell
# Navigate to project folder
cd C:\Users\wisem\OneDrive\Desktop\carparts

# Install all dependencies
npm install
```

### Step 2: Setup Supabase Database (5 min)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name: "Autospare Hub"
   - Choose a region close to your users
   - Set a strong database password
   - Click "Create new project" (wait ~2 minutes)

2. **Run Database Schema**
   - Click "SQL Editor" in left sidebar
   - Click "New query"
   - Open `supabase/schema.sql` from your project
   - Copy ALL contents and paste into SQL Editor
   - Click "Run" (green play button)
   - Wait for "Success" message

3. **Setup Image Storage**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"
   - Name: `product-images`
   - Set "Public bucket" to ON
   - Click "Create bucket"
   - Click on bucket → "Policies" tab → "New Policy"
   - Select "Allow public read access"
   - Click "Review" → "Save policy"

### Step 3: Get Your API Keys (2 min)

1. In Supabase dashboard, click "Settings" (gear icon) → "API"
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOi...`)
   - **service_role** key (starts with `eyJhbGciOi...` - keep this secret!)

### Step 4: Configure Environment (1 min)

1. In your project folder, copy `.env.example` to `.env.local`:
   ```powershell
   copy .env.example .env.local
   ```

2. Open `.env.local` in any text editor and fill in:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   CURRENCY_CODE=GBP
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Autospare Hub
   ```

### Step 5: Start Development Server (1 min)
```powershell
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

---

## 🎯 First Steps After Installation

### 1. Create Your Admin User (2 min)

1. Go to http://localhost:3000
2. Click "Login" in top right
3. Sign up with your email (any email works locally)
4. Go back to Supabase dashboard
5. Click "Authentication" → "Users"
6. Copy your user's UUID
7. Click "SQL Editor" → "New query"
8. Run this SQL (replace with your UUID):
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE id = 'your-user-uuid-here';
   ```

### 2. Add Your First Product (5 min)

1. Go to http://localhost:3000/admin
2. Click "+ Add Product"
3. Fill in:
   - **SKU**: `BRK-001` (or any unique code)
   - **Title**: `Front Brake Pads - Toyota Corolla`
   - **Description**: `High-quality ceramic brake pads`
   - **Price**: `45.99`
   - **Condition**: `New`
   - **Quantity**: `50`
4. Upload 1-3 product images
5. Check "Active" and "Featured Product"
6. Click "Create Product"

### 3. Test Customer Flow (3 min)

1. Open homepage (http://localhost:3000)
2. Search for your product
3. Click on product card → View details
4. Click "Add to Cart"
5. Click cart icon (top right)
6. Click "Proceed to Checkout"
7. Fill in shipping details
8. Click "Place Order"
9. You'll see order confirmation!

---

## 📦 Sample Data (Optional)

Want to populate with sample data quickly?

```sql
-- Run in Supabase SQL Editor to add 10 sample products

INSERT INTO products (sku, title, description, price_gbp, condition, is_active, is_featured)
VALUES
  ('BRK-001', 'Front Brake Pads Set', 'High-performance ceramic brake pads', 45.99, 'new', true, true),
  ('FLT-001', 'Engine Oil Filter', 'Premium oil filter for all makes', 12.99, 'new', true, false),
  ('SPK-001', 'Spark Plug Set (4pc)', 'Long-lasting iridium spark plugs', 28.50, 'new', true, false),
  ('WPR-001', 'Windscreen Wiper Blades', 'All-season wiper blade pair', 18.99, 'new', true, false),
  ('BTY-001', 'Car Battery 12V', 'Heavy-duty 70Ah battery', 89.99, 'refurbished', true, true),
  ('TYR-001', 'All-Season Tyre', 'Premium 205/55 R16 tyre', 75.00, 'new', true, false),
  ('EXH-001', 'Exhaust Silencer', 'Universal fit exhaust silencer', 125.00, 'new', true, false),
  ('HLT-001', 'Headlight Assembly', 'Left side headlight unit', 95.50, 'new', true, false),
  ('ALT-001', 'Alternator 90A', 'Rebuilt alternator unit', 145.00, 'refurbished', true, false),
  ('STR-001', 'Steering Wheel Cover', 'Premium leather steering cover', 22.99, 'new', true, false);

-- Add inventory for all products
INSERT INTO inventory (product_id, quantity)
SELECT id, 50 FROM products;
```

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check `.env.local` has correct URLs and keys
- ✅ Restart dev server: `Ctrl+C` then `npm run dev`

### "Images not uploading"
- ✅ Verify `product-images` bucket exists
- ✅ Check bucket is set to "Public"
- ✅ Add public read policy

### "Orders fail to create"
- ✅ Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- ✅ Verify SQL schema ran successfully
- ✅ Check browser console for errors

### TypeScript Errors
```powershell
# Install dependencies again
npm install

# Check for issues
npm run type-check
```

---

## 🚀 Deploy to Production

Ready to go live? See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.

**Quick Deploy to Vercel (10 min)**:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## 📚 Next Steps

- [ ] Read full [README.md](README.md)
- [ ] Customize Tailwind theme in `tailwind.config.js`
- [ ] Add more categories via Supabase dashboard
- [ ] Set up vehicle compatibility for products
- [ ] Configure Stripe/PayPal for real payments
- [ ] Add email notifications
- [ ] Create product collections/bundles

---

## 💡 Tips

- **Admin dashboard**: http://localhost:3000/admin
- **View all products**: http://localhost:3000/products
- **Supabase dashboard**: https://supabase.com/dashboard
- **TypeScript strict mode**: Already enabled!

---

## 🆘 Need Help?

- 📖 Check [README.md](README.md) for detailed documentation
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- 🐛 Open an issue on GitHub
- 💬 Check Supabase docs: https://supabase.com/docs

---

**You're all set! Happy selling! 🎉**
