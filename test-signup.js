const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testSignup() {
  console.log('\n🔍 TESTING SIGN-UP FLOW...\n')
  
  // Test 1: Check if users table exists
  console.log('1. Checking users table structure...')
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1)
  
  if (usersError) {
    console.log('❌ Error accessing users table:', usersError.message)
  } else {
    console.log('✅ Users table accessible')
    if (users && users[0]) {
      console.log('   Sample columns:', Object.keys(users[0]))
    }
  }
  
  // Test 2: Check RLS policies on users table
  console.log('\n2. Checking RLS policies on users table...')
  const { Client } = require('pg')
  const connectionString = 'postgresql://postgres:Derq@038!@db.hfkksqchjubxvxatzrae.supabase.co:5432/postgres'
  const client = new Client({ connectionString })
  
  try {
    await client.connect()
    
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
      WHERE tablename = 'users'
    `)
    
    if (rlsCheck.rows.length > 0) {
      console.log('✅ RLS policies found:')
      rlsCheck.rows.forEach(row => {
        console.log(`   Policy: ${row.policyname}`)
        console.log(`   Command: ${row.cmd}`)
        console.log(`   Roles: ${row.roles}`)
      })
    } else {
      console.log('⚠️  No RLS policies found on users table!')
      console.log('   This might prevent inserts.')
    }
    
    // Check if RLS is enabled
    const rlsEnabled = await client.query(`
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE tablename = 'users'
    `)
    
    if (rlsEnabled.rows[0]?.rowsecurity) {
      console.log('\n✅ RLS is ENABLED on users table')
      console.log('   Need INSERT policy for authenticated users')
    } else {
      console.log('\n⚠️  RLS is DISABLED on users table')
    }
    
    // Test 3: Try to insert a test user with service key
    console.log('\n3. Testing INSERT with service key...')
    const testUserId = '00000000-0000-0000-0000-000000000001'
    
    // First, delete test user if exists
    await supabase.from('users').delete().eq('id', testUserId)
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'customer'
      })
      .select()
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message)
      console.log('   Code:', insertError.code)
      console.log('   Details:', insertError.details)
    } else {
      console.log('✅ INSERT successful with service key')
      
      // Clean up
      await supabase.from('users').delete().eq('id', testUserId)
    }
    
    // Test 4: Check auth.users vs public.users
    console.log('\n4. Checking auth vs public users...')
    const authUsers = await client.query('SELECT count(*) FROM auth.users')
    const publicUsers = await client.query('SELECT count(*) FROM public.users')
    
    console.log(`   Auth users: ${authUsers.rows[0].count}`)
    console.log(`   Public users: ${publicUsers.rows[0].count}`)
    
    if (parseInt(authUsers.rows[0].count) > parseInt(publicUsers.rows[0].count)) {
      console.log('   ⚠️  Some auth users missing from public.users table!')
      console.log('   This means sign-up creates auth account but fails to create profile')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 RECOMMENDATIONS:')
  console.log('='.repeat(60))
  console.log('\n1. Check browser console for errors during sign-up')
  console.log('2. Verify RLS policies allow INSERT for authenticated users')
  console.log('3. Consider using a database trigger to auto-create profiles')
}

testSignup()
