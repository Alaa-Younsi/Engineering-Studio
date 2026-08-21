import { DESIGN_W } from './canvas'

/** Below this width the absolute 1920 canvas is swapped for mobile layouts. */
const MIN_DESKTOP = 1024
/** Stop growing on ultra-wide monitors; the canvas centres instead. */
const MAX_ROOT_FS = 24

/**
 * Keeps the root font-size equal to `clientWidth / 120`, i.e. 16px at exactly
 * 1920px wide. Every design coordinate is authored in rem (see canvas.tsx), so
 * this single number makes the whole page pixel-identical to the 1920px Figma
 * and proportionally identical at every other desktop width.
 *
 * `clientWidth` is deliberate: `100vw` includes the scrollbar, which would
 * scale the canvas a few pixels wider than the space it actually has.
 */
export function installRootScale() {
  const apply = () => {
    const w = document.documentElement.clientWidth
    const fs = Math.min(Math.max(w, MIN_DESKTOP) / (DESIGN_W / 16), MAX_ROOT_FS)
    document.documentElement.style.setProperty('--root-fs', `${fs}px`)
  }

  apply()
  window.addEventListener('resize', apply, { passive: true })
  return () => window.removeEventListener('resize', apply)
}
