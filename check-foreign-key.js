const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkRelationship() {
  console.log('\n🔍 CHECKING PRODUCT-INVENTORY RELATIONSHIP...\n')
  
  // Get a product
  const { data: product } = await supabase
    .from('products')
    .select('id, sku, title')
    .eq('sku', 'ENG-001')
    .single()
  
  console.log('Product:', product)
  
  // Check if inventory exists for this product
  const { data: inventory, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('product_id', product.id)
  
  console.log('\nInventory for this product:')
  console.log(inventory)
  
  if (inventory && inventory.length > 0) {
    console.log('\n✅ Inventory exists!')
    console.log('But the JOIN is returning NULL...')
    console.log('\n🔍 This means the foreign key relationship is not set up correctly.')
    console.log('\nThe inventory table needs a foreign key:')
    console.log('  product_id -> products(id)')
    console.log('\nAnd Supabase needs to know about this relationship for the JOIN to work.')
  }
  
  // Test direct SQL-style query
  console.log('\n\n🔍 Testing with manual JOIN in SQL...')
  const { data: manualJoin, error: joinError } = await supabase.rpc('get_products_with_inventory')
  
  if (joinError) {
    console.log('❌ RPC function not found (expected)')
    console.log('\nLet\'s try a different approach - checking the schema:')
    
    // Check what columns inventory table actually has
    const { data: invSample } = await supabase
      .from('inventory')
      .select('*')
      .limit(1)
      .single()
    
    console.log('\nInventory table columns:', Object.keys(invSample || {}))
  }
}

checkRelationship()
