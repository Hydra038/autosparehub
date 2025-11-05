# FIX EMAIL CONFIRMATION REDIRECT TO VERCEL

## 🎯 Problem

When users click the confirmation email link, it redirects to `localhost` instead of your Vercel production URL.

## 🔍 Root Cause

Supabase uses the **Site URL** configuration to determine where to redirect users after email confirmation. By default, it's set to `http://localhost:3000` during development.

## 🛠️ Solution

You need to update the Supabase project settings to use your Vercel URL.

### Step-by-Step Fix:

### 1. **Find Your Vercel App URL**

Your Vercel URL is likely one of these formats:
- `https://autosparehub.vercel.app`
- `https://autosparehub-hydra038.vercel.app`
- Or your custom domain if you have one

To find it:
1. Go to https://vercel.com/dashboard
2. Find your `autosparehub` project
3. Copy the production URL

### 2. **Update Supabase Site URL**

1. Go to your Supabase dashboard:
   https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/auth/url-configuration

2. Under **URL Configuration**, find these settings:

   **Site URL:**
   - Change from: `http://localhost:3000`
   - Change to: `https://your-vercel-app.vercel.app` (your actual Vercel URL)

   **Redirect URLs:**
   Add these allowed URLs (click "+ Add URL" for each):
   ```
   https://your-vercel-app.vercel.app/**
   http://localhost:3000/**
   http://localhost:3001/**
   ```

3. Click **Save**

### 3. **Update Email Templates (Optional but Recommended)**

If you want to customize the confirmation email:

1. Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/auth/templates

2. Find **Confirm signup** template

3. Make sure the link uses `{{ .SiteURL }}` (it should by default):
   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your email</a>
   ```

This will automatically use your Site URL setting.

## ✅ Testing

After making these changes:

1. **Test with a new sign-up:**
   - Use a fresh email address
   - Sign up on your Vercel site
   - Check email
   - Click confirmation link
   - Should redirect to `https://your-vercel-app.vercel.app/dashboard` (not localhost)

2. **Development still works:**
   - Sign up from `localhost:3000`
   - Should still redirect to localhost (because URL matches)

## 🔐 Security Note

The **Redirect URLs** whitelist protects against phishing attacks. Only URLs you explicitly allow can be used for redirects after authentication.

## 📝 Additional Configuration

### For Multiple Environments:

If you have staging/preview deployments, add them too:
```
https://autosparehub-git-main-hydra038.vercel.app/**
https://autosparehub-*.vercel.app/**
http://localhost:3000/**
http://localhost:3001/**
```

### For Custom Domain:

If you have a custom domain like `autosparehub.com`:
```
https://autosparehub.com/**
https://www.autosparehub.com/**
```

## 🚨 Important Notes

1. **Already sent emails**: Existing confirmation emails will still point to localhost. Users need to request a new confirmation email after you fix the settings.

2. **Vercel Environment Variables**: Make sure your Vercel deployment has these environment variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Disable Email Confirmations (Alternative)**: If you want to skip email confirmation for testing:
   - Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/auth/providers
   - Scroll to **Email** provider
   - Toggle off "Confirm email"
   - ⚠️ Not recommended for production!

## 🎯 Quick Checklist

- [ ] Found Vercel production URL
- [ ] Updated Supabase Site URL to Vercel URL
- [ ] Added Vercel URL to Redirect URLs whitelist
- [ ] Kept localhost URLs for development
- [ ] Saved changes
- [ ] Tested with new sign-up on Vercel
- [ ] Verified email link redirects to Vercel (not localhost)

---

**Next Step:** Go to Supabase URL Configuration and update the Site URL! 🚀
