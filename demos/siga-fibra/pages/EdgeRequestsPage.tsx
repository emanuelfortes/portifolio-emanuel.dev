'use client'

import { useState } from 'react'
import { Zap, ShieldCheck, AlertCircle, RefreshCw, Activity } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from 'recharts'
import { useEdgeData } from '../hooks/useEdgeData'
import { SkeletonBars, SkeletonRows } from '../components/Skeleton'

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM  = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return n.toLocaleString('pt-BR')
}

function timeAgo(ts: Date): string {
  const diff = Date.now() - ts.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  return `há ${Math.floor(mins / 60)}h`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-xs min-w-[160px]" style={PANEL}>
      <p className="mb-2 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill ?? p.color }} />
            <span style={{ color: '#6b7280' }}>{p.name}</span>
          </div>
          <span className="font-bold" style={{ color: '#111827' }}>{fmt(p.value)}</span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 flex items-center justify-between border-t" style={{ borderColor: 'rgba(39,202,163,0.12)' }}>
        <span style={{ color: '#9ca3af' }}>Total</span>
        <span className="font-bold" style={{ color: '#27CAA3' }}>
          {fmt(payload.reduce((s: number, p: any) => s + p.value, 0))}
        </span>
      </div>
    </div>
  )
}

export function EdgeRequestsPage() {
  const [days, setDays] = useState(30)
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar')
  const { daily, summary, loading, reloading, lastUpdated, refetch } = useEdgeData(days, 120000)

  const totalReqs     = summary?.total     ?? daily.reduce((s, d) => s + (d.total    ?? 0), 0)
  const cachedReqs    = summary?.cached    ?? daily.reduce((s, d) => s + (d.cached   ?? 0), 0)
  const uncachedReqs  = summary?.uncached  ?? daily.reduce((s, d) => s + (d.uncached ?? 0), 0)
  const cacheRate     = totalReqs > 0 ? (cachedReqs / totalReqs) * 100 : 0

  const esqueleto = loading || reloading

  const maxDay = Math.max(...daily.map(d => d.total ?? 0), 1)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Infraestrutura</p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Edge Requests</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Requisições recebidas e processadas pelo edge</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs" style={{ color: '#9ca3af' }}>atualizado {timeAgo(lastUpdated)}</span>
          )}
          <button
            onClick={refetch}
            className="p-1.5 rounded-lg"
            style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#27CAA3' }}
            title="Atualizar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-sm rounded-xl px-4 py-2 outline-none font-medium"
            style={{ background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.25)', color: '#374151' }}
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={PANEL}>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5" style={{ color: '#27CAA3' }} />
          <h2 className="font-bold" style={{ color: '#111827' }}>Total de Requisições</h2>
        </div>
        <p className="text-5xl font-extrabold mt-3 tracking-tight" style={{ color: '#111827' }}>
          {loading ? '—' : fmt(totalReqs)}
        </p>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
          requisições nos últimos {days} dias
        </p>
        {!loading && totalReqs > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
              <div className="h-full flex rounded-full overflow-hidden">
                <div style={{ width: `${cacheRate}%`, background: '#27CAA3' }} />
                <div style={{ width: `${100 - cacheRate}%`, background: '#6366f1' }} />
              </div>
            </div>
            <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#27CAA3' }}>
              {cacheRate.toFixed(1)}% cached
            </span>
          </div>
        )}
      </div>

      {/* Cached / Uncached / Cache Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(39,202,163,0.12)' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: '#27CAA3' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Em Cache (HIT)</p>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: '#111827' }}>
            {loading ? '—' : fmt(cachedReqs)}
          </p>
          <p className="text-xs mt-1 font-bold" style={{ color: '#27CAA3' }}>
            {cacheRate.toFixed(1)}% do total
          </p>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
            <div style={{ width: `${cacheRate}%`, height: '100%', background: '#27CAA3', borderRadius: '999px' }} />
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: '#9ca3af' }}>
            Arquivos estáticos (imagens, CSS, JS, fontes) entregues direto pelo servidor sem reprocessar — resposta mais rápida e menor uso de CPU.
          </p>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(99,102,241,0.1)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#6366f1' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Sem Cache (MISS)</p>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: '#111827' }}>
            {loading ? '—' : fmt(uncachedReqs)}
          </p>
          <p className="text-xs mt-1 font-bold" style={{ color: '#6366f1' }}>
            {(100 - cacheRate).toFixed(1)}% do total
          </p>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
            <div style={{ width: `${100 - cacheRate}%`, height: '100%', background: '#6366f1', borderRadius: '999px' }} />
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: '#9ca3af' }}>
            Páginas e rotas dinâmicas processadas pelo servidor a cada acesso — conteúdo sempre atualizado, porém com maior consumo de recursos.
          </p>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(39,202,163,0.12)' }}>
              <Activity className="w-4 h-4" style={{ color: '#27CAA3' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Média por Dia</p>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: '#111827' }}>
            {loading || daily.length === 0 ? '—' : fmt(Math.round(totalReqs / daily.length))}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            req/dia nos {days} dias
          </p>
          <p className="text-xs mt-2 font-bold" style={{ color: '#27CAA3' }}>
            pico: {loading ? '—' : fmt(maxDay)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="font-bold" style={{ color: '#111827' }}>Requisições por Dia</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#27CAA3' }} />
                <span style={{ color: '#6b7280' }}>Em Cache</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#6366f1' }} />
                <span style={{ color: '#6b7280' }}>Sem Cache</span>
              </div>
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1.5px solid rgba(39,202,163,0.2)' }}>
              {(['bar', 'area'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className="px-3 py-1 text-xs font-medium transition-colors"
                  style={chartType === t
                    ? { background: '#27CAA3', color: '#fff' }
                    : { background: 'transparent', color: '#9ca3af' }
                  }
                >
                  {t === 'bar' ? 'Barras' : 'Área'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {esqueleto ? (
          <SkeletonBars n={20} height={256} />
        ) : daily.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Nenhum dado disponível</div>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={daily} barGap={0}>
              <CartesianGrid vertical={false} stroke="rgba(39,202,163,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={55} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(39,202,163,0.04)' }} />
              <Bar dataKey="cached"   name="Em Cache"   fill="#27CAA3" stackId="a" />
              <Bar dataKey="uncached" name="Sem Cache"  fill="#6366f1" stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="gradCached" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#27CAA3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#27CAA3" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradUncached" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(39,202,163,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area dataKey="cached"   name="Em Cache"  stroke="#27CAA3" fill="url(#gradCached)"   strokeWidth={2} />
              <Area dataKey="uncached" name="Sem Cache" stroke="#6366f1" fill="url(#gradUncached)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Daily breakdown list */}
      {!loading && daily.length > 0 && (
        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Detalhe por Dia</h2>
          <div className="space-y-2">
            {[...daily].reverse().slice(0, 10).map((d, i) => {
              const dayTotal = (d.total ?? 0) || (d.cached ?? 0) + (d.uncached ?? 0)
              const hitRate = dayTotal > 0 ? ((d.cached ?? 0) / dayTotal) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={ITEM}>
                  <p className="text-sm font-medium w-24 flex-shrink-0" style={{ color: '#374151' }}>{d.date}</p>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
                    <div className="h-full flex rounded-full overflow-hidden">
                      <div style={{ width: `${hitRate}%`,       background: '#27CAA3' }} />
                      <div style={{ width: `${100 - hitRate}%`, background: '#6366f1' }} />
                    </div>
                  </div>
                  <p className="text-sm font-bold w-20 text-right flex-shrink-0" style={{ color: '#111827' }}>{fmt(dayTotal)}</p>
                  <p className="text-xs w-14 text-right flex-shrink-0 font-bold" style={{ color: '#27CAA3' }}>{hitRate.toFixed(0)}% HIT</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
