// Parse headwords of the Kamus Bahasa Bali Kuno-Indonesia (1985) from the
// column-split text. Headwords only; meanings the book marks "(?)" are dropped.
// usage: node kuno_parse.mjs <bkuno-cols.txt> <kamus-bali.json> <out.json> <rejects.txt>
import fs from 'node:fs'

const [colsPath, kamusPath, outPath, rejPath] = process.argv.slice(2)
const lines = fs.readFileSync(colsPath, 'utf8').split('\n')
const kamus = JSON.parse(fs.readFileSync(kamusPath, 'utf8')).entries

// group into columns (left/right) per page
const columns = []
let page = 0, col = null
for (const raw of lines) {
  const m = raw.match(/^=== page (\d+)/)
  if (m) { page = +m[1]; col = null; continue }
  if (!raw.includes('\t')) continue
  const [xs, text] = raw.split('\t')
  const x = +xs, side = x > 200 ? 'R' : 'L'
  if (/^[\dIVXLC]+$/.test(text.trim())) continue
  if (!col || col.side !== side) { col = { page, side, rows: [] }; columns.push(col) }
  col.rows.push({ x, text: text.trim() })
}

// Indonesian vocabulary we trust: existing Kamus glosses + all glosses in this book
const known = new Set()
for (const e of kamus) for (const w of (e.i || '').toLowerCase().match(/[a-z]+/g) || []) known.add(w)
const ABBR = { yg: 'yang', dg: 'dengan', dr: 'dari', pd: 'pada', tt: 'tentang', dsb: 'dan sebagainya', sj: 'sejenis', thd: 'terhadap', sso: 'seseorang', sst: 'sesuatu', kpd: 'kepada', utk: 'untuk' }

const cands = []
for (const c of columns) {
  if (c.page < 20 || c.rows.length < 3) continue
  // the headword indent is the smallest common x in this column
  const xs = c.rows.map(r => r.x).sort((a, b) => a - b)
  const minX = xs[Math.floor(xs.length * 0.05)]
  for (let i = 0; i < c.rows.length; i++) {
    const r = c.rows[i]
    if (r.x > minX + 4) continue
    let text = r.text
    // continuation lines: deeper indent and the text so far has not closed with ';' or '.'
    for (let j = i + 1; j < c.rows.length; j++) {
      const n = c.rows[j]
      if (n.x <= minX + 4 || /[;.]$/.test(text)) break
      text = text.endsWith('-') ? text.slice(0, -1) + n.text : text + ' ' + n.text
    }
    const m = text.match(/^['’`1-9]?([a-zA-Zñãāīūēōéêâîûŋṅṇṭḍśṣ]+(?:-[a-zA-Zñãāīūēōéêâîûŋṅṇṭḍśṣ]+)?)\s+(.+)$/)
    if (!m) continue
    cands.push({ page: c.page, word: m[1].toLowerCase(), def: m[2], text })
  }
}

const glossOf = (def) => {
  let g = def.split(':')[0]
  g = g.replace(/^n\.\s*/, '')
  g = g.split(/(?:^|\s)(?=\d\.\s)/).map(s => s.replace(/^\d\.\s*/, '').trim()).filter(Boolean).join('; ')
  g = g.replace(/\b(yg|dg|dr|pd|tt|dsb|sj|thd|sso|sst|kpd|utk)\b/g, w => ABBR[w])
  g = g.split(/\s[-–—]\s?|\s~/)[0]                  // "dua; - puluh" starts an example phrase
  return g.replace(/\s+/g, ' ').replace(/(;\s*)+/g, '; ').replace(/[;,.\s]+$/, '').trim()
}
// Every word of the book, to require that a headword recurs (OCR misreads rarely do).
const bookFreq = new Map()
for (const c of columns) for (const r of c.rows) for (const w of r.text.toLowerCase().match(/[a-zñãāīūēōéêâîûŋṅṇṭḍśṣ]+/g) || []) bookFreq.set(w, (bookFreq.get(w) || 0) + 1)
const freq = new Map()
for (const c of cands) for (const w of glossOf(c.def).toLowerCase().match(/[a-z]+/g) || []) freq.set(w, (freq.get(w) || 0) + 1)
const good = (w) => known.has(w) || (freq.get(w) || 0) >= 3 || Object.values(ABBR).join(' ').split(' ').includes(w)

const out = [], rejects = []
for (const c of cands) {
  const gloss = glossOf(c.def)
  const why =
    /\(\?\)|\?/.test(c.def.split(':')[0]) ? 'unsure' :
    !/[aeiouãāīūēōéêâîû]/.test(c.word) || c.word.length < 2 ? 'head' :
    // "n. orang" / "n. diri": a personal or place name, not a definition
    /^n\.?\s|^(nama|lih|lihat|ith|lth)\b/i.test(gloss) || /^n\.?\s/.test(c.def) ? 'name' :
    (bookFreq.get(c.word) || 0) < 2 ? 'once' :
    // digits, a stray "n"/"din" (the name markers) or a capitalised proper name mean
    // the gloss swallowed part of a name entry or an example
    /\d|\bn\b|\bdin\b|\b[A-Z]/.test(gloss) ? 'mixed' :
    /^(atau|dan|serta|yang|oleh)\b/.test(gloss) || /rn/.test(c.word) || ['din', 'burn'].includes(c.word) ? 'fragment' :
    !gloss || gloss.length > 90 || /[^a-zA-Z0-9 ;,()'\/\-]/.test(gloss) ? 'gloss' :
    (gloss.match(/\(/g) || []).length !== (gloss.match(/\)/g) || []).length ? 'paren' :
    /\b(dari|dan|yang|dengan|untuk|atau|pada|ke|di|oleh)$/.test(gloss) ? 'cutoff' :
    (gloss.toLowerCase().match(/[a-z]+/g) || []).some(w => !good(w)) ? 'rare' : null
  if (why) { rejects.push(`${why}\t${c.word}\t${gloss}\t${c.text}`); continue }
  out.push({ k: c.word, i: gloss })
}
const seen = new Set()
const final = out.filter(e => { const key = e.k + '|' + e.i; if (seen.has(key)) return false; seen.add(key); return true })
fs.writeFileSync(outPath, '[\n' + final.map(e => JSON.stringify(e)).join(',\n') + '\n]\n')
fs.writeFileSync(rejPath, rejects.join('\n'))
const by = {}; for (const r of rejects) { const t = r.split('\t')[0]; by[t] = (by[t] || 0) + 1 }
console.log('candidates', cands.length, 'accepted', final.length, 'rejected', by)
