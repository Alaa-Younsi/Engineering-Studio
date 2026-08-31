import { StudioPage, studioLogo } from '../components/site/StudioPage'
import { useSeo } from '../lib/useSeo'

/** BIM Studio — Figma frame 1920 x 5400 (hero + 4 rows). */
export default function BimStudio() {
  useSeo({
    title: 'BIM Studio — Modélisation, synthèse, Scan to BIM | Engineering Studio',
    description:
      'BIM : modélisation multi-disciplines, synthèse et détection de clashes, optimisation de la conception et Scan to BIM à partir de nuages de points.',
  })
  return (
    <StudioPage
      logo={studioLogo('bim-studio', 'BIM Studio', 725, 470.4)}
      imgPrefix="BIM"
      rows={[
        { title: 'Modélisation\nBIM' },
        { title: 'Synthèse\nBIM' },
        { title: 'Optimisation\nde la\nconception' },
        { title: 'Scan to BIM' },
      ]}
    />
  )
}
