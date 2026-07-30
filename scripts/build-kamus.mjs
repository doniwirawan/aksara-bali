// Turns the scanned "Kamus Anggah-Ungguh Kruna" text dump into the lookup table
// used by /translate.
//
//   node scripts/build-kamus.mjs [source.txt]
//
// The source holds TWO dictionaries with different column orders:
//
//   Bali - Indonesia   Kt.Andap | Kata Asi | Kata Aso | Ami/Mider | Kata BI
//   Indonesia - Bali   Kata (BI) | Kt.Andap | Kata Asi | Kata Aso | Ami/Mider
//
// Parsing both with the first layout silently moves the Indonesian headword
// into the andap column for every row of the second half, so the section
// boundary matters. A dash means "no such form"; page numbers, running headers,
// and the chapters' prose are dropped.

import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = process.argv[2] || path.join('scripts', 'data', 'kamus-bahasa-bali.txt')
const OUT = path.join(process.cwd(), 'public', 'data', 'kamus-bali.json')

const BALI_FIRST = ['a', 's', 'o', 'm', 'i']
const INDO_FIRST = ['i', 'a', 's', 'o', 'm']

const clean = (v) => (!v || v === '-' ? '' : v.trim())

const text = await fs.readFile(SRC, 'utf8')
const lines = text.split(/\r?\n/)

// The Indonesia-Bali half starts at its own chapter heading.
let boundary = lines.findIndex(l => /INDONESIA\s*[-–]\s*BALI/i.test(l))
if (boundary < 0) boundary = lines.length
console.log(`Bali–Indonesia: lines 0–${boundary} · Indonesia–Bali: ${boundary}–${lines.length}`)

function parse(from, to, order) {
  const rows = []
  for (const raw of lines.slice(from, to)) {
    const line = raw.trim()
    if (!line) continue

    const cols = line.split(/\s{2,}/).map(c => c.trim()).filter(Boolean)
    if (cols.length < 4 || cols.length > 5) continue           // not a table row
    if (cols.some(c => c.split(/\s+/).length > 4)) continue    // prose
    if (/^\d+$/.test(cols[0])) continue                        // page number
    if (/^(kt\.?andap|kata|bab|kamus)/i.test(cols[0])) continue

    // A four-column row lost its trailing column, not its first.
    const padded = cols.length === 5 ? cols : [...cols, '-']
    const entry = {}
    order.forEach((key, idx) => { entry[key] = clean(padded[idx]) })

    if (!entry.i || !(entry.a || entry.s || entry.o || entry.m)) continue
    rows.push(entry)
  }
  return rows
}

const rows = [
  ...parse(0, boundary, BALI_FIRST),
  ...parse(boundary, lines.length, INDO_FIRST),
]

// Page breaks repeat a handful of rows verbatim.
const seen = new Set()
const entries = rows.filter(e => {
  const key = [e.a, e.s, e.o, e.m, e.i].join('|')
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

await fs.mkdir(path.dirname(OUT), { recursive: true })
await fs.writeFile(OUT, JSON.stringify({
  source: 'Kamus Anggah-Ungguh Kruna Bali–Indonesia / Indonesia–Bali',
  count: entries.length,
  entries,
}))

const size = (await fs.stat(OUT)).size
console.log(`${entries.length} entries -> ${OUT} (${Math.round(size / 1024)} KB)`)
console.log('sample:', JSON.stringify(entries.slice(0, 2)))
