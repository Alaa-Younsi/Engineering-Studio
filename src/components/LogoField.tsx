import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

/**
 * Full-screen background of the logo mark rendered as evenly-spaced "coins" —
 * each mark sits in its own grid cell with a gap around it, so the marks read
 * as distinct badges instead of the seamless edge-to-edge lattice you get from
 * a plain repeating background (the mark fills its canvas, so tiling it makes
 * neighbours touch). Used behind the Devis / Réunion form flows.
 *
 * `nudge` is a counter the form flow bumps on every button press, and each bump
 * fires a flash: the whole field flicks out in a new direction (spread by the
 * golden angle so it never repeats one), overshoots back the other way and
 * lands where it started, brightening on the way out and dimming back down.
 * The whole thing is over in a quarter of a second.
 *
 * The brightness is done with opacity, not a `brightness()` filter: the mark
 * is pure white, so multiplying its channels does nothing at all — the only
 * thing that changes how it reads against the black is how far it is faded.
 */

/** Resting fade of the field, and the peak it flashes to. */
const REST = 0.15
const PEAK = 0.55

/** How far each press throws the field, in px. */
const THROW = 72

/** Out, back past the start, settle — the shape of one flick. */
const FLICK = {
  duration: 0.26,
  times: [0, 0.34, 0.62, 1],
  ease: [0.16, 0.9, 0.3, 1],
} as const

export function LogoField({ nudge = 0 }: { nudge?: number }) {
  const controls = useAnimationControls()
  const first = useRef(true)

  useEffect(() => {
    // The initial render is the resting state, not a press.
    if (first.current) {
      first.current = false
      return
    }

    const angle = (nudge * 137.5 * Math.PI) / 180
    const dx = Math.cos(angle) * THROW
    const dy = Math.sin(angle) * THROW

    controls.stop()
    controls.set({ x: 0, y: 0, opacity: REST })
    controls.start({
      x: [0, dx, dx * -0.34, 0],
      y: [0, dy, dy * -0.34, 0],
      opacity: [REST, PEAK, REST * 1.4, REST],
      transition: FLICK,
    })
  }, [nudge, controls])

  return (
    <div className="fixed inset-0 bg-black pointer-events-none overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 grid content-start justify-items-center gap-8 sm:gap-10 lg:gap-12 p-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))' }}
        initial={{ x: 0, y: 0, opacity: REST }}
        animate={controls}
      >
        {Array.from({ length: 600 }).map((_, i) => (
          <div
            key={i}
            className="w-full max-w-[72px] aspect-square"
            style={{
              backgroundImage: "url('/Assets/logo/Logo-seul.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
