import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { RevealText } from '../components/Reveal'

export default function Portefeuille() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0px', '-60px'])

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none">
            Portefeuille
          </h1>
        </div>
        <div
          className="absolute -right-[4%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'clamp(160px, 38vw, 430px)', height: 'clamp(160px, 38vw, 430px)' }}
        >
          <motion.div style={{ y: logoY }} className="w-full h-full">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* ── En cours ── */}
      <section className="py-28 flex items-center justify-center">
        <RevealText className="relative w-72 h-72 rounded-full bg-surface overflow-hidden flex flex-col items-center justify-center gap-3">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.12 }} draggable={false} />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <p className="font-display font-bold text-[1.6rem] text-white text-center leading-tight">
              En cours de<br />construction
            </p>
            <LogoButton onClick={() => nav('/contact')}>Nous contacter</LogoButton>
          </div>
        </RevealText>
      </section>

      <Footer />
    </main>
  )
}
