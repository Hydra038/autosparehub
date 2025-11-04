-- Sample Data for Autospare Hub
-- This file contains realistic test data for development and demonstration
-- Run this AFTER running the main schema.sql file

-- ============================================================================
-- SAMPLE CATEGORIES (already created by schema, but adding more)
-- ============================================================================

-- Add some more specific categories
INSERT INTO categories (name, slug, description, image_url, display_order, is_active) VALUES
('Air Filters', 'air-filters', 'Engine air filters and cabin air filters', NULL, 11, true),
('Spark Plugs', 'spark-plugs', 'Ignition spark plugs for all makes', NULL, 12, true),
('Wiper Blades', 'wiper-blades', 'Windscreen wiper blades and refills', NULL, 13, true),
('Batteries', 'batteries', 'Car batteries and accessories', NULL, 14, true),
('Belts & Hoses', 'belts-hoses', 'Timing belts, drive belts, and hoses', NULL, 15, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SAMPLE SUPPLIERS
-- ============================================================================

INSERT INTO suppliers (name, contact_name, email, phone, address, city, postcode, country, is_active) VALUES
('AutoParts Direct Ltd', 'John Smith', 'john@autopartsdirect.co.uk', '+44 20 1234 5678', '123 Industrial Park', 'Birmingham', 'B12 0AA', 'United Kingdom', true),
('Premium Motor Components', 'Sarah Johnson', 'sarah@premiummotor.co.uk', '+44 161 987 6543', '45 Trade Estate', 'Manchester', 'M1 2AB', 'United Kingdom', true),
('UK Car Spares', 'Michael Brown', 'mike@ukcarspares.co.uk', '+44 113 555 1234', '78 Commerce Way', 'Leeds', 'LS9 8CD', 'United Kingdom', true),
('Global Auto Parts', 'Emma Wilson', 'emma@globalauto.co.uk', '+44 20 8765 4321', '90 Distribution Centre', 'London', 'E14 5EF', 'United Kingdom', true);

-- ============================================================================
-- SAMPLE PRODUCTS
-- ============================================================================

-- Get supplier IDs for reference
DO $$
DECLARE
  supplier1_id UUID;
  supplier2_id UUID;
  supplier3_id UUID;
  supplier4_id UUID;
  
  cat_brakes UUID;
  cat_filters UUID;
  cat_engine UUID;
  cat_suspension UUID;
  cat_exhaust UUID;
  cat_lighting UUID;
  cat_electrical UUID;
  cat_cooling UUID;
  cat_transmission UUID;
  cat_body UUID;
  cat_air_filters UUID;
  cat_spark_plugs UUID;
  cat_wiper_blades UUID;
  cat_batteries UUID;
  cat_belts_hoses UUID;
  
  product_id UUID;
BEGIN
  -- Get supplier IDs
  SELECT id INTO supplier1_id FROM suppliers WHERE name = 'AutoParts Direct Ltd' LIMIT 1;
  SELECT id INTO supplier2_id FROM suppliers WHERE name = 'Premium Motor Components' LIMIT 1;
  SELECT id INTO supplier3_id FROM suppliers WHERE name = 'UK Car Spares' LIMIT 1;
  SELECT id INTO supplier4_id FROM suppliers WHERE name = 'Global Auto Parts' LIMIT 1;
  
  -- Get category IDs
  SELECT id INTO cat_brakes FROM categories WHERE slug = 'brakes' LIMIT 1;
  SELECT id INTO cat_filters FROM categories WHERE slug = 'filters' LIMIT 1;
  SELECT id INTO cat_engine FROM categories WHERE slug = 'engine-parts' LIMIT 1;
  SELECT id INTO cat_suspension FROM categories WHERE slug = 'suspension' LIMIT 1;
  SELECT id INTO cat_exhaust FROM categories WHERE slug = 'exhaust-systems' LIMIT 1;
  SELECT id INTO cat_lighting FROM categories WHERE slug = 'lighting' LIMIT 1;
  SELECT id INTO cat_electrical FROM categories WHERE slug = 'electrical' LIMIT 1;
  SELECT id INTO cat_cooling FROM categories WHERE slug = 'cooling-systems' LIMIT 1;
  SELECT id INTO cat_transmission FROM categories WHERE slug = 'transmission' LIMIT 1;
  SELECT id INTO cat_body FROM categories WHERE slug = 'body-parts' LIMIT 1;
  SELECT id INTO cat_air_filters FROM categories WHERE slug = 'air-filters' LIMIT 1;
  SELECT id INTO cat_spark_plugs FROM categories WHERE slug = 'spark-plugs' LIMIT 1;
  SELECT id INTO cat_wiper_blades FROM categories WHERE slug = 'wiper-blades' LIMIT 1;
  SELECT id INTO cat_batteries FROM categories WHERE slug = 'batteries' LIMIT 1;
  SELECT id INTO cat_belts_hoses FROM categories WHERE slug = 'belts-hoses' LIMIT 1;

  -- BRAKE PARTS
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Front Brake Pads Set - Premium Ceramic', 'BP-FRONT-001', 'High-performance ceramic brake pads for front axle. Low dust formula, excellent stopping power. Fits most European vehicles. Includes wear sensors and anti-squeal shims. OEM equivalent quality.', 45.99, cat_brakes, supplier1_id, 'new', 24, true, true, 'Premium Ceramic Front Brake Pads | UK Stock', 'High-quality ceramic brake pads with 2-year warranty. Fast UK delivery.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 150, 0, 20, 50);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Volkswagen', 'Golf', 2010, 2020),
  (product_id, 'Volkswagen', 'Passat', 2012, 2020),
  (product_id, 'Audi', 'A3', 2010, 2020),
  (product_id, 'Audi', 'A4', 2010, 2020),
  (product_id, 'Seat', 'Leon', 2010, 2020);

  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Rear Brake Discs Pair - Vented', 'BD-REAR-001', 'Vented brake discs for rear axle, sold as a pair. Made from high-carbon steel with anti-corrosion coating. Precision machined for perfect fit. G3000 grade material for superior heat dissipation.', 89.99, cat_brakes, supplier2_id, 'new', 24, true, true, 'Rear Brake Discs Pair Vented | Premium Quality', 'High-carbon steel brake discs with anti-corrosion coating.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 80, 0, 15, 30);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'BMW', '3 Series', 2012, 2019),
  (product_id, 'BMW', '4 Series', 2013, 2020),
  (product_id, 'BMW', 'X3', 2011, 2017);

  -- FILTERS
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Engine Oil Filter - Standard', 'OF-STD-001', 'Premium quality oil filter with multi-layer filtration media. Removes 99% of contaminants. Anti-drain back valve prevents dry starts. Recommended change every 10,000 miles or 12 months.', 8.99, cat_filters, supplier3_id, 'new', 12, true, false, 'Engine Oil Filter | 99% Filtration', 'High-quality oil filter for most petrol and diesel engines.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 500, 0, 50, 200);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Ford', 'Focus', 2008, 2018),
  (product_id, 'Ford', 'Fiesta', 2008, 2017),
  (product_id, 'Ford', 'Mondeo', 2007, 2015),
  (product_id, 'Vauxhall', 'Astra', 2009, 2016),
  (product_id, 'Vauxhall', 'Corsa', 2010, 2018);

  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Cabin Air Filter - HEPA Grade', 'CF-HEPA-001', 'HEPA grade cabin air filter removes 99.97% of particles including pollen, dust, and bacteria. Activated carbon layer removes odours. Improves air quality and HVAC efficiency. Easy installation.', 15.99, cat_air_filters, supplier1_id, 'new', 12, true, true, 'HEPA Cabin Air Filter | Premium Quality', 'Remove 99.97% of particles with activated carbon odour filter.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 300, 0, 40, 100);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Toyota', 'Corolla', 2013, 2021),
  (product_id, 'Toyota', 'RAV4', 2013, 2019),
  (product_id, 'Honda', 'Civic', 2012, 2021),
  (product_id, 'Honda', 'CR-V', 2012, 2018);

  -- ENGINE PARTS
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Spark Plugs Set of 4 - Iridium', 'SP-IRID-004', 'Set of 4 iridium spark plugs for 4-cylinder engines. 0.6mm fine wire for improved ignitability. Lasts up to 100,000 miles. Better fuel economy and smoother idle. Pre-gapped and ready to install.', 32.99, cat_spark_plugs, supplier2_id, 'new', 36, true, true, 'Iridium Spark Plugs Set of 4 | Long Life', 'Premium iridium plugs lasting 100,000 miles with improved performance.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 200, 0, 30, 80);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Nissan', 'Qashqai', 2014, 2021),
  (product_id, 'Nissan', 'Juke', 2013, 2019),
  (product_id, 'Mazda', '3', 2013, 2019),
  (product_id, 'Mazda', 'CX-5', 2012, 2017);

  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Timing Belt Kit - Complete', 'TB-KIT-001', 'Complete timing belt replacement kit includes belt, tensioner, idler pulleys, and water pump. OEM quality components. Essential for preventive maintenance at 60-100k miles. Comprehensive fitting instructions included.', 149.99, cat_belts_hoses, supplier4_id, 'new', 24, true, true, 'Complete Timing Belt Kit | With Water Pump', 'Full timing belt kit with all components for professional installation.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 60, 0, 10, 25);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Renault', 'Clio', 2013, 2019),
  (product_id, 'Renault', 'Megane', 2014, 2020),
  (product_id, 'Dacia', 'Duster', 2013, 2018);

  -- SUSPENSION
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Front Shock Absorber Pair - Gas', 'SA-FRONT-001', 'Gas-pressurized front shock absorbers, sold as pair. Twin-tube design for comfortable ride. All-weather fluid for consistent performance. Restores factory ride height and handling. Includes mounting hardware.', 79.99, cat_suspension, supplier1_id, 'new', 24, true, false, 'Gas Front Shock Absorbers Pair | Comfort Ride', 'Premium gas shocks for improved handling and comfort.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 45, 0, 8, 20);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Peugeot', '208', 2012, 2019),
  (product_id, 'Peugeot', '308', 2013, 2020),
  (product_id, 'Citroen', 'C3', 2010, 2016),
  (product_id, 'Citroen', 'C4', 2011, 2018);

  -- LIGHTING
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('LED Headlight Bulbs H7 - 6000K', 'LED-H7-6000K', 'Super bright LED headlight bulbs, 6000K cool white. 300% brighter than halogen. 50,000 hour lifespan. Built-in cooling fan. Plug and play installation. ECE approved for road use.', 39.99, cat_lighting, supplier3_id, 'new', 36, true, true, 'LED Headlight Bulbs H7 6000K | 300% Brighter', 'Super bright LED bulbs with 50,000 hour life and ECE approval.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 180, 0, 25, 60);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Mercedes-Benz', 'C-Class', 2014, 2021),
  (product_id, 'Mercedes-Benz', 'E-Class', 2013, 2020),
  (product_id, 'Volkswagen', 'Tiguan', 2016, 2023);

  -- ELECTRICAL
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Car Battery 12V 70Ah - Heavy Duty', 'BAT-70AH-HD', '12V 70Ah heavy duty car battery. 640 CCA for reliable cold starts. Maintenance-free sealed design. 4-year warranty. Fits most medium-sized petrol and diesel cars. Free battery health check service.', 89.99, cat_batteries, supplier2_id, 'new', 48, true, true, 'Heavy Duty Car Battery 12V 70Ah | 4 Year Warranty', 'Reliable 640 CCA battery with maintenance-free design.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 100, 0, 15, 40);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Volkswagen', 'Golf', 2009, 2020),
  (product_id, 'Ford', 'Focus', 2011, 2018),
  (product_id, 'Vauxhall', 'Astra', 2010, 2019),
  (product_id, 'Toyota', 'Corolla', 2013, 2019);

  -- WIPER BLADES
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Wiper Blades Pair - All Season', 'WB-AS-PAIR', 'Premium all-season wiper blades, sold as pair (driver + passenger). Dual rubber compound for quiet operation. Aerodynamic design prevents lift at high speed. Pre-assembled with universal adaptor. Easy 5-minute fit.', 18.99, cat_wiper_blades, supplier4_id, 'new', 12, true, false, 'All Season Wiper Blades Pair | Premium Quality', 'Quiet dual-compound wipers with aerodynamic design.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 250, 0, 35, 100);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Honda', 'Civic', 2012, 2021),
  (product_id, 'Toyota', 'Yaris', 2011, 2020),
  (product_id, 'Mazda', '3', 2013, 2019),
  (product_id, 'Nissan', 'Micra', 2010, 2017);

  -- COOLING SYSTEM
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Radiator - Aluminium Core', 'RAD-ALU-001', 'High-efficiency aluminium radiator with plastic tanks. 30% more efficient cooling than OEM. Pressure tested to 20 PSI. Direct fit replacement, no modifications needed. Includes drain plug and mounting brackets.', 129.99, cat_cooling, supplier1_id, 'new', 24, true, false, 'Aluminium Radiator | 30% Better Cooling', 'High-efficiency aluminium core radiator, direct fit replacement.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 35, 0, 5, 15);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'BMW', '3 Series', 2005, 2012),
  (product_id, 'BMW', '1 Series', 2004, 2011);

  -- EXHAUST
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Exhaust Back Box - Stainless Steel', 'EXH-BB-SS-001', 'Rear silencer/back box in stainless steel. Lifetime rust protection. Deeper sporty tone without being loud. TIG welded construction. UK manufactured. Includes gaskets and fitting kit. MOT compliant.', 159.99, cat_exhaust, supplier3_id, 'new', 60, true, true, 'Stainless Steel Exhaust Back Box | Lifetime Warranty', 'Premium stainless exhaust with sporty tone and rust protection.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 25, 0, 5, 12);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Volkswagen', 'Golf', 2013, 2020),
  (product_id, 'Seat', 'Leon', 2013, 2020),
  (product_id, 'Audi', 'A3', 2013, 2020);

  -- REFURBISHED ITEMS (Budget options)
  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Alternator - Refurbished', 'ALT-REF-001', 'Professionally refurbished alternator. Fully tested and guaranteed. New bearings, brushes, and voltage regulator fitted. 110A output. Perfect for budget-conscious repairs. Core charge may apply.', 75.00, cat_electrical, supplier2_id, 'refurbished', 12, true, false, 'Refurbished Alternator 110A | Tested & Guaranteed', 'Budget-friendly refurbished alternator with new components.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 20, 0, 3, 10);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Ford', 'Focus', 2008, 2014),
  (product_id, 'Ford', 'Fiesta', 2008, 2013);

  INSERT INTO products (title, sku, description, price_gbp, category_id, supplier_id, condition, warranty_months, is_active, is_featured, meta_title, meta_description)
  VALUES 
  ('Starter Motor - Refurbished', 'STR-REF-001', 'Professionally refurbished starter motor. New solenoid and brushes. Tested to OEM specifications. Guaranteed strong cranking power. Budget-friendly alternative to new. 6 month warranty included.', 69.99, cat_electrical, supplier4_id, 'refurbished', 6, true, false, 'Refurbished Starter Motor | OEM Quality', 'Budget starter motor with new components and testing.')
  RETURNING id INTO product_id;
  
  INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level, reorder_quantity)
  VALUES (product_id, 18, 0, 3, 8);
  
  INSERT INTO compatibility (product_id, make, model, year_from, year_to)
  VALUES 
  (product_id, 'Vauxhall', 'Corsa', 2006, 2014),
  (product_id, 'Vauxhall', 'Astra', 2009, 2015);

END $$;

-- ============================================================================
-- SAMPLE USERS (Customers and Admin)
-- ============================================================================

-- Note: In production, users are managed by Supabase Auth
-- This is just to show the structure

-- Admin user (you'll need to create this through Supabase Auth in reality)
INSERT INTO users (email, full_name, role, phone)
VALUES 
('admin@autosparehub.com', 'Admin User', 'admin', '+44 20 1234 5678')
ON CONFLICT (email) DO NOTHING;

-- Sample customers
INSERT INTO users (email, full_name, role, phone)
VALUES 
('customer1@example.com', 'James Wilson', 'customer', '+44 7700 900123'),
('customer2@example.com', 'Sarah Thompson', 'customer', '+44 7700 900456'),
('customer3@example.com', 'David Martinez', 'customer', '+44 7700 900789')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SAMPLE ORDERS
-- ============================================================================

DO $$
DECLARE
  customer1_id UUID;
  customer2_id UUID;
  customer3_id UUID;
  order1_id UUID;
  order2_id UUID;
  order3_id UUID;
  
  product_brake_pads UUID;
  product_oil_filter UUID;
  product_spark_plugs UUID;
  product_brake_discs UUID;
  product_battery UUID;
BEGIN
  -- Get customer IDs
  SELECT id INTO customer1_id FROM users WHERE email = 'customer1@example.com' LIMIT 1;
  SELECT id INTO customer2_id FROM users WHERE email = 'customer2@example.com' LIMIT 1;
  SELECT id INTO customer3_id FROM users WHERE email = 'customer3@example.com' LIMIT 1;
  
  -- Get product IDs
  SELECT id INTO product_brake_pads FROM products WHERE sku = 'BP-FRONT-001' LIMIT 1;
  SELECT id INTO product_oil_filter FROM products WHERE sku = 'OF-STD-001' LIMIT 1;
  SELECT id INTO product_spark_plugs FROM products WHERE sku = 'SP-IRID-004' LIMIT 1;
  SELECT id INTO product_brake_discs FROM products WHERE sku = 'BD-REAR-001' LIMIT 1;
  SELECT id INTO product_battery FROM products WHERE sku = 'BAT-70AH-HD' LIMIT 1;
  
  -- Order 1 (Completed)
  INSERT INTO orders (
    user_id, order_number, status, payment_status, payment_method,
    subtotal_gbp, tax_gbp, shipping_gbp, total_gbp,
    shipping_full_name, shipping_email, shipping_phone,
    shipping_address_line1, shipping_city, shipping_postcode, shipping_country,
    billing_same_as_shipping
  ) VALUES (
    customer1_id, 'ORD-2024-1001', 'delivered', 'paid', 'stripe',
    54.98, 10.99, 0.00, 65.97,
    'James Wilson', 'customer1@example.com', '+44 7700 900123',
    '15 High Street', 'London', 'SW1A 1AA', 'United Kingdom',
    true
  ) RETURNING id INTO order1_id;
  
  INSERT INTO order_items (order_id, product_id, product_title, product_sku, quantity, unit_price_gbp, total_price_gbp)
  VALUES 
  (order1_id, product_brake_pads, 'Front Brake Pads Set - Premium Ceramic', 'BP-FRONT-001', 1, 45.99, 45.99),
  (order1_id, product_oil_filter, 'Engine Oil Filter - Standard', 'OF-STD-001', 1, 8.99, 8.99);
  
  -- Order 2 (Processing)
  INSERT INTO orders (
    user_id, order_number, status, payment_status, payment_method,
    subtotal_gbp, tax_gbp, shipping_gbp, total_gbp,
    shipping_full_name, shipping_email, shipping_phone,
    shipping_address_line1, shipping_city, shipping_postcode, shipping_country,
    billing_same_as_shipping, customer_notes
  ) VALUES (
    customer2_id, 'ORD-2024-1002', 'processing', 'paid', 'paypal',
    122.98, 24.59, 0.00, 147.57,
    'Sarah Thompson', 'customer2@example.com', '+44 7700 900456',
    '42 Oak Avenue', 'Manchester', 'M1 1AA', 'United Kingdom',
    true, 'Please leave in porch if not home'
  ) RETURNING id INTO order2_id;
  
  INSERT INTO order_items (order_id, product_id, product_title, product_sku, quantity, unit_price_gbp, total_price_gbp)
  VALUES 
  (order2_id, product_brake_discs, 'Rear Brake Discs Pair - Vented', 'BD-REAR-001', 1, 89.99, 89.99),
  (order2_id, product_spark_plugs, 'Spark Plugs Set of 4 - Iridium', 'SP-IRID-004', 1, 32.99, 32.99);
  
  -- Order 3 (Pending)
  INSERT INTO orders (
    user_id, order_number, status, payment_status, payment_method,
    subtotal_gbp, tax_gbp, shipping_gbp, total_gbp,
    shipping_full_name, shipping_email, shipping_phone,
    shipping_address_line1, shipping_city, shipping_postcode, shipping_country,
    billing_same_as_shipping
  ) VALUES (
    customer3_id, 'ORD-2024-1003', 'pending', 'pending', 'stripe',
    89.99, 17.99, 0.00, 107.98,
    'David Martinez', 'customer3@example.com', '+44 7700 900789',
    '78 Park Lane', 'Birmingham', 'B1 1BB', 'United Kingdom',
    true
  ) RETURNING id INTO order3_id;
  
  INSERT INTO order_items (order_id, product_id, product_title, product_sku, quantity, unit_price_gbp, total_price_gbp)
  VALUES 
  (order3_id, product_battery, 'Car Battery 12V 70Ah - Heavy Duty', 'BAT-70AH-HD', 1, 89.99, 89.99);
  
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check what was created
SELECT 'Products Created:' as info, COUNT(*) as count FROM products;
SELECT 'Inventory Records:' as info, COUNT(*) as count FROM inventory;
SELECT 'Compatibility Records:' as info, COUNT(*) as count FROM compatibility;
SELECT 'Suppliers:' as info, COUNT(*) as count FROM suppliers;
SELECT 'Orders:' as info, COUNT(*) as count FROM orders;
SELECT 'Order Items:' as info, COUNT(*) as count FROM order_items;

-- Show featured products
SELECT title, sku, price_gbp, is_featured, is_active 
FROM products 
WHERE is_featured = true 
ORDER BY created_at DESC;

COMMIT;
