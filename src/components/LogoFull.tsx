interface LogoFullProps {
  size?: 'sm' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { icon: 'h-7 w-7', text: 'text-[11px] leading-[1.15]' },
  lg: { icon: 'h-16 w-16', text: 'text-[28px] leading-[1.1]' },
}

export function LogoFull({ size = 'sm', className = '' }: LogoFullProps) {
  const { icon, text } = sizeMap[size]
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/Assets/logo/Logo-seul.png"
        alt=""
        className={`${icon} object-contain select-none flex-shrink-0`}
        draggable={false}
      />
      <span className={`font-display font-bold text-white tracking-tight ${text}`}>
        Engineering
        <br />
        Studio
      </span>
    </div>
  )
}
