/**
 * Site-wide constants for SEO — the single place the public URL and the default
 * social copy live. Every meta tag, canonical link, sitemap entry and JSON-LD
 * block is built from these.
 *
 * The canonical host is the apex domain (no `www`); the server 301-redirects
 * `www` → apex (see `public/.htaccess`). If `SITE_URL` ever changes, update
 * every committed copy — `grep -rn "engineering-studio.net"` finds them
 * (index.html, robots.txt, sitemap.xml, scripts/generate-sitemap.mjs) — and
 * re-run the OG / sitemap scripts.
 */

export const SITE_URL = 'https://engineering-studio.net'

export const SITE_NAME = 'Engineering Studio'

export const DEFAULT_TITLE = 'Solutions Globales en Ingénierie | Engineering Studio'

export const DEFAULT_DESCRIPTION =
  'Solutions Globales en Ingénierie, Études Techniques d’Ingénierie du Bâtiment, ' +
  'MEP/CET, VRD, BIM, Topographie. Étude Clé en Main.'

export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const CONTACT_EMAIL = 'contact@engineering-studio.net'
export const CONTACT_PHONE_TEL = '+213773876214'

/* ── Media hosting ──────────────────────────────────────────────────────────
 * Images stay on Supabase Storage — its `/render/image/` endpoint resizes on
 * the fly, which is what keeps egress sane. Video is too heavy for that plan,
 * so it lives on the hosting account under `/media/` (300 GB plan) and is
 * uploaded through `octenium/upload.php` (chunked, admin-only).
 *
 * To move video to a real CDN later (Bunny, Cloudflare R2, …): point
 * MEDIA_ORIGIN at the CDN, move the files, and widen `media-src` /`img-src` in
 * public/.htaccess. Stored project rows hold absolute URLs, so existing videos
 * keep resolving from the old origin until the rows are rewritten.
 */
export const MEDIA_ORIGIN = SITE_URL

/** Chunked upload endpoint for large public media (project video). */
export const MEDIA_UPLOAD_URL =
  (import.meta.env.VITE_MEDIA_UPLOAD_URL as string | undefined)?.trim() ||
  `${MEDIA_ORIGIN}/media/upload.php`
