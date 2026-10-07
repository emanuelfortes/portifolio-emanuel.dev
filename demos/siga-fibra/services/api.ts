import type {
  ServerMetrics, Process, TrafficSource, ButtonClick, DailyAccess, UTMData,
  EdgeRequestDay, EdgeSummary, IpSummary, IpDailyData, IpDistribution, AsnData,
  IpListResponse, IpFilters, CampanhaData,
} from '../types'
import {
  generateMockRecords, buildMockSummary, buildMockDaily, buildMockDist,
  buildMockAsns, buildMockList,
} from '../hooks/useIpAnalysis'

/**
 * Camada de dados da réplica.
 *
 * No painel original este arquivo fala com a API do servidor via axios. Aqui
 * ele mantém exatamente as mesmas assinaturas, mas devolve dados sintéticos
 * gerados no navegador. Todo o resto (hooks, páginas, componentes) é o código
 * original sem alteração, e é por isso que a interface se comporta igual.
 *
 * Os números são determinísticos por dia: a semente é a própria data, então o
 * dia 12 tem sempre o mesmo volume, e trocar período, granularidade ou site
 * produz leituras coerentes entre si, como num banco de verdade.
 */

/* ------------------------------------------------------------- aleatório -- */

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32: pequeno, rápido e com semente. */
function seeded(seed: string) {
  let a = hash(seed)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Latência de rede plausível, para os skeletons do original aparecerem. */
const latency = <T,>(value: T, ms = 260): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms + Math.random() * 180))

/* ----------------------------------------------------------------- datas -- */

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromISO = (s: string) => new Date(`${s}T12:00:00`)

function resolveRange(q: TrafficQuery): { from: string; to: string } {
  if (q.from && q.to) return { from: q.from, to: q.to }
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - ((q.days ?? 30) - 1))
  return { from: toISO(from), to: toISO(to) }
}

function eachDay(from: string, to: string): string[] {
  const out: string[] = []
  const d = fromISO(from)
  const end = fromISO(to)
  while (d <= end) {
    out.push(toISO(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

/* ---------------------------------------------------------------- canais -- */

const CANAIS = [
  { key: 'organic',    label: 'Google Orgânico', color: '#27CAA3' },
  { key: 'google_ads', label: 'Google Ads',      color: '#0047CC' },
  { key: 'meta_ads',   label: 'Meta Ads',        color: '#1877F2' },
  { key: 'tiktok_ads', label: 'TikTok Ads',      color: '#FF0050' },
  { key: 'social',     label: 'Redes Sociais',   color: '#06b6d4' },
  { key: 'direct',     label: 'Acesso Direto',   color: '#f97316' },
  { key: 'other',      label: 'Outros',          color: '#8b5cf6' },
] as const

type Canal = (typeof CANAIS)[number]['key']
type DayCounts = Record<Canal, number>

/** Volume médio diário por canal, somando os dois sites. */
const BASE: DayCounts = {
  organic: 46, google_ads: 214, meta_ads: 251, tiktok_ads: 6, social: 4, direct: 168, other: 11,
}

/** Participação de cada site no total. */
const SITE_SHARE: Record<string, number> = { all: 1, workspace: 0.68, lp: 0.32 }

function dayCounts(iso: string, site = 'all'): DayCounts {
  const r = seeded(`siga:${iso}`)
  const d = fromISO(iso)
  const weekday = d.getDay()
  // Fim de semana cai, segunda e terça puxam para cima
  const week = weekday === 0 ? 0.72 : weekday === 6 ? 0.8 : weekday <= 2 ? 1.12 : 1
  // Início de mês tem campanha nova no ar: os canais pagos sobem
  const campaign = d.getDate() <= 6 ? 1.35 : 1
  const share = SITE_SHARE[site] ?? 1

  const out = {} as DayCounts
  for (const { key } of CANAIS) {
    const paid = key === 'google_ads' || key === 'meta_ads' || key === 'tiktok_ads'
    const noise = 0.75 + r() * 0.5
    out[key] = Math.round(BASE[key] * week * noise * (paid ? campaign : 1) * share)
  }
  return out
}

function sumCounts(days: string[], site?: string): DayCounts {
  const acc = { organic: 0, google_ads: 0, meta_ads: 0, tiktok_ads: 0, social: 0, direct: 0, other: 0 }
  for (const iso of days) {
    const c = dayCounts(iso, site)
    for (const k of Object.keys(acc) as Canal[]) acc[k] += c[k]
  }
  return acc
}

const totalOf = (c: DayCounts) => Object.values(c).reduce((s, n) => s + n, 0)

/* ------------------------------------------------------------- consultas -- */

export interface TrafficQuery {
  days?: number
  from?: string
  to?: string
  granularity?: string
  /** 'all' ou vazio = sem filtro, a API devolve os dois sites somados */
  site?: string
}

export const getServerMetrics = async (): Promise<ServerMetrics> => {
  // Oscila em torno de um patamar, como uma VPS real sob carga leve
  const t = Date.now() / 1000
  const cpu = 22 + Math.sin(t / 9) * 7 + Math.random() * 6
  const memUsed = 2870 + Math.sin(t / 23) * 140 + Math.random() * 40
  return latency({
    cpu: Math.round(cpu * 10) / 10,
    memory: { used: memUsed, total: 7951, percent: Math.round((memUsed / 7951) * 1000) / 10 },
    disk: { used: 41_472, total: 81_920, percent: 50.6 },
    // Ligado há 23 dias e alguns minutos
    uptime: 23 * 86400 + 4 * 3600 + Math.floor((t % 3600)),
    network: { received: 18_420 + Math.random() * 300, sent: 9_310 + Math.random() * 200 },
  }, 120)
}

export const getProcesses = async (): Promise<Process[]> => {
  const j = () => Math.random() * 1.6
  return latency([
    { id: 0, name: 'siga-api',       status: 'online', cpu: 2.1 + j(), memory: 148, uptime: 1_987_200, restarts: 2 },
    { id: 1, name: 'siga-workspace', status: 'online', cpu: 1.4 + j(), memory: 212, uptime: 1_987_200, restarts: 1 },
    { id: 2, name: 'siga-lp',        status: 'online', cpu: 0.3 + j(), memory: 96,  uptime: 1_987_200, restarts: 0 },
    { id: 3, name: 'siga-dashboard', status: 'online', cpu: 0.2 + j(), memory: 64,  uptime: 604_800,   restarts: 0 },
  ], 120)
}

export const getTrafficSources = async (q: TrafficQuery = {}): Promise<TrafficSource[]> => {
  const { from, to } = resolveRange(q)
  const sum = sumCounts(eachDay(from, to), q.site)
  const total = totalOf(sum) || 1
  return latency(
    CANAIS
      .map(c => ({ source: c.key, label: c.label, color: c.color, count: sum[c.key], percent: (sum[c.key] / total) * 100 }))
      .filter(s => s.count > 0)
      .sort((a, b) => b.count - a.count),
  )
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const getDailyAccess = async (q: TrafficQuery = {}): Promise<DailyAccess[]> => {
  const { from, to } = resolveRange(q)
  const granularity = (q.granularity ?? 'day') as 'day' | 'week' | 'month'
  const buckets = new Map<string, { label: string; days: string[] }>()

  for (const iso of eachDay(from, to)) {
    const d = fromISO(iso)
    let key = iso
    let label = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
    if (granularity === 'week') {
      const start = new Date(d)
      start.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // segunda-feira
      key = toISO(start)
      label = `${pad(start.getDate())}/${pad(start.getMonth() + 1)}`
    } else if (granularity === 'month') {
      key = iso.slice(0, 7)
      label = `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`
    }
    if (!buckets.has(key)) buckets.set(key, { label, days: [] })
    buckets.get(key)!.days.push(iso)
  }

  const rows: DailyAccess[] = [...buckets.entries()].map(([bucket, { label, days }]) => {
    const c = sumCounts(days, q.site)
    return {
      date: label,
      bucket,
      granularity,
      total: totalOf(c),
      organic: c.organic,
      paid: c.google_ads + c.meta_ads + c.tiktok_ads,
      social: c.social,
      direct: c.direct,
      google_ads: c.google_ads,
      meta_ads: c.meta_ads,
      tiktok_ads: c.tiktok_ads,
      other: c.other,
    }
  })
  return latency(rows)
}

/**
 * IDs sintéticos: as campanhas reais têm identificadores das contas de anúncio
 * do cliente, que não entram num site público. O formato é preservado.
 */
const CAMPANHAS = [
  { campaign: '120214938550170582', source: 'meta_ads',   medium: 'cpc',   share: 0.41 },
  { campaign: '21458803917',        source: 'google_ads', medium: 'cpc',   share: 0.22 },
  { campaign: '21458803924',        source: 'google_ads', medium: 'cpc',   share: 0.15 },
  { campaign: 'nitro-800-outubro',  source: 'meta_ads',   medium: 'paid',  share: 0.08 },
  { campaign: '21460114502',        source: 'google_ads', medium: 'cpc',   share: 0.06 },
  { campaign: 'amigo-indica',       source: 'social',     medium: 'organic', share: 0.03 },
  { campaign: '120214938601440582', source: 'meta_ads',   medium: 'cpc',   share: 0.03 },
  { campaign: 'tiktok-teste-ugc',   source: 'tiktok_ads', medium: 'cpc',   share: 0.02 },
]

export const getUTMData = async (q: TrafficQuery = {}): Promise<UTMData[]> => {
  const { from, to } = resolveRange(q)
  const c = sumCounts(eachDay(from, to), q.site)
  const paid = c.google_ads + c.meta_ads + c.tiktok_ads
  return latency(
    CAMPANHAS
      .map(({ share, ...u }) => ({ ...u, clicks: Math.round(paid * share) }))
      .filter(u => u.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks),
  )
}

/* --------------------------------------------------------------- cliques -- */

const PLANOS = ['SIGA NITRO 600 Mb', 'SIGA NITRO 800 Mb', 'Internet Hipervelocidade']
const PAGINAS = ['/', '/planos', '/internet-fibra', '/promocao', '/contato']

/** Peso de cada botão no volume de cliques de um dia. */
const BOTOES_PESO: [string, number][] = [
  ['plano_assinar', 0.2], ['hero_ver_planos', 0.14], ['navbar_fale_conosco', 0.1],
  ['whatsapp_link', 0.1], ['hero_contratar', 0.08], ['checkout_fechar_pedido', 0.07],
  ['hero_especialista', 0.06], ['banner_home', 0.05], ['campanha_banner', 0.05],
  ['campanha_assinar', 0.04], ['campanha_app', 0.04], ['phone_link', 0.03],
  ['navbar_whatsapp', 0.015], ['plan_subscribe', 0.015], ['fab_whatsapp', 0.01], ['outbound_link', 0.01],
]

function pickWeighted<T>(r: () => number, items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0)
  let x = r() * total
  for (const [item, w] of items) {
    x -= w
    if (x <= 0) return item
  }
  return items[items.length - 1][0]
}

function clicksOfDay(iso: string, site = 'all'): ButtonClick[] {
  const c = dayCounts(iso, site)
  const r = seeded(`siga:clicks:${iso}:${site}`)
  // Taxa de clique em torno de 3,5% dos acessos
  const n = Math.round(totalOf(c) * (0.03 + r() * 0.012))
  const origens = CANAIS.map(k => [k.key, c[k.key] + 0.01] as [string, number])
  const today = toISO(new Date())
  const out: ButtonClick[] = []

  for (let i = 0; i < n; i++) {
    const button = pickWeighted(r, BOTOES_PESO)
    const source = pickWeighted(r, origens)
    const hour = 7 + Math.floor(r() * 16)
    // Hoje só existem cliques até a hora atual
    if (iso === today && hour > new Date().getHours()) continue
    const ts = `${iso}T${pad(hour)}:${pad(Math.floor(r() * 60))}:${pad(Math.floor(r() * 60))}.000Z`
    const plano = PLANOS[Math.floor(r() * PLANOS.length)]
    const label =
      button === 'plano_assinar' ? `Assinar ${plano}`
      : button === 'checkout_fechar_pedido' ? `Fechar pedido - ${plano}`
      : button === 'campanha_app' ? (r() < 0.55 ? 'Disney+' : r() < 0.6 ? 'HBO Max' : 'Globoplay')
      : button
    const isLp = ['navbar_whatsapp', 'plan_subscribe', 'fab_whatsapp', 'hero_cta', 'cta_final'].includes(button)
    const campanha = CAMPANHAS.find(x => x.source === source)
    out.push({
      button,
      label,
      count: 1,
      source,
      timestamp: ts,
      site: isLp ? 'lp' : 'workspace',
      medium: campanha?.medium ?? (source === 'organic' ? 'organic' : source === 'direct' ? '(none)' : 'referral'),
      campaign: campanha?.campaign ?? '',
      page: button.startsWith('campanha') ? '/promocao' : PAGINAS[Math.floor(r() * PAGINAS.length)],
    })
  }
  return out
}

export const getButtonClicks = async (q: TrafficQuery = {}): Promise<ButtonClick[]> => {
  const { from, to } = resolveRange(q)
  const all = eachDay(from, to).flatMap(iso => clicksOfDay(iso, q.site))
  return latency(all.sort((a, b) => b.timestamp.localeCompare(a.timestamp)))
}

/* -------------------------------------------------------------- campanha -- */

export const getCampanha = async (q: TrafficQuery = {}): Promise<CampanhaData> => {
  const { from, to } = resolveRange(q)
  const granularity = q.granularity ?? 'day'
  const dias = eachDay(from, to)
  const serie = (await getDailyAccess({ ...q, from, to, granularity })).map(row => {
    const r = seeded(`siga:camp:${row.bucket}`)
    const banner = Math.round(row.total * (0.045 + r() * 0.02))
    const visitas = Math.round(banner * (0.62 + r() * 0.1))
    const assinar = Math.round(visitas * (0.21 + r() * 0.06))
    const pedidos = Math.round(assinar * (0.38 + r() * 0.1))
    return { date: row.date, bucket: row.bucket ?? row.date, banner, visitas, assinar, pedidos }
  })

  const funil = serie.reduce(
    (s, x) => ({ banner: s.banner + x.banner, visitas: s.visitas + x.visitas, assinar: s.assinar + x.assinar, pedidos: s.pedidos + x.pedidos }),
    { banner: 0, visitas: 0, assinar: 0, pedidos: 0 },
  )

  const disney = Math.round(funil.assinar * 0.52)
  const hbo = Math.round(funil.assinar * 0.31)
  const apps = [
    { nome: 'Disney+', total: disney },
    { nome: 'HBO Max', total: hbo },
    { nome: 'Globoplay', total: funil.assinar - disney - hbo },
  ].filter(a => a.total > 0)

  const mix: [string, number][] = [['meta_ads', 0.46], ['google_ads', 0.27], ['direct', 0.15], ['organic', 0.08], ['social', 0.04]]
  const origens = mix
    .map(([nome, share]) => ({ nome, total: Math.round(funil.pedidos * share) }))
    .filter(o => o.total > 0)

  const r = seeded(`siga:pedidos:${from}:${to}`)
  const pedidosDetalhe = Array.from({ length: Math.min(funil.pedidos, 40) }, () => {
    const dia = dias[Math.floor(r() * dias.length)]
    const app = apps.length ? apps[Math.floor(r() * apps.length)].nome : 'Disney+'
    return {
      timestamp: `${dia}T${pad(9 + Math.floor(r() * 12))}:${pad(Math.floor(r() * 60))}:00.000Z`,
      source: pickWeighted(r, mix),
      medium: 'cpc',
      label: `${PLANOS[Math.floor(r() * 2)]} + ${app}`,
      page: '/promocao',
    }
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return latency({
    campanha: { id: 'streaming-outubro', nome: 'Streaming Grátis', pagina: '/promocao' },
    periodo: { from, to, granularity },
    funil,
    apps,
    origens,
    serie,
    pedidosDetalhe,
  })
}

/* ------------------------------------------------------------------ edge -- */

export const getEdgeRequests = async (days = 30): Promise<EdgeRequestDay[]> => {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - (days - 1))
  return latency(eachDay(toISO(from), toISO(to)).map(iso => {
    const r = seeded(`siga:edge:${iso}`)
    // Cada acesso dispara dezenas de requisições (HTML, JS, imagens, fontes)
    const total = Math.round(totalOf(dayCounts(iso)) * (38 + r() * 8))
    const cached = Math.round(total * (0.86 + r() * 0.07))
    const d = fromISO(iso)
    return { date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`, total, cached, uncached: total - cached }
  }))
}

export const getEdgeSummary = async (days = 30): Promise<EdgeSummary> => {
  const daily = await getEdgeRequests(days)
  const total = daily.reduce((s, d) => s + d.total, 0)
  const cached = daily.reduce((s, d) => s + d.cached, 0)
  return { total, cached, uncached: total - cached, cacheRate: total ? (cached / total) * 100 : 0 }
}

/* ------------------------------------------------------------------- IPs -- */

/* Mesmo gerador que o hook original usa como reserva, servido como resposta
   da API para a página não exibir o aviso de "dados simulados". */

export const getIpSummary = async (_days = 30): Promise<IpSummary> => latency(buildMockSummary(generateMockRecords()))
export const getIpDaily = async (days = 30): Promise<IpDailyData[]> => latency(buildMockDaily(days))
export const getIpDist = async (_days = 30): Promise<IpDistribution> => latency(buildMockDist(generateMockRecords()))
export const getIpAsns = async (_days = 30): Promise<AsnData[]> => latency(buildMockAsns(generateMockRecords()))
export const getIpList = async (f: IpFilters): Promise<IpListResponse> => latency(buildMockList(generateMockRecords(), f))

/* Ações que no original vão ao servidor. Na réplica não têm efeito colateral. */
export const blockIp = async (ip: string) => latency({ ok: true, ip })
export const unblockIp = async (ip: string) => latency({ ok: true, ip })
export const trackClick = async (_payload: Record<string, string>) => {}
export const trackAccess = async (_payload: Record<string, string>) => {}
