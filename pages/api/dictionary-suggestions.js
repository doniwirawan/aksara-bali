import { createServerClient, supabase as anonClient } from '../../utils/supabase'
import { isAdminEmail } from '../../utils/admin'

async function isAdmin(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return false
  const { data: { user } } = await anonClient.auth.getUser(token)
  return isAdminEmail(user?.email)
}

const clean = (v, max = 120) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export default async function handler(req, res) {
  const supabase = createServerClient()

  // Anyone may suggest a word or flag a wrong one; only admins can read or
  // moderate the queue.
  if (req.method === 'POST') {
    const kind = req.body?.kind === 'flag' ? 'flag' : 'add'
    const indonesian = clean(req.body?.indonesian)
    const andap = clean(req.body?.andap)
    const singgih = clean(req.body?.singgih)
    const sor = clean(req.body?.sor)
    const mider = clean(req.body?.mider)
    const note = clean(req.body?.note, 500)
    const contributor = clean(req.body?.contributor, 80)
    const reportedEntry = clean(req.body?.reportedEntry, 300)

    if (!indonesian) return res.status(400).json({ error: 'Missing Indonesian word' })
    if (kind === 'add' && !(andap || singgih || sor || mider)) {
      return res.status(400).json({ error: 'Provide at least one Balinese form' })
    }
    // A flag is only useful if it says what is wrong.
    if (kind === 'flag' && !note) {
      return res.status(400).json({ error: 'Describe what is wrong with the entry' })
    }
    // Honeypot: real users never fill this.
    if (clean(req.body?.website)) return res.status(200).json({ ok: true })

    const { error } = await supabase.from('dictionary_suggestions')
      .insert([{ kind, indonesian, andap, singgih, sor, mider, note, contributor, reported_entry: reportedEntry }])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ok: true })
  }

  if (!await isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('dictionary_suggestions')
      .select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body || {}
    if (!id || !['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Missing id or invalid status' })
    }
    const { error } = await supabase.from('dictionary_suggestions')
      .update({ status }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
