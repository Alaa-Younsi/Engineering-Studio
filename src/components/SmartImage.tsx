import { useState, type ImgHTMLAttributes } from 'react'
import { responsiveSrcSet } from '../lib/image'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> & {
  src: string
  /**
   * The slot the image actually renders into, e.g. "100vw", "44px",
   * "(max-width: 768px) 90vw, 600px". Without it the browser assumes 100vw and
   * picks the largest candidate — which defeats the whole srcset.
   */
  sizes?: string
  /** Fade in on load instead of popping. On by default. */
  fade?: boolean
}

/**
 * Drop-in `<img>` for DB-backed images. Lazy + async by default, requests a
 * width-appropriate WebP from Supabase's render endpoint, and self-heals: if a
 * srcset candidate fails (the endpoint is disabled for the project), it drops
 * the srcset once and falls back to the raw object URL — which is always valid —
 * so the page degrades to "visible but full-size" instead of a blank hole.
 */
export function SmartImage({ src, sizes, fade = true, className = '', style, ...rest }: Props) {
  const [useSrcSet, setUseSrcSet] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const srcSet = useSrcSet ? responsiveSrcSet(src) : undefined

  return (
    <img
      {...rest}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? '100vw') : undefined}
      loading={rest.loading ?? 'lazy'}
      decoding={rest.decoding ?? 'async'}
      onLoad={(e) => {
        setLoaded(true)
        rest.onLoad?.(e)
      }}
      onError={(e) => {
        if (useSrcSet && responsiveSrcSet(src)) {
          setUseSrcSet(false)
          return
        }
        setLoaded(true)
        rest.onError?.(e)
      }}
      className={className}
      style={
        fade
          ? { ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }
          : style
      }
    />
  )
}
