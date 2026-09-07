import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Txt, u, DESIGN_W } from '../../design/canvas'
import { LogoLockup, BurgerIcon, ArrowRightIcon } from '../../brand/vectors'
import { useMenu } from '../../context/MenuContext'
import { useTransition } from '../../context/TransitionContext'
import { useIsDesktop } from '../../design/useIsDesktop'

/**
 * Figma header, identical on every page:
 *   logo lockup  x=108  y=56   133.9 x 26
 *   "Menu"       x=1718 y=56   20px Regular
 *   burger       x=1788 y=57   24 x 24
 *
 * Pinned rather than drawn into each page canvas so the menu stays reachable
 * while scrolling. At scroll-top — which is all the design specifies — the two
 * are pixel-identical. The inner 1920-wide track keeps it aligned with the
 * page canvas on ultra-wide screens, where the canvas stops growing.
 *
 * Below 1024px the canvas is replaced by a plain flex bar at the mobile gutter.
 *
 * The Devis and Réunion flows are self-contained: their Figma frames keep the
 * same two slots but swap the menu for a back arrow, so they get that variant
 * rather than a second header of their own.
 */
const FLOW_ROUTES = ['/devis', '/reunion']

export function SiteHeader() {
  const { toggleMenu } = useMenu()
  const { startTransition } = useTransition()
  const isDesktop = useIsDesktop()
  const { pathname } = useLocation()
  const goHome = useCallback(() => startTransition('/'), [startTransition])
  const isFlow = FLOW_ROUTES.some((r) => pathname.startsWith(r))

  if (!isDesktop) {
    return (
      <header className="fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between px-6">
        <button
          type="button"
          onClick={goHome}
          aria-label="Engineering Studio — accueil"
          className="text-white"
        >
          <LogoLockup style={{ width: 118, height: 'auto' }} />
        </button>
        {isFlow ? (
          <button
            type="button"
            onClick={goHome}
            aria-label="Retour à l'accueil"
            className="text-white"
          >
            <ArrowRightIcon style={{ width: 22, height: 22 }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Ouvrir le menu"
            className="flex items-center gap-2 text-white"
          >
            <span className="font-body text-[0.9375rem]">Menu</span>
            <BurgerIcon style={{ width: 22, height: 22 }} />
          </button>
        )}
      </header>
    )
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="relative mx-auto" style={{ width: u(DESIGN_W), height: u(138) }}>
        <button
          type="button"
          onClick={goHome}
          aria-label="Engineering Studio — accueil"
          className="pointer-events-auto absolute text-white transition-opacity hover:opacity-70"
          style={{ left: u(108), top: u(56), width: u(133.9), height: u(26) }}
        >
          <LogoLockup style={{ width: '100%', height: '100%' }} />
        </button>

        {isFlow ? (
          <button
            type="button"
            onClick={goHome}
            aria-label="Retour à l'accueil"
            className="pointer-events-auto absolute text-white transition-opacity hover:opacity-70"
            style={{ left: u(1788), top: u(57), width: u(24), height: u(24) }}
          >
            <ArrowRightIcon style={{ width: '100%', height: '100%' }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Ouvrir le menu"
            className="pointer-events-auto absolute text-white transition-opacity hover:opacity-70"
            style={{ left: u(1718), top: u(56), width: u(94), height: u(26) }}
          >
            <Txt t="body" x={0} y={0}>
              Menu
            </Txt>
            <Box x={70} y={1} w={24} h={24}>
              <BurgerIcon style={{ width: '100%', height: '100%' }} />
            </Box>
          </button>
        )}
      </div>
    </header>
  )
}
