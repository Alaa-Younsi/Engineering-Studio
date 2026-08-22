// Sends the public contact form, then checks the submission reaches /admin/demandes.
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'

const BASE = 'http://localhost:5173'
const OUT = process.argv[2] ?? '.'
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
cdp.on('Runtime.exceptionThrown', (p) => console.log('[EXC]', p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text))
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const fill = (label, v) => evalJs(cdp, `(() => {
  const el = [...document.querySelectorAll('input,textarea')].find(e => e.getAttribute('aria-label') === ${JSON.stringify(label)});
  if (!el) return 'MISSING';
  Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, ${JSON.stringify(v)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'ok';
})()`)
const shot = async (name) => {
  const h = await evalJs(cdp, 'Math.ceil(document.documentElement.scrollHeight)')
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 2200), scale: 1 },
  })
  writeFileSync(`${OUT}/admin_${name}.png`, Buffer.from(data, 'base64'))
}

await goto(cdp, `${BASE}/contact?capture=1`)
await wait(700)
for (const [l, v] of [['Votre nom', 'Younsi'], ['Votre prénom', 'Alaa'], ['Numéro de téléphone', '+213773876214'],
                      ['Email', 'alaayounsi777@gmail.com'], ['Rédigez votre message', 'Message de vérification du formulaire.']]) {
  console.log(l, '->', await fill(l, v))
}
// The abuse guard rejects forms completed implausibly fast.
await wait(3500)
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
await wait(1800)
console.log('button now:', await evalJs(cdp, '[...document.querySelectorAll("button")].map(b=>b.textContent.trim()).join("/")'))

// sign in and look at the inbox
await goto(cdp, `${BASE}/admin/login`); await wait(500)
await evalJs(cdp, `(() => { const el=document.querySelector('input[type=email]');
  Object.getOwnPropertyDescriptor(el.constructor.prototype,'value').set.call(el,'alaayounsi777@gmail.com');
  el.dispatchEvent(new Event('input',{bubbles:true})); })()`)
await wait(300)
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
for (let i = 0; i < 25; i++) { if (await evalJs(cdp, 'localStorage.getItem("es_demo_admin") !== null')) break; await wait(200) }

await goto(cdp, `${BASE}/admin/demandes`); await wait(1200)
console.log('inbox has submission:', await evalJs(cdp, 'document.body.innerText.includes("Message de vérification")'))
console.log('inbox text:', await evalJs(cdp, 'document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).slice(8,22).join(" | ")'))
await shot('demandes')
await goto(cdp, `${BASE}/admin`); await wait(1000); await shot('dashboard')
await goto(cdp, `${BASE}/admin/nouvelles`); await wait(1000); await shot('nouvelles')
await goto(cdp, `${BASE}/admin/nouvelles/new`); await wait(1000); await shot('editor')
cdp.close(); proc.kill()
