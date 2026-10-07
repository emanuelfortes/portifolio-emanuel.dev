'use client'

import { AnimatedNumber } from './AnimatedNumber'

interface ProgressBarProps {
  value: number
  max?: number
  label: string
  sublabel?: string
  color?: string
}

export function ProgressBar({ value, max = 100, label, sublabel, color = '#0047CC' }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100)
  const getColor = () => {
    if (percent > 85) return '#ef4444'
    if (percent > 65) return '#f97316'
    return color
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: '#374151' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: '#111827' }}>
          <AnimatedNumber value={percent} decimals={1} suffix="%" />
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: getColor() }}
        />
      </div>
      {sublabel && <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{sublabel}</p>}
    </div>
  )
}
