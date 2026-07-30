// Loads the parsed dictionary into Supabase, and exports the DB back out to the
// static JSON that /translate fetches.
//
//   node scripts/build-kamus.mjs            # source txt -> public/data/kamus-bali.json
//   node scripts/import-kamus-to-db.mjs     # JSON -> dictionary_entries (upsert)
//   node scripts/import-kamus-to-db.mjs --export-only   # DB -> JSON
//
// The table is the source of truth once loaded: accepted reader suggestions go
// in there, and re-running with --export-only refreshes the file the page reads
// (kept static so lookups stay instant and cacheable).

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const JSON_PATH = path.join(process.cwd(), 'public', 'data', 'kamus-bali.json')
const CHUNK = 500

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function exportToJson() {
  const rows = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('indonesian, andap, singgih, sor, mider')
      .order('indonesian')
      .range(from, from + pageSize - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < pageSize) break
  }

  const entries = rows.map(r => ({
    a: r.andap || '', s: r.singgih || '', o: r.sor || '', m: r.mider || '', i: r.indonesian,
  }))
  await fs.writeFile(JSON_PATH, JSON.stringify({
    source: 'Kamus Anggah-Ungguh Kruna Bali–Indonesia',
    count: entries.length,
    entries,
  }))
  console.log(`exported ${entries.length} entries -> public/data/kamus-bali.json`)
}

if (process.argv.includes('--export-only')) {
  await exportToJson()
} else {
  const file = JSON.parse(await fs.readFile(JSON_PATH, 'utf8'))
  const rows = file.entries.map(e => ({
    indonesian: e.i, andap: e.a || '', singgih: e.s || '', sor: e.o || '', mider: e.m || '',
  }))
  console.log(`importing ${rows.length} entries...`)

  let done = 0
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK)
    const { error } = await supabase.from('dictionary_entries')
      .upsert(slice, { onConflict: 'indonesian,andap,singgih,sor,mider', ignoreDuplicates: true })
    if (error) { console.error('chunk failed:', error.message); process.exit(1) }
    done += slice.length
    process.stdout.write(`  ${done}/${rows.length}\r`)
  }

  const { count } = await supabase.from('dictionary_entries')
    .select('*', { count: 'exact', head: true })
  console.log(`\ndictionary_entries now holds ${count} rows`)
  await exportToJson()
}
