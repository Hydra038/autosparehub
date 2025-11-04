# 🔐 Admin Login Credentials

## Default Admin Accounts

### System Administrator
- **Email:** admin@autospare.com
- **Password:** Admin@2024!
- **Role:** Full Admin

### Store Manager  
- **Email:** manager@autospare.com
- **Password:** Manager@2024!
- **Role:** Admin

### Support Agent
- **Email:** support@autospare.com
- **Password:** Support@2024!
- **Role:** Admin

---

## ⚠️ IMPORTANT SECURITY NOTES

1. **Change These Passwords Immediately!**
   - These are default passwords
   - Change them after first login
   - Use strong, unique passwords

2. **DO NOT Commit This File to Git**
   - Add to .gitignore if tracking
   - Keep credentials secure
   - Use password manager for production

3. **Production Setup:**
   - Change passwords before going live
   - Enable 2FA if available
   - Use different passwords per environment
   - Rotate passwords regularly

---

## How to Add Admin Users SQL Script

Already created in: `supabase/seed-admin-users.sql`

**To create these admin accounts:**
1. Open Supabase SQL Editor
2. Copy contents of `supabase/seed-admin-users.sql`
3. Click "Run"
4. Verify 3 admin users created

---

## How to Add More Admin Users

```sql
INSERT INTO public.users (email, password_hash, full_name, role, is_active, email_verified)
VALUES (
  'newemail@autospare.com',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  'Full Name',
  'admin',
  true,
  true
);
```

---

## Database Location

**Supabase Project:** hfkksqchjubxvxatzrae.supabase.co

All passwords are encrypted using bcrypt (gen_salt('bf'))
