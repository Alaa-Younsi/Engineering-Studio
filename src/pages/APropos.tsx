import { useCallback, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from '../components/LogoButton'
import { Footer } from '../components/Footer'

const softwareGroups = [
  { category: 'Conception',           items: ['Autodesk Revit', 'AutoCAD', 'ArchiCAD', 'SketchUp Pro', 'Rhinoceros 3D', '3DS Max'] },
  { category: 'Calculs structurels',  items: ['Robot Structural', 'ETABS', 'SAP2000', 'CYPECAD', 'RFEM', 'PLAXIS'] },
  { category: 'Simulation',           items: ['DIALux EVO', 'DesignBuilder', 'EnergyPlus', 'Ansys Fluent', 'OpenStudio', 'IDA ICE'] },
  { category: 'Gestion de projets',   items: ['BIM 360', 'Navisworks', 'MS Project', 'Primavera P6', 'BIMcollab', 'Procore'] },
  { category: 'Topographie',          items: ['AutoCAD Civil 3D', 'Trimble Business Center', 'QGIS', 'ArcGIS', 'Leica Geo Office', 'SurvCE'] },
  { category: 'VRD & Hydraulique',    items: ['EPANET', 'SWMM', 'HEC-RAS', 'WaterGEMS', 'SewerGEMS', 'COVADIS'] },
  { category: 'Électricité',          items: ['CANECO BT', 'ELEC CALC', 'AutoCAD Electrical', 'DIALux', 'ETAP', 'COMECA'] },
  { category: 'Thermique & Énergie',  items: ['EnergyPlus', 'TRNSYS', 'IDA ICE', 'ThermExcel', 'Pleiades', 'OpenStudio'] },
]

const strengths = ['Réactivité', 'Expertise', 'Expérience', 'Professionnalisme', 'Compétences']

// Radial diagram: viewBox 1200×600, centre (600, 300)
// Items at R=230, arc endpoints at R=190 (inside items), arc radius=170
// sweep=1 (CW) gives outward-bowing arcs, matching the screenshot
const radialItems = [
  { label: ["Fluidité", "d'informations"], tx: 600, ty: 44,  anchor: 'middle' as const },
  { label: ['Respect',  'des délais'],     tx: 818, ty: 180, anchor: 'start'  as const },
  { label: ['Précision'],                  tx: 818, ty: 415, anchor: 'start'  as const },
  { label: ['Professionnalisme'],          tx: 600, ty: 556, anchor: 'middle' as const },
  { label: ['Écoute'],                     tx: 382, ty: 415, anchor: 'end'    as const },
  { label: ["Rapidité", "d'exécution"],   tx: 382, ty: 180, anchor: 'end'    as const },
]

// Arc endpoint pairs (15° gap on each end), centre (600,300), R_ep=190
// 285°→315°, 345°→15°, 45°→75°, 105°→135°, 165°→195°, 225°→255°
const arcPaths = [
  'M 649 117 A 170 170 0 0 1 734 166',  // top → top-right
  'M 784 251 A 170 170 0 0 1 784 349',  // top-right → bottom-right
  'M 734 434 A 170 170 0 0 1 649 483',  // bottom-right → bottom
  'M 551 483 A 170 170 0 0 1 466 434',  // bottom → bottom-left
  'M 416 349 A 170 170 0 0 1 416 251',  // bottom-left → top-left
  'M 466 166 A 170 170 0 0 1 551 117',  // top-left → top
]

export default function APropos() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const heroRef    = useRef<HTMLElement>(null)
  const featureRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroProgress }    = useScroll({ target: heroRef,    offset: ['start start', 'end start'] })
  const { scrollYProgress: featureProgress } = useScroll({ target: featureRef, offset: ['start end',   'end start'] })

  const heroLogoY    = useTransform(heroProgress,    [0, 1], ['0px', '-80px'])
  const featureLogoY = useTransform(featureProgress, [0, 1], ['40px', '-40px'])

  const softwareCards = softwareGroups.flatMap(g => g.items.map(name => ({ name, category: g.category })))

  return (
    <main className="min-h-screen bg-bg pt-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-white leading-none">
            À propos
          </h1>
        </div>
        <motion.div
          style={{ y: heroLogoY, width: 'min(56vw, 56vh)', height: 'min(56vw, 56vh)' }}
          className="absolute -right-[6%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        >
          <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Solutions globale en ingénierie</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-12">
              Etudes techniques<br />pluridisciplinaire
            </h2>
            <div className="grid grid-cols-3 gap-8 max-w-sm">
              {[['120+', 'Études totales'], ['60+', 'Clients Totales'], ['13+', "Années d'expérience"]].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display font-bold text-4xl sm:text-5xl text-white leading-none mb-1">{num}</p>
                  <p className="font-body text-secondary text-xs leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:pt-10">
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
        </div>
      </section>

      {/* ── Études clé en main ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Études clé en main
          </h2>
          <div className="max-w-[40ch]">
            <p className="font-body text-secondary text-sm leading-relaxed mb-6">
              De l'avant-projet jusqu'à la réception des travaux, nous assurons un suivi rigoureux et une coordination complète de l'ensemble des disciplines techniques.
            </p>
            <LogoButton onClick={() => nav('/devis')}>Obtenir un devis</LogoButton>
          </div>
        </div>
      </section>

      {/* ── Services — circle+number ──────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[60ch] mb-16">
            Nous fournissons à nos clients un large éventail de compétences pour assurer la prestation d'ingénierie la plus exhaustive et la mieux adaptée à leurs projets.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { num: '01', title: 'Installations MEP' },
              { num: '02', title: 'VRD & Aménagement' },
              { num: '03', title: 'Topographie' },
              { num: '04', title: 'Modélisation BIM' },
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20 rounded-full bg-surface overflow-hidden flex-shrink-0">
                  <img
                    src="/Assets/logo/Logo-seul.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: 0.35 }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-4xl text-white leading-none">{s.num}</span>
                  </div>
                </div>
                <p className="font-display font-bold text-white text-center text-sm sm:text-base">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIM highlight ─────────────────────────────────────────────────── */}
      <section className="bg-surface px-6 sm:px-10 lg:px-20 py-24">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-body text-secondary text-xs tracking-widest uppercase mb-6">Notre expertise digitale</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-[22ch]">
            Boostez vos projets avec le BIM &amp; BTP numérique
          </h2>
        </div>
      </section>

      {/* ── BIM expertise ─────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.8rem] text-white leading-tight max-w-[30ch] mb-14">
            Modélisation BIM : réalisez vos ouvrages en 3D grâce à notre expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Autodesk', 'Revit', 'Navisworks', 'BIM 360', 'AutoCAD', 'Civil 3D', 'Infraworks'].map(name => (
              <span key={name} className="font-body text-sm text-secondary border border-white/10 rounded-full px-4 py-1.5 hover:border-white/30 hover:text-white transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — circle+number ───────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-24 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-5">
            Comment se déroule<br />le processus d'étude
          </h2>
          <p className="font-body text-secondary text-sm mb-20">
            Nos prestations d'études sur l'ensemble des techniques de construction
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { num: '01', title: 'Planification\ndu projet' },
              { num: '02', title: 'Préparation\ndu plan' },
              { num: '03', title: 'Installation\ndu système' },
              { num: '04', title: 'Remise\nau client' },
            ].map(p => (
              <div key={p.num} className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20 rounded-full bg-surface overflow-hidden flex-shrink-0">
                  <img
                    src="/Assets/logo/Logo-seul.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: 0.35 }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-4xl text-white leading-none">{p.num}</span>
                  </div>
                </div>
                <p className="font-display font-bold text-white text-center text-sm sm:text-base whitespace-pre-line">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prêts à travailler — centered circle CTA ─────────────────────── */}
      <section ref={featureRef} className="relative bg-bg min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        {/* Circle — centered background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.div style={{ y: featureLogoY }}>
            <img
              src="/Assets/logo/Logo-seul.png"
              alt=""
              className="w-[min(88vw,720px)] h-[min(88vw,720px)] object-contain"
              style={{ opacity: 0.35 }}
              draggable={false}
            />
          </motion.div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 max-w-2xl">
          <p className="font-body text-secondary text-xs tracking-widest uppercase">
            Prêts à travailler ensemble
          </p>
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-none">
            Engineering Studio
          </h2>
          <p className="font-body text-secondary text-sm max-w-[50ch] leading-relaxed">
            Que vous ayez un projet et que vous recherchiez un partenaire d'étude technique fiable ou que vous souhaitiez franchir une nouvelle étape dans votre projet, nous voulons vous entendre !
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mt-2">
            <button onClick={() => nav('/contact')} className="font-body text-white text-sm hover:opacity-60 transition-opacity">
              Donnons vie à votre projet
            </button>
            <LogoButton onClick={() => nav('/contact')} />
            <button onClick={() => nav('/contact')} className="font-body text-white text-sm hover:opacity-60 transition-opacity">
              Appelez pour un rendez-vous
            </button>
          </div>
        </div>
      </section>

      {/* ── Points forts — overlapping circles ───────────────────────────── */}
      <section className="py-24 border-t border-white/10">
        <div className="text-center px-6 sm:px-10 lg:px-20 mb-16">
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">Nos points forts</h2>
          <p className="font-body text-secondary text-sm leading-relaxed max-w-[80ch] mx-auto">
            Notre connaissance des contraintes des chargés d'affaires, maîtres d'œuvre et bureaux d'études nous permet d'être réactifs et efficaces pour satisfaire au mieux à vos attentes. Quelles que soient vos exigences, vous pouvez faire appel à ENGINEERING STUDIO pour vous aider à réussir vos projets les plus complexes. Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.
          </p>
        </div>

        {/* Mobile: wrapped circle grid */}
        <div className="lg:hidden flex flex-wrap justify-center gap-4 px-6">
          {strengths.map((s) => (
            <div
              key={s}
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-white/20 bg-bg flex items-center justify-center"
            >
              <span className="font-display font-medium text-white text-xs text-center leading-tight px-3">{s}</span>
            </div>
          ))}
        </div>

        {/* Desktop: overlapping circles row */}
        <div className="hidden lg:flex justify-center">
          <div className="flex items-center">
            {strengths.map((s, i) => (
              <div
                key={s}
                className="w-[220px] h-[220px] rounded-full border border-white/20 bg-bg flex items-center justify-center flex-shrink-0"
                style={{ marginLeft: i === 0 ? 0 : '-50px' }}
              >
                <span className="font-display font-medium text-white text-xs text-center leading-tight px-4">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Software — card grid ──────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 sm:px-10 lg:px-20 py-20">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white text-center leading-tight max-w-[28ch] mx-auto mb-12">
            Utilisés les logiciels d'ingénierie couvrent la conception, calculs, simulation et la gestion de projets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {softwareCards.map(sw => (
              <div key={`${sw.name}-${sw.category}`} className="bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-8">
                <p className="font-display font-bold text-white text-base leading-snug">{sw.name}</p>
                <p className="font-body text-secondary text-xs">{sw.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nos garanties — radial wheel ─────────────────────────────────── */}
      <section className="border-t border-white/10 py-8">

        {/* Mobile */}
        <div className="lg:hidden px-6 sm:px-10 py-12">
          <h2 className="font-display font-bold text-4xl text-white mb-8 text-center">Nos garanties</h2>
          <div className="grid grid-cols-2 gap-3">
            {radialItems.map((g, i) => (
              <div key={i} className="border border-white/10 rounded-2xl p-5">
                <p className="font-display font-medium text-white text-sm">{g.label.join(' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: SVG radial diagram — single SVG for exact alignment */}
        <div className="hidden lg:block relative w-full" style={{ paddingBottom: '50%' /* 600/1200 */ }}>
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

            {/* Center title */}
            <text x="600" y="290" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="72" fontFamily="Bossa, sans-serif" fontWeight="700">
              Nos garanties
            </text>

            {/* Arc paths */}
            {arcPaths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
            ))}

            {/* Item labels */}
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
      </section>

      <Footer />
    </main>
  )
}
