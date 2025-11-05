# FIX INFINITE RECURSION IN USERS TABLE RLS

## 🎯 Problem

Sign-up fails with error:
```
infinite recursion detected in policy for relation "users"
Code: 42P17
```

## 🔍 Root Cause

The RLS policies on the `users` table are referencing the `users` table itself in the policy conditions, creating an infinite loop. This typically happens with policies like:

```sql
-- BAD: This causes recursion
CREATE POLICY "Admins can read all users"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users  -- ❌ Querying users table inside users policy!
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## 🛠️ Solution

Use simple, direct checks against `auth.uid()` without querying the `users` table.

### Step-by-Step Fix:

### 1. Go to Supabase SQL Editor
https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

### 2. Copy and Run This SQL:

```sql
-- Step 1: Drop ALL existing policies to start fresh
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON users';
    END LOOP;
END $$;

-- Step 2: Create simple, non-recursive policies

-- Allow authenticated users to insert their own profile
CREATE POLICY "allow_insert_own_profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Allow users to read their own profile
CREATE POLICY "allow_read_own_profile"
ON users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "allow_update_own_profile"
ON users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow service role to do everything (for admin operations)
CREATE POLICY "allow_service_role_all"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify policies were created
SELECT policyname, cmd as command, roles
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

### 3. Click "RUN"

## ✅ What This Does

### For Sign-Up (INSERT):
- ✅ Allows authenticated users to insert a row where `id = auth.uid()`
- ✅ No recursion - directly checks the auth context
- ✅ Users can only create their own profile

### For Reading (SELECT):
- ✅ Users can read their own profile (`id = auth.uid()`)
- ✅ Service role can read all users (for admin panel)

### For Updates (UPDATE):
- ✅ Users can update their own profile
- ✅ Cannot update other users' data

## 🧪 Testing

After applying the fix, run:
```bash
node test-signup-simple.js
```

You should see:
```
✅ ANON INSERT succeeded
```

## 📝 Admin Access

For admin users to view all users in the admin panel, the queries use the **service role key** (bypasses RLS), not the anon key. This is already set up in your admin routes.

## 🚨 Important Notes

### Why No Admin Policy?

The admin panel uses the `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS entirely. This is the correct approach for admin operations.

If you need admin users to query via the regular API:
1. Create a separate `admin_roles` table
2. Check that table instead of `users` table to avoid recursion

### Security Benefits

These policies ensure:
- ✅ Users can only manage their own data
- ✅ No infinite loops or recursion
- ✅ Simple, fast policy evaluation
- ✅ Admin operations work via service role

---

**Next Step:** Run the SQL in Supabase SQL Editor, then test sign-up! 🚀
