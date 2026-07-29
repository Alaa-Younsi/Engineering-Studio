import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { MediaFrame } from './MediaPlaceholder'
import { RevealText } from './Reveal'
import { useArticles } from '../lib/content/hooks'
import { formatArticleDate } from '../lib/content/types'

/** The card grid that replaces the placeholder once FEATURES.nouvelles is on. */
export function NouvellesArchive() {
  const { startTransition } = useTransition()
  const open = useCallback((slug: string) => startTransition(`/nouvelles/${slug}`), [startTransition])
  const { data: articles, loading } = useArticles()

  return (
    <section className="px-6 sm:px-10 lg:px-gutter pb-44">
      <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {!loading && articles.length === 0 && (
          <p className="font-body text-secondary text-sm">Aucun article pour le moment.</p>
        )}
        {articles.map((article, i) => (
          <RevealText key={article.slug} delay={Math.min(i, 5) * 0.08}>
            <button
              onClick={() => open(article.slug)}
              className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-2xl"
            >
              <MediaFrame
                src={article.cover}
                alt={article.title}
                className="w-full aspect-[4/5] rounded-2xl group-hover:opacity-85 transition-opacity"
                iconClassName="w-12 h-12"
              />
              <p className="font-body text-secondary text-xs mt-5">{formatArticleDate(article.date)}</p>
              <h2 className="font-display font-bold text-white text-2xl sm:text-[1.7rem] leading-tight mt-3 group-hover:opacity-70 transition-opacity">
                {article.title}
              </h2>
            </button>
          </RevealText>
        ))}
      </div>
    </section>
  )
}
