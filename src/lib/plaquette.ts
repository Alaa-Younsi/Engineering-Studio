/**
 * The company brochure ("Plaquette"), offered as a download from the menu.
 *
 * The PDF is not in the repo yet. Until it is, `PLAQUETTE_URL` is empty and the
 * button is deliberately inert — it renders but does nothing. To turn it on:
 * drop the file in `public/` (e.g. `public/plaquette.pdf`) and set the constant.
 */

// TODO(client): set to '/plaquette.pdf' once the file is uploaded to public/.
export const PLAQUETTE_URL = ''

/** Triggers the brochure download. A no-op while `PLAQUETTE_URL` is unset. */
export function downloadPlaquette(): void {
  if (!PLAQUETTE_URL) return
  const a = document.createElement('a')
  a.href = PLAQUETTE_URL
  a.download = 'Plaquette-Engineering-Studio.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
