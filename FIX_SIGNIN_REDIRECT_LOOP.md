# FIX: SIGN-IN REDIRECT LOOP

## 🎯 Problem

After signing in successfully, you're redirected back to the sign-in page instead of going to the dashboard.

## 🔍 Root Cause

The sign-in redirect loop happens because:

1. ✅ User signs in successfully (auth works)
2. ✅ User is redirected to `/dashboard`
3. ❌ Middleware tries to check user role from `public.users` table
4. ❌ RLS policy fails with **infinite recursion error (42P17)**
5. ❌ Middleware thinks user is not authenticated
6. ❌ Redirects back to `/sign-in?redirect=/dashboard`
7. 🔁 Loop continues...

## 🛠️ THE FIX

### **You MUST apply the RLS policy fix in Supabase:**

1. **Go to:** https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

2. **Run this SQL:**

```sql
-- Drop all problematic policies
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.users';
    END LOOP;
END $$;

-- Create simple, non-recursive policies
CREATE POLICY "allow_insert_own_profile"
ON public.users FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "allow_read_own_profile"
ON public.users FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "allow_update_own_profile"
ON public.users FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "allow_service_role_all"
ON public.users FOR ALL TO service_role
USING (true) WITH CHECK (true);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

3. **Click RUN ▶️**

## ✅ After Applying the Fix

1. **Clear browser cookies/cache** or use **incognito mode**
2. **Try signing in again**
3. **Should now redirect to dashboard successfully** ✅

## 🧪 Test the Fix

Run this to verify:
```bash
node test-auth-flow.js
```

Should show:
- ✅ Sign-in successful
- ✅ Session exists
- ✅ Profile found
- ✅ No recursion errors

## 📝 Why This Happens

The old RLS policies were checking the `users` table while evaluating policies ON the `users` table:

```sql
-- BAD: Causes infinite recursion ❌
CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users  -- ← Querying users inside users policy!
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

This creates an infinite loop:
- Policy needs to check users table
- To check users table, policy needs to run
- To run policy, needs to check users table
- (infinite loop...)

The fix uses `auth.uid()` directly without querying the table:

```sql
-- GOOD: No recursion ✅
USING (id = auth.uid())
```

## 🚨 Additional Improvements

I've also updated the sign-in page to show better error messages:
- ✅ If RLS error (42P17): "Database configuration error"
- ✅ If profile missing (PGRST116): "User profile not found"
- ✅ Prevents redirect loop by stopping at sign-in page

## 📋 Checklist

- [ ] Applied RLS policy fix SQL in Supabase
- [ ] Cleared browser cookies/cache
- [ ] Tested sign-in on localhost
- [ ] Tested sign-in on Vercel (autosparehub-nti3.vercel.app)
- [ ] Verified redirect to dashboard works
- [ ] Verified admin users can access /admin

---

**CRITICAL:** The RLS policy fix is MANDATORY for sign-in to work! Run the SQL now! 🚀
