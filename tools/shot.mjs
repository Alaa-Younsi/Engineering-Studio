// Full-page screenshot of a URL at an exact CSS width.
//   node tools/shot.mjs <url> <out.png> [width] [scale] [--click="selector"] [--wait=ms]
import { launch, connect, goto, evalJs } from './cdp.mjs'
import { writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split(/=(.*)/s).slice(0, 2)),
)
const [url, out, width = '1920', scale = '1'] = args.filter((a) => !a.startsWith('--'))

const { proc, wsUrl } = await launch()
const cdp = await connect(wsUrl)
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: +width, height: 1080, deviceScaleFactor: +scale, mobile: false,
})
await goto(cdp, url)

if (flags.click) {
  await evalJs(cdp, `document.querySelector(${JSON.stringify(flags.click)}).click()`)
  await new Promise((r) => setTimeout(r, +(flags.wait ?? 800)))
} else if (flags.wait) {
  await new Promise((r) => setTimeout(r, +flags.wait))
}

const h = flags.h
  ? +flags.h
  : await evalJs(cdp, 'Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))')
const { data } = await cdp.send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: +width, height: h, scale: +scale },
})
writeFileSync(out, Buffer.from(data, 'base64'))
console.log(`${out}  ${width}x${h} @${scale}x`)
cdp.close(); proc.kill()
