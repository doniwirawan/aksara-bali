// Seed public.practice_words from the bundled QUIZ_WORDS list.
// Usage: copy utils/balineseConverter.js -> scripts/_balinese.mjs first, then:
//   node scripts/seed-words.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { QUIZ_WORDS } from './_balinese.mjs'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const rows = QUIZ_WORDS.map((w, i) => ({
  latin: w.latin,
  meaning: w.meaning ?? null,
  category: w.category ?? null,
  difficulty: w.difficulty ?? 'easy',
  sort_order: i,
}))

// Replace the whole set so the seed is idempotent.
const del = await supabase.from('practice_words').delete().neq('id', 0)
if (del.error) { console.error('delete failed:', del.error.message); process.exit(1) }
const ins = await supabase.from('practice_words').insert(rows)
if (ins.error) { console.error('insert failed:', ins.error.message); process.exit(1) }
console.log(`Seeded ${rows.length} practice words.`)
