import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProject, getProject, updateProject } from '../../lib/content/store'
import type { ProjectMedia } from '../../lib/content/types'
import { AdminButton, Card, Field, MediaUploader, Spinner, TagEditor, TextInput, Toggle } from '../../components/admin/ui'
import { describeError } from '../../lib/supabase'

export default function AdminProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [published, setPublished] = useState(true)
  const [media, setMedia] = useState<ProjectMedia[]>([{ type: 'image' }])

  useEffect(() => {
    if (isNew) return
    getProject(id as string)
      .then(p => {
        if (!p) {
          setNotFound(true)
          return
        }
        setTitle(p.title)
        setLocation(p.location.length ? p.location : [''])
        setTags(p.tags)
        setPublished(p.published)
        setMedia(p.media.length ? p.media : [{ type: 'image' }])
      })
      .finally(() => setLoading(false))
  }, [id, isNew])

  const setMediaAt = (i: number, patch: Partial<ProjectMedia>) =>
    setMedia(media.map((m, mi) => (mi === i ? { ...m, ...patch } : m)))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) return setError('Le titre est obligatoire.')

    const input = {
      title: title.trim(),
      location: location.map(l => l.trim()).filter(Boolean),
      tags,
      published,
      media,
    }

    setSaving(true)
    try {
      if (isNew) await createProject(input)
      else await updateProject(id as string, input)
      navigate('/admin/portefeuille')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (notFound)
    return (
      <div>
        <p className="font-body text-sm text-secondary">Ce projet est introuvable.</p>
        <Link to="/admin/portefeuille" className="font-body text-sm text-white underline underline-offset-2 mt-4 inline-block">← Retour</Link>
      </div>
    )

  return (
    <form onSubmit={submit}>
      <div className="mb-8">
        <Link to="/admin/portefeuille" className="font-body text-xs text-secondary hover:text-white">← Portefeuille</Link>
        <h1 className="font-display font-bold text-white text-3xl mt-2">{isNew ? 'Nouveau projet' : 'Modifier le projet'}</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-6 flex flex-col gap-6">
          <Field label="Titre">
            <TextInput value={title} onChange={e => setTitle(e.target.value)} placeholder="Nom du projet" required />
          </Field>

          <Field label="Localisation" hint="Une ligne par entrée (ex. commune, wilaya).">
            <div className="flex flex-col gap-2">
              {location.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <TextInput value={line} onChange={e => setLocation(location.map((l, li) => (li === i ? e.target.value : l)))} placeholder="Ex. Wilaya d'Alger" />
                  {location.length > 1 && (
                    <button type="button" onClick={() => setLocation(location.filter((_, li) => li !== i))} aria-label="Retirer la ligne" className="text-secondary hover:text-white px-2">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setLocation([...location, ''])} className="font-body text-xs text-white/80 hover:text-white self-start underline underline-offset-2">
                + Ajouter une ligne
              </button>
            </div>
          </Field>

          <Field label="Tags">
            <TagEditor tags={tags} onChange={setTags} />
          </Field>

          <Toggle checked={published} onChange={setPublished} label={published ? 'Publié (visible sur le site)' : 'Brouillon (masqué)'} />
        </Card>

        {/* Media gallery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-white text-xl">Médias</h2>
            <div className="flex gap-2">
              <AdminButton variant="ghost" className="!py-2 !px-4 text-xs" onClick={() => setMedia([...media, { type: 'image' }])}>+ Image</AdminButton>
              <AdminButton variant="ghost" className="!py-2 !px-4 text-xs" onClick={() => setMedia([...media, { type: 'video' }])}>+ Vidéo</AdminButton>
            </div>
          </div>
          <p className="font-body text-xs text-secondary mb-4">Le premier média sert de couverture.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {media.map((m, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-xs text-secondary">{m.type === 'video' ? 'Vidéo' : 'Image'} {i + 1}{i === 0 ? ' · couverture' : ''}</span>
                  {media.length > 1 && (
                    <button type="button" onClick={() => setMedia(media.filter((_, mi) => mi !== i))} className="font-body text-xs text-red-300/80 hover:text-red-300">Retirer</button>
                  )}
                </div>
                <MediaUploader value={m.src} video={m.type === 'video'} onChange={url => setMediaAt(i, { src: url })} className="aspect-[16/10]" />
              </Card>
            ))}
          </div>
        </div>

        {error && <p className="font-body text-sm text-red-300">{error}</p>}

        <div className="flex items-center gap-3 sticky bottom-0 bg-bg/90 backdrop-blur py-4 -mx-6 lg:-mx-10 px-6 lg:px-10 border-t border-white/10">
          <AdminButton type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</AdminButton>
          <Link to="/admin/portefeuille"><AdminButton variant="ghost">Annuler</AdminButton></Link>
        </div>
      </div>
    </form>
  )
}
