import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { toBali, toLatin, convertLatinToBalinese, QUIZ_WORDS } from '../src/index.js'

// Outputs recorded from the aksarabali.doniwirawan.xyz engine before it moved
// into this package. A change here changes what the live site writes.
const golden = JSON.parse(readFileSync(new URL('./golden.json', import.meta.url), 'utf8'))

test('Latin -> Aksara Bali matches the recorded outputs', () => {
  for (const [latin, bali] of Object.entries(golden.forward)) {
    assert.equal(toBali(latin), bali, `toBali(${JSON.stringify(latin)})`)
  }
})

test('Aksara Bali -> Latin matches the recorded outputs', () => {
  for (const [bali, latin] of Object.entries(golden.reverse)) {
    assert.equal(toLatin(bali), latin, `toLatin(${JSON.stringify(bali)})`)
  }
})

test('aliases point at the same functions', () => {
  assert.equal(toBali, convertLatinToBalinese)
})

test('every quiz word converts to script', () => {
  for (const w of QUIZ_WORDS) assert.match(toBali(w.latin), /[ᬀ-᭿]/, w.latin)
})

test('empty input stays empty', () => {
  assert.equal(toBali(''), '')
  assert.equal(toLatin(''), '')
})

test('keyboard glyphs are all Balinese codepoints', async () => {
  const { BALINESE_KEYBOARD } = await import('../src/index.js')
  const keys = [...BALINESE_KEYBOARD.groups.flatMap(g => g.keys), ...BALINESE_KEYBOARD.marks.keys]
  for (const k of keys) assert.match(k.char, /^[\u1B00-\u1B7F]+$/, k.label)
})
