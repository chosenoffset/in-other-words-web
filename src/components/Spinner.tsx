import { memo } from 'react'

type SpinnerProps = {
  size?: number
  color?: string
  className?: string
  'aria-label'?: string
}

function generateDots(count: number, radius: number, center: number) {
  const dots = [] as Array<{ cx: number; cy: number; delay: number }>
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2
    const cx = center + radius * Math.cos(angle)
    const cy = center + radius * Math.sin(angle)
    const delay = (i / count).toFixed(3)
    dots.push({ cx, cy, delay: Number(delay) })
  }
  return dots
}

function SpinnerComponent({
  size = 40,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}: SpinnerProps) {
  const center = size / 2
  const radius = size * 0.32
  const dotRadius = Math.max(1.5, size * 0.06)
  const dots = generateDots(12, radius, center)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role='status'
      aria-label={ariaLabel || 'Loading'}
      className={className}
      focusable='false'
    >
      <title>{ariaLabel || 'Loading'}</title>
      {dots.map((d, idx) => (
        <circle
          key={idx}
          cx={d.cx}
          cy={d.cy}
          r={dotRadius}
          fill={color}
          opacity={0.2}
        >
          <animate
            attributeName='opacity'
            values='1;0.2;1'
            dur='1s'
            begin={`${d.delay}s`}
            repeatCount='indefinite'
          />
        </circle>
      ))}
    </svg>
  )
}

export const Spinner = memo(SpinnerComponent)
