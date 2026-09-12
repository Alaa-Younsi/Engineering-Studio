import { useCallback, useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Box, DESIGN_W, Frame, Txt, u } from '../design/canvas'
import { CircleButton, CircleImage, PillButton, Watermark } from '../components/site/atoms'
import { SiteFooter } from '../components/site/SiteFooter'
import { LogoMark } from '../brand/vectors'
import { useTransition } from '../context/TransitionContext'
import { useIsDesktop } from '../design/useIsDesktop'
import { Rise } from '../design/Rise'
import { easedFade, holdRamp, SCROLL_SPRING } from '../design/holdRamp'
import { motionOff } from '../design/motionOff'
import { MobileFooter } from '../components/mobile/MobileFooter'
import {
  MBody,
  MCircleImage,
  MH1,
  MH2,
  MHero,
  MMarkButton,
  MPage,
  MPill,
  MSection,
} from '../components/mobile/kit'
import { useSeo } from '../lib/useSeo'

/**
 * Accueil — Figma frame 1920 x 6480.
 * Every coordinate below is read straight off the design export
 * (public/Converted/Accueil (1920x1080)/index.html).
 */
const CANVAS_H = 6480

/**
 * The hero mark and the four service photos, hero first — the anchor points
 * a single travelling image slides between (see the "Parallax hand-off"
 * block in `Home`). `cy` is each stop's own centre, used only to time the
 * hold/ramp windows symmetrically; `x`/`y` are the corner the image rests at,
 * identical to the static layout below.
 */
const STOPS_CY = [540.3, 1620.5, 2700.5, 3780.5, 4860.5]
const STOPS_X = [1067.4, 215, 1072, 219, 1072]
const STOPS_Y = [168, 1304, 2384, 3464, 4544]
const STOPS_SIZE = [744.6, 633, 633, 633, 633]
const HOLD_FRAC = 0.3

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
    tx: 973,
    ty: 1420,
    tw: 731,
    by: 363,
    ix: 215,
    iy: 1304,
    img: '/Assets/images/Accueil-MEP.png',
    href: '/prestations/mep',
  },
  {
    title: 'VRD et\nAménagement',
    body: `Engineering Studio met au service de votre projet d’aménagement
du territoire, son expertise en génie urbain, terrassement,
infrastructure et réseaux VRD (voiries et réseaux divers), étude de
stabilité, travaux publics, eau et environnement.`,
    tx: 219,
    ty: 2500,
    tw: 720,
    by: 363,
    ix: 1072,
    iy: 2384,
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
    tx: 973,
    ty: 3566,
    tw: 705,
    by: 389,
    ix: 219,
    iy: 3464,
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
    tx: 219,
    ty: 4646,
    tw: 768,
    by: 389,
    ix: 1072,
    iy: 4544,
    img: '/Assets/images/Accueil-BIM.png',
    href: '/prestations/bim',
  },
]

export default function Home() {
  useSeo({
    title: 'Solutions Globales en Ingénierie | Engineering Studio',
    description:
      'Solutions Globales en Ingénierie, Études Techniques d’Ingénierie du Bâtiment, MEP/CET, VRD, BIM, Topographie. Étude Clé en Main.',
    path: '/',
  })
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])
  const isDesktop = useIsDesktop()
  const off = motionOff()
  const frameRef = useRef<HTMLDivElement>(null)

  /*
   * ── Parallax hand-off ──────────────────────────────────────────────────
   * `centerY` is the design-space y currently at the viewport's vertical
   * centre, kept in sync with real scroll. Every other motion value below
   * is a `holdRamp` of it: flat at a stop's own position for most of its
   * section, then a short linear slide into the next stop's position/size,
   * with each image's opacity crossfading over that same window. Disabled
   * during visual QA capture and for `prefers-reduced-motion` (see
   * `motionOff`), where the static images render instead — same discipline
   * as `Rise`.
   */
  const { scrollY } = useScroll()
  const centerY = useMotionValue(0)
  // `centerY` tracks scroll exactly; the spring is what the visuals read, so
  // a flicked wheel arrives as one continuous glide instead of a stack of
  // discrete scroll deltas. Critically damped enough that it never overshoots
  // a stop, and fast enough that it stays glued to the page as you scroll.
  const smoothY = useSpring(centerY, SCROLL_SPRING)
  const settled = useRef(false)

  const recompute = useCallback(() => {
    const el = frameRef.current
    if (off || !el) return
    const rect = el.getBoundingClientRect()
    const scale = rect.width / DESIGN_W
    const y = (window.innerHeight / 2 - rect.top) / scale
    centerY.set(y)
    // First measurement is the page's true starting position, not something to
    // spring towards — otherwise the disc slides in from the canvas origin.
    if (!settled.current) {
      settled.current = true
      smoothY.jump(y)
    }
  }, [off, centerY, smoothY])

  useMotionValueEvent(scrollY, 'change', recompute)
  useEffect(() => {
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [recompute])

  const xRamp = holdRamp(STOPS_CY, STOPS_X, HOLD_FRAC)
  const yRamp = holdRamp(STOPS_CY, STOPS_Y, HOLD_FRAC)
  const sizeRamp = holdRamp(STOPS_CY, STOPS_SIZE, HOLD_FRAC)
  const leftRem = useTransform(useTransform(smoothY, xRamp.xs, xRamp.os), u)
  const topRem = useTransform(useTransform(smoothY, yRamp.xs, yRamp.os), u)
  const sizeRem = useTransform(useTransform(smoothY, sizeRamp.xs, sizeRamp.os), u)

  /*
   * The photos are stacked in scroll order and each one fades in *and stays*,
   * so the newest always paints over the one before it. That keeps a fully
   * opaque image in the disc at every scroll position — the previous
   * cross-fade dipped both photos towards transparent at the half-way point,
   * which is what made the black canvas show through mid-hand-off.
   */
  const gaps = STOPS_CY.slice(1).map((y, i) => y - STOPS_CY[i])
  const fadeWindow = (i: number) =>
    easedFade(STOPS_CY[i] + gaps[i] * HOLD_FRAC, STOPS_CY[i + 1] - gaps[i] * HOLD_FRAC)

  const wMep = fadeWindow(0)
  const wVrd = fadeWindow(1)
  const wTopo = fadeWindow(2)
  const wBim = fadeWindow(3)
  const opMep = useTransform(smoothY, wMep.xs, wMep.os)
  const opVrd = useTransform(smoothY, wVrd.xs, wVrd.os)
  const opTopo = useTransform(smoothY, wTopo.xs, wTopo.os)
  const opBim = useTransform(smoothY, wBim.xs, wBim.os)
  const serviceOpacities = [opMep, opVrd, opTopo, opBim]

  if (!isDesktop) return <HomeMobile nav={nav} />

  return (
    <Frame ref={frameRef} h={CANVAS_H}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {off && <Watermark x={1067.4} y={168} size={744.6} />}

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
        <ServiceSection key={s.href} {...s} onOpen={() => nav(s.href)} showImage={off} />
      ))}

      {!off && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-20 overflow-hidden rounded-full"
          style={{ left: leftRem, top: topRem, width: sizeRem, height: sizeRem }}
        >
          {/* Bottom of the stack: covered, not faded, by the first photo. */}
          <div className="absolute inset-0 opacity-10">
            <LogoMark style={{ width: '100%', height: '100%', color: '#fff' }} />
          </div>
          {SERVICES.map((s, i) => (
            <motion.img
              key={s.href}
              src={s.img}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: serviceOpacities[i] }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <SiteFooter y={5618} eyebrow linksX={13} linksY={269} watermarkY={-218} />
    </Frame>
  )
}

function ServiceSection({
  title,
  body,
  tx,
  ty,
  tw,
  by,
  ix,
  iy,
  img,
  onOpen,
  showImage,
}: Service & { onOpen: () => void; showImage: boolean }) {
  return (
    <>
      {showImage && (
        <Rise>
          <CircleImage
            x={ix}
            y={iy}
            size={633}
            src={img}
            alt={title.replace('\n', ' ')}
            onClick={onOpen}
          />
        </Rise>
      )}
      <Rise delay={90}>
        <Box x={tx} y={ty} w={tw}>
          <Txt t="h2" x={0} y={0}>
            {title}
          </Txt>
          <Txt t="body" x={0} y={160} dim>
            {body}
          </Txt>
          <CircleButton x={0} y={by} label="Jeter un coup d'œil" onClick={onOpen} />
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
          <Rise>
            <MCircleImage src={s.img} alt={s.title.replace('\n', ' ')} />
          </Rise>
          <Rise delay={80}>
            <MH2 className="mt-10">{s.title.replace('\n', ' ')}</MH2>
            <MBody className="mt-4">{s.body}</MBody>
            <div className="mt-7">
              <MMarkButton onClick={() => nav(s.href)}>Jeter un coup d'œil</MMarkButton>
            </div>
          </Rise>
        </MSection>
      ))}

      <MobileFooter eyebrow />
    </MPage>
  )
}
