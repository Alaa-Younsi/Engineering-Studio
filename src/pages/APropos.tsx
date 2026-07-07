import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'
import { RevealText } from '../components/Reveal'

const softwareItems = [
  { name: 'Sogelink Mensura',                category: 'VRD, Infrastructures' },
  { name: 'Sogelink Covadis',                category: 'VRD, Infrastructures' },
  { name: 'Sogelink Autopiste',              category: 'Travaux publics' },
  { name: 'Bentley WaterCAD',                category: 'Alimentation en eau potable' },
  { name: 'Bentley SewerCAD',                category: 'Assainissement' },
  { name: 'Esri ArcGIS',                     category: 'SIG' },
  { name: 'Global Mapper',                   category: 'SIG' },
  { name: 'Caneco BT',                       category: 'Electricité CFO' },
  { name: 'Caneco EP',                       category: 'Eclairage public' },
  { name: 'Caneco IMP',                      category: 'Electricité CFO' },
  { name: 'Caneco HT',                       category: 'Electricité CFO' },
  { name: 'PVsyst',                          category: 'Photovoltaïque' },
  { name: 'Dialux EVO',                      category: 'Eclairage' },
  { name: 'Relux',                           category: 'Eclairage' },
  { name: 'Legrand XLPRO',                   category: 'Electricité CFO' },
  { name: 'Autodesk AutoCAD',                category: 'DAO, 2D/3D' },
  { name: 'Autodesk Revit',                  category: 'MEP, Architecture' },
  { name: 'Autodesk AutoCAD MEP',            category: 'MEP' },
  { name: 'Autodesk Navisworks',             category: 'Révision 3D/BIM' },
  { name: 'Autodesk Civil 3D',               category: 'VRD, Infrastructures' },
  { name: 'Autodesk Infraworks',             category: 'VRD, Infrastructures' },
  { name: 'Autodesk Robot Structural Analysis', category: 'Structure' },
  { name: 'Cypecad MEP',                     category: 'MEP, Bilan thermique' },
  { name: 'Cype HVAC',                       category: 'MEP' },
  { name: 'Cype PLUMBING',                   category: 'Plomberie, Evacuation' },
  { name: 'Cype FIRE Hydraulic Systems',     category: 'Anti-incendie' },
  { name: 'Cype Thermloads',                 category: 'Bilan thermique' },
  { name: 'Cype ELEC',                       category: 'Electricité CFO' },
  { name: 'Cype LUX',                        category: 'Eclairage' },
  { name: 'Traceo Autofluid',                category: 'MEP' },
  { name: 'Cype HVAC Schematics',            category: 'Schémas de principe' },
  { name: 'Cype HVAC Radiant floor',         category: 'Plancher chauffant' },
  { name: 'Open BIM MIDEA',                  category: 'Système VRF, Aérothermie' },
  { name: 'Open BIM DAIKIN',                 category: 'Système VRF, Aérothermie' },
  { name: 'Cype ELEC PV Systems',            category: 'Photovoltaïque' },
  { name: 'Eplan Electric',                  category: 'Electricité CFO' },
  { name: 'Open BIM Switchboard',            category: 'Tableaux électriques' },
  { name: 'Cype TEL Wireless',               category: 'Réseaux sans fil' },
  { name: 'Fine GEO 5',                      category: 'Géotechnique' },
  { name: 'Tekla Structure',                 category: 'Structure' },
  { name: 'ArchiCAD',                        category: 'Architecture' },
  { name: 'Lumion',                          category: 'Rendus 3D' },
  { name: 'Twinmotion',                      category: 'Rendus 3D' },
  { name: 'Microsoft Project',               category: 'Gestion de projets' },
]

const strengths = ['Réactivité', 'Expertise', 'Expérience', 'Professionnalisme', 'Compétences']

const radialItems = [
  { label: ["Fluidité", "d'informations"], tx: 600, ty: 44,  anchor: 'middle' as const },
  { label: ['Respect',  'des délais'],     tx: 818, ty: 180, anchor: 'start'  as const },
  { label: ['Précision'],                  tx: 818, ty: 415, anchor: 'start'  as const },
  { label: ['Professionnalisme'],          tx: 600, ty: 556, anchor: 'middle' as const },
  { label: ['Écoute'],                     tx: 382, ty: 415, anchor: 'end'    as const },
  { label: ["Rapidité", "d'exécution"],   tx: 382, ty: 180, anchor: 'end'    as const },
]

const arcPaths = [
  'M 649 117 A 170 170 0 0 1 734 166',
  'M 784 251 A 170 170 0 0 1 784 349',
  'M 734 434 A 170 170 0 0 1 649 483',
  'M 551 483 A 170 170 0 0 1 466 434',
  'M 416 349 A 170 170 0 0 1 416 251',
  'M 466 166 A 170 170 0 0 1 551 117',
]

export default function APropos() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const heroRef    = useRef<HTMLElement>(null)
  const featureRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroProgress }    = useScroll({ target: heroRef,    offset: ['start start', 'end start'] })
  const { scrollYProgress: featureProgress } = useScroll({ target: featureRef, offset: ['start end',   'end start'] })

  const heroLogoY    = useTransform(heroProgress,    [0, 1], ['0px', '-120px'])
  const featureLogoY = useTransform(featureProgress, [0, 1], ['60px', '-60px'])

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none">
            À propos
          </h1>
        </div>
        <div
          className="absolute -right-[4%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'clamp(170px, 40vw, 460px)', height: 'clamp(170px, 40vw, 460px)' }}
        >
          <motion.div style={{ y: heroLogoY }} className="w-full h-full">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.18 }} draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-32 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Solutions globale en ingénierie</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-14">
              Etudes techniques<br />pluridisciplinaire
            </h2>
            <div className="grid grid-cols-3 gap-8 sm:gap-12 max-w-lg">
              {[['120+', 'Études totales'], ['60+', 'Clients Totales'], ['13+', "Années d'expérience"]].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display font-bold text-4xl sm:text-5xl text-white leading-none mb-1">{num}</p>
                  <p className="font-body text-secondary text-xs leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:pt-10">
            <p className="font-body text-secondary text-sm leading-relaxed">
              ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les domaines d'ingénieries du CVC/MEP/CET et VRD, actif dans la transition vers l'ère du BIM.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Nous intervenons tant en conception qu'en dimensionnement, sur les ouvrages neufs ou réhabilités.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Nous répartissons notre activité entre les bâtiments d'habitation, les bâtiments fonctionnels, les bâtiments industriels mais aussi les ouvrages d'art, les infrastructures, les voiries et les aménagements extérieurs.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed">
              Forts d'expériences significatives, Nous vous accompagnons tout au long de vos projets et offrent des prestations conduites par le triax Coût – Délai – Qualité.
            </p>
          </div>
        </RevealText>
      </section>

      {/* ── Études clé en main ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-32 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Etudes<br />clé en main
          </h2>
          <div className="max-w-[40ch]">
            <p className="font-body text-secondary text-sm leading-relaxed mb-6">
              Notre objectif est de maintenir le plus haut niveau de professionnalisme, d'intégrité, de satisfaction client.
            </p>
            <p className="font-body text-secondary text-sm leading-relaxed mb-8">
              Notre offre clé en main permet au client de n'avoir qu'un seul interlocuteur vers qui se tourner. Nous nous engageons sur un contrat de résultat.
            </p>
            <LogoButton onClick={() => nav('/devis')} />
          </div>
        </RevealText>
      </section>

      {/* ── Services — circle+number ──────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-32 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto">
          <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Présentation</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-[38ch] mb-8">
            Nous fournissons à nos clients un large éventail de compétences pour assurer la prestation d'ingénierie la plus exhaustive
          </h2>
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[80ch] mb-20">
            La synergie entre les différentes expertises permet de maximiser les résultats en combinant les forces de nos équipes d'ingénieurs, en évitant les doublons d'efforts et en tirant parti des complémentarités.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { num: '01', title: 'MEP' },
              { num: '02', title: 'VRD' },
              { num: '03', title: 'Topographie' },
              { num: '04', title: 'BIM' },
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center gap-5 hover:opacity-70 transition-opacity">
                <div className="relative w-24 h-24 rounded-full bg-surface overflow-hidden flex-shrink-0">
                  <img src="/Assets/logo/Logo-seul.png" alt="" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 0.35 }} draggable={false} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-4xl text-white leading-none">{s.num}</span>
                  </div>
                </div>
                <p className="font-display font-bold text-white text-center text-sm sm:text-base">{s.title}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── BIM highlight ─────────────────────────────────────────────────── */}
      <section className="bg-surface px-6 sm:px-10 lg:px-20 py-36">
        <RevealText className="max-w-screen-xl mx-auto flex flex-col items-center text-center gap-8">
          <p className="font-body text-secondary text-xs tracking-widest uppercase">Pour mieux construire</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-[22ch]">
            Boostez vos projets avec le BIM &amp; BTP numérique
          </h2>
          <LogoButton variant="pill" onClick={() => nav('/contact')}>Contactez-nous</LogoButton>
        </RevealText>
      </section>

      {/* ── BIM expertise ─────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-32 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto">
          <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">La modélisation BIM au cœur de nos projets</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-white leading-tight max-w-[30ch] mb-8">
            Modélisation BIM : réalisez vos ouvrages en 3D grâce à notre expertise
          </h2>
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[90ch] mb-16">
            Les projets en modélisation BIM sont devenus une habitude au cœur de notre société. Cette transformation numérique qui concerne un acteur sur deux dans l'univers du bâtiment est une compétence acquise. Tout comme nous développons la E-réputation de notre société d'études, la modélisation du bâtiment via est une discipline que nous maîtrisons. A vrai dire, elle est devenue indispensable pour répondre aux besoins de nos clients.
          </p>
          <div className="flex flex-wrap gap-x-16 gap-y-6">
            {['Logiciel Revit', 'Maquette BIM', 'Processus CAO', 'Plan en 2D et 3D'].map(name => (
              <span key={name} className="font-display font-bold text-white text-base">
                {name}
              </span>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Process — circle+number ───────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-40 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Comment se déroule<br />le processus d'étude
          </h2>
          <p className="font-body text-secondary text-sm mb-16">
            Nos prestations d'études sur l'ensemble des techniques de construction
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 max-w-3xl mx-auto">
            {[
              { num: '01', title: 'Planification\ndu projet' },
              { num: '02', title: 'Préparation\ndu plan' },
              { num: '03', title: 'Installation\ndu système' },
              { num: '04', title: 'Remise\nau client' },
            ].map(p => (
              <div key={p.num} className="flex flex-col items-center gap-4 hover:opacity-70 transition-opacity">
                <div className="relative w-16 h-16 rounded-full bg-surface overflow-hidden flex-shrink-0">
                  <img src="/Assets/logo/Logo-seul.png" alt="" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 0.35 }} draggable={false} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-white leading-none">{p.num}</span>
                  </div>
                </div>
                <p className="font-display font-bold text-white text-center text-xs sm:text-sm whitespace-pre-line">{p.title}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Prêts à travailler — centered circle CTA ─────────────────────── */}
      <section ref={featureRef} className="relative bg-bg min-h-screen flex items-center justify-center overflow-hidden py-32">
        {/* Circle — centered background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.div style={{ y: featureLogoY }}>
            <img
              src="/Assets/logo/Logo-seul.png"
              alt=""
              className="w-[min(90vw,780px)] h-[min(90vw,780px)] object-contain"
              style={{ opacity: 0.4 }}
              draggable={false}
            />
          </motion.div>
        </div>
        {/* Content */}
        <RevealText className="relative z-10 flex flex-col items-center text-center px-6 gap-6 max-w-2xl">
          <p className="font-body text-white text-xs tracking-widest uppercase">
            Prêts à travailler ensemble
          </p>
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-none">
            Engineering Studio
          </h2>
          <p className="font-body text-white/75 text-sm max-w-[50ch] leading-relaxed">
            Que vous ayez un projet et que vous recherchiez un partenaire d'étude technique fiable ou que vous souhaitiez franchir une nouvelle étape dans votre projet, nous voulons vous entendre !
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mt-4">
            <button onClick={() => nav('/contact')} className="font-body text-white text-sm hover:opacity-60 transition-opacity">
              Donnons vie à votre projet
            </button>
            <LogoButton onClick={() => nav('/contact')} />
            <button onClick={() => nav('/contact')} className="font-body text-white text-sm hover:opacity-60 transition-opacity">
              Appelez pour un rendez-vous
            </button>
          </div>
        </RevealText>
      </section>

      {/* ── Points forts — overlapping circles ───────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <RevealText className="text-center px-6 sm:px-10 lg:px-20 mb-20">
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-8">Nos points forts</h2>
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[80ch] mx-auto">
            Notre connaissance des contraintes des chargés d'affaires, maîtres d'œuvre et bureaux d'études nous permet d'être réactifs et efficaces pour satisfaire au mieux à vos attentes. Quelles que soient vos exigences, vous pouvez faire appel à ENGINEERING STUDIO pour vous aider à réussir vos projets les plus complexes. Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.
          </p>
        </RevealText>

        {/* Mobile: wrapped circle grid */}
        <RevealText className="lg:hidden flex flex-wrap justify-center gap-4 px-6">
          {strengths.map((s) => (
            <div
              key={s}
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-white/20 bg-bg flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <span className="font-display font-medium text-white text-xs text-center leading-tight px-3">{s}</span>
            </div>
          ))}
        </RevealText>

        {/* Desktop: overlapping circles row */}
        <RevealText className="hidden lg:flex justify-center">
          <div className="flex items-center">
            {strengths.map((s, i) => (
              <div
                key={s}
                className="w-[220px] h-[220px] rounded-full border border-white/20 bg-bg flex items-center justify-center flex-shrink-0 hover:opacity-70 transition-opacity"
                style={{ marginLeft: i === 0 ? 0 : '-50px' }}
              >
                <span className="font-display font-medium text-white text-xs text-center leading-tight px-4">{s}</span>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Software — card grid ──────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 sm:px-10 lg:px-20 py-32">
        <RevealText className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white text-left leading-snug max-w-[32ch] ml-auto mb-16">
            Utilisés les logiciels d'ingénierie couvrent la conception, calculs, simulation et la gestion de projets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {softwareItems.map(sw => (
              <div key={`${sw.name}-${sw.category}`} className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-8 hover:opacity-70 transition-opacity">
                <p className="font-display font-bold text-white text-base leading-snug">{sw.name}</p>
                <p className="font-body text-secondary text-xs">{sw.category}</p>
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── Nos garanties — radial wheel ─────────────────────────────────── */}
      <section className="border-t border-white/10 py-16">

        {/* Mobile */}
        <RevealText className="lg:hidden px-6 sm:px-10 py-16">
          <h2 className="font-display font-bold text-4xl text-white mb-10 text-center">Nos garanties</h2>
          <div className="grid grid-cols-2 gap-3">
            {radialItems.map((g, i) => (
              <div key={i} className="border border-white/10 rounded-2xl p-5 hover:opacity-70 transition-opacity">
                <p className="font-display font-medium text-white text-sm">{g.label.join(' ')}</p>
              </div>
            ))}
          </div>
        </RevealText>

        {/* Desktop: SVG radial diagram */}
        <RevealText className="hidden lg:block relative w-full">
          <div style={{ paddingBottom: '50%' }}>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(255,255,255,0.5)" />
              </marker>
            </defs>
            <text x="600" y="290" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="72" fontFamily="Bossa, sans-serif" fontWeight="700">
              Nos garanties
            </text>
            {arcPaths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
            ))}
            {radialItems.map((item, idx) =>
              item.label.map((line, li) => (
                <text
                  key={`${idx}-${li}`}
                  x={item.tx}
                  y={item.ty + li * 20 - (item.label.length - 1) * 10}
                  textAnchor={item.anchor}
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="15"
                  fontFamily="Bossa, sans-serif"
                  fontWeight="500"
                >
                  {line}
                </text>
              ))
            )}
          </svg>
          </div>
        </RevealText>
      </section>

      <Footer />
    </main>
  )
}
