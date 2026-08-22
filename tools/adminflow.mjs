// Drives the admin dashboard end to end: log in, create an article, publish it,
// confirm it reaches the public site, then clean up.
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'

const BASE = 'http://localhost:5173'
const OUT = process.argv[2] ?? '.'
const log = []
const step = (msg) => { log.push(msg); console.log(msg) }

const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
cdp.on('Runtime.exceptionThrown', (p) =>
  step('  !! EXCEPTION ' + (p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text)))
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

const shot = async (name) => {
  const h = await evalJs(cdp, 'Math.ceil(document.documentElement.scrollHeight)')
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 2600), scale: 1 },
  })
  writeFileSync(`${OUT}/admin_${name}.png`, Buffer.from(data, 'base64'))
}

const type = (sel, value) => evalJs(cdp, `(() => {
  const el = document.querySelector(${JSON.stringify(sel)});
  if (!el) return 'MISSING ' + ${JSON.stringify(sel)};
  const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set;
  setter.call(el, ${JSON.stringify(value)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'ok';
})()`)

const click = (text, tag = 'button') => evalJs(cdp, `(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(tag)})]
    .find((b) => b.textContent.trim().toLowerCase().includes(${JSON.stringify(text.toLowerCase())}));
  if (!el) return 'MISSING ' + ${JSON.stringify(text)};
  el.click();
  return 'ok';
})()`)

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const text = () => evalJs(cdp, 'document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).join(" | ").slice(0, 900)')

// ── 1. login ───────────────────────────────────────────────────────────────
await goto(cdp, `${BASE}/admin/login`)
step('1. /admin/login → ' + JSON.stringify((await text()).slice(0, 120)))
await shot('1_login')
step('   fill email: ' + await type('input[type="email"]', 'alaayounsi777@gmail.com'))
step('   fill pass : ' + await type('input[type="password"]', 'demo-password'))
step('   submit    : ' + await evalJs(cdp, 'document.querySelector("form").requestSubmit(), "sent"'))
await wait(1800)
step('2. after login url=' + await evalJs(cdp, 'location.pathname'))
step('   page text: ' + JSON.stringify((await text()).slice(0, 400)))
await shot('2_dashboard')

// ── 2. each section loads ──────────────────────────────────────────────────
for (const [path, name] of [['/admin/demandes', 'demandes'], ['/admin/nouvelles', 'nouvelles'], ['/admin/portefeuille', 'portefeuille']]) {
  await goto(cdp, BASE + path)
  await wait(900)
  const t = await text()
  step(`3. ${path} → ${JSON.stringify(t.slice(0, 200))}`)
  await shot('3_' + name)
}

// ── 3. create + publish an article ─────────────────────────────────────────
await goto(cdp, `${BASE}/admin/nouvelles/new`)
await wait(800)
step('4. editor: ' + await type('input[type="text"]', 'Article de vérification'))
const fields = await evalJs(cdp, `[...document.querySelectorAll('input,textarea')].map(e => e.type + ':' + (e.getAttribute('placeholder') ?? e.previousElementSibling?.textContent ?? '')).join(' | ')`)
step('   fields: ' + fields)
await shot('4_editor')
step('   save: ' + await click('enregistrer'))
await wait(1500)
step('   url after save: ' + await evalJs(cdp, 'location.pathname'))
step('   list text: ' + JSON.stringify((await text()).slice(0, 300)))
await shot('5_after_save')

// ── 4. does it reach the public site? ──────────────────────────────────────
await goto(cdp, `${BASE}/nouvelles?capture=1`)
await wait(900)
step('5. public /nouvelles contains new article: ' +
  (await evalJs(cdp, 'document.body.innerText.includes("Article de vérification")')))

console.log('\n===== SUMMARY =====\n' + log.join('\n'))
cdp.close(); proc.kill()
