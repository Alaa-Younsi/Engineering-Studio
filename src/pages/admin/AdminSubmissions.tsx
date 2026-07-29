import { useEffect, useMemo, useState } from 'react'
import { deleteSubmission, listSubmissions, markSubmissionRead } from '../../lib/content/store'
import type { Submission, SubmissionKind } from '../../lib/content/types'
import { SUBMISSION_LABELS, formatSubmissionDate } from '../../lib/content/types'
import { AdminButton, Card, Spinner } from '../../components/admin/ui'

type Filter = 'all' | SubmissionKind

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'devis', label: 'Devis' },
  { key: 'reunion', label: 'Réunion' },
  { key: 'contact', label: 'Contact' },
]

const KIND_BADGE: Record<SubmissionKind, string> = {
  devis: 'bg-sky-500/15 text-sky-300',
  reunion: 'bg-violet-500/15 text-violet-300',
  contact: 'bg-emerald-500/15 text-emerald-300',
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    listSubmissions().then(setSubmissions).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const visible = useMemo(
    () => (filter === 'all' ? submissions : submissions.filter(s => s.kind === filter)),
    [submissions, filter],
  )

  const unreadCount = submissions.filter(s => !s.read).length

  const toggle = async (s: Submission) => {
    const next = openId === s.id ? null : s.id ?? null
    setOpenId(next)
    if (next && !s.read && s.id) {
      await markSubmissionRead(s.id, true)
      setSubmissions(prev => prev.map(x => (x.id === s.id ? { ...x, read: true } : x)))
    }
  }

  const toggleRead = async (s: Submission) => {
    if (!s.id) return
    await markSubmissionRead(s.id, !s.read)
    setSubmissions(prev => prev.map(x => (x.id === s.id ? { ...x, read: !s.read } : x)))
  }

  const remove = async (id: string) => {
    await deleteSubmission(id)
    setPendingDelete(null)
    setSubmissions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-white text-3xl">Demandes</h1>
          <p className="font-body text-sm text-secondary mt-2">
            Toutes les demandes reçues via les formulaires Devis, Réunion et Contact.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="flex-shrink-0 rounded-full bg-white text-black font-body text-xs px-3 py-1.5">
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => {
          const count = f.key === 'all' ? submissions.length : submissions.filter(s => s.kind === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                filter === f.key ? 'bg-white text-black' : 'border border-white/20 text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {f.label} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-body text-sm text-secondary">Aucune demande pour le moment.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-white/5">
          {visible.map(s => {
            const open = openId === s.id
            return (
              <div key={s.id}>
                <button
                  onClick={() => void toggle(s)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  {!s.read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" aria-label="Non lue" />}
                  {s.read && <span className="h-2 w-2 flex-shrink-0" />}
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-1 font-body text-[0.7rem] ${KIND_BADGE[s.kind]}`}>
                    {SUBMISSION_LABELS[s.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-body text-sm truncate ${s.read ? 'text-white/80' : 'text-white font-medium'}`}>
                      {s.name || s.email || 'Sans nom'}
                    </p>
                    <p className="font-body text-xs text-secondary mt-0.5 truncate">{s.email}</p>
                  </div>
                  <span className="font-body text-xs text-secondary whitespace-nowrap hidden sm:block">
                    {formatSubmissionDate(s.createdAt)}
                  </span>
                  <span className={`text-secondary transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
                    ⌄
                  </span>
                </button>

                {open && (
                  <div className="px-5 pb-5 pt-1">
                    <dl className="rounded-xl bg-black/30 border border-white/5 divide-y divide-white/5">
                      {s.fields.map((f, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:gap-6 px-4 py-3">
                          <dt className="font-body text-xs text-secondary sm:w-40 sm:flex-shrink-0">{f.label}</dt>
                          <dd className="font-body text-sm text-white whitespace-pre-wrap break-words">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="font-body text-xs text-secondary mt-3 sm:hidden">{formatSubmissionDate(s.createdAt)}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {s.email && (
                        <a href={`mailto:${s.email}`}>
                          <AdminButton variant="ghost" className="!py-1.5 !px-4 text-xs">Répondre par email</AdminButton>
                        </a>
                      )}
                      <AdminButton variant="ghost" className="!py-1.5 !px-4 text-xs" onClick={() => void toggleRead(s)}>
                        {s.read ? 'Marquer non lue' : 'Marquer lue'}
                      </AdminButton>
                      {pendingDelete === s.id ? (
                        <span className="flex items-center gap-2">
                          <span className="font-body text-xs text-secondary">Supprimer ?</span>
                          <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => s.id && remove(s.id)}>Oui</AdminButton>
                          <AdminButton variant="ghost" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(null)}>Non</AdminButton>
                        </span>
                      ) : (
                        <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(s.id ?? null)}>Suppr.</AdminButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}
