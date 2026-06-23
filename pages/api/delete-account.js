// DELETE /api/delete-account — a logged-in user deletes their OWN account.
// Requires a valid Supabase access token (Authorization: Bearer <token>).
import { createServerClient, getUserFromRequest } from '../../utils/supabase'

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    res.setHeader('Allow', ['DELETE', 'POST'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Auth required' })

  try {
    const supabase = createServerClient()
    // Detach this user's logged activity (keep anonymous aggregate counts intact).
    await Promise.all([
      supabase.from('conversions').update({ user_id: null }).eq('user_id', user.id),
      supabase.from('quiz_results').update({ user_id: null }).eq('user_id', user.id),
      supabase.from('writing_checks').update({ user_id: null }).eq('user_id', user.id),
      supabase.from('events').update({ user_id: null }).eq('user_id', user.id),
    ])
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) throw error
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Delete account error:', err)
    return res.status(500).json({ error: 'Failed to delete account' })
  }
}
