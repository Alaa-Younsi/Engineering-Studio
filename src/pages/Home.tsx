import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CAPTURE } from '../lib/capture'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { HeroShape } from '../components/HeroShape'
import { Reveal, RevealText } from '../components/Reveal'

// ── Hero Section ───────────────────────────────────────────────────────────────

function HeroSection({ nav }: { nav: (path: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0px', '-130px'])

  return (
    <section ref={ref} className="relative h-screen flex items-center overflow-hidden bg-bg">
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-gutter">
        <div className="max-w-[24rem] sm:max-w-[34rem] lg:max-w-[56rem]">
          <h1 className="font-display font-bold text-[2rem] sm:text-[2.75rem] lg:text-[5.375rem] leading-[1.05] lg:leading-[1.05] text-white">
            L'excellence dans l'ingénierie d'étude technique en BTP
          </h1>
          <p className="font-body text-secondary text-sm sm:text-base lg:text-[1.1875rem] tracking-[0.01em] leading-[1.45] lg:leading-[1.5] mt-6 lg:mt-[1.9rem] max-w-[29rem] lg:max-w-[40rem]">
            ENGINEERING STUDIO, intervient sur tout type de projets et à n'importe quelle phase du projet, de l'étude à la modélisation BIM.
          </p>
          <div className="flex items-center gap-3 flex-wrap mt-[3.1rem]">
            <LogoButton variant="pill" onClick={() => nav('/devis')}>Obtenez un devis</LogoButton>
            <LogoButton aria-label="Qui sommes nous" onClick={() => nav('/a-propos')} />
          </div>
        </div>
      </div>

      <HeroShape y={logoY} className="hidden md:block" />
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
    <motion.div style={{ y: CAPTURE ? 0 : illustY }} className="flex-shrink-0">
      <div className="
        w-48 h-48 sm:w-64 sm:h-64 lg:w-disc lg:h-disc
        rounded-full overflow-hidden border border-white/10
        hover:opacity-90 transition-opacity
      ">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  )

  const textBlock = (
    <div className="flex flex-col justify-center min-w-0">
      <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-[4.125rem] leading-[1.08] lg:leading-[1.08] text-white lg:max-w-[35rem]">
        {title}
      </h2>
      <p className="font-body text-secondary text-sm lg:text-[1.1875rem] leading-[1.5] lg:leading-[1.5] mt-4 lg:mt-[0.95rem] max-w-[34rem] lg:max-w-[46rem]">
        {description}
      </p>
      <div className="mt-6 lg:mt-[6.25rem]">
        <LogoButton onClick={onLearnMore}>En savoir plus</LogoButton>
      </div>
    </div>
  )

  return (
    <section ref={ref} className="h-screen flex items-center bg-bg overflow-hidden">
      <div className="w-full px-6 sm:px-10 lg:px-gutter">
        {/* Mobile: stack, image on top */}
        <div className="flex flex-col gap-8 items-center text-center lg:hidden">
          <Reveal direction={imageLeft ? 'left' : 'right'}>
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border border-white/10">
              <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <RevealText className="flex flex-col items-center gap-4">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">{title}</h2>
            <p className="font-body text-secondary text-sm leading-relaxed max-w-[38ch]">{description}</p>
            <LogoButton onClick={onLearnMore}>En savoir plus</LogoButton>
          </RevealText>
        </div>

        {/* Desktop: circle at the page gutter, text fills to the opposite gutter */}
        <div className="hidden lg:flex items-center gap-[8rem] mx-auto max-w-content">
          {imageLeft ? (
            <>
              <Reveal direction="left">{imgBlock}</Reveal>
              <RevealText className="flex-1">{textBlock}</RevealText>
            </>
          ) : (
            <>
              <RevealText className="flex-1">{textBlock}</RevealText>
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
