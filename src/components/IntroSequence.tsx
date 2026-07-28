import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { LogoFull } from './LogoFull'
import { CAPTURE } from '../lib/capture'

interface Frame {
  id: number
  placement: 'center' | 'bottom-left'
  content: React.ReactNode
}

const LOGO_SEUL = '/Assets/logo/Logo-seul.png'

export function LoadingMark() {
  return (
    <div className="relative" style={{ width: 170, height: 170 }}>
      <img
        src={LOGO_SEUL}
        alt=""
        className="absolute inset-0 m-auto"
        style={{ width: 170, height: 170, filter: 'brightness(0.1)' }}
      />
      <img
        src={LOGO_SEUL}
        alt=""
        className="absolute inset-0 m-auto"
        style={{ width: 99, height: 99, filter: 'brightness(0.3)' }}
      />
      <img
        src={LOGO_SEUL}
        alt=""
        className="absolute inset-0 m-auto"
        style={{ width: 51, height: 51 }}
      />
    </div>
  )
}

const frames: Frame[] = [
  {
    id: 0,
    placement: 'bottom-left',
    content: (
      <span className="font-body font-light text-white text-sm">
        Assalamu alaykum
      </span>
    ),
  },
  {
    id: 1,
    placement: 'bottom-left',
    content: <LogoFull size="sm" />,
  },
  {
    id: 2,
    placement: 'center',
    content: (
      <span className="font-body font-light text-white text-sm">
        Solutions Globales en Ingénierie
      </span>
    ),
  },
  {
    id: 3,
    placement: 'center',
    content: (
      <span className="font-body font-light text-white text-sm">
        Ingénierie du bâtiment
      </span>
    ),
  },
  {
    id: 4,
    placement: 'center',
    content: (
      <span className="font-body font-light text-white text-sm">
        Faisons connaissance
      </span>
    ),
  },
  {
    id: 5,
    placement: 'center',
    content: (
      <span className="font-body font-light text-white text-sm">
        Bienvenue chez nous&nbsp;!
      </span>
    ),
  },
  {
    id: 6,
    placement: 'center',
    content: <LoadingMark />,
  },
]

export function IntroSequence() {
  const [frameIndex, setFrameIndex] = useState(0)
  const [done, setDone] = useState(false)
  const cancelRef = useRef(false)
  const frameControls = useAnimation()
  const overlayControls = useAnimation()

  const finish = useCallback(async () => {
    cancelRef.current = true
    await overlayControls.start({ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } })
    setDone(true)
  }, [overlayControls])

  useEffect(() => {
    if (CAPTURE) { setDone(true); return }
    cancelRef.current = false

    const playSequence = async () => {
      for (let i = 0; i < frames.length; i++) {
        if (cancelRef.current) return
        setFrameIndex(i)
        frameControls.set({ opacity: 0 })
        await frameControls.start({ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } })
        if (cancelRef.current) return
        // Loading frame stays longer
        const holdMs = i === frames.length - 1 ? 900 : 600
        await new Promise<void>((res) => setTimeout(res, holdMs))
        if (cancelRef.current) return
        await frameControls.start({ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } })
      }
      await finish()
    }

    playSequence()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const skip = useCallback(() => {
    if (cancelRef.current) return
    frameControls.stop()
    finish()
  }, [frameControls, finish])

  useEffect(() => {
    window.addEventListener('click', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('click', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [skip])

  if (done) return null

  const frame = frames[frameIndex]
  const isCentered = frame.placement === 'center'

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-bg"
      animate={overlayControls}
      initial={{ opacity: 1 }}
    >
      <motion.div
        className="absolute"
        animate={frameControls}
        initial={{ opacity: 0 }}
        style={
          isCentered
            ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            : { left: '13%', top: '50%', transform: 'translateY(-50%)' }
        }
      >
        {frame.content}
      </motion.div>
    </motion.div>
  )
}
