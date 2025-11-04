-- Seed data for Autospare Hub
-- Run this after schema.sql to populate initial data

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO public.categories (name, slug, description, display_order) VALUES
('Engine Parts', 'engine-parts', 'Complete range of engine components and accessories', 1),
('Brakes', 'brakes', 'Brake pads, discs, calipers and brake fluids', 2),
('Suspension', 'suspension', 'Shock absorbers, springs, and suspension components', 3),
('Electrical', 'electrical', 'Batteries, alternators, starters and electrical parts', 4),
('Filters', 'filters', 'Oil filters, air filters, fuel filters and cabin filters', 5),
('Exhaust', 'exhaust', 'Exhaust systems, catalytic converters and mufflers', 6),
('Cooling', 'cooling', 'Radiators, water pumps, thermostats and cooling fans', 7),
('Transmission', 'transmission', 'Gearboxes, clutches and transmission fluids', 8),
('Interior', 'interior', 'Seats, carpets, dashboard components and accessories', 9),
('Exterior', 'exterior', 'Body panels, mirrors, lights and exterior trim', 10),
('Wheels & Tyres', 'wheels-tyres', 'Alloy wheels, steel wheels and tyre accessories', 11),
('Steering', 'steering', 'Steering wheels, power steering pumps and components', 12);

-- =====================================================
-- SAMPLE PRODUCTS
-- =====================================================

-- Engine Parts
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'ENG-001', 
  'Oil Filter - Universal', 
  'High-quality oil filter for most European cars',
  'Premium oil filter with advanced filtration technology. Compatible with most petrol and diesel engines. Ensures optimal engine protection and performance.',
  id, 
  12.99, 
  'new', 
  'Bosch', 
  true, 
  true 
FROM public.categories WHERE slug = 'filters' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'ENG-002', 
  'Air Filter - High Performance', 
  'Performance air filter for improved airflow',
  'K&N style high-flow air filter. Washable and reusable. Increases horsepower and acceleration. Easy to install.',
  id, 
  45.99, 
  'new', 
  'K&N', 
  true, 
  true 
FROM public.categories WHERE slug = 'filters' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'ENG-003', 
  'Spark Plugs Set (4pcs)', 
  'Iridium spark plugs for better combustion',
  'Premium iridium spark plugs. Set of 4. Longer lifespan than standard plugs. Improved fuel efficiency and smoother running.',
  id, 
  34.99, 
  'new', 
  'NGK', 
  false, 
  true 
FROM public.categories WHERE slug = 'engine-parts' LIMIT 1;

-- Brakes
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'BRK-001', 
  'Front Brake Pads Set', 
  'OEM quality front brake pads',
  'High-quality ceramic brake pads. Low dust formula. Excellent stopping power. Fits most European vehicles. Includes wear sensors.',
  id, 
  45.99, 
  'new', 
  'Brembo', 
  true, 
  true 
FROM public.categories WHERE slug = 'brakes' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'BRK-002', 
  'Rear Brake Discs Pair', 
  'Vented brake discs for rear axle',
  'Premium quality brake discs. Vented design for better cooling. Direct OEM replacement. Sold as pair. Manufactured to ISO standards.',
  id, 
  89.99, 
  'new', 
  'ATE', 
  true, 
  true 
FROM public.categories WHERE slug = 'brakes' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'BRK-003', 
  'Brake Fluid DOT 4 (1L)', 
  'High-performance brake fluid',
  'DOT 4 brake fluid. High boiling point. Suitable for ABS systems. 1 litre bottle. Essential for brake maintenance.',
  id, 
  9.99, 
  'new', 
  'Castrol', 
  false, 
  true 
FROM public.categories WHERE slug = 'brakes' LIMIT 1;

-- Suspension
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'SUS-001', 
  'Front Shock Absorber', 
  'Gas-pressure shock absorber',
  'Twin-tube gas shock absorber. Improved ride comfort and handling. Direct replacement. Single unit. Premium quality construction.',
  id, 
  75.99, 
  'new', 
  'Monroe', 
  false, 
  true 
FROM public.categories WHERE slug = 'suspension' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'SUS-002', 
  'Coil Spring Pair - Front', 
  'Heavy-duty front coil springs',
  'Pair of front coil springs. Manufactured from high-grade steel. Restores original ride height. Sold as pair for balanced performance.',
  id, 
  89.99, 
  'new', 
  'Eibach', 
  true, 
  true 
FROM public.categories WHERE slug = 'suspension' LIMIT 1;

-- Electrical
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'ELE-001', 
  'Car Battery 12V 70Ah', 
  'Maintenance-free car battery',
  '12V 70Ah battery. 640 CCA. Maintenance-free sealed design. 3-year warranty. Suitable for most European vehicles.',
  id, 
  119.99, 
  'new', 
  'Bosch', 
  true, 
  true 
FROM public.categories WHERE slug = 'electrical' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'ELE-002', 
  'Alternator 90A', 
  'Replacement alternator',
  '90A alternator. Direct OEM replacement. Includes pulley and regulator. Tested and guaranteed. 2-year warranty.',
  id, 
  189.99, 
  'refurbished', 
  'Valeo', 
  false, 
  true 
FROM public.categories WHERE slug = 'electrical' LIMIT 1;

-- Exhaust
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'EXH-001', 
  'Catalytic Converter', 
  'Euro 5 compliant catalytic converter',
  'High-flow catalytic converter. Euro 5 emission standard. Stainless steel construction. Direct fit. Includes gaskets.',
  id, 
  289.99, 
  'new', 
  'Walker', 
  false, 
  true 
FROM public.categories WHERE slug = 'exhaust' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'EXH-002', 
  'Rear Silencer Box', 
  'Replacement rear muffler',
  'Rear exhaust silencer. Aluminized steel construction. OEM specification. Reduces noise effectively. Easy installation.',
  id, 
  79.99, 
  'new', 
  'Bosal', 
  false, 
  true 
FROM public.categories WHERE slug = 'exhaust' LIMIT 1;

-- Cooling
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'COO-001', 
  'Radiator - Aluminium', 
  'Aluminium radiator with plastic tanks',
  'Lightweight aluminium radiator. High-efficiency cooling. Direct fit replacement. Includes drain plug. Pressure tested.',
  id, 
  159.99, 
  'new', 
  'Nissens', 
  false, 
  true 
FROM public.categories WHERE slug = 'cooling' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'COO-002', 
  'Water Pump with Gasket', 
  'Engine water pump assembly',
  'Complete water pump assembly. Includes gasket and seals. Direct OEM replacement. Essential for cooling system maintenance.',
  id, 
  65.99, 
  'new', 
  'SKF', 
  false, 
  true 
FROM public.categories WHERE slug = 'cooling' LIMIT 1;

-- Exterior
INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'EXT-001', 
  'Door Mirror - Heated (Right)', 
  'Electric heated door mirror',
  'Right-hand electric door mirror. Heated glass. Electrically adjustable. Paint to match your car. Direct replacement.',
  id, 
  89.99, 
  'new', 
  'TYC', 
  false, 
  true 
FROM public.categories WHERE slug = 'exterior' LIMIT 1;

INSERT INTO public.products (sku, title, description, long_description, category_id, price_eur, condition, manufacturer, is_featured, is_active) 
SELECT 
  'EXT-002', 
  'Headlight Assembly LED (Left)', 
  'Modern LED headlight',
  'Left-hand LED headlight assembly. Superior illumination. Long-lasting LEDs. E-marked for road use. Direct fit.',
  id, 
  245.99, 
  'new', 
  'Hella', 
  true, 
  true 
FROM public.categories WHERE slug = 'exterior' LIMIT 1;

-- =====================================================
-- PAYMENT METHODS
-- =====================================================

INSERT INTO public.payment_methods (name, type, is_enabled, instructions, config) VALUES
(
  'PayPal',
  'paypal',
  true,
  'Pay securely with PayPal. You will be redirected to PayPal to complete your payment.',
  '{"fee_percentage": 2.9, "fee_fixed_eur": 0.30}'::jsonb
),
(
  'Bank Transfer',
  'bank_transfer',
  true,
  'Transfer funds directly to our bank account. Order will be processed after payment is received. Bank details will be provided after checkout.',
  '{"bank_name": "European Bank", "account_holder": "Autospare Hub Ltd", "iban": "DE89370400440532013000", "bic": "COBADEFFXXX"}'::jsonb
),
(
  'Stripe (Credit/Debit Card)',
  'stripe',
  true,
  'Pay with credit or debit card. Secure payment processing by Stripe.',
  '{"fee_percentage": 1.5, "fee_fixed_eur": 0.25}'::jsonb
);

-- =====================================================
-- SAMPLE PRODUCT IMAGES (using placeholder URLs)
-- =====================================================

-- Oil Filter
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Oil+Filter', 'Oil Filter', 0, true
FROM public.products WHERE sku = 'ENG-001';

-- Air Filter
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Air+Filter', 'High Performance Air Filter', 0, true
FROM public.products WHERE sku = 'ENG-002';

-- Spark Plugs
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Spark+Plugs', 'Iridium Spark Plugs Set', 0, true
FROM public.products WHERE sku = 'ENG-003';

-- Front Brake Pads
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Brake+Pads', 'Front Brake Pads Set', 0, true
FROM public.products WHERE sku = 'BRK-001';

-- Rear Brake Discs
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Brake+Discs', 'Rear Brake Discs Pair', 0, true
FROM public.products WHERE sku = 'BRK-002';

-- Brake Fluid
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Brake+Fluid', 'DOT 4 Brake Fluid', 0, true
FROM public.products WHERE sku = 'BRK-003';

-- Front Shock Absorber
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Shock+Absorber', 'Gas Shock Absorber', 0, true
FROM public.products WHERE sku = 'SUS-001';

-- Coil Springs
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Coil+Springs', 'Front Coil Spring Pair', 0, true
FROM public.products WHERE sku = 'SUS-002';

-- Battery
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Car+Battery', '12V 70Ah Battery', 0, true
FROM public.products WHERE sku = 'ELE-001';

-- Alternator
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Alternator', '90A Alternator', 0, true
FROM public.products WHERE sku = 'ELE-002';

-- Catalytic Converter
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Catalytic+Converter', 'Euro 5 Catalytic Converter', 0, true
FROM public.products WHERE sku = 'EXH-001';

-- Rear Silencer
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Exhaust+Silencer', 'Rear Silencer Box', 0, true
FROM public.products WHERE sku = 'EXH-002';

-- Radiator
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Radiator', 'Aluminium Radiator', 0, true
FROM public.products WHERE sku = 'COO-001';

-- Water Pump
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Water+Pump', 'Water Pump with Gasket', 0, true
FROM public.products WHERE sku = 'COO-002';

-- Door Mirror
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=Door+Mirror', 'Heated Door Mirror', 0, true
FROM public.products WHERE sku = 'EXT-001';

-- LED Headlight
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://placehold.co/600x600/png?text=LED+Headlight', 'LED Headlight Assembly', 0, true
FROM public.products WHERE sku = 'EXT-002';

-- =====================================================
-- SAMPLE INVENTORY
-- =====================================================

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 50, 0, 10 FROM public.products WHERE sku = 'ENG-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 30, 0, 5 FROM public.products WHERE sku = 'ENG-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 100, 0, 20 FROM public.products WHERE sku = 'ENG-003';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 40, 0, 10 FROM public.products WHERE sku = 'BRK-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 25, 0, 5 FROM public.products WHERE sku = 'BRK-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 75, 0, 15 FROM public.products WHERE sku = 'BRK-003';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 20, 0, 5 FROM public.products WHERE sku = 'SUS-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 15, 0, 3 FROM public.products WHERE sku = 'SUS-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 30, 0, 10 FROM public.products WHERE sku = 'ELE-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 12, 0, 3 FROM public.products WHERE sku = 'ELE-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 8, 0, 2 FROM public.products WHERE sku = 'EXH-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 18, 0, 5 FROM public.products WHERE sku = 'EXH-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 10, 0, 2 FROM public.products WHERE sku = 'COO-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 25, 0, 5 FROM public.products WHERE sku = 'COO-002';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 15, 0, 3 FROM public.products WHERE sku = 'EXT-001';

INSERT INTO public.inventory (product_id, stock_quantity, reserved_quantity, reorder_level)
SELECT id, 20, 0, 5 FROM public.products WHERE sku = 'EXT-002';
