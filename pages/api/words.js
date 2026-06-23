// Public practice-words API — sourced from Supabase (public.practice_words),
// with the bundled QUIZ_WORDS list as an offline fallback.
//   GET /api/words/                  → all words
//   GET /api/words/?difficulty=easy  → filter by easy | medium | hard
// CORS-enabled for mobile/Flutter or web clients.
import { supabase } from '../../utils/supabase'
import { convertLatinToBalinese, QUIZ_WORDS } from '../../utils/balineseConverter'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const { difficulty } = req.query
  let words = null
  let source = 'database'

  try {
    let q = supabase
      .from('practice_words')
      .select('latin, meaning, category, difficulty')
      .order('sort_order', { ascending: true })
    if (difficulty) q = q.eq('difficulty', difficulty)
    const { data, error } = await q
    if (error) throw error
    if (data && data.length) words = data
  } catch (_) { /* fall back below */ }

  if (!words) {
    source = 'bundled'
    words = QUIZ_WORDS.filter(w => !difficulty || w.difficulty === difficulty)
  }

  const out = words.map(w => ({ ...w, balinese: convertLatinToBalinese(w.latin) }))
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res.status(200).json({ count: out.length, source, words: out })
}
