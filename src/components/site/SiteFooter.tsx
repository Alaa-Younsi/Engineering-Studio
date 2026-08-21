import { useCallback } from 'react'
import { Box, Txt } from '../../design/canvas'
import { LogoWordmark } from '../../brand/vectors'
import { CircleButton, PillButton, Watermark } from './atoms'
import { useTransition } from '../../context/TransitionContext'

/**
 * The site footer, in Figma coordinates relative to the wordmark's top-left.
 *
 * The three pages that carry it (Accueil, A propos, Clients) place the link
 * block at slightly different offsets — Accueil sits 86px higher and 13px
 * further right, and only Accueil shows the eyebrow — so those are props
 * rather than baked in.
 */
export interface SiteFooterProps {
  /** Canvas y of the wordmark's top edge. */
  y: number
  /** Canvas x of the group origin; the wordmark sits 334px in from it. */
  x?: number
  /** "Ingenierie du batiment" above the wordmark — Accueil only. */
  eyebrow?: boolean
  /** Link block offset from the group origin. */
  linksX?: number
  linksY?: number
  /** Watermark top, relative to the group origin. */
  watermarkY?: number
}

const BLURB = `ENGINEERING STUDIO propose des études techniques
pluridisciplinaire présent dans les domaines d’ingénieries du
MEP/CET et VRD, actif dans la transition vers l’ère du BIM.`

const CONTACT = `Sétif, Alger
contact@engineering-studio.net
+213 (0) 773 87 62 14`

export function SiteFooter({
  y, x = 219, eyebrow = false, linksX = 0, linksY = 355, watermarkY = -121.7,
}: SiteFooterProps) {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])

  // Link rows, in group-relative coordinates.
  const L = (dx: number, dy: number) => ({ x: linksX + dx, y: linksY + dy })

  return (
    <>
      {/* Watermark is anchored to the canvas, not the group — it bleeds wide. */}
      <Watermark x={88} y={y + watermarkY} size={1743.3} />

      <Box x={x} y={y} w={1449}>
        {eyebrow && (
          <Txt t="lead" x={607.4} y={-57} dim>
            Ingénierie du bâtiment
          </Txt>
        )}

        <Box x={334} y={0} w={815} h={79.4}>
          <LogoWordmark style={{ width: '100%', height: '100%', color: '#fff' }} />
        </Box>

        <PillButton x={668} y={140} w={146} onClick={() => nav('/contact')}>
          Écrivez-nous
        </PillButton>

        {/* ── Left column: about ─────────────────────────────────────────── */}
        <Txt t="lead" {...L(0, 0)}>À propos</Txt>
        <Txt t="bodyLight" {...L(0, 48)} dim>{BLURB}</Txt>
        <FooterLink {...L(0, 179)} onClick={() => nav('/prestations')}>Prestation</FooterLink>
        <FooterLink {...L(0, 224)} onClick={() => nav('/portefeuille')}>Portefeuille</FooterLink>

        {/* ── Right column: contact ──────────────────────────────────────── */}
        <Txt t="lead" {...L(1103, 0)}>Contact</Txt>
        <Txt t="bodyLight" {...L(1103, 48)} dim>{CONTACT}</Txt>
        <FooterLink {...L(1103, 179)} onClick={() => nav('/clients')}>Clients</FooterLink>
        <FooterLink {...L(1103, 224)} onClick={() => nav('/nouvelles')}>Nouvelles</FooterLink>
        <CircleButton {...L(1103, 273)} label="Nous contacter" onClick={() => nav('/contact')} />

        {/* ── Social + copyright ─────────────────────────────────────────── */}
        <SocialLink {...L(0, 371)} href="https://www.facebook.com/">Facebook</SocialLink>
        <SocialLink {...L(185, 371)} href="https://www.linkedin.com/">LinkedIn</SocialLink>
        <Txt t="small" {...L(400.3, 530)}>
          Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio
        </Txt>
      </Box>
    </>
  )
}

function FooterLink({ x, y, onClick, children }: { x: number; y: number; onClick: () => void; children: string }) {
  return (
    <Txt
      t="lead"
      x={x}
      y={y}
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="cursor-pointer transition-opacity hover:opacity-60"
    >
      {children}
    </Txt>
  )
}

function SocialLink({ x, y, href, children }: { x: number; y: number; href: string; children: string }) {
  return (
    <Box x={x} y={y}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60">
        <Txt t="small" flow dim>{children}</Txt>
      </a>
    </Box>
  )
}
