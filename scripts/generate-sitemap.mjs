/**
 * Regenerates public/sitemap.xml at build time (wired as the `prebuild` script).
 *
 * Static routes are the source of truth here — keep STATIC_ROUTES in sync with
 * <Route> in src/App.tsx. Published articles are appended by querying Supabase
 * REST directly. Any failure (no env, DB unreachable) falls back to writing just
 * the static routes, so a build never breaks on the sitemap.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = 'https://engineering-studio.net'

const STATIC_ROUTES = [
  { loc: '/', priority: '1.0' },
  { loc: '/a-propos', priority: '0.8' },
  { loc: '/prestations', priority: '0.8' },
  { loc: '/prestations/mep', priority: '0.7' },
  { loc: '/prestations/topo', priority: '0.7' },
  { loc: '/prestations/vrd', priority: '0.7' },
  { loc: '/prestations/bim', priority: '0.7' },
  { loc: '/portefeuille', priority: '0.8' },
  { loc: '/clients', priority: '0.7' },
  { loc: '/nouvelles', priority: '0.7' },
  { loc: '/contact', priority: '0.7' },
]

/** Read a key from process.env or a local .env file. */
function readEnv(key) {
  if (process.env[key]) return process.env[key]
  const envPath = resolve(ROOT, '.env')
  if (!existsSync(envPath)) return undefined
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.trim().startsWith(`${key}=`))
  return line ? line.slice(line.indexOf('=') + 1).trim() : undefined
}

async function fetchArticleSlugs() {
  const url = readEnv('VITE_SUPABASE_URL')
  const key = readEnv('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) return []
  try {
    const res = await fetch(`${url}/rest/v1/articles?select=slug&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map((r) => r.slug).filter(Boolean)
  } catch {
    return []
  }
}

const slugs = await fetchArticleSlugs()

const urls = [
  ...STATIC_ROUTES.map((r) => ({ loc: SITE_URL + r.loc, priority: r.priority })),
  ...slugs.map((s) => ({ loc: `${SITE_URL}/nouvelles/${s}`, priority: '0.6' })),
]

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n') +
  `\n</urlset>\n`

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml: ${STATIC_ROUTES.length} static routes + ${slugs.length} articles`)
