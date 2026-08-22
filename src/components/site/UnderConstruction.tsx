import { Frame, Txt } from '../../design/canvas'
import { CircleButton, Watermark } from './atoms'
import { useIsDesktop } from '../../design/useIsDesktop'
import { MH1, MHero, MPage, MSection } from '../mobile/kit'
import { LogoMark } from '../../brand/vectors'

/**
 * Nouvelles / Portefeuille while there is nothing published yet.
 *
 * Figma frame 1920 x 2160 (screenshots/Nouvelles-01, Portefeuille-01 — these
 * two have no HTML export, so the coordinates were measured off the renders):
 *
 *   watermark   (1067.4, 168)  d=744.6      the standard hero mark
 *   title       (215, 496)     90px Medium
 *   watermark   (719, 1379)    d=482.6      behind the notice
 *   notice      centred, 1507  69px Medium, two lines
 *   button      (938, 1697)    45 x 45
 */
const CANVAS_H = 2160

export interface UnderConstructionProps {
  title: string
  /** Where the disc button goes. */
  onAction: () => void
  actionLabel: string
}

export function UnderConstruction({ title, onAction, actionLabel }: UnderConstructionProps) {
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <MPage>
        <MHero><MH1>{title}</MH1></MHero>
        <MSection className="relative overflow-hidden py-24">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 w-[95vw] -translate-x-1/2 -translate-y-1/2 opacity-10"
            aria-hidden
          >
            <LogoMark style={{ width: '100%', height: 'auto', color: '#fff' }} />
          </div>
          <div className="relative flex flex-col items-center gap-7 text-center">
            <h2 className="font-display text-[1.875rem] font-medium leading-[1.15] tracking-[-0.0133em] text-white">
              En cours de<br />construction
            </h2>
            <button
              type="button"
              onClick={onAction}
              aria-label={actionLabel}
              className="grid h-11 w-11 place-items-center rounded-full bg-white"
            >
              <LogoMark style={{ width: 18, height: 18, color: '#000' }} />
            </button>
          </div>
        </MSection>
      </MPage>
    )
  }

  return (
    <Frame h={CANVAS_H}>
      <Watermark x={1067.4} y={168} size={744.6} />
      <Txt t="displayTight" x={215} y={496}>{title}</Txt>

      <Watermark x={719} y={1379} size={482.6} />
      <Txt t="h2" centerX y={1504} align="center">
        {'En cours de\nconstruction'}
      </Txt>
      <CircleButton x={938} y={1697} plain label={actionLabel} onClick={onAction} />
    </Frame>
  )
}
