import { LogoButton } from './LogoButton'
import { RevealText } from './Reveal'

interface UnderConstructionProps {
  label: string
  onClick: () => void
}

export function UnderConstruction({ label, onClick }: UnderConstructionProps) {
  return (
    <section className="flex items-center justify-center py-28 px-6">
      <RevealText
        className="relative rounded-full bg-surface flex flex-col items-center justify-center overflow-hidden"
        style={{ width: 'min(72vw, 380px)', height: 'min(72vw, 380px)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.12 }} draggable={false} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
          <p className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
            En cours de<br />construction
          </p>
          <LogoButton onClick={onClick}>{label}</LogoButton>
        </div>
      </RevealText>
    </section>
  )
}
