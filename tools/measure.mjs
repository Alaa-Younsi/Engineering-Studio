// Measures rendered text width in real Bossa, to calibrate letter-spacing
// against the Figma reference screenshots.
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SAMPLES = [
  { id: 'hero-l1',  w: 500, size: 90, text: "L'excellence dans",  target: 823.5 },
  { id: 'hero-l3',  w: 500, size: 90, text: 'technique en BTP',   target: 843.0 },
  { id: 'mep-h1',   w: 500, size: 69, text: 'Installations',      target: 441.0 },
  { id: 'mep-h2',   w: 500, size: 69, text: 'MEP systèmes',       target: 544.0 },
  { id: 'body-1',   w: 400, size: 20, text: 'Nous réalisons les études techniques des domaines CVC (chauffage,', target: 728.0 },
  { id: 'hero-b1',  w: 400, size: 20, text: 'ENGINEERING STUDIO, intervient sur tout type de projets et', target: 659.5 },
  { id: 'foot-lead',w: 400, size: 24, text: 'Ingénierie du bâtiment', target: 265.0 },
  { id: 'apropos',  w: 400, size: 24, text: 'À propos',           target: 110.5 },
  { id: 'copy',     w: 400, size: 16, text: 'Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio', target: 680.0 },
  { id: 'pill',     w: 400, size: 14, text: 'Obtenez un devis',   target: 0 },
]

const html = `<!doctype html><meta charset="utf-8">
<style>
${[['Light',300,'Bossa-Light-4'],['Regular',400,'Bossa-Regular-1'],['Medium',500,'Bossa-Medium-4'],['Bold',700,'Bossa-Bold-4'],['Black',900,'Bossa-Black-4']]
  .map(([, w, f]) => `@font-face{font-family:Bossa;src:url('/Assets/fonts/${f}.ttf') format('truetype');font-weight:${w};font-style:normal;}`).join('\n')}
body{margin:0;background:#000;color:#fff}
span{font-family:Bossa;white-space:pre;display:inline-block}
</style>
<div id="host"></div>
<script>
window.SAMPLES = ${JSON.stringify(SAMPLES)}
window.measure = (ls) => window.SAMPLES.map(s => {
  const el = document.createElement('span')
  el.style.fontSize = s.size + 'px'
  el.style.fontWeight = s.w
  el.style.letterSpacing = ls === 'auto' ? '0px' : ls + 'px'
  el.textContent = s.text
  document.getElementById('host').appendChild(el)
  const r = el.getBoundingClientRect()
  el.remove()
  return { id: s.id, size: s.size, target: s.target, got: +r.width.toFixed(2) }
})
</script>`

writeFileSync('public/__measure.html', html)

const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await goto(cdp, 'http://localhost:5173/__measure.html')
const rows = await evalJs(cdp, 'JSON.stringify(window.measure(0))')
console.table(JSON.parse(rows).map((r) => ({
  ...r,
  diff: +(r.got - r.target).toFixed(2),
  // letter-spacing (px/char) that would close the gap
  lsNeeded: r.target ? +((r.target - r.got) / (SAMPLES.find(s=>s.id===r.id).text.length)).toFixed(3) : null,
})))
cdp.close(); proc.kill()
