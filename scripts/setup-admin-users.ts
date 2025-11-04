/**
 * Setup Admin Users Script
 * 
 * This script uses the service_role key to:
 * 1. Check for existing admin users in auth.users
 * 2. Create admin users if they don't exist
 * 3. Insert/update admin profiles in public.users
 * 4. Verify the setup worked
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Admin users to create
const ADMIN_USERS = [
  {
    email: 'admin@autospare.com',
    password: 'Admin@2024!',
    fullName: 'System Administrator'
  },
  {
    email: 'manager@autospare.com',
    password: 'Manager@2024!',
    fullName: 'Store Manager'
  },
  {
    email: 'support@autospare.com',
    password: 'Support@2024!',
    fullName: 'Customer Support'
  }
]

async function setupAdminUsers() {
  console.log('🚀 Starting admin user setup...\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables!')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('✅ Environment variables found')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  // Create admin client with service_role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('✅ Admin client created\n')

  // Step 1: Disable RLS on users table
  console.log('📋 Step 1: Disabling RLS on users table...')
  try {
    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;'
    })
    
    if (rlsError) {
      console.log('⚠️  Could not disable RLS via RPC (this is okay, try manually in SQL Editor)')
    } else {
      console.log('✅ RLS disabled\n')
    }
  } catch (err) {
    console.log('⚠️  RLS command skipped (run manually in SQL Editor if needed)\n')
  }

  // Step 2: Check existing users in auth.users
  console.log('📋 Step 2: Checking existing users in auth.users...')
  const { data: existingAuthUsers, error: authListError } = await supabaseAdmin.auth.admin.listUsers()

  if (authListError) {
    console.error('❌ Error listing auth users:', authListError.message)
    process.exit(1)
  }

  console.log(`✅ Found ${existingAuthUsers.users.length} total users in auth.users`)

  const existingEmails = existingAuthUsers.users.map(u => u.email)
  console.log('📧 Existing emails:', existingEmails.join(', ') || 'None')
  console.log('')

  // Step 3: Create admin users in auth.users if they don't exist
  console.log('📋 Step 3: Creating admin users in auth.users...')
  const createdUsers: Array<{ id: string; email: string; fullName: string }> = []

  for (const admin of ADMIN_USERS) {
    if (existingEmails.includes(admin.email)) {
      console.log(`⏭️  User ${admin.email} already exists in auth.users`)
      
      // Get the user ID
      const existingUser = existingAuthUsers.users.find(u => u.email === admin.email)
      if (existingUser) {
        createdUsers.push({
          id: existingUser.id,
          email: admin.email,
          fullName: admin.fullName
        })
      }
    } else {
      console.log(`➕ Creating user: ${admin.email}`)
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: admin.fullName
        }
      })

      if (createError) {
        console.error(`❌ Error creating ${admin.email}:`, createError.message)
        continue
      }

      if (newUser.user) {
        console.log(`✅ Created ${admin.email} (ID: ${newUser.user.id})`)
        createdUsers.push({
          id: newUser.user.id,
          email: admin.email,
          fullName: admin.fullName
        })
      }
    }
  }

  console.log(`\n✅ ${createdUsers.length} admin users ready in auth.users\n`)

  // Step 4: Insert/update admin users in public.users
  console.log('📋 Step 4: Creating profiles in public.users...')

  for (const user of createdUsers) {
    console.log(`➕ Creating profile for ${user.email}`)

    const { error: insertError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: 'admin'
      }, {
        onConflict: 'id'
      })

    if (insertError) {
      console.error(`❌ Error creating profile for ${user.email}:`, insertError.message)
    } else {
      console.log(`✅ Profile created for ${user.email}`)
    }
  }

  console.log('')

  // Step 5: Verify admin users in public.users
  console.log('📋 Step 5: Verifying admin users in public.users...')
  
  const { data: adminUsers, error: verifyError } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, role, created_at')
    .eq('role', 'admin')
    .order('created_at', { ascending: false })

  if (verifyError) {
    console.error('❌ Error verifying admin users:', verifyError.message)
    process.exit(1)
  }

  if (!adminUsers || adminUsers.length === 0) {
    console.error('❌ No admin users found in public.users!')
    console.error('   This might be due to:')
    console.error('   - RLS policies blocking the query')
    console.error('   - Permissions issues')
    console.error('   - Foreign key constraints')
    console.error('\n   Please run the SQL in fix-authorization-error.sql manually')
    process.exit(1)
  }

  console.log(`✅ Found ${adminUsers.length} admin users in public.users:\n`)
  
  console.table(adminUsers.map(u => ({
    Email: u.email,
    Name: u.full_name,
    Role: u.role,
    Created: new Date(u.created_at).toLocaleString()
  })))

  // Step 6: Test authentication
  console.log('\n📋 Step 6: Testing admin authentication...')
  
  const testUser = ADMIN_USERS[0]
  const { data: authData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email: testUser.email,
    password: testUser.password
  })

  if (signInError) {
    console.error(`❌ Authentication test failed:`, signInError.message)
  } else if (authData.user) {
    console.log(`✅ Authentication test successful for ${testUser.email}`)
  }

  // Final summary
  console.log('\n' + '='.repeat(60))
  console.log('🎉 ADMIN USER SETUP COMPLETE!')
  console.log('='.repeat(60))
  console.log('\n📝 Admin Credentials:\n')
  
  ADMIN_USERS.forEach(admin => {
    console.log(`   ${admin.fullName}:`)
    console.log(`   📧 Email: ${admin.email}`)
    console.log(`   🔑 Password: ${admin.password}`)
    console.log('')
  })

  console.log('✅ Next Steps:')
  console.log('   1. Start your dev server: npm run dev')
  console.log('   2. Go to: http://localhost:3000/sign-in')
  console.log('   3. Log in with admin@autospare.com')
  console.log('   4. You should be redirected to /admin')
  console.log('\n' + '='.repeat(60))
}

// Run the setup
setupAdminUsers().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
