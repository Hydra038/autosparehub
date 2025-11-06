-- Enable admin users to delete orders and order items
-- Run this in Supabase SQL Editor if delete is not working

-- Check current policies for orders table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;

-- Drop existing delete policies if they exist
DROP POLICY IF EXISTS "allow_admin_delete_orders" ON orders;
DROP POLICY IF EXISTS "allow_admin_delete_order_items" ON order_items;

-- Create policy for admins to delete orders
CREATE POLICY "allow_admin_delete_orders"
ON orders
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN users ON users.id = auth.users.id
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Create policy for admins to delete order_items
CREATE POLICY "allow_admin_delete_order_items"
ON order_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN users ON users.id = auth.users.id
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Verify policies were created
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('orders', 'order_items')
AND cmd = 'DELETE'
ORDER BY tablename;

SELECT '✓ Admin delete policies created successfully!' as result;
