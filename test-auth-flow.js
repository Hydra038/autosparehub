const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testAuthSession() {
  console.log('\n🔍 TESTING AUTH SESSION FLOW...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Test sign-in
  console.log('1. Testing sign-in...')
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@autospare.com', // Use your test account
    password: 'admin123', // Use your test password
  })
  
  if (signInError) {
    console.log('❌ Sign-in failed:', signInError.message)
    console.log('\n   Try with your actual credentials:')
    console.log('   email: your-email@example.com')
    console.log('   password: your-password')
    return
  }
  
  console.log('✅ Sign-in successful')
  console.log('   User ID:', authData.user?.id)
  console.log('   Email:', authData.user?.email)
  
  // Check session
  console.log('\n2. Checking session...')
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.log('❌ Session error:', sessionError.message)
  } else if (sessionData.session) {
    console.log('✅ Session exists')
    console.log('   Access token:', sessionData.session.access_token.substring(0, 20) + '...')
    console.log('   Expires at:', new Date(sessionData.session.expires_at! * 1000).toLocaleString())
  } else {
    console.log('❌ No session found after sign-in!')
  }
  
  // Check user profile
  console.log('\n3. Checking user profile in public.users...')
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', authData.user?.id)
    .single()
  
  if (userError) {
    console.log('❌ Profile fetch failed:', userError.message)
    console.log('   Code:', userError.code)
    
    if (userError.code === '42P17') {
      console.log('\n   🔴 INFINITE RECURSION ERROR!')
      console.log('   This is why sign-in redirects back to sign-in!')
      console.log('   The middleware tries to fetch user role and fails.')
      console.log('\n   FIX: Run the RLS policy fix SQL in Supabase')
    } else if (userError.code === 'PGRST116') {
      console.log('\n   🔴 NO PROFILE FOUND!')
      console.log('   User exists in auth but not in public.users table')
      console.log('\n   FIX: Run sync-auth-users.js')
    }
  } else {
    console.log('✅ Profile found')
    console.log('   Name:', userData.full_name)
    console.log('   Role:', userData.role)
  }
  
  // Sign out
  await supabase.auth.signOut()
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 DIAGNOSIS:')
  console.log('='.repeat(60))
  
  if (userError?.code === '42P17') {
    console.log('\n🔴 PROBLEM: Infinite recursion in RLS policies')
    console.log('\nThe middleware cannot fetch user role, so it thinks you\'re')
    console.log('not logged in and redirects back to sign-in.')
    console.log('\nSOLUTION: Apply the RLS fix SQL (fix-rls-final.sql)')
  } else if (userError?.code === 'PGRST116') {
    console.log('\n🔴 PROBLEM: User profile missing')
    console.log('\nSOLUTION: Run sync-auth-users.js to create missing profiles')
  } else if (!sessionData.session) {
    console.log('\n🔴 PROBLEM: Session not persisting')
    console.log('\nSOLUTION: Check cookie settings in Supabase')
  } else {
    console.log('\n✅ Everything looks good!')
    console.log('\nIf still redirecting to sign-in:')
    console.log('1. Clear browser cookies')
    console.log('2. Try incognito mode')
    console.log('3. Check browser console for errors')
  }
}

testAuthSession()
