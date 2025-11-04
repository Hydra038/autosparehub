# 🚀 Supabase Database Setup Guide

## Current Status
✅ Database connection string provided
✅ Database schema file exists (`supabase/schema.sql`)
⏳ Need to configure API keys

## Step 1: Get Your Supabase API Keys

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `hfkksqchjubxvxatzrae`
3. Go to **Settings** → **API**
4. Copy these keys:
   - **Project URL**: `https://hfkksqchjubxvxatzrae.supabase.co`
   - **anon/public key**: (looks like `eyJhbGci...` ~400 characters)
   - **service_role key**: (looks like `eyJhbGci...` ~400 characters)

## Step 2: Update Environment Variables

Open `.env.local` and replace with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hfkksqchjubxvxatzrae.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_your_anon_key_here>
SUPABASE_SERVICE_ROLE_KEY=<paste_your_service_role_key_here>

# Database Direct Connection
DATABASE_URL=postgresql://postgres:Derq@038!@db.hfkksqchjubxvxatzrae.supabase.co:5432/postgres

# Currency
CURRENCY_CODE=EUR

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Autospare Hub
```

## Step 3: Run Database Schema

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql
2. Click **New Query**
3. Copy entire contents of `supabase/schema.sql`
4. Paste into SQL Editor
5. Click **Run** (bottom right)
6. Verify success ✅

## Step 4: Add Sample Data (Optional)

If `supabase/sample-data.sql` exists:
1. Open it in SQL Editor
2. Run the script
3. This will populate categories and sample products

## Step 5: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Step 6: Verify Connection

1. Visit http://localhost:3000
2. Products should load from database (not mock data)
3. Check browser console for any errors

## What Will Change

### Before (Mock Data):
- ❌ Products stored in `lib/mockData.ts`
- ❌ Orders saved to localStorage
- ❌ No real user authentication
- ❌ No admin functionality

### After (Real Database):
- ✅ Products from Supabase database
- ✅ Orders saved to database
- ✅ Real Supabase authentication
- ✅ Admin can manage products/orders
- ✅ Data persists across sessions

## Database Tables Created

1. **categories** - Product categories (Engine Parts, Brakes, etc.)
2. **products** - All car parts with pricing, stock, images
3. **users** - Customer profiles (extends auth.users)
4. **orders** - Order records with status tracking
5. **order_items** - Individual items in each order
6. **payment_methods** - Admin-managed payment options

## Security (Row Level Security)

- ✅ Public can view products and categories
- ✅ Users can only view/edit their own orders
- ✅ Authentication required for checkout
- ✅ Admin functions protected by service role key

## Next Steps After Setup

1. **Create Admin User**
   - Sign up through the app
   - In Supabase Dashboard → Authentication → Users
   - Find your user, click edit
   - Change role to 'admin'

2. **Add Products**
   - Create `/admin` routes for product management
   - Or use Supabase Table Editor to add products manually

3. **Test Checkout Flow**
   - Add items to cart
   - Complete checkout
   - Verify order in database

## Troubleshooting

### Products Not Loading
- Check browser console for errors
- Verify API keys are correct
- Ensure schema.sql ran successfully
- Check Supabase Dashboard → Logs

### Can't Sign In
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Check email confirmation settings in Supabase
- Go to Authentication → Email Templates

### 401 Unauthorized Errors
- Double-check all three keys in `.env.local`
- Restart dev server after changing env vars
- Keys are case-sensitive

## Security Warning ⚠️

**IMPORTANT**: Your database password `Derq@038!` is now publicly visible in this conversation. Please:

1. Go to Supabase Dashboard → Settings → Database
2. Click **Reset Database Password**
3. Update `DATABASE_URL` in `.env.local` with new password
4. Add `.env.local` to `.gitignore` (should already be there)
5. Never commit credentials to git

## Support

If you encounter issues:
1. Check Supabase Logs Dashboard
2. Check browser developer console
3. Verify all environment variables
4. Ensure schema ran without errors

---

Ready to proceed? Share your anon and service_role keys and I'll help configure everything!
