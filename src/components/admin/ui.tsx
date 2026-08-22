import { useRef, useState, type ReactNode } from 'react'
import { uploadMedia } from '../../lib/content/store'

/* ── Buttons ──────────────────────────────────────────────────────────────── */

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  className?: string
}

export function AdminButton({ children, onClick, type = 'button', variant = 'primary', disabled, className = '' }: ButtonProps) {
  const styles: Record<string, string> = {
    primary: 'bg-white text-black hover:bg-white/85',
    ghost: 'border border-white/20 text-white hover:bg-white/10',
    danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

/* ── Form fields ──────────────────────────────────────────────────────────── */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block font-body text-sm text-white mb-2">{label}</span>
      {children}
      {hint && <span className="block font-body text-xs text-secondary mt-1.5">{hint}</span>}
    </label>
  )
}

const inputBase =
  'w-full rounded-xl bg-surface border border-white/10 px-4 py-3 font-body text-sm text-white placeholder:text-secondary focus:outline-none focus:border-white/40 transition-colors'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y min-h-[90px] leading-relaxed ${props.className ?? ''}`} />
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-white' : 'bg-white/20'}`}>
        <span
          // `left-0` pins the static position explicitly — buttons default to
          // `text-align: center` in the UA stylesheet, and Chrome resolves an
          // all-auto absolute inset against that alignment, centring the knob
          // instead of anchoring it left (visible as an overlap with the
          // adjacent label once `translate-x-5` pushed it further still).
          className={`absolute left-0 top-0.5 h-5 w-5 rounded-full transition-transform ${checked ? 'translate-x-5 bg-black' : 'translate-x-0.5 bg-white'}`}
        />
      </span>
      <span className="font-body text-sm text-white">{label}</span>
    </button>
  )
}

/* ── Tag editor ───────────────────────────────────────────────────────────── */

export function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [value, setValue] = useState('')

  const add = () => {
    const t = value.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setValue('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 font-body text-xs text-white/80">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} aria-label={`Retirer ${tag}`} className="text-secondary hover:text-white">
              ×
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="font-body text-xs text-secondary">Aucun tag.</span>}
      </div>
      <div className="flex gap-2">
        <TextInput
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder="Ajouter un tag…"
        />
        <AdminButton variant="ghost" onClick={add}>Ajouter</AdminButton>
      </div>
    </div>
  )
}

/* ── Media uploader ───────────────────────────────────────────────────────── */

export function MediaUploader({
  value,
  video = false,
  onChange,
  className = 'aspect-[16/10]',
}: {
  value?: string
  video?: boolean
  onChange: (url: string | undefined) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadMedia(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du téléversement')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className={`relative overflow-hidden rounded-xl bg-[#e2e2e2] ${className}`}>
        {value ? (
          video ? (
            <video src={value} className="w-full h-full object-cover" />
          ) : (
            <img src={value} alt="" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/30 font-body text-xs">
            {busy ? 'Téléversement…' : 'Aucun média'}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <AdminButton variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
          {value ? 'Remplacer' : 'Téléverser'}
        </AdminButton>
        {value && (
          <AdminButton variant="ghost" onClick={() => onChange(undefined)} disabled={busy}>
            Retirer
          </AdminButton>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={video ? 'video/*' : 'image/*'}
          hidden
          onChange={e => void pick(e.target.files?.[0])}
        />
      </div>
      {error && <p className="font-body text-xs text-red-300 mt-2">{error}</p>}
    </div>
  )
}

/* ── Misc ─────────────────────────────────────────────────────────────────── */

export function Spinner({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-secondary font-body text-sm py-16 justify-center">
      <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      {label}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-[#131313] rounded-2xl border border-white/5 ${className}`}>{children}</div>
}
