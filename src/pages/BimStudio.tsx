import { StudioPage, studioLogo } from '../components/site/StudioPage'

/** BIM Studio — Figma frame 1920 x 5400 (hero + 4 rows). */
export default function BimStudio() {
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
