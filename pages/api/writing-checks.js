// POST /api/writing-checks — log a handwriting check result
// GET  /api/writing-checks — get aggregate stats

import { createServerClient, getUserFromRequest } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { wordLatin, score, precisionPct, recallPct, passed } = req.body

    if (!wordLatin || score === undefined || passed === undefined) {
      return res.status(400).json({ error: 'wordLatin, score, and passed are required' })
    }

    try {
      const user = await getUserFromRequest(req)
      const supabase = createServerClient()
      const { error } = await supabase.from('writing_checks').insert({
        user_id: user?.id ?? null,
        word_latin: wordLatin,
        score,
        precision_pct: precisionPct ?? null,
        recall_pct: recallPct ?? null,
        passed,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Writing check log error:', err)
      return res.status(500).json({ error: 'Failed to log writing check' })
    }
  }

  if (req.method === 'GET') {
    try {
      // scope=me → only this user's checks; default → community aggregate
      const scopeMe = req.query.scope === 'me'
      const user = scopeMe ? await getUserFromRequest(req) : null
      if (scopeMe && !user) return res.status(401).json({ error: 'Auth required' })

      const supabase = createServerClient()
      let query = supabase
        .from('writing_checks')
        .select('score, passed, word_latin')
        .order('created_at', { ascending: false })
        .limit(100)
      if (scopeMe) query = query.eq('user_id', user.id)
      const { data, error } = await query

      if (error) throw error

      const total = data?.length ?? 0
      const passed = data?.filter(r => r.passed).length ?? 0
      const avgScore = total > 0
        ? Math.round(data.reduce((s, r) => s + r.score, 0) / total)
        : 0

      return res.status(200).json({ total, passed, avgScore })
    } catch (err) {
      console.error('Writing stats error:', err)
      return res.status(500).json({ error: 'Failed to fetch writing stats' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
