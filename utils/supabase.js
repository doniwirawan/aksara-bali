import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Check .env.local')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// Server-side client with service role (API routes only)
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// The app uses trailingSlash: true, so /api/x 308-redirects to /api/x/. Some
// mobile browsers drop the Authorization header / POST body across that
// redirect, so we request the trailing-slash URL directly.
function withTrailingSlash(url) {
  const [path, query] = url.split('?')
  const p = path.endsWith('/') ? path : `${path}/`
  return query ? `${p}?${query}` : p
}

// Client-side fetch that attaches the logged-in user's access token (if any).
// Used so API routes can record which user an action belongs to.
export async function authedFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = { ...(options.headers || {}) }
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`
  return fetch(withTrailingSlash(url), { ...options, headers })
}

// Server-side: resolve the user from a request's bearer token. Returns null if
// absent or invalid (anonymous request).
export async function getUserFromRequest(req) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  try {
    const server = createServerClient()
    const { data, error } = await server.auth.getUser(token)
    if (error) return null
    return data.user ?? null
  } catch {
    return null
  }
}
