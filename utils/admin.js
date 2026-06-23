// Centralized admin-email check.
// Admins come from NEXT_PUBLIC_ADMIN_EMAIL (comma-separated for multiple) plus
// the hardcoded owner account below. Comparison is case-insensitive.
const ENV_ADMINS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

const OWNER_ADMINS = ['removed']

export const ADMIN_EMAILS = [...new Set([...ENV_ADMINS, ...OWNER_ADMINS])]

// Primary email — used for display (header, env hints).
export const ADMIN_EMAIL = ENV_ADMINS[0] || OWNER_ADMINS[0]

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
