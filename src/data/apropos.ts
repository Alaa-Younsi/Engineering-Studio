/**
 * À propos page content, transcribed from the Figma export
 * (public/Converted/A propos (1920x1080)/index.html). Coordinates are canvas
 * px; the mobile layout reuses the same tables so the two never drift.
 */

/** The four disciplines under "Présentation" — Figma (219 … 1537, 3903.8). */
export const DISCIPLINES = [
  { n: '01', label: 'MEP', ring: 219, box: 255, w: 68, nx: 0, lx: 3 },
  { n: '02', label: 'VRD', ring: 654, box: 685, w: 81, nx: 0, lx: 10 },
  { n: '03', label: 'Topographie', ring: 1097, box: 1084, w: 167, nx: 43, lx: 0 },
  { n: '04', label: 'BIM', ring: 1537, box: 1567, w: 82, nx: 0, lx: 15 },
]

/** The four process steps — Figma (381 … 1410, 7075.9). */
export const STEPS = [
  { n: '01', label: 'Planification\ndu projet', ring: 393, box: 381, w: 163, nx: 47 },
  { n: '02', label: 'Préparation\ndu plan', ring: 712, box: 703, w: 159, nx: 39 },
  { n: '03', label: 'Installation\ndu système', ring: 1051, box: 1045, w: 152, nx: 35 },
  { n: '04', label: 'Remise\nau client', ring: 1395, box: 1410, w: 110, nx: 14 },
]

/** "Nos points forts" — five 340px outlined circles at y 9143. */
export const STRENGTHS = [
  { ring: 217, label: 'Réactivité', lx: 331 },
  { ring: 504, label: 'Expertise', lx: 620 },
  { ring: 790, label: 'Expérience', lx: 899 },
  { ring: 1077, label: 'Professionnalisme', lx: 1147 },
  { ring: 1363, label: 'Compétences', lx: 1457 },
]

/** Centres measured off the reference render — the export's `left` values for
 *  these centred runs are computed from the substituted font and land ~14px off. */
export const BIM_KEYWORDS = [
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
export const SOFTWARE: { x: number; y: number; name: string; use: string }[] = [
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
export const GUARANTEES = [
  { cx: 960, y: 14262, label: 'Fluidité\nd’informations' },
  { cx: 527, y: 14514, label: 'Rapidité\nd’exécution' },
  { cx: 1373, y: 14514, label: 'Respect\ndes délais' },
  { cx: 556, y: 14645, label: 'Écoute' },
  { cx: 1370, y: 14645, label: 'Précision' },
  { cx: 960, y: 14876, label: 'Professionnalisme' },
]
