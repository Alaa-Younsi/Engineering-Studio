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

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

/** '2026-02-18' → '18 Fév 2026'. */
export function formatArticleDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_FR[Number(month) - 1]} ${year}`
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
