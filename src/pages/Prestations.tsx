import { useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Box, Frame, u } from '../design/canvas'
import { Watermark } from '../components/site/atoms'
import { LogoMark } from '../brand/vectors'
import { useTransition } from '../context/TransitionContext'
import { useIsDesktop } from '../design/useIsDesktop'
import { MHero, MPage } from '../components/mobile/kit'
import { Rise } from '../design/Rise'
import { useSeo } from '../lib/useSeo'

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
  {
    key: 'topo',
    label: 'TOPO Studio',
    href: '/prestations/topo',
    x: 573.3,
    y: 0,
    w: 177.7,
    h: 81.3,
  },
  { key: 'vrd', label: 'VRD Studio', href: '/prestations/vrd', x: 0, y: 194.3, w: 179.5, h: 81.3 },
  {
    key: 'bim',
    label: 'BIM Studio',
    href: '/prestations/bim',
    x: 574.5,
    y: 194.3,
    w: 178.7,
    h: 81.3,
  },
] as const

/** Hover mark: square, the height of a studio lockup, then a gap before the name. */
const MARK = 81.3
const MARK_GAP = 20.6

export default function Prestations() {
  useSeo({
    title: 'Prestations — MEP/CET, VRD, Topographie, BIM | Engineering Studio',
    description:
      'Quatre pôles d’expertise : MEP Studio (fluides), VRD Studio (voirie et réseaux), TOPO Studio (topographie) et BIM Studio — en régie ou clé en main.',
  })
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <MPage>
        <MHero center>
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-16">
            {STUDIOS.map((s, i) => (
              <Rise key={s.key} delay={i * 90}>
                <button
                  type="button"
                  onClick={() => nav(s.href)}
                  aria-label={s.label}
                  className="flex w-full items-center justify-center"
                >
                  <img
                    src={`/Assets/logo/svg/prestations-${s.key}.svg`}
                    alt={s.label}
                    className="w-full"
                    draggable={false}
                  />
                </button>
              </Rise>
            ))}
          </div>
        </MHero>
      </MPage>
    )
  }

  return (
    <Frame h={1080} fit>
      <Watermark x={132} y={-288} size={1655.4} />

      {/* All four read at full white; hovering one dims the other three. */}
      <Box x={583} y={402} w={753.1} h={275.6} className="[&:has(button:hover)>button]:opacity-50">
        {STUDIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => nav(s.href)}
            aria-label={s.label}
            className="group absolute flex items-center transition-opacity duration-300 hover:!opacity-100"
            style={{ left: u(s.x), top: u(s.y), width: u(s.w), height: u(s.h) }}
          >
            {/* The mark drops in at the lockup's left edge and slides the name across. */}
            <LogoMark
              aria-hidden
              className="absolute left-0 top-0 origin-left scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
              style={{ width: u(MARK), height: u(MARK), color: '#fff' }}
            />
            <img
              src={`/Assets/logo/svg/prestations-${s.key}.svg`}
              alt={s.label}
              className="h-full w-full transition-transform duration-300 group-hover:translate-x-[var(--shift)]"
              style={{ '--shift': u(MARK + MARK_GAP) } as CSSProperties}
              draggable={false}
            />
          </button>
        ))}
      </Box>
    </Frame>
  )
}
