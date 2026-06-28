import { useCallback } from 'react'
import { LogoFull } from './LogoFull'
import { useMenu } from '../context/MenuContext'
import { useTransition } from '../context/TransitionContext'

export function Navbar() {
  const { toggleMenu } = useMenu()
  const { startTransition } = useTransition()
  const goHome = useCallback(() => startTransition('/'), [startTransition])

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-8 h-16">
      <button
        onClick={goHome}
        aria-label="Accueil"
        className="hover:opacity-70 transition-opacity text-white"
      >
        <LogoFull size="sm" />
      </button>
      <button
        onClick={toggleMenu}
        className="text-white font-display font-medium text-sm tracking-wide hover:opacity-70 transition-opacity"
        aria-label="Ouvrir le menu"
      >
        Menu ≡
      </button>
    </nav>
  )
}
