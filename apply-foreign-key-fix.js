const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fixForeignKey() {
  console.log('\n🔧 FIXING FOREIGN KEY RELATIONSHIP...\n')
  
  // Add the foreign key constraint
  console.log('Step 1: Adding foreign key constraint...')
  const { data: fkResult, error: fkError } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE inventory
      ADD CONSTRAINT IF NOT EXISTS inventory_product_id_fkey
      FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON DELETE CASCADE;
    `
  })
  
  if (fkError) {
    console.log('⚠️  Cannot add FK via RPC (expected, need SQL editor)')
    console.log('Error:', fkError.message)
  }
  
  // Create RLS policy for inventory table
  console.log('\nStep 2: Creating RLS policy for inventory table...')
  const { data: policyResult, error: policyError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" 
      ON inventory FOR SELECT USING (true);
    `
  })
  
  if (policyError) {
    console.log('⚠️  Cannot create policy via RPC (expected, need SQL editor)')
    console.log('Error:', policyError.message)
  }
  
  console.log('\n❌ Cannot execute DDL statements via Supabase client.')
  console.log('\n📋 MANUAL STEPS REQUIRED:')
  console.log('=' .repeat(60))
  console.log('\n1. Go to: https://supabase.com/dashboard/project/hfkksqchjubxvxatzrae/sql')
  console.log('\n2. Copy and paste this SQL:\n')
  console.log(`
-- Add foreign key constraint
ALTER TABLE inventory
ADD CONSTRAINT inventory_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- Create RLS policy for public read access
CREATE POLICY "Enable read access for all users" 
ON inventory 
FOR SELECT 
USING (true);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
`.trim())
  console.log('\n3. Click "RUN" button')
  console.log('\n4. Come back here and run: node check-rls-policies.js')
  console.log('\n' + '='.repeat(60))
}

fixForeignKey()
