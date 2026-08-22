import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The Supabase client. The site talks to the database for everything —
 * articles, projects and form submissions — so both env vars are required.
 *
 * Set them in `.env` (see `.env.example`) and run `supabase/schema.sql` once.
 * Missing configuration is a deployment error, not a runtime mode: we fail
 * loudly here rather than silently serving stale or local-only content.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error(
    'Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, ' +
      'then rebuild. See .env.example.',
  )
}

/** Queries and auth should fail fast; uploads need room for a large plan. */
const TIMEOUT_MS = 15_000
const UPLOAD_TIMEOUT_MS = 120_000

/**
 * Every request is bounded. Without this a paused project or a blocked network
 * leaves the browser hanging indefinitely — the sign-in button spins forever
 * and the visitor is told nothing.
 */
const fetchWithTimeout: typeof fetch = (input, init) => {
  const target = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const ms = target.includes('/storage/v1/') ? UPLOAD_TIMEOUT_MS : TIMEOUT_MS

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)

  // Respect a caller-supplied signal as well as our own deadline.
  init?.signal?.addEventListener('abort', () => controller.abort(), { once: true })

  return fetch(input, { ...init, signal: controller.signal })
    .catch((e: unknown) => {
      if (e instanceof DOMException && e.name === 'AbortError' && !init?.signal?.aborted) {
        throw new Error('Le serveur ne répond pas. Réessayez dans un instant.')
      }
      throw e
    })
    .finally(() => clearTimeout(timer))
}

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: { fetch: fetchWithTimeout },
})

/** Name of the public storage bucket used for covers and project media. */
export const MEDIA_BUCKET = 'media'

/**
 * Private bucket for plans attached to a devis request. Visitors may write to
 * it but never read it back — client drawings are confidential, so the admin
 * dashboard opens them through short-lived signed URLs.
 */
export const DEVIS_BUCKET = 'devis-files'

/**
 * Turns a Supabase/network failure into something a French-speaking visitor or
 * administrator can act on. Network errors surface as a bare "Failed to fetch",
 * which tells nobody anything.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message
    if (/ne répond pas/.test(msg)) return msg
    if (/failed to fetch|networkerror|load failed|aborted/i.test(msg)) {
      return 'Connexion au serveur impossible. Vérifiez votre connexion puis réessayez.'
    }
    if (/jwt|token|invalid.*credentials|invalid login/i.test(msg)) {
      return 'Identifiants invalides.'
    }
    return msg
  }
  return 'Une erreur inattendue est survenue.'
}
