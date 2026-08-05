import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminButton, Spinner } from './ui'

/**
 * Gates admin routes: spinner while resolving, login when signed out, and an
 * explicit refusal for a signed-in account that is not on the allow-list.
 *
 * This is a UX guard, not the security boundary — the database refuses those
 * accounts anyway (see `public.is_admin()` in supabase/schema.sql).
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { email, isAdmin, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!email) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display font-bold text-white text-2xl">Accès refusé</h1>
          <p className="font-body text-sm text-secondary mt-3 leading-relaxed">
            Le compte {email} n'est pas autorisé à administrer ce site.
            Contactez l'administrateur pour obtenir l'accès.
          </p>
          <div className="mt-8 flex justify-center">
            <AdminButton variant="ghost" onClick={() => void signOut()}>Se déconnecter</AdminButton>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
