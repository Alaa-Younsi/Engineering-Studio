import { useSyncExternalStore } from 'react'

/**
 * The absolute 1920 canvas (src/design/canvas.tsx) only makes sense from
 * 1024px up; below that each page renders a stacked mobile layout instead.
 * One tree or the other is mounted — never both — so the huge pages stay light.
 */
const QUERY = '(min-width: 1024px)'

const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true, // server/prerender default: desktop
  )
}
