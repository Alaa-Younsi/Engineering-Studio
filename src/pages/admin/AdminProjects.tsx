import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProject, listProjects } from '../../lib/content/store'
import type { Project } from '../../lib/content/types'
import { AdminButton, Card, Spinner } from '../../components/admin/ui'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    listProjects().then(setProjects).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const remove = async (id: string) => {
    await deleteProject(id)
    setPendingDelete(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-white text-3xl">Portefeuille</h1>
          <p className="font-body text-sm text-secondary mt-2">Les projets publiés apparaissent sur la page Portefeuille.</p>
        </div>
        <Link to="/admin/portefeuille/new"><AdminButton>Nouveau projet</AdminButton></Link>
      </div>

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-body text-sm text-secondary">Aucun projet. Créez le premier.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-white/5">
          {projects.map(project => {
            const cover = project.media.find(m => m.src)?.src
            return (
              <div key={project.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-14 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#e2e2e2]">
                  {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-white truncate">{project.title}</p>
                  <p className="font-body text-xs text-secondary mt-1">
                    {project.media.length} média{project.media.length > 1 ? 's' : ''} · <span className={project.published ? 'text-emerald-300/80' : 'text-amber-300/80'}>{project.published ? 'Publié' : 'Brouillon'}</span>
                  </p>
                </div>
                {pendingDelete === project.id ? (
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-secondary hidden sm:inline">Supprimer ?</span>
                    <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => project.id && remove(project.id)}>Oui</AdminButton>
                    <AdminButton variant="ghost" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(null)}>Non</AdminButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/portefeuille/${project.id}`}><AdminButton variant="ghost" className="!py-1.5 !px-4 text-xs">Modifier</AdminButton></Link>
                    <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => setPendingDelete(project.id ?? null)}>Suppr.</AdminButton>
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
