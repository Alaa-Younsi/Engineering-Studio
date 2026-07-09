import { useCallback, useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { Footer } from '../components/Footer'
import { HeroShape } from '../components/HeroShape'
import { NouvellesArchive } from '../components/NouvellesArchive'
import { UnderConstruction } from '../components/UnderConstruction'
import { FEATURES } from '../config/features'

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

        <HeroShape y={heroLogoY} />
      </section>

      {FEATURES.nouvelles ? (
        <NouvellesArchive />
      ) : (
        <UnderConstruction label="Retour à l'accueil" onClick={() => nav('/')} />
      )}

      <Footer />
    </main>
  )
}
