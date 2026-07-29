import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from '../supabase'
import type { Article, Project, Submission, SubmissionKind } from './types'
import { seedArticles, seedProjects } from './seed'

/**
 * Single data-access layer for all content. When Supabase is configured every
 * call hits the database; otherwise it transparently uses localStorage seeded
 * from seed.ts, so the site and admin dashboard work end-to-end before the
 * backend is linked. The public API is identical in both modes.
 */

export type ArticleInput = Omit<Article, 'id' | 'updatedAt'>
export type ProjectInput = Omit<Project, 'id' | 'updatedAt'>
export type SubmissionInput = Omit<Submission, 'id' | 'createdAt' | 'read'>

const LS_ARTICLES = 'es_articles'
const LS_PROJECTS = 'es_projects'
const LS_SUBMISSIONS = 'es_submissions'

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

/* ── localStorage helpers ─────────────────────────────────────────────────── */

function readLS<T>(key: string, seed: T[]): T[] {
  if (typeof localStorage === 'undefined') return seed
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return seed
  }
}

function writeLS<T>(key: string, value: T[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

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
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('articles').select('*')
    if (opts.publishedOnly) query = query.eq('published', true)
    const { data, error } = await query.order('date', { ascending: false })
    if (error) throw error
    return (data as ArticleRow[]).map(toArticle)
  }
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  const filtered = opts.publishedOnly ? all.filter(a => a.published) : all
  return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle()
    if (error) throw error
    return data ? toArticle(data as ArticleRow) : null
  }
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  return all.find(a => a.slug === slug) ?? null
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? toArticle(data as ArticleRow) : null
  }
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  return all.find(a => a.id === id) ?? null
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  if (isSupabaseConfigured && supabase) {
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
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  const record: Article = { ...input, id: newId(), updatedAt: new Date().toISOString() }
  writeLS(LS_ARTICLES, [record, ...all])
  return record
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  if (isSupabaseConfigured && supabase) {
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
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  const updated: Article = { ...input, id, updatedAt: new Date().toISOString() }
  writeLS(LS_ARTICLES, all.map(a => (a.id === id ? updated : a)))
  return updated
}

export async function deleteArticle(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) throw error
    return
  }
  const all = readLS<Article>(LS_ARTICLES, seedArticles)
  writeLS(LS_ARTICLES, all.filter(a => a.id !== id))
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

export async function listProjects(opts: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('projects').select('*')
    if (opts.publishedOnly) query = query.eq('published', true)
    const { data, error } = await query.order('created_at', { ascending: true })
    if (error) throw error
    return (data as ProjectRow[]).map(toProject)
  }
  const all = readLS<Project>(LS_PROJECTS, seedProjects)
  return opts.publishedOnly ? all.filter(p => p.published) : all
}

export async function getProject(id: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? toProject(data as ProjectRow) : null
  }
  const all = readLS<Project>(LS_PROJECTS, seedProjects)
  return all.find(p => p.id === id) ?? null
}

export async function createProject(input: ProjectInput): Promise<Project> {
  if (isSupabaseConfigured && supabase) {
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
  const all = readLS<Project>(LS_PROJECTS, seedProjects)
  const record: Project = { ...input, id: newId(), updatedAt: new Date().toISOString() }
  writeLS(LS_PROJECTS, [...all, record])
  return record
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  if (isSupabaseConfigured && supabase) {
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
  const all = readLS<Project>(LS_PROJECTS, seedProjects)
  const updated: Project = { ...input, id, updatedAt: new Date().toISOString() }
  writeLS(LS_PROJECTS, all.map(p => (p.id === id ? updated : p)))
  return updated
}

export async function deleteProject(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return
  }
  const all = readLS<Project>(LS_PROJECTS, seedProjects)
  writeLS(LS_PROJECTS, all.filter(p => p.id !== id))
}

/* ── Submissions (Devis / Réunion / Contact forms) ────────────────────────── */

interface SubmissionRow {
  id: string
  kind: SubmissionKind
  name: string
  email: string
  phone: string | null
  fields: Submission['fields']
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
  read: r.read,
  createdAt: r.created_at,
})

/** Saves a form submission. Called from the public site by anonymous visitors. */
export async function createSubmission(input: SubmissionInput): Promise<Submission> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        kind: input.kind,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        fields: input.fields,
      })
      .select('*')
      .single()
    if (error) throw error
    return toSubmission(data as SubmissionRow)
  }
  const all = readLS<Submission>(LS_SUBMISSIONS, [])
  const record: Submission = { ...input, id: newId(), read: false, createdAt: new Date().toISOString() }
  writeLS(LS_SUBMISSIONS, [record, ...all])
  return record
}

export async function listSubmissions(opts: { kind?: SubmissionKind } = {}): Promise<Submission[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('submissions').select('*')
    if (opts.kind) query = query.eq('kind', opts.kind)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return (data as SubmissionRow[]).map(toSubmission)
  }
  const all = readLS<Submission>(LS_SUBMISSIONS, [])
  const filtered = opts.kind ? all.filter(s => s.kind === opts.kind) : all
  return [...filtered].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export async function markSubmissionRead(id: string, read: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('submissions').update({ read }).eq('id', id)
    if (error) throw error
    return
  }
  const all = readLS<Submission>(LS_SUBMISSIONS, [])
  writeLS(LS_SUBMISSIONS, all.map(s => (s.id === id ? { ...s, read } : s)))
}

export async function deleteSubmission(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('submissions').delete().eq('id', id)
    if (error) throw error
    return
  }
  const all = readLS<Submission>(LS_SUBMISSIONS, [])
  writeLS(LS_SUBMISSIONS, all.filter(s => s.id !== id))
}

/* ── Media upload ─────────────────────────────────────────────────────────── */

/** Uploads a file and returns a URL usable in <img>/<video>. */
export async function uploadMedia(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }
  // Fallback: inline the file as a data URL so uploads work without a backend.
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
