/**
 * Direct PostgreSQL Connection Script
 * Fix Inventory - Set all products to IN STOCK
 * 
 * Run with: node fix-inventory-direct.js
 */

const { createClient } = require('@supabase/supabase-js')

// Your Supabase credentials
const SUPABASE_URL = 'https://hfkksqchjubxvxatzrae.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3ODgyOCwiZXhwIjoyMDc3ODU0ODI4fQ.kpIAxDRyShSQ3nZFstfZBCFkWoLnBYoYlmp9rhRnOOg'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkAndFixInventory() {
  console.log('🔍 Checking inventory status...\n')

  try {
    // STEP 1: Check current state
    console.log('📊 STEP 1: Checking current inventory state...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, 
        sku, 
        title,
        inventory (
          id,
          quantity,
          reserved_quantity
        )
      `)
      .limit(1000)

    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`)
    }

    console.log(`✅ Total products: ${products.length}`)

    const productsWithInventory = products.filter(p => p.inventory && p.inventory.length > 0)
    const productsInStock = products.filter(p => p.inventory?.[0]?.quantity > 0)
    const productsOutOfStock = products.filter(p => !p.inventory?.[0] || p.inventory[0].quantity === 0)

    console.log(`📦 Products with inventory record: ${productsWithInventory.length}`)
    console.log(`✅ Products in stock: ${productsInStock.length}`)
    console.log(`❌ Products out of stock: ${productsOutOfStock.length}\n`)

    if (productsOutOfStock.length === 0) {
      console.log('🎉 All products already have stock! Nothing to fix.\n')
      return
    }

    // STEP 2: Fix products without inventory records
    const productsWithoutInventory = products.filter(p => !p.inventory || p.inventory.length === 0)
    
    if (productsWithoutInventory.length > 0) {
      console.log(`📝 STEP 2: Adding inventory for ${productsWithoutInventory.length} products...`)
      
      const inventoryRecords = productsWithoutInventory.map(p => ({
        product_id: p.id,
        quantity: 50,
        reserved_quantity: 0,
        reorder_level: 10,
        reorder_quantity: 50
      }))

      const { error: insertError } = await supabase
        .from('inventory')
        .insert(inventoryRecords)

      if (insertError) {
        console.error(`❌ Error adding inventory: ${insertError.message}`)
      } else {
        console.log(`✅ Added inventory records for ${productsWithoutInventory.length} products\n`)
      }
    }

    // STEP 3: Update products with 0 quantity
    const productsWithZeroStock = products.filter(
      p => p.inventory?.[0] && p.inventory[0].quantity === 0
    )

    if (productsWithZeroStock.length > 0) {
      console.log(`📝 STEP 3: Updating ${productsWithZeroStock.length} products with zero stock...`)
      
      for (const product of productsWithZeroStock) {
        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            quantity: 50,
            reserved_quantity: 0,
            last_restocked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('product_id', product.id)

        if (updateError) {
          console.error(`❌ Error updating ${product.sku}: ${updateError.message}`)
        }
      }
      console.log(`✅ Updated ${productsWithZeroStock.length} products to 50 units\n`)
    }

    // STEP 4: Verify the fix
    console.log('📊 STEP 4: Verifying fix...')
    const { data: updatedProducts, error: verifyError } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        title,
        inventory (
          quantity,
          reserved_quantity
        )
      `)
      .limit(1000)

    if (verifyError) {
      throw new Error(`Error verifying: ${verifyError.message}`)
    }

    const nowInStock = updatedProducts.filter(p => p.inventory?.[0]?.quantity > 0)
    const stillOutOfStock = updatedProducts.filter(p => !p.inventory?.[0] || p.inventory[0].quantity === 0)

    console.log(`\n✅ Products now in stock: ${nowInStock.length}`)
    console.log(`❌ Products still out of stock: ${stillOutOfStock.length}`)

    if (stillOutOfStock.length > 0) {
      console.log(`\n⚠️ Some products still out of stock:`)
      stillOutOfStock.slice(0, 5).forEach(p => {
        console.log(`   - ${p.sku}: ${p.title}`)
      })
    }

    console.log('\n🎉 INVENTORY FIX COMPLETE!')
    console.log('🔄 Refresh your website to see products in stock!\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the script
checkAndFixInventory()
