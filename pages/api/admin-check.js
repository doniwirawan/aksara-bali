// GET /api/admin-check — is the bearer token's account an admin?
//
// The browser used to decide this itself by comparing against
// NEXT_PUBLIC_ADMIN_EMAIL, which put the admin's address in every visitor's
// JS bundle. The answer comes from the server now, so the address stays private.
// This is a convenience for the UI, not the security boundary: every admin API
// route checks the token itself.

import { supabase as anonClient } from '../../utils/supabase'
import { isAdminEmail } from '../../utils/admin'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(200).json({ admin: false })

  try {
    const { data: { user } } = await anonClient.auth.getUser(token)
    return res.status(200).json({ admin: isAdminEmail(user?.email) })
  } catch (err) {
    console.error('Admin check error:', err)
    return res.status(200).json({ admin: false })
  }
}
