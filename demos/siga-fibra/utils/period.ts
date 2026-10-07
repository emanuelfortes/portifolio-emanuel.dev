export type Granularity = 'day' | 'week' | 'month'
export type CompareMode = 'none' | 'previous' | 'lastYear'

/** Intervalo fechado de dias, em YYYY-MM-DD */
export interface Range {
  from: string
  to: string
}

export type PresetId =
  | 'today' | 'yesterday' | '7d' | '14d' | '15d' | '30d'
  | 'thisMonth' | 'lastMonth' | 'quarter' | 'semester' | 'thisYear' | 'custom'

// Os rotulos dizem o periodo exato de proposito: "Trimestre" sozinho tanto
// pode ser o trimestre do calendario quanto os ultimos 3 meses.
export const PRESETS: { id: PresetId; label: string }[] = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: 'Últimos 7 dias' },
  { id: '14d',       label: 'Últimos 14 dias' },
  { id: '15d',       label: 'Quinzena (15 dias)' },
  { id: '30d',       label: 'Últimos 30 dias' },
  { id: 'thisMonth', label: 'Mês atual' },
  { id: 'lastMonth', label: 'Mês anterior' },
  { id: 'quarter',   label: 'Trimestre (3 meses)' },
  { id: 'semester',  label: 'Semestre (6 meses)' },
  { id: 'thisYear',  label: 'Ano atual' },
  { id: 'custom',    label: 'Personalizado' },
]

const pad = (n: number) => String(n).padStart(2, '0')

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Meio-dia local, para que fuso horario nunca empurre a data para o dia vizinho */
export const fromISO = (s: string) => new Date(`${s}T12:00:00`)

const addDays = (d: Date, n: number) => { const c = new Date(d); c.setDate(c.getDate() + n); return c }
const addMonths = (d: Date, n: number) => { const c = new Date(d); c.setMonth(c.getMonth() + n); return c }

export function resolvePreset(id: PresetId, base = new Date()): Range {
  const today = toISO(base)

  switch (id) {
    case 'today':     return { from: today, to: today }
    case 'yesterday': { const y = toISO(addDays(base, -1)); return { from: y, to: y } }
    case '7d':        return { from: toISO(addDays(base, -6)),  to: today }
    case '14d':       return { from: toISO(addDays(base, -13)), to: today }
    case '15d':       return { from: toISO(addDays(base, -14)), to: today }
    case '30d':       return { from: toISO(addDays(base, -29)), to: today }
    case 'thisMonth': return { from: toISO(new Date(base.getFullYear(), base.getMonth(), 1)), to: today }
    case 'lastMonth': return {
      from: toISO(new Date(base.getFullYear(), base.getMonth() - 1, 1)),
      to:   toISO(new Date(base.getFullYear(), base.getMonth(), 0)), // dia 0 = ultimo do mes anterior
    }
    case 'quarter':   return { from: toISO(addDays(addMonths(base, -3), 1)), to: today }
    case 'semester':  return { from: toISO(addDays(addMonths(base, -6), 1)), to: today }
    case 'thisYear':  return { from: toISO(new Date(base.getFullYear(), 0, 1)), to: today }
    default:          return { from: toISO(addDays(base, -29)), to: today }
  }
}

export function dayCount(r: Range): number {
  return Math.round((fromISO(r.to).getTime() - fromISO(r.from).getTime()) / 86400000) + 1
}

/** Mesmo numero de dias, terminando na vespera do inicio do periodo atual */
export function previousRange(r: Range): Range {
  const to = addDays(fromISO(r.from), -1)
  return { from: toISO(addDays(to, -(dayCount(r) - 1))), to: toISO(to) }
}

export function lastYearRange(r: Range): Range {
  const shift = (s: string) => { const d = fromISO(s); d.setFullYear(d.getFullYear() - 1); return toISO(d) }
  return { from: shift(r.from), to: shift(r.to) }
}

export function compareRange(r: Range, mode: CompareMode): Range | null {
  if (mode === 'previous') return previousRange(r)
  if (mode === 'lastYear') return lastYearRange(r)
  return null
}

/** Evita que trimestre e ano virem um pente de centenas de barras */
export function suggestGranularity(r: Range): Granularity {
  const n = dayCount(r)
  if (n > 92) return 'month'
  if (n > 31) return 'week'
  return 'day'
}

const br = (s: string) => fromISO(s).toLocaleDateString('pt-BR')

export function formatRange(r: Range): string {
  return r.from === r.to ? br(r.from) : `${br(r.from)} – ${br(r.to)}`
}

/** Variacao percentual. null quando nao ha base de comparacao (evita "+∞%") */
export function variation(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}
