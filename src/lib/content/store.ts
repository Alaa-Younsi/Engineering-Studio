import { supabase, MEDIA_BUCKET, DEVIS_BUCKET } from '../supabase'
import type {
  Article,
  Project,
  Submission,
  SubmissionAttachment,
  SubmissionInput,
  SubmissionKind,
} from './types'
import { validateAttachments, validateSubmission } from './validation'

/**
 * Single data-access layer for all content — articles, projects and the
 * submissions the public forms create. Every call goes to Supabase; row-level
 * security decides what an anonymous visitor may read and what only an
 * administrator may touch (see supabase/schema.sql).
 *
 * Errors propagate. Callers are expected to surface them rather than pretend a
 * write succeeded.
 */

export type ArticleInput = Omit<Article, 'id' | 'updatedAt'>
export type ProjectInput = Omit<Project, 'id' | 'updatedAt'>
export type { SubmissionInput }

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

/* ── Row mapping (Supabase snake_case ⇄ app camelCase) ────────────────────── */

interface ArticleRow {
  id: string
  slug: string
  date: string
  title: string
  cover: string | null
  blocks: Article['blocks']
  tags: string[]
  published: boolean
  updated_at: string
}

interface ProjectRow {
  id: string
  title: string
  location: string[]
  tags: string[]
  media: Project['media']
  published: boolean
  updated_at: string
}

const toArticle = (r: ArticleRow): Article => ({
  id: r.id,
  slug: r.slug,
  date: r.date,
  title: r.title,
  cover: r.cover ?? undefined,
  blocks: r.blocks ?? [],
  tags: r.tags ?? [],
  published: r.published,
  updatedAt: r.updated_at,
})

const toProject = (r: ProjectRow): Project => ({
  id: r.id,
  title: r.title,
  location: r.location ?? [],
  tags: r.tags ?? [],
  media: r.media ?? [],
  published: r.published,
  updatedAt: r.updated_at,
})

/* ── Articles ─────────────────────────────────────────────────────────────── */

export async function listArticles(opts: { publishedOnly?: boolean } = {}): Promise<Article[]> {
  let query = supabase.from('articles').select('*')
  if (opts.publishedOnly) query = query.eq('published', true)
  const { data, error } = await query.order('date', { ascending: false })
  if (error) throw error
  return (data as ArticleRow[]).map(toArticle)
}

export async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data ? toArticle(data as ArticleRow) : null
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toArticle(data as ArticleRow) : null
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: input.slug,
      date: input.date,
      title: input.title,
      cover: input.cover ?? null,
      blocks: input.blocks,
      tags: input.tags,
      published: input.published,
    })
    .select('*')
    .single()
  if (error) throw error
  return toArticle(data as ArticleRow)
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update({
      slug: input.slug,
      date: input.date,
      title: input.title,
      cover: input.cover ?? null,
      blocks: input.blocks,
      tags: input.tags,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return toArticle(data as ArticleRow)
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

export async function listProjects(opts: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  let query = supabase.from('projects').select('*')
  if (opts.publishedOnly) query = query.eq('published', true)
  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) throw error
  return (data as ProjectRow[]).map(toProject)
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toProject(data as ProjectRow) : null
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: input.title,
      location: input.location,
      tags: input.tags,
      media: input.media,
      published: input.published,
    })
    .select('*')
    .single()
  if (error) throw error
  return toProject(data as ProjectRow)
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: input.title,
      location: input.location,
      tags: input.tags,
      media: input.media,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return toProject(data as ProjectRow)
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

/* ── Submissions (Devis / Réunion / Contact forms) ────────────────────────── */

interface SubmissionRow {
  id: string
  kind: SubmissionKind
  name: string
  email: string
  phone: string | null
  fields: Submission['fields']
  attachments: Submission['attachments'] | null
  read: boolean
  created_at: string
}

const toSubmission = (r: SubmissionRow): Submission => ({
  id: r.id,
  kind: r.kind,
  name: r.name ?? '',
  email: r.email ?? '',
  phone: r.phone ?? undefined,
  fields: r.fields ?? [],
  attachments: r.attachments ?? [],
  read: r.read,
  createdAt: r.created_at,
})

/**
 * Saves a form submission. Called from the public site by anonymous visitors,
 * so everything is normalised and bounds-checked before it leaves the browser
 * (the database enforces the same limits again — see supabase/schema.sql).
 *
 * Throws on failure. Callers must surface that to the visitor rather than
 * reporting a success they cannot vouch for.
 *
 * Deliberately doesn't ask Postgres to hand the row back (`return=minimal`,
 * i.e. no `.select()`): anon can insert but has no SELECT policy on this
 * table — submissions are admin-only to read, by design — and requesting the
 * row back turns `INSERT ... RETURNING` into a read too, which fails RLS and
 * aborts the whole insert with an error that is indistinguishable from the
 * insert itself being refused.
 */
export async function createSubmission(input: SubmissionInput): Promise<void> {
  const clean = validateSubmission(input)

  const { error } = await supabase.from('submissions').insert({
    kind: clean.kind,
    name: clean.name,
    email: clean.email,
    phone: clean.phone ?? null,
    fields: clean.fields,
    attachments: clean.attachments ?? [],
  })
  if (error) throw error
}

export async function listSubmissions(opts: { kind?: SubmissionKind } = {}): Promise<Submission[]> {
  let query = supabase.from('submissions').select('*')
  if (opts.kind) query = query.eq('kind', opts.kind)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return (data as SubmissionRow[]).map(toSubmission)
}

export async function markSubmissionRead(id: string, read: boolean): Promise<void> {
  const { error } = await supabase.from('submissions').update({ read }).eq('id', id)
  if (error) throw error
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await supabase.from('submissions').delete().eq('id', id)
  if (error) throw error
}

/* ── Devis attachments ────────────────────────────────────────────────────── */

/**
 * Uploads the plans attached to a devis request into the private bucket and
 * returns the descriptors to store on the submission.
 *
 * Anonymous visitors can write here, so the caller must have already run
 * validateAttachments(); storage policies enforce the same ceiling server-side.
 */
export async function uploadAttachments(files: File[]): Promise<SubmissionAttachment[]> {
  validateAttachments(files)
  if (files.length === 0) return []

  const folder = newId()
  const out: SubmissionAttachment[] = []
  for (const file of files) {
    const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80)
    const path = `${folder}/${safe}`
    const { error } = await supabase.storage.from(DEVIS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })
    if (error) throw error
    out.push({ name: file.name, path, size: file.size })
  }
  return out
}

/** Short-lived download link for one attachment. Admin-only in practice. */
export async function attachmentUrl(path: string, expiresInSeconds = 300): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(DEVIS_BUCKET)
    .createSignedUrl(path, expiresInSeconds)
  if (error) return null
  return data.signedUrl
}

/* ── Media upload ─────────────────────────────────────────────────────────── */

/**
 * Uploads a file and returns a URL usable in <img>/<video>.
 *
 * The caller is expected to have run `compressImage()` already. The path
 * carries a random token so the object is immutable — hence the one-year
 * `cacheControl` (Supabase defaults to one hour).
 */
export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
