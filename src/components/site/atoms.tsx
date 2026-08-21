/**
 * The four shapes the whole design is built from, at their Figma sizes:
 * the 45px circle button, the 45px-tall outlined pill, the 10%-opacity logo
 * watermark, and the circular photo crop.
 */
import type { ReactNode } from 'react'
import { Box, Txt, u } from '../../design/canvas'
import { LogoMark } from '../../brand/vectors'

/** Figma: 45x45 white disc, 20.1x20.1 black mark inset at 12.5. */
export function CircleButton({
  x, y, onClick, label = 'En savoir plus', invert = false,
}: {
  x?: number
  y?: number
  onClick?: () => void
  label?: string
  /** Black disc with a white mark — used over photography. */
  invert?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid place-items-center transition-opacity hover:opacity-80"
      style={{
        position: x == null && y == null ? 'relative' : 'absolute',
        left: x != null ? u(x) : undefined,
        top: y != null ? u(y) : undefined,
        width: u(45),
        height: u(45),
        borderRadius: '50%',
        backgroundColor: invert ? '#000' : '#fff',
      }}
    >
      <LogoMark
        style={{ width: u(20.1), height: u(20.1), color: invert ? '#fff' : '#000' }}
      />
    </button>
  )
}

/** Figma: h=45, border-radius 23, 1px white stroke, label 14px inset 23/10. */
export function PillButton({
  x, y, w, children, onClick, type = 'button',
}: {
  x?: number
  y?: number
  /** Explicit Figma width; omit to hug the label with 23px of padding. */
  w?: number
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const positioned = x != null || y != null
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center border-white text-white transition-colors hover:bg-white hover:text-black"
      style={{
        position: positioned ? 'absolute' : 'relative',
        left: x != null ? u(x) : undefined,
        top: y != null ? u(y) : undefined,
        width: w != null ? u(w) : 'max-content',
        height: u(45),
        borderRadius: u(23),
        borderWidth: u(1),
        borderStyle: 'solid',
        // Figma insets the label 23px from the left edge on every pill.
        padding: `0 ${u(23)}`,
      }}
    >
      <Txt t="btn" flow style={{ whiteSpace: 'nowrap' }}>
        {children}
      </Txt>
    </button>
  )
}

/**
 * The oversized mark Figma drops behind the hero and the footer at 10%.
 * It routinely bleeds past the canvas — the parent Frame clips it.
 */
export function Watermark({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <Box x={x} y={y} w={size} h={size} opacity={0.1} aria-hidden>
      <LogoMark style={{ width: '100%', height: '100%', color: '#fff' }} />
    </Box>
  )
}

/** A photo cropped to a circle. The assets in public/ are already square. */
export function CircleImage({
  x, y, size, src, alt, onClick,
}: {
  x: number
  y: number
  size: number
  src: string
  alt: string
  onClick?: () => void
}) {
  return (
    <Box x={x} y={y} w={size} h={size} clip radius="50%">
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className={`h-full w-full object-cover ${onClick ? 'cursor-pointer' : ''}`}
        draggable={false}
      />
    </Box>
  )
}
