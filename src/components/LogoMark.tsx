interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 48, className = '' }: LogoMarkProps) {
  const c = size / 2
  const r = size / 2
  // Control points: 65% of radius toward each corner from center
  const k = c * 0.65
  const ne = { x: c + k, y: c - k }
  const se = { x: c + k, y: c + k }
  const sw = { x: c - k, y: c + k }
  const nw = { x: c - k, y: c - k }

  // Full circle (4 quarter-arcs clockwise)
  const circle = `M ${c} 0 A ${r} ${r} 0 0 1 ${size} ${c} A ${r} ${r} 0 0 1 ${c} ${size} A ${r} ${r} 0 0 1 0 ${c} A ${r} ${r} 0 0 1 ${c} 0 Z`

  // 4 petal paths — each covers one quadrant.
  // With evenodd fill-rule, these areas become transparent,
  // leaving the cross-shaped gaps as the visible (filled) shape.
  const petals = [
    `M ${c} ${c} Q ${ne.x} ${ne.y} ${c} 0 A ${r} ${r} 0 0 1 ${size} ${c} Q ${ne.x} ${ne.y} ${c} ${c} Z`,
    `M ${c} ${c} Q ${se.x} ${se.y} ${size} ${c} A ${r} ${r} 0 0 1 ${c} ${size} Q ${se.x} ${se.y} ${c} ${c} Z`,
    `M ${c} ${c} Q ${sw.x} ${sw.y} ${c} ${size} A ${r} ${r} 0 0 1 0 ${c} Q ${sw.x} ${sw.y} ${c} ${c} Z`,
    `M ${c} ${c} Q ${nw.x} ${nw.y} 0 ${c} A ${r} ${r} 0 0 1 ${c} 0 Q ${nw.x} ${nw.y} ${c} ${c} Z`,
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={[circle, ...petals].join(' ')} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
