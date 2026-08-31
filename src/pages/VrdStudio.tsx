import { StudioPage, studioLogo } from '../components/site/StudioPage'
import { useSeo } from '../lib/useSeo'

/** VRD Studio — Figma frame 1920 x 11880 (hero + 10 rows). */
export default function VrdStudio() {
  useSeo({
    title: 'VRD Studio — Voirie, AEP, assainissement, réseaux | Engineering Studio',
    description:
      'Voirie et réseaux divers : projets linéaires, alimentation en eau potable, assainissement, réseau anti-incendie, hydrologie, réseaux électriques et éclairage public.',
  })
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
