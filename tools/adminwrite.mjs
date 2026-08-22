// Creates an article and a project through the real UI, then checks that they
// show up in the admin lists and on the public site.
import { launch, connect, goto, evalJs } from './cdp.mjs'

const BASE = 'http://localhost:5173'
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
cdp.on('Runtime.exceptionThrown', (p) => console.log('[EXC]', p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text))
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
// Fields carry no type="" attribute, so target them by placeholder instead.
const byPlaceholder = (ph, v) => evalJs(cdp, `(() => {
  const el = [...document.querySelectorAll('input,textarea')]
    .find((e) => (e.placeholder || '').toLowerCase().includes(${JSON.stringify(ph.toLowerCase())}));
  if (!el) return 'MISSING:' + [...document.querySelectorAll('input,textarea')].map(e => e.placeholder).join('/');
  Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, ${JSON.stringify(v)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return el.value;
})()`)
const nth = (sel, i, v) => evalJs(cdp, `(() => {
  const el = document.querySelectorAll(${JSON.stringify(sel)})[${i}];
  if (!el) return 'MISSING';
  Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, ${JSON.stringify(v)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return el.value;
})()`)
const clickText = (t) => evalJs(cdp, `(() => {
  const el = [...document.querySelectorAll('button')].find(b => b.textContent.trim().toLowerCase() === ${JSON.stringify(t.toLowerCase())});
  if (!el) return 'MISSING:' + [...document.querySelectorAll('button')].map(b=>b.textContent.trim()).join('/');
  el.click(); return 'clicked';
})()`)
const body = (n = 400) => evalJs(cdp, `document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).join(' | ').slice(0, ${n})`)

// sign in — poll until the session lands, so the run is not timing-dependent
await goto(cdp, `${BASE}/admin/login`)
await wait(500)
console.log('email  :', await nth('input[type="email"]', 0, 'alaayounsi777@gmail.com'))
await wait(300)
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
for (let i = 0; i < 25; i++) {
  if (await evalJs(cdp, 'localStorage.getItem("es_demo_admin") !== null')) break
  await wait(200)
}
console.log('signed in as:', await evalJs(cdp, 'localStorage.getItem("es_demo_admin")'))

// ── article ────────────────────────────────────────────────────────────────
await goto(cdp, `${BASE}/admin/nouvelles/new`)
await wait(900)
console.log('fields :', await evalJs(cdp, `[...document.querySelectorAll('input,textarea')].map(e => e.placeholder).join(' | ')`))
console.log('title  :', await byPlaceholder("Titre de l'article", 'Article de vérification'))
console.log('slug   :', await byPlaceholder('mon-article', 'article-de-verification'))
console.log('excerpt:', await nth('textarea', 0, 'Un court résumé de vérification.'))
console.log('publish toggle:', await evalJs(cdp, `(() => {
  const t = [...document.querySelectorAll('[role=switch]')];
  const pub = t.find(x => x.textContent.toLowerCase().includes('publi'));
  if (!pub) return 'MISSING:' + t.map(x=>x.textContent).join('/');
  if (pub.getAttribute('aria-checked') !== 'true') pub.click();
  return 'checked=' + pub.getAttribute('aria-checked');
})()`))
await wait(200)
console.log('save   :', await clickText('Enregistrer'))
await wait(1600)
console.log('url    :', await evalJs(cdp, 'location.pathname'))
console.log('page   :', await body(260))

await goto(cdp, `${BASE}/admin/nouvelles`); await wait(900)
console.log('admin list has it:', await evalJs(cdp, 'document.body.innerText.includes("Article de vérification")'))

await goto(cdp, `${BASE}/nouvelles?capture=1`); await wait(1200)
console.log('public list has it:', await evalJs(cdp, 'document.body.innerText.includes("Article de vérification")'))

// ── project ────────────────────────────────────────────────────────────────
await goto(cdp, `${BASE}/admin/portefeuille/new`); await wait(900)
console.log('\nproject fields:', await evalJs(cdp, `[...document.querySelectorAll('input,textarea')].map(e => e.type + ':' + (e.placeholder || '')).join(' | ')`))
console.log('proj title:', await byPlaceholder('Nom du projet', 'Projet de vérification'))
console.log('proj save :', await clickText('Enregistrer'))
await wait(1600)
console.log('proj url  :', await evalJs(cdp, 'location.pathname'))
await goto(cdp, `${BASE}/portefeuille?capture=1`); await wait(1200)
console.log('public portefeuille has it:', await evalJs(cdp, 'document.body.innerText.includes("Projet de vérification")'))

// ── submissions: send one through the public contact form ─────────────────
await goto(cdp, `${BASE}/contact?capture=1`); await wait(900)
console.log('\ncontact inputs:', await evalJs(cdp, `[...document.querySelectorAll('input,textarea')].map(e => e.getAttribute('aria-label')).join(' | ')`))
cdp.close(); proc.kill()
