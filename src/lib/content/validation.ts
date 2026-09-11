import type { SubmissionAttachment, SubmissionField, SubmissionInput } from './types'

/**
 * Validation for anything a visitor can submit.
 *
 * This runs on the client, so it is a usability and abuse-cost measure, not a
 * security boundary — the authoritative limits are the CHECK constraints in
 * supabase/schema.sql, which apply no matter what calls the REST API.
 */

export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  short: 200,
  long: 4000,
  /** Max fields in one submission, so nobody can pad a row with junk. */
  fieldCount: 40,
  /** Max total characters across every field value. */
  payload: 20_000,
} as const

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/** Strip control characters (except newline/tab), collapse whitespace runs, clamp length. */
export function clean(value: string, max: number, { multiline = false } = {}): string {
  const stripped = Array.from(value)
    .filter((ch) => {
      const c = ch.codePointAt(0) ?? 0
      if (c === 9 || c === 10) return true // keep tab + newline
      return c >= 32 && c !== 127 && !(c >= 128 && c <= 159)
    })
    .join('')
  const collapsed = multiline
    ? stripped.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
    : stripped.replace(/\s+/g, ' ')
  return collapsed.trim().slice(0, max)
}

/**
 * Deliberately permissive: one @, no spaces, a dot in the domain. Anything
 * stricter rejects valid addresses, and the real check is the reply landing.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= LIMITS.email
}

export function isPhone(value: string): boolean {
  if (!value) return true // optional everywhere it appears
  const digits = value.replace(/\D/g, '')
  return /^[+()\-.\s\d]+$/.test(value) && digits.length >= 6 && digits.length <= 20
}

/**
 * Normalises a submission and rejects anything malformed or oversized.
 * Returns a new object — the caller's input is never mutated.
 */
export function validateSubmission(input: SubmissionInput): SubmissionInput {
  const name = clean(input.name ?? '', LIMITS.name)
  const email = clean(input.email ?? '', LIMITS.email)
  const phone = clean(input.phone ?? '', LIMITS.phone)

  if (!email) throw new ValidationError('Veuillez saisir votre email.')
  if (!isEmail(email)) throw new ValidationError('Cet email ne semble pas valide.')
  if (phone && !isPhone(phone))
    throw new ValidationError('Ce numéro de téléphone ne semble pas valide.')

  const source: SubmissionField[] = Array.isArray(input.fields) ? input.fields : []
  if (source.length > LIMITS.fieldCount) throw new ValidationError('Formulaire invalide.')

  const fields: SubmissionField[] = source
    .map(
      (f): SubmissionField => ({
        label: clean(String(f?.label ?? ''), LIMITS.short),
        value: clean(String(f?.value ?? ''), LIMITS.long, { multiline: true }),
      }),
    )
    .filter((f: SubmissionField) => Boolean(f.label && f.value))

  const total = fields.reduce(
    (n: number, f: SubmissionField) => n + f.label.length + f.value.length,
    0,
  )
  if (total > LIMITS.payload) throw new ValidationError('Votre message est trop long.')

  const source2: SubmissionAttachment[] = Array.isArray(input.attachments) ? input.attachments : []
  const attachments: SubmissionAttachment[] = source2.slice(0, ATTACHMENTS.maxFiles).map(
    (a): SubmissionAttachment => ({
      name: clean(String(a?.name ?? ''), LIMITS.short),
      path: clean(String(a?.path ?? ''), LIMITS.short),
      size: Number.isFinite(a?.size) ? Math.max(0, Math.trunc(a.size)) : 0,
    }),
  )

  return { kind: input.kind, name, email, phone: phone || undefined, fields, attachments }
}

/* ── Devis attachments ────────────────────────────────────────────────────── */

export const ATTACHMENTS = {
  maxFiles: 5,
  maxBytesEach: 15 * 1024 * 1024,
  maxBytesTotal: 40 * 1024 * 1024,
  /** Plans and drawings the studio actually works from, plus common documents. */
  extensions: [
    'pdf',
    'dwg',
    'dxf',
    'rvt',
    'ifc',
    'skp',
    'zip',
    'rar',
    'par',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'png',
    'jpg',
    'jpeg',
    'webp',
  ],
} as const

const formatMb = (bytes: number) => `${Math.round(bytes / (1024 * 1024))} Mo`

export function validateAttachments(files: File[]): void {
  if (files.length > ATTACHMENTS.maxFiles) {
    throw new ValidationError(`Vous pouvez joindre au maximum ${ATTACHMENTS.maxFiles} fichiers.`)
  }
  let total = 0
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!(ATTACHMENTS.extensions as readonly string[]).includes(ext)) {
      throw new ValidationError(`Format non accepté : ${file.name}`)
    }
    if (file.size > ATTACHMENTS.maxBytesEach) {
      throw new ValidationError(`${file.name} dépasse ${formatMb(ATTACHMENTS.maxBytesEach)}.`)
    }
    total += file.size
  }
  if (total > ATTACHMENTS.maxBytesTotal) {
    throw new ValidationError(
      `Vos fichiers dépassent ${formatMb(ATTACHMENTS.maxBytesTotal)} au total.`,
    )
  }
}

/* ── Client-side abuse throttle ────────────────────────────────────────────── */

const RATE_KEY = 'es_last_submit'
/** Minimum gap between two submissions from the same browser. */
const RATE_MS = 30_000
/** A human needs at least this long to fill a form; faster means a bot. */
export const MIN_FILL_MS = 3_000

export function throttleCheck(): void {
  if (typeof localStorage === 'undefined') return
  const last = Number(localStorage.getItem(RATE_KEY) ?? 0)
  if (Number.isFinite(last) && Date.now() - last < RATE_MS) {
    throw new ValidationError(
      'Vous venez déjà d’envoyer une demande. Merci de patienter un instant.',
    )
  }
}

export function throttleMark(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(RATE_KEY, String(Date.now()))
}

/** Bots fill hidden inputs and submit instantly; humans do neither. */
export function botCheck(honeypot: string, startedAt: number): void {
  if (honeypot.trim()) throw new ValidationError('Envoi refusé.')
  if (Date.now() - startedAt < MIN_FILL_MS) throw new ValidationError('Envoi refusé.')
}
