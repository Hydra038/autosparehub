-- Autospare Hub - Complete Supabase SQL Schema
-- E-commerce platform for car spare parts
-- Currency: EUR (€)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE product_condition AS ENUM ('new', 'refurbished', 'used');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'iban', 'paypal');

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United Kingdom',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- SUPPLIERS TABLE
-- =====================================================

CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  price_eur DECIMAL(10, 2) NOT NULL CHECK (price_eur >= 0),
  compare_at_price_eur DECIMAL(10, 2) CHECK (compare_at_price_eur >= 0),
  condition product_condition DEFAULT 'new' NOT NULL,
  weight_kg DECIMAL(8, 2),
  dimensions_cm TEXT, -- e.g., "20x15x10"
  manufacturer TEXT,
  manufacturer_part_number TEXT,
  warranty_months INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Full-text search column
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(description, '') || ' ' || 
      coalesce(sku, '') || ' ' ||
      coalesce(manufacturer, '') || ' ' ||
      coalesce(manufacturer_part_number, '')
    )
  ) STORED
);

-- =====================================================
-- PRODUCT_IMAGES TABLE
-- =====================================================

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Supabase Storage URL
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- INVENTORY TABLE
-- =====================================================

CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0 NOT NULL CHECK (quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 NOT NULL CHECK (reserved_quantity >= 0),
  reorder_level INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  last_restocked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- COMPATIBILITY TABLE (Vehicle compatibility)
-- =====================================================

CREATE TABLE public.compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  make TEXT NOT NULL, -- e.g., "Toyota", "Ford"
  model TEXT NOT NULL, -- e.g., "Corolla", "Focus"
  year_from INTEGER NOT NULL,
  year_to INTEGER NOT NULL,
  engine TEXT, -- e.g., "1.8L", "2.0 TDI"
  trim TEXT, -- e.g., "SE", "Sport"
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_year_range CHECK (year_from <= year_to)
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Order totals (EUR)
  subtotal_eur DECIMAL(10, 2) NOT NULL CHECK (subtotal_eur >= 0),
  shipping_eur DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_eur >= 0),
  tax_eur DECIMAL(10, 2) DEFAULT 0 CHECK (tax_eur >= 0),
  discount_eur DECIMAL(10, 2) DEFAULT 0 CHECK (discount_eur >= 0),
  total_eur DECIMAL(10, 2) NOT NULL CHECK (total_eur >= 0),
  
  -- Status tracking
  status order_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method payment_method,
  payment_intent_id TEXT, -- Stripe/PayPal transaction ID
  
  -- Shipping details
  shipping_full_name TEXT NOT NULL,
  shipping_email TEXT NOT NULL,
  shipping_phone TEXT,
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'United Kingdom' NOT NULL,
  
  -- Billing details (optional if same as shipping)
  billing_full_name TEXT,
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city TEXT,
  billing_postal_code TEXT,
  billing_country TEXT,
  
  -- Notes and tracking
  customer_notes TEXT,
  admin_notes TEXT,
  tracking_number TEXT,
  carrier TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- =====================================================
-- ORDER_ITEMS TABLE
-- =====================================================

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  
  -- Snapshot of product details at time of order
  product_title TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image_url TEXT,
  
  -- Pricing (EUR)
  unit_price_eur DECIMAL(10, 2) NOT NULL CHECK (unit_price_eur >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price_eur DECIMAL(10, 2) NOT NULL CHECK (total_price_eur >= 0),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- PAYMENT METHODS TABLE
-- =====================================================

CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'paypal', 'stripe', 'cash', 'other')),
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  instructions TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- Categories
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_active ON public.categories(is_active);

-- Products
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_price ON public.products(price_eur);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_products_search_vector ON public.products USING GIN(search_vector);

-- Product Images
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_primary ON public.product_images(product_id, is_primary);

-- Inventory
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_inventory_quantity ON public.inventory(quantity);

-- Compatibility
CREATE INDEX idx_compatibility_product_id ON public.compatibility(product_id);
CREATE INDEX idx_compatibility_make_model ON public.compatibility(make, model);
CREATE INDEX idx_compatibility_year ON public.compatibility(year_from, year_to);

-- Orders
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Order Items
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Payment Methods
CREATE INDEX idx_payment_methods_type ON public.payment_methods(type);
CREATE INDEX idx_payment_methods_enabled ON public.payment_methods(is_enabled);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- CATEGORIES POLICIES (Public read, admin write)
-- =====================================================

CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (is_active = TRUE OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update categories" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete categories" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- SUPPLIERS POLICIES (Admin only)
-- =====================================================

CREATE POLICY "Only admins can view suppliers" ON public.suppliers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can insert suppliers" ON public.suppliers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update suppliers" ON public.suppliers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete suppliers" ON public.suppliers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PRODUCTS POLICIES (Public read, admin write)
-- =====================================================

CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = TRUE OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PRODUCT_IMAGES POLICIES (Public read, admin write)
-- =====================================================

CREATE POLICY "Product images are viewable by everyone" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert product images" ON public.product_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update product images" ON public.product_images
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete product images" ON public.product_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- INVENTORY POLICIES (Public read stock, admin write)
-- =====================================================

CREATE POLICY "Inventory is viewable by everyone" ON public.inventory
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert inventory" ON public.inventory
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update inventory" ON public.inventory
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- COMPATIBILITY POLICIES (Public read, admin write)
-- =====================================================

CREATE POLICY "Compatibility is viewable by everyone" ON public.compatibility
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert compatibility" ON public.compatibility
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update compatibility" ON public.compatibility
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete compatibility" ON public.compatibility
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- ORDERS POLICIES (Users see own, admins see all)
-- =====================================================

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders are created via API route with service key
CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- ORDER_ITEMS POLICIES (Access via order relationship)
-- =====================================================

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

CREATE POLICY "Order items inserted via service key" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id)
  );

-- =====================================================
-- PAYMENT_METHODS POLICIES
-- =====================================================

CREATE POLICY "Anyone can view enabled payment methods" ON public.payment_methods
  FOR SELECT USING (is_enabled = true);

CREATE POLICY "Admins can manage payment methods" ON public.payment_methods
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  num_orders INTEGER;
BEGIN
  SELECT COUNT(*) INTO num_orders FROM public.orders;
  order_num := 'ASH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((num_orders + 1)::TEXT, 5, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to check and reserve inventory
CREATE OR REPLACE FUNCTION reserve_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_qty INTEGER;
BEGIN
  SELECT (quantity - reserved_quantity) INTO available_qty
  FROM public.inventory
  WHERE product_id = p_product_id
  FOR UPDATE;
  
  IF available_qty >= p_quantity THEN
    UPDATE public.inventory
    SET reserved_quantity = reserved_quantity + p_quantity
    WHERE product_id = p_product_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to release reserved inventory
CREATE OR REPLACE FUNCTION release_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.inventory
  SET reserved_quantity = GREATEST(0, reserved_quantity - p_quantity)
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to fulfill order (move reserved to sold)
CREATE OR REPLACE FUNCTION fulfill_inventory(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.inventory
  SET 
    quantity = GREATEST(0, quantity - p_quantity),
    reserved_quantity = GREATEST(0, reserved_quantity - p_quantity)
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert default categories
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
  ('Steering', 'steering', 'Steering racks, pumps, and steering components', 12);

-- Note: Run this SQL in your Supabase SQL Editor
-- After running, configure Storage bucket for product images:
-- Bucket name: product-images
-- Public access: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
