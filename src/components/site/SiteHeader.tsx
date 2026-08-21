import { useCallback } from 'react'
import { Box, Txt, u, DESIGN_W } from '../../design/canvas'
import { LogoLockup, BurgerIcon } from '../../brand/vectors'
import { useMenu } from '../../context/MenuContext'
import { useTransition } from '../../context/TransitionContext'

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
 */
export function SiteHeader() {
  const { toggleMenu } = useMenu()
  const { startTransition } = useTransition()
  const goHome = useCallback(() => startTransition('/'), [startTransition])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div
        className="relative mx-auto"
        style={{ width: u(DESIGN_W), height: u(138) }}
      >
        <button
          type="button"
          onClick={goHome}
          aria-label="Engineering Studio — accueil"
          className="pointer-events-auto absolute text-white transition-opacity hover:opacity-70"
          style={{ left: u(108), top: u(56), width: u(133.9), height: u(26) }}
        >
          <LogoLockup style={{ width: '100%', height: '100%' }} />
        </button>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Ouvrir le menu"
          className="pointer-events-auto absolute text-white transition-opacity hover:opacity-70"
          style={{ left: u(1718), top: u(56), width: u(94), height: u(26) }}
        >
          <Txt t="body" x={0} y={0}>Menu</Txt>
          <Box x={70} y={1} w={24} h={24}>
            <BurgerIcon style={{ width: '100%', height: '100%' }} />
          </Box>
        </button>
      </div>
    </header>
  )
}
