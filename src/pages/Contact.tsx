import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { createSubmission } from '../lib/content/store'
import { LogoButton } from '../components/LogoButton'
import { LinkedInButton } from '../components/LinkedInButton'
import { HeroShape } from '../components/HeroShape'
import { HoneypotField, submissionErrorMessage, useFormGuard } from '../components/FormGuard'
import { LIMITS } from '../lib/content/validation'
import { RevealText } from '../components/Reveal'

const faqs = [
  {
    q: 'Quels types de projets prenez-vous en charge ?',
    a: "Nous intervenons sur tout type de projets : résidentiel, tertiaire, industriel et infrastructure. Nos équipes assurent les études MEP, VRD, topographie et modélisation BIM, de l'avant-projet jusqu'à la réception des travaux.",
  },
  {
    q: 'Combien de temps dure une étude technique ?',
    a: "La durée varie selon la complexité et l'envergure du projet. Une étude de faisabilité peut prendre quelques jours, tandis qu'un dossier de conception complet peut nécessiter plusieurs semaines. Nous établissons un planning détaillé dès le démarrage.",
  },
  {
    q: 'Comment se déroule la collaboration avec vos équipes ?',
    a: "Nous commençons par une consultation approfondie pour cerner vos besoins et contraintes. Ensuite, nous établissons une proposition technique et financière. Tout au long du projet, vous bénéficiez d'un interlocuteur dédié et de points d'avancement réguliers.",
  },
  {
    q: 'Proposez-vous des prestations clé en main ?',
    a: "Oui, Engineering Studio peut coordonner l'ensemble des disciplines (MEP, VRD, topographie, BIM) au sein d'une même mission, garantissant cohérence technique et maîtrise des délais. Nous adaptons notre intervention à vos besoins.",
  },
]


function CitySection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const cityY = useTransform(scrollYProgress, [0, 1], ['40px', '-40px'])

  return (
    <section ref={ref} className="relative border-t border-white/10 overflow-hidden min-h-screen">
      {/* The box bleeds past the section top & bottom so the parallax shift
          never exposes a black gap against the footer. */}
      <motion.div style={{ y: cityY }} className="absolute -top-16 -bottom-16 inset-x-0">
        <img
          src="/Assets/images/Contact-img linkedin.png"
          alt=""
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.85 }}
        />
      </motion.div>
      <RevealText className="relative z-10 flex items-center justify-end min-h-screen px-8 sm:px-14 lg:px-gutter py-16">
        <div className="max-w-[16rem] lg:max-w-[22rem]">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.15rem] text-black leading-[1.15] lg:leading-[1.15] mb-6 lg:mb-[1.6rem]">
            Suivez notre actualité et découvrez nos travaux récentes
          </h2>
          <LinkedInButton />
        </div>
      </RevealText>
    </section>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ nom: '', prenom: '', tel: '', email: '', message: '' })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLogoY = useTransform(heroProgress, [0, 1], ['0px', '-80px'])

  const [saving, setSaving] = useState(false)
  const guard = useFormGuard()

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
        ].filter(f => f.value),
      })
      guard.mark()
      setForm({ nom: '', prenom: '', tel: '', email: '', message: '' })
      setSent(true)
    } catch (err) {
      // Never claim a message was sent when it wasn't — the visitor would
      // wait for a reply that is never coming.
      setError(submissionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-12 lg:px-gutter relative z-10">
          <h1 className="font-display font-bold text-[2.5rem] sm:text-6xl lg:text-[5.375rem] text-white leading-none lg:leading-none">
            Contact
          </h1>
        </div>
        <HeroShape y={heroLogoY} />
      </section>

      {/* ── Form section ────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-gutter py-20 lg:py-0 lg:min-h-screen flex items-center border-t border-white/10">
        <RevealText className="w-full max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[6rem]">

          {/* Left */}
          <div className="flex flex-col justify-center gap-6 lg:gap-[1.8rem]">
            <p className="font-body text-secondary text-xs lg:text-[0.95rem] tracking-widest uppercase">Contactez-nous</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.9rem] text-white leading-[1.12] lg:leading-[1.12] max-w-[19ch]">
              Nous adorons les challenges, mettez-nous à contribution&nbsp;!. N'hésitez pas à nous contacter&nbsp;!
            </h2>
            <p className="font-body text-secondary text-sm lg:text-[1.05rem] leading-[1.5] lg:leading-[1.5] max-w-[34ch]">
              Nous serons heureux de répondre à toutes vos questions et de vous aider à déterminer lequel de nos services correspond le mieux à vos besoins.
            </p>
            <a
              href="tel:+213773876214"
              className="flex items-center gap-5 text-white hover:opacity-70 transition-opacity self-start"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
                aria-hidden
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              <span className="flex flex-col gap-0.5">
                <span className="font-body text-secondary text-xs">Appelez-nous au&nbsp;:</span>
                <span className="font-display font-bold text-white text-lg">+213 (0) 773 87 62 14</span>
              </span>
            </a>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                <p className="font-display font-bold text-2xl text-white">Message envoyé !</p>
                <p className="font-body text-secondary text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                <LogoButton onClick={() => setSent(false)}>Nouveau message</LogoButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col justify-center h-full gap-3.5 lg:gap-[0.9rem]">
                {(() => {
                  const inp =
                    'w-full bg-surface border border-white/10 rounded-xl px-5 py-4 font-body text-white text-sm lg:text-[0.95rem] placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors'
                  return (
                    <>
                      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-[0.9rem]">
                        <input type="text" required maxLength={LIMITS.name} value={form.nom}
                          onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                          className={inp} placeholder="Votre nom" />
                        <input type="text" required maxLength={LIMITS.name} value={form.prenom}
                          onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                          className={inp} placeholder="Votre prénom" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-[0.9rem]">
                        <input type="tel" maxLength={LIMITS.phone} value={form.tel}
                          onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                          className={inp} placeholder="Numéro de téléphone" />
                        <input type="email" required maxLength={LIMITS.email} value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className={inp} placeholder="Email" />
                      </div>
                      <textarea required rows={5} maxLength={LIMITS.long} value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className={`${inp} resize-none`} placeholder="Rédigez votre message" />
                      {error && (
                        <p role="alert" className="font-body text-sm text-red-300 leading-relaxed">{error}</p>
                      )}
                      <div className="pt-1">
                        <LogoButton variant="pill">{saving ? 'Envoi…' : 'Envoyer le message'}</LogoButton>
                      </div>
                    </>
                  )
                })()}
              </form>
            )}
          </div>
        </RevealText>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-10 lg:px-gutter py-24 lg:py-[9rem] lg:min-h-screen flex flex-col justify-center border-t border-white/10 overflow-hidden">
        {/* subtle mark behind the heading */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <img src="/Assets/logo/Logo-seul.png" alt="" draggable={false}
            style={{ width: 'min(60vw, 22rem)', height: 'min(60vw, 22rem)', opacity: 0.12 }} />
        </div>
        <RevealText className="relative z-10 w-full max-w-content mx-auto">
          <p className="font-body text-secondary text-xs lg:text-[0.95rem] tracking-widest uppercase text-center mb-4 lg:mb-[1.1rem]">
            Vous avez des questions&nbsp;?
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] text-white leading-[1.08] lg:leading-[1.08] mb-16 lg:mb-[6rem] text-center">
            Voici les questions fréquemment posées.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[1.1rem]">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-surface/50 transition-colors"
                >
                  <span className="font-body font-medium text-white text-sm leading-snug">{faq.q}</span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white text-xs transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-white/10">
                    <p className="font-body text-secondary text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </RevealText>
      </section>

      {/* ── City illustration ───────────────────────────────────────────────── */}
      <CitySection />
    </main>
  )
}
