// Renders reference strings in real Bossa at the Figma sizes, screenshots them,
// and reports ink width so it can be compared against the reference JPGs.
import { writeFileSync } from 'node:fs'
import { launch, connect, goto } from './cdp.mjs'

const ROWS = [
  // [label, weight, size, text, referenceInkWidth]
  ['hero-l1',   500, 90, "L'excellence dans", 823.5],
  ['hero-l3',   500, 90, 'technique en BTP', 843.0],
  ['mep-h1',    500, 69, 'Installations', 441.0],
  ['mep-h2',    500, 69, 'MEP systèmes', 544.0],
  ['body-mep',  400, 20, 'Nous réalisons les études techniques des domaines CVC (chauffage,', 728.0],
  ['hero-b1',   400, 20, 'ENGINEERING STUDIO, intervient sur tout type de projets et', 659.5],
  ['foot-lead', 400, 24, 'Ingénierie du bâtiment', 265.0],
  ['apropos',   400, 24, 'À propos', 110.5],
  ['copy',      400, 16, 'Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio', 680.0],
  ['foot-body', 300, 20, 'ENGINEERING STUDIO propose des études techniques', 0],
  ['pill',      400, 14, 'Obtenez un devis', 0],
]

const LS = process.argv[2] ?? '0'
const ROWH = 130
const html = `<!doctype html><meta charset="utf-8"><style>
${['Bossa-Light-4:300','Bossa-Regular-1:400','Bossa-Medium-4:500','Bossa-Bold-4:700','Bossa-Black-4:900']
  .map((s) => { const [f, w] = s.split(':'); return `@font-face{font-family:Bossa;src:url('/Assets/fonts/${f}.ttf') format('truetype');font-weight:${w};font-display:block}` }).join('')}
body{margin:0;background:#000;color:#fff;width:1920px;font-family:Bossa}
.r{position:relative;height:${ROWH}px}
.r span{position:absolute;left:100px;top:20px;white-space:pre}
</style>
${ROWS.map(([, w, size, text]) => `<div class="r"><span style="font-weight:${w};font-size:${size}px;letter-spacing:${LS}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></div>`).join('')}
`
writeFileSync('public/__typetest.html', html)

const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: ROWS.length * ROWH, deviceScaleFactor: 1, mobile: false })
await goto(cdp, 'http://localhost:5173/__typetest.html')
const { data } = await cdp.send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: 1920, height: ROWS.length * ROWH, scale: 1 },
})
writeFileSync(process.argv[3] ?? 'tools/.typetest.png', Buffer.from(data, 'base64'))
console.log(JSON.stringify({ rowh: ROWH, rows: ROWS.map(([l, , s, , ref]) => ({ l, s, ref })) }))
cdp.close(); proc.kill()
