import { StudioPage } from '../components/StudioPage'

const services = [
  { name: 'Projets linéaires',              image: '/Assets/images/VRD STUDIO-01.png' },
  { name: 'Alimentation en eau potable',   image: '/Assets/images/VRD STUDIO-02.png' },
  { name: 'Assainissement et canalisations', image: '/Assets/images/VRD STUDIO-03.png' },
  { name: 'Réseau anti-incendie',          image: '/Assets/images/VRD STUDIO-04.png' },
  { name: 'Hydrologie et Cartographie',    image: '/Assets/images/VRD STUDIO-05.png' },
  { name: 'Réseaux électriques',           image: '/Assets/images/VRD STUDIO-06.png' },
  { name: 'Eclairage publics',             image: '/Assets/images/VRD STUDIO-07.png' },
  { name: 'Aménagement et environnement', image: '/Assets/images/VRD STUDIO-08.png' },
  { name: 'Arrosage et irrigation',        image: '/Assets/images/VRD STUDIO-09.png' },
  { name: 'Etude de stabilité et blindage', image: '/Assets/images/VRD STUDIO-10.png' },
]

export default function VrdStudio() {
  return (
    <StudioPage
      logo="/Assets/logo/VRD_STUDIO-LOGO.png"
      logoAlt="VRD Studio"
      services={services}
    />
  )
}
