# URGENT FIX: Error 42P17 - Infinite Recursion in RLS Policy

## 🎯 The Error
```
Error: {code: "42P17", details: Null, hint: ..., message: ...}
```

**This means:** The RLS policies on the `users` table are causing infinite recursion.

## 🛠️ IMMEDIATE FIX

### Go to Supabase SQL Editor NOW:
https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

### Copy and paste this ENTIRE SQL block:

```sql
-- STEP 1: Drop ALL existing policies on users table
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

-- STEP 2: Create simple, non-recursive policies

-- Allow authenticated users to insert their own profile
CREATE POLICY "allow_insert_own_profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Allow users to read their own profile
CREATE POLICY "allow_read_own_profile"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "allow_update_own_profile"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow service role full access (for admin operations)
CREATE POLICY "allow_service_role_all"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- STEP 3: Make sure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 4: Verify policies (should show 4 policies)
SELECT 
    tablename,
    policyname,
    cmd as operation,
    roles
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY policyname;
```

### Click "RUN" ▶️

## ✅ Expected Result

You should see a table with 4 policies:
1. `allow_insert_own_profile` - INSERT - authenticated
2. `allow_read_own_profile` - SELECT - authenticated
3. `allow_update_own_profile` - UPDATE - authenticated
4. `allow_service_role_all` - ALL - service_role

## 🧪 Test After Applying

1. **Refresh your Vercel app:** https://autosparehub-nti3.vercel.app
2. **The error should be gone**
3. **Try signing up** - should work now

## 🚨 Why This Happened

Your old policies were checking the `users` table INSIDE a policy on the `users` table:

```sql
-- BAD: This causes recursion ❌
USING (
  EXISTS (
    SELECT 1 FROM users  -- Querying users while evaluating users policy!
    WHERE id = auth.uid() AND role = 'admin'
  )
)
```

The new policies use `auth.uid()` DIRECTLY without querying the table:

```sql
-- GOOD: No recursion ✅
USING (id = auth.uid())
```

## 📝 After This Fix

- ✅ Sign-up will work (can insert profile)
- ✅ Users can read their own data
- ✅ Users can update their own data
- ✅ Admin panel works (uses service role)
- ✅ No more infinite recursion errors

---

**DO THIS NOW:** Run the SQL in Supabase, then refresh your Vercel app! 🚀
