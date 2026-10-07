/**
 * Leitura de RRULE (RFC 5545) para humanos.
 *
 * Correção 5.1: a recorrência é o item que decide se a ferramenta é usada ou
 * abandonada. Uma agência vive de demanda que se repete; sem isso alguém
 * recadastra as mesmas coisas toda semana e em duas semanas volta para o
 * WhatsApp.
 *
 * Este arquivo fica em `shared` de propósito: o formulário do front precisa
 * mostrar "Toda segunda, quarta e sexta" enquanto a pessoa monta a regra, e a
 * API precisa do mesmo texto no retorno da listagem. Um texto só, um lugar só.
 *
 * A geração de datas NÃO está aqui — é a biblioteca `rrule`, do lado da API,
 * que expande a regra. Aqui só se lê e se descreve.
 */

export const WEEKDAYS = [
  { code: 'MO', label: 'Segunda', short: 'Seg' },
  { code: 'TU', label: 'Terça', short: 'Ter' },
  { code: 'WE', label: 'Quarta', short: 'Qua' },
  { code: 'TH', label: 'Quinta', short: 'Qui' },
  { code: 'FR', label: 'Sexta', short: 'Sex' },
  { code: 'SA', label: 'Sábado', short: 'Sáb' },
  { code: 'SU', label: 'Domingo', short: 'Dom' },
] as const

export type WeekdayCode = (typeof WEEKDAYS)[number]['code']

const WEEKDAY_LABEL = new Map(WEEKDAYS.map((d) => [d.code, d.label]))

export interface RruleParts {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  byDay: string[]
  byMonthDay: number[]
  count?: number
  until?: string
}

/** Quebra a RRULE em partes. Lança se `FREQ` faltar ou não for suportada. */
export function parseRrule(rrule: string): RruleParts {
  const body = rrule
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.toUpperCase().startsWith('DTSTART'))
    .join(';')
    .replace(/^RRULE:/i, '')

  const map = new Map<string, string>()
  for (const pair of body.split(';')) {
    const [key, value] = pair.split('=')
    if (key && value) map.set(key.trim().toUpperCase(), value.trim())
  }

  const freq = map.get('FREQ')?.toUpperCase()
  if (freq !== 'DAILY' && freq !== 'WEEKLY' && freq !== 'MONTHLY' && freq !== 'YEARLY') {
    throw new Error('FREQ precisa ser DAILY, WEEKLY, MONTHLY ou YEARLY')
  }

  const interval = Number(map.get('INTERVAL') ?? 1)
  if (!Number.isInteger(interval) || interval < 1) throw new Error('INTERVAL inválido')

  const byDay = (map.get('BYDAY') ?? '')
    .split(',')
    .map((d) => d.trim().toUpperCase())
    .filter(Boolean)
  for (const d of byDay) {
    // Aceita a forma posicional do RFC (1MO = primeira segunda do mês).
    if (!WEEKDAY_LABEL.has(d.slice(-2) as WeekdayCode)) throw new Error(`BYDAY inválido: ${d}`)
  }

  const byMonthDay = (map.get('BYMONTHDAY') ?? '')
    .split(',')
    .map((d) => d.trim())
    // Sem o descarte do vazio, `Number('')` vira 0 e reprova toda regra que
    // simplesmente não usa BYMONTHDAY.
    .filter(Boolean)
    .map(Number)
  for (const n of byMonthDay) {
    if (!Number.isInteger(n) || n < 1 || n > 31) throw new Error(`BYMONTHDAY inválido: ${n}`)
  }

  const count = map.has('COUNT') ? Number(map.get('COUNT')) : undefined
  if (count !== undefined && (!Number.isInteger(count) || count < 1)) {
    throw new Error('COUNT inválido')
  }

  return { freq, interval, byDay, byMonthDay, count, until: map.get('UNTIL') }
}

function listar(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? ''
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

/** UNTIL vem como 20261231T235959Z ou 20261231. */
function untilLegivel(until: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(until)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : null
}

/**
 * "FREQ=WEEKLY;BYDAY=MO,WE,FR" → "Toda segunda, quarta e sexta".
 * Devolve a própria regra se não conseguir ler: melhor um texto feio na tela
 * do que uma exceção no meio da listagem.
 */
export function describeRrule(rrule: string): string {
  let p: RruleParts
  try {
    p = parseRrule(rrule)
  } catch {
    return rrule
  }

  const dias = p.byDay.map((d) => WEEKDAY_LABEL.get(d.slice(-2) as WeekdayCode)!.toLowerCase())

  let base: string
  switch (p.freq) {
    case 'DAILY':
      base = p.interval === 1 ? 'Todo dia' : `A cada ${p.interval} dias`
      break

    case 'WEEKLY': {
      const quando = dias.length ? listar(dias) : null
      if (p.interval === 1) base = quando ? `Toda ${quando}` : 'Toda semana'
      else if (p.interval === 2) base = quando ? `A cada 15 dias, na ${quando}` : 'A cada 15 dias'
      else base = quando ? `A cada ${p.interval} semanas, na ${quando}` : `A cada ${p.interval} semanas`
      break
    }

    case 'MONTHLY': {
      const dia = p.byMonthDay.length ? `no dia ${listar(p.byMonthDay.map(String))}` : null
      const cadencia = p.interval === 1 ? 'Todo mês' : `A cada ${p.interval} meses`
      base = dia ? `${cadencia}, ${dia}` : cadencia
      break
    }

    case 'YEARLY':
      base = p.interval === 1 ? 'Todo ano' : `A cada ${p.interval} anos`
      break
  }

  const limites: string[] = []
  if (p.count) limites.push(p.count === 1 ? '1 vez' : `${p.count} vezes`)
  if (p.until) {
    const data = untilLegivel(p.until)
    if (data) limites.push(`até ${data}`)
  }

  return limites.length ? `${base}, ${listar(limites)}` : base
}

/** "Cria 3 dias antes, prazo às 18:00" — a segunda linha do card na listagem. */
export function describeSchedule(leadTimeDays: number, deadlineTime: string): string {
  const prazo = `prazo às ${deadlineTime}`
  if (leadTimeDays === 0) return `Criada na manhã do prazo, ${prazo}`
  if (leadTimeDays === 1) return `Criada 1 dia antes, ${prazo}`
  return `Criada ${leadTimeDays} dias antes, ${prazo}`
}
