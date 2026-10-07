import { format, formatDistanceToNowStrict, isToday, isTomorrow, isPast } from '@/demos/kanban-cev/lib/date-fns'
import { ptBR } from '@/demos/kanban-cev/lib/date-fns'

export function formatDeadline(iso: string): string {
  const d = new Date(iso)
  if (isToday(d)) return `Hoje, ${format(d, 'HH:mm')}`
  if (isTomorrow(d)) return `Amanhã, ${format(d, 'HH:mm')}`
  return format(d, "d 'de' MMM, HH:mm", { locale: ptBR })
}

export function relativeTime(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: ptBR })
}


/**
 * No fundo escuro, tinta clara vira bloco luminoso e rouba a atenção do
 * conteúdo. As prioridades usam véu translúcido da própria cor — menos
 * "Urgente" e "Alta", que devem saltar mesmo: ouro sólido, como na marca.
 */
export const PRIORITY_STYLE: Record<string, { label: string; className: string; dot: string }> = {
  urgente: { label: 'Urgente', className: 'bg-red-400 text-pine-950 ring-red-300/40', dot: 'bg-red-400' },
  alta: { label: 'Alta', className: 'bg-brand-500 text-pine-950 ring-brand-500/40', dot: 'bg-brand-500' },
  media: { label: 'Média', className: 'bg-sky-400/15 text-sky-200 ring-sky-300/25', dot: 'bg-sky-400' },
  baixa: { label: 'Baixa', className: 'bg-ink-200/40 text-ink-600 ring-ink-300/30', dot: 'bg-ink-400' },
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Cor determinística por nome, para avatares sem foto. */
export function avatarColor(name: string): string {
  const palette = [
    'bg-emerald-100 text-emerald-800',
    'bg-sky-100 text-sky-800',
    'bg-violet-100 text-violet-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-teal-100 text-teal-800',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]!
}
