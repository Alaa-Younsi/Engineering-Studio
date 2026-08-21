import { Box, Frame, Txt } from '../../design/canvas'
import { Watermark } from './atoms'

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
            <Box
              x={k % 2 === 1 ? 1262 : 108}
              y={265}
              w={550}
              h={550}
              clip
              style={{ borderRadius: '50%' }}
            >
              <img
                src={`/Assets/images/${imgPrefix} STUDIO-${n}.png`}
                alt={row.title.replace(/\n/g, ' ')}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </Box>

            <Txt t="h6" y={449 - l} centerX align="center" dim>{`${n}.`}</Txt>
            <Txt t="h2" y={537 - l} centerX align="center">{row.title}</Txt>
          </Box>
        )
      })}
    </Frame>
  )
}

/** Convenience wrapper so each studio page is just its data. */
export function studioLogo(slug: string, alt: string, x: number, w: number) {
  return { src: `/Assets/logo/svg/${slug}.svg`, alt, x, y: 471, w, h: 137.2 }
}
