import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminButton, Field, TextInput } from '../../components/admin/ui'

export default function AdminLogin() {
  const { email: session, signIn, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to="/admin" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-10">
          <img src="/Assets/logo/Logo-seul.png" alt="" className="h-12 w-12 object-contain mb-5" />
          <h1 className="font-display font-bold text-white text-2xl">Administration</h1>
          <p className="font-body text-sm text-secondary mt-2">Connectez-vous pour gérer le contenu.</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <Field label="Email">
            <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" required />
          </Field>
          <Field label="Mot de passe">
            <TextInput type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </Field>

          {error && <p className="font-body text-sm text-red-300">{error}</p>}

          <AdminButton type="submit" disabled={busy} className="w-full">
            {busy ? 'Connexion…' : 'Se connecter'}
          </AdminButton>
        </form>

        {!configured && (
          <p className="font-body text-xs text-secondary text-center mt-6 leading-relaxed">
            Mode démo actif : saisissez n'importe quel email pour explorer le tableau de bord.
            La connexion réelle s'activera dès que Supabase sera lié.
          </p>
        )}

        <div className="text-center mt-8">
          <a href="/" className="font-body text-xs text-secondary hover:text-white transition-colors">← Retour au site</a>
        </div>
      </div>
    </div>
  )
}
