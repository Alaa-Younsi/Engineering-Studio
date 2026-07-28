import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

interface HeroShapeProps {
  /** Optional parallax offset driven by the page's own useScroll/useTransform. */
  y?: MotionValue<string>
  className?: string
  opacity?: number
}

/** The decorative 4-quadrant logo mark sitting in the right half of a page hero. */
export function HeroShape({ y, className = '', opacity = 0.28 }: HeroShapeProps) {
  // Measured from the Figma: ~860px mark @1920 (44.8vw / ~80vh), right edge ~5.7vw
  // from the edge. min() of vw & vh keeps it fully visible on any viewport.
  const size = 'min(44vw, 80vh)'

  return (
    <div
      className={`absolute right-[5.7vw] top-[58%] -translate-y-1/2 pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
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
