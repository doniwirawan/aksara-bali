// Public conversion API — Latin → Balinese script (Aksara Bali).
// Usage:
//   GET  /api/convert/?text=halo
//   POST /api/convert/  { "text": "halo" }
// CORS-enabled so it can be called from a mobile/Flutter or web client.
import { convertLatinToBalinese } from '../../utils/balineseConverter'

const MAX_LEN = 5000

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const text = req.method === 'POST' ? req.body?.text : req.query.text
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Provide "text" via ?text= (GET) or JSON body { "text": "..." } (POST).' })
  }
  if (text.length > MAX_LEN) {
    return res.status(413).json({ error: `text too long (max ${MAX_LEN} characters)` })
  }

  try {
    const balinese = convertLatinToBalinese(text)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return res.status(200).json({ latin: text, balinese })
  } catch (err) {
    console.error('Convert error:', err)
    return res.status(500).json({ error: 'Conversion failed' })
  }
}
