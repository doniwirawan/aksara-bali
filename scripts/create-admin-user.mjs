// One-off: create (or update) an auto-confirmed Supabase user.
// Usage: node scripts/create-admin-user.mjs <email> <password>
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// Minimal .env.local loader (KEY=VALUE per line)
const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
const [, , email, password] = process.argv
if (!url || !key) { console.error('Missing Supabase URL or service role key'); process.exit(1) }
if (!email || !password) { console.error('Usage: node scripts/create-admin-user.mjs <email> <password>'); process.exit(1) }

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

// If the user already exists, update the password instead of failing.
const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 })
const existing = list?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true })
  if (error) { console.error('Update failed:', error.message); process.exit(1) }
  console.log(`Updated existing user ${email} (id ${existing.id}) — password reset, email confirmed.`)
} else {
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) { console.error('Create failed:', error.message); process.exit(1) }
  console.log(`Created user ${email} (id ${data.user.id}) — email auto-confirmed.`)
}
