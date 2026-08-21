// Minimal Chrome DevTools Protocol driver (no npm deps — Node 22+ global WebSocket).
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe'

export async function launch({ port = 9333, headless = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'es-cdp-'))
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${dir}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--disable-background-networking', '--disable-features=Translate,MediaRouter',
    '--hide-scrollbars', '--force-device-scale-factor=1',
    '--font-render-hinting=none', '--disable-lcd-text',
    'about:blank',
  ]
  if (headless) args.unshift('--headless=new', '--disable-gpu')
  const proc = spawn(CHROME, args, { stdio: 'ignore' })

  let target
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await r.json()
      target = list.find((t) => t.type === 'page')
      if (target) break
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100))
  }
  if (!target) throw new Error('Chrome did not expose a debugging target')
  return { proc, port, wsUrl: target.webSocketDebuggerUrl }
}

export async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  let id = 0
  const pending = new Map()
  const listeners = new Map()
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id != null) {
      const p = pending.get(msg.id); pending.delete(msg.id)
      if (!p) return
      msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result)
    } else {
      for (const fn of listeners.get(msg.method) ?? []) fn(msg.params)
    }
  }
  const send = (method, params = {}) =>
    new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })) })
  const on = (method, fn) => {
    if (!listeners.has(method)) listeners.set(method, [])
    listeners.get(method).push(fn)
  }
  return { send, on, close: () => ws.close() }
}

/** Navigate and wait for network to settle plus fonts to be ready. */
export async function goto(cdp, url, { settle = 900 } = {}) {
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  const loaded = new Promise((res) => cdp.on('Page.loadEventFired', res))
  await cdp.send('Page.navigate', { url })
  await Promise.race([loaded, new Promise((r) => setTimeout(r, 15000))])
  await cdp.send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
  await new Promise((r) => setTimeout(r, settle))
}

export const evalJs = async (cdp, expression) => {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true,
  })
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + JSON.stringify(exceptionDetails.exception?.description ?? ''))
  return result.value
}
