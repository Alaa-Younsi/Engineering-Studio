import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'

interface Studio {
  label: string
  to: string
  /** Desktop position, measured from the Figma. */
  pos: { left: string; top: string }
}

const STUDIOS: Studio[] = [
  { label: 'MEP', to: '/prestations/mep', pos: { left: '30.4%', top: '37.2%' } },
  { label: 'TOPO', to: '/prestations/topo', pos: { left: '60.2%', top: '37.2%' } },
  { label: 'VRD', to: '/prestations/vrd', pos: { left: '30.4%', top: '55.2%' } },
  { label: 'BIM', to: '/prestations/bim', pos: { left: '60.2%', top: '55.2%' } },
]

export default function Prestations() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const desktopLabel =
    'hidden md:block absolute font-display font-bold text-white leading-[0.82] tracking-tight ' +
    'text-4xl lg:text-[3.375rem] hover:opacity-70 transition-opacity text-left whitespace-nowrap'

  return (
    <main className="fixed inset-0 overflow-hidden bg-bg">
      {/* Logo mark — the two grey petals of the design, centred */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ width: 'min(102vh, 96vw)', height: 'min(102vh, 96vw)' }}
      >
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-full h-full object-contain"
          style={{ opacity: 0.16 }}
          draggable={false}
        />
      </div>

      {/* Cross dividers */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 pointer-events-none" />

      {/* Desktop: four labels clustered around the centre cross (positions from Figma) */}
      {STUDIOS.map(s => (
        <button key={s.to} onClick={() => nav(s.to)} className={desktopLabel} style={s.pos}>
          {s.label}
          <br />
          Studio
        </button>
      ))}

      {/* Mobile / tablet: each studio centred in its own quadrant of the cross */}
      <div className="md:hidden absolute inset-0 grid grid-cols-2 grid-rows-2">
        {STUDIOS.map(s => (
          <button
            key={s.to}
            onClick={() => nav(s.to)}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <span className="font-display font-bold text-white text-3xl sm:text-5xl leading-[0.9] tracking-tight text-center">
              {s.label}
              <br />
              Studio
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}
