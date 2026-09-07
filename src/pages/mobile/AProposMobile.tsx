import { MobileFooter } from '../../components/mobile/MobileFooter'
import {
  MBody,
  MCard,
  MCircleImage,
  MEyebrow,
  MH1,
  MH2,
  MHero,
  MMarkButton,
  MPage,
  MPill,
  MSection,
} from '../../components/mobile/kit'
import { Rise } from '../../design/Rise'
import {
  BIM_KEYWORDS,
  DISCIPLINES,
  GUARANTEES,
  SOFTWARE,
  STEPS,
  STRENGTHS,
} from '../../data/apropos'

/**
 * À propos, stacked for phones. Same content and order as the 1920 canvas —
 * the desktop page's data tables are reused verbatim so the two never drift.
 */
const STATS = [
  { value: '120+', label: 'Études totales' },
  { value: '60+', label: 'Clients Totales' },
  { value: '13+', label: "Années d'expérience" },
]

const INTRO = `ENGINEERING STUDIO propose des études techniques pluridisciplinaire présent dans les domaines d’ingénieries du CVC/MEP/CET et VRD, actif dans la transition vers l’ère du BIM.

Nous intervenons tant en conception qu’en dimensionnement, sur les ouvrages neufs ou réhabilités.

Nous répartissons notre activité entre les bâtiments d’habitation, les bâtiments fonctionnels, les bâtiments industriels mais aussi les ouvrages d’art, les infrastructures, les voiries et les aménagements extérieurs.

Forts d’expériences significatives, Nous vous accompagnons tout au long de vos projets et offrent des prestations conduites par le triax Coût – Délai – Qualité.`

const CLE_EN_MAIN = `Notre objectif est de maintenir le plus haut niveau de professionnalisme, d'intégrité, de satisfaction client.

Notre offre clé en main permet au client de n'avoir qu'un seul interlocuteur vers qui se tourner. Nous nous engageons sur un contrat de résultat.`

const flat = (s: string) => s.split('\n').join(' ')

export function AProposMobile({ nav }: { nav: (p: string) => void }) {
  return (
    <MPage>
      <MHero>
        <MH1>À propos</MH1>
      </MHero>

      <MSection className="py-8">
        <MEyebrow>Solutions globale en ingénierie</MEyebrow>
        <MH2>Etudes techniques pluridisciplinaire</MH2>
        <MBody className="mt-5 whitespace-pre-line">{INTRO}</MBody>
        <div className="mt-10 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="font-body text-[0.75rem] font-light leading-tight text-white/80">
                {s.label}
              </p>
              <p className="mt-1 font-display text-[1.75rem] font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </MSection>

      <MSection className="py-8">
        <MH2>Etudes clé en main</MH2>
        <MBody className="mt-5 whitespace-pre-line">{CLE_EN_MAIN}</MBody>
        <div className="mt-7">
          <MMarkButton onClick={() => nav('/prestations')}>Nos prestations</MMarkButton>
        </div>
      </MSection>

      <MSection className="py-8">
        <MEyebrow>Présentation</MEyebrow>
        <MH2>
          Nous fournissons à nos clients un large éventail de compétences pour assurer la prestation
          d'ingénierie la plus exhaustive
        </MH2>
        <MBody className="mt-5">
          La synergie entre les différentes expertises permet de maximiser les résultats en
          combinant les forces de nos équipes d’ingénieurs, en évitant les doublons d’efforts et en
          tirant parti des complémentarités.
        </MBody>
        <div className="mt-8 grid grid-cols-2 gap-6">
          {DISCIPLINES.map((d) => (
            <div key={d.n} className="text-center">
              <p className="font-display text-[1.75rem] font-bold text-white">{d.n}</p>
              <p className="mt-1 font-display text-[1rem] font-medium text-white/80">{d.label}</p>
            </div>
          ))}
        </div>
      </MSection>

      <MSection className="py-12 text-center">
        <MEyebrow>Pour mieux construire</MEyebrow>
        <MH2>Boostez vos projets avec le BIM &amp; BTP numérique</MH2>
        <div className="mt-7">
          <MPill onClick={() => nav('/prestations/bim')}>Découvrir le BIM</MPill>
        </div>
      </MSection>

      <MSection className="py-8">
        <MEyebrow>La modélisation BIM au cœur de nos projets</MEyebrow>
        <MH2>Modélisation BIM : réalisez vos ouvrages en 3D grâce à notre expertise</MH2>
        <MBody className="mt-5">
          Les projets en modélisation BIM sont devenus une habitude au cœur de notre société. Cette
          transformation numérique qui concerne un acteur sur deux dans l’univers du bâtiment est
          une compétence acquise. Tout comme nous développons la E-réputation de notre société
          d’études, la modélisation du bâtiment via est une discipline que nous maîtrisons. A vrai
          dire, elle est devenue indispensable pour répondre aux besoins de nos clients.
        </MBody>
        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
          {BIM_KEYWORDS.map((k) => (
            <li key={k.label} className="font-display text-[1rem] font-medium text-white">
              {k.label}
            </li>
          ))}
        </ul>
      </MSection>

      <MSection className="py-8">
        <MH2 className="text-center">Comment se déroule le processus d'étude</MH2>
        <MBody className="mt-4 text-center">
          Nos prestations d'études sur l'ensemble des techniques de construction
        </MBody>
        <div className="mt-9 grid grid-cols-2 gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <p className="font-display text-[1.75rem] font-bold text-white">{s.n}</p>
              <p className="mt-1 font-display text-[1rem] font-medium leading-tight text-white/80">
                {flat(s.label)}
              </p>
            </div>
          ))}
        </div>
      </MSection>

      <MSection className="py-12 text-center">
        <p className="font-body text-[0.9375rem] text-white">Prêts à travailler ensemble</p>
        <MH2 className="mt-3">Engineering Studio</MH2>
        <MBody className="mt-5">
          Que vous ayez un projet et que vous recherchiez un partenaire d'étude technique fiable ou
          que vous souhaitiez franchir une nouvelle étape dans votre projet, nous voulons vous
          entendre !
        </MBody>
        <div className="mt-7 flex justify-center">
          <MMarkButton onClick={() => nav('/contact')}>Nous contacter</MMarkButton>
        </div>
      </MSection>

      <MSection className="py-8">
        <MH2 className="text-center">Nos points forts</MH2>
        <MBody className="mt-4 text-center">
          Notre connaissance des contraintes des chargés d’affaires, maîtres d’œuvre et bureaux
          d’études nous permet d’être réactifs et efficaces pour satisfaire au mieux à vos attentes.
          Quelles que soient vos exigences, vous pouvez faire appel à ENGINEEING STUDIO pour vous
          aider à réussir vos projets les plus complexes. Le tout en répondant aux différents enjeux
          liés au délai, au coût et à la qualité.
        </MBody>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {STRENGTHS.map((s) => (
            <li
              key={s.label}
              className="rounded-full border border-white/20 px-4 py-2 font-display text-[0.875rem] font-bold text-white"
            >
              {s.label}
            </li>
          ))}
        </ul>
      </MSection>

      <MSection className="py-8">
        <Rise>
          <MCircleImage src="/Assets/images/A Propos-logiciels.png" alt="Logiciels d'ingénierie" />
        </Rise>
        <MH2 className="mt-10">
          Utilisés les logiciels d'ingénierie couvrent la conception, calculs, simulation et la
          gestion de projets
        </MH2>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {SOFTWARE.map((s, i) => (
            <Rise key={`${s.x}-${s.y}`} delay={(i % 2) * 70}>
              <MCard className="flex min-h-[7.5rem] flex-col justify-between">
                <p className="font-display text-[1rem] font-bold leading-tight text-white">
                  {flat(s.name)}
                </p>
                <p className="mt-3 font-body text-[0.75rem] font-light leading-tight text-white/50">
                  {s.use}
                </p>
              </MCard>
            </Rise>
          ))}
        </div>
      </MSection>

      <MSection className="py-12">
        <MH2 className="text-center">Nos garanties</MH2>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {GUARANTEES.map((g) => (
            <li
              key={g.label}
              className="rounded-full border border-white/20 px-4 py-2 text-center font-display text-[0.875rem] font-bold text-white"
            >
              {flat(g.label)}
            </li>
          ))}
        </ul>
      </MSection>

      <MobileFooter />
    </MPage>
  )
}
