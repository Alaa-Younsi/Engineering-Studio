interface LogoFullProps {
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The full brand lockup (mark + "Engineering Studio" wordmark) is a single
 * supplied asset, not type we set ourselves — the wordmark is drawn, so
 * rebuilding it in Bossa never matches. Widths come from the Figma: the navbar
 * lockup measures 134×26 @1920, and the intro frame uses the larger step.
 */
const sizeMap = {
  sm: 'w-[8.375rem]',  // 134px @1920 — navbar
  lg: 'w-[12.25rem]',  // 196px @1920 — intro frame
}

export function LogoFull({ size = 'sm', className = '' }: LogoFullProps) {
  return (
    <img
      src="/Assets/logo/LOGO_PRINCIPAL.png"
      alt="Engineering Studio"
      className={`${sizeMap[size]} h-auto object-contain select-none ${className}`}
      draggable={false}
    />
  )
}
