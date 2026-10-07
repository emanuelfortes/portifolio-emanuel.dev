'use client'

import { useState, useMemo } from 'react'
import {
  Shield, Globe, AlertTriangle, Ban, Bot, Activity,
  ChevronLeft, ChevronRight, Copy, X, Clock, Link2,
  Monitor, MapPin, Building2, Search, SlidersHorizontal,
  Download, RefreshCw, Calendar,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { IpRecord, IpFilters, IpStatus } from '../types'
import { useIpAnalysis } from '../hooks/useIpAnalysis'
import { SkeletonBars, SkeletonRows } from '../components/Skeleton'

// ─── Constants ────────────────────────────────────────────────────────────────

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM  = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }
const PAGE_SIZE = 15

const STATUS_CONFIG: Record<IpStatus, { label: string; color: string; bg: string }> = {
  human:     { label: 'Humano',   color: '#27CAA3', bg: 'rgba(39,202,163,0.1)'  },
  bot:       { label: 'Bot',      color: '#0047CC', bg: 'rgba(0,71,204,0.1)'    },
  suspicious:{ label: 'Suspeito', color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  blocked:   { label: 'Bloqueado',color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
}

const SCORE_LABEL = (s: number) =>
  s <= 30 ? { label: 'Normal',   color: '#27CAA3' } :
  s <= 60 ? { label: 'Atenção',  color: '#06b6d4' } :
  s <= 80 ? { label: 'Suspeito', color: '#f97316' } :
            { label: 'Crítico',  color: '#ef4444' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IpStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const { label, color } = SCORE_LABEL(score)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold"
        style={{ background: `${color}18`, color }}>
        {score}
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-xs" style={PANEL}>
      <p className="mb-1 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color ?? p.fill }} className="font-bold">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('pt-BR') : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── IP Detail Drawer ─────────────────────────────────────────────────────────

function IpDrawer({ record, onClose }: { record: IpRecord; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'history' | 'agents' | 'urls'>('info')
  const { color } = SCORE_LABEL(record.score)

  const copy = (text: string) => navigator.clipboard.writeText(text)

  const tabs = [
    { id: 'info',    label: 'Detalhes' },
    { id: 'history', label: 'Histórico' },
    { id: 'agents',  label: 'User Agents' },
    { id: 'urls',    label: 'Top URLs' },
  ] as const

  return (
    <>
      <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col overflow-hidden w-full sm:w-[480px]"
        style={{ background: '#fff', borderLeft: '1.5px solid rgba(39,202,163,0.2)', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-lg" style={{ color: '#111827' }}>{record.ip}</span>
              <button onClick={() => copy(record.ip)} className="p-1 rounded-lg transition-colors hover:opacity-70">
                <Copy className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={record.status} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                Score {record.score}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:opacity-70"
            style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-2" style={{ borderColor: 'rgba(39,202,163,0.12)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-3 text-xs font-bold transition-all border-b-2"
              style={{
                color: tab === t.id ? '#27CAA3' : '#9ca3af',
                borderBottomColor: tab === t.id ? '#27CAA3' : 'transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {tab === 'info' && (
            <>
              {[
                { icon: Globe,    label: 'País',            value: `${record.country} (${record.countryCode})` },
                { icon: MapPin,   label: 'Cidade',          value: record.city },
                { icon: Building2,label: 'ASN',             value: record.asn },
                { icon: Building2,label: 'ISP',             value: record.isp },
                { icon: Monitor,  label: 'Hostname',        value: record.hostname },
                { icon: Activity, label: 'Total de acessos',value: record.accesses.toLocaleString('pt-BR') },
                { icon: Link2,    label: 'URLs únicas',     value: record.uniqueUrls },
                { icon: Clock,    label: 'Tempo médio',     value: `${record.avgSessionTime}s` },
                { icon: Clock,    label: 'Primeiro acesso', value: new Date(record.firstAccess).toLocaleString('pt-BR') },
                { icon: Clock,    label: 'Último acesso',   value: new Date(record.lastAccess).toLocaleString('pt-BR') },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={ITEM}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#27CAA3' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{label}</p>
                    <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{value}</p>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl" style={ITEM}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Score de Risco</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-extrabold" style={{ color }}>{record.score}</span>
                  <span className="text-sm font-bold" style={{ color }}>{SCORE_LABEL(record.score).label}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${record.score}%`, backgroundColor: color }} />
                </div>
              </div>
            </>
          )}

          {tab === 'history' && (
            record.accessHistory.length === 0
              ? <p className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Sem histórico</p>
              : record.accessHistory.slice(0, 50).map((ev, i) => (
                <div key={i} className="p-3 rounded-xl" style={ITEM}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(39,202,163,0.1)', color: '#27CAA3' }}>
                      {ev.method}
                    </span>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {new Date(ev.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{ev.url}</p>
                  {ev.referrer && <p className="text-xs truncate mt-0.5" style={{ color: '#9ca3af' }}>ref: {ev.referrer}</p>}
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{ev.userAgent}</p>
                </div>
              ))
          )}

          {tab === 'agents' && (
            record.userAgents.length === 0
              ? <p className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhum User Agent detectado</p>
              : record.userAgents.map((ua, i) => (
                <div key={i} className="p-3 rounded-xl" style={ITEM}>
                  <p className="text-xs font-semibold break-all" style={{ color: '#374151' }}>{ua}</p>
                  <p className="text-xs mt-1" style={{ color: '#27CAA3' }}>
                    {/bot|crawler|spider/i.test(ua) ? '🤖 Bot / Crawler' :
                     /python|curl|axios|go-http/i.test(ua) ? '⚠️ Script automatizado' : '🧑 Navegador humano'}
                  </p>
                </div>
              ))
          )}

          {tab === 'urls' && (
            record.topUrls.length === 0
              ? <p className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhuma URL registrada</p>
              : record.topUrls.sort((a, b) => b.count - a.count).map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={ITEM}>
                  <p className="text-sm font-semibold truncate flex-1 mr-3" style={{ color: '#111827' }}>{u.url}</p>
                  <span className="text-sm font-extrabold flex-shrink-0" style={{ color: '#27CAA3' }}>{u.count}</span>
                </div>
              ))
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-2" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <button onClick={() => copy(record.ip)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3', border: '1px solid rgba(39,202,163,0.2)' }}>
            Copiar IP
          </button>
          {record.status !== 'blocked'
            ? <button className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                Bloquear
              </button>
            : <button className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3', border: '1px solid rgba(39,202,163,0.2)' }}>
                Desbloquear
              </button>
          }
        </div>
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: IpFilters = {
  days: 30, country: '', status: 'all', ip: '', minAccesses: 0, page: 1, pageSize: PAGE_SIZE,
}

export function IpAnalysisPage() {
  const [filters, setFilters] = useState<IpFilters>(DEFAULT_FILTERS)
  const [selectedIp, setSelectedIp] = useState<IpRecord | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { summary, daily, dist, asns, list, loading, reloading, useMock, refetch } = useIpAnalysis(filters)
  const esqueleto = loading || reloading

  const setFilter = (partial: Partial<IpFilters>) =>
    setFilters(prev => ({ ...prev, ...partial, page: 1 }))

  const totalPages = list ? Math.ceil(list.total / PAGE_SIZE) : 0

  const distData = useMemo(() => dist ? [
    { name: 'Humanos',   value: dist.humans,    color: '#27CAA3' },
    { name: 'Bots',      value: dist.bots,      color: '#0047CC' },
    { name: 'Suspeitos', value: dist.suspicious, color: '#f97316' },
    { name: 'Bloqueados',value: dist.blocked,   color: '#ef4444' },
  ] : [], [dist])

  const exportCsv = () => {
    if (!list) return
    const header = 'IP,País,Cidade,ASN,ISP,Acessos,URLs Únicas,Primeiro Acesso,Último Acesso,Score,Status'
    const rows = list.records.map(r =>
      `${r.ip},${r.country},${r.city},${r.asn},${r.isp},${r.accesses},${r.uniqueUrls},${r.firstAccess},${r.lastAccess},${r.score},${r.status}`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `ips-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Segurança</p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Análise de IPs</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Monitoramento de acessos, bots e comportamentos suspeitos</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {useMock && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
              Dados simulados — integre o backend
            </span>
          )}
          <select value={filters.days} onChange={e => setFilter({ days: Number(e.target.value) })}
            className="text-sm rounded-xl px-4 py-2 outline-none font-medium"
            style={{ background: '#fff', border: '1.5px solid rgba(39,202,163,0.25)', color: '#374151' }}>
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>
          <button onClick={refetch} className="p-2 rounded-xl transition-all"
            style={{ background: '#fff', border: '1.5px solid rgba(39,202,163,0.25)', color: '#27CAA3' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,#27CAA3,#03C2C3)', color: '#fff' }}>
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Globe,         label: 'IPs Únicos',     value: summary?.uniqueIps,     color: '#27CAA3' },
          { icon: Activity,      label: 'IPs Repetidos',  value: summary?.repeatedIps,   color: '#03C2C3' },
          { icon: AlertTriangle, label: 'IPs Suspeitos',  value: summary?.suspiciousIps, color: '#f97316' },
          { icon: Ban,           label: 'IPs Bloqueados', value: summary?.blockedIps,    color: '#ef4444' },
          { icon: Bot,           label: 'Bots Conhecidos',value: summary?.knownBots,     color: '#0047CC' },
          { icon: Shield,        label: 'Maior IP Ativo', value: summary?.topActiveIp,   color: '#8b5cf6', small: true },
        ].map(({ icon: Icon, label, value, color, small }) => (
          <div key={label} className="rounded-2xl p-4 flex flex-col gap-2" style={PANEL}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}15`, color }}>
              <Icon className="w-4 h-4" />
            </div>
            <p className={`font-extrabold leading-none ${small ? 'text-base' : 'text-2xl'}`}
              style={{ color: '#111827' }}>
              {loading ? '—' : (value ?? 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>IPs únicos por dia</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={daily}>
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="unique" name="IPs únicos" stroke="#27CAA3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bots"   name="Bots"       stroke="#0047CC" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>IPs suspeitos por dia</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={daily}>
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="suspicious" name="Suspeitos" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Distribuição de acessos</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={distData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'rgba(39,202,163,0.4)', strokeWidth: 1 }}>
                {distData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [Number(v).toLocaleString('pt-BR'), 'IPs']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Top ASNs</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={asns} layout="vertical">
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Acessos" fill="#27CAA3" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Filters */}
      <div className="rounded-2xl p-4" style={PANEL}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" style={{ color: '#27CAA3' }} />
            <span className="text-sm font-bold" style={{ color: '#111827' }}>Filtros</span>
          </div>
          <button onClick={() => setShowFilters(v => !v)} className="text-xs font-bold" style={{ color: '#27CAA3' }}>
            {showFilters ? 'Ocultar' : 'Expandir'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Status filter always visible */}
          <div className="lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>Status</p>
            <select value={filters.status} onChange={e => setFilter({ status: e.target.value as any })}
              className="w-full text-sm rounded-xl px-3 py-2 outline-none font-medium"
              style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }}>
              <option value="all">Todos</option>
              <option value="human">Humano</option>
              <option value="bot">Bot</option>
              <option value="suspicious">Suspeito</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </div>

          {showFilters && (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>IP específico</p>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                  <input value={filters.ip} onChange={e => setFilter({ ip: e.target.value })}
                    placeholder="192.168.0.1"
                    className="w-full text-sm rounded-xl pl-8 pr-3 py-2 outline-none"
                    style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }} />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>País</p>
                <input value={filters.country} onChange={e => setFilter({ country: e.target.value })}
                  placeholder="Brasil, EUA..."
                  className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>Mín. acessos</p>
                <input type="number" value={filters.minAccesses || ''} onChange={e => setFilter({ minAccesses: Number(e.target.value) || 0 })}
                  placeholder="Ex: 100"
                  className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>
                  <Calendar className="w-3 h-3 inline mr-1" />De
                </p>
                <input type="date" value={filters.dateFrom || ''} onChange={e => setFilter({ dateFrom: e.target.value || undefined })}
                  className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>
                  <Calendar className="w-3 h-3 inline mr-1" />Até
                </p>
                <input type="date" value={filters.dateTo || ''} onChange={e => setFilter({ dateTo: e.target.value || undefined })}
                  className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }} />
              </div>

              <div className="flex items-end">
                <button onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="w-full py-2 rounded-xl text-sm font-bold transition-all"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                  Limpar filtros
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table + Top IPs */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Main table */}
        <div className="xl:col-span-3 rounded-2xl overflow-hidden" style={PANEL}>
          <div className="p-5 border-b" style={{ borderColor: 'rgba(39,202,163,0.12)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold" style={{ color: '#111827' }}>Registros de IP</h2>
              {list && (
                <span className="text-xs" style={{ color: '#9ca3af' }}>
                  {list.total.toLocaleString('pt-BR')} registros
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {esqueleto ? (
              <SkeletonBars n={14} height={192} />
            ) : !list?.records.length ? (
              <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Nenhum registro encontrado</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(39,202,163,0.1)' }}>
                    {['IP', 'País', 'ISP', 'Acessos', 'Score', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                        style={{ color: '#9ca3af' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.records.map((rec, i) => (
                    <tr key={rec.ip + i}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid rgba(39,202,163,0.06)' }}
                      onClick={() => setSelectedIp(rec)}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(39,202,163,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-4 py-3 font-mono text-xs font-bold whitespace-nowrap" style={{ color: '#111827' }}>{rec.ip}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#374151' }}>
                        <span>{rec.countryCode}</span>
                        <span className="ml-1 hidden sm:inline text-xs" style={{ color: '#9ca3af' }}>{rec.city}</span>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[140px] truncate" style={{ color: '#6b7280' }}>{rec.isp}</td>
                      <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: '#111827' }}>{rec.accesses.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3"><ScoreBadge score={rec.score} /></td>
                      <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-bold px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3' }}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'rgba(39,202,163,0.12)' }}>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                Página {filters.page} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button disabled={filters.page === 1}
                  onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={filters.page >= totalPages}
                  onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{ background: 'rgba(39,202,163,0.08)', color: '#27CAA3' }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Top 20 IPs widget */}
        <div className="rounded-2xl overflow-hidden" style={PANEL}>
          <div className="p-4 border-b" style={{ borderColor: 'rgba(39,202,163,0.12)' }}>
            <h2 className="font-bold text-sm" style={{ color: '#111827' }}>Top 20 IPs ativos</h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
            {esqueleto ? (
              <SkeletonRows n={4} height={28} />
            ) : (
              list?.records.slice(0, 20).map((rec, i) => (
                <button key={rec.ip} onClick={() => setSelectedIp(rec)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b"
                  style={{ borderColor: 'rgba(39,202,163,0.06)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(39,202,163,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{ background: 'rgba(39,202,163,0.1)', color: '#27CAA3' }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-bold truncate" style={{ color: '#111827' }}>{rec.ip}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{rec.accesses.toLocaleString('pt-BR')} acessos</p>
                  </div>
                  <StatusBadge status={rec.status} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>


      {/* IP Drawer */}
      {selectedIp && <IpDrawer record={selectedIp} onClose={() => setSelectedIp(null)} />}
    </div>
  )
}
