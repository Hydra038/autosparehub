# Deployment Guide - Autospare Hub

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

- [x] Create Supabase project
- [x] Run `supabase/schema.sql` in SQL Editor
- [x] Create `product-images` storage bucket (public)
- [x] Note down project URL and keys
- [ ] Set up authentication providers (optional)
- [ ] Configure email templates (optional)

### 2. Environment Variables

Required environment variables for production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Currency
CURRENCY_CODE=GBP

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://autosparehub.vercel.app
NEXT_PUBLIC_SITE_NAME=Autospare Hub

# Payment (Optional - for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 3. Vercel Deployment Steps

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/autospare-hub.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Vercel auto-detects Next.js framework

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Apply to: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

### 4. Post-Deployment Tasks

1. **Test the deployment**
   - Browse products
   - Add items to cart
   - Test checkout flow (demo mode)
   - Verify image uploads work

2. **Create admin user**
   ```sql
   -- Run in Supabase SQL Editor
   -- Replace with your email
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-admin@email.com';
   ```

3. **Add sample products**
   - Login as admin
   - Navigate to `/admin/products/new`
   - Add products with images

4. **Configure custom domain (optional)**
   - Go to Vercel project settings
   - Add custom domain
   - Update DNS records

## 🔒 Security Checklist

- [ ] Service role key is only in Vercel environment (not in code)
- [ ] RLS policies are enabled on all tables
- [ ] Storage bucket policies are set correctly
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] API routes validate input properly

## 🧪 Testing in Production

After deployment, test these workflows:

1. **Customer Flow**
   - Search for products
   - Filter by category, make, model
   - View product details
   - Add to cart
   - Complete checkout
   - Receive order confirmation

2. **Admin Flow**
   - Login as admin
   - Create new product
   - Upload images
   - Manage inventory
   - View orders
   - Update order status

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in Vercel dashboard
- Track page views and performance

### Supabase Monitoring
- Monitor database queries in Supabase dashboard
- Check storage usage
- Review auth logs

## 🚨 Troubleshooting

### Build Fails
```bash
# Locally test the build
npm run build

# Check for TypeScript errors
npm run type-check
```

### Images Not Loading
- Verify storage bucket is public
- Check image URLs in database
- Ensure bucket policies allow public read

### Orders Not Creating
- Check Supabase service role key
- Verify RLS policies
- Check browser console for errors

### Authentication Issues
- Verify Supabase keys are correct
- Check auth provider settings
- Review RLS policies on users table

## 🔄 CI/CD Pipeline

Vercel automatically:
- Builds on every push to main
- Creates preview deployments for PRs
- Runs build checks before deployment

To add custom checks:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

## 📈 Scaling Considerations

As your store grows:

1. **Database**
   - Upgrade Supabase plan for more connections
   - Add database indexes for slow queries
   - Consider read replicas

2. **Storage**
   - Use CDN for images (Vercel Edge)
   - Optimize image sizes
   - Implement lazy loading

3. **Caching**
   - Enable Next.js ISR for product pages
   - Use Vercel Edge caching
   - Implement Redis for sessions

4. **Search**
   - Consider Algolia for advanced search
   - Or implement Elasticsearch

## 🎯 Next Steps

After successful deployment:

1. **Marketing**
   - Add SEO metadata
   - Set up Google Analytics
   - Create sitemap.xml

2. **Features**
   - Implement real payment processing
   - Add customer reviews
   - Create wishlist functionality
   - Add email notifications

3. **Operations**
   - Set up backup strategy
   - Create admin training documentation
   - Establish support workflow

---

**Need help?** Check the [README.md](README.md) or open an issue on GitHub.
