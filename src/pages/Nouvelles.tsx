import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { UnderConstruction } from '../components/site/UnderConstruction'
import { NouvellesArchive } from '../components/NouvellesArchive'
import { useArticles } from '../lib/content/hooks'
import { useSeo } from '../lib/useSeo'

/**
 * Nouvelles. Until something is published the design's "En cours de
 * construction" frame stands in for the archive — driven by the data, not a
 * flag, so the grid appears on its own the moment an article goes live.
 */
export default function Nouvelles() {
  useSeo({
    title: 'Nouvelles — Actualités du studio | Engineering Studio',
    description:
      'Les actualités, publications et retours d’expérience d’Engineering Studio, bureau d’études en ingénierie.',
  })
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])
  const { data: articles, loading } = useArticles()

  if (loading || articles.length === 0) {
    return (
      <UnderConstruction
        title="Nouvelles"
        actionLabel="Retour à l'accueil"
        onAction={() => nav('/')}
      />
    )
  }

  return <NouvellesArchive />
}
