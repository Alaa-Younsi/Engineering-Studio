import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'

export default function Prestations() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const label =
    'absolute font-display font-bold text-white leading-[0.82] tracking-tight ' +
    'text-3xl sm:text-4xl lg:text-[3.375rem] hover:opacity-70 transition-opacity text-left whitespace-nowrap'

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

      {/* Four studio labels, clustered around the centre cross (positions from Figma) */}
      <button onClick={() => nav('/prestations/mep')} className={label} style={{ left: '30.4%', top: '37.2%' }}>
        MEP<br />Studio
      </button>
      <button onClick={() => nav('/prestations/topo')} className={label} style={{ left: '60.2%', top: '37.2%' }}>
        TOPO<br />Studio
      </button>
      <button onClick={() => nav('/prestations/vrd')} className={label} style={{ left: '30.4%', top: '55.2%' }}>
        VRD<br />Studio
      </button>
      <button onClick={() => nav('/prestations/bim')} className={label} style={{ left: '60.2%', top: '55.2%' }}>
        BIM<br />Studio
      </button>
    </main>
  )
}
