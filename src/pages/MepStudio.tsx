import { StudioPage, studioLogo } from '../components/site/StudioPage'

/** MEP Studio — Figma frame 1920 x 14040 (hero + 12 rows). */
export default function MepStudio() {
  return (
    <StudioPage
      logo={studioLogo('mep-studio', 'MEP Studio', 725, 470.4)}
      imgPrefix="MEP"
      rows={[
        { title: 'Chauffage' },
        { title: 'Ventilation' },
        { title: 'Climatisation' },
        { title: 'Désenfumage' },
        { title: 'Plomberie\nsanitaire' },
        { title: 'Evacuation\ndes eaux' },
        { title: 'Electricité\nCFO' },
        { title: 'Electricité\nCFA' },
        { title: "Lutte contre\nl'incendie" },
        { title: 'Fluides\nmédicaux' },
        { title: 'Etude\nthermique' },
        { title: 'Installation\nphotovoltaïque' },
      ]}
    />
  )
}
