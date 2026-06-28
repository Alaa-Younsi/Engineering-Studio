import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'

export default function Prestations() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const cell = 'relative bg-surface hover:bg-[#161616] transition-colors duration-300 flex overflow-hidden'
  const text = 'relative z-10 font-display font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white leading-none tracking-tight'

  return (
    <main className="fixed inset-0 pt-16 overflow-hidden">
      <div className="relative h-full grid grid-cols-2 grid-rows-2">

        {/* Top-left: MEP — text toward bottom-right (near center intersection) */}
        <button
          onClick={() => nav('/prestations/mep')}
          className={`${cell} items-end justify-end border-b border-r border-white/10 p-10 lg:p-14 xl:p-20`}
        >
          <h2 className={`${text} text-right`}>MEP<br />Studio</h2>
        </button>

        {/* Top-right: TOPO — text toward bottom-left (near center intersection) */}
        <button
          onClick={() => nav('/prestations/topo')}
          className={`${cell} items-end justify-start border-b border-white/10 p-10 lg:p-14 xl:p-20`}
        >
          <h2 className={`${text} text-left`}>TOPO<br />Studio</h2>
        </button>

        {/* Bottom-left: VRD — text toward top-right (near center intersection) */}
        <button
          onClick={() => nav('/prestations/vrd')}
          className={`${cell} items-start justify-end border-r border-white/10 p-10 lg:p-14 xl:p-20`}
        >
          <h2 className={`${text} text-right`}>VRD<br />Studio</h2>
        </button>

        {/* Bottom-right: BIM — text toward top-left (near center intersection) */}
        <button
          onClick={() => nav('/prestations/bim')}
          className={`${cell} items-start justify-start p-10 lg:p-14 xl:p-20`}
        >
          <h2 className={`${text} text-left`}>BIM<br />Studio</h2>
        </button>

        {/* Logo-seul.png centered over grid intersection */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'min(84vh, 84vw)', height: 'min(84vh, 84vw)' }}
        >
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0)', opacity: 0.35 }}
            draggable={false}
          />
        </div>
      </div>
    </main>
  )
}
