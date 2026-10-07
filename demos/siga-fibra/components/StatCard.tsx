'use client'

import type { LucideIcon } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'
import { Skeleton } from './Skeleton'

interface StatCardProps {
  title: string
  /** Número transita suavemente até o novo valor; texto é exibido como veio */
  value: string | number
  decimals?: number
  suffix?: string
  /** Mostra o skeleton no lugar do valor, mantendo título e ícone visíveis */
  loading?: boolean
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'cyan' | 'orange' | 'red'
  trend?: { value: number; label: string }
}

const colorStyles: Record<string, { card: React.CSSProperties; icon: React.CSSProperties; text: string }> = {
  blue:   { card: { border: '1.5px solid rgba(39,202,163,0.2)', background: '#fff' }, icon: { background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }, text: '#27CAA3' },
  green:  { card: { border: '1.5px solid rgba(39,202,163,0.2)', background: '#fff' }, icon: { background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }, text: '#27CAA3' },
  cyan:   { card: { border: '1.5px solid rgba(3,194,195,0.2)', background: '#fff' },  icon: { background: 'rgba(3,194,195,0.12)', color: '#03C2C3' }, text: '#03C2C3' },
  orange: { card: { border: '1.5px solid rgba(249,115,22,0.2)', background: '#fff' }, icon: { background: 'rgba(249,115,22,0.12)', color: '#f97316' }, text: '#f97316' },
  red:    { card: { border: '1.5px solid rgba(239,68,68,0.2)', background: '#fff' },  icon: { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }, text: '#ef4444' },
}

export function StatCard({ title, value, decimals = 0, suffix = '', loading, subtitle, icon: Icon, color = 'blue', trend }: StatCardProps) {
  const styles = colorStyles[color]
  return (
    <div className="rounded-2xl p-5" style={{ ...styles.card, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={styles.icon}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={
              trend.value >= 0
                ? { background: 'rgba(39,202,163,0.1)', color: '#27CAA3' }
                : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }
            }
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>{title}</p>
      {loading ? (
        <Skeleton style={{ height: 30, width: 104 }} />
      ) : (
        <p className="text-2xl font-extrabold" style={{ color: '#111827' }}>
          {typeof value === 'number' ? <AnimatedNumber value={value} decimals={decimals} suffix={suffix} /> : value}
        </p>
      )}
      {subtitle && <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{subtitle}</p>}
    </div>
  )
}
