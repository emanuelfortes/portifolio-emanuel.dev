import { useState, useEffect, useCallback } from 'react'
import { getCampanha } from '../services/api'
import type { TrafficQuery } from '../services/api'
import { useSite } from '../context/SiteContext'
import type { CampanhaData } from '../types'

/**
 * Dados da campanha do mes.
 *
 * Segue o mesmo contrato do useTrafficData: loading so ate existir dado na
 * tela, e reloading separa a troca feita pelo usuario da atualizacao
 * automatica, para o painel nao piscar sozinho a cada 30s.
 */
export function useCampanha(input: Omit<TrafficQuery, 'site'>, refreshInterval = 0) {
  const { site } = useSite()
  const [data, setData] = useState<CampanhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Serializa a consulta para ter uma dependencia estavel
  const queryKey = JSON.stringify(input)

  const fetch = useCallback(async (manual = false) => {
    if (manual) setReloading(true)
    setRefreshing(true)
    try {
      const d = await getCampanha({ ...JSON.parse(queryKey), site })
      setData(d)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Erro ao carregar dados da campanha')
    } finally {
      setLoading(false)
      setRefreshing(false)
      setReloading(false)
    }
  }, [queryKey, site])

  useEffect(() => {
    fetch(true)
    if (refreshInterval > 0) {
      const timer = setInterval(() => fetch(false), refreshInterval)
      return () => clearInterval(timer)
    }
  }, [fetch, refreshInterval])

  return { data, loading, refreshing, reloading, error, lastUpdated, refetch: () => fetch(true) }
}
