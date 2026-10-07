'use client'

import { useState } from 'react'
import { TrendingUp, Globe, Search, Megaphone, Link, Share2, Clock, RefreshCw, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useTrafficData, useTrafficCompare } from '../hooks/useTrafficData'
import { PeriodSelector } from '../components/PeriodSelector'
import { Delta } from '../components/Delta'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { RefreshDot } from '../components/RefreshDot'
import { Skeleton, SkeletonBars, SkeletonPie, SkeletonRows } from '../components/Skeleton'
import { DURACAO, EASE, TRANSICAO_BARRA, TRANSICAO_FLEX } from '../utils/motion'
import { compareRange, dayCount, formatRange, resolvePreset, suggestGranularity } from '../utils/period'
import type { CompareMode, Granularity, PresetId, Range } from '../utils/period'

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM  = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }

const sourceIcons: Record<string, React.ReactNode> = {
  organic:    <Search className="w-4 h-4" />,
  google_ads: <Megaphone className="w-4 h-4" />,
  meta_ads:   <Share2 className="w-4 h-4" />,
  tiktok_ads: <Share2 className="w-4 h-4" />,
  social:     <Share2 className="w-4 h-4" />,
  direct:     <Link className="w-4 h-4" />,
  other:      <Globe className="w-4 h-4" />,
}

const CANAIS = [
  { key: 'organic',    label: 'Google Orgânico', color: '#27CAA3' },
  { key: 'google_ads', label: 'Google Ads',      color: '#0047CC' },
  { key: 'meta_ads',   label: 'Meta Ads',        color: '#1877F2' },
  { key: 'tiktok_ads', label: 'TikTok Ads',      color: '#FF0050' },
  { key: 'social',     label: 'Redes Sociais',   color: '#06b6d4' },
  { key: 'direct',     label: 'Acesso Direto',   color: '#f97316' },
  { key: 'other',      label: 'Outros',          color: '#8b5cf6' },
]

const GRANULARIDADES: { id: Granularity; label: string }[] = [
  { id: 'day',   label: 'Dia' },
  { id: 'week',  label: 'Semana' },
  { id: 'month', label: 'Mês' },
]

const COMPARACOES: { id: CompareMode; label: string }[] = [
  { id: 'none',     label: 'Sem comparação' },
  { id: 'previous', label: 'vs período anterior' },
  { id: 'lastYear', label: 'vs mesmo período do ano passado' },
]

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
  const radius = outerRadius + 32
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#374151" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${percent.toFixed(1)}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs" style={PANEL}>
        <p className="mb-2 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.fill ?? p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const DAILY_PAGE = 10

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  const ddmm = dateStr.match(/^(\d{1,2})\/(\d{1,2})$/)
  if (ddmm) {
    const year = new Date().getFullYear()
    const d = new Date(year, Number(ddmm[2]) - 1, Number(ddmm[1]), 12)
    if (!isNaN(d.getTime())) return d
  }

  const brFull = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (brFull) {
    let day = Number(brFull[1]), month = Number(brFull[2]), year = Number(brFull[3])
    if (year < 100) year += 2000
    const d = new Date(year, month - 1, day, 12)
    if (!isNaN(d.getTime())) return d
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const d = new Date(dateStr.length === 10 ? dateStr + 'T12:00:00' : dateStr)
    if (!isNaN(d.getTime())) return d
  }

  return null
}

function getDayLabel(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!d) return dateStr || '—'
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem'
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
  if (diff < 7) return `há ${diff} dias`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatDate(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!d) return dateStr || '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function timeAgoFromDate(ts: Date): string {
  const diff = Date.now() - ts.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  return `há ${Math.floor(hours / 24)} dias`
}

const PRESET_INICIAL: PresetId = '30d'

export function TrafficPage() {
  const [preset, setPreset] = useState<PresetId>(PRESET_INICIAL)
  const [range, setRange] = useState<Range>(() => resolvePreset(PRESET_INICIAL))
  const [granularity, setGranularity] = useState<Granularity>(() => suggestGranularity(resolvePreset(PRESET_INICIAL)))
  const [compare, setCompare] = useState<CompareMode>('none')
  const [canal, setCanal] = useState<string | null>(null)
  const [dailyPage, setDailyPage] = useState(1)

  const { sources, daily, utm, loading, refreshing, reloading, lastUpdated, refetch } =
    useTrafficData({ from: range.from, to: range.to, granularity }, 30000)

  // Skeleton na primeira carga e em toda troca manual; a atualizacao
  // automatica de 30s nao entra aqui
  const esqueleto = loading || reloading

  const rangeComparacao = compareRange(range, compare)
  const cmp = useTrafficCompare(rangeComparacao)

  // Ao trocar de período a granularidade volta para a sugerida, senão um ano
  // inteiro por dia viraria centenas de barras ilegíveis
  const handlePeriodo = (p: PresetId, r: Range) => {
    setPreset(p)
    setRange(r)
    setGranularity(suggestGranularity(r))
    setDailyPage(1)
  }

  const getRowTotal = (d: any): number =>
    d.total || (d.organic ?? 0) + (d.paid ?? 0) + (d.social ?? 0) + (d.direct ?? 0)

  const canalAtivo = canal ? CANAIS.find(c => c.key === canal) : null
  const totalPeriodo = daily.reduce((s, d) => s + getRowTotal(d), 0)

  // Com um canal selecionado a página inteira passa a falar só dele
  const totalExibido = canal ? (sources.find(s => s.source === canal)?.count ?? 0) : totalPeriodo
  const totalComparacao = canal
    ? (cmp.sources ? (cmp.sources.find(s => s.source === canal)?.count ?? 0) : null)
    : cmp.total

  // bucket vem em ISO (YYYY-MM-DD ou YYYY-MM), então ordem alfabética já é
  // cronológica — e funciona no mês, que parseDate não consegue interpretar
  const sortedDaily = [...daily].sort((a, b) => {
    const ka = (a as any).bucket, kb = (b as any).bucket
    if (ka && kb) return kb.localeCompare(ka)
    return (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0)
  })
  const visibleDaily = sortedDaily.slice(0, dailyPage * DAILY_PAGE)
  const maxDayTotal = Math.max(...sortedDaily.map(r => getRowTotal(r)), 1)

  const barrasVisiveis = canal ? CANAIS.filter(c => c.key === canal) : CANAIS
  const utmVisivel = canal ? utm.filter(u => u.source === canal) : utm
  const porDia = granularity === 'day'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Analytics</p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Tráfego</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>De onde vêm os visitantes do seu site</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fica no cabeçalho, fora do véu: é um controle de consulta, e a
              pessoa precisa ver a opção selecionada enquanto o dado carrega */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(39,202,163,0.25)' }}>
            {GRANULARIDADES.map(g => (
              <button
                key={g.id}
                onClick={() => setGranularity(g.id)}
                className="px-3 py-2.5 text-xs font-bold transition-colors"
                style={granularity === g.id
                  ? { background: '#27CAA3', color: '#fff' }
                  : { background: '#ffffff', color: '#6b7280' }}
                title={`Agrupar por ${g.label.toLowerCase()}`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <select
            value={compare}
            onChange={e => setCompare(e.target.value as CompareMode)}
            className="text-sm rounded-xl px-3 py-2.5 outline-none font-medium"
            style={{ background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.25)', color: '#374151' }}
          >
            {COMPARACOES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <PeriodSelector preset={preset} range={range} onChange={handlePeriodo} />
        </div>
      </div>

      {/* Filtro cruzado ativo */}
      {canalAtivo && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: canalAtivo.color + '12', border: `1.5px solid ${canalAtivo.color}40` }}>
          <span className="text-sm font-semibold" style={{ color: canalAtivo.color }}>
            Filtrando por {canalAtivo.label}
          </span>
          <span className="text-xs" style={{ color: '#6b7280' }}>— a página inteira mostra só este canal</span>
          <button
            onClick={() => setCanal(null)}
            className="ml-auto flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            style={{ color: canalAtivo.color }}
          >
            <X className="w-3.5 h-3.5" /> Limpar
          </button>
        </div>
      )}

      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5" style={{ color: '#27CAA3' }} />
          <h2 className="font-bold" style={{ color: '#111827' }}>
            {canalAtivo ? `Acessos — ${canalAtivo.label}` : 'Total de Acessos'}
          </h2>
        </div>
        <div className="flex items-end gap-3 mt-2 flex-wrap">
          {esqueleto
            ? <Skeleton style={{ height: 40, width: 168 }} />
            : <p className="text-4xl font-extrabold" style={{ color: '#111827' }}><AnimatedNumber value={totalExibido} /></p>}
          <div className="mb-1.5"><Delta current={totalExibido} previous={totalComparacao} /></div>
        </div>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
          {formatRange(range)} · {dayCount(range)} {dayCount(range) === 1 ? 'dia' : 'dias'}
          {rangeComparacao && <> · comparando com {formatRange(rangeComparacao)}</>}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {CANAIS.map(({ key, label, color }) => {
          const src = sources.find(s => s.source === key)
          const anterior = cmp.sources ? (cmp.sources.find(s => s.source === key)?.count ?? 0) : null
          const selecionado = canal === key
          return (
            <button
              key={key}
              onClick={() => setCanal(selecionado ? null : key)}
              className="rounded-2xl p-5 text-center transition-all duration-200"
              style={{
                ...PANEL,
                border: selecionado ? `1.5px solid ${color}` : PANEL.border,
                boxShadow: selecionado ? `0 4px 16px ${color}35` : PANEL.boxShadow,
                opacity: canal && !selecionado ? 0.5 : 1,
                transition: `opacity 300ms ease-out, box-shadow 300ms ${EASE}`,
              }}
              title={selecionado ? 'Clique para limpar o filtro' : `Filtrar a página por ${label}`}
            >
              {esqueleto
                ? <Skeleton className="mx-auto" style={{ height: 36, width: '70%' }} />
                : <p className="text-4xl font-extrabold" style={{ color: '#111827' }}>
                    <AnimatedNumber value={src?.count ?? 0} />
                  </p>}
              <div className="w-6 h-0.5 mx-auto mt-2 mb-2 rounded-full" style={{ background: color }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</p>
              {anterior !== null && (
                <div className="mt-2 flex justify-center">
                  <Delta current={src?.count ?? 0} previous={anterior} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Origens de Tráfego</h2>
          {esqueleto ? (
            <SkeletonPie />
          ) : sources.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Nenhum dado ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sources} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={70} animationDuration={DURACAO} animationEasing="ease-out" label={renderLabel} labelLine={{ stroke: 'rgba(39,202,163,0.4)', strokeWidth: 1 }}>
                  {sources.map((entry) => (
                    <Cell
                      key={entry.source}
                      fill={entry.color}
                      opacity={canal && entry.source !== canal ? 0.25 : 1}
                    />
                  ))}
                </Pie>
                <Legend formatter={(value) => <span style={{ color: '#6b7280', fontSize: 12 }}>{value}</span>} />
                <Tooltip formatter={(value) => [Number(value).toLocaleString('pt-BR'), 'Acessos']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Detalhamento por Origem</h2>
          {esqueleto ? (
            <SkeletonRows n={4} height={58} />
          ) : sources.length === 0 ? (
            <div className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhum dado ainda</div>
          ) : (
            <div className="space-y-3">
              {sources.map((src) => {
                const anterior = cmp.sources ? (cmp.sources.find(s => s.source === src.source)?.count ?? 0) : null
                return (
                  <button
                    key={src.source}
                    onClick={() => setCanal(canal === src.source ? null : src.source)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-opacity"
                    style={{ ...ITEM, opacity: canal && canal !== src.source ? 0.45 : 1 }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: src.color + '20', color: src.color }}>
                      {sourceIcons[src.source] ?? <Globe className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold" style={{ color: '#111827' }}>{src.label}</p>
                        <div className="flex items-center gap-2">
                          <Delta current={src.count} previous={anterior} />
                          <p className="text-sm font-bold" style={{ color: '#111827' }}><AnimatedNumber value={src.count} /></p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${src.percent}%`, backgroundColor: src.color, transition: TRANSICAO_BARRA }} />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="font-bold" style={{ color: '#111827' }}>
            Acessos por {granularity === 'day' ? 'dia' : granularity === 'week' ? 'semana' : 'mês'}
          </h2>
        </div>
        {esqueleto ? (
          <SkeletonBars n={16} height={220} />
        ) : daily.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Nenhum dado ainda</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={daily}>
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {barrasVisiveis.map((c, i) => (
                <Bar
                  key={c.key}
                  dataKey={c.key}
                  name={c.label}
                  fill={c.color}
                  stackId="a"
                  radius={i === barrasVisiveis.length - 1 ? [4, 4, 0, 0] : undefined}
                  animationDuration={DURACAO}
                  animationEasing="ease-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Histórico */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: '#27CAA3' }} />
            <h2 className="font-bold" style={{ color: '#111827' }}>Histórico de Acessos</h2>
            {sortedDaily.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}
              >
                {sortedDaily.length} {granularity === 'day' ? 'dias' : granularity === 'week' ? 'semanas' : 'meses'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <RefreshDot active={refreshing} />
              {lastUpdated && (
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  atualizado {timeAgoFromDate(lastUpdated)}
                </p>
              )}
            </div>
            <button
              onClick={refetch}
              className="p-1.5 rounded-lg"
              style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#27CAA3' }}
              title="Atualizar agora"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {esqueleto ? (
          <SkeletonRows n={5} height={92} />
        ) : sortedDaily.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: '#9ca3af' }}>Nenhum acesso registrado ainda</div>
        ) : (
          <div className="space-y-2">
            {visibleDaily.map((day) => {
              const d = day as any
              const rowTotal = getRowTotal(d)
              const segments = [
                { key: 'organic', color: '#27CAA3', value: d.organic ?? 0, label: 'Orgânico' },
                { key: 'paid',    color: '#0047CC', value: d.paid    ?? 0, label: 'Pago' },
                { key: 'social',  color: '#06b6d4', value: d.social  ?? 0, label: 'Social' },
                { key: 'direct',  color: '#f97316', value: d.direct  ?? 0, label: 'Direto' },
              ].filter(s => s.value > 0)

              return (
                <div key={d.bucket ?? day.date} className="p-4 rounded-xl" style={ITEM}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: '#111827' }}>
                        {porDia ? getDayLabel(d.bucket ?? day.date) : day.date}
                      </span>
                      {porDia && (
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                          {formatDate(d.bucket ?? day.date)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#27CAA3' }}>
                      {rowTotal.toLocaleString('pt-BR')} acessos
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(39,202,163,0.08)' }}>
                    <div
                      className="h-full rounded-full flex overflow-hidden"
                      style={{ width: `${(rowTotal / maxDayTotal) * 100}%`, transition: TRANSICAO_BARRA }}
                    >
                      {segments.map(s => (
                        <div key={s.key} style={{ flex: s.value, background: s.color, transition: TRANSICAO_FLEX }} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {segments.map(s => (
                      <span
                        key={s.key}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: s.color + '15', color: s.color }}
                      >
                        {s.value.toLocaleString('pt-BR')} {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}

            {dailyPage * DAILY_PAGE < sortedDaily.length && (
              <button
                onClick={() => setDailyPage(p => p + 1)}
                className="w-full py-2.5 text-sm font-medium rounded-xl"
                style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#27CAA3', background: 'transparent' }}
              >
                Ver mais {Math.min(DAILY_PAGE, sortedDaily.length - dailyPage * DAILY_PAGE)}
              </button>
            )}
          </div>
        )}
      </div>

      {utmVisivel.length > 0 && (
        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Campanhas (UTM)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest border-b" style={{ color: '#9ca3af', borderColor: 'rgba(39,202,163,0.12)' }}>
                  <th className="text-left pb-3">Campanha</th>
                  <th className="text-left pb-3">Origem</th>
                  <th className="text-left pb-3">Meio</th>
                  <th className="text-right pb-3">Acessos</th>
                </tr>
              </thead>
              <tbody>
                {utmVisivel.map((u, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: 'rgba(39,202,163,0.08)' }}>
                    <td className="py-3 font-semibold" style={{ color: '#111827' }}>{u.campaign}</td>
                    <td className="py-3" style={{ color: '#6b7280' }}>{u.source}</td>
                    <td className="py-3" style={{ color: '#6b7280' }}>{u.medium}</td>
                    <td className="py-3 text-right font-bold" style={{ color: '#27CAA3' }}>{u.clicks.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
