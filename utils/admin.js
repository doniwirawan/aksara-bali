// Centralized admin-email check.
// Admin emails come from the NEXT_PUBLIC_ADMIN_EMAIL env var (comma-separated for
// multiple). Kept out of source so no personal email is committed to the repo.
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

// Primary email — used for display (header, env hints).
export const ADMIN_EMAIL = ADMIN_EMAILS[0] || ''

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
