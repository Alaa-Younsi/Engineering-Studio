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

  /*
   * Signing in is not enough: the account must also be listed in public.admins,
   * which is a manual step after running schema.sql. That is the cause almost
   * every time this screen appears, so show the fix rather than a dead end.
   */
  if (!isAdmin) {
    return (
      <AdminNotice title="Accès refusé" onSignOut={() => void signOut()}>
        Le compte <strong className="text-white">{email}</strong> est authentifié mais ne figure pas
        dans la liste des administrateurs.
        <br />
        <br />
        Exécutez ceci dans le SQL Editor de Supabase, puis rechargez&nbsp;:
        <code className="mt-3 block whitespace-pre-wrap rounded-lg bg-surface px-4 py-3 text-left text-[0.75rem] leading-relaxed text-white/80">
          {`insert into public.admins (user_id)\nselect id from auth.users\nwhere email = '${email}'\non conflict do nothing;`}
        </code>
      </AdminNotice>
    )
  }

  return <>{children}</>
}

function AdminNotice({
  title,
  children,
  onSignOut,
}: {
  title: string
  children: ReactNode
  onSignOut: () => void
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display font-bold text-white text-2xl">{title}</h1>
        <p className="font-body text-sm text-secondary mt-3 leading-relaxed">{children}</p>
        <div className="mt-8 flex justify-center gap-3">
          <AdminButton onClick={() => window.location.reload()}>Réessayer</AdminButton>
          <AdminButton variant="ghost" onClick={onSignOut}>
            Se déconnecter
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
