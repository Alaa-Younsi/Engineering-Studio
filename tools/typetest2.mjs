import { writeFileSync } from 'node:fs'
import { launch, connect, goto } from './cdp.mjs'
const ROWS = [
  ['Portefeuille',    400, 24, 'Portefeuille', 138.0],
  ['Nouvelles',       400, 24, 'Nouvelles', 115.5],
  ['Prestation',      400, 24, 'Prestation', 127.0],
  ['Clients',         400, 24, 'Clients', 82.0],
  ['Contact',         400, 24, 'Contact', 99.0],
  ['A propos',        400, 24, 'À propos', 110.5],
  ['Ingenierie',      400, 24, 'Ingénierie du bâtiment', 265.0],
  ['Facebook',        400, 16, 'Facebook', 78.5],
  ['LinkedIn',        400, 16, 'LinkedIn', 65.5],
  ['Setif',           300, 20, 'Sétif, Alger', 118.0],
  ['contact@',        300, 20, 'contact@engineering-studio.net', 344.5],
  ['footer-l2',       300, 20, 'pluridisciplinaire présent dans les domaines d’ingénieries du', 624.0],
  ['VRD et',          500, 69, 'VRD et', 266.0],
  ['Amenagement',     500, 69, 'Aménagement', 536.0],
  ['Modelisation3D',  500, 69, 'Modélisation 3D', 587.5],
  ['etSyntheseBIM',   500, 69, 'et Synthèse BIM', 603.5],
]
const ROWH = 120
const html = `<!doctype html><meta charset="utf-8"><style>
${['Bossa-Light-4:300','Bossa-Regular-1:400','Bossa-Medium-4:500','Bossa-Bold-4:700','Bossa-Black-4:900']
  .map((s)=>{const [f,w]=s.split(':');return `@font-face{font-family:Bossa;src:url('/Assets/fonts/${f}.ttf') format('truetype');font-weight:${w};font-display:block}`}).join('')}
body{margin:0;background:#000;color:#fff;width:1920px;font-family:Bossa}
.r{position:relative;height:${ROWH}px}.r span{position:absolute;left:100px;top:20px;white-space:pre}
</style>${ROWS.map(([,w,s,t])=>`<div class="r"><span style="font-weight:${w};font-size:${s}px">${t}</span></div>`).join('')}`
writeFileSync('public/__typetest2.html', html)
const { proc, wsUrl } = await launch(); const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride',{width:1920,height:ROWS.length*ROWH,deviceScaleFactor:1,mobile:false})
await goto(cdp,'http://localhost:5173/__typetest2.html')
const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:1920,height:ROWS.length*ROWH,scale:1}})
writeFileSync(process.argv[2], Buffer.from(data,'base64'))
console.log(JSON.stringify({rowh:ROWH,rows:ROWS.map(([l,w,s,t,ref])=>({l,w,s,n:t.length,ref}))}))
cdp.close(); proc.kill()
