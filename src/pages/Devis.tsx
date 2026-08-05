import { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { createSubmission, uploadAttachments } from '../lib/content/store'
import { ATTACHMENTS, isEmail, isPhone, validateAttachments } from '../lib/content/validation'
import { HoneypotField, submissionErrorMessage, useFormGuard } from '../components/FormGuard'
import { LogoField } from '../components/LogoField'

interface FormData {
  societyType: string
  raisonSociale: string
  wilaya: string
  nom: string
  prenom: string
  email: string
  mobile: string
  titreProjet: string
  lieuProjet: string
  typeEtudes: string[]
  contexte: string
}

const SOCIETY_TYPES = ["Bureau d'études", 'Entreprise', 'Autres']
const STUDY_TYPES = ['MEP/CET', 'VRD', 'Topographie', 'BIM', 'Clé en main']

const slide = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function Devis() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    societyType: '',
    raisonSociale: '',
    wilaya: '',
    nom: '',
    prenom: '',
    email: '',
    mobile: '',
    titreProjet: '',
    lieuProjet: '',
    typeEtudes: [],
    contexte: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const guard = useFormGuard()

  const update = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleStudy = (type: string) =>
    setForm(prev => ({
      ...prev,
      typeEtudes: prev.typeEtudes.includes(type)
        ? prev.typeEtudes.filter(t => t !== type)
        : [...prev.typeEtudes, type],
    }))

  /** What must be answered before each step may be left. */
  const stepError = (s: number): string | null => {
    switch (s) {
      case 1: return form.societyType ? null : 'Choisissez le type de votre société.'
      case 2: return form.raisonSociale.trim() ? null : 'Indiquez la raison sociale.'
      case 3: return form.nom.trim() && form.prenom.trim() ? null : 'Indiquez vos nom et prénom.'
      case 4:
        if (!isEmail(form.email.trim())) return 'Saisissez un email valide.'
        if (form.mobile && !isPhone(form.mobile)) return 'Saisissez un numéro de mobile valide.'
        return null
      case 5: return form.titreProjet.trim() ? null : 'Indiquez le titre du projet.'
      case 6: return form.typeEtudes.length > 0 ? null : "Choisissez au moins un type d'études."
      default: return null
    }
  }

  const next = () => {
    const problem = stepError(step)
    if (problem) { setError(problem); return }
    setError(null)
    setStep(s => s + 1)
  }
  const back = () => { setError(null); setStep(s => s - 1) }

  const pickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? [])
    try {
      validateAttachments(picked)
      setFiles(picked)
      setError(null)
    } catch (err) {
      setError(submissionErrorMessage(err))
    }
  }

  const submit = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      guard.check()
      const attachments = await uploadAttachments(files)
      await createSubmission({
        kind: 'devis',
        name: `${form.prenom} ${form.nom}`.trim(),
        email: form.email,
        phone: form.mobile,
        attachments,
        fields: [
          { label: 'Type de société', value: form.societyType },
          { label: 'Raison sociale', value: form.raisonSociale },
          { label: 'Wilaya', value: form.wilaya },
          { label: 'Nom', value: form.nom },
          { label: 'Prénom', value: form.prenom },
          { label: 'Email', value: form.email },
          { label: 'Mobile', value: form.mobile },
          { label: 'Titre de projet', value: form.titreProjet },
          { label: 'Lieu de projet', value: form.lieuProjet },
          { label: "Type d'études", value: form.typeEtudes.join(', ') },
          { label: 'Contexte', value: form.contexte },
        ].filter(f => f.value),
      })
      guard.mark()
      setStep(s => s + 1)
    } catch (err) {
      // Only advance to the confirmation once the request is genuinely stored.
      setError(submissionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full bg-black/40 border border-white/15 rounded-full px-5 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-white/40 transition-colors'

  function CardLogo() {
    return (
      <div className="flex justify-center mb-6">
        <img
          src="/Assets/logo/Logo-seul.png"
          alt=""
          className="w-12 h-12 object-contain"
          draggable={false}
        />
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

  function NavRow({ nextLabel = 'Suivant', onNext = next }: { nextLabel?: string; onNext?: () => void }) {
    return (
      <>
      {error && (
        <p role="alert" className="font-body text-red-300 text-sm mt-6 leading-relaxed">{error}</p>
      )}
      <div className="flex items-center justify-center gap-4 mt-8">
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
          onClick={onNext}
          className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full px-6 py-2.5 text-sm font-body border border-white/15 transition-colors"
        >
          {nextLabel}
        </button>
      </div>
      </>
    )
  }

  return (
    <div className="fixed inset-0 overflow-auto">

      {/* Spaced logo-coin background */}
      <LogoField />
      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />

      {/* Centered card area */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-24 px-4">
        <AnimatePresence mode="wait">

          {/* ── 0: Intro ── */}
          {step === 0 && (
            <motion.div key="s0" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-14 py-16 w-full max-w-xl text-center"
            >
              <h1 className="font-display font-bold text-5xl lg:text-[3.5rem] text-white leading-none lg:leading-none mb-4">
                Obtenez<br />un devis
              </h1>
              <p className="font-body text-white/40 text-sm mb-10">Notre offre. Etudes clé en main</p>
              <button
                onClick={next}
                className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full px-8 py-3 text-sm font-body border border-white/15 transition-colors"
              >
                Commencer le partenariat
              </button>
            </motion.div>
          )}

          {/* ── 1: Type de société ── */}
          {step === 1 && (
            <motion.div key="s1" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Choisissez le type de<br />votre société ?
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {SOCIETY_TYPES.map(t => (
                  <Pill key={t} label={t} active={form.societyType === t} onClick={() => update('societyType', t)} />
                ))}
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 2: Détails société ── */}
          {step === 2 && (
            <motion.div key="s2" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Veuillez nous indiquer plus<br />détails de votre société
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Raison sociale" value={form.raisonSociale} onChange={e => update('raisonSociale', e.target.value)} />
                <input className={inputCls} placeholder="Wilaya" value={form.wilaya} onChange={e => update('wilaya', e.target.value)} />
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 3: Représentant ── */}
          {step === 3 && (
            <motion.div key="s3" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Représentant de<br />la société
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Nom" value={form.nom} onChange={e => update('nom', e.target.value)} />
                <input className={inputCls} placeholder="Prénom" value={form.prenom} onChange={e => update('prenom', e.target.value)} />
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 4: Coordonnées ── */}
          {step === 4 && (
            <motion.div key="s4" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Saisissez vos<br />coordonnées
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                <input className={inputCls} placeholder="Mobile" type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 5: Projet ── */}
          {step === 5 && (
            <motion.div key="s5" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Parlez-nous de<br />votre projet
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Titre de projet" value={form.titreProjet} onChange={e => update('titreProjet', e.target.value)} />
                <input className={inputCls} placeholder="Lieu de projet" value={form.lieuProjet} onChange={e => update('lieuProjet', e.target.value)} />
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 6: Type d'études ── */}
          {step === 6 && (
            <motion.div key="s6" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Quel type d'études<br />recherchez-vous ?
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {STUDY_TYPES.map(t => (
                  <Pill key={t} label={t} active={form.typeEtudes.includes(t)} onClick={() => toggleStudy(t)} />
                ))}
              </div>
              <NavRow />
            </motion.div>
          )}

          {/* ── 7: Contexte ── */}
          {step === 7 && (
            <motion.div key="s7" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Plus de détails sur<br />votre demande
              </h2>
              <textarea
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/30 outline-none focus:border-white/40 transition-colors resize-none h-28"
                placeholder="Contexte du projet"
                value={form.contexte}
                onChange={e => update('contexte', e.target.value)}
              />
              <NavRow />
            </motion.div>
          )}

          {/* ── 8: Fichiers ── */}
          {step === 8 && (
            <motion.div key="s8" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-3xl lg:text-[2.1rem] text-white leading-snug lg:leading-snug mb-8">
                Envoyez-nous vos plans<br />afin que nous puissions vous<br />fournir un meilleur devis
              </h2>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={ATTACHMENTS.extensions.map(e => `.${e}`).join(',')}
                className="hidden"
                onChange={e => pickFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-between gap-3 mx-auto bg-black/40 border border-white/15 rounded-full px-5 py-3 text-sm text-white/50 hover:border-white/30 hover:text-white/70 transition-colors w-60"
              >
                <span className="truncate">
                  {files.length === 0
                    ? 'Ajouter des fichiers'
                    : `${files.length} fichier${files.length > 1 ? 's' : ''}`}
                </span>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              {files.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1 text-left mx-auto w-60">
                  {files.map(f => (
                    <li key={f.name} className="font-body text-white/40 text-xs truncate">{f.name}</li>
                  ))}
                </ul>
              )}
              <p className="font-body text-white/30 text-xs mt-4 leading-relaxed">
                PDF, DWG, DXF, RVT, IFC, images — {ATTACHMENTS.maxFiles} fichiers max.
                <br />Vous avez un retour sous 24h
              </p>
              <NavRow nextLabel={saving ? 'Envoi…' : 'Obtenez un devis'} onNext={submit} />
            </motion.div>
          )}

          {/* ── 9: Success ── */}
          {step === 9 && (
            <motion.div key="s9" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-12 w-full max-w-xl text-center"
            >
              <h2 className="font-display font-bold text-3xl lg:text-[2.2rem] text-white leading-snug lg:leading-snug mb-8">
                Votre demande de devis<br />est bien envoyée !
              </h2>
              <div className="relative w-64 h-64 mx-auto rounded-full bg-[#141414] overflow-hidden mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.12 }} draggable={false} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <p className="font-display text-white/40 text-sm">Bienvenue à</p>
                  <p className="font-display font-bold text-white text-base tracking-widest uppercase">
                    Engineering Studio!
                  </p>
                </div>
              </div>
              <button
                onClick={() => nav('/')}
                className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full px-8 py-3 text-sm font-body border border-white/15 transition-colors"
              >
                Accueil
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
