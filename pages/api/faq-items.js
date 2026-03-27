import { createServerClient, supabase as anonClient } from '../../utils/supabase'

const ADMIN_EMAIL = 'doniwirawan166@gmail.com'

async function isAdmin(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await anonClient.auth.getUser(token)
  return user?.email === ADMIN_EMAIL
}

export default async function handler(req, res) {
  const supabase = createServerClient()

  if (req.method === 'GET') {
    const admin = await isAdmin(req)
    let query = supabase.from('faq_items').select('*').order('category').order('sort_order')
    if (!admin) query = query.eq('published', true)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (!await isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const { data, error } = await supabase.from('faq_items').insert([req.body]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { data, error } = await supabase.from('faq_items').update(fields).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.from('faq_items').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
