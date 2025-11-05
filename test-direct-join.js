const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testDirectPostgres() {
  console.log('\n🔍 TESTING DIRECT POSTGRESQL CONNECTION...\n')
  
  // Parse the connection string
  const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres:Derq@038!@db.hfkksqchjubxvxatzrae.supabase.co:5432/postgres'
  
  const client = new Client({ connectionString })
  
  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL directly\n')
    
    // Check if foreign key exists
    console.log('1. Checking foreign key constraints...')
    const fkCheck = await client.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'inventory'
    `)
    
    if (fkCheck.rows.length > 0) {
      console.log('✅ Foreign key exists:')
      fkCheck.rows.forEach(row => {
        console.log(`   ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`)
      })
    } else {
      console.log('❌ No foreign key found!')
    }
    
    // Check RLS policies
    console.log('\n2. Checking RLS policies on inventory table...')
    const rlsCheck = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies
      WHERE tablename = 'inventory'
    `)
    
    if (rlsCheck.rows.length > 0) {
      console.log('✅ RLS policies found:')
      rlsCheck.rows.forEach(row => {
        console.log(`   Policy: ${row.policyname}`)
        console.log(`   Command: ${row.cmd}`)
        console.log(`   Roles: ${row.roles}`)
        console.log(`   Permissive: ${row.permissive}`)
      })
    } else {
      console.log('❌ No RLS policies found on inventory table!')
      console.log('   This is why the JOIN returns NULL!')
    }
    
    // Check if RLS is enabled
    console.log('\n3. Checking if RLS is enabled...')
    const rlsEnabled = await client.query(`
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE tablename = 'inventory'
    `)
    
    if (rlsEnabled.rows[0]?.rowsecurity) {
      console.log('✅ RLS is ENABLED on inventory table')
    } else {
      console.log('⚠️  RLS is DISABLED on inventory table')
    }
    
    // Test direct SQL JOIN
    console.log('\n4. Testing direct SQL JOIN...')
    const joinTest = await client.query(`
      SELECT 
        p.id, 
        p.sku, 
        p.title,
        i.quantity,
        i.reserved_quantity
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      LIMIT 5
    `)
    
    console.log('✅ Direct SQL JOIN works:')
    joinTest.rows.forEach(row => {
      console.log(`   ${row.sku}: quantity=${row.quantity || 'NULL'}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('📋 SUMMARY:')
    console.log('='.repeat(60))
    
    if (rlsCheck.rows.length === 0) {
      console.log('\n❌ PROBLEM: No RLS policy on inventory table!')
      console.log('\nYou need to run this SQL in Supabase dashboard:')
      console.log(`
CREATE POLICY "Enable read access for all users" 
ON inventory 
FOR SELECT 
USING (true);
      `.trim())
    } else if (!rlsEnabled.rows[0]?.rowsecurity) {
      console.log('\n⚠️  PROBLEM: RLS is disabled!')
      console.log('\nRun: ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;')
    } else {
      console.log('\n✅ Everything looks good in PostgreSQL!')
      console.log('\nThe issue might be with Supabase cache or API layer.')
      console.log('Try restarting your dev server.')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

testDirectPostgres()
