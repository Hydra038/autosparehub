# 🔧 Fix Authorization Error

## Problem
You're seeing: **"Error: Failed to perform authorization check. Please try again later."**

This happens when Row Level Security (RLS) or permissions block your database queries.

---

## ✅ Quick Fix (3 Steps)

### **Step 1: Use the Correct Supabase Connection**

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click **SQL Editor** in the left sidebar
3. **IMPORTANT:** Make sure you're using **service_role** connection (not anon)
   - Look at the top of SQL Editor
   - If it says "anon key", switch to "service_role"

### **Step 2: Run the Fix Script**

1. Open the file: `supabase/fix-authorization-error.sql`
2. Copy **ALL** the SQL code
3. Paste it into Supabase SQL Editor
4. Click **RUN** (or press F5)

This will:
- ✅ Disable RLS on users table
- ✅ Grant necessary permissions
- ✅ Verify the table exists

### **Step 3: Verify It Worked**

Run this simple query:
```sql
SELECT COUNT(*) FROM public.users;
```

**Expected:** Should return a number (even if 0)  
**If it fails:** Continue to troubleshooting below

---

## 🔍 Troubleshooting

### Issue: "Permission denied for table users"

**Cause:** You're using the anon key instead of service_role key

**Fix:**
1. In Supabase SQL Editor, look for a dropdown at the top
2. Switch from "anon" to "service_role"
3. Re-run the query

### Issue: "Relation 'public.users' does not exist"

**Cause:** The users table was never created

**Fix:**
1. Run the schema creation SQL from `supabase/fix-authorization-error.sql`
2. Look for the section: "IF TABLE DOESN'T EXIST: Create it"
3. Uncomment and run that SQL

### Issue: "Type 'user_role' does not exist"

**Cause:** The enum type is missing

**Fix:**
```sql
CREATE TYPE user_role AS ENUM ('customer', 'admin');
```

---

## 📋 After Fixing

Once the authorization error is fixed:

1. **Re-run the admin verification:**
   ```sql
   -- Check if you can now query users
   SELECT * FROM public.users LIMIT 5;
   ```

2. **Create admin users:**
   - Go back to `supabase/verify-admin-users.sql`
   - Run it step by step
   - It should now work without errors

3. **Test your app:**
   ```powershell
   npm run dev
   ```
   - Try signing in
   - Check if authentication works

---

## 🔑 Using Service Role Key in Code

If you need to access auth.users or bypass RLS in your code:

1. Get your **Service Role Key**:
   - Supabase Dashboard → Settings → API
   - Copy "service_role" key (NOT anon key)
   - ⚠️ **Never expose this in client-side code!**

2. Create a server-only client:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
     {
       auth: {
         autoRefreshToken: false,
         persistSession: false
       }
     }
   )

   // Now you can query auth.users
   const { data: users } = await supabaseAdmin.auth.admin.listUsers()
   ```

---

## 🎯 Common Mistakes

❌ **Using anon key for admin operations**  
✅ Use service_role key in SQL Editor or server code

❌ **RLS enabled without policies**  
✅ Disable RLS for development: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

❌ **No permissions granted**  
✅ Grant permissions: `GRANT ALL ON users TO authenticated;`

❌ **Wrong table schema**  
✅ Use `public.users` not just `users`

---

## 📞 Still Not Working?

If you're still seeing the error:

1. **Check your environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hfkksqchjubxvxatzrae.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Restart your dev server:**
   ```powershell
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. **Check Supabase status:**
   - Is your project active?
   - Are there any service outages?

4. **Share the full error message:**
   - Copy the exact error from Supabase SQL Editor
   - Include which query is failing

---

## ✅ Success Checklist

After running the fix script, you should be able to:

- [ ] Query `SELECT * FROM public.users` without errors
- [ ] Query `SELECT * FROM auth.users` (with service_role key)
- [ ] Insert into public.users without permission errors
- [ ] Run verify-admin-users.sql successfully
- [ ] See admin users in the database
- [ ] Log in to your app

---

**Next Step:** Once this is fixed, go back to `verify-admin-users.sql` and run it step by step to create your admin users.
