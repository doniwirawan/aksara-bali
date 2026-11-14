// Indonesian ⇄ Balinese dictionary lookup with speech levels (anggah-ungguh).
// Works on any entry list in the Kamus shape; loadKamus() fetches the live
// data from aksarabali.doniwirawan.xyz so apps never bundle it.

/** Speech levels of a modern entry, in display order. */
export const LEVELS = [
  { key: 'a', id: 'andap', label: { id: 'Andap (biasa)', en: 'Andap (everyday)' } },
  { key: 's', id: 'singgih', label: { id: 'Alus singgih', en: 'Alus singgih (honouring)' } },
  { key: 'o', id: 'sor', label: { id: 'Alus sor', en: 'Alus sor (humbling)' } },
  { key: 'm', id: 'mider', label: { id: 'Mider', en: 'Mider (neutral polite)' } },
]

/** Lowercase and strip accents, so "pééd" finds "peed" and the other way round. */
export const normalize = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

const split = (v) => String(v || '').split(/[,/;]\s*/).map(x => x.trim()).filter(Boolean)

/**
 * Build a dictionary over `entries`.
 * Modern entries look like { i: 'rumah', a: 'umah', s: 'griya', o: '', m: '' }
 * (i = Indonesian; a/s/o/m = andap, alus singgih, alus sor, mider).
 * Pass `fields` to search other shapes, e.g. ['k', 'i'] for Old Balinese { k, i }.
 */
export function createKamus(entries, { fields = ['i', 'a', 's', 'o', 'm'] } = {}) {
  const list = Array.isArray(entries) ? entries : []

  // first entry wins for each Indonesian word, as in the printed order
  const byIndonesian = new Map()
  for (const e of list) {
    for (const w of split(e.i)) {
      const k = normalize(w)
      if (k && !byIndonesian.has(k)) byIndonesian.set(k, e)
    }
  }

  /** Ranked search over both languages: exact > listed alternative > prefix > substring. */
  function search(query, { limit = 40 } = {}) {
    const q = normalize(query)
    if (q.length < 2) return []
    const scored = []
    for (const e of list) {
      let best = 0
      for (const f of fields) {
        if (!e[f]) continue
        const v = normalize(e[f])
        if (v === q || split(v).includes(q)) best = Math.max(best, 3)
        else if (v.startsWith(q)) best = Math.max(best, 2)
        else if (v.includes(q)) best = Math.max(best, 1)
      }
      if (best) scored.push({ e, best })
    }
    return scored.sort((x, y) => y.best - x.best).slice(0, limit).map(s => s.e)
  }

  /** Entries whose Indonesian word or any Balinese form matches `word` exactly. */
  function lookup(word) {
    const q = normalize(word)
    if (!q) return []
    return list.filter(e => fields.some(f => split(e[f]).some(v => normalize(v) === q)))
  }

  /**
   * Pick one Balinese word for an Indonesian word at a speech level:
   * 'andap' prefers a > m > s > o, 'alus' prefers s > m > o > a.
   */
  function toBalinese(indonesianWord, { level = 'andap' } = {}) {
    const e = byIndonesian.get(normalize(indonesianWord))
    if (!e) return null
    const order = level === 'alus' ? ['s', 'm', 'o', 'a'] : ['a', 'm', 's', 'o']
    return split(order.map(k => e[k]).find(Boolean))[0] || null
  }

  /**
   * Word-by-word substitution of an Indonesian sentence. This is NOT
   * translation: Balinese word order and register need a human. Returns
   * tokens { token, out, matched, entry }; spaces and punctuation pass through
   * with matched: null, unknown words with matched: false.
   */
  function sentence(text, { level = 'andap' } = {}) {
    return String(text || '').split(/(\s+|[.,!?;:()"']+)/).filter(Boolean).map(token => {
      if (!/\p{L}/u.test(token)) return { token, out: token, matched: null }
      const e = byIndonesian.get(normalize(token))
      const pick = e ? toBalinese(token, { level }) : null
      return { token, out: pick || token, matched: !!pick, entry: e || undefined }
    })
  }

  /** Every distinct Balinese word form in the dictionary. */
  function forms() {
    const set = new Set()
    for (const e of list) for (const k of ['a', 's', 'o', 'm', 'k']) for (const v of split(e[k])) set.add(v.toLowerCase())
    return set
  }

  return { entries: list, search, lookup, toBalinese, sentence, forms }
}

const SITE = 'https://aksarabali.doniwirawan.xyz'
const FILES = { modern: '/data/kamus-bali.json', kuno: '/data/kamus-bali-kuno.json' }

/**
 * Fetch the live dictionary data and build a dictionary over it.
 * which: 'modern' (Indonesian ⇄ Balinese with speech levels) or 'kuno' (Old Balinese).
 * The data is not part of this MIT package: parts of it are CC BY-NC 4.0, so
 * credit the sources listed in the file's `source` field and keep use non-commercial.
 */
export async function loadKamus(which = 'modern', { baseUrl = SITE, fetch: f = globalThis.fetch } = {}) {
  if (!FILES[which]) throw new Error(`loadKamus: unknown dictionary "${which}" (use "modern" or "kuno")`)
  const res = await f(baseUrl + FILES[which])
  if (!res.ok) throw new Error(`loadKamus: ${res.status} fetching ${which} dictionary`)
  const data = await res.json()
  const kamus = createKamus(data.entries, which === 'kuno' ? { fields: ['k', 'i'] } : undefined)
  return Object.assign(kamus, { source: data.source, count: data.entries.length })
}
