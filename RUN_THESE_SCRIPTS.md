# 🚀 QUICK START - Database Setup

## ⚡ 2 SQL Scripts to Run (5 minutes total)

### 📍 Open SQL Editor First
**Link:** https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql/new

---

## 1️⃣ CREATE TABLES (2 minutes)

**File:** `supabase/schema.sql`

**Steps:**
1. Open `schema.sql` in VS Code
2. Select All (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into Supabase SQL Editor
5. Click **Run** button
6. Wait ~30 seconds
7. ✅ See: "Success. No rows returned"

**What it creates:**
- 9 database tables
- Security policies
- Indexes
- Triggers

---

## 2️⃣ LOAD PRODUCTS (2 minutes)

**File:** `supabase/seed.sql`

**Steps:**
1. Click "New query" in SQL Editor (or stay in same window)
2. Open `seed.sql` in VS Code
3. Select All (Ctrl+A)
4. Copy (Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click **Run** button
7. ✅ See: "Success. No rows returned"

**What it adds:**
- 12 categories
- 16 products (EUR prices)
- 16 images
- 16 inventory records
- 3 payment methods

---

## ✅ VERIFY (1 minute)

**Link:** https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/editor

**Check these tables:**
- categories → 12 rows ✅
- products → 16 rows ✅
- product_images → 16 rows ✅
- inventory → 16 rows ✅
- payment_methods → 3 rows ✅

---

## ✨ THEN COME BACK

After running both scripts:
1. Return to this chat
2. Say **"database is ready"**
3. I'll migrate the code to use real database
4. ~15 more minutes and you're done!

---

## 🆘 Troubleshooting

**"relation does not exist"**
→ Run schema.sql first (Step 1)

**"duplicate key value"**
→ Already ran seed.sql. You're good!

**"No products"**
→ Run seed.sql (Step 2)

**"Can't find SQL Editor"**
→ Use this direct link: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql/new

---

## 📋 Checklist

- [ ] Open SQL Editor
- [ ] Run schema.sql
- [ ] Run seed.sql  
- [ ] Verify tables in Table Editor
- [ ] Return to chat and say "database is ready"

**Go! 🚀**
