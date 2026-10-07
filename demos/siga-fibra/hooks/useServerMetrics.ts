import { useState, useEffect, useCallback } from 'react'
import { getServerMetrics, getProcesses } from '../services/api'
import type { ServerMetrics, Process } from '../types'

export function useServerMetrics(intervalMs = 5000) {
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null)
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setRefreshing(true)
    try {
      const [m, p] = await Promise.all([getServerMetrics(), getProcesses()])
      setMetrics(m)
      setProcesses(p)
      setError(null)
    } catch {
      setError('Não foi possível conectar ao servidor')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, intervalMs)
    return () => clearInterval(interval)
  }, [fetch, intervalMs])

  return { metrics, processes, loading, refreshing, error, refetch: fetch }
}
