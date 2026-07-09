export interface ProjectMedia {
  type: 'image' | 'video'
  /** Path under /public. Omit for a placeholder tile. */
  src?: string
}

export interface Project {
  id: string
  title: string
  /** Rendered one line per entry, e.g. ['Gue de constantine', "Wilaya d'Alger"]. */
  location: string[]
  tags: string[]
  /** Thumbnails shown alongside the main media. The first one is the cover. */
  media: ProjectMedia[]
}

export const projects: Project[] = [
  {
    id: '350-logements-promotionnels-libres',
    title: 'Etude de 350 logements promotionnels libres',
    location: ['Gue de constantine', "Wilaya d'Alger"],
    tags: ['VRD', 'Aménagement', 'Infrastructures'],
    media: [
      { type: 'image' },
      { type: 'video' },
      { type: 'image' },
      { type: 'image' },
      { type: 'image' },
      { type: 'image' },
    ],
  },
  {
    id: '350-logements-promotionnels-libres-2',
    title: 'Etude de 350 logements promotionnels libres',
    location: ['Gue de constantine', "Wilaya d'Alger"],
    tags: ['MEP', 'Electricité CFO', 'Plomberie'],
    media: [
      { type: 'image' },
      { type: 'video' },
      { type: 'image' },
      { type: 'image' },
      { type: 'image' },
      { type: 'image' },
    ],
  },
]
