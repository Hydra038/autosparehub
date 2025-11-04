# 📦 Sample Data Guide

## ✅ What's Included

I've created **comprehensive sample data** to help you test the platform immediately!

### Sample Data File Created:
📄 **`supabase/sample-data.sql`** - Complete test dataset including:

- ✅ **15 Products** across all categories
  - Brake pads, discs, filters, spark plugs
  - Timing belts, shock absorbers, batteries
  - LED headlights, wiper blades, radiators
  - Exhaust systems, refurbished parts
  
- ✅ **4 Suppliers** with UK addresses

- ✅ **200+ Vehicle Compatibility Records**
  - VW, Audi, BMW, Ford, Vauxhall
  - Toyota, Honda, Nissan, Mazda
  - Mercedes-Benz, Peugeot, Citroen, Renault

- ✅ **Inventory Stock Levels** for all products

- ✅ **4 Sample Users** (3 customers + 1 admin)

- ✅ **3 Sample Orders** (delivered, processing, pending)

---

## 🚀 Two Ways to Use This

### Option 1: Quick UI Preview (No Supabase Setup)
**Current Status**: ✅ Already running!

The app is now running with **mock credentials** at:
**http://localhost:3000**

**What you'll see:**
- ✅ All pages load correctly
- ✅ Beautiful UI and layout
- ✅ Navigation works
- ✅ Empty states: "No products found"
- ❌ No actual data from database

**Perfect for:**
- Checking the UI design
- Testing navigation
- Reviewing page layouts
- Demo to stakeholders

---

### Option 2: Full Working Platform (With Real Data)
**Setup time**: 5 minutes

Follow these steps to get a **fully functional e-commerce platform** with sample products:

#### Step 1: Create Supabase Project (2 minutes)
1. Go to https://supabase.com
2. Sign up (free account)
3. Click **"New Project"**
4. Name: `autospare-hub`
5. Database password: (create a strong one)
6. Region: Choose closest to you
7. Click **"Create Project"**
8. Wait ~2 minutes for setup

#### Step 2: Run Database Schema (1 minute)
1. In Supabase dashboard → **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/schema.sql` from your project
4. Copy ALL contents and paste
5. Click **"Run"** (or Ctrl+Enter)
6. Should see: "Success. No rows returned"

#### Step 3: Load Sample Data (1 minute)
1. Still in **SQL Editor** → **"New Query"**
2. Open `supabase/sample-data.sql` from your project
3. Copy ALL contents and paste
4. Click **"Run"**
5. You should see output like:
   ```
   Products Created: 15
   Inventory Records: 15
   Compatibility Records: 200+
   Suppliers: 4
   Orders: 3
   ```

#### Step 4: Create Storage Bucket (30 seconds)
1. In Supabase dashboard → **Storage**
2. Click **"Create Bucket"**
3. Name: `product-images`
4. Make it **Public** (toggle ON)
5. Click **"Create"**
6. Select bucket → **Policies** → **"New Policy"**
7. Template: **"Allow public read access"**
8. Save policy

#### Step 5: Get API Keys (30 seconds)
1. In Supabase → **Settings** (gear icon)
2. Click **"API"**
3. Copy these 3 values:
   - **Project URL**
   - **anon public** key (the long one)
   - **service_role** key (click "Reveal" first)

#### Step 6: Update Environment Variables (30 seconds)
1. Open `.env.local` in your project
2. Replace the mock values with your real ones:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```
3. Save the file

#### Step 7: Restart Dev Server (10 seconds)
1. In terminal, press `Ctrl+C`
2. Run: `npm run dev`
3. Open: http://localhost:3000

---

## 🎉 What You'll See After Setup

### Homepage
- **Hero section** with search
- **10 categories** with icons
- **8 featured products** with images and prices
- **Feature highlights**

### Product Listing (`/products`)
- All 15 products
- Search functionality
- Filters: category, make, model, year, price
- Sorting options

### Product Details (`/products/[id]`)
- Product information
- Image carousel (placeholder images)
- Stock status
- Vehicle compatibility table
- Add to cart button

### Admin Dashboard (`/admin`)
- Total products: 15
- Total orders: 3
- Revenue tracking
- Recent orders list

### Create Product (`/admin/products/new`)
- Full product form
- Image upload to Supabase Storage
- Inventory management

---

## 📋 Sample Products Included

| Product | SKU | Price | Category | Stock |
|---------|-----|-------|----------|-------|
| Front Brake Pads - Premium Ceramic | BP-FRONT-001 | £45.99 | Brakes | 150 |
| Rear Brake Discs Pair - Vented | BD-REAR-001 | £89.99 | Brakes | 80 |
| Engine Oil Filter - Standard | OF-STD-001 | £8.99 | Filters | 500 |
| Cabin Air Filter - HEPA Grade | CF-HEPA-001 | £15.99 | Air Filters | 300 |
| Spark Plugs Set of 4 - Iridium | SP-IRID-004 | £32.99 | Spark Plugs | 200 |
| Timing Belt Kit - Complete | TB-KIT-001 | £149.99 | Belts & Hoses | 60 |
| Front Shock Absorber Pair - Gas | SA-FRONT-001 | £79.99 | Suspension | 45 |
| LED Headlight Bulbs H7 - 6000K | LED-H7-6000K | £39.99 | Lighting | 180 |
| Car Battery 12V 70Ah - Heavy Duty | BAT-70AH-HD | £89.99 | Batteries | 100 |
| Wiper Blades Pair - All Season | WB-AS-PAIR | £18.99 | Wiper Blades | 250 |
| Radiator - Aluminium Core | RAD-ALU-001 | £129.99 | Cooling | 35 |
| Exhaust Back Box - Stainless Steel | EXH-BB-SS-001 | £159.99 | Exhaust | 25 |
| Alternator - Refurbished | ALT-REF-001 | £75.00 | Electrical | 20 |
| Starter Motor - Refurbished | STR-REF-001 | £69.99 | Electrical | 18 |

**Plus**:
- 200+ vehicle compatibility records
- 4 suppliers
- 3 sample orders
- 4 test users

---

## 🔧 Testing Scenarios

### Customer Journey
1. Visit homepage → See featured products
2. Search "brake" → See brake products
3. Filter by "Volkswagen Golf" → See compatible parts
4. Click product → See details and compatibility
5. Add to cart → View cart
6. Checkout → Fill form → Create order

### Admin Tasks
1. Visit `/admin` → See dashboard stats
2. Click "Add New Product" → Create new item
3. Upload product images
4. Set inventory levels
5. View recent orders

---

## 🆘 Troubleshooting

### "No products found" on homepage
- ✅ Check you ran `sample-data.sql` in Supabase
- ✅ Check some products have `is_featured = true`
- ✅ Check environment variables are correct
- ✅ Restart dev server after changing .env.local

### Products show but no images
- ✅ Create `product-images` storage bucket
- ✅ Make bucket public
- ✅ Add read access policy
- ✅ Upload images through admin panel

### "Invalid API key" error
- ✅ Check .env.local has real Supabase keys (not mock ones)
- ✅ No extra spaces in the keys
- ✅ Keys are from correct project
- ✅ Restart dev server

### Can't create products
- ✅ Check SUPABASE_SERVICE_ROLE_KEY is set
- ✅ Check storage bucket exists and is public
- ✅ Check RLS policies are enabled

---

## 📸 Adding Real Product Images

The sample data doesn't include actual images (just placeholders). To add images:

### Option 1: Through Admin Panel
1. Go to `/admin/products/new`
2. Fill product form
3. Click "Choose files" for images
4. Select product photos
5. Submit form

### Option 2: Direct Upload to Supabase
1. Supabase dashboard → **Storage** → `product-images`
2. Click **"Upload files"**
3. Upload images
4. Copy the public URL
5. Insert into `product_images` table via SQL

---

## 🎯 Next Steps

After loading sample data:

1. **Test the platform** - Try all features
2. **Add real products** - Use admin panel
3. **Upload images** - Make products look great
4. **Test checkout** - Ensure order flow works
5. **Customize branding** - Update colors, logos
6. **Deploy to Vercel** - See DEPLOYMENT.md

---

## 💡 Pro Tips

1. **Mark products as "Featured"** to show on homepage
2. **Add compatibility data** so customers can filter by vehicle
3. **Set realistic stock levels** to test low inventory warnings
4. **Create test orders** to see the order management system
5. **Use refurbished condition** for budget products

---

## 📚 Documentation Files

- **README.md** - Full project documentation
- **QUICKSTART.md** - Detailed 15-minute setup
- **DEPLOYMENT.md** - Deploy to production
- **SETUP_NOW.md** - Quick 5-minute guide
- **This file** - Sample data guide

---

## ✨ Summary

You now have:
- ✅ Running dev server with mock credentials
- ✅ Complete sample dataset ready to use
- ✅ 15 realistic products across all categories
- ✅ Full vehicle compatibility data
- ✅ Sample orders and customers
- ✅ Step-by-step setup instructions

**Choose your path:**
- 🎨 **Just want to see UI?** → Already running at http://localhost:3000
- 🚀 **Want full functionality?** → Follow Option 2 above (5 minutes)

Happy selling! 🎉
