import { useCallback } from 'react'
import { useTransition } from '../context/TransitionContext'
import { UnderConstruction } from '../components/site/UnderConstruction'
import { PortefeuilleGallery } from '../components/PortefeuilleGallery'
import { useProjects } from '../lib/content/hooks'
import { useSeo } from '../lib/useSeo'

/**
 * Portefeuille. Same as Nouvelles: the design's "En cours de construction"
 * frame until a project is published, then the gallery.
 */
export default function Portefeuille() {
  useSeo({
    title: 'Portefeuille — Nos réalisations | Engineering Studio',
    description:
      'Une sélection de projets d’études menés par Engineering Studio en MEP/CET, VRD, topographie et BIM.',
  })
  const { startTransition } = useTransition()
  const nav = useCallback((path: string) => startTransition(path), [startTransition])
  const { data: projects, loading } = useProjects()

  if (loading || projects.length === 0) {
    return (
      <UnderConstruction
        title="Portefeuille"
        actionLabel="Retour à l'accueil"
        onAction={() => nav('/')}
      />
    )
  }

  return <PortefeuilleGallery />
}
