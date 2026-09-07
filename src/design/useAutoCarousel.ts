import { useCallback, useEffect, useRef, useState } from 'react'
import { CAPTURE } from '../lib/capture'

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Drives a horizontally-scrollable track that slides on its own, bouncing
 * between the two ends, and pauses for as long as a pointer holds it down —
 * mouse or touch — so a visitor can read a card without the strip sliding
 * out from under them. A held mouse can also drag it, same as before.
 *
 * Inert under `?capture=1` (visual QA) and `prefers-reduced-motion`, same
 * discipline as `Rise` — a moving `scrollLeft` mid-screenshot would otherwise
 * break the harness's pixel diff against the Figma reference.
 */
export function useAutoCarousel<T extends HTMLElement>({ speed = 45 }: { speed?: number } = {}) {
  const ref = useRef<T | null>(null)
  const [paused, setPaused] = useState(false)
  const dir = useRef(1)
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false })
  const off = CAPTURE || reducedMotion()

  useEffect(() => {
    if (off) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      const el = ref.current
      if (el && !paused) {
        const max = el.scrollWidth - el.clientWidth
        if (max > 0) {
          let next = el.scrollLeft + dir.current * speed * (dt / 1000)
          if (next >= max) {
            next = max
            dir.current = -1
          } else if (next <= 0) {
            next = 0
            dir.current = 1
          }
          el.scrollLeft = next
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, speed, off])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setPaused(true)
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: ref.current?.scrollLeft ?? 0,
      moved: false,
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current
    const d = drag.current
    // Touch already pans the track natively; only steer it by hand for a mouse.
    if (!el || !d.active || e.pointerType === 'touch') return
    const delta = e.clientX - d.startX
    if (Math.abs(delta) > 3) d.moved = true
    el.scrollLeft = d.startScroll - delta
  }, [])

  const endPointer = useCallback(() => {
    drag.current.active = false
    setPaused(false)
  }, [])

  // Swallow the click a drag ends on, so releasing over a card doesn't fire it.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  return {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp: endPointer,
    onPointerCancel: endPointer,
    onPointerLeave: endPointer,
    onClickCapture,
    className: 'cursor-grab touch-pan-x select-none active:cursor-grabbing',
  }
}
