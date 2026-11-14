// Parse headwords from the column-split Kamus Bali-Indonesia 2016 text.
// usage: node parse.mjs <kbi-cols.txt> <kamus-bali.json> <out.json> <rejects.txt>
import fs from 'node:fs'

const [colsPath, kamusPath, outPath, rejPath] = process.argv.slice(2)
const lines = fs.readFileSync(colsPath, 'utf8').split('\n')
const kamus = JSON.parse(fs.readFileSync(kamusPath, 'utf8')).entries

const FIRST_PAGE = 18, LAST_PAGE = 820
const POS = new Set(['n', 'v', 'V', 'a', 'adv', 'num', 'p', 'P', 'pron'])
const LEVEL = { Asi: 's', Aso: 'o', Ami: 'm', Ks: 'a' }
const REGION = { Bll: 'Buleleng', BU: 'Buleleng', Jbr: 'Jembrana', Tbn: 'Tabanan', Bdg: 'Badung', Dps: 'Denpasar', Gnr: 'Gianyar', Bgl: 'Bangli', Klk: 'Klungkung', Kra: 'Karangasem' }
const ABBR = { yg: 'yang', dg: 'dengan', dr: 'dari', pd: 'pada', tt: 'tentang', sbg: 'sebagai', spt: 'seperti', utk: 'untuk', dsb: 'dan sebagainya', dl: 'dalam', krn: 'karena', thd: 'terhadap', sso: 'seseorang', sst: 'sesuatu', sj: 'sejenis', kpd: 'kepada', tsb: 'tersebut', dll: 'dan lain-lain', km: 'karena', tdk: 'tidak', sdh: 'sudah', blm: 'belum', org: 'orang', hrs: 'harus', msh: 'masih', bbrp: 'beberapa' }
// Misreadings so regular that the wrong spelling outnumbers the right one.
const FIXED = { wama: 'warna', berwama: 'berwarna', wamanya: 'warnanya', wami: 'warni', sempuma: 'sempurna', puma: 'purna', bemama: 'bernama', temak: 'ternak' }
// Readings too ambiguous to repair: an entry containing one is dropped.
const UNSURE = new Set(['bam', 'blang', 'mmah', 'imtuk'])
const SUBENTRY = /^['^`]?[A-Za-zé^6.\-]+(\s*,\s*[A-Za-zé^6.\-]+)*(\s*\([^)]*\))?\s+(?:(?:Asi|Aso|Ami|Ks)\s+)?(n|v|V|a|adv|num|p|pron)\b/

// --- group lines into columns per page
const columns = []
let page = 0, col = null, lastX = null
for (const raw of lines) {
  const m = raw.match(/^=== page (\d+)/)
  if (m) { page = +m[1]; col = null; lastX = null; continue }
  if (page < FIRST_PAGE || page > LAST_PAGE || !raw.includes('\t')) continue
  const [xs, text] = raw.split('\t')
  const x = +xs
  if (/^(Kamus|Bali-Indonesia|\d+)$/.test(text.trim())) continue
  // the right column starts when x jumps far right of the left column
  if (!col || (lastX !== null && x > 150 && col.side === 'L')) {
    col = { page, side: x > 150 ? 'R' : 'L', rows: [] }
    columns.push(col)
  }
  col.rows.push({ x, text: text.trim() })
  lastX = x
}

// --- every word in the book, for the OCR-noise filter
const freq = new Map()
for (const c of columns) for (const r of c.rows) for (const w of r.text.toLowerCase().match(/[a-z]+/g) || []) freq.set(w, (freq.get(w) || 0) + 1)
const known = new Set()
for (const e of kamus) for (const w of (e.i || '').toLowerCase().match(/[a-z]+/g) || []) known.add(w)
const goodWord = (w) => known.has(w) || (freq.get(w) || 0) >= 3 || Object.values(ABBR).join(' ').split(' ').includes(w)

const existing = new Set()
for (const e of kamus) for (const f of [e.a, e.s, e.o, e.m]) for (const v of (f || '').split(/[,/]\s*/)) existing.add(v.trim().toLowerCase().normalize('NFC'))

// Words of the book with dots stripped (headwords are syllabified "a.ben.ang").
const flat = new Map()
for (const c of columns) for (const r of c.rows) for (const w of r.text.replace(/\./g, '').replace(/[\^6]/g, 'é').toLowerCase().match(/[a-zé]+(?:-[a-zé]+)*/g) || []) flat.set(w, (flat.get(w) || 0) + 1)
// Gloss words the OCR misread in a regular way: fix only when the fixed word is common in the book.
const common = (w) => known.has(w) || (freq.get(w) || 0) >= 8
const SWAPS = [['ij', 'rj'], ['m', 'rn'], ['m', 'ru'], ['im', 'un'], ['ii', 'u'], ['i', 'l'], ['l', 'i'], ['cl', 'd'], ['h', 'b'], ['rn', 'm']]
// A misreading can itself repeat (berwama), so a word not in the Kamus is
// swapped for any spelling the book uses at least twice as often.
function fixWord(w) {
  if (FIXED[w]) return FIXED[w]
  if (known.has(w)) return w
  const fw = freq.get(w) || 0
  for (const [from, to] of SWAPS) {
    let idx = w.indexOf(from)
    while (idx !== -1) {
      const cand = w.slice(0, idx) + to + w.slice(idx + from.length)
      // Indonesian has no "ij": that one is always the OCR reading "rj".
      if (known.has(cand) || (common(cand) && ((freq.get(cand) || 0) > fw || from === 'ij'))) return cand
      idx = w.indexOf(from, idx + 1)
    }
  }
  return w
}
const cleanHead = (h) => h.replace(/^['^`]+/, '').replace(/\./g, '').replace(/[\^6]/g, 'é').toLowerCase()

const out = [], rejects = [], cands = []
for (const c of columns) {
  if (!c.rows.length) continue
  const minX = Math.min(...c.rows.map(r => r.x))
  for (let i = 0; i < c.rows.length; i++) {
    const r = c.rows[i]
    if (r.x > minX + 4) continue // not a headword line
    // headword line plus its continuation lines (deeper indent, not a sub-entry)
    let text = r.text
    for (let j = i + 1; j < c.rows.length; j++) {
      const n = c.rows[j]
      if (n.x <= minX + 4 || SUBENTRY.test(n.text)) break
      text += (text.endsWith('-') ? '' : ' ') + n.text
      if (text.endsWith('-')) text = text.slice(0, -1)
    }
    const toks = text.split(/\s+/)
    let k = 0
    const head = toks[k++]
    // variants ("abil, a.bil.an") and a homonym number before the labels
    while (k < toks.length && (toks[k - 1].endsWith(',') || /^\d$/.test(toks[k]))) k++
    let level = 'a', note = []
    while (k < toks.length && (LEVEL[toks[k]] || REGION[toks[k]])) {
      if (LEVEL[toks[k]]) { level = LEVEL[toks[k]]; if (toks[k] === 'Ks') note.push('kasar') }
      else note.push(`dialek ${REGION[toks[k]]}`)
      k++
    }
    if (!POS.has(toks[k])) { rejects.push(`nopos\t${text}`); continue }
    k++
    let def = toks.slice(k).join(' ')
    // glosses only: each numbered sense up to its first ':' (examples follow it)
    const senses = def.split(/(?:^|\s)(?=\d\s)/).map(s => s.replace(/^\d\s+/, '').split(':')[0].replace(/[;,]\s*$/, '').trim()).filter(Boolean)
    let gloss = senses.join('; ').replace(/\s+/g, ' ').replace(/\s*;\s*/g, '; ').trim()
    gloss = gloss.replace(/\b(yg|dg|dr|pd|tt|sbg|spt|utk|dsb|dl|krn|thd|sso|sst|sj|kpd|tsb|dll|km|tdk|sdh|blm|org|hrs|msh|bbrp)\b/g, m => ABBR[m])
    gloss = gloss.replace(/\b(pb|ki)\b.*$/, '').replace(/[;,\s]+$/, '')
    // "mengan-cam": a line-break hyphen the layout kept; rejoin when the whole word is real.
    gloss = gloss.replace(/\b([a-z]+)-([a-z]+)\b/g, (m, x, y) => common(x + y) || (freq.get(x + y) || 0) >= 1 || common(fixWord(x + y)) ? fixWord(x + y) : m)
    gloss = gloss.replace(/\bkp dari\b/g, 'kependekan dari').replace(/(;\s*)?\b[a-zA-Z]\s*$/, '')
    gloss = gloss.replace(/(^|;\s*)(?:n|v|a|adv|num|p|pron)\s+/g, '$1').replace(/eij/g, 'erj').replace(/[a-z]+/gi, w => /[A-Z]/.test(w) ? w : fixWord(w))
    const word = cleanHead(head.replace(/,$/, ''))
    cands.push({ word, gloss, def, head, text, level, note })
  }
}

// Second pass. Indonesian gloss vocabulary, counted over the glosses only, so a
// Balinese example sentence that slipped into a gloss shows up as rare words.
const glossFreq = new Map()
for (const c of cands) for (const w of c.gloss.toLowerCase().match(/[a-z]+/g) || []) glossFreq.set(w, (glossFreq.get(w) || 0) + 1)
const abbrWords = new Set(Object.values(ABBR).join(' ').split(' '))
const goodGloss = (w) => known.has(w) || abbrWords.has(w) || (glossFreq.get(w) || 0) >= 3
// "kecil-kecil", "berlimpah-limpah" are reduplication; "berlimpah-lun-pah" is a broken line.
const okHyphen = (t) => { const p = t.split('-'); return known.has(t.replace(/-/g, '')) || (p.length === 2 && (p[0] === p[1] || p[0].endsWith(p[1]))) }
for (const { word, gloss, def, head, text, level, note } of cands) {
    const why =
      !/^[a-zé]+(-[a-zé]+)*$/.test(word) || word.length < 2 ? 'head' :
      !gloss || gloss.length > 90 || /[^a-zA-Zé0-9 ;,()'\/\-]/.test(gloss) ? 'gloss' :
      /->|→/.test(def) ? 'xref' :
      (gloss.toLowerCase().match(/[a-z]+/g) || []).some(w => !goodWord(w) || !goodGloss(w) || UNSURE.has(w)) ? 'rare' :
      (gloss.toLowerCase().match(/[a-z]+(?:-[a-z]+)+/g) || []).some(t => !okHyphen(t)) ? 'hyphen' :
      existing.has(word) ? 'dup' :
      // A misread headword rarely recurs; a once-only headword must at least
      // split into syllables that each carry a vowel (ja.ga.di.ta, not ja.ga.dl.ta).
      // OCR reads "l" as "i", giving vowel runs Balinese spelling avoids (seiur, peiéh, mengkei).
      (flat.get(word) || 0) < 2 && /[eéou]i[aeéiou]|ei$|[aeéiou]iu|^i[aeéou].|ii/.test(word) ? 'vowelrun' :
      /\b(dari|dan|yang|dengan|untuk|atau|pada|ke|di|oleh|seperti)$/.test(gloss) ? 'cutoff' :
      (gloss.match(/\(/g) || []).length !== (gloss.match(/\)/g) || []).length ? 'paren' :
      (flat.get(word) || 0) < 2 && !head.replace(/^['^`]+/, '').replace(/,$/, '').split(/[.\-]/).every(sy => /[aeiouéèê^6]/i.test(sy)) ? 'syllable' : null
    if (why) { rejects.push(`${why}\t${word}\t${gloss}\t${text}`); continue }
    const e = { a: '', s: '', o: '', m: '', i: gloss, src: 'kbi2016' }
    e[level] = word
    if (note.length) e.n = note.join(', ')
    out.push(e)
}
// one entry per word+gloss
const seen = new Set()
const final = out.filter(e => { const k = (e.a + e.s + e.o + e.m) + '|' + e.i; if (seen.has(k)) return false; seen.add(k); return true })
fs.writeFileSync(outPath, JSON.stringify(final, null, 0).replace(/},{/g, '},\n{'))
fs.writeFileSync(rejPath, rejects.join('\n'))
const by = {}
for (const r of rejects) { const t = r.split('\t')[0]; by[t] = (by[t] || 0) + 1 }
console.log('columns', columns.length, 'accepted', final.length, 'rejected', rejects.length, by)
