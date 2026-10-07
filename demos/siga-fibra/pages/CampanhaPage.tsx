'use client'

import { useState } from 'react'
import { Gift, Image, Eye, MousePointerClick, MessageCircle, RefreshCw, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useCampanha } from '../hooks/useCampanha'
import { PeriodSelector } from '../components/PeriodSelector'
import { StatCard } from '../components/StatCard'
import { resolvePreset, suggestGranularity, formatRange } from '../utils/period'
import type { Granularity, PresetId, Range } from '../utils/period'
import { SOURCE_CORES, SOURCE_ROTULOS, baixarCSV } from '../utils/clicks'

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }

// A promocao e do mes, entao o painel abre no mes corrente e nao nos 30 dias
const PRESET_INICIAL: PresetId = 'thisMonth'

const ETAPAS = [
  { key: 'banner', label: 'Cliques no banner', color: '#0f2d22' },
  { key: 'visitas', label: 'Visitas ao checkout', color: '#03C2C3' },
  { key: 'assinar', label: 'Cliques em assinar', color: '#f97316' },
  { key: 'pedidos', label: 'Pedidos no WhatsApp', color: '#27CAA3' },
] as const

const APP_CORES: Record<string, string> = {
  'Disney+': '#0063e5',
  'HBO Max': '#7b2bf9',
}

const pct = (parte: number, todo: number) => (todo > 0 ? (parte / todo) * 100 : 0)
const umaCasa = (n: number) => n.toFixed(1).replace('.', ',')

const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function CampanhaPage() {
  const [preset, setPreset] = useState<PresetId>(PRESET_INICIAL)
  const [range, setRange] = useState<Range>(() => resolvePreset(PRESET_INICIAL))
  const [granularity, setGranularity] = useState<Granularity>(() => suggestGranularity(resolvePreset(PRESET_INICIAL)))

  const { data, loading, reloading, error, lastUpdated, refetch } = useCampanha(
    { from: range.from, to: range.to, granularity },
    30000,
  )

  const handlePeriodo = (p: PresetId, r: Range) => {
    setPreset(p)
    setRange(r)
    setGranularity(suggestGranularity(r))
  }

  const funil = data?.funil ?? { banner: 0, visitas: 0, assinar: 0, pedidos: 0 }
  const apps = data?.apps ?? []
  const origens = data?.origens ?? []
  const pedidos = data?.pedidosDetalhe ?? []
  const totalApps = apps.reduce((s, a) => s + a.total, 0)

  const exportar = () => {
    baixarCSV(
      `campanha-${data?.campanha.id ?? 'mes'}-${range.from}-a-${range.to}.csv`,
      ['Data', 'Origem', 'Mídia', 'Oferta', 'Página'],
      pedidos.map(p => [dataHora(p.timestamp), SOURCE_ROTULOS[p.source] ?? p.source, p.medium, p.label, p.page]),
    )
  }

  return (
    <div className="space-y-6">

      {/* Cabecalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #0f2d22, #15543c)' }}>
            <Gift className="w-5 h-5" style={{ color: '#3ddcbc' }} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#111827' }}>
              Campanha {data?.campanha.nome ?? ''}
            </h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {formatRange(range)}
              {lastUpdated && ` · atualizado ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PeriodSelector preset={preset} range={range} onChange={handlePeriodo} />
          <button
            onClick={refetch}
            className="p-2.5 rounded-xl transition-colors"
            style={{ ...ITEM, color: '#27CAA3' }}
            aria-label="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${reloading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Funil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Cliques no banner" value={funil.banner} loading={loading} icon={Image} color="cyan"
          subtitle="Carrossel da home" />
        <StatCard title="Visitas ao checkout" value={funil.visitas} loading={loading} icon={Eye} color="cyan"
          subtitle={funil.banner > 0 ? `${umaCasa(pct(funil.visitas, funil.banner))}% do banner` : 'Página da promoção'} />
        <StatCard title="Cliques em assinar" value={funil.assinar} loading={loading} icon={MousePointerClick} color="orange"
          subtitle="Card da promoção nos planos" />
        <StatCard title="Pedidos no WhatsApp" value={funil.pedidos} loading={loading} icon={MessageCircle} color="green"
          subtitle={funil.visitas > 0 ? `${umaCasa(pct(funil.pedidos, funil.visitas))}% das visitas` : 'Fechamento do pedido'} />
      </div>

      {/* Evolucao */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <p className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Evolução da campanha</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data?.serie ?? []}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1.5px solid rgba(39,202,163,0.2)', fontSize: 12 }}
              formatter={(v, n) => [v, ETAPAS.find(e => e.key === n)?.label ?? n]}
            />
            <Legend formatter={(n: string) => ETAPAS.find(e => e.key === n)?.label ?? n} wrapperStyle={{ fontSize: 11 }} />
            {ETAPAS.map(e => (
              <Bar key={e.key} dataKey={e.key} fill={e.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Preferencia de streaming */}
        <div className="rounded-2xl p-5" style={PANEL}>
          <p className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Streaming escolhido</p>
          <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>
            Qual app o visitante selecionou dentro da promoção
          </p>
          {apps.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: '#9ca3af' }}>
              Ninguém escolheu um app ainda neste período.
            </p>
          ) : (
            <div className="space-y-3">
              {apps.map(a => (
                <div key={a.nome}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold" style={{ color: '#374151' }}>{a.nome}</span>
                    <span className="text-sm font-extrabold" style={{ color: '#111827' }}>
                      {a.total}
                      <span className="text-xs font-normal ml-1" style={{ color: '#9ca3af' }}>
                        ({umaCasa(pct(a.total, totalApps))}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct(a.total, totalApps)}%`, background: APP_CORES[a.nome] ?? '#27CAA3' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Origem dos pedidos */}
        <div className="rounded-2xl p-5" style={PANEL}>
          <p className="text-sm font-bold mb-1" style={{ color: '#111827' }}>De onde vieram os pedidos</p>
          <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>
            Origem de quem fechou pedido da promoção
          </p>
          {origens.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: '#9ca3af' }}>
              Nenhum pedido da promoção neste período.
            </p>
          ) : (
            <div className="space-y-2">
              {origens.map(o => (
                <div key={o.nome} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={ITEM}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: SOURCE_CORES[o.nome] ?? '#8b5cf6' }} />
                    <span className="text-sm font-semibold truncate" style={{ color: '#374151' }}>
                      {SOURCE_ROTULOS[o.nome] ?? o.nome}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold shrink-0 ml-3" style={{ color: '#111827' }}>{o.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pedidos */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <p className="text-sm font-bold" style={{ color: '#111827' }}>Pedidos da promoção</p>
          {pedidos.length > 0 && (
            <button
              onClick={exportar}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              style={{ ...ITEM, color: '#27CAA3' }}
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          )}
        </div>
        <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>
          Cada linha é um clique em "Fechar pedido". Nome e telefone não aparecem aqui —
          esses dados só existem na conversa do WhatsApp.
        </p>

        {pedidos.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: '#9ca3af' }}>
            Nenhum pedido da promoção neste período.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: '#9ca3af' }}>
                  <th className="text-left font-bold text-xs uppercase tracking-wider pb-2">Data</th>
                  <th className="text-left font-bold text-xs uppercase tracking-wider pb-2">Origem</th>
                  <th className="text-left font-bold text-xs uppercase tracking-wider pb-2">Oferta</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr key={`${p.timestamp}-${i}`} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td className="py-2.5 whitespace-nowrap" style={{ color: '#374151' }}>{dataHora(p.timestamp)}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: SOURCE_CORES[p.source] ?? '#8b5cf6' }} />
                        <span style={{ color: '#374151' }}>{SOURCE_ROTULOS[p.source] ?? p.source}</span>
                      </span>
                    </td>
                    <td className="py-2.5" style={{ color: '#6b7280' }}>{p.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
