import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LogoButton } from '../components/LogoButton'
import { LinkedInButton } from '../components/LinkedInButton'
import { Footer } from '../components/Footer'
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
    <section ref={ref} className="relative border-t border-white/10 overflow-hidden min-h-[55vh]">
      <motion.div style={{ y: cityY }} className="absolute inset-0">
        <img
          src="/Assets/images/Contact-img linkedin.png"
          alt=""
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.85 }}
        />
      </motion.div>
      <RevealText className="relative z-10 flex items-center justify-end min-h-[55vh] px-8 sm:px-14 lg:px-20 py-16">
        <div className="max-w-[320px]">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-black leading-snug mb-6">
            Suivez notre actualités et découvrez nos travaux récentes
          </h2>
          <LinkedInButton />
        </div>
      </RevealText>
    </section>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [sent, setSent] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLogoY = useTransform(heroProgress, [0, 1], ['0px', '-80px'])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-20 relative z-10">
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none">
            Contact
          </h1>
        </div>
        <div
          className="absolute -right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 'clamp(200px, 52vw, 540px)', height: 'clamp(200px, 52vw, 540px)' }}
        >
          <motion.div style={{ y: heroLogoY }} className="w-full h-full">
            <img src="/Assets/logo/Logo-seul.png" alt="" className="w-full h-full object-contain" style={{ opacity: 0.15 }} draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* ── Form section ────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left */}
          <div className="flex flex-col justify-center gap-8">
            <p className="font-body text-secondary text-xs tracking-widest uppercase">Nous contacter</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.6rem] text-white leading-tight max-w-[22ch]">
              Nous adorons les challenges, mettez-nous à contribution ! N'hésitez pas à nous contacter&nbsp;!
            </h2>
            <a
              href="tel:+213773876214"
              className="flex items-center gap-3 font-body text-white text-sm hover:opacity-70 transition-opacity"
            >
              <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs">✆</span>
              +213 (0) 773 87 62 14
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-secondary text-xs mb-1.5 block tracking-wide">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={form.nom}
                      onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 font-body text-white text-sm placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="font-body text-secondary text-xs mb-1.5 block tracking-wide">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 font-body text-white text-sm placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-secondary text-xs mb-1.5 block tracking-wide">Sujet</label>
                  <input
                    type="text"
                    required
                    value={form.sujet}
                    onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 font-body text-white text-sm placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div>
                  <label className="font-body text-secondary text-xs mb-1.5 block tracking-wide">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 font-body text-white text-sm placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors resize-none"
                    placeholder="Décrivez votre projet ou votre demande..."
                  />
                </div>
                <div className="pt-2">
                  <LogoButton variant="pill">Envoyer le message</LogoButton>
                </div>
              </form>
            )}
          </div>
        </RevealText>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 border-t border-white/10">
        <RevealText className="max-w-screen-xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-12 text-center">
            Voici les questions fréquemment posées.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      <Footer />
    </main>
  )
}
