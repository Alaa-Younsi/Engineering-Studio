import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { createSubmission } from '../lib/content/store'
import { isEmail, isPhone } from '../lib/content/validation'
import { HoneypotField, submissionErrorMessage, useFormGuard } from '../components/FormGuard'
import { LogoField } from '../components/LogoField'

interface FormData {
  nom: string
  prenom: string
  email: string
  mobile: string
  raisonSociale: string
  sujet: string
  date: string
  heure: string
  typeReunion: string
}

/** `2026-08-27` (what a date input hands back) rendered as `27/08/2026`. */
function frenchDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

const MEETING_TYPES = ['En ligne', 'Votre bureau', 'Notre bureau']

const inputCls =
  'w-full bg-black/40 border border-white/15 rounded-full px-5 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-white/40 transition-colors'

function CardLogo() {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center overflow-hidden">
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-8 h-8 object-contain"
          draggable={false}
        />
      </div>
    </div>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-6 py-2.5 text-sm font-body border transition-colors ${
        active
          ? 'bg-white text-black border-white'
          : 'bg-transparent text-white border-white/25 hover:border-white/50'
      }`}
    >
      {label}
    </button>
  )
}

interface NavRowProps {
  error: string | null
  onBack: () => void
  onNext: () => void
  nextLabel?: string
}

function NavRow({ error, onBack, onNext, nextLabel = 'Continuer' }: NavRowProps) {
  return (
    <>
      {error && (
        <p role="alert" className="font-body text-red-300 text-sm mt-6 leading-relaxed">{error}</p>
      )}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#242424] hover:bg-[#2c2c2c] text-white rounded-full px-6 py-2.5 text-sm font-body border border-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
          </svg>
          Retour
        </button>
        <button
          onClick={onNext}
          className="bg-white hover:bg-white/85 text-black rounded-full px-6 py-2.5 text-sm font-body border border-white transition-colors"
        >
          {nextLabel}
        </button>
      </div>
    </>
  )
}

/**
 * A native date or time field, dressed as one of the form's pills.
 *
 * `type="date"` / `type="time"` are what actually summon the OS calendar and
 * clock, so they are used as-is rather than re-implemented; `color-scheme:
 * dark` (see `index.css`) makes Chrome paint the field and its popup to match
 * the card, and the field's own text is hidden while empty so the design's
 * placeholder can read through in the same grey as every other field.
 */
function PickerField({
  type, label, placeholder, value, onChange,
}: {
  type: 'date' | 'time'
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  // The whole pill opens the picker, not just the little indicator glyph.
  const openPicker = () => {
    try {
      ref.current?.showPicker()
    } catch {
      /* Not user-initiated, or unsupported — the indicator still works. */
    }
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        data-empty={value ? 'false' : 'true'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onClick={openPicker}
        className={`${inputCls} field-datetime`}
      />
      {!value && (
        <span className="field-datetime-placeholder pointer-events-none absolute inset-y-0 left-5 flex items-center text-sm text-white/30">
          {placeholder}
        </span>
      )}
    </div>
  )
}

const slide = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function Reunion() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const [step, setStep] = useState(0)
  const [nudge, setNudge] = useState(0)
  const [form, setForm] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    mobile: '',
    raisonSociale: '',
    sujet: '',
    date: '',
    heure: '',
    typeReunion: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const guard = useFormGuard()

  const update = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const stepError = (s: number): string | null => {
    if (s !== 1) return null
    if (!form.nom.trim() || !form.prenom.trim()) return 'Indiquez vos nom et prénom.'
    if (!isEmail(form.email.trim())) return 'Saisissez un email valide.'
    if (form.mobile && !isPhone(form.mobile)) return 'Saisissez un numéro de mobile valide.'
    if (!form.sujet.trim()) return 'Indiquez le sujet de la réunion.'
    if (form.heure && !form.date) return 'Choisissez aussi une date pour cette heure.'
    return null
  }

  const next = () => {
    const problem = stepError(step)
    if (problem) { setError(problem); return }
    setError(null)
    setStep(s => s + 1)
  }
  const back = () => { setError(null); setStep(s => s - 1) }

  const submit = async () => {
    if (saving) return
    if (!form.typeReunion) { setError('Choisissez le type de réunion.'); return }
    setSaving(true)
    setError(null)
    try {
      guard.check()
      await createSubmission({
        kind: 'reunion',
        name: `${form.prenom} ${form.nom}`.trim(),
        email: form.email,
        phone: form.mobile,
        fields: [
          { label: 'Nom', value: form.nom },
          { label: 'Prénom', value: form.prenom },
          { label: 'Email', value: form.email },
          { label: 'Mobile', value: form.mobile },
          { label: 'Raison sociale', value: form.raisonSociale },
          { label: 'Sujet', value: form.sujet },
          { label: 'Date souhaitée', value: frenchDate(form.date) },
          { label: 'Heure souhaitée', value: form.heure },
          { label: 'Type de réunion', value: form.typeReunion },
        ].filter(f => f.value),
      })
      guard.mark()
      setStep(s => s + 1)
    } catch (err) {
      // Only confirm the RDV once it is genuinely recorded.
      setError(submissionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-auto"
      // Any button press in the flow gives the background a small nudge.
      onClickCapture={(e) => { if ((e.target as HTMLElement).closest('button')) setNudge((n) => n + 1) }}
    >

      {/* Spaced logo-coin background */}
      <LogoField nudge={nudge} />
      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />

      {/* The global SiteHeader draws this page's logo and back arrow. */}

      {/* Centered card area */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-24 px-4">
        <AnimatePresence mode="wait">

          {/* ── 0: Intro ── */}
          {step === 0 && (
            <motion.div key="r0" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-14 py-16 w-full max-w-xl text-center"
            >
              <h1 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-10">
                Construisons<br />un projet<br />ensemble
              </h1>
              <button
                onClick={next}
                className="bg-transparent hover:bg-white/5 text-white rounded-full px-8 py-3 text-sm font-body border border-white/30 hover:border-white/60 transition-colors"
              >
                Demander un échange
              </button>
            </motion.div>
          )}

          {/* ── 1: Coordonnées ── */}
          {step === 1 && (
            <motion.div key="r1" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-2xl lg:text-[1.9rem] text-white leading-snug lg:leading-snug mb-8">
                Renseignez vos coordonnées
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Votre nom" value={form.nom} onChange={e => update('nom', e.target.value)} />
                <input className={inputCls} placeholder="Votre prénom" value={form.prenom} onChange={e => update('prenom', e.target.value)} />
                <input className={inputCls} placeholder="Email" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={form.email} onChange={e => update('email', e.target.value)} />
                <input className={inputCls} placeholder="Mobile" type="tel" inputMode="tel" autoComplete="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
                <input className={inputCls} placeholder="Raison sociale" value={form.raisonSociale} onChange={e => update('raisonSociale', e.target.value)} />
                <input className={inputCls} placeholder="Sujet" value={form.sujet} onChange={e => update('sujet', e.target.value)} />
                <PickerField
                  type="date"
                  label="Date souhaitée"
                  placeholder="jj/mm/aaaa"
                  value={form.date}
                  onChange={v => update('date', v)}
                />
                <PickerField
                  type="time"
                  label="Heure souhaitée"
                  placeholder="Sélectionnez l'heure"
                  value={form.heure}
                  onChange={v => update('heure', v)}
                />
              </div>
              <NavRow error={error} onBack={back} onNext={next} nextLabel="Continuer" />
            </motion.div>
          )}

          {/* ── 2: Type de réunion ── */}
          {step === 2 && (
            <motion.div key="r2" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-2xl lg:text-[1.9rem] text-white leading-snug lg:leading-snug mb-8">
                Choisissez le type de réunion<br />qui correspond le mieux<br />à vos besoins
              </h2>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {MEETING_TYPES.map(t => (
                  <Pill key={t} label={t} active={form.typeReunion === t} onClick={() => update('typeReunion', t)} />
                ))}
              </div>
              {error && (
                <p role="alert" className="font-body text-red-300 text-sm mt-6 leading-relaxed">{error}</p>
              )}
              <div className="flex items-center justify-center gap-4 mt-16">
                <button
                  onClick={back}
                  className="flex items-center gap-2 bg-[#242424] hover:bg-[#2c2c2c] text-white rounded-full px-6 py-2.5 text-sm font-body border border-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
                  </svg>
                  Retour
                </button>
                <button
                  onClick={submit}
                  className="bg-transparent hover:bg-white/5 text-white rounded-full px-8 py-3 text-sm font-body border border-white/30 hover:border-white/60 transition-colors"
                >
                  {saving ? 'Envoi…' : 'Prendre une réunion'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── 3: Confirmation ── */}
          {step === 3 && (
            <motion.div key="r3" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-16 w-full max-w-xl text-center"
            >
              <div className="relative py-8 mb-4">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img src="/Assets/logo/Logo-seul.png" alt="" className="w-64 h-64 object-contain" style={{ opacity: 0.14 }} draggable={false} />
                </div>
                <h2 className="relative z-10 font-display font-bold text-5xl lg:text-6xl text-white leading-none mb-4">
                  Confirmation
                </h2>
                <p className="relative z-10 font-body text-white/40 text-base">
                  Votre RDV a été envoyé
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => nav('/')}
                  className="bg-transparent hover:bg-white/5 text-white rounded-full px-6 py-2.5 text-sm font-body border border-white/30 hover:border-white/60 transition-colors"
                >
                  Accueil
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="bg-transparent hover:bg-white/5 text-white rounded-full px-6 py-2.5 text-sm font-body border border-white/30 hover:border-white/60 transition-colors"
                >
                  Prendre un autre réunion
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
