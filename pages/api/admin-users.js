import { createServerClient, supabase as anonClient } from '../../utils/supabase'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''

async function isAdmin(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await anonClient.auth.getUser(token)
  return user?.email === ADMIN_EMAIL
}

export default async function handler(req, res) {
  if (!await isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 200 })
    if (error) return res.status(500).json({ error: error.message })
    const safe = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      email_confirmed_at: u.email_confirmed_at,
    }))
    return res.status(200).json(safe)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.auth.admin.deleteUser(id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
