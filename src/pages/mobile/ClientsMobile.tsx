import { MobileFooter } from '../../components/mobile/MobileFooter'
import {
  MBody, MCard, MCircleImage, MEyebrow, MH1, MH2, MHero, MMarkButton, MPage, MSection,
} from '../../components/mobile/kit'
import { Rise } from '../../design/Rise'
import { LogoMark } from '../../brand/vectors'
import { useAutoCarousel } from '../../design/useAutoCarousel'
import { CLIENT_CARDS, ENGAGEMENTS, SECTORS, TESTIMONIALS } from '../../data/clients'

/** Clients, stacked for phones. Card and testimonial data come from the same
 *  module the desktop canvas uses. */
const flat = (s: string) => s.split('\n').join(' ')

export function ClientsMobile({ nav }: { nav: (p: string) => void }) {
  const carousel = useAutoCarousel<HTMLDivElement>()

  return (
    <MPage>
      <MHero><MH1>Clients</MH1></MHero>

      <MSection className="py-8">
        <MEyebrow>Nos clients</MEyebrow>
        <MH2>Découvrez nos clients et comment nous collaborons avec eux</MH2>
        <MBody className="mt-5 whitespace-pre-line">
          {`Nous travaillons principalement avec les installateurs, architectes, bureaux d’études, entreprises générales, sous-traitants, propriétaires industrielles, maîtres d’ouvrages, promoteurs.

Quel que soit votre secteur d’activité, nous pouvons vous aider à réussir vos projets, même les plus complexes. Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.

Vous pouvez compter sur nous pour vous assister à chaque étape de votre projet d’études. De la conception à le dimensionnement, nous vous garantissons des études de qualité, que ce soit pour un projet neuve ou une rénovation. Nous possédons les meilleurs moyens et logiciels pour vous fournir des prestations de qualité.`}
        </MBody>
        <div className="mt-7">
          <MMarkButton onClick={() => nav('/contact')}>Nous contacter</MMarkButton>
        </div>
      </MSection>

      <MSection className="py-10 text-center">
        <MH2>Des missions variées et des solutions adaptées à chaque client</MH2>
        <MBody className="mt-4">
          Avec ENGINEERING STUDIO à vos côtés, vous bénéficiez des meilleures solutions en matière
          d'études techniques (réseaux extérieurs et réseaux intérieurs).
        </MBody>
      </MSection>

      <MSection className="py-8">
        <MH2 className="text-center">Notre engagement envers nos clients</MH2>
        <MBody className="mt-4 text-center">
          Notre engagement envers nos clients de partout en est un par lequel nous prenons réellement
          conscience que ce sont eux qui nous fournissent du travail et des avantages. Ces clients ont
          la possibilité de s’approvisionner à de nombreuses autres sources et nous sommes honorés
          qu’ils nous choisissent. Leurs besoins sont simples. Ils veulent que l'étude soit livrée tel
          que promis et que la qualité offre la performance prévue.
        </MBody>
        <div className="mt-9 flex flex-col gap-7">
          {ENGAGEMENTS.map((e) => (
            <p
              key={e.ring}
              className="text-center font-display text-[1.0625rem] font-medium leading-[1.35] text-white/80"
            >
              {flat(e.label)}
            </p>
          ))}
        </div>
      </MSection>

      <MSection className="py-8">
        <MEyebrow>Qui sont nos clients ?</MEyebrow>
        <MH2>Secteurs d’activité</MH2>
        <MBody className="mt-5">
          ENGINEERING STUDIO intervient en Algérie et est spécialisé dans les études techniques
          d'ingénierie (réseaux extérieurs et réseaux intérieurs), également missionné pour des
          travaux topographiques. Nos clients proviennent de secteurs d’activité très variés. Cette
          diversité est une richesse qui nécessite une capacité d’adaptabilité et nous permet sans
          cesse de repousser nos limites.
        </MBody>
        <ul className="mt-7 flex flex-col gap-2">
          {SECTORS.map((s) => (
            <li key={s} className="font-body text-[1.0625rem] text-white">{s}</li>
          ))}
        </ul>
      </MSection>

      <MSection className="py-8">
        <Rise><MCircleImage src="/Assets/images/Clients-Clients.png" alt="Nos clients" /></Rise>
        <MH2 className="mt-10">
          Voici quelques exemples de clients avec lesquels nous avons eu le plaisir de collaborer
        </MH2>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {CLIENT_CARDS.map((c, i) => (
            <Rise key={`${c.x}-${c.y}`} delay={(i % 2) * 70}>
              <MCard className="relative flex min-h-[8rem] flex-col justify-between overflow-hidden">
                <span
                  className="pointer-events-none absolute right-3 top-1 font-display text-[3.25rem] font-bold text-white"
                  style={{ opacity: 0.05 }}
                  aria-hidden
                >
                  {c.num}
                </span>
                <p className="relative font-display text-[1rem] font-bold leading-tight text-white">
                  {c.lines.map((l) => l.t).join(' ')}
                </p>
                <p className="relative mt-3 font-body text-[0.75rem] font-light text-white/50">{c.sector}</p>
              </MCard>
            </Rise>
          ))}
        </div>
      </MSection>

      <MSection className="py-12 text-center">
        <MH2>Un grand merci à tous nos clients pour leur fidélité et leur confiance</MH2>
        <MBody className="mt-4">
          Nous tenons à remercier tous nos nouveaux clients qui nous ont confié la réalisation de
          leurs projets, ainsi que tous les clients qui sont fidèles aux ENGINEERING STUDIO depuis de
          nombreuses années.
        </MBody>
        <div className="mt-8 flex justify-center">
          <LogoMark style={{ width: 56, height: 56, color: '#fff' }} />
        </div>
      </MSection>

      <MSection pad={false} className="py-8">
        <div className="px-6">
          <MEyebrow>Témoignages</MEyebrow>
          <MH2>Écoutez ce que nos clients ont à dire</MH2>
        </div>
        {/* Horizontal track, like the desktop carousel — slides on its own,
            pausing for as long as it's held. */}
        <div
          ref={carousel.ref}
          className={`mt-7 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${carousel.className}`}
          onPointerDown={carousel.onPointerDown}
          onPointerMove={carousel.onPointerMove}
          onPointerUp={carousel.onPointerUp}
          onPointerCancel={carousel.onPointerCancel}
          onPointerLeave={carousel.onPointerLeave}
          onClickCapture={carousel.onClickCapture}
        >
          {TESTIMONIALS.map((t) => (
            <MCard key={t.x} className="w-[82vw] flex-shrink-0">
              <LogoMark style={{ width: 26, height: 26, color: '#fff' }} />
              <p className="mt-4 font-body text-[0.875rem] font-light leading-[1.55] text-white/50">{t.quote}</p>
              <p className="mt-5 font-display text-[1rem] font-bold leading-tight text-white">{flat(t.name)}</p>
              <p className="mt-1 font-body text-[0.75rem] font-light text-white/50">{t.role}</p>
            </MCard>
          ))}
        </div>
      </MSection>

      <MobileFooter />
    </MPage>
  )
}
