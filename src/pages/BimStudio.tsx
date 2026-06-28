import { StudioPage } from '../components/StudioPage'

const services = [
  { name: 'Modélisation BIM',          image: '/Assets/images/BIM STUDIO-01.png' },
  { name: 'Synthèse BIM',              image: '/Assets/images/BIM STUDIO-02.png' },
  { name: 'Optimisation de la conception', image: '/Assets/images/BIM STUDIO-03.png' },
  { name: 'Scan to BIM',               image: '/Assets/images/BIM STUDIO-04.png' },
]

export default function BimStudio() {
  return (
    <StudioPage
      logo="/Assets/logo/BIM_STUDIO-LOGO.png"
      logoAlt="BIM Studio"
      services={services}
    />
  )
}
