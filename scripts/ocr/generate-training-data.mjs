// Synthetic training-data generator for the Aksara Bali OCR model.
//
// It reuses the app's own Latin→Balinese converter so the ground-truth Balinese
// is byte-identical to what the site renders — no scraping, no manual labelling.
// For each Latin phrase we emit the exact Balinese Unicode line; text2image
// (from Tesseract's training tools) then renders those lines with the Noto Sans
// Balinese font to produce the labelled line images for LSTM training.
//
// Usage:
//   node scripts/ocr/generate-training-data.mjs [--lines 3000] [--eval 300] [--seed 42]
//
// Outputs (in scripts/ocr/out/):
//   ban.training_text   one Balinese line per row  (feed to text2image)
//   ban.eval_text       held-out lines for measuring accuracy
//   ban.reference.tsv   Latin<TAB>Balinese, for eyeballing correctness
//
// The word source is scripts/ocr/wordlist.txt if present (one Latin word or
// phrase per line, '#' for comments); otherwise it falls back to the app's
// built-in QUIZ_WORDS list.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'out')

// --- CLI args ---------------------------------------------------------------
const args = process.argv.slice(2)
const getArg = (name, def) => {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : def
}
const N_TRAIN = parseInt(getArg('lines', '3000'), 10)
const N_EVAL = parseInt(getArg('eval', '300'), 10)
let seed = parseInt(getArg('seed', '42'), 10)

// Small deterministic PRNG (mulberry32) so runs are reproducible.
const rand = () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)]

// --- Load the app's converter as ESM (it has no internal imports) -----------
async function loadConverter() {
  const src = readFileSync(join(HERE, '..', '..', 'utils', 'balineseConverter.js'), 'utf8')
  return import('data:text/javascript,' + encodeURIComponent(src))
}

// --- Build the Latin word pool ----------------------------------------------
function loadWords(converterMod) {
  const listPath = join(HERE, 'wordlist.txt')
  if (existsSync(listPath)) {
    const words = readFileSync(listPath, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
    if (words.length) return words
  }
  // Fallback: the app's built-in quiz vocabulary.
  return converterMod.QUIZ_WORDS.map((w) => w.latin.toLowerCase())
}

// --- Compose one training line from 1–4 words (+ occasional numbers/punct) ---
function makeLine(words) {
  const n = 1 + Math.floor(rand() * 4) // 1..4 words
  const parts = []
  for (let k = 0; k < n; k++) parts.push(pick(words))
  let line = parts.join(' ')
  const r = rand()
  if (r < 0.12) line += '.'          // sentence-final adeg-adeg
  else if (r < 0.20) line += ','
  if (rand() < 0.10) line = `${1 + Math.floor(rand() * 999)} ${line}` // numerals
  return line
}

function main() {
  return loadConverter().then((mod) => {
    const { convertLatinToBalinese } = mod
    const words = loadWords(mod)
    if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

    const seen = new Set()
    const rows = [] // { latin, bali }
    const target = N_TRAIN + N_EVAL
    let guard = 0
    while (rows.length < target && guard < target * 50) {
      guard++
      const latin = makeLine(words)
      const bali = convertLatinToBalinese(latin)
      if (!bali.trim() || seen.has(bali)) continue // skip empties + duplicates
      seen.add(bali)
      rows.push({ latin, bali })
    }

    const evalRows = rows.slice(0, N_EVAL)
    const trainRows = rows.slice(N_EVAL)

    // text2image expects one text line per row. It converts the app's
    // zero-width word separators (U+200B) into nothing; keep them so the
    // rendered script matches the site exactly.
    const toText = (r) => r.map((x) => x.bali).join('\n') + '\n'

    writeFileSync(join(OUT, 'ban.training_text'), toText(trainRows), 'utf8')
    writeFileSync(join(OUT, 'ban.eval_text'), toText(evalRows), 'utf8')
    writeFileSync(
      join(OUT, 'ban.reference.tsv'),
      'latin\tbalinese\n' + rows.map((r) => `${r.latin}\t${r.bali}`).join('\n') + '\n',
      'utf8'
    )

    console.log(`Word pool: ${words.length} entries`)
    console.log(`Wrote ${trainRows.length} training lines -> out/ban.training_text`)
    console.log(`Wrote ${evalRows.length} eval lines      -> out/ban.eval_text`)
    console.log(`Wrote ${rows.length} pairs               -> out/ban.reference.tsv`)
    console.log('\nNext: render + train with the commands in scripts/ocr/README.md')
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
