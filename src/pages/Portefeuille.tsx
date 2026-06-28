import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'

export default function Portefeuille() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0px', '-60px'])

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-white leading-none">
            Portefeuille
          </h1>
        </div>
        <motion.div
          style={{ y: logoY, width: 'min(56vw, 56vh)', height: 'min(56vw, 56vh)' }}
          className="absolute -right-[6%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        >
          <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
        </motion.div>
      </section>

      {/* ── En cours ── */}
      <section className="py-28 flex items-center justify-center">
        <div className="relative w-72 h-72 rounded-full bg-surface overflow-hidden flex flex-col items-center justify-center gap-3">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.12 }} draggable={false} />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <p className="font-display font-bold text-[1.6rem] text-white text-center leading-tight">
              En cours de<br />construction
            </p>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <img
                src="/Assets/logo/Logo-seul.png"
                alt=""
                className="w-4 h-4 object-contain"
                style={{ filter: 'brightness(0)' }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
