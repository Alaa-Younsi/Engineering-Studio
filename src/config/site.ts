/**
 * Site-wide constants for SEO — the single place the public URL and the default
 * social copy live. Every meta tag, canonical link, sitemap entry and JSON-LD
 * block is built from these.
 *
 * The custom domain isn't registered yet, so `SITE_URL` points at the current
 * Vercel deployment. When the domain lands, change it here and re-run the OG /
 * sitemap scripts — `grep -rn "engineering-studio-eight.vercel.app"` finds every
 * committed copy (index.html, robots.txt, sitemap.xml).
 */

// TODO(client): swap for the custom domain once it's registered.
export const SITE_URL = 'https://engineering-studio-eight.vercel.app'

export const SITE_NAME = 'Engineering Studio'

export const DEFAULT_TITLE = 'Solutions Globales en Ingénierie | Engineering Studio'

export const DEFAULT_DESCRIPTION =
  'Bureau d’études en ingénierie basé à Sétif, Algérie : études MEP/CET, VRD, ' +
  'topographie et BIM, en régie ou clé en main, pour bureaux d’études et entreprises.'

export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const CONTACT_EMAIL = 'contact@engineering-studio.net'
export const CONTACT_PHONE_TEL = '+213773876214'
