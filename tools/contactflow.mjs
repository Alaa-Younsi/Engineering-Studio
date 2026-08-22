/**
 * Proves the public contact form reaches the submissions table and shows up in
 * the admin inbox, by standing in for Supabase at the network layer: the POST
 * the app really makes is captured and echoed back from a tiny in-memory store.
 *
 * This exercises the app's own code path end to end — payload shape, RLS-facing
 * columns, the abuse guard, and the admin list rendering.
 */
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/)
  .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const HOST = new URL(env.VITE_SUPABASE_URL).host

const rows = []
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

await cdp.send('Fetch.enable', { patterns: [{ urlPattern: `*${HOST}*` }] })
cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
  const url = new URL(request.url)
  const body = (a) => Buffer.from(JSON.stringify(a)).toString('base64')
  const ok = (a) => cdp.send('Fetch.fulfillRequest', {
    requestId, responseCode: 200, body: body(a),
    responseHeaders: [
      { name: 'content-type', value: 'application/json' },
      { name: 'access-control-allow-origin', value: '*' },
      { name: 'access-control-allow-headers', value: '*' },
      { name: 'access-control-expose-headers', value: '*' },
    ],
  })

  if (request.method === 'OPTIONS') return ok({})

  if (url.pathname === '/rest/v1/submissions' && request.method === 'POST') {
    const sent = JSON.parse(Buffer.from(request.postData ?? '{}', 'utf8').toString())
    const row = {
      id: 'row-' + (rows.length + 1), read: false,
      created_at: new Date().toISOString(), attachments: [], ...sent,
    }
    rows.push(row)
    console.log('\nPOST /submissions captured:')
    console.log(JSON.stringify(sent, null, 2))
    return ok(row)
  }
  if (url.pathname === '/rest/v1/submissions') return ok(rows)
  if (url.pathname === '/rest/v1/admins') return ok({ user_id: 'u1' })
  if (url.pathname.startsWith('/rest/v1/')) return ok([])
  if (url.pathname === '/auth/v1/token') {
    return ok({
      access_token: 'tok', token_type: 'bearer', expires_in: 3600, refresh_token: 'r',
      user: { id: 'u1', email: 'alaayounsi777@gmail.com', aud: 'authenticated', role: 'authenticated' },
    })
  }
  return ok({})
})

// ── fill and submit the public form ────────────────────────────────────────
await goto(cdp, 'http://localhost:5173/contact?capture=1')
await wait(800)
const fill = (label, v) => evalJs(cdp, `(() => {
  const el = [...document.querySelectorAll('input,textarea')].find(e => e.getAttribute('aria-label') === ${JSON.stringify(label)});
  if (!el) return 'MISSING ' + ${JSON.stringify(label)};
  Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, ${JSON.stringify(v)});
  el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok';
})()`)
for (const [l, v] of [['Votre nom', 'Younsi'], ['Votre prénom', 'Alaa'], ['Numéro de téléphone', '+213 773 87 62 14'],
                      ['Email', 'client@example.com'], ['Rédigez votre message', 'Bonjour, je souhaite un devis MEP.']]) {
  const r = await fill(l, v)
  if (r !== 'ok') console.log('  !', r)
}
await wait(3500)   // the abuse guard rejects forms filled implausibly fast
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
await wait(1500)
console.log('\nbutton after submit :', await evalJs(cdp, '[...document.querySelectorAll("button")].map(b=>b.textContent.trim()).find(t=>/Envoy|envoyé/.test(t))'))
console.log('rows stored         :', rows.length)

// ── does it show in the admin inbox? ───────────────────────────────────────
await goto(cdp, 'http://localhost:5173/admin/login'); await wait(600)
await evalJs(cdp, `(() => { const e=document.querySelector('input[type=email]'), p=document.querySelector('input[type=password]');
  const set=(el,v)=>{Object.getOwnPropertyDescriptor(el.constructor.prototype,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))};
  set(e,'alaayounsi777@gmail.com'); set(p,'pw'); })()`)
await wait(300)
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
await wait(2000)
await goto(cdp, 'http://localhost:5173/admin/demandes'); await wait(1500)
const txt = await evalJs(cdp, 'document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).join(" | ")')
console.log('\nadmin inbox shows   :', /Alaa Younsi/.test(txt) ? 'YES — Alaa Younsi' : 'NO')
console.log('inbox line          :', txt.slice(txt.indexOf('Demandes'), txt.indexOf('Demandes') + 260))
cdp.close(); proc.kill()
