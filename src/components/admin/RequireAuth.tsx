import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from './ui'

/** Gates admin routes: shows a spinner while resolving, redirects to login when signed out. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { email, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!email) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
