// POST /api/conversions — log a conversion event
// GET  /api/conversions — return usage stats

import { createServerClient, getUserFromRequest } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inputText, outputLength, mode, locale } = req.body

    if (!inputText) {
      return res.status(400).json({ error: 'inputText required' })
    }

    try {
      const user = await getUserFromRequest(req)
      const supabase = createServerClient()
      const { error } = await supabase.from('conversions').insert({
        user_id: user?.id ?? null,
        input_length: inputText.length,
        output_length: outputLength || 0,
        mode: mode || 'latin_to_bali',
        locale: locale || 'id',
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Conversion log error:', err)
      return res.status(500).json({ error: 'Failed to log conversion' })
    }
  }

  if (req.method === 'GET') {
    try {
      // scope=me → only this user's conversions; default → community total
      const scopeMe = req.query.scope === 'me'
      const user = scopeMe ? await getUserFromRequest(req) : null
      if (scopeMe && !user) return res.status(401).json({ error: 'Auth required' })

      const supabase = createServerClient()
      let query = supabase.from('conversions').select('*', { count: 'exact', head: true })
      if (scopeMe) query = query.eq('user_id', user.id)
      const { count, error } = await query

      if (error) throw error
      return res.status(200).json({ total: count ?? 0 })
    } catch (err) {
      console.error('Stats error:', err)
      return res.status(500).json({ error: 'Failed to fetch stats' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
