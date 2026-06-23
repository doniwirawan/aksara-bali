// Extract the sanskritDatabase keys/variants from the web converter and emit a
// Dart Set for on-device Sanskrit detection (used to toggle murda forms).
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync(new URL('../components/LatinBalineseConverter.jsx', import.meta.url), 'utf8')
const start = src.indexOf('const sanskritDatabase = {')
const braceStart = src.indexOf('{', start)
let depth = 0, end = -1
for (let i = braceStart; i < src.length; i++) {
  if (src[i] === '{') depth++
  else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break } }
}
const literal = src.slice(braceStart, end + 1)
// eslint-disable-next-line no-eval
const db = eval('(' + literal + ')')

const words = new Set()
for (const [key, val] of Object.entries(db)) {
  words.add(key.toLowerCase())
  if (val && Array.isArray(val.variants)) val.variants.forEach(v => words.add(String(v).toLowerCase()))
  if (val && val.preferredForm) words.add(String(val.preferredForm).toLowerCase())
}
const sorted = [...words].sort()
const dart = [
  '// Auto-generated Sanskrit word set (for murda-form detection). Source: web converter.',
  'const Set<String> kSanskritWords = {',
  ...sorted.map(w => `  '${w.replace(/'/g, "\\'")}',`),
  '};',
  '',
].join('\n')
writeFileSync(new URL('../mobile-app/lib/sanskrit_data.dart', import.meta.url), dart)
console.log('wrote sanskrit_data.dart with', sorted.length, 'words')
