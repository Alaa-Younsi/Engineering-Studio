import { useCallback, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useScroll, useTransform } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import { Footer } from '../components/Footer'
import { HeroShape } from '../components/HeroShape'
import { LogoButton } from '../components/LogoButton'
import { MediaFrame, Tag } from '../components/MediaPlaceholder'
import { RevealText } from '../components/Reveal'
import { FEATURES } from '../config/features'
import { useArticle } from '../lib/content/hooks'
import { formatArticleDate } from '../lib/content/types'

export default function NouvelleArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroLogoY = useTransform(scrollYProgress, [0, 1], ['0px', '-80px'])

  const { data: article, loading } = useArticle(slug)

  // While the section is still behind the flag, an article URL is not a real page.
  if (!FEATURES.nouvelles) return <Navigate to="/nouvelles" replace />

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-gutter relative z-10">
          <h1 className="font-display font-bold text-[2.5rem] sm:text-6xl lg:text-[5.375rem] text-white leading-none lg:leading-none">
            Nouvelles
          </h1>
        </div>
        <HeroShape y={heroLogoY} className="hidden md:block" />
      </section>

      {loading ? (
        <section className="px-6 sm:px-10 lg:px-gutter py-44" />
      ) : !article ? (
        <section className="px-6 sm:px-10 lg:px-gutter py-44 flex flex-col items-center gap-8 text-center">
          <p className="font-display font-bold text-2xl sm:text-3xl text-white">Cet article n'existe pas.</p>
          <LogoButton onClick={() => nav('/nouvelles')}>Toutes les nouvelles</LogoButton>
        </section>
      ) : (
        <article className="px-6 sm:px-10 lg:px-gutter pb-44">
          <div className="max-w-5xl mx-auto">

            <RevealText>
              <p className="font-body text-secondary text-xs sm:text-sm">{formatArticleDate(article.date)}</p>
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mt-3 max-w-[24ch]">
                {article.title}
              </h2>
            </RevealText>

            <RevealText delay={0.08}>
              <MediaFrame
                src={article.cover}
                alt={article.title}
                className="w-full aspect-[16/10] rounded-2xl sm:rounded-3xl mt-12 sm:mt-16"
                iconClassName="w-12 h-12"
              />
            </RevealText>

            <div className="mt-16 sm:mt-20 max-w-4xl">
              {article.blocks.map((block, bi) => (
                <RevealText key={bi} delay={0.06}>
                  {block.heading && (
                    <h3 className="font-display font-bold text-white text-xl sm:text-2xl mb-8">{block.heading}</h3>
                  )}
                  {block.paragraphs.map((paragraph, pi) => (
                    <p key={pi} className="font-body text-secondary text-sm leading-relaxed mb-10 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </RevealText>
              ))}
            </div>

            {article.tags.length > 0 && (
              <RevealText delay={0.06}>
                <div className="flex flex-wrap gap-2.5 mt-14">
                  {article.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </RevealText>
            )}

            <RevealText delay={0.06}>
              <div className="mt-16">
                <LogoButton onClick={() => nav('/nouvelles')}>Toutes les nouvelles</LogoButton>
              </div>
            </RevealText>
          </div>
        </article>
      )}

      <Footer />
    </main>
  )
}
