const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkIfRLSFixed() {
  console.log('\n🔍 CHECKING IF RLS POLICIES ARE FIXED...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  // Test 1: Try to fetch a user (this will trigger the recursion if not fixed)
  console.log('1. Testing user profile fetch (this triggers the error)...')
  
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(1)
  
  if (error) {
    console.log('❌ ERROR:', error.message)
    console.log('   Code:', error.code)
    
    if (error.code === '42P17') {
      console.log('\n🔴 INFINITE RECURSION ERROR STILL EXISTS!')
      console.log('\n❌ You have NOT run the SQL fix in Supabase yet!')
      console.log('\n📋 ACTION REQUIRED:')
      console.log('   1. Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql')
      console.log('   2. Copy ALL the SQL from fix-rls-final.sql')
      console.log('   3. Paste it into the SQL editor')
      console.log('   4. Click RUN ▶️')
      console.log('\n   Until you do this, sign-in will keep looping!')
    } else {
      console.log('\n⚠️  Different error - check Supabase')
    }
    return
  }
  
  console.log('✅ No recursion error!')
  console.log(`   Found ${users.length} user(s) in table`)
  
  // Test 2: Check what policies exist
  console.log('\n2. Checking current RLS policies...')
  console.log('   (This requires direct database access)')
  console.log('\n   ℹ️  If sign-in still loops, the policies might not be correct.')
  console.log('   Please verify in Supabase dashboard that you have:')
  console.log('   - allow_insert_own_profile')
  console.log('   - allow_read_own_profile')
  console.log('   - allow_update_own_profile')
  console.log('   - allow_service_role_all')
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 DIAGNOSIS:')
  console.log('='.repeat(60))
  
  if (error?.code === '42P17') {
    console.log('\n🔴 RLS POLICIES NOT FIXED - SQL NOT RUN IN SUPABASE')
    console.log('\nSign-in will continue to loop until you run the SQL!')
  } else {
    console.log('\n✅ No recursion error detected')
    console.log('\nIf sign-in still loops:')
    console.log('1. Clear browser cookies/cache')
    console.log('2. Try incognito mode')
    console.log('3. Restart dev server')
    console.log('4. Check browser console for other errors')
  }
}

checkIfRLSFixed()
