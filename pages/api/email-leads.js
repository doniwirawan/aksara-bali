// POST /api/email-leads — record an email captured by the download gate
// GET  /api/email-leads — list captured emails (admin only)

import { createServerClient, supabase as anonClient } from '../../utils/supabase'
import { isAdminEmail } from '../../utils/admin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function isAdmin(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await anonClient.auth.getUser(token)
  return isAdminEmail(user?.email)
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, source, locale, path } = req.body || {}
    email = String(email || '').trim().toLowerCase()
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    try {
      const supabase = createServerClient()
      const { error } = await supabase.from('email_leads').insert({
        email,
        source: source ? String(source).slice(0, 60) : null,
        locale: locale ? String(locale).slice(0, 8) : null,
        path: path ? String(path).slice(0, 200) : null,
        created_at: new Date().toISOString(),
      })
      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('Email lead error:', err)
      return res.status(500).json({ error: 'Failed to save email' })
    }
  }

  if (req.method === 'GET') {
    if (!await isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('email_leads')
        .select('id, email, source, locale, path, created_at')
        .order('created_at', { ascending: false })
        .limit(5000)
      if (error) throw error
      return res.status(200).json(data || [])
    } catch (err) {
      console.error('Email lead list error:', err)
      return res.status(500).json({ error: 'Failed to fetch emails' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}
