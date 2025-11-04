# 🔐 Role-Based Authentication System

## Overview

The application now has **complete role-based authentication** using Supabase Auth with automatic redirects based on user role.

---

## 🎯 How It Works

### User Roles
- **`customer`** - Regular users (default)
- **`admin`** - Administrative users

### Automatic Redirects on Login

| User Role | Redirect Destination |
|-----------|---------------------|
| **Admin** | `/admin` (Admin Dashboard) |
| **Customer** | `/dashboard` (User Dashboard) |
| **With ?redirect=** | Custom redirect URL |

---

## 📋 Flow Diagram

```
User visits /sign-in
       ↓
Enters credentials
       ↓
Supabase Auth validates
       ↓
Check user role in public.users
       ↓
Role = 'admin' ? → Redirect to /admin
Role = 'customer' ? → Redirect to /dashboard
Has ?redirect param ? → Redirect to that URL
```

---

## 🛡️ Protected Routes

### Middleware Protection (`middleware.ts`)

| Route | Protection | Allowed Users |
|-------|-----------|---------------|
| `/admin/*` | ✅ Protected | Admins only |
| `/dashboard/*` | ✅ Protected | Authenticated users |
| `/checkout` | ✅ Protected | Authenticated users |
| `/my-orders/*` | ✅ Protected | Authenticated users |
| All other routes | ❌ Public | Everyone |

**What happens if unauthorized:**
- Not logged in → Redirect to `/sign-in?redirect=/protected-page`
- Logged in as customer trying to access `/admin` → Redirect to `/` (home)

---

## 🔑 Admin User Setup

### Create Admin Users (2 Steps)

**Step 1: Create in Supabase Dashboard**
1. Go to: **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `admin@autospare.com`
   - Password: `Admin@2024!`
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create User"**

**Step 2: Set Admin Role (SQL)**
```sql
-- Run in Supabase SQL Editor
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  'System Administrator',
  'admin'::user_role
FROM auth.users au
WHERE au.email = 'admin@autospare.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;
```

### Default Admin Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@autospare.com | Admin@2024! | System Administrator |
| manager@autospare.com | Manager@2024! | Store Manager |
| support@autospare.com | Support@2024! | Customer Support |

---

## 💻 Code Examples

### Server-Side: Check if user is admin

```typescript
import { getCurrentUser, isAdmin } from '@/lib/auth'

// In a server component or API route
export default async function AdminPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (!(await isAdmin())) {
    redirect('/')
  }
  
  return <AdminDashboard user={user} />
}
```

### Client-Side: Check user role

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserClient } from '@/lib/auth'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUserClient()
      setUser(userData)
    }
    loadUser()
  }, [])
  
  return (
    <div>
      <h1>Welcome, {user?.full_name}!</h1>
      <p>Role: {user?.role}</p>
      {user?.role === 'admin' && (
        <Link href="/admin">Go to Admin Dashboard</Link>
      )}
    </div>
  )
}
```

### Sign Out

```typescript
import { signOut } from '@/lib/auth'

async function handleSignOut() {
  await signOut()
  router.push('/')
}
```

---

## 🧪 Testing the System

### Test Customer Login
1. Visit `/sign-in`
2. Click "Sign Up"
3. Create account: `customer@test.com` / `password123`
4. **Expected:** Redirect to `/dashboard`

### Test Admin Login
1. Visit `/sign-in`
2. Enter: `admin@autospare.com` / `Admin@2024!`
3. **Expected:** Redirect to `/admin`

### Test Protected Routes
1. While logged out, visit `/admin`
2. **Expected:** Redirect to `/sign-in?redirect=/admin`
3. Log in as customer
4. **Expected:** Redirect to `/` (not authorized)
5. Log in as admin
6. **Expected:** Access granted to `/admin`

---

## 📁 Files Created/Modified

### New Files:
- ✅ `middleware.ts` - Route protection
- ✅ `lib/auth.ts` - Auth helper functions
- ✅ `CREATE_ADMIN_USERS_GUIDE.md` - Admin setup guide
- ✅ `ROLE_BASED_AUTH.md` - This file

### Modified Files:
- ✅ `app/sign-in/page.tsx` - Real Supabase auth + role-based redirects
- ✅ `supabase/seed-admin-users.sql` - Updated instructions

---

## 🔧 Configuration

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema

```sql
-- public.users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  -- ... other fields
);

-- user_role enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');
```

---

## 🚀 Advanced Features

### Custom Redirect After Login

```typescript
// Redirect to specific page after login
<Link href="/sign-in?redirect=/checkout">
  Sign in to checkout
</Link>
```

### Check Role in API Route

```typescript
// app/api/admin/products/route.ts
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  
  if (user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }
  
  // Admin-only logic here
  return NextResponse.json({ success: true })
}
```

### Conditional Rendering Based on Role

```typescript
import { getCurrentUser } from '@/lib/auth'

export default async function Header() {
  const user = await getCurrentUser()
  
  return (
    <header>
      {user && (
        <>
          <Link href="/dashboard">Dashboard</Link>
          {user.role === 'admin' && (
            <Link href="/admin">Admin Panel</Link>
          )}
        </>
      )}
    </header>
  )
}
```

---

## 🐛 Troubleshooting

### "User created but can't login"
- **Solution:** Make sure you checked "Auto Confirm User" in Supabase Dashboard
- Or manually confirm: Authentication → Users → Click user → Confirm user

### "Login works but redirects to wrong page"
- **Solution:** Check `public.users` table, verify `role` column is set correctly
- Run: `SELECT id, email, role FROM public.users WHERE email = 'your@email.com';`

### "Admin can't access /admin"
- **Solution:** 
  1. Verify RLS is disabled on users table (or policies allow read)
  2. Check role is 'admin' (not 'Admin' or 'administrator')
  3. Clear browser cookies and log in again

### "Middleware not protecting routes"
- **Solution:**
  1. Check `middleware.ts` exists in root directory
  2. Restart dev server (`npm run dev`)
  3. Clear Next.js cache: Delete `.next` folder

---

## ✅ Complete Setup Checklist

- [ ] Run RLS fix SQL (disable RLS on users table)
- [ ] Create admin users in Supabase Dashboard
- [ ] Run SQL to set admin roles
- [ ] Test customer signup flow
- [ ] Test customer login → redirects to /dashboard
- [ ] Test admin login → redirects to /admin
- [ ] Test accessing /admin while logged out → redirects to /sign-in
- [ ] Test accessing /admin as customer → redirects to /
- [ ] Verify middleware protects routes
- [ ] Change default admin passwords

---

## 🎉 What's New

✅ **Real Supabase Authentication** (no more mock localStorage)  
✅ **Automatic role-based redirects**  
✅ **Protected admin routes** via middleware  
✅ **Helper functions** for checking user role  
✅ **Secure password handling** via Supabase Auth  
✅ **Session management** with HTTP-only cookies  

Your application now has enterprise-grade authentication! 🚀
