# VERCEL DEPLOYMENT CHECKLIST

## 🎯 Your Vercel App
**URL:** https://autosparehub-nti3.vercel.app

## ✅ Required Actions

### 1. Set Environment Variables on Vercel

Go to: https://vercel.com/Hydra038/autosparehub/settings/environment-variables

**Add these variables** (copy from your .env.local file):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hfkksqchjubxvxatzrae.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjExNjcsImV4cCI6MjA0NjI5NzE2N30.oxSUUrzKiVWzeMFBE9gNBsjdffW-w9zrj5RH1g3YgLs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDcyMTE2NywiZXhwIjoyMDQ2Mjk3MTY3fQ.kpIAxDRyShSQ3nZFstfZBCFkWoLnBYoYlmp9rhRnOOg

# Database (optional, for direct connections)
DATABASE_URL=postgresql://postgres:Derq@038!@db.hfkksqchjubxvxatzrae.supabase.co:5432/postgres
```

**For each variable:**
1. Click "Add Variable"
2. Enter Name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Enter Value
4. Check ☑️ Production, ☑️ Preview, ☑️ Development
5. Click "Save"

### 2. Redeploy

After adding all environment variables:

**Option A - Via Vercel Dashboard:**
1. Go to: https://vercel.com/Hydra038/autosparehub
2. Click "Deployments" tab
3. Find the latest deployment
4. Click "..." menu
5. Click "Redeploy"

**Option B - Via Git Push:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 3. Check Supabase RLS Policies

Make sure you ran the RLS fix SQL:
```sql
-- Drop all policies and recreate without recursion
-- (from fix-rls-final.sql)
```

### 4. Verify Supabase Site URL

Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/auth/url-configuration

**Site URL should be:**
```
https://autosparehub-nti3.vercel.app
```

**Redirect URLs should include:**
```
https://autosparehub-nti3.vercel.app/**
http://localhost:3000/**
http://localhost:3001/**
```

## 🔍 Debugging Steps

### 1. Check Runtime Logs

1. Go to: https://vercel.com/Hydra038/autosparehub
2. Click latest deployment
3. Click "Runtime Logs" or "Build Logs"
4. Look for actual error messages

### 2. Test Local Production Build

```bash
npm run build
npm start
```

If it fails locally, you'll see the real error.

### 3. Test Specific Pages

Try accessing these URLs and note which ones fail:
- https://autosparehub-nti3.vercel.app/ 
- https://autosparehub-nti3.vercel.app/products
- https://autosparehub-nti3.vercel.app/sign-in
- https://autosparehub-nti3.vercel.app/admin (requires sign-in)

## 🚨 Common Error Causes

### Error: "Invalid Supabase URL"
→ Environment variables not set on Vercel

### Error: "new row violates row-level security policy"
→ RLS policies need to be fixed in Supabase

### Error: "relation does not exist"
→ Database migration needed or wrong database

### Error: "fetch failed"
→ Network/CORS issue or wrong Supabase URL

## 📝 After Fixing

1. Clear browser cache (Ctrl+Shift+R)
2. Test sign-up flow
3. Test product browsing
4. Test cart and checkout
5. Test admin panel

---

**Next Step:** Check your Vercel environment variables first, then redeploy! 🚀
