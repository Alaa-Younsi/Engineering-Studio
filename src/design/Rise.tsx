import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { CAPTURE } from '../lib/capture'

/**
 * Scroll reveal: content rises a little and fades in the first time it enters
 * the viewport.
 *
 * À propos alone carries 45 software tiles and Clients 42 client tiles, so this
 * runs on one shared IntersectionObserver plus a CSS transition rather than a
 * motion component per element — the styles live in index.css under
 * `[data-rise]`. Elements unobserve themselves once shown; it never replays.
 *
 * Inert under `?capture=1` (visual QA) and for `prefers-reduced-motion`.
 */
let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-rise', 'in')
        observer?.unobserve(entry.target)
      }
    },
    // Trigger a little before the element is fully on screen so the motion
    // reads as the page arriving, not as something popping in late.
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  )
  return observer
}

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export interface RiseProps {
  children: ReactNode
  /** Stagger within a group, in ms. */
  delay?: number
  className?: string
  style?: CSSProperties
}

export function Rise({ children, delay = 0, className = '', style }: RiseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const off = CAPTURE || reducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || off) return

    /*
     * On the 1920 canvas the children are absolutely positioned, which leaves
     * this wrapper a 0x0 box at the canvas origin — every one of them would
     * intersect at once on load. When that happens, watch the first element
     * child, whose rect is the content's real position.
     */
    const target =
      el.getBoundingClientRect().height === 0 && el.firstElementChild ? el.firstElementChild : el

    const io = getObserver()
    io.observe(target)
    // The observer sets data-rise on whatever it saw; keep it on the wrapper,
    // which is the element the transition is styled on.
    const relay = new MutationObserver(() => {
      if (target !== el && target.getAttribute('data-rise') === 'in') {
        el.setAttribute('data-rise', 'in')
        target.removeAttribute('data-rise')
        relay.disconnect()
      }
    })
    if (target !== el) relay.observe(target, { attributes: true, attributeFilter: ['data-rise'] })

    return () => {
      io.unobserve(target)
      relay.disconnect()
    }
  }, [off])

  return (
    <div
      ref={ref}
      className={className}
      // The wrapper stays `position: static`, so absolutely positioned children
      // keep resolving against the page Frame — only the transform moves them.
      data-rise={off ? 'in' : 'out'}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  )
}
