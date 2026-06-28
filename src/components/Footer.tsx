import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from './LogoButton'

export function Footer() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  return (
    <footer className="bg-surface">

      {/* ── Top: large circle + title + CTA ─────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center overflow-hidden py-24 min-h-[65vh] border-t border-white/10">
        {/* Circle fills the section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="object-contain"
            style={{ width: 'min(85vw, 720px)', height: 'min(85vw, 720px)', opacity: 0.35 }}
            draggable={false}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-7">
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-none tracking-tight">
            Engineering Studio
          </h2>
          <LogoButton onClick={() => nav('/contact')}>Écrivez-nous</LogoButton>
        </div>
      </div>

      {/* ── Info grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-white/10">

        {/* À propos */}
        <div className="px-10 sm:px-14 lg:px-20 py-14 sm:border-r border-white/10">
          <h3 className="font-display font-semibold text-white text-base mb-6">À propos</h3>
          <p className="font-body text-secondary text-sm leading-relaxed mb-8 max-w-[40ch]">
            ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les domaines d'ingénieries du MEP/CET et VRD, actif dans la transition vers l'ère du BIM.
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={() => nav('/prestations')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Prestation</button>
            <button onClick={() => nav('/portefeuille')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Portefeuille</button>
          </div>
        </div>

        {/* Contact */}
        <div className="px-10 sm:px-14 lg:px-20 py-14">
          <h3 className="font-display font-semibold text-white text-base mb-6">Contact</h3>
          <div className="mb-8 flex flex-col gap-1">
            <p className="font-body text-secondary text-sm">Sétif, Alger</p>
            <p className="font-body text-secondary text-sm">contact@engineering-studio.net</p>
            <p className="font-body text-secondary text-sm">+213 (0) 773 87 62 14</p>
          </div>
          <div className="flex flex-col gap-4 mb-8">
            <button onClick={() => nav('/clients')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Clients</button>
            <button onClick={() => nav('/nouvelles')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Nouvelles</button>
          </div>
          <LogoButton onClick={() => nav('/contact')} />
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-10 sm:px-14 lg:px-20 py-5 border-t border-white/10">
        <div className="flex items-center gap-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-body text-secondary text-xs hover:text-white transition-colors">Facebook</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-body text-secondary text-xs hover:text-white transition-colors">Linkedin</a>
        </div>
        <p className="font-body text-secondary text-[10px]">
          Copyright © 2026 tous droits réservés. Design par le propriétaire Engineering Studio
        </p>
      </div>

    </footer>
  )
}
