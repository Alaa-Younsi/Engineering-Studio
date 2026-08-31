import { useCallback, useState } from 'react'
import { Box, Frame, Txt } from '../design/canvas'
import { CircleButton, CircleImage, PillButton, Watermark } from '../components/site/atoms'
import { SiteFooter } from '../components/site/SiteFooter'
import { LogoWordmark } from '../brand/vectors'
import { useTransition } from '../context/TransitionContext'
import { useIsDesktop } from '../design/useIsDesktop'
import { BIM_KEYWORDS, DISCIPLINES, GUARANTEES, SOFTWARE, STEPS, STRENGTHS } from '../data/apropos'
import { AProposMobile } from './mobile/AProposMobile'
import { Rise } from '../design/Rise'
import { useSeo } from '../lib/useSeo'

/**
 * À propos — Figma frame 1920 x 16200.
 *
 *   496     hero title
 *   1417    "Solutions globale en ingénierie" + the long intro column
 *   1703    three stats
 *   2580    "Etudes clé en main"
 *   3514    "Présentation" + the four disciplines
 *   4720    "Boostez vos projets" call to action
 *   5741    BIM section + four keywords
 *   6820    "Comment se déroule le processus d'étude" — four steps
 *   7937    "Prêts à travailler ensemble" wordmark block
 *   8883    "Nos points forts" — five outlined circles
 *   9944    software photo + heading, then the 8x4 software grid
 *   14262   "Nos garanties" diagram
 *   15252   footer
 */
const CANVAS_H = 16200

export default function APropos() {
  useSeo({
    title: 'À propos — Bureau d’études en ingénierie | Engineering Studio',
    description:
      'Notre approche des études clé en main : disciplines couvertes, processus, points forts et garanties d’un bureau d’études pluridisciplinaire basé à Sétif.',
  })
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])
  const isDesktop = useIsDesktop()
  // Whether the centred call-to-action disc is open; the captions either
  // side clear out of its way while it is.
  const [ctaOpen, setCtaOpen] = useState(false)

  if (!isDesktop) return <AProposMobile nav={nav} />

  return (
    <Frame h={CANVAS_H}>
      <Watermark x={1067.4} y={168} size={744.6} />
      <Txt t="displayTight" x={215} y={496}>À propos</Txt>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={1427}>Solutions globale en ingénierie</Txt>
      <Txt t="h2" x={219} y={1462}>{'Etudes techniques\npluridisciplinaire'}</Txt>
      <Txt t="bodyLight" x={973} y={1426} dim>
        {`ENGINEERING STUDIO propose des études techniques pluridisciplinaire
présent dans les domaines d’ingénieries du CVC/MEP/CET et VRD,
actif dans la transition vers l’ère du BIM.

Nous intervenons tant en conception qu’en dimensionnement, sur les
ouvrages neufs ou réhabilités.

Nous répartissons notre activité entre les bâtiments d’habitation,
les bâtiments fonctionnels, les bâtiments industriels mais aussi
les ouvrages d’art, les infrastructures, les voiries et les aménagements
extérieurs.

Forts d’expériences significatives, Nous vous accompagnons tout au
long de vos projets et offrent des prestations conduites par
le triax Coût – Délai – Qualité.`}
      </Txt>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <Stat x={219} label={'Études\ntotales'} value="120+" />
      <Stat x={420} label={'Clients\nTotales'} value="60+" />
      <Stat x={619} label={"Années\nd'expérience"} value="13+" />

      {/* ── Etudes clé en main ────────────────────────────────────────────── */}
      <Box x={219} y={2580} w={1519} h={239}>
        <Txt t="h2" x={0} y={7}>{'Etudes\nclé en main'}</Txt>
        <Txt t="bodyLight" x={754} y={0} dim>
          {`Notre objectif est de maintenir le plus haut niveau de professionnalisme,
d'intégrité, de satisfaction client.

Notre offre clé en main permet au client de n'avoir qu'un seul
interlocuteur vers qui se tourner. Nous nous engageons sur
un contrat de résultat.`}
        </Txt>
        <CircleButton x={754} y={194} label="Nos prestations" onClick={() => nav('/prestations')} />
      </Box>

      {/* ── Présentation ──────────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={3514.8}>Présentation</Txt>
      <Txt t="h2" x={219} y={3549.8}>
        {`Nous fournissons à nos clients un large
éventail de compétences pour assurer la
prestation d'ingénierie la plus exhaustive`}
      </Txt>
      <Txt t="bodyLight" x={219} y={3813.8} dim>
        {`La synergie entre les différentes expertises permet de maximiser les résultats en combinant les forces de nos équipes d’ingénieurs,
en évitant les doublons d’efforts et en tirant parti des complémentarités.`}
      </Txt>
      {DISCIPLINES.map((d) => (
        <div key={d.n}>
          <Watermark x={d.ring} y={3903.8} size={141.4} />
          <Box x={d.box} y={3926} w={d.w} h={108}>
            <Txt t="stat" x={d.nx} y={0} align="center">{d.n}</Txt>
            <Txt t="leadMedium" x={d.lx} y={76} align="center" dim>{d.label}</Txt>
          </Box>
        </div>
      ))}

      {/* ── Boostez vos projets ───────────────────────────────────────────── */}
      <Txt t="leadLight" centerX y={4720} align="center">Pour mieux construire</Txt>
      <Txt t="h2" centerX y={4754.9} align="center">
        {/* Trailing space is in the design; it shifts this centred line 9px left. */}
        {'Boostez vos projets avec \nle BIM & BTP numérique'}
      </Txt>
      <PillButton x={875} y={4956} w={170} onClick={() => nav('/prestations/bim')}>
        Découvrir le BIM
      </PillButton>

      {/* ── Modélisation BIM ──────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={5741}>La modélisation BIM au cœur de nos projets</Txt>
      <Txt t="h2" x={219} y={5776}>
        {'Modélisation BIM : réalisez vos ouvrages\nen 3D grâce à notre expertise'}
      </Txt>
      <Txt t="bodyLight" x={219} y={5967} dim>
        {`Les projets en modélisation BIM sont devenus une habitude au cœur de notre société. Cette transformation numérique qui concerne un
acteur sur deux dans l’univers du bâtiment est une compétence acquise. Tout comme nous développons la E-réputation de notre société
d’études, la modélisation du bâtiment via est une discipline que nous maîtrisons. A vrai dire, elle est devenue indispensable pour répondre
aux besoins de nos clients.`}
      </Txt>
      {BIM_KEYWORDS.map((k) => (
        <Txt key={k.label} t="leadMedium" cx={k.cx} y={6114} align="center">{k.label}</Txt>
      ))}

      {/* ── Processus ─────────────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={6820.9} align="center">
        {"Comment se déroule\nle processus d'étude"}
      </Txt>
      <Txt t="bodyLight" centerX y={7011.9} align="center" dim>
        Nos prestations d'études sur l'ensemble des techniques de construction
      </Txt>
      {STEPS.map((s) => (
        <div key={s.n}>
          <Watermark x={s.ring} y={7075.9} size={141.4} />
          <Box x={s.box} y={7098.1} w={s.w} h={125}>
            <Txt t="stat" x={s.nx} y={0} align="center">{s.n}</Txt>
            <Txt t="leadMediumTight" x={0} y={73} align="center" dim>{s.label}</Txt>
          </Box>
        </div>
      ))}

      {/* ── Prêts à travailler ensemble ───────────────────────────────────── */}
      <Watermark x={471.9} y={7612.3} size={975.4} />
      <Txt t="lead" x={800} y={7937.8} align="center">Prêts à travailler ensemble</Txt>
      <Box x={553} y={7994.8} w={815} h={79.4}>
        <LogoWordmark style={{ width: '100%', height: '100%', color: '#fff' }} />
      </Box>
      <Txt t="bodyLight" x={532} y={8099.8} align="center" dim>
        {`Que vous ayez un projet et que vous recherchiez un partenaire d'étude technique
fiable ou que vous souhaitiez franchir une nouvelle étape dans votre projet,
nous voulons vous entendre !`}
      </Txt>
      {/*
       * The disc is flanked by copy on both sides, so it opens *through* them:
       * hovering it fades the two captions out and grows the pill from the
       * canvas centre, which is exactly where the disc already sits. At rest
       * the row is pixel-identical to the design.
       */}
      <Txt
        t="lead"
        x={591.1}
        y={8222.8}
        align="right"
        className="transition-opacity duration-300"
        style={{ opacity: ctaOpen ? 0 : 1 }}
      >
        Donnons vie à votre projet
      </Txt>
      <div onMouseEnter={() => setCtaOpen(true)} onMouseLeave={() => setCtaOpen(false)}>
        <CircleButton
          x={938}
          y={8215.8}
          centerExpand
          label="Prendre une réunion"
          onClick={() => nav('/reunion')}
        />
      </div>
      <Txt
        t="lead"
        x={1012}
        y={8222.8}
        className="transition-opacity duration-300"
        style={{ opacity: ctaOpen ? 0 : 1 }}
      >
        Appelez pour un rendez-vous
      </Txt>

      {/* ── Nos points forts ──────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={8883} align="center">Nos points forts</Txt>
      <Txt t="bodyLight" centerX y={9001} align="center" dim>
        {`Notre connaissance des contraintes des chargés d’affaires, maîtres d’œuvre et bureaux d’études nous permet d’être réactifs
et efficaces pour satisfaire au mieux à vos attentes. Quelles que soient vos exigences, vous pouvez faire
appel à ENGINEEING STUDIO pour vous aider à réussir vos projets les plus complexes.
Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.`}
      </Txt>
      {STRENGTHS.map((s, i) => (
        <Rise key={s.label} delay={i * 80}>
          <Box x={s.ring} y={9143} w={340} h={340} radius={170} border="#fff" opacity={0.2} />
          <Txt t="cardTitle" x={s.lx} y={9303} align="center">{s.label}</Txt>
        </Rise>
      ))}

      {/* ── Logiciels ─────────────────────────────────────────────────────── */}
      <Rise>
        <CircleImage x={217} y={9944} size={633} src="/Assets/images/A Propos-logiciels.png" alt="Logiciels d'ingénierie" />
      </Rise>
      <Txt t="h2" x={903} y={10078}>
        {`Utilisés les logiciels
d'ingénierie couvrent
la conception, calculs,
simulation et
la gestion de projets`}
      </Txt>
      {SOFTWARE.map((s, i) => (
        // Stagger across each row of five so a row arrives as a sweep.
        <Rise key={`${s.x}-${s.y}`} delay={(i % 5) * 70}>
          <SoftwareCard {...s} />
        </Rise>
      ))}

      {/* ── Nos garanties ─────────────────────────────────────────────────── */}
      <Box x={451.9} y={14262} w={984.9} h={644.9}>
        <img src="/Assets/images/svg/garanties-arrows.svg" alt="" className="h-full w-full" draggable={false} />
      </Box>
      <Txt t="h2" cx={962} y={14556}>Nos garanties</Txt>
      {GUARANTEES.map((g) => (
        <Txt key={g.label} t="garantie" cx={g.cx} y={g.y} align="center">{g.label}</Txt>
      ))}

      <SiteFooter y={15252} />
    </Frame>
  )
}

function Stat({ x, label, value }: { x: number; label: string; value: string }) {
  return (
    <>
      <Txt t="xsLight" x={x} y={1703} dim>{label}</Txt>
      <Txt t="stat" x={x} y={1755}>{value}</Txt>
    </>
  )
}

/** Figma: 291 x 238, radius 30, #1a1a1a — name at y 80, use at y 190. */
function SoftwareCard({ x, y, name, use }: { x: number; y: number; name: string; use: string }) {
  return (
    <Box x={x} y={y} w={291} h={238} bg="#1a1a1a" radius={30}>
      <Txt t="cardTitle" x={29} y={80}>{name}</Txt>
      <Txt t="cardMeta" x={29} y={190} opacity={0.5}>{use}</Txt>
    </Box>
  )
}
