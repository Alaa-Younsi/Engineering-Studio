import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  direction?: 'left' | 'right' | 'none'
}

const viewport = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' } as const

/** Photos/illustrations: a 3D tilt-in from the side. */
export function Reveal({ children, className = '', style, delay = 0, direction = 'left' }: RevealProps) {
  const x = direction === 'none' ? 0 : direction === 'left' ? -64 : 64
  const rotateY = direction === 'none' ? 0 : direction === 'left' ? 32 : -32

  return (
    <motion.div
      className={className}
      style={{ ...style, transformPerspective: 1000 }}
      initial={{ opacity: 0, x, rotateY, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Text/copy: a soft focus-pull fade — starts blurred, slightly sunken into
 * the page (skewed + scaled down) and rises into crisp focus. No side travel.
 */
export function RevealText({ children, className = '', style, delay = 0 }: Omit<RevealProps, 'direction'>) {
  return (
    <motion.div
      className={className}
      style={{ ...style, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 26, scale: 0.96, rotateX: 8, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
      viewport={viewport}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
