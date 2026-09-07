/**
 * Capture mode: append `?capture=1` to any URL to disable the intro sequence
 * and scroll-reveal animations, rendering every section in its final state.
 * Used for automated visual QA (headless screenshots vs. the Figma design).
 * Inert in normal use — it only activates when the query param is present.
 */
export const CAPTURE =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('capture')
