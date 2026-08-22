/**
 * Builds a "hold – ramp – hold – ramp – …" keyframe pair for
 * `framer-motion`'s `useTransform`: the output sits still at each `vals[i]`
 * for most of the gap around `ys[i]`, then ramps linearly to `vals[i + 1]`
 * over the middle `1 - 2*holdFrac` share of the gap to the next stop.
 *
 * Used to make a scroll-linked element rest at each section's own position
 * (identical to the non-parallax layout) and only travel during a short
 * window as the user crosses from one section into the next.
 */
export function holdRamp(ys: number[], vals: number[], holdFrac = 0.3) {
  const xs = [ys[0]]
  const os = [vals[0]]
  for (let i = 0; i < ys.length - 1; i++) {
    const gap = ys[i + 1] - ys[i]
    xs.push(ys[i] + gap * holdFrac, ys[i + 1] - gap * holdFrac, ys[i + 1])
    os.push(vals[i], vals[i + 1], vals[i + 1])
  }
  return { xs, os }
}
