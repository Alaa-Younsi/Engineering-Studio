/**
 * Media optimisation, in two halves:
 *
 *  1. `compressImage()` — shrinks what gets STORED. Called before every admin
 *     upload: downscale to a sane max edge and re-encode as WebP, keeping
 *     whichever of the original / WebP is smaller. Any failure returns the
 *     original file untouched, so a weird format never blocks a save.
 *
 *  2. `responsiveSrcSet()` + friends — shrink what gets SENT. Supabase Storage
 *     resizes on the fly at `/storage/v1/render/image/public/...`, so a 350px
 *     grid thumbnail can be delivered as a 400px WebP instead of the full
 *     1600px source. This is the part that actually moves the egress needle;
 *     compression alone still ships the big file into a small slot.
 */

const MAX_EDGE = 1600
const WEBP_QUALITY = 0.82

/** Formats we don't touch: vectors and animations don't survive a canvas round-trip. */
const PASSTHROUGH = new Set(['image/svg+xml', 'image/gif'])

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || PASSTHROUGH.has(file.type)) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    const name = `${file.name.replace(/\.[^.]+$/, '')}.webp`
    return new File([blob], name, { type: 'image/webp', lastModified: Date.now() })
  } catch {
    return file
  }
}

/* ── Responsive delivery ──────────────────────────────────────────────────── */

const PUBLIC_MARKER = '/storage/v1/object/public/'
const RENDER_MARKER = '/storage/v1/render/image/public/'
const SRCSET_WIDTHS = [320, 480, 768, 1024, 1600]
const RENDER_QUALITY = 70

export function isSupabaseStorageUrl(src: string): boolean {
  return src.includes(PUBLIC_MARKER)
}

/**
 * The transform URL for one width. `resize=contain` is NOT optional — with
 * `width` alone the endpoint returns that width at the ORIGINAL height, i.e. a
 * squashed image that still costs real bytes.
 */
export function supabaseRenderUrl(src: string, width: number): string {
  const base = src.replace(PUBLIC_MARKER, RENDER_MARKER)
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}width=${width}&resize=contain&quality=${RENDER_QUALITY}`
}

export function supabaseSrcSet(src: string): string | undefined {
  if (!isSupabaseStorageUrl(src)) return undefined
  return SRCSET_WIDTHS.map((w) => `${supabaseRenderUrl(src, w)} ${w}w`).join(', ')
}

/** A `srcSet` string for a Supabase Storage URL, or `undefined` for anything else. */
export function responsiveSrcSet(src: string | undefined | null): string | undefined {
  if (!src) return undefined
  return supabaseSrcSet(src)
}
