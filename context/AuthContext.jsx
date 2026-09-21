import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Only the server knows which address is the admin's — asking it keeps that
  // address out of the bundle. This drives UI affordances only; every admin
  // route verifies the token itself.
  const resolveAdmin = async (session) => {
    if (!session?.access_token) return setIsAdmin(false)
    try {
      const res = await fetch('/api/admin-check/', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      setIsAdmin(res.ok && (await res.json()).admin === true)
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      resolveAdmin(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      resolveAdmin(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  // Send a password-reset email; the link returns to /auth/reset-password
  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

  // Set a new password (called from the reset-password page after the email link)
  const updatePassword = (password) =>
    supabase.auth.updateUser({ password })

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
