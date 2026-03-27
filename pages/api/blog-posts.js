import { createServerClient } from '../../utils/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Denpasar12'

function isAdmin(req) {
  const auth = req.headers.authorization || ''
  return auth === `Bearer ${ADMIN_PASSWORD}`
}

export default async function handler(req, res) {
  const supabase = createServerClient()

  // GET — public: published posts only; admin: all posts
  if (req.method === 'GET') {
    const admin = isAdmin(req)
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (!admin) query = query.eq('published', true)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // All write operations require admin
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const post = { ...req.body, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('blog_posts').insert([post]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { data, error } = await supabase
      .from('blog_posts').update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
