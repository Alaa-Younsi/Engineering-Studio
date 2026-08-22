import { launch, connect, goto, evalJs } from './cdp.mjs'
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await goto(cdp, 'http://localhost:5173/admin/login')
await evalJs(cdp, `(() => { const e=document.querySelector('input[type=email]'), p=document.querySelector('input[type=password]');
  const set=(el,v)=>{Object.getOwnPropertyDescriptor(el.constructor.prototype,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))};
  set(e,'alaayounsi777@gmail.com'); set(p,'whatever'); })()`)
await new Promise(r => setTimeout(r, 300))
const t0 = Date.now()
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
for (let i = 0; i < 60; i++) {
  const btn = await evalJs(cdp, 'document.querySelector("button[type=submit]")?.textContent?.trim()')
  if (btn !== 'Connexion…') {
    console.log(`resolved after ${((Date.now() - t0) / 1000).toFixed(1)}s — button: ${btn}`)
    console.log('error shown:', await evalJs(cdp, 'document.querySelector("form p")?.textContent ?? "(none)"'))
    break
  }
  await new Promise(r => setTimeout(r, 500))
}
cdp.close(); proc.kill()
