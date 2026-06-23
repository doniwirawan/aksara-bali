// POST /api/events — log an analytics event (page_view, click, ...)
// GET  /api/events — aggregate stats for the admin dashboard

import { createServerClient, getUserFromRequest } from '../../utils/supabase'

const MAX_LEN = 200

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { type, name, path, locale } = req.body || {}
    if (!type || !name) return res.status(400).json({ error: 'type and name required' })

    // Keep values bounded
    type = String(type).slice(0, 40)
    name = String(name).slice(0, MAX_LEN)
    path = path ? String(path).slice(0, MAX_LEN) : null
    locale = locale ? String(locale).slice(0, 8) : null

    try {
      const user = await getUserFromRequest(req)
      const supabase = createServerClient()
      const { error } = await supabase.from('events').insert({
        user_id: user?.id ?? null,
        type, name, path, locale,
        created_at: new Date().toISOString(),
      })
      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Event log error:', err)
      return res.status(500).json({ error: 'Failed to log event' })
    }
  }

  if (req.method === 'GET') {
    try {
      const supabase = createServerClient()

      // Totals by type
      const [pv, cl] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'page_view'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'click'),
      ])

      // Recent events for breakdowns (aggregated in JS to avoid extra DB functions)
      const { data, error } = await supabase
        .from('events')
        .select('type, name, created_at')
        .order('created_at', { ascending: false })
        .limit(5000)
      if (error) throw error

      const since = Date.now() - 7 * 24 * 60 * 60 * 1000
      const topPages = {}
      const topClicks = {}
      const topBlog = {}
      let last7d = 0
      for (const e of data || []) {
        if (new Date(e.created_at).getTime() >= since) last7d++
        if (e.type === 'page_view') {
          topPages[e.name] = (topPages[e.name] || 0) + 1
          // A specific blog post (not the /blog/ listing itself)
          if (e.name && e.name.startsWith('/blog/') && e.name.replace(/\/+$/, '').length > 5) {
            const slug = e.name.replace(/^\/blog\//, '').replace(/\/+$/, '')
            topBlog[slug] = (topBlog[slug] || 0) + 1
          }
        } else if (e.type === 'click') {
          topClicks[e.name] = (topClicks[e.name] || 0) + 1
        }
      }
      const top = (obj) => Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, count]) => ({ name, count }))

      return res.status(200).json({
        pageViews: pv.count ?? 0,
        clicks: cl.count ?? 0,
        last7d,
        topPages: top(topPages),
        topClicks: top(topClicks),
        topBlog: top(topBlog),
      })
    } catch (err) {
      console.error('Event stats error:', err)
      return res.status(500).json({ error: 'Failed to fetch event stats' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
