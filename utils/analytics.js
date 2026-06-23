// Lightweight client-side analytics. Fire-and-forget; never throws.
import { authedFetch } from './supabase'

function send(type, name, path) {
  if (typeof window === 'undefined' || !name) return
  try {
    authedFetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        name: String(name).slice(0, 200),
        path: path || window.location.pathname,
        locale: localStorage.getItem('balinese-converter-locale') || undefined,
      }),
    }).catch(() => {})
  } catch (_) { /* ignore */ }
}

export const trackPageView = (path) => send('page_view', path || window.location.pathname, path)
export const trackEvent = (name) => send('click', name)
