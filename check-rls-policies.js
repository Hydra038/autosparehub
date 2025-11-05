const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testWithBothKeys() {
  console.log('\n🔍 TESTING WITH DIFFERENT API KEYS...\n')
  
  // Test 1: With ANON key (what the website uses)
  console.log('TEST 1: Using ANON key (what your website uses)')
  console.log('=' .repeat(60))
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  const { data: anonProducts, error: anonError } = await anonClient
    .from('products')
    .select(`
      id, sku, title,
      inventory(quantity, reserved_quantity)
    `)
    .limit(5)
  
  if (anonError) {
    console.log('❌ ERROR with anon key:', anonError.message)
  } else {
    console.log('✅ SUCCESS with anon key')
    console.log('\nSample products:')
    anonProducts?.forEach(p => {
      const stock = p.inventory?.[0]
      console.log(`  ${p.sku}: inventory=${stock ? `${stock.quantity} units` : 'NULL'}`)
    })
  }
  
  // Test 2: With SERVICE key
  console.log('\n\nTEST 2: Using SERVICE ROLE key (admin access)')
  console.log('='.repeat(60))
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  const { data: serviceProducts, error: serviceError } = await serviceClient
    .from('products')
    .select(`
      id, sku, title,
      inventory(quantity, reserved_quantity)
    `)
    .limit(5)
  
  if (serviceError) {
    console.log('❌ ERROR with service key:', serviceError.message)
  } else {
    console.log('✅ SUCCESS with service key')
    console.log('\nSample products:')
    serviceProducts?.forEach(p => {
      const stock = p.inventory?.[0]
      console.log(`  ${p.sku}: inventory=${stock ? `${stock.quantity} units` : 'NULL'}`)
    })
  }
  
  // Compare results
  console.log('\n\n📊 COMPARISON')
  console.log('='.repeat(60))
  if (anonProducts && serviceProducts) {
    const anonHasInventory = anonProducts.some(p => p.inventory && p.inventory[0])
    const serviceHasInventory = serviceProducts.some(p => p.inventory && p.inventory[0])
    
    console.log(`Anon key returns inventory: ${anonHasInventory ? '✅ YES' : '❌ NO'}`)
    console.log(`Service key returns inventory: ${serviceHasInventory ? '✅ YES' : '❌ NO'}`)
    
    if (!anonHasInventory && serviceHasInventory) {
      console.log('\n⚠️  PROBLEM FOUND!')
      console.log('The inventory table has RLS (Row Level Security) enabled')
      console.log('but NO policy allows anonymous users to read it!')
      console.log('\nFIX: You need to add a SELECT policy on the inventory table.')
    }
  }
}

testWithBothKeys()
