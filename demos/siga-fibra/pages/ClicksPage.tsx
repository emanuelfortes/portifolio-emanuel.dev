'use client'

import { useMemo, useState } from 'react'
import { MousePointerClick, TrendingUp, Clock, RefreshCw, Filter, Download, Layers, Package, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTrafficData, useTrafficCompare } from '../hooks/useTrafficData'
import { PeriodSelector } from '../components/PeriodSelector'
import { Delta } from '../components/Delta'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { RefreshDot } from '../components/RefreshDot'
import { Skeleton, SkeletonBarsH, SkeletonHeatmap, SkeletonRows } from '../components/Skeleton'
import { DURACAO, TRANSICAO_BARRA, TRANSICAO_COR } from '../utils/motion'
import { compareRange, dayCount, formatRange, resolvePreset } from '../utils/period'
import type { CompareMode, PresetId, Range } from '../utils/period'
import {
  CHECKOUT, INTENCAO, POSICAO, SOURCE_CORES, SOURCE_ROTULOS, WHATSAPP,
  agruparRepetidos, baixarCSV, contarUnicos, planoDoClique, rotuloBotao,
} from '../utils/clicks'

const PANEL = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
const ITEM  = { background: '#f9fafb', border: '1.5px solid rgba(39,202,163,0.1)' }

const HISTORY_PAGE = 30
const PRESET_INICIAL: PresetId = '30d'

const COMPARACOES: { id: CompareMode; label: string }[] = [
  { id: 'none',     label: 'Sem comparação' },
  { id: 'previous', label: 'vs período anterior' },
  { id: 'lastYear', label: 'vs mesmo período do ano passado' },
]

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function getDayKey(ts: string): string {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })
}

const pct = (n: number) => `${n.toFixed(1).replace('.', ',')}%`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs max-w-xs" style={PANEL}>
        <p className="mb-2 font-semibold" style={{ color: '#6b7280' }}>{label}</p>
        {payload.filter((p: any) => p.value > 0).map((p: any) => (
          <p key={p.dataKey} style={{ color: p.fill }} className="font-bold">{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export function ClicksPage() {
  const [preset, setPreset] = useState<PresetId>(PRESET_INICIAL)
  const [range, setRange] = useState<Range>(() => resolvePreset(PRESET_INICIAL))
  const [compare, setCompare] = useState<CompareMode>('none')
  const [historyPage, setHistoryPage] = useState(1)

  const [fBotao, setFBotao] = useState('')
  const [fOrigem, setFOrigem] = useState('')
  const [fPlano, setFPlano] = useState('')
  const [busca, setBusca] = useState('')

  const { clicks, sources, daily, loading, refreshing, reloading, lastUpdated, refetch } =
    useTrafficData({ from: range.from, to: range.to }, 60000)

  // Skeleton na primeira carga e em toda troca manual; a atualizacao
  // automatica de 60s nao entra aqui
  const esqueleto = loading || reloading

  const rangeComparacao = compareRange(range, compare)
  const cmp = useTrafficCompare(rangeComparacao, true)

  const handlePeriodo = (p: PresetId, r: Range) => {
    setPreset(p)
    setRange(r)
    setHistoryPage(1)
  }

  const totalAcessos = daily.reduce((s, d) => s + (d.total ?? 0), 0)

  // ── Funil ──────────────────────────────────────────────────────────────
  const nIntencao = clicks.filter(c => INTENCAO.includes(c.button)).length
  const nCheckout = clicks.filter(c => CHECKOUT.includes(c.button)).length
  const nWhatsapp = clicks.filter(c => WHATSAPP.includes(c.button)).length

  const etapas = [
    { nome: 'Acessos',            valor: totalAcessos,  cor: '#27CAA3', desc: 'visitantes no período' },
    { nome: 'Clicaram em algo',   valor: clicks.length, cor: '#03C2C3', desc: 'qualquer botão rastreado' },
    { nome: 'Intenção de assinar',valor: nIntencao,     cor: '#0047CC', desc: 'clicou em assinar/contratar' },
    { nome: 'Fechou pedido',      valor: nCheckout,     cor: '#f97316', desc: 'checkout concluído' },
  ]
  const topoFunil = etapas[0].valor || 1

  // ── CTR por origem ─────────────────────────────────────────────────────
  const ctrPorOrigem = useMemo(() => {
    const cliquesPorOrigem: Record<string, number> = {}
    clicks.forEach(c => { cliquesPorOrigem[c.source] = (cliquesPorOrigem[c.source] ?? 0) + 1 })
    return sources
      .map(s => ({
        source: s.source,
        label: s.label,
        color: s.color,
        acessos: s.count,
        cliques: cliquesPorOrigem[s.source] ?? 0,
        ctr: s.count > 0 ? ((cliquesPorOrigem[s.source] ?? 0) / s.count) * 100 : 0,
      }))
      .filter(x => x.acessos > 0 || x.cliques > 0)
      .sort((a, b) => b.ctr - a.ctr)
  }, [clicks, sources])

  const ctrGeral = totalAcessos > 0 ? (clicks.length / totalAcessos) * 100 : 0

  // ── Planos ─────────────────────────────────────────────────────────────
  const planos = useMemo(() => {
    const mapa: Record<string, { total: number; origens: Record<string, number> }> = {}
    for (const c of clicks) {
      const plano = planoDoClique(c)
      if (!plano) continue
      mapa[plano] ??= { total: 0, origens: {} }
      mapa[plano].total++
      mapa[plano].origens[c.source] = (mapa[plano].origens[c.source] ?? 0) + 1
    }
    return Object.entries(mapa).map(([plano, d]) => ({ plano, ...d })).sort((a, b) => b.total - a.total)
  }, [clicks])

  // ── Botões ─────────────────────────────────────────────────────────────
  const porBotao = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {}
    clicks.forEach(c => {
      grouped[c.button] ??= {}
      grouped[c.button][c.source] = (grouped[c.button][c.source] ?? 0) + 1
    })
    const antes: Record<string, number> = {}
    cmp.clicks?.forEach(c => { antes[c.button] = (antes[c.button] ?? 0) + 1 })

    return Object.entries(grouped).map(([button, origens]) => ({
      key: button,
      button: rotuloBotao(button),
      posicao: POSICAO[button] ?? '—',
      ...origens,
      total: Object.values(origens).reduce((s, v) => s + v, 0),
      anterior: cmp.clicks ? (antes[button] ?? 0) : null,
    })).sort((a, b) => b.total - a.total)
  }, [clicks, cmp.clicks])

  // ── Heatmap hora × dia ─────────────────────────────────────────────────
  const heat = useMemo(() => {
    const grade: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))
    for (const c of clicks) {
      const d = new Date(c.timestamp)
      grade[d.getDay()][d.getHours()]++
    }
    const max = Math.max(...grade.flat(), 1)
    return { grade, max }
  }, [clicks])

  // ── Histórico filtrado ─────────────────────────────────────────────────
  const cliquesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return clicks
      .filter(c => !fBotao || c.button === fBotao)
      .filter(c => !fOrigem || c.source === fOrigem)
      .filter(c => !fPlano || planoDoClique(c) === fPlano)
      .filter(c => !termo || `${c.label} ${rotuloBotao(c.button)} ${c.campaign ?? ''} ${c.page ?? ''}`.toLowerCase().includes(termo))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [clicks, fBotao, fOrigem, fPlano, busca])

  const agrupados = useMemo(() => agruparRepetidos(cliquesFiltrados), [cliquesFiltrados])
  const visiveis = agrupados.slice(0, historyPage * HISTORY_PAGE)

  const historicoPorDia = useMemo(() => {
    const groups: { key: string; items: typeof visiveis }[] = []
    const idx: Record<string, number> = {}
    for (const g of visiveis) {
      const k = getDayKey(g.click.timestamp)
      if (idx[k] === undefined) { idx[k] = groups.length; groups.push({ key: k, items: [] }) }
      groups[idx[k]].items.push(g)
    }
    return groups
  }, [visiveis])

  const temFiltro = !!(fBotao || fOrigem || fPlano || busca)
  const unicos = contarUnicos(clicks)
  const repetidos = clicks.length - unicos

  const exportar = () => {
    baixarCSV(
      `cliques_${range.from}_a_${range.to}.csv`,
      ['Data e hora', 'Botão', 'Rótulo', 'Plano', 'Origem', 'Campanha', 'Página', 'Site', 'Repetições no minuto'],
      agrupados.map(({ click: c, vezes }) => [
        formatDateTime(c.timestamp), rotuloBotao(c.button), c.label ?? '',
        planoDoClique(c) ?? '', SOURCE_ROTULOS[c.source] ?? c.source,
        c.campaign ?? '', c.page ?? '', c.site ?? '', vezes,
      ]),
    )
  }

  const selectStyle = { background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#27CAA3' }}>Conversão</p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Cliques nos Botões</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Do acesso até o pedido fechado</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={compare}
            onChange={e => setCompare(e.target.value as CompareMode)}
            className="text-sm rounded-xl px-3 py-2.5 outline-none font-medium"
            style={{ ...selectStyle, border: '1.5px solid rgba(39,202,163,0.25)' }}
          >
            {COMPARACOES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <PeriodSelector preset={preset} range={range} onChange={handlePeriodo} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-1">
            <MousePointerClick className="w-5 h-5" style={{ color: '#27CAA3' }} />
            <h2 className="font-bold text-sm" style={{ color: '#111827' }}>Total de Cliques</h2>
          </div>
          <div className="flex items-end gap-2 mt-2 flex-wrap">
            {esqueleto ? <Skeleton className="mt-2" style={{ height: 40, width: 150 }} /> : <p className="text-4xl font-extrabold" style={{ color: '#111827' }}><AnimatedNumber value={clicks.length} /></p>}
            <div className="mb-1.5"><Delta current={clicks.length} previous={cmp.clicks ? cmp.clicks.length : null} /></div>
          </div>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {formatRange(range)} · {dayCount(range)} {dayCount(range) === 1 ? 'dia' : 'dias'}
          </p>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5" style={{ color: '#03C2C3' }} />
            <h2 className="font-bold text-sm" style={{ color: '#111827' }}>Cliques sem repetição</h2>
          </div>
          {esqueleto ? <Skeleton className="mt-2" style={{ height: 40, width: 150 }} /> : <p className="text-4xl font-extrabold mt-2" style={{ color: '#111827' }}><AnimatedNumber value={unicos} /></p>}
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {repetidos > 0
              ? `${repetidos.toLocaleString('pt-BR')} repetições descontadas`
              : 'nenhuma repetição no período'}
          </p>
        </div>

        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5" style={{ color: '#0047CC' }} />
            <h2 className="font-bold text-sm" style={{ color: '#111827' }}>Taxa de clique geral</h2>
          </div>
          {esqueleto ? <Skeleton className="mt-2" style={{ height: 40, width: 120 }} /> : <p className="text-4xl font-extrabold mt-2" style={{ color: '#111827' }}><AnimatedNumber value={ctrGeral} decimals={1} suffix="%" /></p>}
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {clicks.length.toLocaleString('pt-BR')} cliques em {totalAcessos.toLocaleString('pt-BR')} acessos
          </p>
        </div>
      </div>

      {/* Aviso sobre "únicos" */}
      {repetidos > 0 && (
        <div className="flex items-start gap-2 rounded-xl px-4 py-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1.5px solid rgba(249,115,22,0.25)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f97316' }} />
          <p className="text-xs" style={{ color: '#7c2d12' }}>
            <strong>"Sem repetição" é aproximado.</strong> O rastreamento não grava identificador de visitante,
            então não dá para dizer quantas <em>pessoas</em> clicaram. O número acima agrupa cliques do mesmo
            botão, mesma origem e mesma página dentro do mesmo minuto — o caso do clique duplo. Para contar
            pessoas de verdade é preciso passar a gravar um id anônimo de visitante.
          </p>
        </div>
      )}

      {/* Funil */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-5 h-5" style={{ color: '#27CAA3' }} />
          <h2 className="font-bold" style={{ color: '#111827' }}>Funil de Conversão</h2>
        </div>
        <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>Quanto se perde entre uma etapa e a seguinte</p>

        {esqueleto ? (
          <SkeletonRows n={4} height={74} />
        ) : (
          <div className="space-y-1">
            {etapas.map((e, i) => {
              const anterior = i > 0 ? etapas[i - 1].valor : null
              const passagem = anterior && anterior > 0 ? (e.valor / anterior) * 100 : null
              return (
                <div key={e.nome}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 pl-4 py-1">
                      <div className="w-px h-4" style={{ background: 'rgba(39,202,163,0.3)' }} />
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: (passagem ?? 0) < 5 ? 'rgba(239,68,68,0.12)' : 'rgba(39,202,163,0.12)',
                          color: (passagem ?? 0) < 5 ? '#ef4444' : '#27CAA3',
                        }}
                      >
                        {passagem === null ? '—' : `${pct(passagem)} passam`}
                      </span>
                      {anterior !== null && passagem !== null && (
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                          {(anterior - e.valor).toLocaleString('pt-BR')} não avançam
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-4 rounded-xl" style={ITEM}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#111827' }}>{e.nome}</p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{e.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-extrabold" style={{ color: e.cor }}><AnimatedNumber value={e.valor} /></p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{pct((e.valor / topoFunil) * 100)} do topo</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.max((e.valor / topoFunil) * 100, e.valor > 0 ? 1 : 0)}%`, background: e.cor, transition: TRANSICAO_BARRA }} />
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(37,211,102,0.08)', border: '1.5px solid rgba(37,211,102,0.25)' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#111827' }}>Saída por WhatsApp</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>
                    Caminho paralelo ao checkout — a conversa acontece fora do site
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold" style={{ color: '#25D366' }}><AnimatedNumber value={nWhatsapp} /></p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>
                    {clicks.length > 0 ? pct((nWhatsapp / clicks.length) * 100) : '—'} dos cliques
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTR por origem */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <h2 className="font-bold mb-1" style={{ color: '#111827' }}>Qualidade do Tráfego por Origem</h2>
        <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>
          Quantos dos visitantes de cada canal chegaram a clicar em algum botão
        </p>
        {esqueleto ? (
          <SkeletonRows n={4} height={40} />
        ) : ctrPorOrigem.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: '#9ca3af' }}>Nenhum dado ainda</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest border-b" style={{ color: '#9ca3af', borderColor: 'rgba(39,202,163,0.12)' }}>
                  <th className="text-left pb-3">Origem</th>
                  <th className="text-right pb-3">Acessos</th>
                  <th className="text-right pb-3">Cliques</th>
                  <th className="text-right pb-3">Taxa</th>
                  <th className="pb-3 w-1/3" />
                </tr>
              </thead>
              <tbody>
                {ctrPorOrigem.map(o => (
                  <tr key={o.source} className="border-b" style={{ borderColor: 'rgba(39,202,163,0.08)' }}>
                    <td className="py-3 font-semibold" style={{ color: '#111827' }}>
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: o.color }} />
                      {o.label}
                    </td>
                    <td className="py-3 text-right" style={{ color: '#6b7280' }}>{o.acessos.toLocaleString('pt-BR')}</td>
                    <td className="py-3 text-right" style={{ color: '#6b7280' }}>{o.cliques.toLocaleString('pt-BR')}</td>
                    <td className="py-3 text-right font-bold" style={{ color: o.color }}>{pct(o.ctr)}</td>
                    <td className="py-3 pl-4">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(39,202,163,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(o.ctr, 100)}%`, background: o.color, transition: TRANSICAO_BARRA }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Planos */}
      {planos.length > 0 && (
        <div className="rounded-2xl p-5" style={PANEL}>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5" style={{ color: '#27CAA3' }} />
            <h2 className="font-bold" style={{ color: '#111827' }}>Planos mais clicados</h2>
          </div>
          <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>Qual plano o anúncio está realmente empurrando</p>
          <div className="space-y-3">
            {planos.map((p, i) => (
              <div key={p.plano} className="p-4 rounded-xl" style={ITEM}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}>{i + 1}</span>
                    <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{p.plano}</p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0" style={{ color: '#27CAA3' }}>
                    {p.total.toLocaleString('pt-BR')} cliques
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.origens).sort((a, b) => b[1] - a[1]).map(([src, n]) => (
                    <span key={src} className="text-xs px-2 py-1 rounded-lg font-medium"
                      style={{ background: (SOURCE_CORES[src] ?? '#9ca3af') + '18', color: SOURCE_CORES[src] ?? '#6b7280' }}>
                      {n} · {SOURCE_ROTULOS[src] ?? src}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cliques por botão */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <h2 className="font-bold mb-5" style={{ color: '#111827' }}>Cliques por Botão e Origem</h2>
        {esqueleto ? (
          <SkeletonBarsH n={7} height={240} />
        ) : porBotao.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>Nenhum dado ainda.</div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(240, porBotao.length * 34)}>
            <BarChart data={porBotao} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="button" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={200} />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(SOURCE_CORES).map(source => (
                <Bar key={source} dataKey={source} name={SOURCE_ROTULOS[source]} fill={SOURCE_CORES[source]} stackId="a" radius={[0, 4, 4, 0]} animationDuration={DURACAO} animationEasing="ease-out" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Ranking */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5" style={{ color: '#27CAA3' }} />
          <h2 className="font-bold" style={{ color: '#111827' }}>Ranking dos Botões</h2>
        </div>
        {esqueleto ? (
          <SkeletonRows n={4} height={96} />
        ) : porBotao.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>Nenhum dado ainda</div>
        ) : (
          <div className="space-y-3">
            {porBotao.map((item, i) => (
              <div key={item.key} className="p-4 rounded-xl" style={ITEM}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{item.button}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Posição: {item.posicao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Delta current={item.total} previous={item.anterior} />
                    <p className="text-sm font-bold" style={{ color: '#27CAA3' }}>{item.total.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SOURCE_CORES).map(([source, color]) => {
                    const count = (item as any)[source] ?? 0
                    if (count === 0) return null
                    return (
                      <div key={source} className="text-center px-3 py-2 rounded-lg bg-white" style={{ border: '1px solid rgba(39,202,163,0.12)' }}>
                        <p className="font-bold text-sm" style={{ color }}>{count}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{SOURCE_ROTULOS[source]}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <h2 className="font-bold mb-1" style={{ color: '#111827' }}>Quando as pessoas clicam</h2>
        <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>
          Hora × dia da semana — define horário de anúncio e escala de atendimento
        </p>
        {esqueleto ? (
          <div className="overflow-x-auto"><SkeletonHeatmap /></div>
        ) : clicks.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: '#9ca3af' }}>Nenhum clique no período</div>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 620 }}>
              <div className="flex gap-1 mb-1 pl-9">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="flex-1 text-center text-[9px]" style={{ color: '#9ca3af' }}>
                    {h % 3 === 0 ? h : ''}
                  </div>
                ))}
              </div>
              {heat.grade.map((linha, dia) => (
                <div key={dia} className="flex items-center gap-1 mb-1">
                  <div className="w-8 text-[10px] font-bold flex-shrink-0" style={{ color: '#6b7280' }}>{DIAS_SEMANA[dia]}</div>
                  {linha.map((n, h) => (
                    <div
                      key={h}
                      className="flex-1 rounded"
                      style={{
                        height: 22,
                        background: n === 0 ? 'rgba(39,202,163,0.05)' : `rgba(39,202,163,${0.15 + (n / heat.max) * 0.85})`,
                        transition: TRANSICAO_COR,
                      }}
                      title={`${DIAS_SEMANA[dia]} ${String(h).padStart(2, '0')}h — ${n} clique${n === 1 ? '' : 's'}`}
                    />
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>menos</span>
                {[0.15, 0.35, 0.55, 0.75, 1].map(o => (
                  <div key={o} className="w-5 h-3 rounded" style={{ background: `rgba(39,202,163,${o})` }} />
                ))}
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>mais ({heat.max})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="rounded-2xl p-5" style={PANEL}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: '#27CAA3' }} />
            <h2 className="font-bold" style={{ color: '#111827' }}>Histórico de Cliques</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}>
              {agrupados.length.toLocaleString('pt-BR')}{temFiltro && ` de ${clicks.length.toLocaleString('pt-BR')}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <RefreshDot active={refreshing} />
              {lastUpdated && <p className="text-xs" style={{ color: '#9ca3af' }}>atualizado {timeAgo(lastUpdated.toISOString())}</p>}
            </div>
            <button onClick={exportar} disabled={agrupados.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40"
              style={{ border: '1.5px solid rgba(39,202,163,0.25)', color: '#27CAA3' }}
              title="Exporta o que está filtrado, em CSV para Excel">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button onClick={refetch} className="p-1.5 rounded-lg" style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#27CAA3' }} title="Atualizar agora">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          <select value={fBotao} onChange={e => { setFBotao(e.target.value); setHistoryPage(1) }}
            className="text-xs rounded-lg px-3 py-2 outline-none" style={selectStyle}>
            <option value="">Todos os botões</option>
            {porBotao.map(b => <option key={b.key} value={b.key}>{b.button}</option>)}
          </select>
          <select value={fOrigem} onChange={e => { setFOrigem(e.target.value); setHistoryPage(1) }}
            className="text-xs rounded-lg px-3 py-2 outline-none" style={selectStyle}>
            <option value="">Todas as origens</option>
            {Object.keys(SOURCE_ROTULOS).map(s => <option key={s} value={s}>{SOURCE_ROTULOS[s]}</option>)}
          </select>
          <select value={fPlano} onChange={e => { setFPlano(e.target.value); setHistoryPage(1) }}
            className="text-xs rounded-lg px-3 py-2 outline-none" style={selectStyle}>
            <option value="">Todos os planos</option>
            {planos.map(p => <option key={p.plano} value={p.plano}>{p.plano}</option>)}
          </select>
          <input value={busca} onChange={e => { setBusca(e.target.value); setHistoryPage(1) }}
            placeholder="Buscar rótulo, campanha, página..."
            className="text-xs rounded-lg px-3 py-2 outline-none" style={selectStyle} />
        </div>

        {esqueleto ? (
          <SkeletonRows n={6} height={48} />
        ) : agrupados.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: '#9ca3af' }}>
            {temFiltro ? 'Nenhum clique com esses filtros' : 'Nenhum clique registrado ainda'}
          </div>
        ) : (
          <div className="space-y-5">
            {historicoPorDia.map(({ key, items }) => (
              <div key={key}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>{key}</p>
                <div className="space-y-1.5">
                  {items.map(({ click, vezes }, i) => {
                    const plano = planoDoClique(click)
                    return (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={ITEM}
                        title={`${formatDateTime(click.timestamp)}${click.campaign ? ` · campanha ${click.campaign}` : ''}${click.page ? ` · ${click.page}` : ''}`}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SOURCE_CORES[click.source] ?? '#9ca3af' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>
                            {click.label || rotuloBotao(click.button)}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: '#9ca3af' }}>
                            {rotuloBotao(click.button)}
                            {plano && ` · ${plano}`}
                            {click.campaign && ` · camp. ${click.campaign}`}
                            {click.page && click.page !== '/' && ` · ${click.page}`}
                          </p>
                        </div>
                        {vezes > 1 && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: 'rgba(39,202,163,0.12)', color: '#27CAA3' }}
                            title="Cliques repetidos no mesmo minuto, agrupados">×{vezes}</span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 hidden sm:block"
                          style={{ background: (SOURCE_CORES[click.source] ?? '#9ca3af') + '18', color: SOURCE_CORES[click.source] ?? '#9ca3af' }}>
                          {SOURCE_ROTULOS[click.source] ?? click.source}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0 text-right">
                          <p className="text-xs font-medium" style={{ color: '#27CAA3' }}>
                            {new Date(click.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-xs w-16 text-right hidden sm:block" style={{ color: '#9ca3af' }}>{timeAgo(click.timestamp)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {historyPage * HISTORY_PAGE < agrupados.length && (
              <button onClick={() => setHistoryPage(p => p + 1)}
                className="w-full py-2.5 text-sm font-medium rounded-xl"
                style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#27CAA3', background: 'transparent' }}>
                Ver mais {Math.min(HISTORY_PAGE, agrupados.length - historyPage * HISTORY_PAGE)} registros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
