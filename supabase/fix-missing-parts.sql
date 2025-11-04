-- This script fixes missing tables and adds missing categories
-- Run this if you get errors about missing payment_methods table or categories

-- Create payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'paypal', 'stripe', 'cash', 'other')),
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  instructions TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for payment_methods if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_type') THEN
    CREATE INDEX idx_payment_methods_type ON public.payment_methods(type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_enabled') THEN
    CREATE INDEX idx_payment_methods_enabled ON public.payment_methods(is_enabled);
  END IF;
END $$;

-- Enable RLS on payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for payment_methods
DROP POLICY IF EXISTS "Anyone can view enabled payment methods" ON public.payment_methods;
CREATE POLICY "Anyone can view enabled payment methods" ON public.payment_methods
  FOR SELECT USING (is_enabled = true);

DROP POLICY IF EXISTS "Admins can manage payment methods" ON public.payment_methods;
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert/update categories (using UPSERT to avoid duplicates)
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Engine Parts', 'engine-parts', 'Engine components and accessories', 1),
  ('Brakes', 'brakes', 'Brake pads, discs, and systems', 2),
  ('Suspension', 'suspension', 'Shocks, struts, and suspension components', 3),
  ('Electrical', 'electrical', 'Batteries, alternators, and electrical parts', 4),
  ('Filters', 'filters', 'Oil, air, and fuel filters', 5),
  ('Exhaust', 'exhaust', 'Exhaust systems and components', 6),
  ('Cooling', 'cooling', 'Radiators, cooling fans, and cooling system parts', 7),
  ('Transmission', 'transmission', 'Clutch, gearbox, and transmission components', 8),
  ('Interior', 'interior', 'Seats, carpets, and interior accessories', 9),
  ('Exterior', 'exterior', 'Body panels, lights, and exterior accessories', 10),
  ('Wheels & Tyres', 'wheels-tyres', 'Alloy wheels, tyres, and wheel accessories', 11),
  ('Steering', 'steering', 'Steering racks, pumps, and steering components', 12)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Show results
SELECT 'Payment methods table:' as info, COUNT(*) as count FROM public.payment_methods
UNION ALL
SELECT 'Categories:', COUNT(*) FROM public.categories;
