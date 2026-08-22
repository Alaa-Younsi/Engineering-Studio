/**
 * Figma-coordinate layout primitives.
 * ===================================
 *
 * The design (screenshots/*.jpg, public/Converted/*) is a fixed 1920px-wide
 * canvas with every element absolutely positioned. These primitives let a page
 * be written in the *same* coordinates, so "x=973 y=1420 w=731" in the Figma
 * export is literally what the JSX says — no re-derivation, nothing to drift.
 *
 * Fidelity across viewports comes from the root font-size: `index.css` /
 * `main.tsx` keep 1rem === 16px at a 1920px viewport and scale it linearly
 * with the window, so `u()` below turns design px into a unit that is
 * pixel-exact at 1920 and proportionally exact everywhere else.
 */
import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/** Design width the whole system is keyed to. */
export const DESIGN_W = 1920

/** Figma px → rem (1rem === 16px at a 1920px viewport). */
export const u = (n: number) => `${n / 16}rem`

/* ── Type styles ─────────────────────────────────────────────────────────────
 *
 * Sizes, weights and line-heights are taken verbatim from the Figma export.
 *
 * Tracking is NOT: the export renders in Inter and bakes a positive
 * letter-spacing into every span to make substituted text occupy the same
 * width as Bossa. With the real Bossa fonts those values are wrong (they run
 * text ~6% too wide). The `ls` values below were measured instead — rendering
 * each style in Bossa and fitting it to the ink extents of the reference JPGs
 * (see tools/typetest*.mjs). They reproduce the reference to within a pixel.
 */
export type TypeStyle = {
  /** font-weight; maps to a Bossa cut: 300 Light, 400 Regular, 500 Medium, 700 Bold */
  weight: 300 | 400 | 500 | 700 | 900
  size: number
  /** line-height in design px; omitted === `normal` */
  lh?: number
  /** letter-spacing in em, measured against the reference renders */
  ls: number
  /**
   * Baseline nudge in design px. Figma's "auto" line height is derived from
   * the OS/2 typo metrics while Chrome's `normal` uses hhea (Bossa: 1.285em vs
   * 1.0em), so auto-height runs land a few px low. Set where measured.
   */
  dy?: number
}

export const TYPE = {
  /** 90px page hero — "L'excellence dans …" */
  display: { weight: 500, size: 90, lh: 88, ls: -0.0133 },
  /** 90px single-line page titles — same 88px leading as the hero */
  displayTight: { weight: 500, size: 90, lh: 88, ls: -0.0133 },
  /** 69px section heading — "Installations MEP systèmes" */
  h2: { weight: 500, size: 69, lh: 73, ls: -0.0133 },
  /** 54px menu overlay links */
  h3: { weight: 500, size: 54, lh: 73, ls: -0.0133 },
  /** 40px sub-section heading */
  h4: { weight: 500, size: 40, lh: 42, ls: -0.0133 },
  /** 38px bold — the Contact call-out over the photo */
  h5: { weight: 700, size: 38, lh: 40, ls: -0.0133 },
  /** 35px step numbers */
  h6: { weight: 500, size: 35, lh: 73, ls: -0.0133 },
  /** 50px bold stat figures and step numbers */
  stat: { weight: 700, size: 50, lh: 55, ls: -0.0133 },
  /** 24px bold phone number */
  phone: { weight: 700, size: 24, lh: 55, ls: 0 },
  /** 21px card / accordion title */
  title21: { weight: 500, size: 21, lh: 22, ls: -0.0133 },
  /** 24px footer links, eyebrows, list items */
  lead: { weight: 400, size: 24, ls: -0.0405 },
  /** 24px light eyebrow above a section heading */
  leadLight: { weight: 300, size: 24, ls: -0.0405 },
  /** 24px medium label — discipline names, BIM keywords */
  leadMedium: { weight: 500, size: 24, ls: 0, dy: -6 },
  /** 24px medium label over two lines — the process steps */
  leadMediumTight: { weight: 500, size: 24, lh: 26, ls: 0 },
  /** 24px bold label — the "Nos garanties" diagram */
  garantie: { weight: 700, size: 24, lh: 22, ls: -0.0155 },
  /** 24px light eyebrow with the design's tall 84px leading */
  leadLightTall: { weight: 300, size: 24, lh: 84, ls: -0.0405 },
  /** 40px medium heading with auto leading */
  h4Wide: { weight: 500, size: 40, ls: -0.0133 },
  /** 16px light testimonial body */
  quote: { weight: 300, size: 16, lh: 21, ls: 0 },
  /** 14px light testimonial role */
  quoteRole: { weight: 300, size: 14, lh: 14, ls: 0 },
  /** 21px bold card title — software grid, strengths, guarantees */
  cardTitle: { weight: 700, size: 21, lh: 20, ls: -0.0405 },
  /** 16px light card meta */
  cardMeta: { weight: 300, size: 16, lh: 19, ls: 0 },
  /** 15px light stat label */
  xsLight: { weight: 300, size: 15, lh: 20, ls: 0 },
  /** 20px body copy */
  body: { weight: 400, size: 20, lh: 26, ls: 0 },
  /** 20px body copy, light cut — footer blurb, intro paragraphs */
  bodyLight: { weight: 300, size: 20, lh: 26, ls: 0 },
  /** 20px light eyebrow above a heading — tighter than the paragraph cut */
  eyebrow: { weight: 300, size: 20, ls: -0.038 },
  /** 16px social links, copyright, captions */
  small: { weight: 400, size: 16, lh: 26, ls: -0.0405 },
  /** 16px light captions and field labels */
  smallLight: { weight: 300, size: 16, lh: 20, ls: 0 },
  /** 15px stat labels */
  xs: { weight: 400, size: 15, lh: 20, ls: -0.0405 },
  /** 14px button labels and form fields */
  btn: { weight: 400, size: 14, lh: 26, ls: 0 },
  /** 14px light form placeholders */
  field: { weight: 300, size: 14, lh: 25, ls: 0 },
} satisfies Record<string, TypeStyle>

export type TypeName = keyof typeof TYPE

/** Widen a named style back to TypeStyle so optional fields stay reachable. */
const styleOf = (t: TypeName | TypeStyle): TypeStyle => (typeof t === 'string' ? TYPE[t] : t)

export const typeCss = (t: TypeName | TypeStyle): CSSProperties => {
  const s = styleOf(t)
  return {
    fontFamily: 'Bossa, sans-serif',
    fontWeight: s.weight,
    fontSize: u(s.size),
    lineHeight: s.lh ? u(s.lh) : 'normal',
    letterSpacing: `${s.ls}em`,
  }
}

/* ── Primitives ─────────────────────────────────────────────────────────── */

interface FrameProps {
  /** Canvas height in design px — the Figma frame height. */
  h: number
  /**
   * Single-screen frames (Prestations) must never scroll: pin the viewport
   * height and centre the canvas inside it, so a browser window shorter than
   * the 1080-tall design crops evenly instead of introducing a scrollbar.
   */
  fit?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A page canvas: 1920 design px wide, `h` tall, centred, clipping anything
 * that bleeds past its edges (the oversized logo watermarks do exactly that).
 *
 * Forwards its ref to the canvas div itself (not the `fit` wrapper) so a
 * scroll-linked effect (`framer-motion`'s `useScroll`) can target the full
 * design-px-tall element and get a clean 0–1 progress across it.
 */
export const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame(
  { h, fit, children, className = '', style }, ref,
) {
  const canvas = (
    <div
      ref={ref}
      className={`relative mx-auto overflow-hidden ${fit ? 'flex-shrink-0' : ''} ${className}`}
      style={{ width: u(DESIGN_W), height: u(h), ...style }}
    >
      {children}
    </div>
  )

  if (!fit) return canvas
  return (
    <div className="flex h-[100dvh] items-center justify-center overflow-hidden">{canvas}</div>
  )
})

export interface BoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  x?: number
  y?: number
  w?: number
  h?: number
  /** Right edge instead of width, in design px from the canvas left. */
  right?: number
  bottom?: number
  opacity?: number
  radius?: number | string
  bg?: string
  /** 1px border of this colour, matching the Figma stroke. */
  border?: string
  borderWidth?: number
  z?: number
  clip?: boolean
  style?: CSSProperties
  children?: ReactNode
}

/** An absolutely positioned box in design coordinates. */
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box({
  x = 0, y = 0, w, h, right, bottom, opacity, radius, bg, border, borderWidth = 1,
  z, clip, style, children, className = '', ...rest
}, ref) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'absolute',
        left: u(x),
        top: u(y),
        ...(w != null ? { width: u(w) } : {}),
        ...(h != null ? { height: u(h) } : {}),
        ...(right != null ? { right: u(DESIGN_W - right) } : {}),
        ...(bottom != null ? { bottom: u(bottom) } : {}),
        ...(opacity != null ? { opacity } : {}),
        ...(radius != null ? { borderRadius: typeof radius === 'number' ? u(radius) : radius } : {}),
        ...(bg ? { backgroundColor: bg } : {}),
        ...(border ? { border: `${u(borderWidth)} solid ${border}` } : {}),
        ...(z != null ? { zIndex: z } : {}),
        ...(clip ? { overflow: 'hidden' } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
})

export interface TxtProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  x?: number
  y?: number
  /** Explicit box width; omit for `max-content` (how Figma exports text). */
  w?: number
  t: TypeName | TypeStyle
  /** Pass `'inherit'` to let an ancestor (e.g. a hover-flipping button) own it. */
  color?: string
  /** Figma renders most secondary copy at 80% white. */
  dim?: boolean
  opacity?: number
  align?: 'left' | 'center' | 'right'
  /**
   * Centre the run within its positioned ancestor. The Figma export hard-codes
   * these as `left: calc(-Wpx + 50%)` — half the *substituted* text width —
   * so real centring is both simpler and closer to the design intent.
   */
  centerX?: boolean
  /** Anchor the run by its horizontal centre instead of its left edge. */
  cx?: number
  /** Position relative to the parent Box rather than absolutely. */
  flow?: boolean
  style?: CSSProperties
  children?: ReactNode
}

/**
 * A text run in design coordinates. Line breaks are explicit `<br />` children
 * (or `\n` in the string) exactly as the design sets them — never left to the
 * browser, so the copy wraps identically regardless of font loading.
 */
export function Txt({
  x = 0, y = 0, w, t, color = '#fff', dim, opacity, align = 'left',
  centerX, cx, flow, style, children, className = '', ...rest
}: TxtProps) {
  return (
    <span
      className={className}
      style={{
        ...(flow
          ? { display: 'block' }
          : {
              position: 'absolute',
              top: u(y + (styleOf(t).dy ?? 0)),
              ...(centerX
                ? { left: 0, right: 0 }
                : cx != null
                  ? { left: u(cx), transform: 'translateX(-50%)' }
                  : { left: u(x) }),
            }),
        width: centerX ? 'auto' : w != null ? u(w) : 'max-content',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
        ...(color === 'inherit' ? {} : { color }),
        opacity: opacity ?? (dim ? 0.8 : undefined),
        textAlign: align,
        ...typeCss(t),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
