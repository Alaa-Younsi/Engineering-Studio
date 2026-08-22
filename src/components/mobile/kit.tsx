/**
 * Mobile layout kit.
 *
 * The Figma is desktop-only (a fixed 1920 canvas), so phones get a stacked
 * translation of the same content rather than a shrunk copy of the canvas.
 * The type scale, colours and shapes are lifted from the design so the two
 * read as one site: Bossa Medium headings with -1.3% tracking, 80% white body
 * copy, 45px-tall outlined pills, and circular photography.
 */
import type { ReactNode } from 'react'
import { LogoMark } from '../../brand/vectors'

/**
 * Page shell. No top padding of its own — every mobile page opens with an
 * `MHero`, which owns the space under the fixed header.
 */
export function MPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`bg-bg ${className}`}>{children}</main>
}

/** A vertical block with the standard gutter and rhythm. */
export function MSection({
  children, className = '', pad = true,
}: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`${pad ? 'px-6' : ''} py-16 ${className}`}>{children}</section>
  )
}

export function MEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-body text-[0.8125rem] font-light tracking-[-0.02em] text-white/70">
      {children}
    </p>
  )
}

export function MH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[2.375rem] font-medium leading-[1.04] tracking-[-0.0133em] text-white">
      {children}
    </h1>
  )
}

export function MH2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[1.875rem] font-medium leading-[1.1] tracking-[-0.0133em] text-white ${className}`}>
      {children}
    </h2>
  )
}

export function MH3({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`font-display text-[1.25rem] font-medium leading-[1.15] tracking-[-0.0133em] text-white ${className}`}>
      {children}
    </h3>
  )
}

/**
 * Body copy. The design's hard line breaks are dropped so phones can re-wrap,
 * but blank lines — which separate paragraphs — are kept. Pair with
 * `whitespace-pre-line` when the copy has paragraphs.
 */
export function MBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-body text-[0.9375rem] font-light leading-[1.6] text-white/80 ${className}`}>
      {typeof children === 'string' ? children.replace(/(?<![\n])\n(?![\n])/g, ' ') : children}
    </p>
  )
}

/** Outlined pill — the design's shape, sized for a thumb. */
export function MPill({
  children, onClick, type = 'button',
}: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex h-11 items-center rounded-full border border-white px-6 font-body text-[0.875rem] text-white transition-colors active:bg-white active:text-black"
    >
      {children}
    </button>
  )
}

/**
 * The mark button. On touch there is no hover, so the label sits beside the
 * disc permanently — the same end state the desktop hover animates to.
 */
export function MMarkButton({
  children, onClick,
}: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-3 rounded-full bg-white pl-3 pr-5 font-body text-[0.875rem] text-black"
    >
      <LogoMark style={{ width: 18, height: 18, color: '#000' }} />
      {children}
    </button>
  )
}

/** Circular photo, matching the desktop discs. */
export function MCircleImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto aspect-square w-[78vw] max-w-[22rem] overflow-hidden rounded-full">
      <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
    </div>
  )
}

/** The 10%-opacity mark the design floats behind hero sections. */
export function MWatermark({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute select-none opacity-10 ${className}`} aria-hidden>
      <LogoMark style={{ width: '100%', height: 'auto', color: '#fff' }} />
    </div>
  )
}

/**
 * Hero band. On the 1920 canvas every page opens the same way: the mark sits
 * behind at 10%, bleeding off the right edge, with the title in front and a
 * good deal of air above it. This is that, at phone proportions — content is
 * never flush against the header.
 *
 * `center` mirrors the studio and Prestations frames, where the mark is
 * centred behind the lockup instead of pushed right.
 */
export function MHero({
  children, center = false, className = '',
}: { children: ReactNode; center?: boolean; className?: string }) {
  return (
    <section
      // A full viewport tall, so opening a page shows the hero and nothing
      // else — the next section only appears once you scroll. `dvh` keeps that
      // true while a mobile browser's address bar collapses.
      className={`relative flex h-[100dvh] flex-col justify-center overflow-hidden px-6 pb-20 pt-24 ${className}`}
    >
      <MWatermark
        className={center
          ? 'left-1/2 top-1/2 w-[125vw] -translate-x-1/2 -translate-y-1/2'
          : '-right-[30vw] top-1/2 w-[105vw] -translate-y-1/2'}
      />
      <div className={`relative ${center ? 'flex flex-col items-center text-center' : ''}`}>
        {children}
      </div>
    </section>
  )
}

/** Dark rounded card — the #1a1a1a tiles used across the design. */
export function MCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.25rem] bg-surface p-5 ${className}`}>{children}</div>
  )
}

/** A centred heading block: eyebrow, heading, body. */
export function MIntro({
  eyebrow, title, body, className = '',
}: { eyebrow?: string; title: ReactNode; body?: string; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && <MEyebrow>{eyebrow}</MEyebrow>}
      <MH2>{title}</MH2>
      {body && <MBody className="mt-4">{body}</MBody>}
    </div>
  )
}
