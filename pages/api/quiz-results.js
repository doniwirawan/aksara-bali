// POST /api/quiz-results — save a quiz session result
// GET  /api/quiz-results — get leaderboard / aggregate stats

import { createServerClient } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score, total, accuracy, maxStreak, difficulty, timeSeconds } = req.body

    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'score and total required' })
    }

    try {
      const supabase = createServerClient()
      const { error } = await supabase.from('quiz_results').insert({
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
      const supabase = createServerClient()
      // Aggregate stats
      const { data: stats } = await supabase
        .from('quiz_results')
        .select('score, total, accuracy, max_streak, difficulty')
        .order('accuracy', { ascending: false })
        .limit(100)

      if (!stats) return res.status(200).json({ stats: [] })

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
