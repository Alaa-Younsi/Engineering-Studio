import { StudioPage } from '../components/StudioPage'

const services = [
  { name: 'Chauffage',               image: '/Assets/images/MEP STUDIO-01.png' },
  { name: 'Ventilation',             image: '/Assets/images/MEP STUDIO-02.png' },
  { name: 'Climatisation',           image: '/Assets/images/MEP STUDIO-03.png' },
  { name: 'Désenfumage',             image: '/Assets/images/MEP STUDIO-04.png' },
  { name: 'Plomberie sanitaire',     image: '/Assets/images/MEP STUDIO-05.png' },
  { name: 'Evacuation des eaux',     image: '/Assets/images/MEP STUDIO-06.png' },
  { name: 'Electricité CFO',         image: '/Assets/images/MEP STUDIO-07.png' },
  { name: 'Electricité CFA',         image: '/Assets/images/MEP STUDIO-08.png' },
  { name: "Lutte contre l'incendie", image: '/Assets/images/MEP STUDIO-09.png' },
  { name: 'Fluides médicaux',        image: '/Assets/images/MEP STUDIO-10.png' },
  { name: 'Etude thermique',         image: '/Assets/images/MEP STUDIO-11.png' },
  { name: 'Installation photovoltaïque', image: '/Assets/images/MEP STUDIO-12.png' },
]

export default function MepStudio() {
  return (
    <StudioPage
      logo="/Assets/logo/MEP_STUDIO-LOGO.png"
      logoAlt="MEP Studio"
      services={services}
    />
  )
}
