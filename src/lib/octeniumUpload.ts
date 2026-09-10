import { MEDIA_ORIGIN, MEDIA_UPLOAD_URL } from '../config/site'
import { supabase } from './supabase'

/**
 * Chunked, admin-only upload of a large public media file (a project video) to
 * the hosting account's `/media/` directory, via `octenium/upload.php`.
 *
 * Why chunked: shared-hosting PHP caps a single request body (`post_max_size`,
 * commonly 128 MB) and its execution time. Slicing the file keeps every request
 * small — it works inside the default limits — and gives a real progress
 * signal. The server appends the parts in order and only promotes the assembled
 * file once the final chunk passes a MIME check.
 *
 * Auth: the caller's Supabase access token rides on the first chunk. The
 * endpoint asks Supabase, with that token, for the caller's own `public.admins`
 * row (RLS policy "admins read self") — a row back means a real, unexpired
 * token belonging to an admin. The remaining chunks are tied to the first by an
 * unguessable per-upload id.
 */

/** 8 MiB — comfortably below a 128 MB `post_max_size`, still few round-trips. */
const CHUNK_SIZE = 8 * 1024 * 1024

/** Matches the extension allow-list in `octenium/upload.php`. */
const ALLOWED_EXT = new Set(['mp4', 'webm', 'mov', 'm4v'])

/** Hard client-side ceiling; larger files should go up by FTP + paste-URL. */
const MAX_BYTES = 3 * 1024 * 1024 * 1024

interface FinalResponse {
  path?: string
  url?: string
  error?: string
}

/**
 * Uploads `file` and resolves to its public URL on {@link MEDIA_ORIGIN}.
 * `onProgress` is called after each chunk with a 0–1 fraction.
 */
export async function uploadLargeMedia(
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<string> {
  const ext = (file.name.split('.').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error('Format vidéo non pris en charge (MP4, WebM, MOV).')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Fichier trop volumineux (max 3 Go). Téléversez-le par FTP puis collez l’URL.')
  }

  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Session expirée. Reconnectez-vous puis réessayez.')

  const uploadId = crypto.randomUUID()
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

  for (let index = 0; index < totalChunks; index++) {
    const slice = file.slice(index * CHUNK_SIZE, index * CHUNK_SIZE + CHUNK_SIZE)

    const body = new FormData()
    body.set('uploadId', uploadId)
    body.set('chunkIndex', String(index))
    body.set('totalChunks', String(totalChunks))
    body.set('ext', ext)
    body.set('chunk', slice)

    const res = await fetch(MEDIA_UPLOAD_URL, {
      method: 'POST',
      // The token only needs to travel once; later chunks are bound by uploadId.
      headers: index === 0 ? { Authorization: `Bearer ${token}` } : undefined,
      body,
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Téléversement échoué (HTTP ${res.status}). ${detail}`.trim())
    }

    onProgress?.((index + 1) / totalChunks)

    if (index === totalChunks - 1) {
      const json = (await res.json().catch(() => ({}))) as FinalResponse
      const url = json.url || (json.path ? `${MEDIA_ORIGIN}/media/${json.path}` : '')
      if (!url) throw new Error(json.error || 'Le serveur n’a pas renvoyé d’URL.')
      return url
    }
  }

  // Unreachable: the loop always returns on the final chunk.
  throw new Error('Téléversement interrompu.')
}
