import { writeFileSync } from 'node:fs'
import { launch, connect, goto } from './cdp.mjs'
const LHS = ['normal', '34px', '32px', '30px', '28px', '26px', '24px']
const ROWH = 120
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Bossa;src:url('/Assets/fonts/Bossa-Regular-1.ttf') format('truetype');font-weight:400;font-display:block}
body{margin:0;background:#000;color:#fff;width:1920px;font-family:Bossa}
.r{position:relative;height:${ROWH}px}
.r span{position:absolute;left:100px;top:40px;font-size:24px;font-weight:400;letter-spacing:-0.0405em;white-space:pre}
</style>
${LHS.map((lh) => `<div class="r"><span style="line-height:${lh}">À propos</span></div>`).join('')}`
writeFileSync('public/__lh.html', html)
const { proc, wsUrl } = await launch(); const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: LHS.length * ROWH, deviceScaleFactor: 1, mobile: false })
await goto(cdp, 'http://localhost:5173/__lh.html')
const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1920, height: LHS.length * ROWH, scale: 1 } })
writeFileSync(process.argv[2], Buffer.from(data, 'base64'))
console.log(JSON.stringify({ rowh: ROWH, lhs: LHS, spanTop: 40 }))
cdp.close(); proc.kill()
