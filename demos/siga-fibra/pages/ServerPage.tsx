'use client'

import { Cpu, HardDrive, MemoryStick, Clock, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import { StatCard } from '../components/StatCard'
import { ProgressBar } from '../components/ProgressBar'
import { useServerMetrics } from '../hooks/useServerMetrics'
import { SkeletonRows } from '../components/Skeleton'

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM  = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

function formatBytes(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
  return `${mb.toFixed(0)} MB`
}

const statusConfig = {
  online:  { icon: CheckCircle,  color: '#27CAA3', bg: 'rgba(39,202,163,0.12)',  label: 'Online' },
  stopped: { icon: XCircle,      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Parado' },
  error:   { icon: AlertCircle,  color: '#f97316', bg: 'rgba(249,115,22,0.12)',  label: 'Erro'   },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs" style={PANEL}>
        <p className="mb-1 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value.toFixed(1)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ServerPage() {
  const { metrics, processes, loading, error, refetch } = useServerMetrics(3000)
  const [cpuHistory, setCpuHistory] = useState<{ time: string; cpu: number; mem: number }[]>([])

  useEffect(() => {
    if (metrics) {
      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setCpuHistory(prev => [...prev, { time: now, cpu: metrics.cpu, mem: metrics.memory.percent }].slice(-20))
    }
  }, [metrics])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Infraestrutura</p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Servidor</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Monitoramento em tempo real da VPS</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.25)', color: '#27CAA3' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(39,202,163,0.06)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CPU" value={metrics?.cpu ?? 0} decimals={1} suffix="%" loading={loading} subtitle="Uso atual" icon={Cpu} color={metrics && metrics.cpu > 85 ? 'red' : 'blue'} />
        <StatCard title="Memória" value={metrics?.memory.percent ?? 0} decimals={1} suffix="%" loading={loading} subtitle={metrics ? `${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)}` : ''} icon={MemoryStick} color="cyan" />
        <StatCard title="Disco" value={metrics?.disk.percent ?? 0} decimals={1} suffix="%" loading={loading} subtitle={metrics ? `${formatBytes(metrics.disk.used)} / ${formatBytes(metrics.disk.total)}` : ''} icon={HardDrive} color="green" />
        <StatCard title="Online há" value={formatUptime(metrics?.uptime ?? 0)} loading={loading} subtitle="Tempo sem reiniciar" icon={Clock} color="green" />
      </div>

      <div className="rounded-2xl p-5" style={PANEL}>
        <h2 className="font-bold mb-5" style={{ color: '#111827' }}>CPU e Memória em tempo real</h2>
        {cpuHistory.length < 2 ? (
          <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Coletando dados...</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={cpuHistory}>
              <XAxis dataKey="time" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="cpu" name="CPU" stroke="#27CAA3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mem" name="Memória" stroke="#03C2C3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Uso de Recursos</h2>
          <div className="space-y-5">
            <ProgressBar value={metrics?.cpu ?? 0} label="CPU" sublabel="Processamento do servidor" color="#27CAA3" />
            <ProgressBar value={metrics?.memory.percent ?? 0} label="Memória RAM" sublabel={metrics ? `${formatBytes(metrics.memory.used)} em uso` : ''} color="#03C2C3" />
            <ProgressBar value={metrics?.disk.percent ?? 0} label="Armazenamento" sublabel={metrics ? `${formatBytes(metrics.disk.used)} ocupados` : ''} color="#06b6d4" />
          </div>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Processos Ativos (PM2)</h2>
          {loading ? (
            <SkeletonRows n={3} height={64} />
          ) : processes.length === 0 ? (
            <div className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhum processo encontrado</div>
          ) : (
            <div className="space-y-3">
              {processes.map((proc) => {
                const cfg = statusConfig[proc.status] ?? statusConfig.error
                const Icon = cfg.icon
                return (
                  <div key={proc.id} className="flex items-center justify-between p-3 rounded-xl" style={ITEM}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
                        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#111827' }}>{proc.name}</p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{cfg.label} · {proc.restarts} restart(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>{proc.cpu.toFixed(1)}% CPU</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{formatBytes(proc.memory)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
