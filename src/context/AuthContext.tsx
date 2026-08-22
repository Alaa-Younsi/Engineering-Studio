import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, describeError } from '../lib/supabase'

interface AuthValue {
  /** Signed-in email, or null when logged out. */
  email: string | null
  /**
   * True only when the signed-in user is on the `admins` allow-list. Having an
   * account is not enough — the same check backs every RLS policy, so a
   * non-admin session can see nothing regardless of what the UI does.
   */
  isAdmin: boolean
  /** True while the initial session is being resolved. */
  loading: boolean
  /**
   * Set when the allow-list lookup could not be completed — almost always the
   * backend being unreachable. Distinguishes "not an admin" from "we could not
   * find out", which are very different things to show someone.
   */
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    /** Resolve the session into an email plus an allow-list verdict. */
    const resolve = async (session: Session | null) => {
      if (cancelled) return
      setEmail(session?.user.email ?? null)

      if (!session?.user) {
        setIsAdmin(false)
        setError(null)
        return
      }

      try {
        const { data, error: queryError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle()
        if (cancelled) return
        if (queryError) throw queryError
        setIsAdmin(Boolean(data))
        setError(null)
      } catch (e) {
        if (cancelled) return
        // Never grant access on a failed check — deny, and say why.
        setIsAdmin(false)
        setError(describeError(e))
      }
    }

    void supabase.auth.getSession().then(async ({ data }) => {
      await resolve(data.session)
      if (!cancelled) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolve(session)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (emailInput: string, password: string) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailInput.trim(),
      password,
    })
    if (signInError) throw new Error(describeError(signInError))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ email, isAdmin, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
