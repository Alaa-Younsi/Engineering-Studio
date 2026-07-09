export interface ArticleBlock {
  /** Optional sub-heading rendered above the paragraphs. */
  heading?: string
  paragraphs: string[]
}

export interface Article {
  /** URL segment: /nouvelles/<slug>. Must be unique. */
  slug: string
  /** ISO date, e.g. '2026-02-18'. */
  date: string
  title: string
  /** Path under /public, e.g. '/Assets/nouvelles/mon-article.jpg'. Omit for a placeholder. */
  cover?: string
  blocks: ArticleBlock[]
  tags: string[]
}

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

/** '2026-02-18' → '18 Fév 2026'. */
export function formatArticleDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS_FR[Number(month) - 1]} ${year}`
}

export const articles: Article[] = [
  {
    slug: 'grow-your-brand-smarter-faster',
    date: '2026-02-18',
    title: 'Grow your brand smarter & faster with grafty',
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
    slug: 'grow-your-brand-smarter-faster-2',
    date: '2026-01-01',
    title: 'Grow your brand smarter & faster with grafty',
    blocks: [
      {
        heading: 'Sustainable design',
        paragraphs: [
          'Remplacez ce texte par le contenu réel de votre article.',
        ],
      },
    ],
    tags: ['VRD', 'Aménagement'],
  },
  {
    slug: 'grow-your-brand-smarter-faster-3',
    date: '2026-09-22',
    title: 'Grow your brand smarter & faster with grafty',
    blocks: [
      {
        heading: 'Sustainable design',
        paragraphs: [
          'Remplacez ce texte par le contenu réel de votre article.',
        ],
      },
    ],
    tags: ['BIM'],
  },
]

/** Newest first — the order the archive grid uses. */
export function sortedArticles(): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date))
}

export function findArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}
