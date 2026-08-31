import { StudioPage, studioLogo } from '../components/site/StudioPage'
import { useSeo } from '../lib/useSeo'

/** TOPO Studio — Figma frame 1920 x 9720 (hero + 8 rows). */
export default function TopoStudio() {
  useSeo({
    title: 'TOPO Studio — Levés, implantation, bornage, scan 3D | Engineering Studio',
    description:
      'Topographie et géomètre : levés topographiques, implantation, délimitation et bornage, plans as-built, cartographie, topométrie industrielle et scan 3D.',
  })
  return (
    <StudioPage
      logo={studioLogo('topo-studio', 'TOPO Studio', 727, 466.8)}
      imgPrefix="TOPO"
      rows={[
        { title: 'Levé topo' },
        { title: 'Implantation' },
        { title: 'Délimitation\net bornage' },
        { title: 'Récolement et\nplans As-Built' },
        { title: 'Cartographie' },
        { title: 'Topométrie\nindustrielle' },
        { title: 'Scan 3D' },
        { title: 'Assistance\ntechnique' },
      ]}
    />
  )
}
