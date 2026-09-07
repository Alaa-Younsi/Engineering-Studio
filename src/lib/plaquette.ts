/**
 * The company brochure ("Plaquette"), offered as a download from the menu.
 *
 * The PDF lives in `public/`, so it ships with the build and is served straight
 * off the origin (the SPA rewrite in `vercel.json` only kicks in when no static
 * file matches). To replace it, drop a new file in `public/` and update the path.
 */

export const PLAQUETTE_URL = '/Plaquette_es.pdf'

/** Triggers the brochure download. */
export function downloadPlaquette(): void {
  if (!PLAQUETTE_URL) return
  const a = document.createElement('a')
  a.href = PLAQUETTE_URL
  a.download = 'Plaquette-Engineering-Studio.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
