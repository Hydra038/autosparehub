# SIGN-UP NOT INSERTING DATA - FIX

## 🎯 Problem

When users sign up, the account is created in `auth.users` (Supabase authentication), but the profile data is NOT being inserted into the `public.users` table.

## 🔍 Root Cause

The `users` table has **Row Level Security (RLS) enabled** but **no INSERT policy** exists to allow new users to create their own profile.

### Error Message (in console):
```
new row violates row-level security policy for table "users"
Code: 42501
```

## 🛠️ Solution

You need to add RLS policies to allow users to manage their own profiles.

### Step-by-Step Fix:

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql

2. **Copy and paste this SQL:**

```sql
-- Allow users to insert their own profile during sign-up
CREATE POLICY "Users can insert their own profile" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admins to read all users
CREATE POLICY "Admins can read all users" 
ON users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

3. **Click RUN**

4. **Test sign-up:**
   - Go to your sign-in page
   - Click "Create account"
   - Fill in the form and submit
   - Check Supabase dashboard → Authentication → Users
   - Check Supabase dashboard → Table Editor → users

## ✅ Expected Result

After applying the fix:
- New users can sign up successfully
- Their data appears in BOTH `auth.users` AND `public.users`
- Users can view/edit their own profile
- Admins can see all users
- No more RLS policy violations

## 🔐 Security Benefits

These policies ensure:
- ✅ Users can only insert their own profile (`auth.uid() = id`)
- ✅ Users can only see/edit their own data
- ✅ Admins can view all users for management
- ✅ No unauthorized access to other users' data

## 📝 What Each Policy Does

1. **INSERT policy**: Allows users to create their profile when signing up
2. **SELECT policy**: Allows users to read their own profile data
3. **UPDATE policy**: Allows users to update their own information
4. **Admin SELECT policy**: Allows admins to view all users in admin panel

## 🧪 Testing

After applying the fix, you can verify with:
```bash
node test-signup-simple.js
```

You should see:
```
✅ ANON INSERT succeeded
```

---

**Next Step:** Go to Supabase SQL Editor and run the SQL above! 🚀
