import { useCallback, useEffect, useState } from 'react'
import type { Article, Project } from './types'
import { getArticle, listArticles, listProjects } from './store'

interface AsyncState<T> {
  data: T
  loading: boolean
  error: string | null
  reload: () => void
}

/** Published articles for the public archive, newest first. */
export function useArticles(publishedOnly = true): AsyncState<Article[]> {
  const [data, setData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    listArticles({ publishedOnly })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [publishedOnly])

  useEffect(load, [load])
  return { data, loading, error, reload: load }
}

/** A single article by slug for the detail page. */
export function useArticle(slug: string | undefined): AsyncState<Article | null> {
  const [data, setData] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!slug) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    getArticle(slug)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(load, [load])
  return { data, loading, error, reload: load }
}

/** Published projects for the public gallery. */
export function useProjects(publishedOnly = true): AsyncState<Project[]> {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    listProjects({ publishedOnly })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [publishedOnly])

  useEffect(load, [load])
  return { data, loading, error, reload: load }
}
