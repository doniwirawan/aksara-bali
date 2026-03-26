// POST /api/conversions — log a conversion event
// GET  /api/conversions — return usage stats

import { createServerClient } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inputText, outputLength, mode, locale } = req.body

    if (!inputText) {
      return res.status(400).json({ error: 'inputText required' })
    }

    try {
      const supabase = createServerClient()
      const { error } = await supabase.from('conversions').insert({
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
      const supabase = createServerClient()
      const { count, error } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })

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
