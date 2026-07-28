import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { HeroShape } from '../components/HeroShape'
import { Reveal, RevealText } from '../components/Reveal'

const sectors = [
  "Bureaux d'études",
  'Entreprises de réalisation',
  'Bailleurs sociaux',
  'Immobiliers de commerces',
  'Bâtiments industriels',
  'Immobiliers de bureaux',
  'Promoteurs immobiliers',
  'Bâtiments administratifs',
  'Structure hospitalières',
]

const engagements = [
  'Nous sommes honorés qu’ils nous choisissent',
  'Notre client est notre partenaire. Quant il prospère, nous faisons de même',
  'Tout revient à… notre engagement envers nos clients !',
]

interface Client {
  name: string
  name2: string
  category: string
  number: string
}

const clients: Client[] = [
  { name: 'Bouchellouga', name2: 'Chawki', category: 'Architecture', number: '21' },
  { name: 'Best', name2: 'Concept', category: 'Architecture', number: '16' },
  { name: 'ATM', name2: 'Architecture', category: 'Architecture', number: '16' },
  { name: 'Kebab', name2: 'Abdeslem', category: 'Architecture', number: '16' },
  { name: 'Saci Hadef', name2: 'Mohamed', category: 'Architecture', number: '21' },
  { name: 'Nour El Afak', name2: 'Lilomrane', category: 'Architecture', number: '16' },
  { name: 'Biodattes', name2: 'Algérie', category: 'Industrie', number: '07' },
  { name: 'Hazi', name2: 'Bachir', category: 'Architecture', number: '19' },
  { name: 'Salah', name2: 'Mourdi', category: 'Travaux publics', number: '21' },
  { name: 'BET', name2: 'CAL', category: 'Architecture', number: '16' },
  { name: 'Nour El Afak', name2: 'Lilomrane', category: 'Immobilière', number: '16' },
  { name: 'Bahlouli', name2: 'F.', category: 'Architecture', number: '19' },
  { name: 'AL ELEC', name2: 'Spa', category: 'Entreprise', number: '16' },
  { name: 'AZ', name2: 'Architects', category: 'Travaux publics', number: '16' },
  { name: 'Benmahmoud', name2: 'S.', category: 'Architecture', number: '19' },
  { name: 'ACTARIS', name2: 'Sarl', category: 'Industrie', number: '16' },
  { name: 'Wassim', name2: 'Sayeh', category: 'Architecture', number: '19' },
  { name: 'Abdoun', name2: 'Radhwane', category: 'Architecture', number: '26' },
  { name: 'Bendjama', name2: 'Chafik', category: 'Architecture', number: '21' },
  { name: 'Boucherit', name2: 'Othmane', category: 'Architecture', number: '16' },
  { name: 'BETA', name2: 'HMD', category: 'Architecture', number: '30' },
  { name: 'Eurl', name2: 'BAUS', category: 'Architecture', number: '16' },
  { name: 'Archi', name2: 'Gate', category: 'Architecture', number: '19' },
  { name: 'Inter', name2: 'Plan', category: 'Architecture', number: '19' },
  { name: 'Archi', name2: 'Box', category: 'Architecture', number: '16' },
  { name: 'Baret', name2: 'Architectes', category: 'Architecture', number: '19' },
  { name: 'Médina', name2: 'Architecture', category: 'Architecture', number: '19' },
  { name: 'Agrodiv', name2: 'Spa', category: 'Industrie', number: '19' },
  { name: 'Manar', name2: 'El Imara', category: 'Architecture', number: '19' },
  { name: 'Rezzoug', name2: 'Lamine', category: 'Architecture', number: '09' },
  { name: 'Debacha', name2: 'Badis', category: 'Architecture', number: '19' },
  { name: 'Chettab', name2: 'Nabil', category: 'Architecture', number: '19' },
  { name: 'Cons Belmas', name2: 'Sarl', category: 'Entreprise', number: '34' },
  { name: 'Boumediene Consultant', name2: 'Engineering', category: 'Génie civil', number: '16' },
  { name: 'Bougarne', name2: 'Adel', category: 'Architecture', number: '19' },
  { name: 'Charm', name2: 'Design', category: 'Architecture', number: '23' },
  { name: 'TT', name2: 'Architects', category: 'Architecture', number: '23' },
  { name: 'Languer', name2: 'Mostapha', category: 'Architecture', number: '19' },
  { name: 'Ouaar', name2: 'Mohamed', category: 'Architecture', number: '21' },
  { name: 'Sarl', name2: 'S3ec', category: 'Entreprise', number: '16' },
  { name: 'Laghouag', name2: 'S.', category: 'Architecture', number: '19' },
  { name: 'RKM', name2: 'Studio', category: 'Architecture', number: '16' },
]

const testimonials = [
  {
    name: 'TT',
    name2: 'Architects',
    category: 'Architecture',
    text: "J'apprécie particulièrement de travailler avec ENGINEERING STUDIO pour leur sérieux, leur rigueur et leur réactivité. Les dossiers études sont de grandes qualités avec rarement de problèmes en phase exécution.",
  },
  {
    name: 'Best',
    name2: 'Concept',
    category: 'Architecture',
    text: "Concevoir en équipe dans un dialogue permanent, s'impliquer résolument dans le suivi des projets et des chantiers, faire avec justesse et passion. Autant de valeurs partagées qui font de ENGINEERING STUDIO.",
  },
  {
    name: 'Kebab',
    name2: 'Abdslem',
    category: 'Architecture',
    text: "Une équipe Jeune, dynamique et volontaire toujours disponible. Leurs dossiers techniques sont d'une qualité rare. Sur le chantier, les entreprises sont vraiment bien pilotées.",
  },
]

export default function Clients() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLogoY = useTransform(heroProgress, [0, 1], ['0px', '-80px'])

  const midRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: midProgress } = useScroll({ target: midRef, offset: ['start end', 'end start'] })
  const midLogoY = useTransform(midProgress, [0, 1], ['40px', '-40px'])

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-gutter relative z-10">
          <h1 className="font-display font-bold text-[2.5rem] sm:text-6xl lg:text-[5.375rem] text-white leading-none lg:leading-none">
            Clients
          </h1>
        </div>
        <HeroShape y={heroLogoY} className="hidden md:block" />
      </section>

      {/* ── Intro ───────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-44 border-t border-white/10">
        <RevealText className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Nos clients</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-white leading-tight lg:leading-tight">
              Découvrez nos clients et comment nous collaborons avec eux
            </h2>
            <div className="mt-10">
              <LogoButton onClick={() => nav('/contact')}>Travaillons ensemble</LogoButton>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-body text-secondary text-sm leading-relaxed">
              Nous travaillons principalement avec les installateurs, architectes, bureaux d'études, entreprises générales, sous-traitants, propriétaires industrielles, maîtres d'ouvrages, promoteurs.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Quel que soit votre secteur d'activité, nous pouvons vous aider à réussir vos projets, même les plus complexes. Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Vous pouvez compter sur nous pour vous assister à chaque étape de votre projet d'études. De la conception à le dimensionnement, nous vous garantissons des études de qualité, que ce soit pour un projet neuve ou une rénovation. Nous possédons les meilleurs moyens et logiciels pour vous fournir des prestations de qualité.
            </p>
          </div>
        </RevealText>
      </section>

      {/* ── Mission statement ───────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-52 bg-surface">
        <RevealText className="max-w-content mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-[32ch] mx-auto">
            Des missions variées et des solutions adaptées à chaque client
          </h2>
          <p className="font-body text-secondary text-sm mt-8 max-w-[62ch] mx-auto leading-relaxed">
            Avec ENGINEERING STUDIO à vos côtés, vous bénéficiez des meilleures solutions en matière d'études techniques (réseaux extérieurs et réseaux intérieurs).
          </p>
        </RevealText>
      </section>

      {/* ── Engagement ──────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-44 border-t border-white/10">
        <div className="max-w-content mx-auto">
          <RevealText className="text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-8">
              Notre engagement envers nos clients
            </h2>
            <p className="font-body text-secondary text-sm leading-relaxed max-w-[90ch] mx-auto mb-16">
              Notre engagement envers nos clients de partout en est un par lequel nous prenons réellement conscience que ce sont eux qui nous fournissent du travail et des avantages. Ces clients ont la possibilité de s'approvisionner à de nombreuses autres sources et nous sommes honorés qu'ils nous choisissent. Leurs besoins sont simples. Ils veulent que l'étude soit livrée tel que promis et que la qualité offre la performance prévue.
            </p>
          </RevealText>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {engagements.map((e, i) => (
              <RevealText key={e} delay={i * 0.1}>
                <div className="relative flex items-center justify-center px-4 py-8 hover:opacity-70 transition-opacity">
                  <img
                    src="/Assets/logo/Logo-seul.png"
                    alt=""
                    className="absolute w-32 h-32 object-contain pointer-events-none select-none"
                    style={{ opacity: 0.12 }}
                    draggable={false}
                  />
                  <p className="relative z-10 font-display font-bold text-white text-center text-lg leading-snug max-w-[22ch]">
                    {e}
                  </p>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sectors ─────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-44 border-t border-white/10">
        <RevealText className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-secondary text-sm mb-3">Qui sont nos clients&nbsp;?</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight mb-10">
              Secteurs d'activité
            </h2>
            <p className="font-body text-secondary text-sm leading-relaxed">
              ENGINEERING STUDIO intervient en Algérie et est spécialisé dans les études techniques d'ingénierie (réseaux extérieurs et réseaux intérieurs), également missionné pour des travaux topographiques.
              <br />
              Nos clients proviennent de secteurs d'activité très variés.
              <br />
              Cette diversité est une richesse qui nécessite une capacité d'adaptabilité et nous permet sans cesse de repousser nos limites.
            </p>
          </div>
          <div className="flex flex-col gap-1 lg:pt-4">
            {sectors.map(s => (
              <p key={s} className="font-display font-medium text-white text-xl sm:text-2xl leading-relaxed">
                {s}
              </p>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Client examples intro ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-44 border-t border-white/10">
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealText>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.6rem] text-white leading-tight lg:leading-tight">
              Voici quelques exemples de clients avec lesquels nous avons eu le plaisir de collaborer
            </h2>
          </RevealText>
          <Reveal direction="right">
            <div ref={midRef} className="flex items-center justify-center">
              <motion.div
                style={{ y: midLogoY, width: 'min(55vw, 300px)', height: 'min(55vw, 300px)' }}
                className="rounded-full overflow-hidden border border-white/10 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/Assets/images/Clients-Clients.png"
                  alt="Nos clients"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Client cards ────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-44 border-t border-white/10">
        <div className="max-w-content mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {clients.map((c, i) => (
            <RevealText key={`${c.name}-${c.name2}-${i}`} delay={Math.min(i % 5, 4) * 0.08}>
              <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#111111] p-6 flex flex-col justify-between hover:opacity-80 transition-opacity">
                <p className="relative z-10 font-display font-bold text-white text-sm leading-tight">
                  {c.name}
                  <br />
                  {c.name2}
                </p>
                <p className="relative z-10 font-body text-secondary text-xs">{c.category}</p>
                <span
                  aria-hidden
                  className="absolute -right-2 -bottom-3 font-display font-bold text-white/[0.06] text-7xl leading-none select-none"
                >
                  {c.number}
                </span>
              </div>
            </RevealText>
          ))}
        </div>
      </section>

      {/* ── Thank you ───────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-52 bg-surface text-center">
        <RevealText className="max-w-content mx-auto flex flex-col items-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-[28ch] mx-auto mb-8">
            Un grand merci à tous nos clients pour leur fidélité et leur confiance
          </h2>
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[70ch] mx-auto mb-12">
            Nous tenons à remercier tous nos nouveaux clients qui nous ont confié la réalisation de leurs projets, ainsi que tous les clients qui sont fidèles aux ENGINEERING STUDIO depuis de nombreuses années.
          </p>
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="w-[72px] h-[72px] object-contain select-none"
            draggable={false}
          />
        </RevealText>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="pl-6 sm:pl-10 lg:pl-20 py-44 border-t border-white/10 overflow-hidden">
        <RevealText>
          <p className="font-body text-secondary text-sm mb-2">Témoignages</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-14">
            Écoutez ce que nos clients ont à dire
          </h2>
        </RevealText>
        <div className="flex gap-6 overflow-x-auto pb-4 pr-6 sm:pr-10 lg:pr-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} direction="right" delay={i * 0.12} className="flex-shrink-0">
              <div className="w-[300px] md:w-[340px] h-full bg-[#1a1a1a] rounded-2xl p-8 flex flex-col gap-6 hover:opacity-80 transition-opacity">
                <img
                  src="/Assets/logo/Logo-seul.png"
                  alt=""
                  className="w-6 h-6 object-contain select-none"
                  draggable={false}
                />
                <p className="font-body text-secondary text-sm leading-relaxed flex-1">{t.text}</p>
                <div>
                  <p className="font-display font-bold text-white text-sm leading-tight">
                    {t.name}
                    <br />
                    {t.name2}
                  </p>
                  <p className="font-body text-secondary text-xs mt-1">{t.category}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
