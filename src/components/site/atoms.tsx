/**
 * The four shapes the whole design is built from, at their Figma sizes:
 * the 45px circle button, the 45px-tall outlined pill, the 10%-opacity logo
 * watermark, and the circular photo crop.
 *
 * Hover behaviour is the site's established language, kept from the previous
 * build: outlined pills invert to solid white, and the circular mark button
 * grows sideways into a pill whose label slides out after a short beat.
 * At rest both are pixel-identical to the Figma frames.
 */
import type { ReactNode } from 'react'
import { Box, Txt, u } from '../../design/canvas'
import { LogoMark } from '../../brand/vectors'

/** Figma's disc diameter, shared by every mark button on the site. */
const DISC = 45

/**
 * Figma: 45x45 white disc with the 20.1px mark inset at 12.5.
 * With a `children` label it expands on hover into a pill.
 */
export function CircleButton({
  x,
  y,
  onClick,
  label = "Jeter un coup d'œil",
  children,
  invert = false,
  plain = false,
  centerExpand = false,
}: {
  x?: number
  y?: number
  onClick?: () => void
  label?: string
  /** Optional label revealed on hover. Defaults to `label`. */
  children?: ReactNode
  /** Black disc with a white mark — used over photography. */
  invert?: boolean
  /**
   * Stay a disc on hover. For the few placements the design sets between two
   * lines of copy, where expanding would run the label over the text beside it.
   */
  plain?: boolean
  /**
   * Grow out of the disc's centre instead of its left edge. For the two
   * placements the design centres on the canvas, where growing rightwards
   * would leave the open pill visibly off-centre.
   */
  centerExpand?: boolean
}) {
  const positioned = x != null || y != null
  const text = plain ? null : (children ?? label)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group inline-flex h-fit w-fit flex-shrink-0 items-center overflow-hidden"
      style={{
        position: positioned ? 'absolute' : 'relative',
        // Anchor on the disc's centre so the pill opens both ways.
        left: x != null ? u(centerExpand ? x + DISC / 2 : x) : undefined,
        top: y != null ? u(y) : undefined,
        transform: centerExpand ? 'translateX(-50%)' : undefined,
        height: u(DISC),
        borderRadius: u(DISC),
        backgroundColor: invert ? '#000' : '#fff',
      }}
    >
      <span
        className="flex flex-shrink-0 items-center justify-center"
        style={{ width: u(45), height: u(45) }}
      >
        <LogoMark style={{ width: u(20.1), height: u(20.1), color: invert ? '#fff' : '#000' }} />
      </span>

      {/* A beat before the label slides out, so the mark reads first; the
          collapse runs immediately on leave. */}
      {text && (
        <span className="grid [grid-template-columns:0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:delay-150 group-hover:[grid-template-columns:1fr]">
          <span className="overflow-hidden">
            <span
              className="block opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-[250ms]"
              style={{ paddingRight: u(20) }}
            >
              {/*
               * `Txt` defaults to pre-wrap; inside a track animating from 0fr
               * that makes the label re-wrap on every frame, so it visibly
               * reflows while the pill opens. Pin it to one line at its full
               * width instead — the animation itself is unchanged.
               */}
              <Txt
                t="btn"
                flow
                color={invert ? '#fff' : '#000'}
                style={{ whiteSpace: 'nowrap', width: 'max-content' }}
              >
                {text}
              </Txt>
            </span>
          </span>
        </span>
      )}
    </button>
  )
}

/** Figma: h=45, border-radius 23, 1px white stroke, label 14px inset 23. */
export function PillButton({
  x,
  y,
  w,
  children,
  onClick,
  type = 'button',
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
      className="group flex items-center border-white text-white transition-colors duration-200 hover:bg-white hover:text-black"
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
      {/* Inherits, so the button's hover colour flip reaches the label. */}
      <Txt t="btn" flow color="inherit" style={{ whiteSpace: 'nowrap' }}>
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
  x,
  y,
  size,
  src,
  alt,
  onClick,
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
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: optional pointer shortcut into the section; every placement also renders a focusable CircleButton for the same route. */}
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className={`h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] ${onClick ? 'cursor-pointer' : ''}`}
        draggable={false}
      />
    </Box>
  )
}
