import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthValue {
  /** Signed-in email, or null when logged out. */
  email: string | null
  loading: boolean
  /** True only when the real Supabase backend is wired. */
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

const DEMO_KEY = 'es_demo_admin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setEmail(data.session?.user.email ?? null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
        setEmail(session?.user.email ?? null)
      })
      return () => sub.subscription.unsubscribe()
    }
    // Demo mode: restore a local session flag.
    setEmail(localStorage.getItem(DEMO_KEY))
    setLoading(false)
  }, [])

  const signIn = async (emailInput: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password })
      if (error) throw error
      return
    }
    // Demo mode: accept any credentials so the dashboard is explorable now.
    if (!emailInput.trim()) throw new Error('Veuillez saisir un email.')
    localStorage.setItem(DEMO_KEY, emailInput)
    setEmail(emailInput)
  }

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(DEMO_KEY)
      setEmail(null)
    }
  }

  return (
    <AuthContext.Provider value={{ email, loading, configured: isSupabaseConfigured, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
