import { StudioPage } from '../components/StudioPage'

const services = [
  { name: 'Levé topo',                   image: '/Assets/images/TOPO STUDIO-01.png' },
  { name: 'Implantation',               image: '/Assets/images/TOPO STUDIO-02.png' },
  { name: 'Délimitation et bornage',    image: '/Assets/images/TOPO STUDIO-03.png' },
  { name: 'Récolement et plans As-Built', image: '/Assets/images/TOPO STUDIO-04.png' },
  { name: 'Cartographie',               image: '/Assets/images/TOPO STUDIO-05.png' },
  { name: 'Topométrie industrielle',    image: '/Assets/images/TOPO STUDIO-06.png' },
  { name: 'Scan 3D',                    image: '/Assets/images/TOPO STUDIO-07.png' },
  { name: 'Assistance technique',       image: '/Assets/images/TOPO STUDIO-08.png' },
]

export default function TopoStudio() {
  return (
    <StudioPage
      logo="/Assets/logo/TOPO_STUDIO-LOGO.png"
      logoAlt="TOPO Studio"
      services={services}
    />
  )
}
