export default async function handler(req, res) {
  const { query = 'bali', page = 1, per_page = 12 } = req.query
  const key = process.env.UNSPLASH_ACCESS_KEY

  if (!key) return res.status(500).json({ error: 'UNSPLASH_ACCESS_KEY not configured' })

  // Always append "bali" to the query so photos are always Bali-related
  const searchQuery = query.toLowerCase().includes('bali') ? query : `bali ${query}`

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${per_page}&page=${page}&orientation=landscape`
  const r = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } })

  if (!r.ok) return res.status(r.status).json({ error: 'Unsplash API error' })

  const data = await r.json()
  const photos = data.results.map(p => ({
    id: p.id,
    url: `${p.urls.raw}&auto=format&fit=crop&w=1200&q=80`,
    thumb: `${p.urls.raw}&auto=format&fit=crop&w=400&q=70`,
    alt: p.alt_description || p.description || 'Bali photo',
    author: p.user.name,
    authorUrl: `${p.user.links.html}?utm_source=aksara_bali&utm_medium=referral`,
    downloadLocation: p.links.download_location,
  }))

  res.setHeader('Cache-Control', 'public, s-maxage=300')
  res.status(200).json({ photos, total: data.total })
}
