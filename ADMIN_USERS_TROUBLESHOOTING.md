# 🔍 Troubleshooting: Admin Users Not Appearing

## Problem
Running queries on `public.users` shows no admin users (empty table).

## Root Causes & Solutions

### 🔴 Cause 1: Users Not Created in Supabase Auth

**Check:**
```sql
SELECT id, email FROM auth.users 
WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com');
```

**If returns 0 rows:** Users don't exist in Supabase Auth yet.

**Solution:** Create them in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** button (green, top right)
3. For each admin:
   ```
   Email: admin@autospare.com
   Password: Admin@2024!
   ✅ Auto Confirm User (IMPORTANT!)
   ```
4. Click **"Create User"**
5. Repeat for `manager@autospare.com` and `support@autospare.com`

---

### 🔴 Cause 2: Users Exist in auth.users But Not in public.users

**Check:**
```sql
-- Check auth.users
SELECT id, email FROM auth.users LIMIT 5;

-- Check public.users  
SELECT id, email, role FROM public.users LIMIT 5;
```

**If auth.users has data but public.users is empty:** The link is broken.

**Solution:** Run the insert SQL

```sql
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@autospare.com' THEN 'System Administrator'
    WHEN au.email = 'manager@autospare.com' THEN 'Store Manager'
    WHEN au.email = 'support@autospare.com' THEN 'Customer Support'
  END,
  'admin'::user_role
FROM auth.users au
WHERE au.email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com')
ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;
```

---

### 🔴 Cause 3: Foreign Key Constraint Blocking Insert

**Error Message:**
```
ERROR: insert or update on table "users" violates foreign key constraint
```

**Reason:** `public.users.id` references `auth.users.id`, but the auth user doesn't exist.

**Solution:** Create users in Dashboard first (see Cause 1), then run insert SQL.

---

### 🔴 Cause 4: RLS Policies Blocking Queries

**Check:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
```

**If rowsecurity = true:** RLS is enabled and might be blocking.

**Solution:** Disable RLS (for development)
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

Then try insert again.

---

### 🔴 Cause 5: Permission Denied

**Error Message:**
```
ERROR: permission denied for table users
```

**Reason:** You're not using a privileged connection.

**Solution:** Make sure you're running SQL in **Supabase SQL Editor** (not external tool).

---

## ✅ Step-by-Step Fix Process

### Run This Complete Script:

```sql
-- 1. Check if auth users exist
DO $$
DECLARE
  auth_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count
  FROM auth.users
  WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com');
  
  RAISE NOTICE '% admin users found in auth.users', auth_count;
  
  IF auth_count = 0 THEN
    RAISE NOTICE '❌ No admin users in auth.users! Create them in Dashboard first.';
  ELSIF auth_count < 3 THEN
    RAISE NOTICE '⚠️  Only % admin users found. Expected 3.', auth_count;
  ELSE
    RAISE NOTICE '✅ All 3 admin users found in auth.users';
  END IF;
END $$;

-- 2. Disable RLS to avoid permission issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3. Insert/update admin users
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@autospare.com' THEN 'System Administrator'
    WHEN au.email = 'manager@autospare.com' THEN 'Store Manager'
    WHEN au.email = 'support@autospare.com' THEN 'Customer Support'
  END,
  'admin'::user_role
FROM auth.users au
WHERE au.email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com')
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin'::user_role,
  full_name = EXCLUDED.full_name;

-- 4. Verify
SELECT 
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM public.users u
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;
```

---

## 🧪 Quick Test

After running the fix:

```sql
-- Should return 3 rows
SELECT COUNT(*) as admin_count 
FROM public.users 
WHERE role = 'admin';

-- Should show all 3 admins
SELECT email, role FROM public.users WHERE role = 'admin';
```

---

## 🎯 Expected Results

### ✅ Success State

**auth.users:**
```
id                                   | email
-------------------------------------|------------------------
a1b2c3d4-...                        | admin@autospare.com
e5f6g7h8-...                        | manager@autospare.com
i9j0k1l2-...                        | support@autospare.com
```

**public.users:**
```
email                | full_name              | role
---------------------|------------------------|-------
admin@autospare.com  | System Administrator   | admin
manager@autospare.com| Store Manager          | admin
support@autospare.com| Customer Support       | admin
```

---

## 🚨 Common Mistakes

1. ❌ **Forgot to check "Auto Confirm User"** in Dashboard
   - Users can't login if not confirmed
   - Fix: Authentication → Users → Click user → Confirm user

2. ❌ **Running SQL before creating auth users**
   - Must create in Dashboard FIRST
   - Then run SQL to set roles

3. ❌ **RLS enabled without proper policies**
   - Blocks queries even in SQL Editor
   - Fix: Disable RLS for development

4. ❌ **Typo in email address**
   - Make sure emails match exactly
   - Check for spaces, case sensitivity

5. ❌ **Using wrong SQL Editor**
   - Must use Supabase Dashboard SQL Editor
   - Not external tools like pgAdmin

---

## 📞 Still Not Working?

### Debug Checklist:

- [ ] Confirmed users exist in Dashboard (Authentication → Users)
- [ ] Users show green checkmark (confirmed)
- [ ] RLS is disabled on public.users table
- [ ] Ran insert SQL in Supabase SQL Editor
- [ ] SQL returned success message
- [ ] Refreshed the query results
- [ ] Restarted dev server (`npm run dev`)

### Get More Info:

```sql
-- See what's in auth.users
SELECT id, email, confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- See what's in public.users
SELECT id, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Check for any errors in recent queries
SELECT * FROM pg_stat_activity 
WHERE datname = current_database() 
AND state = 'idle in transaction (aborted)';
```

---

## ✅ Final Verification

Try logging in:
1. Go to `http://localhost:3000/sign-in`
2. Enter: `admin@autospare.com` / `Admin@2024!`
3. Should redirect to `/admin`

If login fails, check browser console (F12) for error messages.
