import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Box, Frame, Txt, u } from '../../design/canvas'
import { Watermark } from './atoms'
import { useIsDesktop } from '../../design/useIsDesktop'
import { MBody, MHero, MPage, MSection } from '../mobile/kit'
import { Rise } from '../../design/Rise'
import { motionOff } from '../../design/motionOff'
import { EASE_OUT, EASE_STOPS, SCROLL_SPRING } from '../../design/holdRamp'

/**
 * The shared layout behind MEP / VRD / TOPO / BIM Studio.
 *
 * Every one of these Figma frames is the same machine:
 *   y = 0      1080-tall hero — watermark at (588,168) d=744.6, lockup at y=471
 *   y = 1080k  one 1080-tall row per speciality, k = 1 … n
 *
 * Within a row (measured across all four exports, exact in every case):
 *   photo    550 x 550 at y = 1080k + 265, x = 1262 (odd k) or 108 (even k)
 *   number   y = 1080k + 449 - lift
 *   heading  y = 1080k + 537 - lift
 * where `lift` re-centres a multi-line heading: half a 73px line per extra
 * line — 0, 36, 73 for one, two and three lines.
 */
export interface StudioRow {
  /** Heading, with the design's own line breaks. */
  title: string
}

export interface StudioPageProps {
  /** Studio lockup under the header. */
  logo: { src: string; alt: string; x: number; y: number; w: number; h: number }
  rows: StudioRow[]
  /** `/Assets/images/{imgPrefix} STUDIO-01.png` … */
  imgPrefix: string
}

const ROW = 1080
const lift = (title: string) => Math.floor(36.5 * (title.split('\n').length - 1))

export function StudioPage({ logo, rows, imgPrefix }: StudioPageProps) {
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <MPage>
        <MHero center>
          <img src={logo.src} alt={logo.alt} className="w-[78%] max-w-[17rem]" draggable={false} />
        </MHero>
        {rows.map((row, i) => {
          const n = String(i + 1).padStart(2, '0')
          return (
            <MSection key={n} className="py-10">
              <Rise>
                <div className="mx-auto aspect-square w-[70vw] max-w-[19rem] overflow-hidden rounded-full">
                  <img
                    src={`/Assets/images/${imgPrefix} STUDIO-${n}.png`}
                    alt={row.title.split('\n').join(' ')}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </Rise>
              <Rise delay={80}>
                <MBody className="mt-7 text-center">{`${n}.`}</MBody>
                <h2 className="mt-1 text-center font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.0133em] text-white">
                  {row.title.split('\n').join(' ')}
                </h2>
              </Rise>
            </MSection>
          )
        })}
      </MPage>
    )
  }

  return (
    <Frame h={ROW * (rows.length + 1)}>
      <Watermark x={588} y={168} size={744.6} />

      <Box x={logo.x} y={logo.y} w={logo.w} h={logo.h}>
        <img src={logo.src} alt={logo.alt} className="h-full w-full" draggable={false} />
      </Box>

      {rows.map((row, i) => {
        const k = i + 1
        const top = ROW * k
        const l = lift(row.title)
        const n = String(k).padStart(2, '0')
        return (
          <Box key={n} x={0} y={top} w={1920} h={ROW}>
            <StudioRowImage
              src={`/Assets/images/${imgPrefix} STUDIO-${n}.png`}
              alt={row.title.replace(/\n/g, ' ')}
              x={k % 2 === 1 ? 1262 : 108}
            />

            <Rise delay={90}>
              <Txt t="h6" y={449 - l} centerX align="center" dim>{`${n}.`}</Txt>
              <Txt t="h2" y={537 - l} centerX align="center">
                {row.title}
              </Txt>
            </Rise>
          </Box>
        )
      })}
    </Frame>
  )
}

/**
 * A row's photo, parallax-slid in from the opposite side it rests on — the
 * rows alternate sides already, so "the other side" is simply whichever x
 * this row isn't using. Rests at its normal, static position once past the
 * entry window; disabled during visual QA capture and for
 * `prefers-reduced-motion` (see `motionOff`), same as `Rise`.
 *
 * The travel is eased and then run through a spring, so the photo glides in
 * and settles rather than tracking the wheel one notch at a time. It stays
 * fully opaque the whole way across — the entry fade it used to carry meant
 * the photo was half-transparent for most of its slide.
 */
function StudioRowImage({ src, alt, x }: { src: string; alt: string; x: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const off = motionOff()
  const fromX = x === 1262 ? 108 : 1262
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 40%'] })
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING)
  // Sampled ease-out: fast off the mark, long settle into the resting x.
  const eased = useTransform(smooth, EASE_STOPS, EASE_OUT)
  const left = useTransform(eased, [0, 1], off ? [x, x] : [fromX, x])
  const leftRem = useTransform(left, u)

  return (
    <motion.div
      ref={ref}
      className="absolute overflow-hidden rounded-full"
      style={{ top: u(265), left: leftRem, width: u(550), height: u(550) }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  )
}

/** Convenience wrapper so each studio page is just its data. */
export function studioLogo(slug: string, alt: string, x: number, w: number) {
  return { src: `/Assets/logo/svg/${slug}.svg`, alt, x, y: 471, w, h: 137.2 }
}
