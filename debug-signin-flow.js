// Debug script to simulate the exact sign-in flow
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function debugSignInFlow() {
  console.log('\n🔍 SIMULATING EXACT SIGN-IN FLOW...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })
  
  console.log('Step 1: Sign in with password...')
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@autospare.com',  // Replace with your test account
    password: 'admin123',           // Replace with your test password
  })
  
  if (signInError) {
    console.log('❌ Sign-in failed:', signInError.message)
    console.log('\nUse your actual credentials to test')
    return
  }
  
  console.log('✅ Sign-in successful')
  console.log('   User ID:', authData.user.id)
  console.log('   Email:', authData.user.email)
  
  console.log('\nStep 2: Fetch user role (what sign-in page does)...')
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', authData.user.id)
    .single()
  
  if (userError) {
    console.log('❌ Failed to fetch user profile!')
    console.log('   Error:', userError.message)
    console.log('   Code:', userError.code)
    console.log('\n🔴 THIS IS WHY SIGN-IN LOOPS!')
    console.log('   The sign-in page cannot determine user role,')
    console.log('   so it cannot redirect properly.')
    return
  }
  
  console.log('✅ User profile fetched')
  console.log('   Name:', userData.full_name)
  console.log('   Role:', userData.role)
  
  console.log('\nStep 3: Check session (what middleware does)...')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (!session) {
    console.log('❌ No session found!')
    console.log('\n🔴 THIS IS WHY IT LOOPS!')
    console.log('   Session not persisting after sign-in')
    return
  }
  
  console.log('✅ Session exists')
  
  console.log('\nStep 4: Simulate middleware check...')
  const { data: { user: middlewareUser } } = await supabase.auth.getUser()
  
  if (!middlewareUser) {
    console.log('❌ Middleware cannot get user!')
    console.log('\n🔴 THIS IS WHY IT LOOPS!')
    return
  }
  
  console.log('✅ Middleware can get user')
  console.log('   User ID:', middlewareUser.id)
  
  console.log('\nStep 5: Simulate middleware role check...')
  const { data: middlewareUserData, error: middlewareError } = await supabase
    .from('users')
    .select('role')
    .eq('id', middlewareUser.id)
    .single()
  
  if (middlewareError) {
    console.log('❌ Middleware cannot fetch user role!')
    console.log('   Error:', middlewareError.message)
    console.log('   Code:', middlewareError.code)
    console.log('\n🔴 THIS IS WHY IT LOOPS!')
    console.log('   Middleware thinks user is not authenticated')
    return
  }
  
  console.log('✅ Middleware can fetch user role')
  console.log('   Role:', middlewareUserData.role)
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ ALL STEPS PASSED - SIGN-IN SHOULD WORK!')
  console.log('='.repeat(60))
  console.log('\nIf still looping, the issue is:')
  console.log('1. Browser cookies not being set')
  console.log('2. Session not persisting between pages')
  console.log('3. Different domain/port issue')
  console.log('\nTry:')
  console.log('- Use EXACT same browser tab')
  console.log('- Check if localhost:3000 is consistent')
  console.log('- Look for CORS errors in browser console')
  
  await supabase.auth.signOut()
}

debugSignInFlow()
