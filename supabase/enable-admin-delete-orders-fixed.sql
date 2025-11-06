-- Enable Admin Delete Permissions for Orders (FIXED - No ambiguous references)
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "allow_admin_delete_orders" ON orders;
DROP POLICY IF EXISTS "allow_admin_delete_order_items" ON order_items;

-- Grant DELETE permission to admins on orders table
CREATE POLICY "allow_admin_delete_orders" ON orders FOR DELETE
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid() 
    AND public.users.role = 'admin'
  )
);

-- Grant DELETE permission to admins on order_items table
CREATE POLICY "allow_admin_delete_order_items" ON order_items FOR DELETE
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid() 
    AND public.users.role = 'admin'
  )
);

-- Verify policies created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual as using_expression
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items') 
AND policyname LIKE '%admin_delete%'
ORDER BY tablename, policyname;

-- Success message
SELECT '✓ Admin delete permissions enabled successfully!' as result;
