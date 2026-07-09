import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from './Footer'
import { Reveal, RevealText } from './Reveal'

interface Service {
  name: string
  image: string
}

export interface StudioConfig {
  logo: string
  logoAlt: string
  services: Service[]
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['40px', '-40px'])

  const imageLeft = index % 2 !== 0

  const circle = (
    <div className="flex items-center justify-center">
      <motion.div
        style={{ y: imgY }}
        className="w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border border-white/10 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )

  const label = (
    <div className="flex flex-col items-center text-center gap-4">
      <span className="font-body text-secondary text-xs tracking-widest">
        {String(index + 1).padStart(2, '0')}.
      </span>
      <h2 className="font-display font-bold text-3xl lg:text-4xl xl:text-5xl text-white leading-tight">
        {service.name}
      </h2>
    </div>
  )

  return (
    <section ref={ref} className="border-t border-white/10">
      {/* Mobile: stack, image above */}
      <div className="md:hidden flex flex-col gap-8 items-center text-center px-6 py-16">
        <Reveal direction={imageLeft ? 'left' : 'right'}>
          <div className="w-52 h-52 rounded-full overflow-hidden border border-white/10 hover:opacity-80 transition-opacity">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          </div>
        </Reveal>
        <RevealText className="flex flex-col gap-2">
          <span className="font-body text-secondary text-xs tracking-widest">
            {String(index + 1).padStart(2, '0')}.
          </span>
          <h2 className="font-display font-bold text-2xl text-white leading-tight">{service.name}</h2>
        </RevealText>
      </div>

      {/* Desktop: alternating two-column */}
      <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-16 xl:gap-20 items-center max-w-screen-xl mx-auto px-10 lg:px-20 py-24 lg:py-32 xl:py-40">
        {imageLeft ? (
          <>
            <Reveal direction="left">{circle}</Reveal>
            <RevealText>{label}</RevealText>
            <div aria-hidden />
          </>
        ) : (
          <>
            <div aria-hidden />
            <RevealText>{label}</RevealText>
            <Reveal direction="right">{circle}</Reveal>
          </>
        )}
      </div>
    </section>
  )
}

export function StudioPage({ logo, logoAlt, services }: StudioConfig) {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="object-contain"
            style={{ width: 'min(80vh, 80vw)', height: 'min(80vh, 80vw)', opacity: 0.40 }}
            draggable={false}
          />
        </div>
        <img
          src={logo}
          alt={logoAlt}
          className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain select-none"
          draggable={false}
        />
      </section>

      {services.map((svc, i) => (
        <ServiceRow key={svc.name} service={svc} index={i} />
      ))}

      <Footer />
    </main>
  )
}
