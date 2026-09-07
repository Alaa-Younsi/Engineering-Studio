import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface TransitionContextValue {
  isTransitioning: boolean
  pendingPath: string | null
  startTransition: (to: string) => void
  onTransitionPeak: () => void
  onTransitionDone: () => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const navigate = useNavigate()

  const startTransition = useCallback((to: string) => {
    setPendingPath(to)
    setIsTransitioning(true)
  }, [])

  const onTransitionPeak = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath)
    }
  }, [pendingPath, navigate])

  const onTransitionDone = useCallback(() => {
    setIsTransitioning(false)
    setPendingPath(null)
  }, [])

  return (
    <TransitionContext.Provider
      value={{ isTransitioning, pendingPath, startTransition, onTransitionPeak, onTransitionDone }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
