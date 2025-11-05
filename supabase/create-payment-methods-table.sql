-- Create payment_methods table for admin configuration
-- This allows admins to enable/disable payment methods shown at checkout

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'paypal', 'iban', 'cash', 'other')),
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  instructions TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type, is_enabled, instructions, config, display_order) VALUES
(
  'PayPal',
  'paypal',
  true,
  'Send payment to our PayPal account with your order number in the note.',
  '{"email": "payments@autosparehub.eu"}'::jsonb,
  1
),
(
  'Bank Transfer',
  'bank_transfer',
  true,
  'Transfer the total amount and include your order number as reference. Processing takes 1-3 business days.',
  '{
    "bank_name": "Deutsche Bank AG",
    "account_holder": "Autospare Hub GmbH",
    "iban": "DE89 3704 0044 0532 0130 00",
    "bic_swift": "COBADEFFXXX"
  }'::jsonb,
  2
),
(
  'IBAN Direct Transfer',
  'iban',
  true,
  'Use your order number as the payment reference for faster processing.',
  '{
    "account_holder": "Autospare Hub GmbH",
    "iban": "DE89 3704 0044 0532 0130 00",
    "bic": "COBADEFFXXX",
    "bank": "Deutsche Bank AG"
  }'::jsonb,
  3
)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read enabled payment methods
CREATE POLICY "allow_read_enabled_payment_methods"
ON public.payment_methods
FOR SELECT
TO public
USING (is_enabled = true);

-- Policy: Authenticated users can read all payment methods
CREATE POLICY "allow_authenticated_read_all_payment_methods"
ON public.payment_methods
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can update payment methods
CREATE POLICY "allow_admin_update_payment_methods"
ON public.payment_methods
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: Only admins can insert payment methods
CREATE POLICY "allow_admin_insert_payment_methods"
ON public.payment_methods
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: Only admins can delete payment methods
CREATE POLICY "allow_admin_delete_payment_methods"
ON public.payment_methods
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_methods_enabled ON public.payment_methods(is_enabled);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON public.payment_methods(type);

-- Verify the table and data
SELECT * FROM public.payment_methods ORDER BY display_order;
