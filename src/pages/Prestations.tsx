import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'

interface Studio {
  label: string
  logo: string
  to: string
  /** Desktop position, measured from the Figma (1920×1080). */
  pos: { left: string; top: string }
}

const STUDIOS: Studio[] = [
  { label: 'MEP Studio',  logo: '/Assets/logo/MEP_STUDIO-LOGO.png',  to: '/prestations/mep',  pos: { left: '30.406%', top: '37.222%' } },
  { label: 'TOPO Studio', logo: '/Assets/logo/TOPO_STUDIO-LOGO.png', to: '/prestations/topo', pos: { left: '60.224%', top: '37.222%' } },
  { label: 'VRD Studio',  logo: '/Assets/logo/VRD_STUDIO-LOGO.png',  to: '/prestations/vrd',  pos: { left: '30.365%', top: '55.213%' } },
  { label: 'BIM Studio',  logo: '/Assets/logo/BIM_STUDIO-LOGO.png',  to: '/prestations/bim',  pos: { left: '60.286%', top: '55.213%' } },
]

export default function Prestations() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  return (
    <main className="fixed inset-0 overflow-hidden bg-bg">
      {/*
        The mark is the page. In the Figma it is 1655px across on a 1920×1080
        frame — centred, and deliberately taller than the viewport so the four
        petals bleed off the top and bottom edges.
      */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ width: 'min(86.22vw, 153.28vh)', height: 'min(86.22vw, 153.28vh)' }}
      >
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-full h-full object-contain"
          style={{ opacity: 0.1 }}
          draggable={false}
        />
      </div>

      {/* Desktop: the four wordmarks clustered around the centre of the mark. */}
      {STUDIOS.map(s => (
        <button
          key={s.to}
          onClick={() => nav(s.to)}
          aria-label={s.label}
          className="hidden md:block absolute hover:opacity-70 transition-opacity"
          style={s.pos}
        >
          <img
            src={s.logo}
            alt={s.label}
            className="h-[5.08rem] w-auto object-contain select-none"
            draggable={false}
          />
        </button>
      ))}

      {/* Mobile / tablet: one wordmark centred in each quadrant. */}
      <div className="md:hidden absolute inset-0 grid grid-cols-2 grid-rows-2">
        {STUDIOS.map(s => (
          <button
            key={s.to}
            onClick={() => nav(s.to)}
            aria-label={s.label}
            className="flex items-center justify-center px-4 hover:opacity-70 transition-opacity"
          >
            <img
              src={s.logo}
              alt={s.label}
              className="w-full max-w-[10rem] object-contain select-none"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </main>
  )
}
