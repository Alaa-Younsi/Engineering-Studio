import { StudioPage, studioLogo } from '../components/site/StudioPage'

/** TOPO Studio — Figma frame 1920 x 9720 (hero + 8 rows). */
export default function TopoStudio() {
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
