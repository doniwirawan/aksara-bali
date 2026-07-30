// Turns the scanned "Kamus Anggah-Ungguh Kruna Bali–Indonesia" text dump into
// the lookup table used by /translate.
//
//   node scripts/build-kamus.mjs [source.txt]
//
// Source columns: kruna andap | alus singgih | alus sor | alus mider/mider |
// Indonesian. A dash means "no such form". Page numbers, running headers, and
// the chapter's prose are dropped.

import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = process.argv[2] || '767595183-Kamus-Bahasa-Bali.txt'
const OUT = path.join(process.cwd(), 'public', 'data', 'kamus-bali.json')

const text = await fs.readFile(SRC, 'utf8')

const clean = (v) => (!v || v === '-' ? '' : v.trim())
const rows = []

for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim()
  if (!line) continue

  const cols = line.split(/\s{2,}/).map(c => c.trim()).filter(Boolean)
  if (cols.length < 4 || cols.length > 5) continue           // not a table row
  if (cols.some(c => c.split(/\s+/).length > 4)) continue    // prose
  if (/^\d+$/.test(cols[0])) continue                        // page number
  if (/^(kt\.?andap|kata asi|bab|kamus)/i.test(cols[0])) continue

  const [andap, singgih, sor, mider, id] = cols.length === 5
    ? cols
    : [cols[0], cols[1], cols[2], '', cols[3]]

  const entry = {
    a: clean(andap),
    s: clean(singgih),
    o: clean(sor),
    m: clean(mider),
    i: clean(id),
  }
  if (!entry.i || !(entry.a || entry.s || entry.o || entry.m)) continue
  rows.push(entry)
}

// Drop exact duplicates that the page breaks introduce.
const seen = new Set()
const entries = rows.filter(e => {
  const key = [e.a, e.s, e.o, e.m, e.i].join('|')
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

await fs.mkdir(path.dirname(OUT), { recursive: true })
await fs.writeFile(OUT, JSON.stringify({
  source: 'Kamus Anggah-Ungguh Kruna Bali–Indonesia',
  count: entries.length,
  entries,
}))

const size = (await fs.stat(OUT)).size
console.log(`${entries.length} entries -> ${OUT} (${Math.round(size / 1024)} KB)`)
console.log('sample:', JSON.stringify(entries.slice(0, 3)))
