/**
 * Builds a "hold – ramp – hold – ramp – …" keyframe pair for
 * `framer-motion`'s `useTransform`: the output sits still at each `vals[i]`
 * for most of the gap around `ys[i]`, then travels to `vals[i + 1]` over the
 * middle `1 - 2*holdFrac` share of the gap to the next stop.
 *
 * Used to make a scroll-linked element rest at each section's own position
 * (identical to the non-parallax layout) and only travel during a short
 * window as the user crosses from one section into the next.
 *
 * The travel itself is eased, not linear. `useTransform` interpolates
 * linearly between the stops it is given, so the ramp is emitted as `SAMPLES`
 * points along an ease-in-out curve: the image accelerates out of one section
 * and decelerates into the next instead of starting and stopping dead, which
 * is what made the hand-off read as mechanical.
 */

/** Standard ease-in-out cubic, on 0..1. */
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Points used to draw each eased ramp. Twelve is past the eye's resolution. */
const SAMPLES = 12

export function holdRamp(ys: number[], vals: number[], holdFrac = 0.3) {
  const xs = [ys[0]]
  const os = [vals[0]]

  for (let i = 0; i < ys.length - 1; i++) {
    const gap = ys[i + 1] - ys[i]
    const from = ys[i] + gap * holdFrac
    const to = ys[i + 1] - gap * holdFrac

    // Hold at this stop's own value until the ramp window opens.
    xs.push(from)
    os.push(vals[i])

    // Eased travel to the next stop's value.
    for (let s = 1; s < SAMPLES; s++) {
      const t = s / SAMPLES
      xs.push(from + (to - from) * t)
      os.push(vals[i] + (vals[i + 1] - vals[i]) * easeInOutCubic(t))
    }

    // Arrive, then hold through the next stop's own section.
    xs.push(to, ys[i + 1])
    os.push(vals[i + 1], vals[i + 1])
  }

  return { xs, os }
}

/**
 * The same eased ramp for a single 0 → 1 crossfade between `from` and `to`,
 * held at 0 before and 1 after. Used for the travelling image's stack: each
 * photo fades in over the one already showing and then *stays*, so the disc
 * is covered by a fully opaque image at every point of the scroll.
 */
export function easedFade(from: number, to: number) {
  const xs: number[] = [from]
  const os: number[] = [0]
  for (let s = 1; s <= SAMPLES; s++) {
    const t = s / SAMPLES
    xs.push(from + (to - from) * t)
    os.push(easeInOutCubic(t))
  }
  return { xs, os }
}

/**
 * A sampled ease-out cubic, as a `useTransform` stop pair over 0..1 — for
 * turning a linear scroll progress into an eased one (fast off the mark, long
 * settle) before it drives a position.
 */
export const EASE_STOPS = Array.from({ length: SAMPLES + 1 }, (_, i) => i / SAMPLES)
export const EASE_OUT = EASE_STOPS.map((t) => 1 - (1 - t) ** 3)

/**
 * Spring used everywhere a scroll-linked value is smoothed. Overdamped on
 * purpose (zeta about 1.9): it never overshoots a resting position, and
 * trails the wheel by roughly 150ms — enough to turn a stepped trackpad or
 * mouse-wheel scroll into one continuous glide without feeling detached
 * from the page.
 */
export const SCROLL_SPRING = { stiffness: 170, damping: 28, mass: 0.32, restDelta: 0.1 } as const
