import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useMenu } from '../context/MenuContext'
import { useTransition } from '../context/TransitionContext'
import { Box, Txt, u, DESIGN_W } from '../design/canvas'
import { LogoLockup, ArrowRightIcon } from '../brand/vectors'
import { CircleButton, PillButton } from './site/atoms'
import { downloadPlaquette } from '../lib/plaquette'

/**
 * Menu — Figma frame 1920 x 1080, drawn over the page as a full-screen overlay.
 *
 *   contact e-mail  (108, 56)     16px
 *   close arrow     (1788, 57)    24 x 24
 *   lockup          (346.7, 450)  442.2 x 85.9  — the header mark at 3.3x
 *   buttons row     (347, 586)    Devis 88, Demander un echange 214, circle
 *   nav links       (1131, 294 + 84k)  54px Medium
 *   footer row      y = 1001      16px
 */
const LINKS = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Prestations', href: '/prestations' },
  { label: 'Portefeuille', href: '/portefeuille' },
  { label: 'Clients', href: '/clients' },
  { label: 'Nouvelles', href: '/nouvelles' },
  { label: 'Contact', href: '/contact' },
]

/**
 * The menu is a full 1920 x 1080 Figma frame, and `--root-fs` scales the canvas
 * to the window's *width* only — so on any window shorter than 1080 design px
 * (a maximised 1080p screen, once browser chrome is taken off) the top e-mail
 * row and the bottom social row fall outside the viewport. Shrink the frame to
 * what the window can actually show instead of cropping it.
 */
function useFitScale(designH: number) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => {
      const fs = parseFloat(getComputedStyle(document.documentElement).fontSize)
      setScale(Math.min(1, window.innerHeight / ((designH / 16) * fs)))
    }
    fit()
    window.addEventListener('resize', fit, { passive: true })
    return () => window.removeEventListener('resize', fit)
  }, [designH])

  return scale
}

export function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useMenu()
  const { startTransition } = useTransition()
  const { pathname } = useLocation()
  // At rest every link reads at full white; hovering one drops the other
  // five to 50%.
  const [hovered, setHovered] = useState<string | null>(null)
  const scale = useFitScale(1080)

  const go = useCallback(
    (path: string) => {
      closeMenu()
      startTransition(path)
    },
    [closeMenu, startTransition],
  )

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* Desktop: the Figma canvas, 1:1. */}
          <div className="hidden h-full items-center justify-center overflow-hidden lg:flex">
            <div
              className="relative flex-shrink-0"
              style={{ width: u(DESIGN_W), height: u(1080), transform: `scale(${scale})` }}
            >
              <Txt t="small" x={108} y={56} dim>
                contact@engineering-studio.net
              </Txt>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="absolute text-white transition-opacity hover:opacity-70"
                style={{ left: u(1788), top: u(57), width: u(24), height: u(24) }}
              >
                <ArrowRightIcon style={{ width: '100%', height: '100%' }} />
              </button>

              <Box x={346.7} y={450} w={442.2} h={85.9}>
                <LogoLockup style={{ width: '100%', height: '100%', color: '#fff' }} />
              </Box>

              <Box x={347} y={586} w={377} h={45}>
                <PillButton x={0} y={0} w={88} onClick={() => go('/devis')}>
                  Devis
                </PillButton>
                <PillButton x={103} y={0} w={214} onClick={() => go('/reunion')}>
                  Demander un échange
                </PillButton>
              </Box>
              {/*
               * Positioned against the canvas rather than the 377-wide row: an
               * absolutely positioned, shrink-to-fit box is capped by the space
               * left in its containing block, which would pin this at 45px and
               * stop the hover from opening.
               */}
              {/* Brochure download (see src/lib/plaquette.ts). */}
              <CircleButton x={679} y={586} label="Plaquette" onClick={downloadPlaquette} />

              {LINKS.map((l, i) => {
                const active = hovered === null || hovered === l.href
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.3, delay: 0.1 + i * 0.05 },
                    }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  >
                    <Txt
                      t="h3"
                      x={1131}
                      y={294 + i * 84}
                      role="link"
                      tabIndex={0}
                      onClick={() => go(l.href)}
                      onKeyDown={(e) => e.key === 'Enter' && go(l.href)}
                      onMouseEnter={() => setHovered(l.href)}
                      onMouseLeave={() => setHovered(null)}
                      opacity={active ? 1 : 0.5}
                      className="cursor-pointer transition-opacity duration-200"
                    >
                      {l.label}
                    </Txt>
                  </motion.div>
                )
              })}

              <Box x={0} y={1001} w={DESIGN_W}>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <Txt t="small" x={108} y={0} dim className="hover:opacity-100">
                    Facebook
                  </Txt>
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <Txt t="small" x={242} y={0} dim className="hover:opacity-100">
                    LinkedIn
                  </Txt>
                </a>
                <Txt t="small" x={834.1} y={0} dim>
                  Solutions Globales en Ingénierie
                </Txt>
                <Txt t="small" x={1631.1} y={0} dim align="right">
                  +213 (0) 773 87 62 14
                </Txt>
              </Box>
            </div>
          </div>

          {/* Mobile: the same content, stacked. */}
          <div className="flex h-full flex-col justify-between px-6 py-6 lg:hidden">
            <div className="flex items-start justify-between">
              <span className="font-body text-xs text-white/80">
                contact@engineering-studio.net
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="text-white"
              >
                <ArrowRightIcon style={{ width: 24, height: 24 }} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  type="button"
                  onClick={() => go(l.href)}
                  className="text-left font-display text-3xl font-medium text-white transition-opacity"
                  style={{ opacity: pathname === l.href ? 1 : 0.5 }}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => go('/devis')}
                  className="rounded-full border border-white px-5 py-2 text-xs"
                >
                  Devis
                </button>
                <button
                  type="button"
                  onClick={() => go('/reunion')}
                  className="rounded-full border border-white px-5 py-2 text-xs"
                >
                  Demander un échange
                </button>
                <button
                  type="button"
                  onClick={downloadPlaquette}
                  className="rounded-full border border-white px-5 py-2 text-xs"
                >
                  Plaquette
                </button>
              </div>
              <div className="flex gap-6 text-xs text-white/80">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <span>+213 (0) 773 87 62 14</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
