import { StudioPage, studioLogo } from '../components/site/StudioPage'

/** VRD Studio — Figma frame 1920 x 11880 (hero + 10 rows). */
export default function VrdStudio() {
  return (
    <StudioPage
      logo={studioLogo('vrd-studio', 'VRD Studio', 725, 470.4)}
      imgPrefix="VRD"
      rows={[
        { title: 'Projets\nlinéaires' },
        { title: 'Alimentation\nen eau\npotable' },
        { title: 'Assainissement\net canalisations' },
        { title: 'Réseau\nanti-incendie' },
        { title: 'Hydrologie et\nCartographie' },
        { title: 'Réseaux\nélectriques' },
        { title: 'Eclairage\npublics' },
        { title: 'Aménagement\net\nenvironnement' },
        { title: 'Arrosage et\nirrigation' },
        { title: 'Etude de\nstabilité et\nblindage' },
      ]}
    />
  )
}
