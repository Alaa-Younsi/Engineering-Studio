import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { Reveal, RevealText } from '../components/Reveal'

const sectors = [
  'Bureaux d\'études pluridisciplinaires',
  'Entreprises de réalisation et de construction',
  'Promoteurs immobiliers',
  'Architectes et bureaux d\'ingénierie',
  'Collectivités locales et organismes publics',
  'Industrie et structures hospitalières',
]

const engagements = [
  { title: 'Écoute active', desc: 'Nous accordons une attention particulière aux besoins spécifiques de chaque client pour proposer les solutions les plus adaptées.' },
  { title: 'Réactivité', desc: 'Nous adaptons d\'option notre planning à vos urgences et contraintes pour respecter les délais du projet.' },
  { title: 'Tout accompagner', desc: 'Notre présence à chaque phase du projet garantit une coordination fluide et une continuité du suivi technique.' },
  { title: 'Toujours disponibles', desc: 'Un interlocuteur dédié et joignable tout au long du projet pour répondre à toutes vos questions.' },
]

const clients = [
  ['Saïdani & Associés', 'Bureau d\'études'], ['Groupe COSIDER', 'Construction'], ['ETRHB Haddad', 'BTP'],
  ['Sonatrach', 'Énergie'], ['Ramdane Architecture', 'Architecture'], ['Batimetal', 'Industrie'],
  ['CNEP-Banque', 'Finance'], ['Groupe Khalifa', 'Immobilier'], ['Algérie Télécom', 'Télécoms'],
  ['EPE Saidal', 'Pharmacie'], ['Air Algérie', 'Aérien'], ['SNVI', 'Industrie'],
  ['Cevital', 'Agroalimentaire'], ['Tahkout Manufacturing', 'Industrie'], ['Madar Holding', 'Immobilier'],
  ['BCI Algérie', 'Construction'], ['Société Générale Algérie', 'Finance'], ['Sonelgaz', 'Énergie'],
  ['ENGOA', 'Infrastructure'], ['Hydro-Aménagement', 'VRD'], ['Grand Oran', 'Collectivité'],
  ['SEAAL', 'Services'], ['AADL', 'Logement'], ['Fonds de Promotion du Logement', 'Logement'],
  ['Résidences Prima', 'Immobilier'], ['Crédit Populaire d\'Algérie', 'Finance'], ['SNTA', 'Industrie'],
  ['Biopharm', 'Pharmacie'], ['SPA Maison Blanche', 'Hôtellerie'], ['BNA', 'Finance'],
]

const testimonials = [
  {
    name: 'Kamel Ramdane',
    role: 'Directeur technique, Groupe COSIDER',
    text: 'Engineering Studio a su répondre à nos exigences les plus pointues. Leur maîtrise du BIM et leur réactivité ont été déterminantes dans la réussite de notre projet.',
  },
  {
    name: 'Nadia Benali',
    role: 'Architecte, Bureau Ramdane',
    text: 'Un partenaire de confiance avec une expertise réelle en MEP. Leurs plans sont précis, leurs délais tenus et leur équipe toujours disponible. Je les recommande vivement.',
  },
  {
    name: 'Sofiane Hadj',
    role: 'Chef de projet, Madar Holding',
    text: 'Nous avons confié plusieurs projets résidentiels à Engineering Studio. Leur coordination VRD/MEP/BIM est irréprochable et leur sens du service client est exemplaire.',
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
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none">
            Clients
          </h1>
        </div>
        <div
          className="absolute -right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'clamp(200px, 52vw, 540px)', height: 'clamp(200px, 52vw, 540px)' }}
        >
          <motion.div style={{ y: heroLogoY }} className="w-full h-full">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* ── Intro ───────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Nos clients</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-white leading-tight">
              Découvrez nos clients et comment nous collaborons avec eux
            </h2>
            <div className="mt-8">
              <LogoButton onClick={() => nav('/contact')}>Travaillons ensemble</LogoButton>
            </div>
          </div>
          <div>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Nous travaillons avec des maîtres d'ouvrage publics et privés, des architectes, des promoteurs immobiliers et des entreprises de construction à travers toute l'Algérie. Notre approche collaborative et notre adaptabilité font de nous un partenaire de choix pour tout type de projet.
            </p>
          </div>
        </RevealText>
      </section>

      {/* ── Mission statement ───────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 bg-surface">
        <RevealText className="max-w-screen-xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-[32ch] mx-auto">
            Des missions variées et des solutions adaptées à chaque client
          </h2>
          <p className="font-body text-secondary text-sm mt-6 max-w-[50ch] mx-auto leading-relaxed">
            Chaque projet est unique. Nous adaptons notre approche, nos outils et notre équipe pour répondre précisément à vos besoins et contraintes spécifiques.
          </p>
        </RevealText>
      </section>

      {/* ── Engagement ──────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-14">
            Notre engagement envers nos clients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {engagements.map(e => (
              <div key={e.title} className="flex flex-col gap-3 border-t border-white/10 pt-6 hover:opacity-70 transition-opacity">
                <h3 className="font-display font-bold text-lg text-white">{e.title}</h3>
                <p className="font-body text-secondary text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Sectors ─────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-secondary text-xs tracking-widest uppercase mb-3">Domaines d'intervention</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              Secteurs d'activité
            </h2>
          </div>
          <div className="flex flex-col gap-0">
            {sectors.map((s, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-white/10 hover:opacity-70 transition-opacity">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                <p className="font-body text-white text-sm">{s}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Client examples intro ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealText>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.6rem] text-white leading-tight">
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

      {/* ── Client grid ─────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 pb-20 border-t border-white/10 pt-12">
        <RevealText className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-white/10">
            {clients.map(([name, type]) => (
              <div key={name} className="bg-bg px-5 py-6 flex flex-col gap-1 hover:opacity-60 transition-opacity">
                <p className="font-display font-semibold text-white text-xs leading-snug">{name}</p>
                <p className="font-body text-secondary text-[10px]">{type}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Thank you ───────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-24 bg-surface text-center">
        <RevealText className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-[28ch] mx-auto mb-8">
            Un grand merci à tous nos clients pour leur fidélité et leur confiance
          </h2>
          <LogoButton onClick={() => nav('/contact')}>Rejoignez-nous</LogoButton>
        </RevealText>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-14">
            Écoutez ce que nos clients ont à dire
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface rounded-2xl p-8 flex flex-col gap-5 hover:opacity-80 transition-opacity">
                <p className="font-body text-white text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="border-t border-white/10 pt-5">
                  <p className="font-display font-semibold text-white text-sm">{t.name}</p>
                  <p className="font-body text-secondary text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      <Footer />
    </main>
  )
}
