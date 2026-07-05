import type { ReactNode } from 'react'

interface LogoButtonProps {
  onClick?: () => void
  children?: ReactNode
  className?: string
  'aria-label'?: string
  variant?: 'icon' | 'pill'
}

export function LogoButton({
  onClick,
  children,
  className = '',
  'aria-label': ariaLabel,
  variant = 'icon',
}: LogoButtonProps) {
  if (variant === 'pill') {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
        className={`group flex items-center h-10 rounded-full border border-white/60 px-5 hover:bg-white hover:border-white transition-colors duration-200 ${className}`}
      >
        <span className="whitespace-nowrap font-body text-sm text-white group-hover:text-black transition-colors duration-200">
          {children}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      className={`group inline-flex items-center h-10 rounded-full bg-white overflow-hidden max-w-[40px] hover:max-w-[18rem] transition-[max-width] duration-300 ease-out ${className}`}
    >
      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-[18px] h-[18px] object-contain"
          style={{ filter: 'brightness(0)' }}
          draggable={false}
        />
      </span>
      {children && (
        <span className="whitespace-nowrap font-body text-sm text-black pr-4">
          {children}
        </span>
      )}
    </button>
  )
}
