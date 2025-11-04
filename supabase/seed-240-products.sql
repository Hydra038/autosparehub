-- ⚠️ IMPORTANT: Run schema.sql FIRST before running this file!
-- This seed file creates 240 products (20 per category) for a realistic car parts catalog

-- ============================================
-- Step 1: First run this to create products
-- ============================================

-- Copy this entire file into Supabase SQL Editor and click "Run"
-- Execution time: ~30-45 seconds

-- Create a temporary function to generate products
CREATE OR REPLACE FUNCTION seed_products() RETURNS void AS $$
DECLARE
  cat_engine UUID;
  cat_brakes UUID;
  cat_suspension UUID;
  cat_electrical UUID;
  cat_filters UUID;
  cat_exhaust UUID;
  cat_cooling UUID;
  cat_transmission UUID;
  cat_interior UUID;
  cat_exterior UUID;
  cat_wheels UUID;
  cat_steering UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_engine FROM categories WHERE slug = 'engine-parts';
  SELECT id INTO cat_brakes FROM categories WHERE slug = 'brakes';
  SELECT id INTO cat_suspension FROM categories WHERE slug = 'suspension';
  SELECT id INTO cat_electrical FROM categories WHERE slug = 'electrical';
  SELECT id INTO cat_filters FROM categories WHERE slug = 'filters';
  SELECT id INTO cat_exhaust FROM categories WHERE slug = 'exhaust';
  SELECT id INTO cat_cooling FROM categories WHERE slug = 'cooling';
  SELECT id INTO cat_transmission FROM categories WHERE slug = 'transmission';
  SELECT id INTO cat_interior FROM categories WHERE slug = 'interior';
  SELECT id INTO cat_exterior FROM categories WHERE slug = 'exterior';
  SELECT id INTO cat_wheels FROM categories WHERE slug = 'wheels-tyres';
  SELECT id INTO cat_steering FROM categories WHERE slug = 'steering';

  -- ENGINE PARTS (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('ENG-001', 'Timing Belt Kit Complete', 'Gates timing belt kit with tensioner and water pump', cat_engine, 149.99, 'new', 'Gates', true),
  ('ENG-002', 'Engine Mount Front', 'Heavy-duty hydraulic engine mount', cat_engine, 45.99, 'new', 'Corteco', false),
  ('ENG-003', 'Cylinder Head Gasket Set', 'Complete head gasket kit with all seals', cat_engine, 89.99, 'new', 'Elring', false),
  ('ENG-004', 'Piston Ring Set 4-Cylinder', 'Standard size piston rings', cat_engine, 129.99, 'new', 'Mahle', false),
  ('ENG-005', 'Crankshaft Pulley', 'Vibration damper harmonic balancer', cat_engine, 79.99, 'new', 'Febi', false),
  ('ENG-006', 'Camshaft Position Sensor', 'OE quality cam sensor', cat_engine, 34.99, 'new', 'Bosch', false),
  ('ENG-007', 'Crankshaft Position Sensor', 'Engine speed sensor', cat_engine, 29.99, 'new', 'VDO', false),
  ('ENG-008', 'Valve Cover Gasket', 'OEM quality rocker cover gasket', cat_engine, 19.99, 'new', 'Victor Reinz', false),
  ('ENG-009', 'Engine Oil Seal Set Complete', 'All engine seals in one kit', cat_engine, 39.99, 'new', 'Corteco', false),
  ('ENG-010', 'Turbocharger Reconditioned', 'Fully rebuilt turbo with warranty', cat_engine, 499.99, 'refurbished', 'Garrett', true),
  ('ENG-011', 'Intercooler Uprated', 'High-flow aluminium intercooler', cat_engine, 189.99, 'new', 'Forge', false),
  ('ENG-012', 'EGR Valve', 'Exhaust gas recirculation valve', cat_engine, 119.99, 'new', 'Pierburg', false),
  ('ENG-013', 'Throttle Body Electronic', 'Drive-by-wire throttle assembly', cat_engine, 159.99, 'new', 'Bosch', false),
  ('ENG-014', 'Fuel Pump Electric In-Tank', 'High-pressure fuel pump', cat_engine, 89.99, 'new', 'Bosch', false),
  ('ENG-015', 'Fuel Injector Set 4-Cylinder', 'Set of 4 OE injectors', cat_engine, 199.99, 'new', 'Siemens', false),
  ('ENG-016', 'Spark Plugs Iridium Set', 'Set of 4 NGK iridium plugs', cat_engine, 34.99, 'new', 'NGK', false),
  ('ENG-017', 'Ignition Coil Pack', 'High-performance ignition coil', cat_engine, 45.99, 'new', 'Beru', false),
  ('ENG-018', 'Engine Oil 5W-30 Fully Synthetic 5L', 'Castrol Edge 5W-30', cat_engine, 39.99, 'new', 'Castrol', true),
  ('ENG-019', 'Serpentine Multi-Rib Belt', 'Accessory drive belt', cat_engine, 24.99, 'new', 'Continental', false),
  ('ENG-020', 'Belt Tensioner Automatic', 'Self-adjusting belt tensioner', cat_engine, 49.99, 'new', 'INA', false);

  -- BRAKES (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('BRK-001', 'Front Brake Pads Ceramic', 'Low-dust ceramic brake pads', cat_brakes, 45.99, 'new', 'Brembo', true),
  ('BRK-002', 'Rear Brake Pads Set', 'Semi-metallic rear brake pads', cat_brakes, 39.99, 'new', 'TRW', false),
  ('BRK-003', 'Front Brake Discs Vented Pair', 'Vented front brake rotors', cat_brakes, 89.99, 'new', 'ATE', true),
  ('BRK-004', 'Rear Brake Discs Solid Pair', 'Solid rear brake discs', cat_brakes, 69.99, 'new', 'Zimmermann', false),
  ('BRK-005', 'Brake Fluid DOT 4 1L', 'High-performance brake fluid', cat_brakes, 9.99, 'new', 'Castrol', false),
  ('BRK-006', 'Brake Caliper Front Left Reman', 'Reconditioned brake caliper', cat_brakes, 79.99, 'refurbished', 'TRW', false),
  ('BRK-007', 'Brake Caliper Front Right Reman', 'Reconditioned brake caliper', cat_brakes, 79.99, 'refurbished', 'TRW', false),
  ('BRK-008', 'Handbrake Cable Rear', 'Parking brake cable', cat_brakes, 29.99, 'new', 'Febi', false),
  ('BRK-009', 'Brake Master Cylinder', 'Hydraulic master cylinder assembly', cat_brakes, 119.99, 'new', 'ATE', false),
  ('BRK-010', 'Brake Servo Vacuum', 'Power brake booster', cat_brakes, 149.99, 'new', 'TRW', false),
  ('BRK-011', 'ABS Sensor Front Wheel', 'Wheel speed sensor', cat_brakes, 24.99, 'new', 'Bosch', false),
  ('BRK-012', 'ABS Pump Module Reconditioned', 'ABS control unit', cat_brakes, 299.99, 'refurbished', 'Bosch', false),
  ('BRK-013', 'Brake Hose Front Flexible', 'Braided brake line', cat_brakes, 14.99, 'new', 'TRW', false),
  ('BRK-014', 'Brake Pad Wear Sensor', 'Brake pad indicator sensor', cat_brakes, 12.99, 'new', 'Beru', false),
  ('BRK-015', 'Brake Bleeding Kit Professional', 'One-person brake bleeder tool', cat_brakes, 29.99, 'new', 'Sealey', false),
  ('BRK-016', 'Performance Drilled Brake Discs', 'Cross-drilled vented discs', cat_brakes, 139.99, 'new', 'EBC', true),
  ('BRK-017', 'Track Day Brake Pads', 'High-temperature racing pads', cat_brakes, 89.99, 'new', 'Ferodo', false),
  ('BRK-018', 'Brake Disc Fitting Kit', 'Screws and clips for discs', cat_brakes, 9.99, 'new', 'Febi', false),
  ('BRK-019', 'Brake Caliper Seal Repair Kit', 'Rebuild kit for calipers', cat_brakes, 34.99, 'new', 'TRW', false),
  ('BRK-020', 'Brake Cleaner Spray 500ml', 'Aerosol brake parts cleaner', cat_brakes, 7.99, 'new', 'Comma', false);

  -- SUSPENSION (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('SUS-001', 'Front Shock Absorber Gas', 'Twin-tube gas shock', cat_suspension, 75.99, 'new', 'Monroe', false),
  ('SUS-002', 'Rear Shock Absorber', 'Hydraulic rear damper', cat_suspension, 69.99, 'new', 'Sachs', false),
  ('SUS-003', 'Front Coil Spring', 'Progressive rate spring', cat_suspension, 49.99, 'new', 'Eibach', true),
  ('SUS-004', 'Rear Coil Spring', 'Linear rate rear spring', cat_suspension, 44.99, 'new', 'Lesjöfors', false),
  ('SUS-005', 'Lowering Springs Kit -35mm', 'Sport lowering springs set', cat_suspension, 189.99, 'new', 'H&R', true),
  ('SUS-006', 'Front Strut Top Mount', 'Strut bearing and mount', cat_suspension, 29.99, 'new', 'Lemförder', false),
  ('SUS-007', 'Front Lower Control Arm', 'Wishbone with ball joint', cat_suspension, 69.99, 'new', 'Meyle', false),
  ('SUS-008', 'Ball Joint Lower Heavy Duty', 'Reinforced ball joint', cat_suspension, 24.99, 'new', 'TRW', false),
  ('SUS-009', 'Anti-Roll Bar Drop Link', 'Stabilizer link rod', cat_suspension, 14.99, 'new', 'Febi', false),
  ('SUS-010', 'Anti-Roll Bar Bushes Poly', 'Polyurethane ARB bushes', cat_suspension, 19.99, 'new', 'Powerflex', false),
  ('SUS-011', 'Rear Trailing Arm Bush', 'Rear axle mounting bush', cat_suspension, 17.99, 'new', 'Corteco', false),
  ('SUS-012', 'Coilover Kit Adjustable', 'Height-adjustable coilovers', cat_suspension, 899.99, 'new', 'KW', true),
  ('SUS-013', 'Air Suspension Compressor', 'Electronic air pump unit', cat_suspension, 299.99, 'new', 'AMK', false),
  ('SUS-014', 'Shock Mounting Kit Front', 'Top mount fitting kit', cat_suspension, 29.99, 'new', 'Sachs', false),
  ('SUS-015', 'Bump Stop Front Rubber', 'Suspension buffer', cat_suspension, 9.99, 'new', 'Febi', false),
  ('SUS-016', 'Dust Cover Boot Kit', 'Shock absorber gaiter', cat_suspension, 12.99, 'new', 'Monroe', false),
  ('SUS-017', 'Subframe Mounting Bush', 'Subframe to body bush', cat_suspension, 34.99, 'new', 'Lemförder', false),
  ('SUS-018', 'Track Rod End Outer', 'Tie rod end joint', cat_suspension, 19.99, 'new', 'TRW', false),
  ('SUS-019', 'Rear Axle Bush Kit Complete', 'Full rear bush set', cat_suspension, 79.99, 'new', 'Powerflex', false),
  ('SUS-020', 'Camber Adjustment Kit', 'Alignment bolts and cams', cat_suspension, 44.99, 'new', 'Eibach', false);

  -- ELECTRICAL (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('ELE-001', 'Car Battery 12V 70Ah', 'Maintenance-free calcium battery', cat_electrical, 119.99, 'new', 'Bosch', true),
  ('ELE-002', 'Car Battery 12V 90Ah', 'Heavy-duty AGM battery', cat_electrical, 149.99, 'new', 'Varta', true),
  ('ELE-003', 'Alternator 90A Reman', 'Reconditioned alternator', cat_electrical, 189.99, 'refurbished', 'Valeo', false),
  ('ELE-004', 'Alternator 120A High Output', 'Upgraded alternator', cat_electrical, 249.99, 'refurbished', 'Bosch', false),
  ('ELE-005', 'Starter Motor Reman', 'Reconditioned starter', cat_electrical, 129.99, 'refurbished', 'Valeo', false),
  ('ELE-006', 'Wiper Motor Front', 'Windscreen wiper motor', cat_electrical, 79.99, 'new', 'Bosch', false),
  ('ELE-007', 'Window Regulator Front Left', 'Electric window mechanism', cat_electrical, 89.99, 'new', 'Magneti Marelli', false),
  ('ELE-008', 'Central Locking Actuator', 'Door lock solenoid', cat_electrical, 34.99, 'new', 'Hella', false),
  ('ELE-009', 'Fuel Tank Sender Unit', 'Fuel level sensor', cat_electrical, 69.99, 'new', 'VDO', false),
  ('ELE-010', 'Horn Dual Tone 12V', 'Electric air horn pair', cat_electrical, 24.99, 'new', 'Hella', false),
  ('ELE-011', 'Headlight Switch', 'Light control rotary switch', cat_electrical, 39.99, 'new', 'Valeo', false),
  ('ELE-012', 'Indicator Flasher Relay', 'Turn signal relay unit', cat_electrical, 14.99, 'new', 'Hella', false),
  ('ELE-013', 'Glow Plugs Diesel Set 4pc', 'Ceramic diesel glow plugs', cat_electrical, 49.99, 'new', 'Beru', false),
  ('ELE-014', 'Fuse Box Main Distribution', 'Under-bonnet fuse box', cat_electrical, 89.99, 'new', 'Genuine', false),
  ('ELE-015', 'Relay 12V 30A Multi-Purpose', '4-pin changeover relay', cat_electrical, 9.99, 'new', 'Bosch', false),
  ('ELE-016', 'Lambda Oxygen Sensor', 'Pre-catalyst O2 sensor', cat_electrical, 79.99, 'new', 'NGK', false),
  ('ELE-017', 'MAF Mass Air Flow Sensor', 'Hot-wire MAF sensor', cat_electrical, 89.99, 'new', 'Bosch', false),
  ('ELE-018', 'Coolant Temperature Sensor', 'ECU temp sender', cat_electrical, 19.99, 'new', 'FAE', false),
  ('ELE-019', 'Reverse Light Switch', 'Gearbox backup switch', cat_electrical, 14.99, 'new', 'FAE', false),
  ('ELE-020', 'Headlight Bulb H7 55W Pair', 'Halogen headlight bulbs', cat_electrical, 12.99, 'new', 'Philips', false);

  -- FILTERS (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('FIL-001', 'Oil Filter Standard', 'Spin-on oil filter', cat_filters, 8.99, 'new', 'Mann', false),
  ('FIL-002', 'Oil Filter Performance', 'High-flow racing filter', cat_filters, 14.99, 'new', 'K&N', true),
  ('FIL-003', 'Air Filter Panel Type', 'OE replacement air filter', cat_filters, 12.99, 'new', 'Mann', false),
  ('FIL-004', 'Air Filter Washable Performance', 'Reusable cotton filter', cat_filters, 45.99, 'new', 'K&N', true),
  ('FIL-005', 'Cabin Filter Pollen', 'Standard pollen filter', cat_filters, 14.99, 'new', 'Bosch', false),
  ('FIL-006', 'Cabin Filter Activated Carbon', 'Anti-odour carbon filter', cat_filters, 19.99, 'new', 'Mann', false),
  ('FIL-007', 'Fuel Filter Petrol Inline', 'In-line petrol filter', cat_filters, 16.99, 'new', 'Mann', false),
  ('FIL-008', 'Fuel Filter Diesel with Separator', 'Water-trap diesel filter', cat_filters, 24.99, 'new', 'Purflux', false),
  ('FIL-009', 'Service Kit Basic', 'Oil and air filter combo', cat_filters, 29.99, 'new', 'Mann', true),
  ('FIL-010', 'Service Kit Complete', 'All filters service pack', cat_filters, 49.99, 'new', 'Mann', true),
  ('FIL-011', 'Transmission Filter Auto', 'Gearbox oil filter', cat_filters, 34.99, 'new', 'ZF', false),
  ('FIL-012', 'DPF Diesel Particulate Filter', 'Euro 5 DPF unit', cat_filters, 499.99, 'new', 'BM Catalysts', false),
  ('FIL-013', 'AdBlue SCR Filter', 'DEF system filter', cat_filters, 29.99, 'new', 'Mann', false),
  ('FIL-014', 'Crankcase Breather Filter', 'PCV filter element', cat_filters, 19.99, 'new', 'Mann', false),
  ('FIL-015', 'Hydraulic Power Steering Filter', 'PAS fluid filter', cat_filters, 24.99, 'new', 'Mann', false),
  ('FIL-016', 'Oil Filter Housing Complete', 'Filter housing assembly', cat_filters, 79.99, 'new', 'Mann', false),
  ('FIL-017', 'Fuel Filter Housing Diesel', 'Complete filter head', cat_filters, 89.99, 'new', 'Purflux', false),
  ('FIL-018', 'Air Filter Box Assembly', 'Complete airbox unit', cat_filters, 59.99, 'new', 'Genuine', false),
  ('FIL-019', 'Cabin Filter Housing', 'Filter box and cover', cat_filters, 39.99, 'new', 'Genuine', false),
  ('FIL-020', 'Oil Filter Wrench Tool', 'Universal filter wrench', cat_filters, 19.99, 'new', 'Sealey', false);

  -- EXHAUST (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('EXH-001', 'Front Exhaust Downpipe', 'Front pipe with flexi', cat_exhaust, 89.99, 'new', 'Bosal', false),
  ('EXH-002', 'Centre Exhaust Silencer', 'Middle box resonator', cat_exhaust, 79.99, 'new', 'Walker', false),
  ('EXH-003', 'Rear Exhaust Back Box', 'Rear silencer muffler', cat_exhaust, 69.99, 'new', 'Bosal', false),
  ('EXH-004', 'Full Exhaust System Cat-Back', 'Complete system from cat', cat_exhaust, 299.99, 'new', 'Walker', true),
  ('EXH-005', 'Catalytic Converter Euro 5', 'OE replacement cat', cat_exhaust, 289.99, 'new', 'BM Catalysts', false),
  ('EXH-006', 'Sports Cat High Flow', 'Performance 200-cell cat', cat_exhaust, 449.99, 'new', 'Milltek', true),
  ('EXH-007', 'Performance Exhaust Stainless', 'Cat-back sports exhaust', cat_exhaust, 599.99, 'new', 'Milltek', true),
  ('EXH-008', 'Exhaust Manifold Cast', 'Exhaust header manifold', cat_exhaust, 149.99, 'new', 'BM Catalysts', false),
  ('EXH-009', 'Turbo Manifold Tubular', 'Performance manifold', cat_exhaust, 399.99, 'new', 'Forge', false),
  ('EXH-010', 'Exhaust Gasket Kit Complete', 'All exhaust gaskets', cat_exhaust, 19.99, 'new', 'Elring', false),
  ('EXH-011', 'Exhaust Clamp Universal', 'Stainless steel clamp', cat_exhaust, 7.99, 'new', 'Bosal', false),
  ('EXH-012', 'Exhaust Hanger Rubber', 'Flexible mounting bracket', cat_exhaust, 5.99, 'new', 'Bosal', false),
  ('EXH-013', 'Exhaust Flange 3-Bolt', 'Connection flange', cat_exhaust, 12.99, 'new', 'Walker', false),
  ('EXH-014', 'Flexible Exhaust Pipe', 'Flexi section 2-inch', cat_exhaust, 34.99, 'new', 'Bosal', false),
  ('EXH-015', 'Lambda Sensor Bung Weld-In', 'O2 sensor boss', cat_exhaust, 9.99, 'new', 'Generic', false),
  ('EXH-016', 'Exhaust Assembly Paste', 'High-temp sealant 200g', cat_exhaust, 8.99, 'new', 'Holts', false),
  ('EXH-017', 'Chrome Exhaust Tip Oval', 'Decorative tail pipe', cat_exhaust, 29.99, 'new', 'Ripspeed', false),
  ('EXH-018', 'Heat Shield Exhaust', 'Thermal protection plate', cat_exhaust, 24.99, 'new', 'Genuine', false),
  ('EXH-019', 'EGR Delete Blanking Kit', 'EGR valve blanking plate', cat_exhaust, 39.99, 'new', 'Forge', false),
  ('EXH-020', 'DPF Differential Pressure Sensor', 'DPF pressure switch', cat_exhaust, 79.99, 'new', 'Bosch', false);

  -- COOLING (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('COL-001', 'Radiator Aluminium', 'Lightweight alloy radiator', cat_cooling, 159.99, 'new', 'Nissens', true),
  ('COL-002', 'Water Pump Mechanical', 'Belt-driven coolant pump', cat_cooling, 65.99, 'new', 'SKF', false),
  ('COL-003', 'Thermostat Housing Complete', 'Thermostat and housing', cat_cooling, 39.99, 'new', 'Wahler', false),
  ('COL-004', 'Radiator Hose Upper', 'Top rad hose moulded', cat_cooling, 24.99, 'new', 'Gates', false),
  ('COL-005', 'Radiator Hose Lower', 'Bottom rad hose shaped', cat_cooling, 24.99, 'new', 'Gates', false),
  ('COL-006', 'Coolant Expansion Tank', 'Header tank with cap', cat_cooling, 29.99, 'new', 'Febi', false),
  ('COL-007', 'Radiator Cooling Fan Electric', 'Axial fan with motor', cat_cooling, 89.99, 'new', 'VDO', false),
  ('COL-008', 'Viscous Fan Coupling', 'Temperature-controlled clutch', cat_cooling, 79.99, 'new', 'Sachs', false),
  ('COL-009', 'Coolant Temperature Sensor', 'ECU temp sender', cat_cooling, 19.99, 'new', 'FAE', false),
  ('COL-010', 'Radiator Pressure Cap', '1.2 bar radiator cap', cat_cooling, 9.99, 'new', 'Stant', false),
  ('COL-011', 'Heater Matrix Core', 'Cabin heater radiator', cat_cooling, 69.99, 'new', 'Nissens', false),
  ('COL-012', 'Heater Control Valve', 'Hot water flow valve', cat_cooling, 34.99, 'new', 'Genuine', false),
  ('COL-013', 'Coolant Antifreeze 5L', 'Long-life OAT coolant', cat_cooling, 19.99, 'new', 'Comma', false),
  ('COL-014', 'Intercooler Uprated', 'Front-mount intercooler', cat_cooling, 189.99, 'new', 'Forge', true),
  ('COL-015', 'Oil Cooler Engine', 'Oil-to-water cooler', cat_cooling, 119.99, 'new', 'Mahle', false),
  ('COL-016', 'Auxiliary Water Pump Electric', 'Secondary coolant pump', cat_cooling, 89.99, 'new', 'Pierburg', false),
  ('COL-017', 'Radiator Mounting Kit', 'Brackets and cushions', cat_cooling, 24.99, 'new', 'Febi', false),
  ('COL-018', 'Coolant Flange Plastic', 'Coolant outlet pipe', cat_cooling, 19.99, 'new', 'Febi', false),
  ('COL-019', 'Heater Hose Kit', 'Complete heater hose set', cat_cooling, 44.99, 'new', 'Gates', false),
  ('COL-020', 'Coolant Level Sensor', 'Low coolant warning switch', cat_cooling, 14.99, 'new', 'VDO', false);

  -- TRANSMISSION (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('TRA-001', 'Clutch Kit 3-Piece', 'Clutch disc, pressure plate, bearing', cat_transmission, 179.99, 'new', 'LuK', true),
  ('TRA-002', 'Clutch Release Bearing', 'Throwout bearing', cat_transmission, 29.99, 'new', 'SKF', false),
  ('TRA-003', 'Clutch Slave Cylinder', 'Hydraulic clutch actuator', cat_transmission, 49.99, 'new', 'LuK', false),
  ('TRA-004', 'Clutch Master Cylinder', 'Clutch pedal cylinder', cat_transmission, 69.99, 'new', 'TRW', false),
  ('TRA-005', 'Flywheel Dual Mass', 'DMF for smooth shifting', cat_transmission, 349.99, 'new', 'LuK', false),
  ('TRA-006', 'Flywheel Solid Conversion', 'Single-mass flywheel', cat_transmission, 199.99, 'new', 'Sachs', false),
  ('TRA-007', 'Gearbox Mount', 'Transmission rubber mount', cat_transmission, 39.99, 'new', 'Corteco', false),
  ('TRA-008', 'Driveshaft CV Joint Outer', 'Constant velocity joint', cat_transmission, 89.99, 'new', 'GKN', false),
  ('TRA-009', 'Driveshaft CV Boot Kit', 'Split boot with grease', cat_transmission, 19.99, 'new', 'GKN', false),
  ('TRA-010', 'Gearbox Oil ATF 1L', 'Automatic transmission fluid', cat_transmission, 14.99, 'new', 'Castrol', false),
  ('TRA-011', 'Gearbox Oil Manual MTF 1L', 'Manual gearbox oil', cat_transmission, 12.99, 'new', 'Castrol', false),
  ('TRA-012', 'Gear Linkage Bush Kit', 'Selector mechanism bushes', cat_transmission, 24.99, 'new', 'Febi', false),
  ('TRA-013', 'Gear Selector Cable', 'Shift cable assembly', cat_transmission, 54.99, 'new', 'Genuine', false),
  ('TRA-014', 'Torque Converter Auto', 'Torque converter assembly', cat_transmission, 399.99, 'refurbished', 'ZF', false),
  ('TRA-015', 'Propshaft Centre Bearing', 'Driveshaft carrier bearing', cat_transmission, 59.99, 'new', 'GKN', false),
  ('TRA-016', 'Differential Oil 75W-90 1L', 'Limited-slip diff oil', cat_transmission, 16.99, 'new', 'Castrol', false),
  ('TRA-017', 'Clutch Pedal Switch', 'Clutch position sensor', cat_transmission, 19.99, 'new', 'FAE', false),
  ('TRA-018', 'Reversing Light Switch', 'Backup lamp switch', cat_transmission, 14.99, 'new', 'FAE', false),
  ('TRA-019', 'Speedometer Sensor', 'Vehicle speed sensor', cat_transmission, 34.99, 'new', 'VDO', false),
  ('TRA-020', 'Short Shifter Kit', 'Quick-shift upgrade kit', cat_transmission, 149.99, 'new', 'B&M', false);

  -- INTERIOR (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('INT-001', 'Floor Mat Set Rubber', 'All-weather rubber mats', cat_interior, 39.99, 'new', 'Michelin', false),
  ('INT-002', 'Floor Mat Set Carpet', 'Premium velour car mats', cat_interior, 59.99, 'new', 'Genuine', false),
  ('INT-003', 'Steering Wheel Cover Leather', 'Genuine leather wrap', cat_interior, 24.99, 'new', 'Richbrook', false),
  ('INT-004', 'Gear Knob Leather', 'Replacement gear knob', cat_interior, 29.99, 'new', 'Richbrook', false),
  ('INT-005', 'Seat Covers Full Set', 'Universal seat protectors', cat_interior, 79.99, 'new', 'Halfords', false),
  ('INT-006', 'Sun Visor Left', 'Driver side sun visor', cat_interior, 34.99, 'new', 'Genuine', false),
  ('INT-007', 'Interior Door Handle', 'Door pull handle', cat_interior, 19.99, 'new', 'Genuine', false),
  ('INT-008', 'Centre Console Armrest', 'Storage armrest box', cat_interior, 49.99, 'new', 'Genuine', false),
  ('INT-009', 'Dashboard Trim Panel', 'Centre dash fascia', cat_interior, 89.99, 'new', 'Genuine', false),
  ('INT-010', 'Air Vent Grille', 'Dashboard air vent', cat_interior, 14.99, 'new', 'Genuine', false),
  ('INT-011', 'Cup Holder Insert', 'Centre console cup holder', cat_interior, 24.99, 'new', 'Genuine', false),
  ('INT-012', 'Boot Carpet Liner', 'Trunk floor mat', cat_interior, 44.99, 'new', 'Genuine', false),
  ('INT-013', 'Parcel Shelf', 'Rear luggage cover', cat_interior, 69.99, 'new', 'Genuine', false),
  ('INT-014', 'Cabin Light LED', 'Interior dome light', cat_interior, 19.99, 'new', 'Philips', false),
  ('INT-015', 'Cigarette Lighter Socket', '12V power outlet', cat_interior, 12.99, 'new', 'Hella', false),
  ('INT-016', 'Seat Belt Buckle', 'Replacement seatbelt clasp', cat_interior, 34.99, 'new', 'Genuine', false),
  ('INT-017', 'Window Regulator Switch', 'Electric window button', cat_interior, 29.99, 'new', 'Genuine', false),
  ('INT-018', 'Mirror Adjuster Switch', 'Electric mirror control', cat_interior, 24.99, 'new', 'Genuine', false),
  ('INT-019', 'Handbrake Gaiter Leather', 'Handbrake boot cover', cat_interior, 19.99, 'new', 'Richbrook', false),
  ('INT-020', 'Air Freshener Long-Lasting', 'Car interior fragrance', cat_interior, 7.99, 'new', 'Little Trees', false);

  -- EXTERIOR (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('EXT-001', 'Door Mirror Left Heated', 'Electric heated wing mirror', cat_exterior, 89.99, 'new', 'TYC', false),
  ('EXT-002', 'Door Mirror Right Heated', 'Electric heated door mirror', cat_exterior, 89.99, 'new', 'TYC', false),
  ('EXT-003', 'Headlight Assembly Left LED', 'LED headlamp unit', cat_exterior, 245.99, 'new', 'Hella', true),
  ('EXT-004', 'Headlight Assembly Right Halogen', 'Halogen headlight unit', cat_exterior, 129.99, 'new', 'TYC', false),
  ('EXT-005', 'Tail Light Cluster Left', 'Rear light assembly', cat_exterior, 79.99, 'new', 'TYC', false),
  ('EXT-006', 'Tail Light Cluster Right', 'Back lamp unit', cat_exterior, 79.99, 'new', 'TYC', false),
  ('EXT-007', 'Front Bumper Primed', 'Front bumper cover', cat_exterior, 149.99, 'new', 'Genuine', false),
  ('EXT-008', 'Rear Bumper Primed', 'Rear bumper cover', cat_exterior, 139.99, 'new', 'Genuine', false),
  ('EXT-009', 'Bonnet Hood', 'Engine hood panel', cat_exterior, 199.99, 'new', 'Genuine', false),
  ('EXT-010', 'Front Wing Fender Left', 'Front quarter panel', cat_exterior, 119.99, 'new', 'Genuine', false),
  ('EXT-011', 'Door Shell Front Left', 'Complete door panel', cat_exterior, 299.99, 'used', 'Genuine', false),
  ('EXT-012', 'Windscreen Wiper Blade Set', 'Flat wiper blades pair', cat_exterior, 24.99, 'new', 'Bosch', false),
  ('EXT-013', 'Rear Wiper Blade', 'Rear window wiper', cat_exterior, 12.99, 'new', 'Bosch', false),
  ('EXT-014', 'Number Plate Light', 'License plate lamp', cat_exterior, 14.99, 'new', 'Hella', false),
  ('EXT-015', 'Front Grille', 'Radiator grille', cat_exterior, 89.99, 'new', 'Genuine', false),
  ('EXT-016', 'Fog Light Left', 'Front fog lamp', cat_exterior, 49.99, 'new', 'TYC', false),
  ('EXT-017', 'Wheel Arch Liner Front', 'Inner wing splash guard', cat_exterior, 29.99, 'new', 'Genuine', false),
  ('EXT-018', 'Door Handle Outer', 'Exterior door pull', cat_exterior, 34.99, 'new', 'Genuine', false),
  ('EXT-019', 'Bonnet Gas Strut', 'Hood support strut', cat_exterior, 19.99, 'new', 'Febi', false),
  ('EXT-020', 'Aerial Antenna Mast', 'Radio antenna rod', cat_exterior, 24.99, 'new', 'Genuine', false);

  -- WHEELS & TYRES (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('WHL-001', 'Alloy Wheel 17" Silver', 'Single alloy wheel', cat_wheels, 149.99, 'new', 'Borbet', true),
  ('WHL-002', 'Alloy Wheel 18" Black', 'Single black alloy', cat_wheels, 169.99, 'new', 'OZ Racing', true),
  ('WHL-003', 'Steel Wheel 16"', 'Single steel rim', cat_wheels, 59.99, 'new', 'Alcar', false),
  ('WHL-004', 'Wheel Bolt Set M14', 'Pack of 20 bolts', cat_wheels, 29.99, 'new', 'McGard', false),
  ('WHL-005', 'Locking Wheel Nuts', 'Anti-theft wheel locks', cat_wheels, 34.99, 'new', 'McGard', false),
  ('WHL-006', 'Wheel Hub Centre Cap', 'Alloy wheel centre badge', cat_wheels, 12.99, 'new', 'Genuine', false),
  ('WHL-007', 'Wheel Spacer 10mm Pair', 'Track widening spacers', cat_wheels, 39.99, 'new', 'Eibach', false),
  ('WHL-008', 'Wheel Alignment Kit', 'Camber bolt kit', cat_wheels, 44.99, 'new', 'H&R', false),
  ('WHL-009', 'Tyre Pressure Sensor TPMS', 'Valve-mounted sensor', cat_wheels, 49.99, 'new', 'Schrader', false),
  ('WHL-010', 'Valve Stems Rubber', 'Pack of 4 valves', cat_wheels, 7.99, 'new', 'Generic', false),
  ('WHL-011', 'Spare Wheel Space Saver', '16" emergency spare', cat_wheels, 89.99, 'new', 'Genuine', false),
  ('WHL-012', 'Wheel Cleaning Brush', 'Alloy wheel cleaner brush', cat_wheels, 14.99, 'new', 'Autoglym', false),
  ('WHL-013', 'Tyre Inflator Portable', 'Electric tyre pump', cat_wheels, 39.99, 'new', 'Ring', false),
  ('WHL-014', 'Tyre Repair Kit', 'Emergency puncture repair', cat_wheels, 19.99, 'new', 'Holts', false),
  ('WHL-015', 'Wheel Arch Extension Kit', 'Wide-body flare kit', cat_wheels, 199.99, 'new', 'Universal', false),
  ('WHL-016', 'Hub-Centric Rings Set', 'Wheel centring rings', cat_wheels, 16.99, 'new', 'Generic', false),
  ('WHL-017', 'Wheel Stud Conversion Kit', 'Bolt to stud conversion', cat_wheels, 79.99, 'new', 'H&R', false),
  ('WHL-018', 'Tyre Pressure Gauge Digital', 'Electronic tyre gauge', cat_wheels, 24.99, 'new', 'Michelin', false),
  ('WHL-019', 'Wheel Cleaner Spray 500ml', 'Alloy wheel cleaner', cat_wheels, 9.99, 'new', 'Autoglym', false),
  ('WHL-020', 'Wheel Wax Polish', 'Alloy wheel sealant', cat_wheels, 14.99, 'new', 'Autoglym', false);

  -- STEERING (20)
  INSERT INTO products (sku, title, description, category_id, price_eur, condition, manufacturer, is_featured) VALUES
  ('STE-001', 'Power Steering Pump', 'Hydraulic PAS pump', cat_steering, 149.99, 'refurbished', 'ZF', false),
  ('STE-002', 'Steering Rack Complete', 'Rack and pinion assembly', cat_steering, 299.99, 'refurbished', 'TRW', false),
  ('STE-003', 'Track Rod End Left', 'Outer tie rod end', cat_steering, 19.99, 'new', 'TRW', false),
  ('STE-004', 'Track Rod End Right', 'Tie rod end joint', cat_steering, 19.99, 'new', 'TRW', false),
  ('STE-005', 'Steering Column', 'Column with universal joints', cat_steering, 189.99, 'new', 'Genuine', false),
  ('STE-006', 'Power Steering Hose High Pressure', 'PAS pressure line', cat_steering, 49.99, 'new', 'Gates', false),
  ('STE-007', 'Power Steering Reservoir', 'Fluid reservoir tank', cat_steering, 29.99, 'new', 'Febi', false),
  ('STE-008', 'Power Steering Fluid 1L', 'ATF Dexron III', cat_steering, 12.99, 'new', 'Castrol', false),
  ('STE-009', 'Steering Wheel Sport', 'Aftermarket steering wheel', cat_steering, 149.99, 'new', 'MOMO', true),
  ('STE-010', 'Steering Wheel Boss Kit', 'Wheel adapter hub', cat_steering, 49.99, 'new', 'Generic', false),
  ('STE-011', 'Clock Spring Airbag', 'Steering wheel spiral cable', cat_steering, 79.99, 'new', 'Genuine', false),
  ('STE-012', 'Steering Damper', 'Steering stabilizer shock', cat_steering, 59.99, 'new', 'Sachs', false),
  ('STE-013', 'Steering Coupling Joint', 'U-joint for column', cat_steering, 34.99, 'new', 'Febi', false),
  ('STE-014', 'Track Rod Adjuster Sleeve', 'Tie rod adjustment tube', cat_steering, 14.99, 'new', 'TRW', false),
  ('STE-015', 'Steering Gaiter Boot', 'Rack and pinion boot', cat_steering, 16.99, 'new', 'TRW', false),
  ('STE-016', 'Power Steering Cooler', 'PAS fluid radiator', cat_steering, 69.99, 'new', 'Genuine', false),
  ('STE-017', 'Steering Angle Sensor', 'ESP steering sensor', cat_steering, 89.99, 'new', 'Bosch', false),
  ('STE-018', 'Quick Release Steering Boss', 'Detachable wheel hub', cat_steering, 89.99, 'new', 'NRG', false),
  ('STE-019', 'Steering Lock Barrel', 'Ignition steering lock', cat_steering, 59.99, 'new', 'Genuine', false),
  ('STE-020', 'Steering Wheel Spacer', 'Wheel extension boss', cat_steering, 29.99, 'new', 'Generic', false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function to create all products
SELECT seed_products();

-- Clean up the function
DROP FUNCTION seed_products();

-- =====================================================
-- CREATE PRODUCT IMAGES
-- =====================================================

INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  id, 
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&auto=format' as image_url,
  title, 
  0, 
  true
FROM public.products;

-- =====================================================
-- CREATE INVENTORY
-- =====================================================

INSERT INTO public.inventory (product_id, quantity, reserved_quantity, reorder_level)
SELECT id, 
  CASE 
    WHEN price_eur < 30 THEN 150
    WHEN price_eur < 100 THEN 75
    WHEN price_eur < 300 THEN 40
    ELSE 15
  END as quantity,
  0,
  CASE 
    WHEN price_eur < 30 THEN 30
    WHEN price_eur < 100 THEN 15
    WHEN price_eur < 300 THEN 8
    ELSE 3
  END as reorder_level
FROM public.products;

-- =====================================================
-- PAYMENT METHODS
-- =====================================================

INSERT INTO public.payment_methods (name, type, is_enabled, instructions, config) VALUES
('PayPal', 'paypal', true, 'Pay securely with PayPal. You will be redirected to complete payment.', '{"fee_percentage": 2.9, "fee_fixed_eur": 0.30}'::jsonb),
('Bank Transfer', 'bank_transfer', true, 'Transfer to our bank account. Order processed after payment received.', '{"bank_name": "European Bank", "iban": "DE89370400440532013000", "bic": "COBADEFFXXX"}'::jsonb),
('Card Payment (Stripe)', 'stripe', true, 'Pay with credit or debit card via secure Stripe checkout.', '{"fee_percentage": 1.5, "fee_fixed_eur": 0.25}'::jsonb);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count products per category
SELECT c.name, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.name, c.display_order
ORDER BY c.display_order;

-- Show total products
SELECT COUNT(*) as total_products FROM products;

-- Show featured products
SELECT COUNT(*) as featured_products FROM products WHERE is_featured = true;

-- Show inventory summary
SELECT 
  CASE 
    WHEN quantity > 100 THEN 'High Stock (>100)'
    WHEN quantity > 50 THEN 'Medium Stock (50-100)'
    WHEN quantity > 20 THEN 'Low Stock (20-50)'
    ELSE 'Very Low Stock (<20)'
  END as stock_level,
  COUNT(*) as product_count
FROM inventory
GROUP BY stock_level
ORDER BY stock_level;
