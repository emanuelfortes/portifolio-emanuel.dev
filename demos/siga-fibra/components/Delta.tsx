'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { variation } from '../utils/period'

/** Seta de variação vs período de comparação. Só aparece quando há base. */
export function Delta({ current, previous }: { current: number; previous: number | null | undefined }) {
  if (previous === null || previous === undefined) return null

  const v = variation(current, previous)

  // Sem base anterior não existe percentual: mostrar "+∞%" seria mentira
  if (v === null) {
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}>
        novo
      </span>
    )
  }

  const subiu = v >= 0
  const cor = subiu ? '#27CAA3' : '#ef4444'
  const Icone = subiu ? TrendingUp : TrendingDown

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: cor + '18', color: cor }}
      title={`${previous.toLocaleString('pt-BR')} no período de comparação`}
    >
      <Icone className="w-3 h-3" />
      {subiu ? '+' : ''}{v.toFixed(1).replace('.', ',')}%
    </span>
  )
}
