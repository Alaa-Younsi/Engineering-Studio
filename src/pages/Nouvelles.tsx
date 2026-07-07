import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { RevealText } from '../components/Reveal'

export default function Nouvelles() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLogoY = useTransform(heroProgress, [0, 1], ['0px', '-80px'])

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none">
            Nouvelles
          </h1>
        </div>

        {/* Decorative circle top-right */}
        <div
          className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'clamp(150px, 36vw, 400px)', height: 'clamp(150px, 36vw, 400px)' }}
        >
          <motion.div style={{ y: heroLogoY }} className="w-full h-full">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* Under construction */}
      <section className="flex flex-col items-center justify-center py-16 px-6">
        <RevealText
          className="relative rounded-full bg-[#111] flex flex-col items-center justify-center overflow-hidden"
          style={{ width: 'min(72vw, 380px)', height: 'min(72vw, 380px)' }}
        >
          {/* Background LogoMark within circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.12 }} draggable={false} />
          </div>

          {/* Text */}
          <div className="relative z-10 text-center px-8">
            <p className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mb-6">
              En cours de<br />construction
            </p>
            <LogoButton onClick={() => nav('/')}>Retour à l'accueil</LogoButton>
          </div>
        </RevealText>
      </section>

      <Footer />
    </main>
  )
}
