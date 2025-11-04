# 👤 Create Admin Users - Step-by-Step Guide

## Why SQL Didn't Work

Supabase uses **Supabase Auth** for user authentication. Passwords are stored in the `auth.users` table (which we can't directly insert into). The `public.users` table only stores profile information.

## ✅ Correct Method: Dashboard + SQL

### Step 1: Create Users in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/projects
   - Select your project: `hfkksqchjubxvxatzrae`

2. **Navigate to Authentication**
   - Click **Authentication** in left sidebar
   - Click **Users** tab

3. **Add First Admin User**
   - Click **"Add User"** button (top right, green button)
   - Fill in the form:
     ```
     Email: admin@autospare.com
     Password: Admin@2024!
     ```
   - ✅ **Check "Auto Confirm User"** (important!)
   - Click **"Create User"**

4. **Add Second Admin User**
   - Click **"Add User"** again
   - Fill in:
     ```
     Email: manager@autospare.com
     Password: Manager@2024!
     ```
   - ✅ **Check "Auto Confirm User"**
   - Click **"Create User"**

5. **Add Third Admin User**
   - Click **"Add User"** again
   - Fill in:
     ```
     Email: support@autospare.com
     Password: Support@2024!
     ```
   - ✅ **Check "Auto Confirm User"**
   - Click **"Create User"**

### Step 2: Make Them Admins with SQL

Now that the users exist in `auth.users`, we need to add them to `public.users` with admin role.

1. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

2. **Run This SQL**:
   ```sql
   -- First, verify users were created
   SELECT id, email, created_at 
   FROM auth.users 
   WHERE email IN ('admin@autospare.com', 'manager@autospare.com', 'support@autospare.com');
   
   -- Now insert them into public.users with admin role
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
   
   -- Verify admin users
   SELECT 
     u.id,
     u.email,
     u.full_name,
     u.role,
     u.created_at
   FROM public.users u
   WHERE u.role = 'admin'
   ORDER BY u.created_at DESC;
   ```

3. **Click "Run"**
   - Should see: "Success. 3 rows affected"
   - Then see: Table showing 3 admin users

### Step 3: Test Login

1. Go to your website: `http://localhost:3000`
2. Click **"Sign In"**
3. Try logging in with:
   ```
   Email: admin@autospare.com
   Password: Admin@2024!
   ```
4. ✅ You should be logged in as admin!

---

## 📋 Admin Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@autospare.com | Admin@2024! | System Administrator |
| manager@autospare.com | Manager@2024! | Store Manager |
| support@autospare.com | Support@2024! | Customer Support |

⚠️ **IMPORTANT**: Change these passwords after first login!

---

## 🔍 Verification

### Check in Supabase Dashboard:

1. **Authentication → Users**
   - Should see 3 users listed
   - All should have green ✓ (confirmed)

2. **Table Editor → users table**
   - Should see 3 rows
   - `role` column should show `admin` for all 3

### Check in Your App:

1. Sign in as admin
2. Visit `/admin` or admin dashboard
3. Should have full admin access

---

## 🚀 Alternative: Sign Up Method

If you prefer, you can also:

1. Visit your website signup page
2. Sign up with admin email
3. Then run SQL to change role:
   ```sql
   UPDATE public.users 
   SET role = 'admin'::user_role 
   WHERE email = 'youremail@example.com';
   ```

---

## ❌ Troubleshooting

### "User already exists"
- User was already created
- Just run the second SQL (Step 2) to set admin role

### "Email not confirmed"
- Make sure you checked "Auto Confirm User" when creating
- Or go to Authentication → Users → Click user → Confirm user

### "Can't login"
- Verify user exists in Authentication → Users
- Verify RLS is disabled on users table
- Check browser console for errors

### "No admin access"
- Run Step 2 SQL again
- Verify `role` column shows `admin` in Table Editor → users

---

## 🔐 Security Notes

1. **Change Passwords**: After first login, change all default passwords
2. **Use Strong Passwords**: In production, use complex passwords
3. **Limit Admin Accounts**: Only create admin accounts for trusted users
4. **Enable 2FA**: Consider enabling two-factor authentication in production
5. **Monitor Admin Activity**: Keep logs of admin actions

---

## 📝 Add More Admins Later

To add more admin users in the future:

1. **Create user in Dashboard**:
   - Authentication → Users → Add User
   - Enter email and password
   - Check "Auto Confirm User"

2. **Set admin role with SQL**:
   ```sql
   INSERT INTO public.users (id, email, full_name, role)
   SELECT id, email, 'Full Name', 'admin'::user_role
   FROM auth.users
   WHERE email = 'newemail@example.com'
   ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;
   ```

---

## ✅ Success Checklist

- [ ] Created 3 users in Supabase Dashboard
- [ ] All users are "Auto Confirmed" (green checkmark)
- [ ] Ran SQL to set admin roles
- [ ] SQL returned "3 rows affected"
- [ ] Verified users appear in `public.users` table with `role = 'admin'`
- [ ] Successfully logged in as admin on website
- [ ] Admin dashboard is accessible
- [ ] Can access admin-only features

---

**Next Step**: After admin users work, proceed to test the complete application flow! 🎉
