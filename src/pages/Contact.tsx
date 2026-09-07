import { useState } from 'react'
import { Box, Frame, Txt, u } from '../design/canvas'
import { PillButton, Watermark } from '../components/site/atoms'
import { ChevronDownIcon, LinkedInIcon, PhoneIcon } from '../brand/vectors'
import { createSubmission } from '../lib/content/store'
import { HoneypotField, submissionErrorMessage, useFormGuard } from '../components/FormGuard'
import { LIMITS } from '../lib/content/validation'
import { useIsDesktop } from '../design/useIsDesktop'
import { MBody, MCard, MH1, MH2, MH3, MHero, MPage, MSection } from '../components/mobile/kit'
import { Rise } from '../design/Rise'
import { useSeo } from '../lib/useSeo'

/**
 * Contact — Figma frame 1920 x 5400.
 *
 *   hero title      (215, 496)    90px Medium
 *   copy block      (219, 1417)   eyebrow / 40px heading / 20px light body
 *   phone call-out  (219, 1769)   366 x 68
 *   form            (1229, 1440)  472 x 318
 *   FAQ             (140, 3631)   1640 x 299 — two columns of 803 x 135 cards
 *   LinkedIn band   (0, 4320)     1920 x 1080 photo + black call to action
 */
const CANVAS_H = 5400

const FAQS = [
  {
    q: 'Comment se passe le premier\ncontact ?',
    a: `Écrivez-nous ou appelez-nous : nous fixons un premier échange
pour cerner votre projet, son périmètre et son calendrier.
Vous recevez ensuite une proposition technique et financière.`,
  },
  {
    q: 'Comment communiquer pour\nle projet ?',
    a: `Un interlocuteur dédié suit votre dossier du début à la fin,
avec des points d'avancement réguliers par e-mail, téléphone
ou visioconférence, selon ce qui vous convient le mieux.`,
  },
  {
    q: 'Comment soumettre des plans\net documents de projet ?',
    a: `Joignez-les à votre demande de devis, ou envoyez-les par e-mail.
Pour les dossiers volumineux nous mettons un espace de dépôt
à votre disposition. Tous les formats courants sont acceptés.`,
  },
  {
    q: 'Quels sont les documents mis\nà votre portée ?',
    a: `Notes de calcul, plans d'exécution, schémas de principe, maquettes
BIM et synthèses techniques — livrés aux formats natifs et PDF,
à chaque phase de la mission.`,
  },
]

export default function Contact() {
  useSeo({
    title: 'Contact — Parlons de votre projet | Engineering Studio',
    description:
      'Contactez Engineering Studio : demande de devis, prise de rendez-vous et dépôt de plans. Bureau d’études basé à Sétif, +213 (0) 773 87 62 14.',
  })
  const isDesktop = useIsDesktop()
  if (!isDesktop) return <ContactMobile />

  return (
    <Frame h={CANVAS_H}>
      <Watermark x={1067.4} y={168} size={744.6} />

      <Txt t="displayTight" x={215} y={496}>
        Contact
      </Txt>

      {/* ── Left column: copy + phone ─────────────────────────────────────── */}
      <Txt t="eyebrow" x={219} y={1417}>
        Contactez-nous
      </Txt>
      <Txt t="h4" x={219} y={1443}>
        {`Nous adorons les challenges,
mettez-nous à contribution !.
N'hésitez pas à nous
contacter !`}
      </Txt>
      <Txt t="bodyLight" x={219} y={1654} dim>
        {`Nous serons heureux de répondre à toutes vos
questions et de vous aider à déterminer lequel de
nos services correspond le mieux à vos besoins.`}
      </Txt>

      <Box x={219} y={1769} w={366} h={68}>
        <a href="tel:+213773876214" className="block transition-opacity hover:opacity-70">
          <Box x={0} y={5} w={45} h={45}>
            <PhoneIcon style={{ width: '100%', height: '100%', color: '#fff' }} />
          </Box>
          <Box x={70} y={0} w={296} h={68}>
            <Txt t="smallLight" x={0} y={0} dim>
              Appelez-nous au :
            </Txt>
            <Txt t="phone" x={0} y={13}>
              +213 (0) 773 87 62 14
            </Txt>
          </Box>
        </a>
      </Box>

      <ContactForm />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <Watermark x={719} y={2458.7} size={482.6} />
      <Txt t="lead" y={2591.7} centerX align="center">
        Vous avez des questions ?
      </Txt>
      <Txt t="h2" x={558} y={2654.7} align="center">
        {/* The design's first line carries a trailing space, which shifts the
            centred line 8px left — keep it. */}
        {'Voici les questions \nfréquemment posées.'}
      </Txt>

      <Box x={140} y={3631} w={1640}>
        {[0, 1].map((col) => (
          <Box key={col} x={col * 837} y={0} w={803}>
            {FAQS.slice(col * 2, col * 2 + 2).map((f, i) => (
              <Rise key={f.q} delay={i * 90}>
                <FaqCard {...f} />
              </Rise>
            ))}
          </Box>
        ))}
      </Box>

      {/* ── LinkedIn band ─────────────────────────────────────────────────── */}
      <Rise>
        <Box x={0} y={4320} w={1920} h={1080} clip>
          <img
            src="/Assets/images/Contact-img linkedin.png"
            alt="Sétif, Algérie"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </Box>
      </Rise>
      <Box x={1394} y={4618} w={482} h={199}>
        <Txt t="h5" x={0} y={0} color="#000">
          {'Suivez notre actualités\net découvrez nos\ntravaux récentes'}
        </Txt>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="absolute grid place-items-center transition-opacity hover:opacity-80"
          style={{
            left: 0,
            top: u(154),
            width: u(45),
            height: u(45),
            borderRadius: u(100),
            backgroundColor: '#000',
          }}
        >
          <LinkedInIcon style={{ width: u(13), height: u(13), color: '#fff' }} />
        </a>
      </Box>
    </Frame>
  )
}

/* ── FAQ card ─────────────────────────────────────────────────────────────
 * Collapsed it is exactly the Figma card: 803 x 135, radius 30, #1a1a1a,
 * title inset (59, 46), chevron at the far right. Opening it grows the card
 * into the gap the design leaves below the block.
 */
function FaqCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="relative block w-full text-left"
      style={{
        minHeight: u(135),
        marginBottom: u(29),
        borderRadius: u(30),
        backgroundColor: '#1a1a1a',
        paddingLeft: u(59),
        paddingRight: u(50),
        paddingTop: u(46),
        paddingBottom: u(45),
      }}
    >
      <Txt t="title21" flow style={{ width: u(693.2) }}>
        {q}
      </Txt>
      <span
        className="absolute transition-transform"
        style={{
          left: u(736.4),
          top: u(54.9),
          width: u(16.4),
          height: u(8.9),
          color: '#fff',
          transform: open ? 'rotate(180deg)' : undefined,
        }}
      >
        <ChevronDownIcon style={{ width: '100%', height: '100%' }} />
      </span>
      {open && (
        <Txt t="bodyLight" flow dim style={{ marginTop: u(18), width: u(693.2) }}>
          {a}
        </Txt>
      )}
    </button>
  )
}

/* ── Form ─────────────────────────────────────────────────────────────────
 * Figma: 472 x 318 grid — two 229-wide columns 14px apart, a 471-wide
 * textarea, then the pill. Fields are #1a1a1a, radius 8, 14px Light.
 */
function ContactForm({ mobile = false }: { mobile?: boolean }) {
  const [form, setForm] = useState({ nom: '', prenom: '', tel: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const guard = useFormGuard()

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      guard.check()
      await createSubmission({
        kind: 'contact',
        name: `${form.prenom} ${form.nom}`.trim(),
        email: form.email,
        phone: form.tel,
        fields: [
          { label: 'Nom', value: form.nom },
          { label: 'Prénom', value: form.prenom },
          { label: 'Téléphone', value: form.tel },
          { label: 'Email', value: form.email },
          { label: 'Message', value: form.message },
        ].filter((f) => f.value),
      })
      guard.mark()
      setForm({ nom: '', prenom: '', tel: '', email: '', message: '' })
      setSent(true)
    } catch (err) {
      setError(submissionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const label = saving ? 'Envoi…' : sent ? 'Message envoyé' : 'Envoyer le message'

  if (mobile) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <MField
          placeholder="Votre nom"
          value={form.nom}
          onChange={set('nom')}
          maxLength={LIMITS.name}
          required
        />
        <MField
          placeholder="Votre prénom"
          value={form.prenom}
          onChange={set('prenom')}
          maxLength={LIMITS.name}
          required
        />
        <MField
          placeholder="Numéro de téléphone"
          value={form.tel}
          onChange={set('tel')}
          maxLength={LIMITS.phone}
          type="tel"
        />
        <MField
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          maxLength={LIMITS.email}
          type="email"
          required
        />
        <MField
          placeholder="Rédigez votre message"
          value={form.message}
          onChange={set('message')}
          maxLength={LIMITS.long}
          textarea
          required
        />
        <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />
        <button
          type="submit"
          className="mt-3 h-12 rounded-full border border-white font-body text-[0.9375rem] text-white active:bg-white active:text-black"
        >
          {label}
        </button>
        {error && <p className="font-body text-[0.8125rem] text-red-300">{error}</p>}
      </form>
    )
  }

  return (
    <Box x={1229} y={1440} w={472} h={318}>
      <form onSubmit={handleSubmit} className="h-full">
        <Field
          x={0}
          y={0}
          w={229}
          placeholder="Votre nom"
          value={form.nom}
          onChange={set('nom')}
          maxLength={LIMITS.name}
          required
        />
        <Field
          x={243}
          y={0}
          w={229}
          placeholder="Votre prénom"
          value={form.prenom}
          onChange={set('prenom')}
          maxLength={LIMITS.name}
          required
        />
        <Field
          x={0}
          y={61}
          w={229}
          placeholder="Numéro de téléphone"
          value={form.tel}
          onChange={set('tel')}
          maxLength={LIMITS.phone}
          type="tel"
        />
        <Field
          x={243}
          y={61}
          w={229}
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          maxLength={LIMITS.email}
          type="email"
          required
        />
        <Field
          x={0}
          y={122}
          w={471}
          h={137}
          placeholder="Rédigez votre message"
          value={form.message}
          onChange={set('message')}
          maxLength={LIMITS.long}
          textarea
          required
        />

        <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />

        <PillButton x={0} y={273} w={196} type="submit">
          {label}
        </PillButton>

        {error && (
          <Txt t="smallLight" x={210} y={283} color="#ff8a8a">
            {error}
          </Txt>
        )}
      </form>
    </Box>
  )
}

/** Flow-layout field for the mobile form — same shape, thumb-sized. */
function MField({
  placeholder,
  value,
  onChange,
  maxLength,
  type = 'text',
  required,
  textarea,
}: Omit<FieldProps, 'x' | 'y' | 'w' | 'h'>) {
  const cls =
    'w-full rounded-lg bg-surface px-4 font-body text-[1rem] font-light text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40'
  const shared = { placeholder, value, onChange, maxLength, required, 'aria-label': placeholder }
  return textarea ? (
    <textarea {...shared} rows={5} className={`${cls} resize-none py-3`} />
  ) : (
    <input {...shared} type={type} className={`${cls} h-12`} />
  )
}

interface FieldProps {
  x: number
  y: number
  w: number
  h?: number
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  maxLength?: number
  type?: string
  required?: boolean
  textarea?: boolean
}

function Field({
  x,
  y,
  w,
  h = 47,
  placeholder,
  value,
  onChange,
  maxLength,
  type = 'text',
  required,
  textarea,
}: FieldProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: u(x),
    top: u(y),
    width: u(w),
    height: u(h),
    backgroundColor: '#1a1a1a',
    borderRadius: u(8),
    padding: `${u(11)} ${u(14)}`,
    color: '#fff',
    fontFamily: 'Bossa, sans-serif',
    fontWeight: 300,
    fontSize: u(14),
    lineHeight: u(25),
    resize: 'none',
  }
  const shared = {
    placeholder,
    value,
    onChange,
    maxLength,
    required,
    style,
    'aria-label': placeholder,
  }
  return textarea ? (
    <textarea {...shared} className="placeholder:text-white/50" />
  ) : (
    <input {...shared} type={type} className="placeholder:text-white/50" />
  )
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */

function ContactMobile() {
  return (
    <MPage>
      <MHero>
        <MH1>Contact</MH1>
      </MHero>

      <MSection className="py-8">
        <p className="font-body text-[0.8125rem] font-light text-white/80">Contactez-nous</p>
        <MH2 className="mt-3">
          Nous adorons les challenges, mettez-nous à contribution !. N'hésitez pas à nous contacter
          !
        </MH2>
        <MBody className="mt-5">
          Nous serons heureux de répondre à toutes vos questions et de vous aider à déterminer
          lequel de nos services correspond le mieux à vos besoins.
        </MBody>

        <a href="tel:+213773876214" className="mt-8 flex items-center gap-4">
          <PhoneIcon style={{ width: 38, height: 38, color: '#fff' }} />
          <span>
            <span className="block font-body text-[0.75rem] font-light text-white/80">
              Appelez-nous au :
            </span>
            <span className="block font-display text-[1.25rem] font-bold text-white">
              +213 (0) 773 87 62 14
            </span>
          </span>
        </a>
      </MSection>

      <MSection className="py-8">
        <ContactForm mobile />
      </MSection>

      <MSection className="py-12">
        <p className="text-center font-body text-[0.9375rem] text-white">
          Vous avez des questions ?
        </p>
        <MH2 className="mt-2 text-center">Voici les questions fréquemment posées.</MH2>
        <div className="mt-8 flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <Rise key={f.q} delay={i * 70}>
              <FaqCardMobile {...f} />
            </Rise>
          ))}
        </div>
      </MSection>

      <section className="relative">
        <img
          src="/Assets/images/Contact-img linkedin.png"
          alt="Sétif, Algérie"
          className="h-[70vh] w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-6 bottom-10">
          <MH3 className="!text-black !font-bold !text-[1.5rem]">
            Suivez notre actualités et découvrez nos travaux récentes
          </MH3>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mt-5 grid h-11 w-11 place-items-center rounded-full bg-black"
          >
            <LinkedInIcon style={{ width: 14, height: 14, color: '#fff' }} />
          </a>
        </div>
      </section>
    </MPage>
  )
}

function FaqCardMobile({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <MCard>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="font-display text-[1.0625rem] font-medium leading-[1.25] text-white">
          {q.split('\n').join(' ')}
        </span>
        <ChevronDownIcon
          style={{
            width: 15,
            height: 9,
            marginTop: 6,
            color: '#fff',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>
      {open && <MBody className="mt-4">{a}</MBody>}
    </MCard>
  )
}
