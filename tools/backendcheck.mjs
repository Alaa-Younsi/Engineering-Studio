/**
 * Supabase preflight. Run this before deploying, or whenever the dashboard
 * misbehaves — it tells you whether the project in .env is reachable and
 * whether schema.sql has actually been applied.
 *
 *   node tools/backendcheck.mjs
 *
 * Uses plain fetch with the anon key, so it exercises exactly what the browser
 * does. Note that RLS is on: a 200 with an empty array means "reachable and the
 * table exists", not "empty database".
 */
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('✗ .env is missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

// The anon key is a JWT whose `ref` claim must match the project in the URL.
const ref = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).ref
const urlRef = new URL(url).hostname.split('.')[0]
console.log(`project    ${urlRef}`)
console.log(`key ref    ${ref}  ${ref === urlRef ? '✓ matches' : '✗ MISMATCH — the key belongs to another project'}`)
console.log()

const headers = { apikey: key, Authorization: `Bearer ${key}` }
const checks = [
  ['auth', '/auth/v1/health'],
  ['articles', '/rest/v1/articles?select=id&limit=1'],
  ['projects', '/rest/v1/projects?select=id&limit=1'],
  ['submissions', '/rest/v1/submissions?select=id&limit=1'],
  ['admins', '/rest/v1/admins?select=user_id&limit=1'],
]

let failures = 0
for (const [name, path] of checks) {
  try {
    const res = await fetch(url + path, { headers, signal: AbortSignal.timeout(15_000) })
    const text = (await res.text()).slice(0, 120)
    // 200 = fine. 401/403 on a table means RLS is doing its job (anon denied).
    const ok = res.ok || res.status === 401 || res.status === 403
    if (!ok) failures++
    console.log(`${ok ? '✓' : '✗'} ${name.padEnd(12)} ${res.status}  ${text}`)
  } catch (e) {
    failures++
    console.log(`✗ ${name.padEnd(12)} unreachable — ${e instanceof Error ? e.message : e}`)
  }
}

console.log()
if (failures) {
  console.log('Some checks failed. Common causes:')
  console.log('  • the project is paused or deleted           → check the Supabase dashboard')
  console.log('  • schema.sql was never run                   → a table 404s')
  console.log('  • local DNS or a corporate proxy is blocking → try another network')
  process.exit(1)
}
console.log('Backend looks healthy.')
