import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  y?: number
}

export function Reveal({ children, className = '', style, delay = 0, y = 80 }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={{ ...style, transformPerspective: 1200 }}
      initial={{ opacity: 0, y, rotateX: -30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
