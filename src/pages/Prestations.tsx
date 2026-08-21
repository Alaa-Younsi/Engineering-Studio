import { useCallback } from 'react'
import { Box, Frame, u } from '../design/canvas'
import { Watermark } from '../components/site/atoms'
import { useTransition } from '../context/TransitionContext'

/**
 * Prestations — Figma frame 1920 x 1080.
 * Four studio lockups on a 2x2 grid inside a 753.1 x 275.6 block at (583, 402),
 * over a mark watermark that bleeds off the top and both sides.
 *
 * The lockups are the exact Figma vectors, split out of the export by
 * tools/extract_logo.py — not re-typeset.
 */
const STUDIOS = [
  { key: 'mep', label: 'MEP Studio', href: '/prestations/mep', x: 0.8, y: 0, w: 178.7, h: 81.3 },
  { key: 'topo', label: 'TOPO Studio', href: '/prestations/topo', x: 573.3, y: 0, w: 177.7, h: 81.3 },
  { key: 'vrd', label: 'VRD Studio', href: '/prestations/vrd', x: 0, y: 194.3, w: 179.5, h: 81.3 },
  { key: 'bim', label: 'BIM Studio', href: '/prestations/bim', x: 574.5, y: 194.3, w: 178.7, h: 81.3 },
] as const

export default function Prestations() {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])

  return (
    <Frame h={1080}>
      <Watermark x={132} y={-288} size={1655.4} />

      <Box x={583} y={402} w={753.1} h={275.6}>
        {STUDIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => nav(s.href)}
            aria-label={s.label}
            className="absolute transition-opacity hover:opacity-70"
            style={{ left: u(s.x), top: u(s.y), width: u(s.w), height: u(s.h) }}
          >
            <img
              src={`/Assets/logo/svg/prestations-${s.key}.svg`}
              alt={s.label}
              className="h-full w-full"
              draggable={false}
            />
          </button>
        ))}
      </Box>
    </Frame>
  )
}
