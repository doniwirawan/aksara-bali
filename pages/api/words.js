// Public practice-words API — the quiz/practice word list with Balinese script.
// Usage:
//   GET /api/words/                  → all words
//   GET /api/words/?difficulty=easy  → filter by easy | medium | hard
// CORS-enabled for mobile/Flutter or web clients.
import { convertLatinToBalinese, QUIZ_WORDS } from '../../utils/balineseConverter'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const { difficulty } = req.query
  let words = QUIZ_WORDS
  if (difficulty) words = words.filter(w => w.difficulty === difficulty)

  const data = words.map(w => ({ ...w, balinese: convertLatinToBalinese(w.latin) }))
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
  return res.status(200).json({ count: data.length, words: data })
}
