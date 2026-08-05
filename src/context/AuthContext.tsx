import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthValue {
  /** Signed-in email, or null when logged out. */
  email: string | null
  /**
   * True only when the signed-in user is on the `admins` allow-list. Having an
   * account is not enough — the same check backs every RLS policy, so a
   * non-admin session can see nothing regardless of what the UI does.
   */
  isAdmin: boolean
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase

      const resolve = async (session: Session | null) => {
        setEmail(session?.user.email ?? null)
        if (!session?.user) {
          setIsAdmin(false)
          return
        }
        const { data } = await client
          .from('admins')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle()
        setIsAdmin(Boolean(data))
      }

      client.auth.getSession().then(async ({ data }) => {
        await resolve(data.session)
        setLoading(false)
      })
      const { data: sub } = client.auth.onAuthStateChange((_event, session: Session | null) => {
        void resolve(session)
      })
      return () => sub.subscription.unsubscribe()
    }
    // Demo mode: restore a local session flag.
    setEmail(localStorage.getItem(DEMO_KEY))
    setIsAdmin(true)
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
      setIsAdmin(false)
    } else {
      localStorage.removeItem(DEMO_KEY)
      setEmail(null)
    }
  }

  return (
    <AuthContext.Provider value={{ email, isAdmin, loading, configured: isSupabaseConfigured, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
