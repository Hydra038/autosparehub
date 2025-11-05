const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkInventoryFormat() {
  console.log('\n🔍 CHECKING ACTUAL QUERY FORMAT...\n')
  
  // Test the EXACT query from lib/db/products.ts
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, alt_text, is_primary, display_order),
      product_images(id, image_url, alt_text, is_primary, display_order),
      inventory(quantity, reserved_quantity)
    `)
    .eq('is_active', true)
    .limit(2)
  
  if (error) {
    console.log('❌ Error:', error.message)
    return
  }
  
  console.log('✅ Query successful!\n')
  console.log('First product inventory format:')
  console.log(JSON.stringify({
    sku: data[0].sku,
    inventory: data[0].inventory,
    inventoryType: Array.isArray(data[0].inventory) ? 'ARRAY' : typeof data[0].inventory
  }, null, 2))
  
  if (Array.isArray(data[0].inventory)) {
    console.log('\n✅ Inventory is returned as ARRAY')
    console.log(`   Length: ${data[0].inventory.length}`)
    if (data[0].inventory.length > 0) {
      console.log(`   First item: ${JSON.stringify(data[0].inventory[0])}`)
    }
  } else if (data[0].inventory === null) {
    console.log('\n❌ Inventory is NULL!')
  } else {
    console.log('\n⚠️  Inventory is returned as OBJECT (not array)')
    console.log('   Your ProductCard expects array: product.inventory?.[0]')
    console.log('   But Supabase returns: product.inventory (object)')
  }
  
  // Check actual stock calculation
  console.log('\n📊 Stock calculation:')
  data.forEach(product => {
    let stock = 0
    if (Array.isArray(product.inventory) && product.inventory[0]) {
      stock = product.inventory[0].quantity - product.inventory[0].reserved_quantity
    } else if (product.inventory && typeof product.inventory === 'object') {
      stock = product.inventory.quantity - product.inventory.reserved_quantity
    }
    console.log(`   ${product.sku}: ${stock} units (${stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'})`)
  })
}

checkInventoryFormat()
