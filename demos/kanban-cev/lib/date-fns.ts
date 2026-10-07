/**
 * O pedaço do `date-fns` que as telas usam, sem a dependência.
 *
 * `format` entende só os padrões que aparecem no código copiado
 * ("HH:mm", "d 'de' MMM, HH:mm", "dd/MM HH:mm").
 */
const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const ptBR = { code: 'pt-BR' }

const pad = (n: number) => String(n).padStart(2, '0')

export function format(d: Date, padrao: string, _opts?: { locale?: unknown }): string {
  let out = ''
  for (let i = 0; i < padrao.length; ) {
    if (padrao[i] === "'") {
      const fim = padrao.indexOf("'", i + 1)
      out += padrao.slice(i + 1, fim)
      i = fim + 1
      continue
    }
    const token = /^(dd|d|MMM|MM|HH|mm|yyyy)/.exec(padrao.slice(i))?.[0]
    if (!token) {
      out += padrao[i]
      i++
      continue
    }
    out +=
      token === 'dd' ? pad(d.getDate())
      : token === 'd' ? String(d.getDate())
      : token === 'MMM' ? MESES_CURTOS[d.getMonth()]
      : token === 'MM' ? pad(d.getMonth() + 1)
      : token === 'HH' ? pad(d.getHours())
      : token === 'mm' ? pad(d.getMinutes())
      : String(d.getFullYear())
    i += token.length
  }
  return out
}

const mesmoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const isToday = (d: Date) => mesmoDia(d, new Date())

export function isTomorrow(d: Date) {
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  return mesmoDia(d, amanha)
}

export const isPast = (d: Date) => d.getTime() < Date.now()

/** "há 5 minutos", "em 2 dias" — o `formatDistanceToNowStrict` com `addSuffix` em pt-BR. */
export function formatDistanceToNowStrict(d: Date, _opts?: { addSuffix?: boolean; locale?: unknown }): string {
  const diff = d.getTime() - Date.now()
  const s = Math.abs(diff) / 1000
  const unidades: [number, string, string][] = [
    [60, 'segundo', 'segundos'],
    [60, 'minuto', 'minutos'],
    [24, 'hora', 'horas'],
    [30, 'dia', 'dias'],
    [12, 'mês', 'meses'],
    [Infinity, 'ano', 'anos'],
  ]
  let valor = s
  let i = 0
  while (i < unidades.length - 1 && Math.round(valor) >= unidades[i]![0]) {
    valor /= unidades[i]![0]
    i++
  }
  const n = Math.round(valor)
  const texto = `${n} ${n === 1 ? unidades[i]![1] : unidades[i]![2]}`
  return diff < 0 ? `há ${texto}` : `em ${texto}`
}
