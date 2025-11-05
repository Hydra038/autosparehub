const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testSignupIssue() {
  console.log('\n🔍 TESTING SIGN-UP DATA INSERTION...\n')
  
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  // Test 1: Check users table structure
  console.log('1. Checking users table...')
  const { data: users, error: usersError } = await serviceClient
    .from('users')
    .select('*')
    .limit(3)
  
  if (usersError) {
    console.log('❌ Error:', usersError.message)
  } else {
    console.log(`✅ Found ${users.length} users in table`)
    if (users[0]) {
      console.log('   Columns:', Object.keys(users[0]).join(', '))
    }
  }
  
  // Test 2: Try inserting with ANON key (what sign-up uses)
  console.log('\n2. Testing INSERT with ANON key (simulating sign-up)...')
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  const testUserId = '00000000-0000-0000-0000-000000000099'
  
  // Clean up first
  await serviceClient.from('users').delete().eq('id', testUserId)
  
  const { data: anonInsert, error: anonError } = await anonClient
    .from('users')
    .insert({
      id: testUserId,
      email: 'anon-test@example.com',
      full_name: 'Anon Test User',
      role: 'customer'
    })
    .select()
  
  if (anonError) {
    console.log('❌ ANON INSERT FAILED:', anonError.message)
    console.log('   Code:', anonError.code)
    console.log('   Hint:', anonError.hint)
    console.log('\n   🔴 THIS IS THE PROBLEM!')
    console.log('   The anon key cannot insert into users table.')
    console.log('   RLS policy is blocking it.')
  } else {
    console.log('✅ ANON INSERT succeeded')
    await serviceClient.from('users').delete().eq('id', testUserId)
  }
  
  // Test 3: Try with service key
  console.log('\n3. Testing INSERT with SERVICE key...')
  const { data: serviceInsert, error: serviceError } = await serviceClient
    .from('users')
    .insert({
      id: testUserId,
      email: 'service-test@example.com',
      full_name: 'Service Test User',
      role: 'customer'
    })
    .select()
  
  if (serviceError) {
    console.log('❌ SERVICE INSERT FAILED:', serviceError.message)
  } else {
    console.log('✅ SERVICE INSERT succeeded')
    await serviceClient.from('users').delete().eq('id', testUserId)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 SOLUTION:')
  console.log('='.repeat(60))
  console.log('\nThe users table needs an RLS policy to allow INSERT.')
  console.log('\nRun this SQL in Supabase SQL Editor:')
  console.log(`
-- Allow users to insert their own profile during sign-up
CREATE POLICY "Users can insert their own profile" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  `.trim())
}

testSignupIssue()
