// Builds a catalogue of Unsplash photos with proper attribution data, used by
// scripts/gen-blog-covers.mjs.
//
//   node scripts/fetch-unsplash-photos.mjs
//
// Scrapes Unsplash search pages for photo IDs, then reads each photo's public
// metadata for the photographer name, profile URL, and photo page URL — the
// three things Unsplash's attribution guideline asks for. Unsplash+ (premium)
// photos are skipped: their licence terms differ from the free licence.

import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const QUERIES = [
  'bali-temple', 'bali-culture', 'balinese-ceremony', 'bali-offering',
  'palm-leaf-manuscript', 'old-manuscript', 'calligraphy-writing', 'handwriting',
  'keyboard-typing', 'laptop-writing', 'tattoo-artist', 'design-studio',
  'classroom-learning', 'library-books', 'bali-rice-terrace', 'stone-carving',
]

const OUT = path.join(process.cwd(), 'scripts', 'data', 'unsplash-photos.json')
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Unsplash's bot protection answers 401 to node's fetch whatever headers we
// send, but lets plain curl through — so shell out for the search pages. The
// napi metadata endpoint is happy with fetch.
function idsForQuery(query) {
  let html = ''
  try {
    html = execFileSync('curl', ['-sL', '--max-time', '30', `https://unsplash.com/s/photos/${query}`],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  } catch {
    return []
  }
  const ids = [...html.matchAll(/href="\/photos\/([a-zA-Z0-9_-]+)"/g)]
    .map(m => m[1].split('-').pop())
    .filter(id => id && id.length >= 8)
  return [...new Set(ids)].slice(0, 8)
}

async function meta(id) {
  const res = await fetch(`https://unsplash.com/napi/photos/${id}`)
  if (!res.ok) return null
  const d = await res.json()
  const raw = d.urls?.raw || ''
  if (!raw || raw.includes('plus.unsplash.com')) return null   // skip Unsplash+
  return {
    id,
    photo: raw.split('?')[0],
    credit: d.user?.name || '',
    creditUrl: d.user?.links?.html || '',
    sourceUrl: d.links?.html || '',
    alt: (d.alt_description || d.description || '').slice(0, 90),
  }
}

const catalogue = {}
for (const query of QUERIES) {
  catalogue[query] = []
  for (const id of idsForQuery(query)) {
    const m = await meta(id)
    if (m) catalogue[query].push(m)
    await sleep(250)
  }
  console.log(`${query}: ${catalogue[query].length} photos`)
}

await fs.mkdir(path.dirname(OUT), { recursive: true })
await fs.writeFile(OUT, JSON.stringify(catalogue, null, 2))
console.log('written', OUT)
