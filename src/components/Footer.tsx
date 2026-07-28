import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from './LogoButton'
import { LinkedInButton } from './LinkedInButton'
import { RevealText } from './Reveal'

export function Footer() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  return (
    <footer className="relative bg-bg overflow-hidden border-t border-white/10">

      {/* ── Logo mark spans the footer as a subtle background ─────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="object-contain"
          style={{ width: 'min(95vw, 68rem)', height: 'min(95vw, 68rem)', opacity: 0.28 }}
          draggable={false}
        />
      </div>

      {/* ── Top: title + CTA ─────────────────────────────────────────────── */}
      <RevealText className="relative z-10 flex flex-col items-center justify-center text-center pt-[7rem] pb-[3.5rem] lg:pt-[9.5rem] lg:pb-[4rem]">
        <div className="flex flex-col items-center gap-5 lg:gap-[1.4rem]">
          <span className="font-body text-secondary text-xs lg:text-[0.9rem] uppercase tracking-[0.2em]">
            Ingénierie du bâtiment
          </span>
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-[5.25rem] text-white leading-none lg:leading-none tracking-tight">
            Engineering Studio
          </h2>
          <LogoButton variant="pill" onClick={() => nav('/contact')}>Écrivez-nous</LogoButton>
        </div>
      </RevealText>

      {/* ── Info grid ────────────────────────────────────────────────────── */}
      <RevealText className="relative z-10 grid grid-cols-1 sm:grid-cols-2 border-t border-white/10">

        {/* À propos */}
        <div className="px-10 sm:px-14 lg:px-gutter py-16 lg:py-[3.25rem] sm:border-r border-white/10">
          <h3 className="font-display font-semibold text-white text-base mb-6">À propos</h3>
          <p className="font-body text-white/70 text-sm leading-relaxed mb-8 max-w-[40ch]">
            ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les domaines d'ingénieries du MEP/CET et VRD, actif dans la transition vers l'ère du BIM.
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={() => nav('/prestations')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Prestation</button>
            <button onClick={() => nav('/portefeuille')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Portefeuille</button>
          </div>
        </div>

        {/* Contact */}
        <div className="px-10 sm:px-14 lg:px-gutter py-16 lg:py-[3.25rem]">
          <h3 className="font-display font-semibold text-white text-base mb-6">Contact</h3>
          <div className="mb-8 flex flex-col gap-1">
            <p className="font-body text-white/70 text-sm">Sétif, Alger</p>
            <p className="font-body text-white/70 text-sm">contact@engineering-studio.net</p>
            <p className="font-body text-white/70 text-sm">+213 (0) 773 87 62 14</p>
          </div>
          <div className="flex flex-col gap-4 mb-8">
            <button onClick={() => nav('/clients')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Clients</button>
            <button onClick={() => nav('/nouvelles')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Nouvelles</button>
          </div>
          <LogoButton onClick={() => nav('/contact')}>Nous contacter</LogoButton>
        </div>

      </RevealText>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 px-10 sm:px-14 lg:px-gutter py-6 lg:py-[1.75rem] border-t border-white/10">
        <div className="flex items-center gap-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-body text-secondary text-xs lg:text-[0.8rem] hover:text-white transition-colors">Facebook</a>
          <LinkedInButton />
        </div>
        <p className="font-body text-secondary text-[10px] lg:text-[0.8rem] sm:text-center">
          Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio
        </p>
        <span className="hidden sm:block" />
      </div>

    </footer>
  )
}
