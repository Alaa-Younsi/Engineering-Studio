import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMenu } from '../context/MenuContext'
import { useTransition } from '../context/TransitionContext'
import { LogoFull } from './LogoFull'
import { LogoButton } from './LogoButton'
import { navLinks } from '../data/navLinks'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: {},
}

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

export function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useMenu()
  const { startTransition } = useTransition()

  const handleNavClick = useCallback(
    (path: string) => {
      closeMenu()
      startTransition(path)
    },
    [closeMenu, startTransition],
  )

  const handleDevis = useCallback(() => {
    closeMenu()
    startTransition('/devis')
  }, [closeMenu, startTransition])

  const handleReunion = useCallback(() => {
    closeMenu()
    startTransition('/reunion')
  }, [closeMenu, startTransition])

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          key="menu-overlay"
          className="fixed inset-0 z-50 bg-bg flex flex-col"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-white/10 flex-shrink-0">
            <span className="hidden sm:block font-body text-white text-sm truncate">
              contact@engineering-studio.net
            </span>
            <button
              onClick={closeMenu}
              aria-label="Fermer le menu"
              className="ml-auto text-white hover:opacity-70 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto overflow-x-hidden">

            {/* Left side — logo + CTA */}
            <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-8 lg:py-0 gap-6 lg:gap-10 lg:w-[42%] lg:flex-shrink-0 border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
              <LogoFull size="lg" className="scale-75 origin-left sm:scale-90 lg:scale-100" />
              <div className="flex flex-wrap items-center gap-3">
                <LogoButton variant="pill" onClick={handleDevis}>Devis</LogoButton>
                <LogoButton variant="pill" onClick={handleReunion}>Demander un échange</LogoButton>
                <LogoButton aria-label="Contactez-nous" onClick={() => handleNavClick('/contact')} />
              </div>
            </div>

            {/* Right side — nav links */}
            <motion.div
              className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 lg:py-0 gap-0.5 flex-1"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className="block w-full font-display font-bold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white leading-tight hover:opacity-60 transition-opacity text-left py-1"
                  >
                    {link.label}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-white/10 flex-shrink-0 gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-white hover:opacity-60 transition-opacity"
              >
                Facebook
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-white hover:opacity-60 transition-opacity"
              >
                LinkedIn
              </a>
            </div>
            <span className="hidden md:block font-body text-sm text-white text-center">
              Solutions Globales en Ingénierie
            </span>
            <span className="font-body text-sm text-white whitespace-nowrap">+213 (0) 773 87 62 14</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
