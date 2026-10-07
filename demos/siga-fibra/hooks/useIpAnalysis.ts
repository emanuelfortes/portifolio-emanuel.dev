import { useState, useEffect, useCallback } from 'react'
import type { IpSummary, IpDailyData, IpDistribution, AsnData, IpRecord, IpListResponse, IpFilters } from '../types'
import { getIpSummary, getIpDaily, getIpDist, getIpAsns, getIpList } from '../services/api'

// ─── Mock data (usado enquanto o backend não tem esses endpoints) ─────────────

const SUSPICIOUS_UAS = [
  'Googlebot/2.1', 'Bingbot/2.0', 'meta-externalagent/1.1', 'ChatGPT-User',
  'ClaudeBot/1.0', 'AhrefsBot/7.0', 'SemrushBot/7', 'DotBot/1.2',
  'python-requests/2.31', 'curl/7.88', 'axios/1.4', 'Go-http-client/2.0',
]

const HUMAN_UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Mobile Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 Safari/605.1.15',
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/120',
]

const COUNTRIES = [
  { country: 'Brasil', countryCode: 'BR', cities: ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Fortaleza'] },
  { country: 'Estados Unidos', countryCode: 'US', cities: ['New York', 'San Francisco', 'Seattle', 'Dallas'] },
  { country: 'Alemanha', countryCode: 'DE', cities: ['Frankfurt', 'Berlin', 'Munich'] },
  { country: 'Holanda', countryCode: 'NL', cities: ['Amsterdam', 'Rotterdam'] },
  { country: 'Singapura', countryCode: 'SG', cities: ['Singapore'] },
]

const ASNS = [
  { asn: 'AS396982', name: 'Google Cloud' },
  { asn: 'AS32934', name: 'Meta Platforms' },
  { asn: 'AS16509', name: 'Amazon AWS' },
  { asn: 'AS8075', name: 'Microsoft Azure' },
  { asn: 'AS13335', name: 'Cloudflare' },
  { asn: 'AS24940', name: 'Hetzner Online' },
  { asn: 'AS16276', name: 'OVH SAS' },
  { asn: 'AS7922', name: 'Comcast' },
  { asn: 'AS28573', name: 'Claro Brasil' },
  { asn: 'AS18881', name: 'TELEFÔNICA BRASIL' },
]

const URLS = ['/', '/planos', '/internet-fibra', '/contato', '/sobre', '/atendimento',
  '/teste-velocidade', '/amigo-indica', '/blog', '/api/leads', '/favicon.ico', '/robots.txt']

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)] }

function calcScore(accesses: number, uniqueUrls: number, ua: string): number {
  let score = 0
  if (accesses > 100) score += 20
  if (accesses > 500) score += 30
  if (uniqueUrls > 8 && accesses / uniqueUrls < 3) score += 20
  const suspiciousUaKeywords = ['bot', 'crawler', 'spider', 'python', 'curl', 'axios', 'go-http', 'ahrefs', 'semrush']
  if (suspiciousUaKeywords.some(k => ua.toLowerCase().includes(k))) score += 15
  const crawlerAsns = ['Google Cloud', 'Meta Platforms', 'Amazon AWS', 'Microsoft Azure']
  if (crawlerAsns.some(k => ua.includes(k))) score += 15
  return Math.min(score, 100)
}

function statusFromScore(score: number): IpRecord['status'] {
  if (score >= 81) return 'blocked'
  if (score >= 61) return 'suspicious'
  if (score >= 31) return 'bot'
  return 'human'
}

let _mockRecords: IpRecord[] | null = null

export function generateMockRecords(): IpRecord[] {
  if (_mockRecords) return _mockRecords
  const now = Date.now()
  const records: IpRecord[] = []

  for (let i = 0; i < 120; i++) {
    const loc = pick(COUNTRIES)
    const asnEntry = pick(ASNS)
    const accesses = rand(1, 800)
    const uniqueUrls = Math.min(rand(1, 12), accesses)
    const isBot = i < 30
    const ua = isBot ? pick(SUSPICIOUS_UAS) : pick(HUMAN_UAS)
    const score = calcScore(accesses, uniqueUrls, ua)
    const ip = `${rand(1, 220)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`
    const firstMs = now - rand(1, 30) * 86400000
    const lastMs = firstMs + rand(0, now - firstMs)

    const topUrls = Array.from({ length: uniqueUrls }, () => ({
      url: pick(URLS),
      count: rand(1, Math.ceil(accesses / uniqueUrls)),
    }))

    const accessHistory = Array.from({ length: Math.min(accesses, 50) }, (_, j) => ({
      timestamp: new Date(firstMs + j * rand(1000, 600000)).toISOString(),
      url: pick(URLS),
      method: rand(0, 5) === 0 ? 'POST' : 'GET',
      userAgent: ua,
      referrer: rand(0, 2) === 0 ? 'https://google.com' : '',
      sessionTime: rand(5, 300),
    }))

    records.push({
      ip,
      country: loc.country,
      countryCode: loc.countryCode,
      city: pick(loc.cities),
      asn: asnEntry.asn,
      isp: asnEntry.name,
      hostname: `${ip.replace(/\./g, '-')}.${asnEntry.name.toLowerCase().replace(/\s/g, '')}.net`,
      accesses,
      uniqueUrls,
      firstAccess: new Date(firstMs).toISOString(),
      lastAccess: new Date(lastMs).toISOString(),
      avgSessionTime: rand(10, 240),
      score,
      status: statusFromScore(score),
      userAgents: [ua],
      topUrls,
      accessHistory,
    })
  }

  _mockRecords = records.sort((a, b) => b.accesses - a.accesses)
  return _mockRecords
}

export function buildMockSummary(records: IpRecord[]): IpSummary {
  return {
    uniqueIps:     records.length,
    repeatedIps:   records.filter(r => r.accesses > 1).length,
    suspiciousIps: records.filter(r => r.status === 'suspicious').length,
    blockedIps:    records.filter(r => r.status === 'blocked').length,
    knownBots:     records.filter(r => r.status === 'bot').length,
    topActiveIp:   records[0]?.ip ?? '—',
  }
}

export function buildMockDaily(days: number): IpDailyData[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000)
    const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    return { date: label, unique: rand(20, 120), suspicious: rand(2, 20), bots: rand(5, 35) }
  })
}

export function buildMockDist(records: IpRecord[]): IpDistribution {
  return {
    humans:    records.filter(r => r.status === 'human').length,
    bots:      records.filter(r => r.status === 'bot').length,
    suspicious: records.filter(r => r.status === 'suspicious').length,
    blocked:   records.filter(r => r.status === 'blocked').length,
  }
}

export function buildMockAsns(records: IpRecord[]): AsnData[] {
  const map: Record<string, number> = {}
  records.forEach(r => { map[r.isp] = (map[r.isp] ?? 0) + r.accesses })
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
}

export function buildMockList(records: IpRecord[], filters: IpFilters): IpListResponse {
  let filtered = [...records]
  if (filters.status !== 'all') filtered = filtered.filter(r => r.status === filters.status)
  if (filters.country) filtered = filtered.filter(r => r.country.toLowerCase().includes(filters.country.toLowerCase()))
  if (filters.ip) filtered = filtered.filter(r => r.ip.includes(filters.ip))
  if (filters.minAccesses) filtered = filtered.filter(r => r.accesses >= filters.minAccesses)
  const total = filtered.length
  const start = (filters.page - 1) * filters.pageSize
  return { records: filtered.slice(start, start + filters.pageSize), total, page: filters.page, pageSize: filters.pageSize }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIpAnalysis(filters: IpFilters) {
  const [summary, setSummary]   = useState<IpSummary | null>(null)
  const [daily, setDaily]       = useState<IpDailyData[]>([])
  const [dist, setDist]         = useState<IpDistribution | null>(null)
  const [asns, setAsns]         = useState<AsnData[]>([])
  const [list, setList]         = useState<IpListResponse | null>(null)
  // loading só até haver dado. Trocar de filtro ou de página não apaga a
  // tabela: os dados atuais ficam enquanto os novos chegam
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [useMock, setUseMock]   = useState(false)

  const fetch = useCallback(async () => {
    setRefreshing(true)
    try {
      const [s, d, dist, a, l] = await Promise.all([
        getIpSummary(filters.days),
        getIpDaily(filters.days),
        getIpDist(filters.days),
        getIpAsns(filters.days),
        getIpList(filters),
      ])
      setSummary(s); setDaily(d); setDist(dist); setAsns(a); setList(l)
      setUseMock(false)
    } catch {
      const records = generateMockRecords()
      setSummary(buildMockSummary(records))
      setDaily(buildMockDaily(filters.days))
      setDist(buildMockDist(records))
      setAsns(buildMockAsns(records))
      setList(buildMockList(records, filters))
      setUseMock(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters.days, filters.status, filters.country, filters.ip, filters.minAccesses, filters.page, filters.pageSize])

  useEffect(() => { fetch() }, [fetch])

  // Aqui não há atualização automática: todo fetch vem de uma troca de filtro
  // ou de página feita pelo usuário, então toda busca embaça a tela
  return { summary, daily, dist, asns, list, loading, refreshing, reloading: refreshing, useMock, refetch: fetch }
}
