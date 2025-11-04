-- ============================================
-- ADD ADMIN USERS - MANUAL SIGNUP METHOD
-- ============================================
-- Supabase Auth handles passwords, so we can't create users with SQL directly.
-- Instead, you need to create admin users through the Supabase Dashboard.
--
-- ⚠️ FOLLOW THESE STEPS:
-- ============================================

-- OPTION 1: Create via Supabase Dashboard (RECOMMENDED)
-- ========================================
-- 1. Go to: Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" (top right)
-- 3. Enter:
--    - Email: admin@autospare.com
--    - Password: Admin@2024!
--    - Auto Confirm User: YES ✓
-- 4. Click "Create User"
-- 5. Repeat for:
--    - manager@autospare.com / Manager@2024!
--    - support@autospare.com / Support@2024!

-- STEP 2: Update user roles to admin (RUN THIS SQL)
-- ========================================
-- After creating users in Dashboard, run this to make them admins:

-- First, let's see the newly created users
SELECT id, email FROM auth.users 
WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com');

-- Now insert/update them in public.users table with admin role
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

-- Verify admin users were created
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM public.users u
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;

-- ============================================
-- OPTION 2: Create via API (Advanced)
-- ============================================
-- If you prefer programmatic creation, use the Supabase Admin API
-- from your backend with the service_role key (NEVER expose this key!)

-- ============================================
-- DEFAULT CREDENTIALS (After manual creation):
-- ============================================
-- Email: admin@autospare.com | Password: Admin@2024!
-- Email: manager@autospare.com | Password: Manager@2024!
-- Email: support@autospare.com | Password: Support@2024!
--
-- ⚠️ IMPORTANT: Change these passwords after first login!
-- ============================================
