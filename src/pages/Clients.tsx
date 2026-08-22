import { useCallback } from 'react'
import { Box, Frame, Txt } from '../design/canvas'
import { CircleButton, CircleImage, Watermark } from '../components/site/atoms'
import { SiteFooter } from '../components/site/SiteFooter'
import { LogoMark } from '../brand/vectors'
import { CLIENT_CARDS, ENGAGEMENTS, SECTORS, TESTIMONIALS } from '../data/clients'
import { useTransition } from '../context/TransitionContext'
import { useIsDesktop } from '../design/useIsDesktop'
import { ClientsMobile } from './mobile/ClientsMobile'
import { Rise } from '../design/Rise'
import { useAutoCarousel } from '../design/useAutoCarousel'

/**
 * Clients — Figma frame 1920 x 12960.
 *
 *   496      hero title
 *   1411     "Nos clients" + the intro column
 *   2583     "Des missions variées …"
 *   3577.6   "Notre engagement envers nos clients" + three ringed statements
 *   4707     "Secteurs d'activité" + the nine-item list
 *   5758     "Voici quelques exemples …" + photo
 *   6618     the 5 x 9 client grid
 *   10056    "Un grand merci …"
 *   11061.8  testimonials track
 *   12012    footer
 */
const CANVAS_H = 12960

export default function Clients() {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])
  const isDesktop = useIsDesktop()
  const carousel = useAutoCarousel<HTMLDivElement>()

  if (!isDesktop) return <ClientsMobile nav={nav} />

  return (
    <Frame h={CANVAS_H}>
      <Watermark x={1067.4} y={168} size={744.6} />
      <Txt t="displayTight" x={215} y={496}>Clients</Txt>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={1411}>Nos clients</Txt>
      <Txt t="h2" x={219} y={1446}>
        {'Découvrez nos\nclients et comment\nnous collaborons\navec eux'}
      </Txt>
      <Txt t="bodyLight" x={973} y={1410} dim>
        {`Nous travaillons principalement avec les installateurs, architectes,
bureaux d’études, entreprises générales, sous-traitants, propriétaires
industrielles, maîtres d’ouvrages, promoteurs.

Quel que soit votre secteur d’activité, nous pouvons vous aider à réussir
vos projets, même les plus complexes. Le tout en répondant aux différents
enjeux liés au délai, au coût et à la qualité.

Vous pouvez compter sur nous pour vous assister à chaque étape de
votre projet d’études. De la conception à le dimensionnement, nous vous
garantissons des études de qualité, que ce soit pour un projet neuve ou
une rénovation. Nous possédons les meilleurs moyens et logiciels pour
vous fournir des prestations de qualité.`}
      </Txt>
      <CircleButton x={219} y={1784} label="Nous contacter" onClick={() => nav('/contact')} />

      {/* ── Missions variées ──────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={2583} align="center">
        {'Des missions variées et des solutions \nadaptées à chaque client'}
      </Txt>
      <Txt t="bodyLight" centerX y={2774} align="center" dim>
        {`Avec ENGINEERING STUDIO à vos côtés, vous bénéficiez des meilleures solutions en matière
d'études techniques (réseaux extérieurs et réseaux intérieurs).`}
      </Txt>

      {/* ── Engagement ────────────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={3577.6} align="center">Notre engagement envers nos clients</Txt>
      <Txt t="bodyLight" centerX y={3695.6} align="center" dim>
        {`Notre engagement envers nos clients de partout en est un par lequel nous prenons réellement conscience que ce sont eux qui
nous fournissent du travail et des avantages. Ces clients ont la possibilité de s’approvisionner à de nombreuses autres sources
et nous sommes honorés qu’ils nous choisissent. Leurs besoins sont simples. Ils veulent que l'étude soit livrée tel que promis
et que la qualité offre la performance prévue.`}
      </Txt>
      {ENGAGEMENTS.map((e) => (
        <div key={e.ring}>
          <Watermark x={e.ring} y={3837.6} size={141.4} />
          <Txt t="leadMediumTight" x={e.lx} y={3882.4} align="center" dim>{e.label}</Txt>
        </div>
      ))}

      {/* ── Secteurs d'activité ───────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={4707}>Qui sont nos clients ?</Txt>
      <Txt t="h2" x={219} y={4741}>Secteurs d’activité</Txt>
      <Txt t="bodyLight" x={219} y={4859} dim>
        {`ENGINEERING STUDIO intervient en Algérie et est spécialisé dans les études
techniques d'ingénierie (réseaux extérieurs et réseaux intérieurs), également
missionné pour des travaux topographiques.
Nos clients proviennent de secteurs d’activité très variés.
Cette diversité est une richesse qui nécessite une capacité d’adaptabilité et
nous permet sans cesse de repousser nos limites.`}
      </Txt>
      {SECTORS.map((s, i) => (
        <Txt key={s} t="lead" x={1224} y={4715 + i * 34}>{s}</Txt>
      ))}

      {/* ── Exemples de clients ───────────────────────────────────────────── */}
      <Txt t="h2" x={217} y={5758}>
        {'Voici quelques\nexemples de clients\navec lesquels nous\navons eu le plaisir\nde collaborer'}
      </Txt>
      <Rise>
        <CircleImage x={1070} y={5624} size={633} src="/Assets/images/Clients-Clients.png" alt="Nos clients" />
      </Rise>

      {/* ── Client grid ───────────────────────────────────────────────────── */}
      {CLIENT_CARDS.map((c, i) => (
        // Stagger across each row of five so a row arrives as a sweep.
        <Rise key={`${c.x}-${c.y}`} delay={(i % 5) * 70}>
        <Box x={c.x} y={c.y} w={c.w} h={c.h} bg="#1a1a1a" radius={30} clip>
          {c.lines.map((l) => (
            <Txt key={l.t} t={{ weight: 700, size: l.fs, ls: -0.0405 }} x={l.x} y={l.y}>{l.t}</Txt>
          ))}
          <Txt t="cardMeta" x={c.sx} y={c.sy} opacity={0.5}>{c.sector}</Txt>
          <Txt
            t={{ weight: 700, size: 90, lh: 109, ls: -0.0405 }}
            x={c.nx}
            y={c.ny}
            opacity={0.05}
          >
            {c.num}
          </Txt>
        </Box>
        </Rise>
      ))}

      {/* ── Merci ─────────────────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={10056} align="center">
        {'Un grand merci à tous nos clients \npour leur fidélité et leur confiance'}
      </Txt>
      <Txt t="bodyLight" centerX y={10247} align="center" dim>
        {`Nous tenons à remercier tous nos nouveaux clients qui nous ont confié la réalisation
de leurs projets, ainsi que tous les clients qui sont fidèles aux ENGINEERING STUDIO
depuis de nombreuses années.`}
      </Txt>
      <Box x={906} y={10363} w={107.6} h={107.6}>
        <LogoMark style={{ width: '100%', height: '100%', color: '#fff' }} />
      </Box>

      {/* ── Témoignages ───────────────────────────────────────────────────── */}
      <Box x={219} y={11061.8} w={1701} h={528.4}>
        <Txt t="leadLightTall" x={0} y={0}>Témoignages</Txt>
        <Txt t="h4Wide" x={0} y={62}>Écoutez ce que nos clients ont à dire</Txt>
        {/*
         * The Figma track is 2496 wide inside a 1920 frame, so the last cards
         * are cut off. Make it a real horizontal carousel — same resting
         * layout, but it now slides on its own (bouncing between the ends)
         * and pauses for as long as it's held, by mouse or touch, so a
         * visitor can read a card; a held mouse can also drag it by hand.
         */}
        <Box
          ref={carousel.ref}
          x={0}
          y={186}
          w={1701}
          h={342.4}
          className={`overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${carousel.className}`}
          onPointerDown={carousel.onPointerDown}
          onPointerMove={carousel.onPointerMove}
          onPointerUp={carousel.onPointerUp}
          onPointerCancel={carousel.onPointerCancel}
          onPointerLeave={carousel.onPointerLeave}
          onClickCapture={carousel.onClickCapture}
        >
          <Box x={0} y={0} w={2496} h={342.4}>
          {TESTIMONIALS.map((t, i) => (
            <Rise key={t.x} delay={i * 70}>
            <Box x={t.x} y={0} w={480} h={342.4} bg="#1a1a1a" radius={30}>
              <Box x={50} y={40} w={380} h={261.4}>
                <Box x={0} y={0} w={32} h={32}>
                  <LogoMark style={{ width: '100%', height: '100%', color: '#fff' }} />
                </Box>
                <Txt t="quote" x={0} y={54.1} w={380} opacity={0.5}>{t.quote}</Txt>
                <Txt t={{ weight: 700, size: 20, ls: -0.0405 }} x={0} y={200.4}>{t.name.split('\n')[0]}</Txt>
                <Txt t={{ weight: 700, size: 21, ls: -0.0405 }} x={0} y={220.4}>{t.name.split('\n')[1]}</Txt>
                <Txt t="quoteRole" x={0} y={247.4} opacity={0.5}>{t.role}</Txt>
              </Box>
            </Box>
            </Rise>
          ))}
          </Box>
        </Box>
      </Box>

      <SiteFooter y={12012} />
    </Frame>
  )
}
