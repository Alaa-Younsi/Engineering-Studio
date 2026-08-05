import { useCallback, useRef, useState } from 'react'
import { ValidationError, botCheck, throttleCheck, throttleMark } from '../lib/content/validation'

/**
 * Shared abuse guard for the three public forms.
 *
 * Two cheap signals catch the overwhelming majority of form spam without ever
 * showing a visitor a captcha: a field only a script would fill, and a floor on
 * how fast the form could plausibly have been completed. A per-browser throttle
 * limits how often the same person can post.
 */
export function useFormGuard() {
  const startedAt = useRef(Date.now())
  const [honeypot, setHoneypot] = useState('')

  const check = useCallback(() => {
    botCheck(honeypot, startedAt.current)
    throttleCheck()
  }, [honeypot])

  const mark = useCallback(() => {
    throttleMark()
    startedAt.current = Date.now()
  }, [])

  return { check, mark, honeypot, setHoneypot }
}

interface HoneypotFieldProps {
  value: string
  onChange: (value: string) => void
}

/**
 * Off-screen rather than `display: none` — some bots skip hidden inputs, but
 * almost none skip a positioned one. Hidden from assistive tech and tab order.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
      <label>
        Ne remplissez pas ce champ
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}

/** Maps a thrown error to something a visitor can act on. */
export function submissionErrorMessage(err: unknown): string {
  if (err instanceof ValidationError) return err.message
  return "Votre demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez, ou appelez-nous au +213 (0) 773 87 62 14."
}
