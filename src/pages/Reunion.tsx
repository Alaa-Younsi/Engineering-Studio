import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { LogoFull } from '../components/LogoFull'

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

const MEETING_TYPES = ['En ligne', 'Votre bureau', 'Notre bureau']

const slide = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function Reunion() {
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const [step, setStep] = useState(0)
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

  const update = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

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

  function NavRow({ nextLabel = 'Continuer', onNext = next }: { nextLabel?: string; onNext?: () => void }) {
    return (
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
          className="bg-white hover:bg-white/85 text-black rounded-full px-6 py-2.5 text-sm font-body border border-white transition-colors"
        >
          {nextLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-auto">

      {/* Tiled logo background */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Assets/logo/Logo-seul.png')",
            backgroundSize: '80px 80px',
            backgroundRepeat: 'repeat',
            opacity: 0.10,
          }}
        />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-6 sm:px-8">
        <button onClick={() => nav('/')} className="cursor-pointer">
          <LogoFull size="sm" />
        </button>
        <button
          onClick={() => nav('/')}
          aria-label="Retour à l'accueil"
          className="text-white hover:opacity-70 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

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
              <h2 className="font-display font-bold text-2xl lg:text-[1.9rem] text-white leading-snug mb-8">
                Renseignez vos coordonnées
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Votre nom" value={form.nom} onChange={e => update('nom', e.target.value)} />
                <input className={inputCls} placeholder="Votre prénom" value={form.prenom} onChange={e => update('prenom', e.target.value)} />
                <input className={inputCls} placeholder="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                <input className={inputCls} placeholder="Mobile" type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
                <input className={inputCls} placeholder="Raison sociale" value={form.raisonSociale} onChange={e => update('raisonSociale', e.target.value)} />
                <input className={inputCls} placeholder="Sujet" value={form.sujet} onChange={e => update('sujet', e.target.value)} />
                <input className={inputCls} placeholder="jj/mm/aaaa" value={form.date} onChange={e => update('date', e.target.value)} />
                <input className={inputCls} placeholder="Sélectionnez l'heure" value={form.heure} onChange={e => update('heure', e.target.value)} />
              </div>
              <NavRow nextLabel="Continuer" />
            </motion.div>
          )}

          {/* ── 2: Type de réunion ── */}
          {step === 2 && (
            <motion.div key="r2" {...slide}
              className="bg-[#1a1a1a] rounded-2xl px-12 py-10 w-full max-w-xl text-center"
            >
              <CardLogo />
              <h2 className="font-display font-bold text-2xl lg:text-[1.9rem] text-white leading-snug mb-8">
                Choisissez le type de réunion<br />qui correspond le mieux<br />à vos besoins
              </h2>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {MEETING_TYPES.map(t => (
                  <Pill key={t} label={t} active={form.typeReunion === t} onClick={() => update('typeReunion', t)} />
                ))}
              </div>
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
                  onClick={next}
                  className="bg-transparent hover:bg-white/5 text-white rounded-full px-8 py-3 text-sm font-body border border-white/30 hover:border-white/60 transition-colors"
                >
                  Prendre une réunion
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
