import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CAPTURE } from '../lib/capture'
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

  /* Figma: the disc is 550px across and sits 108px in from the page edge. */
  const circle = (
    <div className={`flex items-center ${imageLeft ? 'justify-start pl-[6.75rem]' : 'justify-end pr-[6.75rem]'}`}>
      <motion.div
        style={{ y: CAPTURE ? 0 : imgY }}
        className="w-64 h-64 lg:w-[34.375rem] lg:h-[34.375rem] rounded-full overflow-hidden border border-white/10 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )

  const label = (
    <div className="flex flex-col items-center text-center gap-3 lg:gap-[0.9rem] mx-auto max-w-[30rem] px-4">
      <span className="font-body font-normal text-secondary text-xs lg:text-d-step">
        {String(index + 1).padStart(2, '0')}.
      </span>
      <h2 className="font-display font-medium text-3xl lg:text-d-h2 text-white leading-[1.05] lg:leading-[4.5625rem]">
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

      {/* Desktop: number+name centred on the page, disc pinned to one gutter. */}
      <div className="hidden md:block relative w-full lg:h-screen py-24 lg:py-0">
        {/* Positioning lives on the wrappers — Reveal drives `transform`, so it
            cannot also carry the centring translate. */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${imageLeft ? 'left-0' : 'right-0'}`}>
          <Reveal direction={imageLeft ? 'left' : 'right'}>{circle}</Reveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <RevealText>{label}</RevealText>
        </div>
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
            style={{ width: 'min(66vh, 90vw)', height: 'min(66vh, 90vw)', opacity: 0.42 }}
            draggable={false}
          />
        </div>
        <img
          src={logo}
          alt={logoAlt}
          className="relative z-10 w-40 sm:w-48 md:w-56 lg:w-[26rem] object-contain select-none"
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
