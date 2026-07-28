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
  // Measured from the Figma: ~860px mark, centred at ~71% / ~58% of the hero.
  const size = 'clamp(220px, 44.8vw, 54rem)'

  return (
    <div
      className={`absolute right-[6.8rem] top-[58%] -translate-y-1/2 pointer-events-none select-none ${className}`}
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
