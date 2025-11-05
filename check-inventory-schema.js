const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkInventorySchema() {
  console.log('\n🔍 CHECKING INVENTORY TABLE STRUCTURE...\n')
  
  // Get one inventory record with ALL columns
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  console.log('📊 Sample Inventory Records:')
  console.log(JSON.stringify(data, null, 2))
  
  // Check actual stock calculation
  console.log('\n📊 Checking stock with product details:')
  const { data: withProducts, error: err2 } = await supabase
    .from('inventory')
    .select(`
      *,
      products (id, sku, title)
    `)
    .limit(10)
  
  if (!err2 && withProducts) {
    console.log('\n📦 Products with inventory:')
    withProducts.forEach(inv => {
      const available = inv.quantity - (inv.reserved_quantity || 0)
      console.log(`${inv.products.sku}: quantity=${inv.quantity}, reserved=${inv.reserved_quantity || 0}, available=${available}`)
    })
  }
}

checkInventorySchema()
