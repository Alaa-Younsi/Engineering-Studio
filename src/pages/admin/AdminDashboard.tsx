import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listArticles, listProjects } from '../../lib/content/store'
import type { Article, Project } from '../../lib/content/types'
import { formatArticleDate } from '../../lib/content/types'
import { AdminButton, Card, Spinner } from '../../components/admin/ui'

interface RecentItem {
  key: string
  label: string
  kind: 'Nouvelle' | 'Projet'
  when?: string
  to: string
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listArticles(), listProjects()])
      .then(([a, p]) => {
        setArticles(a)
        setProjects(p)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const publishedArticles = articles.filter(a => a.published).length
  const publishedProjects = projects.filter(p => p.published).length

  const recent: RecentItem[] = [
    ...articles.map<RecentItem>(a => ({ key: `a-${a.id}`, label: a.title, kind: 'Nouvelle', when: a.updatedAt, to: `/admin/nouvelles/${a.id}` })),
    ...projects.map<RecentItem>(p => ({ key: `p-${p.id}`, label: p.title, kind: 'Projet', when: p.updatedAt, to: `/admin/portefeuille/${p.id}` })),
  ]
    .sort((x, y) => (y.when ?? '').localeCompare(x.when ?? ''))
    .slice(0, 6)

  const formatWhen = (iso?: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? '—' : formatArticleDate(d.toISOString().slice(0, 10))
  }

  return (
    <div>
      <h1 className="font-display font-bold text-white text-3xl">Tableau de bord</h1>
      <p className="font-body text-sm text-secondary mt-2">Gérez les articles et les réalisations affichés sur le site.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <Card className="p-6">
          <p className="font-body text-xs text-secondary uppercase tracking-wide">Nouvelles</p>
          <p className="font-display font-bold text-white text-4xl mt-3">{articles.length}</p>
          <p className="font-body text-xs text-secondary mt-2">{publishedArticles} publiée{publishedArticles > 1 ? 's' : ''}</p>
          <div className="mt-5 flex gap-2">
            <Link to="/admin/nouvelles"><AdminButton variant="ghost" className="!py-2 !px-4 text-xs">Gérer</AdminButton></Link>
            <Link to="/admin/nouvelles/new"><AdminButton className="!py-2 !px-4 text-xs">Nouvel article</AdminButton></Link>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-body text-xs text-secondary uppercase tracking-wide">Portefeuille</p>
          <p className="font-display font-bold text-white text-4xl mt-3">{projects.length}</p>
          <p className="font-body text-xs text-secondary mt-2">{publishedProjects} publié{publishedProjects > 1 ? 's' : ''}</p>
          <div className="mt-5 flex gap-2">
            <Link to="/admin/portefeuille"><AdminButton variant="ghost" className="!py-2 !px-4 text-xs">Gérer</AdminButton></Link>
            <Link to="/admin/portefeuille/new"><AdminButton className="!py-2 !px-4 text-xs">Nouveau projet</AdminButton></Link>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <h2 className="font-display font-bold text-white text-xl mt-12 mb-4">Activité récente</h2>
      <Card className="divide-y divide-white/5">
        {recent.length === 0 && <p className="font-body text-sm text-secondary p-6">Aucun contenu pour le moment.</p>}
        {recent.map(item => (
          <Link key={item.key} to={item.to} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
            <div className="min-w-0">
              <p className="font-body text-sm text-white truncate">{item.label}</p>
              <p className="font-body text-xs text-secondary mt-0.5">{item.kind}</p>
            </div>
            <span className="font-body text-xs text-secondary whitespace-nowrap">{formatWhen(item.when)}</span>
          </Link>
        ))}
      </Card>
    </div>
  )
}
