'use client'

import { Activity, Users, Wifi, Cpu, MemoryStick } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard } from '../components/StatCard'
import { ProgressBar } from '../components/ProgressBar'
import { useServerMetrics } from '../hooks/useServerMetrics'
import { useTrafficData } from '../hooks/useTrafficData'
import { SkeletonBars, SkeletonRows, Skeleton } from '../components/Skeleton'

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatBytes(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb.toFixed(0)} MB`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl p-3 text-xs" style={{ border: '1px solid rgba(39,202,163,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <p className="mb-2 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function Overview() {
  const { metrics, processes, loading: serverLoading } = useServerMetrics(5000)
  const { sources, daily, loading: trafficLoading } = useTrafficData(7, 30000)

  const totalAccesses = daily.reduce((s, d) => s + d.total, 0)
  // const totalClicks = sources.reduce((s, src) => s + src.count, 0)
  const onlineProcesses = processes.filter(p => p.status === 'online').length

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Siga Fibra</p>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Visão Geral</h1>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Resumo do servidor e tráfego dos últimos 7 dias</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU do Servidor"
          value={metrics?.cpu ?? 0} decimals={1} suffix="%" loading={serverLoading}
          subtitle="Em tempo real"
          icon={Cpu}
          color={metrics && metrics.cpu > 85 ? 'red' : metrics && metrics.cpu > 65 ? 'orange' : 'blue'}
        />
        <StatCard
          title="Memória RAM"
          value={metrics?.memory.percent ?? 0} decimals={1} suffix="%" loading={serverLoading}
          subtitle={metrics ? `${formatBytes(metrics.memory.used)} de ${formatBytes(metrics.memory.total)}` : ''}
          icon={MemoryStick}
          color="cyan"
        />
        <StatCard
          title="Acessos (7 dias)"
          value={totalAccesses} loading={trafficLoading}
          subtitle="Visitantes únicos"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Servidor Online"
          value={formatUptime(metrics?.uptime ?? 0)} loading={serverLoading}
          subtitle={`${onlineProcesses} processo(s) ativo(s)`}
          icon={Wifi}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5" style={{ border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold" style={{ color: '#111827' }}>Acessos por dia</h2>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Últimos 7 dias</p>
            </div>
            <Activity className="w-5 h-5" style={{ color: '#27CAA3' }} />
          </div>
          {trafficLoading ? (
            <SkeletonBars n={7} height={180} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27CAA3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#27CAA3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="social" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03C2C3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#03C2C3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="organic" name="Google Orgânico" stroke="#27CAA3" fill="url(#organic)" strokeWidth={2} />
                <Area type="monotone" dataKey="social" name="Redes Sociais" stroke="#03C2C3" fill="url(#social)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Saúde do Servidor</h2>
          {serverLoading ? (
            <SkeletonRows n={3} height={38} />
          ) : (
            <div className="space-y-5">
              <ProgressBar
                value={metrics?.cpu ?? 0}
                label="CPU"
                sublabel="Processamento"
                color="#27CAA3"
              />
              <ProgressBar
                value={metrics?.memory.percent ?? 0}
                label="Memória RAM"
                sublabel={metrics ? `${formatBytes(metrics.memory.used)} usados` : ''}
                color="#03C2C3"
              />
              <ProgressBar
                value={metrics?.disk.percent ?? 0}
                label="Disco"
                sublabel={metrics ? `${formatBytes(metrics.disk.used)} de ${formatBytes(metrics.disk.total)}` : ''}
                color="#06b6d4"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h2 className="font-bold mb-4" style={{ color: '#111827' }}>Origens de Tráfego</h2>
        {trafficLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{Array.from({length:5},(_,i)=><Skeleton key={i} className="rounded-xl" style={{height:96}} />)}</div>
        ) : sources.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhum dado de tráfego ainda. Configure o rastreamento no site.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {sources.map((src) => (
              <div key={src.source} className="rounded-xl p-4 text-center" style={{ background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: src.color }} />
                <p className="font-extrabold text-xl" style={{ color: '#111827' }}>{src.count.toLocaleString('pt-BR')}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: '#6b7280' }}>{src.label}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{src.percent.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
