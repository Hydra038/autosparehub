/**
 * INVENTORY FIX - Final Version
 * This will actually insert the inventory records
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://hfkksqchjubxvxatzrae.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3ODgyOCwiZXhwIjoyMDc3ODU0ODI4fQ.kpIAxDRyShSQ3nZFstfZBCFkWoLnBYoYlmp9rhRnOOg'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fixInventory() {
  console.log('🔧 FIXING INVENTORY...\n')

  try {
    // Step 1: Get all products
    console.log('📦 Step 1: Fetching all products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, sku, title')

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`)
    }

    console.log(`✅ Found ${products.length} products\n`)

    // Step 2: Check existing inventory
    console.log('📊 Step 2: Checking existing inventory...')
    const { data: existingInventory, error: invError } = await supabase
      .from('inventory')
      .select('product_id, quantity')

    if (invError) {
      throw new Error(`Failed to fetch inventory: ${invError.message}`)
    }

    console.log(`✅ Found ${existingInventory.length} existing inventory records\n`)

    const existingProductIds = new Set(existingInventory.map(inv => inv.product_id))

    // Step 3: Find products without inventory
    const productsNeedingInventory = products.filter(p => !existingProductIds.has(p.id))
    console.log(`📝 Step 3: ${productsNeedingInventory.length} products need inventory records\n`)

    // Step 4: Insert inventory in batches
    if (productsNeedingInventory.length > 0) {
      console.log('💾 Step 4: Inserting inventory records...')
      
      const batchSize = 50
      let inserted = 0
      
      for (let i = 0; i < productsNeedingInventory.length; i += batchSize) {
        const batch = productsNeedingInventory.slice(i, i + batchSize)
        
        const inventoryRecords = batch.map(p => ({
          product_id: p.id,
          quantity: 50,
          reserved_quantity: 0,
          reorder_level: 10,
          reorder_quantity: 50
        }))

        const { data, error: insertError } = await supabase
          .from('inventory')
          .insert(inventoryRecords)
          .select()

        if (insertError) {
          console.error(`❌ Batch ${i / batchSize + 1} failed: ${insertError.message}`)
          console.error('Details:', insertError)
        } else {
          inserted += batch.length
          console.log(`   ✅ Inserted batch ${i / batchSize + 1}: ${batch.length} records`)
        }
      }

      console.log(`\n✅ Total inserted: ${inserted} inventory records\n`)
    }

    // Step 5: Update zero-quantity inventory
    console.log('🔄 Step 5: Updating products with zero stock...')
    const { data: updated, error: updateError } = await supabase
      .from('inventory')
      .update({
        quantity: 50,
        reserved_quantity: 0,
        last_restocked_at: new Date().toISOString()
      })
      .eq('quantity', 0)
      .select()

    if (updateError) {
      console.error(`❌ Update failed: ${updateError.message}`)
    } else {
      console.log(`✅ Updated ${updated?.length || 0} products to 50 units\n`)
    }

    // Step 6: Final verification
    console.log('🔍 Step 6: Final verification...')
    const { data: finalCheck, error: checkError } = await supabase
      .from('inventory')
      .select('quantity')

    if (checkError) {
      throw new Error(`Verification failed: ${checkError.message}`)
    }

    const inStock = finalCheck.filter(inv => inv.quantity > 0).length
    const outOfStock = finalCheck.filter(inv => inv.quantity === 0).length

    console.log('\n' + '='.repeat(50))
    console.log('📊 FINAL RESULTS:')
    console.log('='.repeat(50))
    console.log(`Total products: ${products.length}`)
    console.log(`Inventory records: ${finalCheck.length}`)
    console.log(`✅ In stock (quantity > 0): ${inStock}`)
    console.log(`❌ Out of stock (quantity = 0): ${outOfStock}`)
    console.log('='.repeat(50))

    if (inStock === products.length) {
      console.log('\n🎉 SUCCESS! All products are now in stock!')
      console.log('🔄 Refresh your website: http://localhost:3001/products\n')
    } else {
      console.log('\n⚠️ Warning: Some products still out of stock')
      console.log('Try running this script again or check Supabase dashboard\n')
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Run it
fixInventory()
