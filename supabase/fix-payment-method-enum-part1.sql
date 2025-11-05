-- PART 1: Add 'iban' to the enum
-- Run this FIRST in Supabase SQL Editor

ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'iban';

-- ✅ After this completes, run fix-payment-method-enum-part2.sql
