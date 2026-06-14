// POST /api/quiz-results — save a quiz session result
// GET  /api/quiz-results — get leaderboard / aggregate stats

import { createServerClient, getUserFromRequest } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score, total, accuracy, maxStreak, difficulty, timeSeconds } = req.body

    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'score and total required' })
    }

    try {
      const user = await getUserFromRequest(req)
      const supabase = createServerClient()
      const { error } = await supabase.from('quiz_results').insert({
        user_id: user?.id ?? null,
        score,
        total,
        accuracy: accuracy || Math.round((score / total) * 100),
        max_streak: maxStreak || 0,
        difficulty: difficulty || 'all',
        time_seconds: timeSeconds || null,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Quiz result save error:', err)
      return res.status(500).json({ error: 'Failed to save quiz result' })
    }
  }

  if (req.method === 'GET') {
    try {
      // scope=me → only this user's sessions; default → community aggregate
      const scopeMe = req.query.scope === 'me'
      const user = scopeMe ? await getUserFromRequest(req) : null
      if (scopeMe && !user) return res.status(401).json({ error: 'Auth required' })

      const supabase = createServerClient()
      // Aggregate stats
      let statsQuery = supabase
        .from('quiz_results')
        .select('score, total, accuracy, max_streak, difficulty')
        .order('accuracy', { ascending: false })
        .limit(100)
      if (scopeMe) statsQuery = statsQuery.eq('user_id', user.id)
      const { data: stats } = await statsQuery

      if (!stats || stats.length === 0) {
        return res.status(200).json({ totalSessions: 0, avgAccuracy: 0, bestStreak: 0, recentSessions: [] })
      }

      const avgAccuracy = stats.reduce((s, r) => s + r.accuracy, 0) / stats.length
      const bestStreak = Math.max(...stats.map(r => r.max_streak))
      const totalSessions = stats.length

      return res.status(200).json({
        totalSessions,
        avgAccuracy: Math.round(avgAccuracy),
        bestStreak,
        recentSessions: stats.slice(0, 10),
      })
    } catch (err) {
      console.error('Quiz stats error:', err)
      return res.status(500).json({ error: 'Failed to fetch quiz stats' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
