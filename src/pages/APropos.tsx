import { useCallback } from 'react'
import { Box, Frame, Txt } from '../design/canvas'
import { CircleButton, CircleImage, PillButton, Watermark } from '../components/site/atoms'
import { SiteFooter } from '../components/site/SiteFooter'
import { LogoWordmark } from '../brand/vectors'
import { useTransition } from '../context/TransitionContext'

/**
 * À propos — Figma frame 1920 x 16200.
 *
 *   496     hero title
 *   1417    "Solutions globale en ingénierie" + the long intro column
 *   1703    three stats
 *   2580    "Etudes clé en main"
 *   3514    "Présentation" + the four disciplines
 *   4720    "Boostez vos projets" call to action
 *   5741    BIM section + four keywords
 *   6820    "Comment se déroule le processus d'étude" — four steps
 *   7937    "Prêts à travailler ensemble" wordmark block
 *   8883    "Nos points forts" — five outlined circles
 *   9944    software photo + heading, then the 8x4 software grid
 *   14262   "Nos garanties" diagram
 *   15252   footer
 */
const CANVAS_H = 16200

/** The four disciplines under "Présentation" — Figma (219 … 1537, 3903.8). */
const DISCIPLINES = [
  { n: '01', label: 'MEP', ring: 219, box: 255, w: 68, nx: 0, lx: 3 },
  { n: '02', label: 'VRD', ring: 654, box: 685, w: 81, nx: 0, lx: 10 },
  { n: '03', label: 'Topographie', ring: 1097, box: 1084, w: 167, nx: 43, lx: 0 },
  { n: '04', label: 'BIM', ring: 1537, box: 1567, w: 82, nx: 0, lx: 15 },
]

/** The four process steps — Figma (381 … 1410, 7075.9). */
const STEPS = [
  { n: '01', label: 'Planification\ndu projet', ring: 393, box: 381, w: 163, nx: 47 },
  { n: '02', label: 'Préparation\ndu plan', ring: 712, box: 703, w: 159, nx: 39 },
  { n: '03', label: 'Installation\ndu système', ring: 1051, box: 1045, w: 152, nx: 35 },
  { n: '04', label: 'Remise\nau client', ring: 1395, box: 1410, w: 110, nx: 14 },
]

/** "Nos points forts" — five 340px outlined circles at y 9143. */
const STRENGTHS = [
  { ring: 217, label: 'Réactivité', lx: 331 },
  { ring: 504, label: 'Expertise', lx: 620 },
  { ring: 790, label: 'Expérience', lx: 899 },
  { ring: 1077, label: 'Professionnalisme', lx: 1147 },
  { ring: 1363, label: 'Compétences', lx: 1457 },
]

/** Centres measured off the reference render — the export's `left` values for
 *  these centred runs are computed from the substituted font and land ~14px off. */
const BIM_KEYWORDS = [
  { cx: 347, label: 'Logiciel Revit' },
  { cx: 727, label: 'Maquette BIM' },
  { cx: 1125, label: 'Processus CAO' },
  { cx: 1538, label: 'Plan en 2D et 3D' },
]

/**
 * The software grid — four columns x eight rows of 291 x 238 cards.
 * Columns start at x 140 / 477 / 815 / 1152 / 1489 (five columns), rows at
 * y 10938, 11222, 11506, 12018, 12302, 12585, 13100, 13383, 13666.
 */
const SOFTWARE: { x: number; y: number; name: string; use: string }[] = [
  { x: 140, y: 10938, name: 'Sogelink\nMensura', use: 'VRD, Infrastructures' },
  { x: 477, y: 10938, name: 'Sogelink\nCovadis', use: 'VRD, Infrastructures' },
  { x: 815, y: 10938, name: 'Sogelink\nAutopiste', use: 'Travaux publics' },
  { x: 1152, y: 10938, name: 'Bentley\nWaterCAD', use: 'Alimentation en eau potable' },
  { x: 1488, y: 10938, name: 'Bentley\nSewerCAD', use: 'Assainissement' },

  { x: 140, y: 11222, name: 'Esri\nArcGIS', use: 'SIG' },
  { x: 477, y: 11222, name: 'Global\nMapper', use: 'SIG' },
  { x: 815, y: 11222, name: 'Caneco\nBT', use: 'Electricité CFO' },
  { x: 1152, y: 11222, name: 'Caneco\nEP', use: 'Eclairage public' },
  { x: 1488, y: 11222, name: 'Caneco\nIMP', use: 'Electricité CFO' },

  { x: 140, y: 11506, name: 'Caneco\nHT', use: 'Electricité CFO' },
  { x: 477, y: 11506, name: 'PVsyst', use: 'Photovoltaïque' },
  { x: 814, y: 11506, name: 'Dialux\nEVO', use: 'Eclairage' },
  { x: 1152, y: 11506, name: 'Relux', use: 'Eclairage' },
  { x: 1489, y: 11506, name: 'Legrand\nXLPRO', use: 'Electricité CFO' },

  { x: 140, y: 12018, name: 'Autodesk\nAutoCAD', use: 'DAO, 2D/3D' },
  { x: 477, y: 12018, name: 'Autodesk\nRevit', use: 'MEP, Architecture' },
  { x: 815, y: 12018, name: 'Autodesk\nAutoCAD MEP', use: 'MEP' },
  { x: 1152, y: 12018, name: 'Autodesk\nNavisworks', use: 'Révision 3D/BIM' },
  { x: 1489, y: 12018, name: 'Autodesk\nCivil 3D', use: 'VRD, Infrastructures' },

  { x: 140, y: 12302, name: 'Autodesk\nInfraworks', use: 'VRD, Infrastructures' },
  { x: 477, y: 12302, name: 'Autodesk\nRobot Structural\nAnalysis', use: 'Structure' },
  { x: 815, y: 12302, name: 'Cypecad\nMEP', use: 'MEP, Bilan thermique' },
  { x: 1152, y: 12302, name: 'Cype\nHVAC', use: 'MEP' },
  { x: 1489, y: 12302, name: 'Cype\nPLUMBING', use: 'Plomberie, Evacuation' },

  { x: 140, y: 12585, name: 'Cype FIRE\nHydraulic Systems', use: 'Anti-incendie' },
  { x: 477, y: 12585, name: 'Cype\nThermloads', use: 'Bilan thermique' },
  { x: 815, y: 12585, name: 'Cype\nELEC', use: 'Electricité CFO' },
  { x: 1152, y: 12585, name: 'Cype LUX', use: 'Eclairage' },
  { x: 1489, y: 12585, name: 'Traceo\nAutofluid', use: 'MEP' },

  { x: 140, y: 13100, name: 'Cype HVAC\nSchematics', use: 'Schémas de principe' },
  { x: 477, y: 13100, name: 'Cype HVAC\nRadiant floor', use: 'Plancher chauffant' },
  { x: 815, y: 13100, name: 'Open BIM\nMIDEA', use: 'Système VRF, Aérothermie' },
  { x: 1152, y: 13100, name: 'Open BIM\nDAIKIN', use: 'Système VRF, Aérothermie' },
  { x: 1489, y: 13100, name: 'Cype ELEC\nPV Systems', use: 'Photovoltaïque' },

  { x: 140, y: 13383, name: 'Eplan\nElectric', use: 'Electricité CFO' },
  { x: 477, y: 13383, name: 'Open BIM\nSwitchboard', use: 'Tableaux électriques' },
  { x: 815, y: 13383, name: 'Cype TEL\nWireless', use: 'Réseaux sans fil' },
  { x: 1152, y: 13383, name: 'Fine\nGEO 5', use: 'Géotechnique' },
  { x: 1489, y: 13383, name: 'Tekla\nStructure', use: 'Structure' },

  { x: 140, y: 13666, name: 'ArchiCAD', use: 'Architecture' },
  { x: 477, y: 13666, name: 'Lumion', use: 'Rendus 3D' },
  { x: 815, y: 13666, name: 'Twinmotion', use: 'Rendus 3D' },
  { x: 1152, y: 13666, name: 'Microsoft\nProject', use: 'Gestion de projets' },
]

/** "Nos garanties" labels — the export drops this text, so it is placed from
 *  the reference render's ink centres. */
const GUARANTEES = [
  { cx: 960, y: 14262, label: 'Fluidité\nd’informations' },
  { cx: 527, y: 14514, label: 'Rapidité\nd’exécution' },
  { cx: 1373, y: 14514, label: 'Respect\ndes délais' },
  { cx: 556, y: 14645, label: 'Écoute' },
  { cx: 1370, y: 14645, label: 'Précision' },
  { cx: 960, y: 14876, label: 'Professionnalisme' },
]

export default function APropos() {
  const { startTransition } = useTransition()
  const nav = useCallback((p: string) => startTransition(p), [startTransition])

  return (
    <Frame h={CANVAS_H}>
      <Watermark x={1067.4} y={168} size={744.6} />
      <Txt t="displayTight" x={215} y={496}>À propos</Txt>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={1427}>Solutions globale en ingénierie</Txt>
      <Txt t="h2" x={219} y={1462}>{'Etudes techniques\npluridisciplinaire'}</Txt>
      <Txt t="bodyLight" x={973} y={1426} dim>
        {`ENGINEERING STUDIO propose des études techniques pluridisciplinaire
présent dans les domaines d’ingénieries du CVC/MEP/CET et VRD,
actif dans la transition vers l’ère du BIM.

Nous intervenons tant en conception qu’en dimensionnement, sur les
ouvrages neufs ou réhabilités.

Nous répartissons notre activité entre les bâtiments d’habitation,
les bâtiments fonctionnels, les bâtiments industriels mais aussi
les ouvrages d’art, les infrastructures, les voiries et les aménagements
extérieurs.

Forts d’expériences significatives, Nous vous accompagnons tout au
long de vos projets et offrent des prestations conduites par
le triax Coût – Délai – Qualité.`}
      </Txt>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <Stat x={219} label={'Études\ntotales'} value="120+" />
      <Stat x={420} label={'Clients\nTotales'} value="60+" />
      <Stat x={619} label={"Années\nd'expérience"} value="13+" />

      {/* ── Etudes clé en main ────────────────────────────────────────────── */}
      <Box x={219} y={2580} w={1519} h={239}>
        <Txt t="h2" x={0} y={7}>{'Etudes\nclé en main'}</Txt>
        <Txt t="bodyLight" x={754} y={0} dim>
          {`Notre objectif est de maintenir le plus haut niveau de professionnalisme,
d'intégrité, de satisfaction client.

Notre offre clé en main permet au client de n'avoir qu'un seul
interlocuteur vers qui se tourner. Nous nous engageons sur
un contrat de résultat.`}
        </Txt>
        <CircleButton x={754} y={194} label="Nos prestations" onClick={() => nav('/prestations')} />
      </Box>

      {/* ── Présentation ──────────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={3514.8}>Présentation</Txt>
      <Txt t="h2" x={219} y={3549.8}>
        {`Nous fournissons à nos clients un large
éventail de compétences pour assurer la
prestation d'ingénierie la plus exhaustive`}
      </Txt>
      <Txt t="bodyLight" x={219} y={3813.8} dim>
        {`La synergie entre les différentes expertises permet de maximiser les résultats en combinant les forces de nos équipes d’ingénieurs,
en évitant les doublons d’efforts et en tirant parti des complémentarités.`}
      </Txt>
      {DISCIPLINES.map((d) => (
        <div key={d.n}>
          <Watermark x={d.ring} y={3903.8} size={141.4} />
          <Box x={d.box} y={3926} w={d.w} h={108}>
            <Txt t="stat" x={d.nx} y={0} align="center">{d.n}</Txt>
            <Txt t="leadMedium" x={d.lx} y={76} align="center" dim>{d.label}</Txt>
          </Box>
        </div>
      ))}

      {/* ── Boostez vos projets ───────────────────────────────────────────── */}
      <Txt t="leadLight" centerX y={4720} align="center">Pour mieux construire</Txt>
      <Txt t="h2" centerX y={4754.9} align="center">
        {/* Trailing space is in the design; it shifts this centred line 9px left. */}
        {'Boostez vos projets avec \nle BIM & BTP numérique'}
      </Txt>
      <PillButton x={875} y={4956} w={170} onClick={() => nav('/prestations/bim')}>
        Découvrir le BIM
      </PillButton>

      {/* ── Modélisation BIM ──────────────────────────────────────────────── */}
      <Txt t="leadLight" x={219} y={5741}>La modélisation BIM au cœur de nos projets</Txt>
      <Txt t="h2" x={219} y={5776}>
        {'Modélisation BIM : réalisez vos ouvrages\nen 3D grâce à notre expertise'}
      </Txt>
      <Txt t="bodyLight" x={219} y={5967} dim>
        {`Les projets en modélisation BIM sont devenus une habitude au cœur de notre société. Cette transformation numérique qui concerne un
acteur sur deux dans l’univers du bâtiment est une compétence acquise. Tout comme nous développons la E-réputation de notre société
d’études, la modélisation du bâtiment via est une discipline que nous maîtrisons. A vrai dire, elle est devenue indispensable pour répondre
aux besoins de nos clients.`}
      </Txt>
      {BIM_KEYWORDS.map((k) => (
        <Txt key={k.label} t="leadMedium" cx={k.cx} y={6114} align="center">{k.label}</Txt>
      ))}

      {/* ── Processus ─────────────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={6820.9} align="center">
        {"Comment se déroule\nle processus d'étude"}
      </Txt>
      <Txt t="bodyLight" centerX y={7011.9} align="center" dim>
        Nos prestations d'études sur l'ensemble des techniques de construction
      </Txt>
      {STEPS.map((s) => (
        <div key={s.n}>
          <Watermark x={s.ring} y={7075.9} size={141.4} />
          <Box x={s.box} y={7098.1} w={s.w} h={125}>
            <Txt t="stat" x={s.nx} y={0} align="center">{s.n}</Txt>
            <Txt t="leadMediumTight" x={0} y={73} align="center" dim>{s.label}</Txt>
          </Box>
        </div>
      ))}

      {/* ── Prêts à travailler ensemble ───────────────────────────────────── */}
      <Watermark x={471.9} y={7612.3} size={975.4} />
      <Txt t="lead" x={800} y={7937.8} align="center">Prêts à travailler ensemble</Txt>
      <Box x={553} y={7994.8} w={815} h={79.4}>
        <LogoWordmark style={{ width: '100%', height: '100%', color: '#fff' }} />
      </Box>
      <Txt t="bodyLight" x={532} y={8099.8} align="center" dim>
        {`Que vous ayez un projet et que vous recherchiez un partenaire d'étude technique
fiable ou que vous souhaitiez franchir une nouvelle étape dans votre projet,
nous voulons vous entendre !`}
      </Txt>
      <Txt t="lead" x={591.1} y={8222.8} align="right">Donnons vie à votre projet</Txt>
      <CircleButton x={938} y={8215.8} label="Nous contacter" onClick={() => nav('/contact')} />
      <Txt t="lead" x={1012} y={8222.8}>Appelez pour un rendez-vous</Txt>

      {/* ── Nos points forts ──────────────────────────────────────────────── */}
      <Txt t="h2" centerX y={8883} align="center">Nos points forts</Txt>
      <Txt t="bodyLight" centerX y={9001} align="center" dim>
        {`Notre connaissance des contraintes des chargés d’affaires, maîtres d’œuvre et bureaux d’études nous permet d’être réactifs
et efficaces pour satisfaire au mieux à vos attentes. Quelles que soient vos exigences, vous pouvez faire
appel à ENGINEEING STUDIO pour vous aider à réussir vos projets les plus complexes.
Le tout en répondant aux différents enjeux liés au délai, au coût et à la qualité.`}
      </Txt>
      {STRENGTHS.map((s) => (
        <div key={s.label}>
          <Box x={s.ring} y={9143} w={340} h={340} radius={170} border="#fff" opacity={0.2} />
          <Txt t="cardTitle" x={s.lx} y={9303} align="center">{s.label}</Txt>
        </div>
      ))}

      {/* ── Logiciels ─────────────────────────────────────────────────────── */}
      <CircleImage x={217} y={9944} size={633} src="/Assets/images/A Propos-logiciels.png" alt="Logiciels d'ingénierie" />
      <Txt t="h2" x={903} y={10078}>
        {`Utilisés les logiciels
d'ingénierie couvrent
la conception, calculs,
simulation et
la gestion de projets`}
      </Txt>
      {SOFTWARE.map((s) => (
        <SoftwareCard key={`${s.x}-${s.y}`} {...s} />
      ))}

      {/* ── Nos garanties ─────────────────────────────────────────────────── */}
      <Box x={451.9} y={14262} w={984.9} h={644.9}>
        <img src="/Assets/images/svg/garanties-arrows.svg" alt="" className="h-full w-full" draggable={false} />
      </Box>
      <Txt t="h2" cx={962} y={14556}>Nos garanties</Txt>
      {GUARANTEES.map((g) => (
        <Txt key={g.label} t="garantie" cx={g.cx} y={g.y} align="center">{g.label}</Txt>
      ))}

      <SiteFooter y={15252} />
    </Frame>
  )
}

function Stat({ x, label, value }: { x: number; label: string; value: string }) {
  return (
    <>
      <Txt t="xsLight" x={x} y={1703} dim>{label}</Txt>
      <Txt t="stat" x={x} y={1755}>{value}</Txt>
    </>
  )
}

/** Figma: 291 x 238, radius 30, #1a1a1a — name at y 80, use at y 190. */
function SoftwareCard({ x, y, name, use }: { x: number; y: number; name: string; use: string }) {
  return (
    <Box x={x} y={y} w={291} h={238} bg="#1a1a1a" radius={30}>
      <Txt t="cardTitle" x={29} y={80}>{name}</Txt>
      <Txt t="cardMeta" x={29} y={190} opacity={0.5}>{use}</Txt>
    </Box>
  )
}
