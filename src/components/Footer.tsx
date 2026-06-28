import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { LogoButton } from './LogoButton'

export function Footer() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  return (
    <footer className="bg-surface">

      {/* ── Top: large circle + title + CTA ─────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center overflow-hidden py-20 min-h-[55vh] border-t border-white/10">
        {/* Circle fills the section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="object-contain"
            style={{ width: 'min(90vw, 900px)', height: 'min(90vw, 900px)', opacity: 0.35 }}
            draggable={false}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-none tracking-tight">
            Engineering Studio
          </h2>
          <button
            onClick={() => nav('/contact')}
            className="rounded-full border border-white/40 px-7 py-2.5 text-sm font-body text-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Écrivez-nous
          </button>
        </div>
      </div>

      {/* ── Info grid — boxed with borders ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-white/10">

        {/* À propos */}
        <div className="px-8 sm:px-12 lg:px-16 py-10 sm:border-r border-white/10">
          <h3 className="font-display font-semibold text-white text-base mb-5">À propos</h3>
          <p className="font-body text-secondary text-xs leading-relaxed mb-7 max-w-[38ch]">
            ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les domaines d'ingénieries du MEP/CET et VRD, actif dans la transition vers l'ère du BIM.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => nav('/prestations')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Prestation</button>
            <button onClick={() => nav('/portefeuille')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Portefeuille</button>
          </div>
        </div>

        {/* Contact */}
        <div className="px-8 sm:px-12 lg:px-16 py-10">
          <h3 className="font-display font-semibold text-white text-base mb-5">Contact</h3>
          <div className="mb-6">
            <p className="font-body text-secondary text-xs leading-relaxed">Sétif, Alger</p>
            <p className="font-body text-secondary text-xs leading-relaxed">contact@engineering-studio.net</p>
            <p className="font-body text-secondary text-xs leading-relaxed">+213 (0) 773 87 62 14</p>
          </div>
          <div className="flex flex-col gap-3 mb-7">
            <button onClick={() => nav('/clients')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Clients</button>
            <button onClick={() => nav('/nouvelles')} className="font-body text-white text-sm hover:opacity-60 transition-opacity text-left">Nouvelles</button>
          </div>
          <LogoButton onClick={() => nav('/contact')} />
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 sm:px-12 lg:px-16 py-4 border-t border-white/10">
        <div className="flex items-center gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-body text-secondary text-xs hover:text-white transition-colors">Facebook</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-body text-secondary text-xs hover:text-white transition-colors">Linkedin</a>
        </div>
        <p className="font-body text-secondary text-[10px]">
          Copyright © 2026 tous droits réservés. Design par la propriétaire Engineering Studio
        </p>
      </div>

    </footer>
  )
}
