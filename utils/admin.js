// Centralized admin-email check. **Server-side only** — importing this from a
// component or page body inlines the admin address into the public JS bundle,
// which is what ADMIN_EMAIL exists to avoid. The browser asks /api/admin-check
// instead. ADMIN_EMAIL is the private var; NEXT_PUBLIC_ADMIN_EMAIL is still read
// as a fallback so an environment that only sets the old name keeps working.
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
