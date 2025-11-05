/**
 * Database Connection Test
 * Verify we can actually read from and write to the database
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://hfkksqchjubxvxatzrae.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma2tzcWNoanVieHZ4YXR6cmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3ODgyOCwiZXhwIjoyMDc3ODU0ODI4fQ.kpIAxDRyShSQ3nZFstfZBCFkWoLnBYoYlmp9rhRnOOg'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testConnection() {
  console.log('🔍 TESTING DATABASE CONNECTION...\n')
  console.log('URL:', SUPABASE_URL)
  console.log('Using: Service Role Key\n')
  console.log('='.repeat(60) + '\n')

  try {
    // Test 1: Basic connection
    console.log('TEST 1: Basic connection test...')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (testError) {
      console.log('❌ FAILED:', testError.message)
      throw testError
    }
    console.log('✅ PASSED: Can connect to database\n')

    // Test 2: Count products
    console.log('TEST 2: Counting products...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.log('❌ FAILED:', countError.message)
      throw countError
    }
    console.log(`✅ PASSED: Found ${count} products\n`)

    // Test 3: Get sample product with full details
    console.log('TEST 3: Reading product with inventory...')
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        title,
        price_eur,
        inventory (
          id,
          quantity,
          reserved_quantity
        )
      `)
      .limit(1)
      .single()

    if (productError) {
      console.log('❌ FAILED:', productError.message)
      throw productError
    }
    console.log('✅ PASSED: Can read products with inventory')
    console.log('Sample product:')
    console.log(`  SKU: ${product.sku}`)
    console.log(`  Title: ${product.title}`)
    console.log(`  Price: €${product.price_eur}`)
    console.log(`  Inventory:`, product.inventory)
    console.log('')

    // Test 4: Count inventory records
    console.log('TEST 4: Counting inventory records...')
    const { count: invCount, error: invCountError } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })

    if (invCountError) {
      console.log('❌ FAILED:', invCountError.message)
      throw invCountError
    }
    console.log(`✅ PASSED: Found ${invCount} inventory records\n`)

    // Test 5: Check stock quantities
    console.log('TEST 5: Analyzing stock quantities...')
    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .select('quantity')

    if (invError) {
      console.log('❌ FAILED:', invError.message)
      throw invError
    }

    const inStock = inventory.filter(i => i.quantity > 0).length
    const outOfStock = inventory.filter(i => i.quantity === 0).length
    const totalStock = inventory.reduce((sum, i) => sum + i.quantity, 0)

    console.log('✅ PASSED: Stock analysis complete')
    console.log(`  In stock: ${inStock}`)
    console.log(`  Out of stock: ${outOfStock}`)
    console.log(`  Total units: ${totalStock}`)
    console.log('')

    // Test 6: Sample products with stock status
    console.log('TEST 6: Sample products with stock status...')
    const { data: samples, error: sampleError } = await supabase
      .from('products')
      .select(`
        sku,
        title,
        inventory (quantity, reserved_quantity)
      `)
      .limit(10)

    if (sampleError) {
      console.log('❌ FAILED:', sampleError.message)
      throw sampleError
    }

    console.log('✅ PASSED: Sample products:')
    samples.forEach(p => {
      const qty = p.inventory?.[0]?.quantity || 0
      const status = qty > 0 ? '✅ IN STOCK' : '❌ OUT OF STOCK'
      console.log(`  ${p.sku}: ${qty} units - ${status}`)
    })
    console.log('')

    // Final Summary
    console.log('='.repeat(60))
    console.log('🎉 ALL TESTS PASSED!')
    console.log('='.repeat(60))
    console.log(`✅ Database connected successfully`)
    console.log(`✅ Products table: ${count} records`)
    console.log(`✅ Inventory table: ${invCount} records`)
    console.log(`✅ Products in stock: ${inStock}`)
    console.log(`✅ Products out of stock: ${outOfStock}`)
    console.log(`✅ Total stock units: ${totalStock}`)
    console.log('='.repeat(60))
    console.log('')

    if (outOfStock > 0) {
      console.log('⚠️  WARNING: Some products are still out of stock!')
      console.log('   Run: node fix-inventory-now.js')
    } else {
      console.log('🎉 All products have stock! Your store is ready!')
    }

  } catch (error) {
    console.log('\n' + '='.repeat(60))
    console.log('❌ CONNECTION TEST FAILED')
    console.log('='.repeat(60))
    console.log('Error:', error.message)
    console.log('')
    console.log('Possible issues:')
    console.log('1. Wrong Supabase URL or API key')
    console.log('2. Database tables not created')
    console.log('3. Network/firewall blocking connection')
    console.log('4. Supabase project paused or deleted')
    console.log('')
    process.exit(1)
  }
}

testConnection()
