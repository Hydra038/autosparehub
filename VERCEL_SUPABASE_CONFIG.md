# SUPABASE URL CONFIGURATION FOR autosparehub-nti3.vercel.app

## 🎯 Your Vercel Production URL
```
https://autosparehub-nti3.vercel.app
```

## 📋 Supabase Settings to Update

Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/auth/url-configuration

### 1. Site URL
Change to:
```
https://autosparehub-nti3.vercel.app
```

### 2. Redirect URLs
Add these URLs (click "+ Add URL" for each):
```
https://autosparehub-nti3.vercel.app/**
http://localhost:3000/**
http://localhost:3001/**
```

### 3. Click "Save"

## ✅ What This Fixes

- ✅ Email confirmation links will redirect to `https://autosparehub-nti3.vercel.app`
- ✅ Password reset emails will use production URL
- ✅ Magic link emails will work on production
- ✅ Development (localhost) still works for testing

## 🧪 Test After Configuration

1. **Sign up a new user** on https://autosparehub-nti3.vercel.app
2. **Check email** for confirmation link
3. **Click the link** - should redirect to `https://autosparehub-nti3.vercel.app/dashboard`
4. **Should NOT** redirect to localhost anymore ✅

## 📝 Additional Settings (Optional)

If you want to add wildcard for all your Vercel preview deployments:
```
https://autosparehub-nti3-*.vercel.app/**
https://autosparehub-*.vercel.app/**
```

## 🔐 Environment Variables on Vercel

Make sure your Vercel project has these environment variables set:

1. Go to: https://vercel.com/Hydra038/autosparehub/settings/environment-variables

2. Add/verify these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://hfkksqchjubxvxatzrae.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key from .env.local)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key from .env.local)

3. Redeploy after adding variables (if needed)

---

**Next Steps:**
1. ✅ Update Supabase URL Configuration (link above)
2. ✅ Save changes
3. ✅ Test with new sign-up on production
4. ✅ Verify email links work correctly
