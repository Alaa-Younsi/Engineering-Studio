import { useCallback } from 'react'
import { Box, Frame, Txt } from '../design/canvas'
import { CircleButton, CircleImage, PillButton, Watermark } from '../components/site/atoms'
import { SiteFooter } from '../components/site/SiteFooter'
import { useTransition } from '../context/TransitionContext'
import { useIsDesktop } from '../design/useIsDesktop'
import { Rise } from '../design/Rise'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MBody, MCircleImage, MH1, MH2, MHero, MMarkButton, MPage, MPill, MSection } from '../components/mobile/kit'

/**
 * Accueil — Figma frame 1920 x 6480.
 * Every coordinate below is read straight off the design export
 * (public/Converted/Accueil (1920x1080)/index.html).
 */
const CANVAS_H = 6480

interface Service {
  /** Heading, with the design's own line break. */
  title: string
  body: string
  /** Text block origin. */
  tx: number
  ty: number
  tw: number
  /** Gap between heading and body — 160 on every block. */
  /** Circle button offset inside the text block. */
  by: number
  /** Photo circle origin (633 x 633 on every section). */
  ix: number
  iy: number
  img: string
  href: string
}

const SERVICES: Service[] = [
  {
    title: 'Installations\nMEP systèmes',
    body: `Nous réalisons les études techniques des domaines CVC (chauffage,
ventilation, climatisation), réseau de désenfumage, plomberie et
évacuation, lutte contre l'incendie, aussi les réseaux électriques
(courant fort et faibles), ingénieries énergétiques et thermiques.`,
    tx: 973, ty: 1420, tw: 731, by: 363,
    ix: 215, iy: 1304,
    img: '/Assets/images/Accueil-MEP.png',
    href: '/prestations/mep',
  },
  {
    title: 'VRD et\nAménagement',
    body: `Engineering Studio met au service de votre projet d’aménagement
du territoire, son expertise en génie urbain, terrassement,
infrastructure et réseaux VRD (voiries et réseaux divers), étude de
stabilité, travaux publics, eau et environnement.`,
    tx: 219, ty: 2500, tw: 720, by: 363,
    ix: 1072, iy: 2384,
    img: '/Assets/images/Accueil-VRD.png',
    href: '/prestations/vrd',
  },
  {
    title: 'Travaux\ntopographique',
    body: `Nous réalisons un large éventail de missions : des relevés
topographiques de terrain à l'établissement de plans précis.
Notre travail couvre l'ensemble des phases d'un projet, nous
accompagnons ainsi des projets d'aménagement, de construction
ou de rénovation.`,
    tx: 973, ty: 3566, tw: 705, by: 389,
    ix: 219, iy: 3464,
    img: '/Assets/images/Accueil-TOPO.png',
    href: '/prestations/topo',
  },
  {
    title: 'Modélisation 3D\net Synthèse BIM',
    body: `Assurez-vous une représentation précise de vos bâtiments via un
processus de modélisation 3D. Celui-ci représente une véritable
empreinte 3D du bâtiment (architecture et structure) et de l'ensemble
des éléments techniques qui le composent (fluides, réseaux électriques,
éléments de plomberie, CVC …).`,
    tx: 219, ty: 4646, tw: 768, by: 389,
    ix: 1072, iy: 4544,
    img: '/Assets/images/Accueil-BIM.png',
    href: '/prestations/bim',
  },
]

export default function Home() {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])
  const isDesktop = useIsDesktop()

  if (!isDesktop) return <HomeMobile nav={nav} />

  return (
    <Frame h={CANVAS_H}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Watermark x={1067.4} y={168} size={744.6} />

      <Txt t="display" x={215} y={326}>
        {"L'excellence dans\nl'ingénierie d'étude\ntechnique en BTP"}
      </Txt>

      <Txt t="body" x={215} y={621} dim>
        {`ENGINEERING STUDIO, intervient sur tout type de projets et
à n’importe quelle phase du projet, de l'étude à la modélisation BIM.`}
      </Txt>

      <PillButton x={215} y={721} w={177} onClick={() => nav('/devis')}>
        Obtenez un devis
      </PillButton>
      <CircleButton x={407} y={721} label="Qui sommes-nous" onClick={() => nav('/a-propos')} />

      {/* ── Four service sections ─────────────────────────────────────────── */}
      {SERVICES.map((s) => (
        <ServiceSection key={s.href} {...s} onOpen={() => nav(s.href)} />
      ))}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <SiteFooter y={5618} eyebrow linksX={13} linksY={269} watermarkY={-218} />
    </Frame>
  )
}

function ServiceSection({
  title, body, tx, ty, tw, by, ix, iy, img, onOpen,
}: Service & { onOpen: () => void }) {
  return (
    <>
      <Rise>
        <CircleImage x={ix} y={iy} size={633} src={img} alt={title.replace('\n', ' ')} onClick={onOpen} />
      </Rise>
      <Rise delay={90}>
        <Box x={tx} y={ty} w={tw}>
          <Txt t="h2" x={0} y={0}>{title}</Txt>
          <Txt t="body" x={0} y={160} dim>{body}</Txt>
          <CircleButton x={0} y={by} onClick={onOpen} />
        </Box>
      </Rise>
    </>
  )
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */

function HomeMobile({ nav }: { nav: (p: string) => void }) {
  return (
    <MPage>
      <MHero>
        <MH1>{"L'excellence dans l'ingénierie d'étude technique en BTP"}</MH1>
        <MBody className="mt-6">
          ENGINEERING STUDIO, intervient sur tout type de projets et à n’importe quelle phase du
          projet, de l'étude à la modélisation BIM.
        </MBody>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <MPill onClick={() => nav('/devis')}>Obtenez un devis</MPill>
          <MMarkButton onClick={() => nav('/a-propos')}>Qui sommes-nous</MMarkButton>
        </div>
      </MHero>

      {SERVICES.map((s) => (
        <MSection key={s.href}>
          <Rise><MCircleImage src={s.img} alt={s.title.replace('\n', ' ')} /></Rise>
          <Rise delay={80}>
            <MH2 className="mt-10">{s.title.replace('\n', ' ')}</MH2>
            <MBody className="mt-4">{s.body}</MBody>
            <div className="mt-7">
              <MMarkButton onClick={() => nav(s.href)}>En savoir plus</MMarkButton>
            </div>
          </Rise>
        </MSection>
      ))}

      <MobileFooter eyebrow />
    </MPage>
  )
}
