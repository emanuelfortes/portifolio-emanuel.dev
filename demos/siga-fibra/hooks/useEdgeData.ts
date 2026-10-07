import { useState, useEffect, useCallback } from 'react'
import { getEdgeRequests, getEdgeSummary } from '../services/api'
import type { EdgeRequestDay, EdgeSummary } from '../types'

export function useEdgeData(days = 30, refreshInterval = 0) {
  const [daily, setDaily] = useState<EdgeRequestDay[]>([])
  const [summary, setSummary] = useState<EdgeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  // troca de período feita pelo usuário, que embaça a tela; o intervalo não
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetch = useCallback(async (manual = false) => {
    if (manual) setReloading(true)
    setRefreshing(true)
    try {
      const [d, s] = await Promise.all([
        getEdgeRequests(days),
        getEdgeSummary(days),
      ])
      setDaily(d)
      setSummary(s)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Erro ao carregar edge requests')
    } finally {
      setLoading(false)
      setRefreshing(false)
      setReloading(false)
    }
  }, [days])

  useEffect(() => {
    fetch(true)
    if (refreshInterval > 0) {
      const timer = setInterval(() => fetch(false), refreshInterval)
      return () => clearInterval(timer)
    }
  }, [fetch, refreshInterval])

  return { daily, summary, loading, refreshing, reloading, error, lastUpdated, refetch: () => fetch(true) }
}
