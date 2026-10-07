export interface ServerMetrics {
  cpu: number
  memory: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
  uptime: number
  network: { received: number; sent: number }
}

export interface Process {
  id: number
  name: string
  status: 'online' | 'stopped' | 'error'
  cpu: number
  memory: number
  uptime: number
  restarts: number
}

export interface TrafficSource {
  source: string
  label: string
  count: number
  percent: number
  color: string
}

export interface ButtonClick {
  button: string
  label: string
  count: number
  source: string
  timestamp: string
  site?: string
  medium?: string
  campaign?: string
  page?: string
}

export interface DailyAccess {
  date: string
  total: number
  organic: number
  paid: number
  social: number
  direct: number
  /** Chave ISO do balde (YYYY-MM-DD, ou YYYY-MM quando agrupado por mês) */
  bucket?: string
  granularity?: 'day' | 'week' | 'month'
  google_ads?: number
  meta_ads?: number
  tiktok_ads?: number
  other?: number
}

export interface UTMData {
  campaign: string
  source: string
  medium: string
  clicks: number
}

export interface EdgeRequestDay {
  date: string
  total: number
  cached: number
  uncached: number
}

export interface EdgeSummary {
  total: number
  cached: number
  uncached: number
  cacheRate: number
}

// ─── IP Analysis ──────────────────────────────────────────────────────────────

export type IpStatus = 'human' | 'bot' | 'suspicious' | 'blocked'

export interface IpAccessEvent {
  timestamp: string
  url: string
  method: string
  userAgent: string
  referrer: string
  sessionTime: number
}

export interface IpRecord {
  ip: string
  country: string
  countryCode: string
  city: string
  asn: string
  isp: string
  hostname: string
  accesses: number
  uniqueUrls: number
  firstAccess: string
  lastAccess: string
  avgSessionTime: number
  score: number
  status: IpStatus
  userAgents: string[]
  topUrls: { url: string; count: number }[]
  accessHistory: IpAccessEvent[]
}

export interface IpSummary {
  uniqueIps: number
  repeatedIps: number
  suspiciousIps: number
  blockedIps: number
  knownBots: number
  topActiveIp: string
}

export interface IpDailyData {
  date: string
  unique: number
  suspicious: number
  bots: number
}

export interface IpDistribution {
  humans: number
  bots: number
  suspicious: number
  blocked: number
}

export interface AsnData {
  name: string
  count: number
}

export interface IpListResponse {
  records: IpRecord[]
  total: number
  page: number
  pageSize: number
}

export interface IpFilters {
  days: number
  country: string
  status: IpStatus | 'all'
  ip: string
  minAccesses: number
  page: number
  pageSize: number
  dateFrom?: string
  dateTo?: string
}

// ─── Campanha do mes ──────────────────────────────────────────────────────────

export interface CampanhaFunil {
  banner: number
  visitas: number
  assinar: number
  pedidos: number
}

export interface CampanhaContagem {
  nome: string
  total: number
}

export interface CampanhaSerie {
  date: string
  bucket: string
  banner: number
  visitas: number
  assinar: number
  pedidos: number
}

export interface CampanhaPedido {
  timestamp: string
  source: string
  medium: string
  label: string
  page: string
}

export interface CampanhaData {
  campanha: { id: string; nome: string; pagina: string }
  periodo: { from: string; to: string; granularity: string }
  funil: CampanhaFunil
  apps: CampanhaContagem[]
  origens: CampanhaContagem[]
  serie: CampanhaSerie[]
  pedidosDetalhe: CampanhaPedido[]
}
