import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminButton, Spinner } from './ui'

/**
 * Gates admin routes: spinner while resolving, login when signed out, an
 * explicit refusal for a signed-in account that is not on the allow-list, and
 * a distinct screen when the allow-list could not be checked at all.
 *
 * This is a UX guard, not the security boundary — the database refuses those
 * accounts anyway (see `public.is_admin()` in supabase/schema.sql).
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { email, isAdmin, loading, error, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!email) return <Navigate to="/admin/login" replace />

  // A failed lookup is not a refusal — say so, and offer a retry.
  if (error) {
    return (
      <AdminNotice title="Connexion au serveur impossible" onSignOut={() => void signOut()}>
        Impossible de vérifier vos droits d'accès : {error}
        <br />
        Réessayez dans un instant. Si le problème persiste, vérifiez que le projet Supabase est
        actif et que les valeurs de <code className="text-white/80">.env</code> correspondent.
      </AdminNotice>
    )
  }

  if (!isAdmin) {
    return (
      <AdminNotice title="Accès refusé" onSignOut={() => void signOut()}>
        Le compte {email} n'est pas autorisé à administrer ce site.
        Contactez l'administrateur pour obtenir l'accès.
      </AdminNotice>
    )
  }

  return <>{children}</>
}

function AdminNotice({
  title, children, onSignOut,
}: { title: string; children: ReactNode; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display font-bold text-white text-2xl">{title}</h1>
        <p className="font-body text-sm text-secondary mt-3 leading-relaxed">{children}</p>
        <div className="mt-8 flex justify-center gap-3">
          <AdminButton onClick={() => window.location.reload()}>Réessayer</AdminButton>
          <AdminButton variant="ghost" onClick={onSignOut}>Se déconnecter</AdminButton>
        </div>
      </div>
    </div>
  )
}
