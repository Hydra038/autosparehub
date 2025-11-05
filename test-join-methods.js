const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testDifferentJoinMethods() {
  console.log('\n🔍 TESTING DIFFERENT JOIN METHODS...\n')
  
  // Method 1: Supabase automatic join (currently failing)
  console.log('Method 1: Supabase automatic join syntax')
  console.log('Query: products.select("*, inventory(quantity, reserved_quantity)")')
  const { data: method1, error: error1 } = await supabase
    .from('products')
    .select('id, sku, inventory(quantity, reserved_quantity)')
    .limit(3)
  
  console.log('Result:', method1?.[0]?.inventory ? '✅ Works' : '❌ Returns NULL')
  console.log('Sample:', JSON.stringify(method1?.[0], null, 2))
  
  // Method 2: Manual join using product_id explicitly
  console.log('\n\nMethod 2: Trying with explicit product_id reference')
  console.log('Query: products.select("*, inventory!inventory_product_id_fkey(...)")')
  const { data: method2, error: error2 } = await supabase
    .from('products')
    .select('id, sku, inventory!inventory_product_id_fkey(quantity, reserved_quantity)')
    .limit(3)
  
  console.log('Result:', method2?.[0]?.inventory ? '✅ Works' : '❌ Returns NULL')
  if (error2) console.log('Error:', error2.message)
  console.log('Sample:', JSON.stringify(method2?.[0], null, 2))
  
  // Method 3: Get inventory separately and match manually
  console.log('\n\nMethod 3: Separate queries (fallback)')
  const { data: products } = await supabase
    .from('products')
    .select('id, sku')
    .limit(3)
  
  if (products && products.length > 0) {
    const productIds = products.map(p => p.id)
    const { data: inventories } = await supabase
      .from('inventory')
      .select('product_id, quantity, reserved_quantity')
      .in('product_id', productIds)
    
    console.log('Products:', products.length)
    console.log('Inventories:', inventories?.length || 0)
    
    if (inventories && inventories.length > 0) {
      console.log('✅ Can fetch separately and match manually')
      console.log('Sample inventory:', inventories[0])
    }
  }
  
  console.log('\n\n' + '='.repeat(60))
  console.log('📋 DIAGNOSIS:')
  console.log('='.repeat(60))
  
  if (!method1?.[0]?.inventory && !method2?.[0]?.inventory) {
    console.log('\n❌ Supabase automatic joins are not working')
    console.log('\n🔧 WORKAROUND: Update your code to fetch inventory separately')
    console.log('\nI can modify lib/db/products.ts to use Method 3 (separate queries)')
    console.log('This will work immediately without needing database changes.')
  } else if (method2?.[0]?.inventory) {
    console.log('\n✅ Method 2 works! Use explicit foreign key name in queries')
  } else if (method1?.[0]?.inventory) {
    console.log('\n✅ Automatic joins work!')
  }
}

testDifferentJoinMethods()
