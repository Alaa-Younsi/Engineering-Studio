import type { Article, Project } from './types'

/**
 * Initial content, lifted from the original static data files. Used to seed the
 * localStorage fallback on first run so the site and dashboard are never empty
 * before Supabase is connected. Once Supabase holds the data, this is ignored.
 */

export const seedArticles: Article[] = [
  {
    id: 'seed-article-1',
    slug: 'grow-your-brand-smarter-faster',
    date: '2026-02-18',
    title: 'Grow your brand smarter & faster with grafty',
    published: true,
    blocks: [
      {
        heading: 'Sustainable design',
        paragraphs: [
          "When you enter into any new area of science, you almost always find yourself with a baffling new language of technical terms to learn before you can converse with the experts. This is certainly true in astronomy both in terms of terms that refer to the cosmos and terms that describe the tools of the trade, the most prevalent being the telescope. So to get us off of first base, let's define some of the key terms that pertain to telescopes to help you be able to talk to them more intelligently.",
          'The first area of specialization in telescopes has to do with the types of telescopes people use. The three designs of telescopes that most people use are the Refractor, the Reflector and the Schmidt Cassegrain telescope. The refractor telescope uses a convex lens to focus the light on the eyepiece. The reflector telescope has a concave lens which means it bends in. It uses mirrors to focus the image that you eventually see. The Schmidt Cassegrain telescope uses an involved system of mirrors to capture the image you want to see. A binocular telescope uses a set of telescopes mounted and synchronized so your view of the sky is 3-D.',
          'Beyond the basic types, other terms refer to parts of the telescope or to the science behind how telescopes work. Collimation is a term for how well tuned the telescope is to give you a good clear image of what you are looking at. You want your telescope to have good collimation so you are not getting a false image of the celestial body.',
          "Aperture is a fancy word for how big the lens of your telescope is. But it's an important word because the aperture of the lens is the key to how powerful your telescope is. Magnification has nothing to do with it, its all in the aperture.",
        ],
      },
    ],
    tags: ['MEP', 'Electricité CFO', 'Plomberie'],
  },
  {
    id: 'seed-article-2',
    slug: 'grow-your-brand-smarter-faster-2',
    date: '2026-01-01',
    title: 'Grow your brand smarter & faster with grafty',
    published: true,
    blocks: [
      { heading: 'Sustainable design', paragraphs: ['Remplacez ce texte par le contenu réel de votre article.'] },
    ],
    tags: ['VRD', 'Aménagement'],
  },
  {
    id: 'seed-article-3',
    slug: 'grow-your-brand-smarter-faster-3',
    date: '2026-09-22',
    title: 'Grow your brand smarter & faster with grafty',
    published: true,
    blocks: [
      { heading: 'Sustainable design', paragraphs: ['Remplacez ce texte par le contenu réel de votre article.'] },
    ],
    tags: ['BIM'],
  },
]

export const seedProjects: Project[] = [
  {
    id: 'seed-project-1',
    title: 'Etude de 350 logements promotionnels libres',
    location: ['Gue de constantine', "Wilaya d'Alger"],
    tags: ['VRD', 'Aménagement', 'Infrastructures'],
    published: true,
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
    id: 'seed-project-2',
    title: 'Etude de 350 logements promotionnels libres',
    location: ['Gue de constantine', "Wilaya d'Alger"],
    tags: ['MEP', 'Electricité CFO', 'Plomberie'],
    published: true,
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
