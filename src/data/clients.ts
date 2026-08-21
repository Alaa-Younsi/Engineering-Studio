/**
 * Clients page content, transcribed straight out of the Figma export
 * (public/Converted/Clients (1920x1080)/index.html) by tools — the card grid
 * is 5 columns x 9 rows of 291 x 238 tiles, three of which are empty.
 */

export interface ClientCard {
  /** Canvas coordinates of the tile. */
  x: number
  y: number
  w: number
  h: number
  /** Company name, one entry per design line (each has its own size). */
  lines: { t: string; y: number; fs: number; x: number }[]
  sector: string
  sx: number
  sy: number
  /** The oversized faded index in the corner. */
  num: string
  nx: number
  ny: number
}

export const CLIENT_CARDS: ClientCard[] = [
  { x: 140.0, y: 6618.0, w: 291, h: 238, lines: [{ t: "Bouchellouga", y: 80.0, fs: 21, x: 28.0 }, { t: "Chawki", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "21", nx: 163.0, ny: 128.0 },
  { x: 477.0, y: 6618.0, w: 291, h: 238, lines: [{ t: "Best", y: 80.0, fs: 21, x: 29.0 }, { t: "Concept", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 189.0, num: "16", nx: 161.0, ny: 128.0 },
  { x: 815.0, y: 6618.0, w: 292, h: 238, lines: [{ t: "ATM", y: 80.0, fs: 20, x: 28.0 }, { t: "Architecture", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "16", nx: 162.0, ny: 128.0 },
  { x: 1152.0, y: 6618.0, w: 292, h: 238, lines: [{ t: "Kebab", y: 80.0, fs: 20, x: 29.0 }, { t: "Abdeslem", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 189.0, num: "16", nx: 162.0, ny: 128.0 },
  { x: 1490.0, y: 6618.0, w: 290, h: 238, lines: [{ t: "Saci Hadef", y: 80.0, fs: 21, x: 28.0 }, { t: "Mohamed", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "21", nx: 162.0, ny: 128.0 },
  { x: 140.0, y: 6902.0, w: 291, h: 238, lines: [{ t: "Nour El Afak", y: 80.0, fs: 20, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "16", nx: 161.0, ny: 128.0 },
  { x: 477.0, y: 6902.0, w: 291, h: 238, lines: [{ t: "Biodattes", y: 80.0, fs: 21, x: 29.0 }, { t: "Algérie", y: 100.0, fs: 20, x: 29.0 }], sector: "Industrie", sx: 29.0, sy: 189.0, num: "07", nx: 137.0, ny: 128.0 },
  { x: 815.0, y: 6902.0, w: 292, h: 238, lines: [{ t: "Hazi", y: 80.0, fs: 21, x: 28.0 }, { t: "Bachir", y: 101.0, fs: 20, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "19", nx: 162.0, ny: 128.0 },
  { x: 1152.0, y: 6902.0, w: 292, h: 238, lines: [{ t: "Salah", y: 80.0, fs: 21, x: 29.0 }, { t: "Mourdi", y: 101.0, fs: 21, x: 29.0 }], sector: "Travaux publics", sx: 29.0, sy: 189.0, num: "21", nx: 164.0, ny: 128.0 },
  { x: 1490.0, y: 6902.0, w: 290, h: 238, lines: [{ t: "BET", y: 80.0, fs: 21, x: 28.0 }, { t: "CAL", y: 101.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 189.0, num: "16", nx: 160.0, ny: 128.0 },
  { x: 140.0, y: 7186.0, w: 291, h: 237, lines: [{ t: "Nour El Afak", y: 79.0, fs: 20, x: 28.0 }, { t: "Lilomrane", y: 101.0, fs: 21, x: 28.0 }], sector: "Immobilière", sx: 28.0, sy: 190.0, num: "16", nx: 161.0, ny: 127.0 },
  { x: 477.0, y: 7186.0, w: 291, h: 237, lines: [{ t: "Bahlouli", y: 79.0, fs: 21, x: 29.0 }, { t: "F.", y: 101.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "19", nx: 161.0, ny: 127.0 },
  { x: 815.0, y: 7186.0, w: 292, h: 237, lines: [{ t: "AL ELEC", y: 79.0, fs: 21, x: 28.0 }, { t: "Spa", y: 101.0, fs: 21, x: 28.0 }], sector: "Entreprise", sx: 28.0, sy: 190.0, num: "16", nx: 162.0, ny: 127.0 },
  { x: 1152.0, y: 7186.0, w: 292, h: 237, lines: [{ t: "AZ", y: 79.0, fs: 21, x: 29.0 }, { t: "Architects", y: 101.0, fs: 21, x: 29.0 }], sector: "Travaux publics", sx: 29.0, sy: 190.0, num: "16", nx: 162.0, ny: 127.0 },
  { x: 1490.0, y: 7186.0, w: 290, h: 237, lines: [{ t: "Benmahmoud", y: 79.0, fs: 20, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 160.0, ny: 127.0 },
  { x: 140.0, y: 7698.0, w: 291, h: 238, lines: [{ t: "ACTARIS", y: 80.0, fs: 21, x: 28.0 }, { t: "Sarl", y: 101.0, fs: 21, x: 28.0 }], sector: "Industrie", sx: 28.0, sy: 191.0, num: "16", nx: 161.0, ny: 128.0 },
  { x: 477.0, y: 7698.0, w: 291, h: 238, lines: [{ t: "Wassim", y: 80.0, fs: 21, x: 29.0 }, { t: "Sayeh", y: 101.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 191.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 815.0, y: 7698.0, w: 292, h: 238, lines: [{ t: "Abdoun", y: 80.0, fs: 21, x: 28.0 }, { t: "Radhwane", y: 101.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 191.0, num: "26", nx: 138.0, ny: 128.0 },
  { x: 1152.0, y: 7698.0, w: 292, h: 238, lines: [{ t: "Bendjama", y: 80.0, fs: 20, x: 29.0 }, { t: "Chafik", y: 101.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 191.0, num: "21", nx: 164.0, ny: 128.0 },
  { x: 1490.0, y: 7698.0, w: 290, h: 238, lines: [{ t: "Boucherit", y: 80.0, fs: 21, x: 28.0 }, { t: "Othmane", y: 101.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 191.0, num: "16", nx: 160.0, ny: 128.0 },
  { x: 140.0, y: 7982.0, w: 291, h: 237, lines: [{ t: "BETA", y: 81.0, fs: 21, x: 28.0 }, { t: "HMD", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "30", nx: 133.0, ny: 127.0 },
  { x: 477.0, y: 7982.0, w: 291, h: 237, lines: [{ t: "Eurl", y: 81.0, fs: 20, x: 29.0 }, { t: "BAUS", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "16", nx: 161.0, ny: 127.0 },
  { x: 815.0, y: 7982.0, w: 292, h: 237, lines: [{ t: "Archi", y: 81.0, fs: 21, x: 28.0 }, { t: "Gate", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 162.0, ny: 127.0 },
  { x: 1152.0, y: 7982.0, w: 292, h: 237, lines: [{ t: "Inter", y: 81.0, fs: 20, x: 29.0 }, { t: "Plan", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "19", nx: 162.0, ny: 127.0 },
  { x: 1490.0, y: 7982.0, w: 290, h: 237, lines: [{ t: "Archi", y: 81.0, fs: 21, x: 28.0 }, { t: "Box", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "16", nx: 160.0, ny: 127.0 },
  { x: 140.0, y: 8265.0, w: 291, h: 238, lines: [{ t: "Baret", y: 81.0, fs: 20, x: 28.0 }, { t: "Architectes", y: 101.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 477.0, y: 8265.0, w: 291, h: 238, lines: [{ t: "Médina", y: 81.0, fs: 20, x: 29.0 }, { t: "Architecture", y: 101.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 815.0, y: 8265.0, w: 292, h: 238, lines: [{ t: "Agrodiv", y: 81.0, fs: 21, x: 28.0 }, { t: "Spa", y: 101.0, fs: 21, x: 28.0 }], sector: "Industrie", sx: 28.0, sy: 190.0, num: "19", nx: 162.0, ny: 128.0 },
  { x: 1152.0, y: 8265.0, w: 292, h: 238, lines: [{ t: "Manar", y: 81.0, fs: 21, x: 29.0 }, { t: "El imara", y: 101.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "19", nx: 162.0, ny: 128.0 },
  { x: 1490.0, y: 8265.0, w: 290, h: 238, lines: [{ t: "Rezzoug", y: 81.0, fs: 21, x: 28.0 }, { t: "Lamine", y: 101.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "09", nx: 131.0, ny: 128.0 },
  { x: 140.0, y: 8777.0, w: 291, h: 238, lines: [{ t: "Debacha", y: 80.0, fs: 21, x: 28.0 }, { t: "Badis", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 477.0, y: 8777.0, w: 291, h: 238, lines: [{ t: "Chettab", y: 80.0, fs: 20, x: 29.0 }, { t: "Nabil", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 815.0, y: 8777.0, w: 292, h: 238, lines: [{ t: "Cons Belmas", y: 80.0, fs: 20, x: 28.0 }, { t: "Sarl", y: 100.0, fs: 21, x: 28.0 }], sector: "Entreprise", sx: 28.0, sy: 190.0, num: "34", nx: 138.0, ny: 128.0 },
  { x: 1152.0, y: 8777.0, w: 292, h: 238, lines: [{ t: "Boumediene", y: 80.0, fs: 20, x: 29.0 }, { t: "Consultant", y: 100.0, fs: 21, x: 29.0 }, { t: "Engineering", y: 120.0, fs: 21, x: 29.0 }], sector: "Génie civil", sx: 29.0, sy: 190.0, num: "16", nx: 162.0, ny: 128.0 },
  { x: 1490.0, y: 8777.0, w: 290, h: 238, lines: [{ t: "Bougarne", y: 80.0, fs: 21, x: 28.0 }, { t: "Adel", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 160.0, ny: 128.0 },
  { x: 140.0, y: 9061.0, w: 291, h: 238, lines: [{ t: "Charm", y: 80.0, fs: 21, x: 28.0 }, { t: "Design", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "23", nx: 139.0, ny: 128.0 },
  { x: 477.0, y: 9061.0, w: 291, h: 238, lines: [{ t: "Architects", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "23", nx: 139.0, ny: 128.0 },
  { x: 815.0, y: 9061.0, w: 292, h: 238, lines: [{ t: "Languer", y: 80.0, fs: 20, x: 28.0 }, { t: "Mostapha", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 162.0, ny: 128.0 },
  { x: 1152.0, y: 9061.0, w: 292, h: 238, lines: [{ t: "Ouaar", y: 80.0, fs: 20, x: 29.0 }, { t: "Mohamed", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "21", nx: 164.0, ny: 128.0 },
  { x: 1490.0, y: 9061.0, w: 290, h: 238, lines: [{ t: "Sarl", y: 80.0, fs: 21, x: 28.0 }, { t: "S3ec", y: 100.0, fs: 21, x: 28.0 }], sector: "Entreprise", sx: 28.0, sy: 190.0, num: "16", nx: 160.0, ny: 128.0 },
  { x: 140.0, y: 9345.0, w: 291, h: 238, lines: [{ t: "Laghouag", y: 80.0, fs: 21, x: 28.0 }, { t: "S.", y: 100.0, fs: 21, x: 28.0 }], sector: "Architecture", sx: 28.0, sy: 190.0, num: "19", nx: 161.0, ny: 128.0 },
  { x: 477.0, y: 9345.0, w: 291, h: 238, lines: [{ t: "RKM", y: 80.0, fs: 20, x: 29.0 }, { t: "Studio", y: 100.0, fs: 21, x: 29.0 }], sector: "Architecture", sx: 29.0, sy: 190.0, num: "16", nx: 161.0, ny: 128.0 },
]

export interface Testimonial {
  /** x offset inside the 2496-wide testimonial track. */
  x: number
  quote: string
  name: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  { x: 0.0, quote: "J’apprécie particulièrement de travailler avec ENGINEERING STUDIO pour leur sérieux, leur rigueur et leur réactivité. Les dossiers études sont de grandes qualités avec rarement de problèmes en phase exécution.", name: "TT\nArchitects", role: "Architecture" },
  { x: 504.0, quote: "Concevoir en équipe dans un dialogue permanent, s’impliquer résolument dans le suivi des projets et des chantiers, faire avec justesse et passion. Autant de valeurs partagées qui font de ENGINEERING STUDIO.", name: "Best\nConcept", role: "Architecture" },
  { x: 1008.0, quote: "Une équipe Jeune, dynamique et volontaire toujours disponible. Leurs dossiers techniques sont d’une qualité rare. Sur le chantier, les entreprises sont vraiment bien pilotées.", name: "Kebab\nAbdslem", role: "Architecture" },
  { x: 1512.0, quote: "Leur réactivité et conseils précieux lors de nos études, nous permettent d’être réactifs et pourvoyeurs de solutions techniques innovantes. Leurs plans et bilans thermiques sont toujours d’une grande précision.", name: "Manar\nEl Imara", role: "Architecture" },
  { x: 2016.0, quote: "Leur expérience pluridisciplinaire (CVC/CET et VRD) nous permet de pouvoir répondre favorablement et sans retenues sur les dossiers complets de nos clients.", name: "Baret\nArchitectes", role: "Architecture" },
]
