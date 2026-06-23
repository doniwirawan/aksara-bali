import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { isAdminEmail } from '../utils/admin'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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

  const isAdmin = isAdminEmail(user?.email)

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
