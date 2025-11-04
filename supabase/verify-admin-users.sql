-- ============================================
-- VERIFY AND FIX ADMIN USERS
-- ============================================
-- Run these queries step by step to diagnose and fix

-- STEP 1: Check if users exist in auth.users
-- ========================================
SELECT 
  id, 
  email, 
  created_at,
  confirmed_at,
  email_confirmed_at
FROM auth.users 
WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com')
ORDER BY created_at DESC;

-- Expected: Should see 3 users
-- If you don't see them, you need to create them in Supabase Dashboard first
-- If confirmed_at is NULL, the users aren't confirmed

-- ============================================

-- STEP 2: Check if they exist in public.users
-- ========================================
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.users
WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com')
ORDER BY created_at DESC;

-- Expected: Should see 3 users with role = 'admin'
-- If empty, proceed to STEP 3

-- ============================================

-- STEP 3: Insert admin users into public.users
-- ========================================
-- This will create the profile records with admin role

INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@autospare.com' THEN 'System Administrator'
    WHEN au.email = 'manager@autospare.com' THEN 'Store Manager'
    WHEN au.email = 'support@autospare.com' THEN 'Customer Support'
    ELSE au.email
  END as full_name,
  'admin'::user_role as role
FROM auth.users au
WHERE au.email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Expected: "Success. 3 rows affected" (or "0 rows" if they already exist)

-- ============================================

-- STEP 4: Verify admin users are now in public.users
-- ========================================
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM public.users u
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;

-- Expected: Should now see 3 admin users

-- ============================================

-- STEP 5: Check ALL users in public.users
-- ========================================
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- This shows all users (including any customers who signed up)

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If STEP 1 shows no users:
-- → You need to create them in Supabase Dashboard first
-- → Go to: Authentication → Users → Add User
-- → Use the credentials from seed-admin-users.sql

-- If STEP 1 shows users but STEP 3 returns 0 rows:
-- → Check if there's a constraint error
-- → The INSERT should work with ON CONFLICT

-- If you get "violates foreign key constraint":
-- → The auth.users don't exist
-- → Create them in Dashboard first

-- If you get "permission denied":
-- → RLS policies might be blocking
-- → Run: ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- MANUAL FIX: If you have the user IDs
-- ============================================
-- If you know the user IDs from auth.users, you can insert directly:

-- Example (replace with actual IDs from STEP 1):
/*
INSERT INTO public.users (id, email, full_name, role) VALUES
('your-uuid-here', 'admin@autospare.com', 'System Administrator', 'admin'::user_role),
('your-uuid-here', 'manager@autospare.com', 'Store Manager', 'admin'::user_role),
('your-uuid-here', 'support@autospare.com', 'Customer Support', 'admin'::user_role)
ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;
*/
