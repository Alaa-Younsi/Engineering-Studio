import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

interface HeroShapeProps {
  /** Optional parallax offset driven by the page's own useScroll/useTransform. */
  y?: MotionValue<string>
  className?: string
  opacity?: number
}

/**
 * The decorative 4-quadrant logo mark that accompanies a page hero.
 * Desktop (md+): sits in the right half, vertically centred so it mirrors the
 * hero title (~860px mark @1920 ≈ 44vw / 80vh, right edge ~5.7vw from the edge).
 * Mobile: a faint watermark centred behind the hero content, so the mark is
 * present on phones without colliding with the title (matching how the
 * Prestations / Studio heroes render their centred marks).
 * min() of vw & vh keeps it fully visible on any viewport.
 */
export function HeroShape({ y, className = '', opacity = 0.28 }: HeroShapeProps) {
  return (
    <div
      className={`absolute pointer-events-none select-none
        left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(86vw,56vh)] h-[min(86vw,56vh)]
        md:left-auto md:translate-x-0 md:right-[5.7vw] md:w-[min(44vw,80vh)] md:h-[min(44vw,80vh)] ${className}`}
    >
      <motion.div style={{ y }} className="w-full h-full">
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-full h-full object-contain"
          style={{ opacity }}
          draggable={false}
        />
      </motion.div>
    </div>
  )
}
