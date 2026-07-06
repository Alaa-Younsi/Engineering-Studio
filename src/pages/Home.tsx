import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { Reveal, RevealText } from '../components/Reveal'

// ── Hero Section ───────────────────────────────────────────────────────────────

function HeroSection({ nav }: { nav: (path: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0px', '-130px'])

  return (
    <section ref={ref} className="relative h-screen flex items-center overflow-hidden bg-bg">
      <div className="relative z-10 pl-6 sm:pl-12 lg:pl-20 pr-6 sm:pr-20 md:pr-10 lg:pr-0 pt-16 w-full md:max-w-[60%] lg:max-w-[55%]">
        <h1 className="font-display font-bold text-[1.65rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] leading-[1.07] text-white mb-4 lg:mb-6">
          L'excellence dans l'ingénierie d'étude technique en BTP
        </h1>
        <p className="font-body text-secondary text-[10px] sm:text-xs uppercase tracking-widest mb-8 lg:mb-10 max-w-[44ch] leading-relaxed">
          ENGINEERING STUDIO, intervient sur tout type de projets et à n'importe quelle phase du projet, de l'étude à la modélisation BIM.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <LogoButton onClick={() => nav('/devis')}>Obtenir un devis</LogoButton>
          <LogoButton onClick={() => nav('/a-propos')}>Qui Sommes Nous</LogoButton>
        </div>
      </div>

      <div className="absolute right-[-5vw] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block">
        <motion.div style={{ y: logoY }}>
          <img src="/Assets/logo/Logo-seul.png" alt="" className="w-[500px] h-[500px] object-contain" style={{ opacity: 0.15 }} draggable={false} />
        </motion.div>
      </div>
    </section>
  )
}

// ── Service Section ────────────────────────────────────────────────────────────

interface ServiceSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  imageLeft: boolean
  onLearnMore: () => void
}

function ServiceSection({ title, description, imageSrc, imageAlt, imageLeft, onLearnMore }: ServiceSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const illustY = useTransform(scrollYProgress, [0, 1], ['50px', '-50px'])

  const imgBlock = (
    <div className="flex items-center justify-center flex-shrink-0">
      <motion.div style={{ y: illustY }}>
        <div className="
          w-48 h-48
          sm:w-56 sm:h-56
          md:w-64 md:h-64
          lg:w-72 lg:h-72
          xl:w-80 xl:h-80
          rounded-full overflow-hidden border border-white/10
          hover:opacity-80 transition-opacity
        ">
          <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  )

  const textBlock = (
    <div className="flex flex-col justify-center gap-4 lg:gap-6 min-w-0">
      <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
        {title}
      </h2>
      <p className="font-body text-secondary text-sm leading-relaxed max-w-prose">
        {description}
      </p>
      <LogoButton onClick={onLearnMore}>En savoir plus</LogoButton>
    </div>
  )

  return (
    <section ref={ref} className="h-screen flex items-center bg-bg overflow-hidden">
      <div className="w-full px-6 sm:px-10 lg:px-20 max-w-screen-xl mx-auto">

        {/* Mobile: always stack, image on top */}
        <div className="flex flex-col gap-8 items-center text-center md:hidden">
          <Reveal direction={imageLeft ? 'left' : 'right'}>
            <div className="w-48 h-48 rounded-full overflow-hidden border border-white/10 hover:opacity-80 transition-opacity">
              <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <RevealText className="flex flex-col items-center gap-4">
            <h2 className="font-display font-bold text-2xl text-white leading-tight">{title}</h2>
            <p className="font-body text-secondary text-sm leading-relaxed max-w-[38ch]">{description}</p>
            <LogoButton onClick={onLearnMore}>En savoir plus</LogoButton>
          </RevealText>
        </div>

        {/* Tablet / Desktop: two columns */}
        <div className="hidden md:grid grid-cols-2 gap-10 lg:gap-20 xl:gap-28 items-center">
          {imageLeft ? (
            <>
              <Reveal direction="left">{imgBlock}</Reveal>
              <RevealText>{textBlock}</RevealText>
            </>
          ) : (
            <>
              <RevealText>{textBlock}</RevealText>
              <Reveal direction="right">{imgBlock}</Reveal>
            </>
          )}
        </div>

      </div>
    </section>
  )
}

// ── Home Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  return (
    <div>
      <HeroSection nav={nav} />

      <ServiceSection
        title="Installations MEP systèmes"
        description="Nous réalisons les études techniques des domaines CVC (chauffage, ventilation, climatisation) réseau de désenfumage, plomberie et évacuation, lutte contre l'incendie, ainsi les réseaux électriques (courant fort et faibles), Ingénieries énergétiques et thermiques."
        imageSrc="/Assets/images/Accueil-MEP.png"
        imageAlt="Installations MEP"
        imageLeft
        onLearnMore={() => nav('/prestations/mep')}
      />

      <ServiceSection
        title="VRD et Aménagement"
        description="Engineering Studio met au service de votre projet d'aménagement du territoire, son expertise en génie urbain, terrassement, Infrastructure et réseaux VRD (câblés et réseaux divers), étude de stabilité, travaux publics, eau et environnement."
        imageSrc="/Assets/images/Accueil-VRD.png"
        imageAlt="VRD et Aménagement"
        imageLeft={false}
        onLearnMore={() => nav('/prestations/vrd')}
      />

      <ServiceSection
        title="Travaux topographique"
        description="Nous réalisons un large éventail de missions : des relevés topographiques de terrain à l'établissement de plans précis. Notre travail couvre l'ensemble des phases d'un projet, nous accompagnons aussi les projets d'aménagement, de construction ou de rénovation."
        imageSrc="/Assets/images/Accueil-TOPO.png"
        imageAlt="Travaux topographique"
        imageLeft
        onLearnMore={() => nav('/prestations/topo')}
      />

      <ServiceSection
        title="Modélisation 3D et Synthèse BIM"
        description="Assurez-vous une représentation précise de vos bâtiments via un processus de modélisation 3D. Celui-ci représente une véritable empreinte 3D du bâtiment (architecture et structure) et de l'ensemble des éléments techniques qui le composent (fluides, réseaux électriques, éléments de plomberie, CVC...)."
        imageSrc="/Assets/images/Accueil-BIM.png"
        imageAlt="Modélisation BIM"
        imageLeft={false}
        onLearnMore={() => nav('/prestations/bim')}
      />

      <Footer />
    </div>
  )
}
