import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LoadingMark } from './IntroSequence'

export function PageTransition() {
  const { isTransitioning, onTransitionPeak, onTransitionDone } = useTransition()
  const peakCalledRef = useRef(false)

  useEffect(() => {
    if (!isTransitioning) {
      peakCalledRef.current = false
      return
    }
    // Navigate at peak of fade-in (after 200ms)
    const peakTimer = setTimeout(() => {
      if (!peakCalledRef.current) {
        peakCalledRef.current = true
        onTransitionPeak()
      }
    }, 200)
    // Start fade-out after peak + small buffer
    const doneTimer = setTimeout(() => {
      onTransitionDone()
    }, 260)

    return () => {
      clearTimeout(peakTimer)
      clearTimeout(doneTimer)
    }
  }, [isTransitioning, onTransitionPeak, onTransitionDone])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[70] bg-bg flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <LoadingMark />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
