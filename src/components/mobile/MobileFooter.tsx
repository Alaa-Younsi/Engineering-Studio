import { useCallback } from 'react'
import { LogoMark, LogoWordmark } from '../../brand/vectors'
import { MMarkButton, MPill } from './kit'
import { useTransition } from '../../context/TransitionContext'

/**
 * Mobile footer — the desktop footer's content in one column:
 * wordmark, CTA, the two link columns stacked, then social + copyright.
 */
export function MobileFooter({ eyebrow = false }: { eyebrow?: boolean }) {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])

  return (
    <footer className="relative overflow-hidden px-6 pb-10 pt-16">
      <div
        className="pointer-events-none absolute -top-[30vw] left-1/2 w-[170vw] -translate-x-1/2 opacity-10"
        aria-hidden
      >
        <LogoMark style={{ width: '100%', height: 'auto', color: '#fff' }} />
      </div>

      <div className="relative">
        {eyebrow && (
          <p className="mb-4 text-center font-body text-[0.875rem] text-white/80">
            Ingénierie du bâtiment
          </p>
        )}
        <LogoWordmark style={{ width: '100%', height: 'auto', color: '#fff' }} />

        <div className="mt-8 flex justify-center">
          <MPill onClick={() => nav('/contact')}>Écrivez-nous</MPill>
        </div>

        <div className="mt-14 grid gap-10">
          <div>
            <h3 className="font-body text-[1.0625rem] text-white">À propos</h3>
            <p className="mt-3 font-body text-[0.875rem] font-light leading-[1.6] text-white/80">
              ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les
              domaines d’ingénieries du MEP/CET et VRD, actif dans la transition vers l’ère du BIM.
            </p>
            <nav className="mt-6 flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => nav('/prestations')}
                className="font-body text-[1.0625rem] text-white"
              >
                Prestation
              </button>
              <button
                type="button"
                onClick={() => nav('/portefeuille')}
                className="font-body text-[1.0625rem] text-white"
              >
                Portefeuille
              </button>
            </nav>
          </div>

          <div>
            <h3 className="font-body text-[1.0625rem] text-white">Contact</h3>
            <div className="mt-3 flex flex-col gap-1 font-body text-[0.875rem] font-light text-white/80">
              <span>Sétif, Alger</span>
              <a href="mailto:contact@engineering-studio.net">contact@engineering-studio.net</a>
              <a href="tel:+213773876214">+213 (0) 773 87 62 14</a>
            </div>
            <nav className="mt-6 flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => nav('/clients')}
                className="font-body text-[1.0625rem] text-white"
              >
                Clients
              </button>
              <button
                type="button"
                onClick={() => nav('/nouvelles')}
                className="font-body text-[1.0625rem] text-white"
              >
                Nouvelles
              </button>
            </nav>
            <div className="mt-6">
              <MMarkButton onClick={() => nav('/contact')}>Nous contacter</MMarkButton>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-8 font-body text-[0.8125rem] text-white/80">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <p className="mt-8 text-center font-body text-[0.75rem] leading-relaxed text-white/70">
          Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio
        </p>
      </div>
    </footer>
  )
}
