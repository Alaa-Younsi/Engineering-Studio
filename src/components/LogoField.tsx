import { motion } from 'framer-motion'

/**
 * Full-screen background of the logo mark rendered as evenly-spaced "coins" —
 * each mark sits in its own grid cell with a gap around it, so the marks read
 * as distinct badges instead of the seamless edge-to-edge lattice you get from
 * a plain repeating background (the mark fills its canvas, so tiling it makes
 * neighbours touch). Used behind the Devis / Réunion form flows.
 *
 * `nudge` is a counter the form flow bumps on every button press — each bump
 * drifts the whole field to a new small offset (spread by the golden angle so
 * it never repeats a direction), giving the background a subtle nudge each
 * time the visitor presses on through the flow.
 */
export function LogoField({ nudge = 0 }: { nudge?: number }) {
  const angle = (nudge * 137.5 * Math.PI) / 180
  const offset = { x: Math.cos(angle) * 16, y: Math.sin(angle) * 16 }

  return (
    <div className="fixed inset-0 bg-black pointer-events-none overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 grid content-start justify-items-center gap-8 sm:gap-10 lg:gap-12 p-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))' }}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 110, damping: 14 }}
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
              opacity: 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
