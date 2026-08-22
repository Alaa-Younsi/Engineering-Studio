import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createArticle, getArticleById, updateArticle } from '../../lib/content/store'
import type { ArticleBlock } from '../../lib/content/types'
import { slugify } from '../../lib/content/types'
import { AdminButton, Card, Field, MediaUploader, Spinner, TagEditor, TextArea, TextInput, Toggle } from '../../components/admin/ui'
import { describeError } from '../../lib/supabase'

const emptyBlock = (): ArticleBlock => ({ heading: '', paragraphs: [''] })
const today = () => new Date().toISOString().slice(0, 10)

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!isNew)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState(today())
  const [cover, setCover] = useState<string | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [published, setPublished] = useState(true)
  const [blocks, setBlocks] = useState<ArticleBlock[]>([emptyBlock()])

  useEffect(() => {
    if (isNew) return
    getArticleById(id as string)
      .then(a => {
        if (!a) {
          setNotFound(true)
          return
        }
        setTitle(a.title)
        setSlug(a.slug)
        setDate(a.date)
        setCover(a.cover)
        setTags(a.tags)
        setPublished(a.published)
        setBlocks(a.blocks.length ? a.blocks.map(b => ({ heading: b.heading ?? '', paragraphs: b.paragraphs.length ? b.paragraphs : [''] })) : [emptyBlock()])
      })
      .finally(() => setLoading(false))
  }, [id, isNew])

  const onTitleChange = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  /* Block helpers */
  const setBlock = (i: number, patch: Partial<ArticleBlock>) =>
    setBlocks(blocks.map((b, bi) => (bi === i ? { ...b, ...patch } : b)))
  const setParagraph = (bi: number, pi: number, v: string) =>
    setBlock(bi, { paragraphs: blocks[bi].paragraphs.map((p, i) => (i === pi ? v : p)) })
  const addParagraph = (bi: number) => setBlock(bi, { paragraphs: [...blocks[bi].paragraphs, ''] })
  const removeParagraph = (bi: number, pi: number) =>
    setBlock(bi, { paragraphs: blocks[bi].paragraphs.filter((_, i) => i !== pi) })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) return setError('Le titre est obligatoire.')
    const finalSlug = slugify(slug || title)
    if (!finalSlug) return setError('Le slug est obligatoire.')

    const cleanedBlocks: ArticleBlock[] = blocks
      .map(b => ({ heading: b.heading?.trim() || undefined, paragraphs: b.paragraphs.map(p => p.trim()).filter(Boolean) }))
      .filter(b => b.heading || b.paragraphs.length)

    const input = { slug: finalSlug, date, title: title.trim(), cover, tags, published, blocks: cleanedBlocks }

    setSaving(true)
    try {
      if (isNew) await createArticle(input)
      else await updateArticle(id as string, input)
      navigate('/admin/nouvelles')
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
        <p className="font-body text-sm text-secondary">Cet article est introuvable.</p>
        <Link to="/admin/nouvelles" className="font-body text-sm text-white underline underline-offset-2 mt-4 inline-block">← Retour</Link>
      </div>
    )

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/admin/nouvelles" className="font-body text-xs text-secondary hover:text-white">← Nouvelles</Link>
          <h1 className="font-display font-bold text-white text-3xl mt-2">{isNew ? 'Nouvel article' : "Modifier l'article"}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-6 flex flex-col gap-6">
          <Field label="Titre">
            <TextInput value={title} onChange={e => onTitleChange(e.target.value)} placeholder="Titre de l'article" required />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Slug (URL)" hint={`/nouvelles/${slug || 'mon-article'}`}>
              <TextInput value={slug} onChange={e => { setSlug(e.target.value); setSlugTouched(true) }} placeholder="mon-article" />
            </Field>
            <Field label="Date">
              <TextInput type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </Field>
          </div>

          <Field label="Image de couverture">
            <MediaUploader value={cover} onChange={setCover} className="aspect-[16/9] max-w-md" />
          </Field>

          <Field label="Tags">
            <TagEditor tags={tags} onChange={setTags} />
          </Field>

          <Toggle checked={published} onChange={setPublished} label={published ? 'Publié (visible sur le site)' : 'Brouillon (masqué)'} />
        </Card>

        {/* Content blocks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white text-xl">Contenu</h2>
            <AdminButton variant="ghost" className="!py-2 !px-4 text-xs" onClick={() => setBlocks([...blocks, emptyBlock()])}>+ Section</AdminButton>
          </div>

          <div className="flex flex-col gap-4">
            {blocks.map((block, bi) => (
              <Card key={bi} className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-body text-xs text-secondary">Section {bi + 1}</span>
                  {blocks.length > 1 && (
                    <button type="button" onClick={() => setBlocks(blocks.filter((_, i) => i !== bi))} className="font-body text-xs text-red-300/80 hover:text-red-300">
                      Retirer la section
                    </button>
                  )}
                </div>

                <Field label="Sous-titre (optionnel)">
                  <TextInput value={block.heading ?? ''} onChange={e => setBlock(bi, { heading: e.target.value })} placeholder="Ex. Design durable" />
                </Field>

                <div className="flex flex-col gap-3">
                  <span className="font-body text-sm text-white">Paragraphes</span>
                  {block.paragraphs.map((p, pi) => (
                    <div key={pi} className="flex gap-2 items-start">
                      <TextArea value={p} onChange={e => setParagraph(bi, pi, e.target.value)} placeholder="Texte du paragraphe…" />
                      {block.paragraphs.length > 1 && (
                        <button type="button" onClick={() => removeParagraph(bi, pi)} aria-label="Retirer le paragraphe" className="text-secondary hover:text-white px-2 py-3">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addParagraph(bi)} className="font-body text-xs text-white/80 hover:text-white self-start underline underline-offset-2">
                    + Ajouter un paragraphe
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {error && <p className="font-body text-sm text-red-300">{error}</p>}

        <div className="flex items-center gap-3 sticky bottom-0 bg-bg/90 backdrop-blur py-4 -mx-6 lg:-mx-10 px-6 lg:px-10 border-t border-white/10">
          <AdminButton type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</AdminButton>
          <Link to="/admin/nouvelles"><AdminButton variant="ghost">Annuler</AdminButton></Link>
        </div>
      </div>
    </form>
  )
}
