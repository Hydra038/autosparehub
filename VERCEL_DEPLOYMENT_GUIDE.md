# 🚀 Vercel Deployment Guide for AutoSpare Hub

## Environment Variables Setup

When deploying to Vercel, you need to add these environment variables in your Vercel project settings.

---

## Required Environment Variables

### 1. **NEXT_PUBLIC_SUPABASE_URL**
- **Type**: Plain Text (NOT a secret)
- **Value**: Your Supabase project URL
- **Example**: `https://hfkksqchjubxvxatzrae.supabase.co`
- **Where to find it**: 
  - Go to your Supabase project
  - Settings → API
  - Copy "Project URL"

### 2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Type**: Plain Text (NOT a secret)
- **Value**: Your Supabase anon/public key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find it**: 
  - Go to your Supabase project
  - Settings → API
  - Copy "anon public" key

### 3. **SUPABASE_SERVICE_ROLE_KEY**
- **Type**: Secret (encrypted)
- **Value**: Your Supabase service role key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find it**: 
  - Go to your Supabase project
  - Settings → API
  - Copy "service_role" key (keep this secret!)

---

## ⚠️ Important Notes

### Environment Variable Types in Vercel:

1. **NEXT_PUBLIC_*** variables:
   - These are **exposed to the browser**
   - Should be **Plain Text** (not encrypted)
   - Safe to be public (used in client-side code)
   - Example: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Server-only variables** (without NEXT_PUBLIC_ prefix):
   - These are **server-side only**
   - Should be marked as **Secret** in Vercel
   - Never exposed to the browser
   - Example: `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 Step-by-Step Deployment

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com
2. Open your project: **hfkksqchjubxvxatzrae**
3. Click **Settings** (gear icon)
4. Click **API** in the left sidebar
5. Copy these three values:
   - **Project URL** (for NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (for SUPABASE_SERVICE_ROLE_KEY)

### Step 2: Add Environment Variables in Vercel

1. Go to https://vercel.com
2. Open your **autosparehub** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add each variable:

#### Add NEXT_PUBLIC_SUPABASE_URL:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://hfkksqchjubxvxatzrae.supabase.co`
- **Environments**: Select all (Production, Preview, Development)
- **Type**: Plain Text (do NOT select "Sensitive")
- Click **Save**

#### Add NEXT_PUBLIC_SUPABASE_ANON_KEY:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your anon key (starts with `eyJhbG...`)
- **Environments**: Select all (Production, Preview, Development)
- **Type**: Plain Text (do NOT select "Sensitive")
- Click **Save**

#### Add SUPABASE_SERVICE_ROLE_KEY:
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your service role key (starts with `eyJhbG...`)
- **Environments**: Select all (Production, Preview, Development)
- **Type**: Secret (SELECT "Sensitive" checkbox)
- Click **Save**

### Step 3: Redeploy

After adding all environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache"
5. Click **Redeploy**

---

## 🔍 Troubleshooting

### Error: "Environment Variable references Secret which does not exist"

**Problem**: You're using Secret references instead of plain values.

**Solution**: 
1. Delete the existing environment variables in Vercel
2. Re-add them with the **actual values** (not references)
3. For `NEXT_PUBLIC_*` variables: Use **Plain Text**
4. For `SUPABASE_SERVICE_ROLE_KEY`: Use **Secret/Sensitive**

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Problem**: Environment variable not set or wrong name.

**Solution**:
1. Check spelling: `NEXT_PUBLIC_SUPABASE_URL` (exact case)
2. Make sure it's selected for all environments
3. Redeploy after adding

### Error: "Failed to perform authorization check"

**Problem**: Service role key not set or incorrect.

**Solution**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
2. Copy the correct service_role key from Supabase
3. Make sure it's marked as Secret
4. Redeploy

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] All 3 environment variables are added in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is Plain Text
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is Plain Text
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is Secret/Sensitive
- [ ] All variables are selected for all environments
- [ ] Values are correct (no typos)
- [ ] Redeployed after adding variables

---

## 📝 Example Values (Use Your Own!)

```env
# Client-side (Plain Text in Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://hfkksqchjubxvxatzrae.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzY0MjAsImV4cCI6MjA0NjM1MjQyMH0.xxx

# Server-side (Secret in Vercel)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc3NjQyMCwiZXhwIjoyMDQ2MzUyNDIwfQ.xxx
```

**⚠️ Replace the values above with your actual keys from Supabase!**

---

## 🎯 Quick Setup Commands

After deployment, you can verify environment variables are working:

1. **Check if URL is accessible**:
   ```
   Visit your-app.vercel.app
   ```

2. **Test sign-in**:
   ```
   Go to /sign-in
   Try logging in as admin@autospare.com
   ```

3. **Check admin panel**:
   ```
   Go to /admin
   Should redirect to sign-in if not logged in
   ```

---

## 🔐 Security Best Practices

### DO:
✅ Use Secret/Sensitive for `SUPABASE_SERVICE_ROLE_KEY`
✅ Keep service role key private
✅ Use Plain Text for `NEXT_PUBLIC_*` variables
✅ Enable Row Level Security (RLS) in Supabase
✅ Use middleware for route protection

### DON'T:
❌ Don't put service role key in `NEXT_PUBLIC_*` variables
❌ Don't commit `.env.local` to Git (already in .gitignore)
❌ Don't share service role key publicly
❌ Don't use Secret type for `NEXT_PUBLIC_*` variables

---

## 📱 After Successful Deployment

Once deployed, test these features:

1. **Homepage**: Visit your deployed URL
2. **Products**: Browse /products
3. **Authentication**: Sign in at /sign-in
4. **Admin Panel**: Access /admin (after login as admin)
5. **Order Management**: Test /admin/orders
6. **Logout**: Test logout button on admin pages

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Vercel Logs**:
   - Go to Deployments tab
   - Click on latest deployment
   - Check "Build Logs" and "Runtime Logs"

2. **Verify Environment Variables**:
   - Settings → Environment Variables
   - Make sure all 3 are there
   - Check spelling and values

3. **Test Locally First**:
   ```bash
   npm run build
   npm start
   ```

4. **Common Issues**:
   - Missing environment variables → Add them
   - Wrong variable type → Change Plain Text/Secret
   - Build errors → Check logs
   - Runtime errors → Check function logs

---

## ✨ Success Indicators

Your deployment is successful if:

- ✅ Build completes without errors
- ✅ Homepage loads correctly
- ✅ Products page shows items
- ✅ Sign-in page works
- ✅ Admin panel accessible after login
- ✅ No console errors in browser
- ✅ Database queries work
- ✅ Images load properly

---

**🎉 Your AutoSpare Hub is ready to go live!**

Production URL: https://autosparehub.vercel.app (or your custom domain)

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Setup](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Good luck with your deployment! 🚀**
