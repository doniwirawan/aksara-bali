import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createKamus, normalize, loadKamus } from '../src/index.js'

const fixture = [
  { i: 'rumah', a: 'umah', s: 'griya, puri', o: 'jero', m: '' },
  { i: 'makan', a: 'madaar', s: 'ngajeng', o: 'nunas', m: '' },
  { i: 'saya', a: 'icang', s: '', o: 'tiang', m: '' },
  { i: 'air', a: '', s: '', o: '', m: 'yéh' },
]
const k = createKamus(fixture)

test('search ranks exact over prefix over substring, both directions', () => {
  assert.equal(k.search('rumah')[0].a, 'umah')
  assert.equal(k.search('griya')[0].i, 'rumah')
  assert.equal(k.search('puri')[0].i, 'rumah')       // listed alternative
  assert.deepEqual(k.search('r'), [])                // too short
})

test('accents do not matter', () => {
  assert.equal(normalize('Yéh'), 'yeh')
  assert.equal(k.lookup('yeh')[0].i, 'air')
})

test('speech level picks the right column', () => {
  assert.equal(k.toBalinese('rumah'), 'umah')
  assert.equal(k.toBalinese('rumah', { level: 'alus' }), 'griya')
  assert.equal(k.toBalinese('air', { level: 'alus' }), 'yéh')   // falls back to mider
  assert.equal(k.toBalinese('kucing'), null)
})

test('sentence substitutes word by word and keeps punctuation', () => {
  const out = k.sentence('saya makan di rumah.', { level: 'andap' })
  assert.equal(out.map(t => t.out).join(''), 'icang madaar di umah.')
  assert.equal(out.find(t => t.token === 'di').matched, false)
  assert.equal(out.find(t => t.token === '.').matched, null)
})

test('Old Balinese shape via fields', () => {
  const kuno = createKamus([{ k: 'hayam', i: 'ayam' }], { fields: ['k', 'i'] })
  assert.equal(kuno.search('ayam')[0].k, 'hayam')
  assert.ok(kuno.forms().has('hayam'))
})

test('loadKamus builds from fetched data', async () => {
  const fakeFetch = async (url) => ({ ok: true, json: async () => ({ source: 'test', entries: fixture, url }) })
  const live = await loadKamus('modern', { fetch: fakeFetch })
  assert.equal(live.count, 4)
  assert.equal(live.toBalinese('makan', { level: 'alus' }), 'ngajeng')
  await assert.rejects(loadKamus('nope', { fetch: fakeFetch }))
})

test('works on the real site data', () => {
  const data = JSON.parse(readFileSync(new URL('../../../public/data/kamus-bali.json', import.meta.url), 'utf8'))
  const real = createKamus(data.entries)
  assert.ok(real.search('rumah').length > 0)
  assert.ok(real.forms().size > 5000)
})
