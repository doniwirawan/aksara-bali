export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { downloadLocation } = req.body
  if (!downloadLocation) return res.status(400).json({ error: 'Missing downloadLocation' })
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return res.status(500).json({ error: 'UNSPLASH_ACCESS_KEY not configured' })
  try {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } })
  } catch {
    // Non-fatal — log and continue
  }
  res.status(200).json({ ok: true })
}
