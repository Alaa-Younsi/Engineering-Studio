import { SmartImage } from './SmartImage'

interface MediaFrameProps {
  src?: string
  alt?: string
  /** Draws the play glyph instead of the picture glyph when there is no src. */
  video?: boolean
  className?: string
  iconClassName?: string
  /**
   * The rendered slot, for the responsive `srcSet` (see SmartImage). Defaults to
   * "100vw"; pass something tighter at each call site (e.g. "64px" for a thumb).
   */
  sizes?: string
  /** Poster frame for a video tile — a still shows instantly, bytes move on play. */
  poster?: string
}

/**
 * A rounded media tile. Renders the image when `src` is set, otherwise the light
 * grey placeholder from the mockups so the layout holds its shape before the
 * client uploads anything.
 */
export function MediaFrame({
  src,
  alt = '',
  video = false,
  className = '',
  iconClassName = 'w-10 h-10',
  sizes,
  poster,
}: MediaFrameProps) {
  if (src) {
    return (
      <div className={`overflow-hidden bg-[#e2e2e2] ${className}`}>
        {video ? (
          <video
            src={src}
            controls
            preload="none"
            playsInline
            poster={poster}
            className="w-full h-full object-cover"
          />
        ) : (
          <SmartImage
            src={src}
            alt={alt}
            sizes={sizes}
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}
      </div>
    )
  }

  return (
    <div className={`bg-[#e2e2e2] flex items-center justify-center ${className}`} aria-hidden>
      <svg
        className={`${iconClassName} text-black/20`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {video ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M10 8.5v7l6-3.5-6-3.5Z" />
          </>
        ) : (
          <>
            <path d="M7 3h13a1 1 0 0 1 1 1v13" />
            <rect x="3" y="7" width="14" height="14" rx="2" />
            <circle cx="7.5" cy="11.5" r="1.2" />
            <path d="m3.5 18.5 4-4 3.5 3.5 3-3 3 3" />
          </>
        )}
      </svg>
    </div>
  )
}

export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/25 px-3.5 py-1.5 font-body text-[0.7rem] text-white/80 whitespace-nowrap">
      {children}
    </span>
  )
}
