import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteArticle, listArticles } from '../../lib/content/store'
import type { Article } from '../../lib/content/types'
import { formatArticleDate } from '../../lib/content/types'
import { AdminButton, Card, Spinner } from '../../components/admin/ui'
import { SmartImage } from '../../components/SmartImage'

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    listArticles().then(setArticles).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const remove = async (id: string) => {
    await deleteArticle(id)
    setPendingDelete(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-white text-3xl">Nouvelles</h1>
          <p className="font-body text-sm text-secondary mt-2">Les articles publiés apparaissent sur la page Nouvelles.</p>
        </div>
        <Link to="/admin/nouvelles/new"><AdminButton>Nouvel article</AdminButton></Link>
      </div>

      {loading ? (
        <Spinner />
      ) : articles.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-body text-sm text-secondary">Aucun article. Créez le premier.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-white/5">
          {articles.map(article => (
            <div key={article.id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#e2e2e2]">
                {article.cover && <SmartImage src={article.cover} alt="" sizes="56px" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-white truncate">{article.title}</p>
                <p className="font-body text-xs text-secondary mt-1">
                  {formatArticleDate(article.date)} · <span className={article.published ? 'text-emerald-300/80' : 'text-amber-300/80'}>{article.published ? 'Publié' : 'Brouillon'}</span>
                </p>
              </div>
              {pendingDelete === article.id ? (
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-secondary hidden sm:inline">Supprimer ?</span>
                  <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => article.id && remove(article.id)}>Oui</AdminButton>
                  <AdminButton variant="ghost" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(null)}>Non</AdminButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to={`/admin/nouvelles/${article.id}`}><AdminButton variant="ghost" className="!py-1.5 !px-4 text-xs">Modifier</AdminButton></Link>
                  <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(article.id ?? null)}>Suppr.</AdminButton>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
