import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The Supabase project is created but may not be linked yet. We only build a
 * real client when both env vars are present; otherwise the whole app runs on
 * the localStorage fallback (see src/lib/content/store.ts) so the admin
 * dashboard is fully usable before the backend is wired.
 *
 * To connect: copy .env.example to .env and fill in the two values, then run
 * the SQL in supabase/schema.sql. No code changes are needed.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

/** Name of the public storage bucket used for covers and project media. */
export const MEDIA_BUCKET = 'media'

/**
 * Private bucket for plans attached to a devis request. Visitors may write to
 * it but never read it back — client drawings are confidential, so the admin
 * dashboard opens them through short-lived signed URLs.
 */
export const DEVIS_BUCKET = 'devis-files'
