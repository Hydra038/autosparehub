-- =====================================================
-- UPDATE PRODUCT IMAGES WITH BETTER URLs
-- =====================================================
-- Run this in Supabase SQL Editor to fix image display

-- Delete existing placeholder images
DELETE FROM product_images;

-- Insert better quality placeholder images using Unsplash
-- Each category gets a relevant automotive image
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN c.slug = 'engine-parts' THEN 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop'
    WHEN c.slug = 'brakes' THEN 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop'
    WHEN c.slug = 'suspension' THEN 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop'
    WHEN c.slug = 'electrical' THEN 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=600&fit=crop'
    WHEN c.slug = 'filters' THEN 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop'
    WHEN c.slug = 'exhaust' THEN 'https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?w=600&h=600&fit=crop'
    WHEN c.slug = 'cooling' THEN 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=600&fit=crop'
    WHEN c.slug = 'transmission' THEN 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop'
    WHEN c.slug = 'interior' THEN 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=600&fit=crop'
    WHEN c.slug = 'exterior' THEN 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=600&fit=crop'
    WHEN c.slug = 'wheels-tyres' THEN 'https://images.unsplash.com/photo-1606767661833-23a3cd01c136?w=600&h=600&fit=crop'
    WHEN c.slug = 'steering' THEN 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop'
  END as image_url,
  p.title,
  0,
  true
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Verify the update
SELECT 
  c.name as category,
  COUNT(pi.id) as image_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
LEFT JOIN product_images pi ON pi.product_id = p.id
GROUP BY c.name, c.display_order
ORDER BY c.display_order;
