import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from './Footer'

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
        className="w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border border-white/10 flex-shrink-0"
      >
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )

  const label = (
    <div className="flex flex-col gap-4">
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
        <div className="w-52 h-52 rounded-full overflow-hidden border border-white/10">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-body text-secondary text-xs tracking-widest">
            {String(index + 1).padStart(2, '0')}.
          </span>
          <h2 className="font-display font-bold text-2xl text-white leading-tight">{service.name}</h2>
        </div>
      </div>

      {/* Desktop: alternating two-column */}
      <div className="hidden md:grid grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center max-w-screen-xl mx-auto px-10 lg:px-20 py-24 lg:py-32 xl:py-40">
        {imageLeft ? <>{circle}{label}</> : <>{label}{circle}</>}
      </div>
    </section>
  )
}

export function StudioPage({ logo, logoAlt, services }: StudioConfig) {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="flex items-center justify-center h-screen">
        <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] rounded-full bg-surface flex items-center justify-center">
          <img
            src={logo}
            alt={logoAlt}
            className="w-auto h-[55%] max-w-[72%] object-contain select-none"
            draggable={false}
          />
        </div>
      </section>

      {services.map((svc, i) => (
        <ServiceRow key={svc.name} service={svc} index={i} />
      ))}

      <Footer />
    </main>
  )
}
