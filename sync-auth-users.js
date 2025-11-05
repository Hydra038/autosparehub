const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkAuthVsPublicUsers() {
  console.log('\n🔍 CHECKING AUTH vs PUBLIC USERS MISMATCH...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  // Get users from public.users table
  console.log('1. Checking public.users table...')
  const { data: publicUsers, error: publicError } = await supabase
    .from('users')
    .select('id, email, full_name, created_at')
    .order('created_at', { ascending: false })
  
  if (publicError) {
    console.log('❌ Error:', publicError.message)
    return
  }
  
  console.log(`✅ Found ${publicUsers.length} users in public.users table`)
  
  // Get users from auth.users (using admin API)
  console.log('\n2. Checking auth.users (authentication table)...')
  const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.log('❌ Error:', authError.message)
    return
  }
  
  const authUsers = authUsersData.users
  console.log(`✅ Found ${authUsers.length} users in auth.users table`)
  
  // Find mismatches
  console.log('\n3. Finding mismatches...')
  const publicUserIds = new Set(publicUsers.map(u => u.id))
  const authUserIds = new Set(authUsers.map(u => u.id))
  
  const missingInPublic = authUsers.filter(u => !publicUserIds.has(u.id))
  const orphanedInPublic = publicUsers.filter(u => !authUserIds.has(u.id))
  
  if (missingInPublic.length > 0) {
    console.log(`\n⚠️  Found ${missingInPublic.length} users in AUTH but NOT in PUBLIC table:`)
    missingInPublic.forEach((user, index) => {
      console.log(`\n  ${index + 1}. Email: ${user.email}`)
      console.log(`     ID: ${user.id}`)
      console.log(`     Created: ${new Date(user.created_at).toLocaleString()}`)
      console.log(`     Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
      console.log(`     Name: ${user.user_metadata?.full_name || 'N/A'}`)
    })
    
    console.log('\n\n🔧 FIX: Creating missing profiles in public.users...')
    
    for (const authUser of missingInPublic) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          role: 'customer',
        })
      
      if (insertError) {
        console.log(`   ❌ Failed to create profile for ${authUser.email}: ${insertError.message}`)
      } else {
        console.log(`   ✅ Created profile for ${authUser.email}`)
      }
    }
    
    console.log('\n✅ Sync complete! All auth users now have profiles.')
  } else {
    console.log('✅ All auth users have corresponding profiles')
  }
  
  if (orphanedInPublic.length > 0) {
    console.log(`\n⚠️  Found ${orphanedInPublic.length} orphaned users in PUBLIC table (no auth):`)
    orphanedInPublic.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id})`)
    })
    console.log('\n   These can be safely deleted if needed.')
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY:')
  console.log('='.repeat(60))
  console.log(`Auth users: ${authUsers.length}`)
  console.log(`Public users: ${publicUsers.length}`)
  console.log(`Missing in public: ${missingInPublic.length}`)
  console.log(`Orphaned in public: ${orphanedInPublic.length}`)
  
  if (missingInPublic.length === 0 && orphanedInPublic.length === 0) {
    console.log('\n✅ Database is in sync! All users match.')
  }
}

checkAuthVsPublicUsers()
