import { CAPTURE } from '../lib/capture'

/** Same discipline as `Rise`: no scroll-linked motion during visual QA
 *  capture or for `prefers-reduced-motion` — it would otherwise desync the
 *  screenshot harness from the Figma reference and ignore an accessibility
 *  preference. */
export const motionOff = () =>
  CAPTURE ||
  (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
