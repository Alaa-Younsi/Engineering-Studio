/**
 * Shared content model for the public site and the admin dashboard.
 * These types mirror the columns in supabase/schema.sql.
 */

export interface ArticleBlock {
  /** Optional sub-heading rendered above the paragraphs. */
  heading?: string
  paragraphs: string[]
}

export interface Article {
  /** DB primary key. Absent only for a brand-new, unsaved draft. */
  id?: string
  /** URL segment: /nouvelles/<slug>. Must be unique. */
  slug: string
  /** ISO date, e.g. '2026-02-18'. */
  date: string
  title: string
  /** Public URL or data URL. Omit for a placeholder. */
  cover?: string
  blocks: ArticleBlock[]
  tags: string[]
  /** Hidden from the public site when false. */
  published: boolean
  /** Set by the store; used for the "recent activity" glance. */
  updatedAt?: string
}

export interface ProjectMedia {
  type: 'image' | 'video'
  /** Public URL or data URL. Omit for a placeholder tile. */
  src?: string
}

export interface Project {
  /** DB primary key. Absent only for a brand-new, unsaved project. */
  id?: string
  title: string
  /** Rendered one line per entry, e.g. ['Gue de constantine', "Wilaya d'Alger"]. */
  location: string[]
  tags: string[]
  /** Thumbnails shown alongside the main media. The first one is the cover. */
  media: ProjectMedia[]
  /** Hidden from the public site when false. */
  published: boolean
  updatedAt?: string
}

/* ── Form submissions (Devis / Réunion / Contact) ─────────────────────────── */

export type SubmissionKind = 'devis' | 'reunion' | 'contact'

/** One submitted field, kept as a label/value pair for generic rendering. */
export interface SubmissionField {
  label: string
  value: string
}

/** A file a visitor attached to a devis request, held in a private bucket. */
export interface SubmissionAttachment {
  /** Original file name, for display. */
  name: string
  /** Object path inside the private bucket; resolved to a signed URL on demand. */
  path: string
  size: number
}

export interface Submission {
  /** DB primary key. Absent only for a brand-new, unsaved submission. */
  id?: string
  kind: SubmissionKind
  /** Best-effort display name of the sender. */
  name: string
  email: string
  phone?: string
  /** Every submitted field, in display order. */
  fields: SubmissionField[]
  /** Plans/drawings sent with a devis request. */
  attachments?: SubmissionAttachment[]
  /** Marked true once an admin has opened it. */
  read: boolean
  /** Set by the store when the submission is created. */
  createdAt?: string
}

/** A submission as the public forms build it, before the store assigns ids. */
export type SubmissionInput = Omit<Submission, 'id' | 'createdAt' | 'read'>

export const SUBMISSION_LABELS: Record<SubmissionKind, string> = {
  devis: 'Devis',
  reunion: 'Réunion',
  contact: 'Contact',
}

const MONTHS_FR = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
]

/** '2026-02-18' → '18 Fév 2026'. */
export function formatArticleDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_FR[Number(month) - 1]} ${year}`
}

/** ISO timestamp → '18 Fév 2026 à 14:30' (best-effort, falls back to '—'). */
export function formatSubmissionDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return `${day} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()} à ${time}`
}

/** Turn a title into a URL-safe slug, stripping accents. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
