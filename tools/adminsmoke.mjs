// Boots the admin in production mode and reports what a user actually sees.
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'
const OUT = process.argv[2] ?? '.'
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
const errs = []
cdp.on('Runtime.exceptionThrown', (p) => errs.push(p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text))
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const body = (n = 300) => evalJs(cdp, `document.body.innerText.split(String.fromCharCode(10)).filter(Boolean).join(' | ').slice(0, ${n})`)
const shot = async (name) => {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1440, height: 760, scale: 1 } })
  writeFileSync(`${OUT}/prod_${name}.png`, Buffer.from(data, 'base64'))
}

await goto(cdp, 'http://localhost:5173/admin/login'); await wait(1200)
console.log('login page      :', await body(200)); await shot('login')

// real credentials would be needed; submit and show the real failure path
await evalJs(cdp, `(() => { const e=document.querySelector('input[type=email]'), p=document.querySelector('input[type=password]');
  const set=(el,v)=>{Object.getOwnPropertyDescriptor(el.constructor.prototype,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))};
  set(e,'alaayounsi777@gmail.com'); set(p,'whatever'); })()`)
await wait(300)
await evalJs(cdp, 'document.querySelector("form").requestSubmit()')
await wait(3000)
console.log('after submit    :', await body(260)); await shot('login_error')

await goto(cdp, 'http://localhost:5173/admin'); await wait(2500)
console.log('guarded /admin  :', await body(260)); await shot('guard')

await goto(cdp, 'http://localhost:5173/nouvelles?capture=1'); await wait(2500)
console.log('public nouvelles:', await body(220))

await goto(cdp, 'http://localhost:5173/?capture=1'); await wait(1200)
console.log('public home ok  :', await evalJs(cdp, 'document.body.innerText.includes("L\'excellence dans")'))
console.log('\nuncaught exceptions:', errs.length ? errs.slice(0, 3) : 'none')
cdp.close(); proc.kill()
