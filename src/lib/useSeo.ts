import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, OG_IMAGE, SITE_NAME, SITE_URL } from '../config/site'

/**
 * Per-route SEO for a client-rendered SPA.
 *
 * Static social crawlers (Facebook, WhatsApp, Telegram) don't run JS and only
 * ever see the tags baked into `index.html` — this hook is for Googlebot (which
 * does execute JS) and for correct browser-tab titles / canonical links per
 * route. It upserts the `description`, `robots`, Open Graph and Twitter tags and
 * the canonical link on mount, restores the previous `<title>` on unmount, and
 * injects an optional page-scoped JSON-LD block that is removed on unmount so a
 * page's schema never lingers onto the next route.
 */

export interface SeoOptions {
  title?: string
  description?: string
  /** Path for canonical / og:url. Defaults to the current pathname. */
  path?: string
  /** Absolute or root-relative image URL. Defaults to the site OG image. */
  image?: string
  /** Keep this route out of the index (devis / réunion funnels). */
  noindex?: boolean
  /** schema.org object injected as <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const JSON_LD_ID = 'seo-jsonld-route'

export function useSeo(options: SeoOptions) {
  const { pathname } = useLocation()
  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    path,
    image = OG_IMAGE,
    noindex = false,
    jsonLd,
  } = options

  const url = SITE_URL + (path ?? pathname)
  const absImage = image.startsWith('http') ? image : SITE_URL + image
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', absImage)
    upsertMeta('property', 'og:locale', 'fr_FR')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', absImage)

    let script: HTMLScriptElement | null = null
    if (jsonLdKey) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = JSON_LD_ID
      script.textContent = jsonLdKey
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      script?.remove()
    }
    // jsonLdKey stands in for the object identity, which changes every render.
  }, [title, description, url, absImage, noindex, jsonLdKey])
}
