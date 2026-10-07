import { useState, useEffect, useCallback } from 'react'
import { getTrafficSources, getButtonClicks, getDailyAccess, getUTMData } from '../services/api'
import type { TrafficQuery } from '../services/api'
import { useSite } from '../context/SiteContext'
import type { TrafficSource, ButtonClick, DailyAccess, UTMData } from '../types'

/** Numero = "ultimos N dias"; objeto = intervalo e granularidade explicitos */
export type TrafficInput = number | Omit<TrafficQuery, 'site'>

export function useTrafficData(input: TrafficInput = 30, refreshInterval = 0) {
  const { site } = useSite()
  const [sources, setSources] = useState<TrafficSource[]>([])
  const [clicks, setClicks] = useState<ButtonClick[]>([])
  const [daily, setDaily] = useState<DailyAccess[]>([])
  const [utm, setUtm] = useState<UTMData[]>([])
  // loading só vale até existir dado na tela. Depois disso a atualização é
  // silenciosa: trocar para "Carregando..." a cada 30s apagava o conteúdo
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  // reloading separa troca feita pelo usuário (site, período, granularidade)
  // da atualização automática. Só a primeira embaça a tela: quando a pessoa
  // clica ela espera resposta da interface; quando o painel se atualiza
  // sozinho, interromper é só ruído
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Serializa a consulta para ter uma dependencia estavel: um objeto literal
  // recriado a cada render dispararia o efeito para sempre
  const queryKey = JSON.stringify(typeof input === 'number' ? { days: input } : input)

  const fetch = useCallback(async (manual = false) => {
    if (manual) setReloading(true)
    setRefreshing(true)
    const query: TrafficQuery = { ...JSON.parse(queryKey), site }
    try {
      const [s, c, d, u] = await Promise.all([
        getTrafficSources(query),
        getButtonClicks(query),
        getDailyAccess(query),
        getUTMData(query),
      ])
      setSources(s)
      setClicks(c)
      setDaily(d)
      setUtm(u)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Erro ao carregar dados de tráfego')
    } finally {
      setLoading(false)
      setRefreshing(false)
      setReloading(false)
    }
  }, [queryKey, site])

  useEffect(() => {
    // O efeito só roda de novo quando a consulta muda, ou seja, quando o
    // usuário trocou algo -> manual. O intervalo é sempre silencioso.
    fetch(true)
    if (refreshInterval > 0) {
      const timer = setInterval(() => fetch(false), refreshInterval)
      return () => clearInterval(timer)
    }
  }, [fetch, refreshInterval])

  return {
    sources, clicks, daily, utm,
    loading, refreshing, reloading, error, lastUpdated,
    refetch: () => fetch(true),
  }
}

/**
 * Busca so o necessario para as variacoes do periodo de comparacao.
 * Agrupa por mes de proposito: o total nao muda com a granularidade, e assim a
 * resposta fica pequena mesmo comparando um ano inteiro.
 */
export function useTrafficCompare(range: { from: string; to: string } | null, withClicks = false) {
  const { site } = useSite()
  const [sources, setSources] = useState<TrafficSource[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [clicks, setClicks] = useState<ButtonClick[] | null>(null)

  const key = range ? `${range.from}|${range.to}|${site}|${withClicks}` : ''

  useEffect(() => {
    if (!key) {
      setSources(null)
      setTotal(null)
      setClicks(null)
      return
    }
    const [from, to] = key.split('|')
    let cancelled = false

    ;(async () => {
      try {
        const [s, d, c] = await Promise.all([
          getTrafficSources({ from, to, site }),
          getDailyAccess({ from, to, granularity: 'month', site }),
          withClicks ? getButtonClicks({ from, to, site }) : Promise.resolve(null),
        ])
        if (cancelled) return
        setSources(s)
        setTotal(d.reduce((acc, x) => acc + (x.total ?? 0), 0))
        setClicks(c)
      } catch {
        if (!cancelled) {
          setSources(null)
          setTotal(null)
          setClicks(null)
        }
      }
    })()

    return () => { cancelled = true }
  }, [key, site, withClicks])

  return { sources, total, clicks }
}
