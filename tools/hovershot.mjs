// Screenshots a region with the mouse hovering a selector, to check hover states.
//   node tools/hovershot.mjs <url> <selector> <out.png> [padX] [padY]
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'

const [url, selector, out, padX = '40', padY = '30'] = process.argv.slice(2)
const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false })
await goto(cdp, url)

const box = await evalJs(cdp, `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  // Page coordinates: Page.captureScreenshot's clip is document-relative.
  return { x: r.x, y: r.y, pageX: r.x + scrollX, pageY: r.y + scrollY, w: r.width, h: r.height };
})()`)
if (!box) { console.error('selector not found:', selector); process.exit(1) }

await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x + box.w / 2, y: box.y + box.h / 2 })
await new Promise((r) => setTimeout(r, 900))

const clip = {
  x: Math.max(0, box.pageX - +padX), y: Math.max(0, box.pageY - +padY),
  width: box.w + +padX * 2 + 260, height: box.h + +padY * 2, scale: 2,
}
const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', clip })
writeFileSync(out, Buffer.from(data, 'base64'))
console.log(out, JSON.stringify(box))
cdp.close(); proc.kill()
