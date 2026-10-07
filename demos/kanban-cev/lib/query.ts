'use client'

/**
 * O pedaço do TanStack Query que as telas usam, sem a dependência.
 *
 * O original guarda o resultado de cada `/api/...` num cache por chave, e as
 * mutações invalidam por prefixo (`['board']` derruba todos os quadros). Este
 * arquivo reproduz esse contrato — `useQuery`, `useInfiniteQuery`,
 * `useMutation`, `invalidateQueries`, `setQueryData` — para que hooks.ts,
 * kanban.tsx e as demais telas fiquem como no original. A "rede" é o servidor
 * em memória de mock/server.ts.
 *
 * O servidor da página nunca busca nada: no SSR toda consulta nasce
 * "carregando", igual ao primeiro quadro do navegador, e a hidratação bate.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Key = readonly unknown[]
type Status = 'pending' | 'success' | 'error'

interface Entry {
  key: Key
  status: Status
  data: unknown
  error: unknown
  fetching: boolean
  stale: boolean
}

const hashKey = (k: Key) => JSON.stringify(k)

function casaPrefixo(chave: Key, prefixo: Key, exato?: boolean) {
  if (exato) return hashKey(chave) === hashKey(prefixo)
  if (prefixo.length > chave.length) return false
  return prefixo.every((p, i) => hashKey([p]) === hashKey([chave[i]]))
}

export class QueryClient {
  private cache = new Map<string, Entry>()
  private fns = new Map<string, () => Promise<unknown>>()
  private observers = new Map<string, number>()
  private listeners = new Set<() => void>()

  subscribe = (l: () => void) => {
    this.listeners.add(l)
    return () => {
      this.listeners.delete(l)
    }
  }

  private notify() {
    for (const l of [...this.listeners]) l()
  }

  private put(h: string, patch: Partial<Entry> & { key: Key }) {
    const atual = this.cache.get(h)
    this.cache.set(h, {
      status: 'pending',
      data: undefined,
      error: null,
      fetching: false,
      stale: false,
      ...atual,
      ...patch,
    })
    this.notify()
  }

  peek(h: string): Entry | undefined {
    return this.cache.get(h)
  }

  fetch(key: Key, fn?: () => Promise<unknown>) {
    const h = hashKey(key)
    const queryFn = fn ?? this.fns.get(h)
    if (!queryFn) return Promise.resolve(undefined)
    this.put(h, { key, fetching: true })
    return queryFn().then(
      (data) => {
        this.put(h, { key, status: 'success', data, error: null, fetching: false, stale: false })
        return data
      },
      (error) => {
        this.put(h, { key, status: 'error', error, fetching: false, stale: false })
        return undefined
      },
    )
  }

  /** Um observador montado: busca se não há dado, ou se o dado foi invalidado. */
  observe(key: Key, fn: () => Promise<unknown>) {
    const h = hashKey(key)
    this.fns.set(h, fn)
    this.observers.set(h, (this.observers.get(h) ?? 0) + 1)
    const e = this.cache.get(h)
    if (!e || (e.stale && !e.fetching) || (e.status === 'error' && !e.fetching)) void this.fetch(key, fn)
    return () => {
      this.observers.set(h, (this.observers.get(h) ?? 1) - 1)
    }
  }

  getQueryData<T = unknown>(key: Key): T | undefined {
    return this.cache.get(hashKey(key))?.data as T | undefined
  }

  setQueryData<T>(key: Key, updater: T | ((old: T | undefined) => T | undefined)) {
    const h = hashKey(key)
    const old = this.cache.get(h)?.data as T | undefined
    const data =
      typeof updater === 'function' ? (updater as (o: T | undefined) => T | undefined)(old) : updater
    this.put(h, { key, status: 'success', data, error: null, stale: false })
  }

  invalidateQueries({ queryKey = [], exact }: { queryKey?: Key; exact?: boolean } = {}) {
    const refetch: Promise<unknown>[] = []
    for (const [h, e] of this.cache) {
      if (!casaPrefixo(e.key, queryKey, exact)) continue
      this.cache.set(h, { ...e, stale: true })
      if ((this.observers.get(h) ?? 0) > 0) refetch.push(this.fetch(e.key))
    }
    this.notify()
    return Promise.all(refetch).then(() => undefined)
  }

  cancelQueries(_: { queryKey?: Key } = {}) {
    return Promise.resolve()
  }

  clear() {
    this.cache.clear()
    this.notify()
  }
}

/** Um cliente só por aba, como o `useState(() => new QueryClient())` do providers.tsx. */
const client = new QueryClient()

export function useQueryClient() {
  return client
}

export function QueryClientProvider({ children }: { client?: QueryClient; children: React.ReactNode }) {
  return children
}

const nada = () => undefined

function useEntry(key: Key) {
  const h = hashKey(key)
  return useSyncExternalStore(
    client.subscribe,
    () => client.peek(h),
    nada,
  )
}

interface QueryOptions<T> {
  queryKey: Key
  queryFn: (ctx: { queryKey: Key }) => Promise<T>
  enabled?: boolean
  /** Aceito e ignorado: sem rede, não há o que consultar de novo. */
  refetchInterval?: number | false | ((query: { state: { status: Status } }) => number | false)
  [outra: string]: unknown
}

export function useQuery<T>(opts: QueryOptions<T>) {
  const { queryKey, enabled = true } = opts
  const h = hashKey(queryKey)
  const fnRef = useRef(opts.queryFn)
  fnRef.current = opts.queryFn
  const entry = useEntry(queryKey)

  useEffect(() => {
    if (!enabled) return
    return client.observe(queryKey, () => fnRef.current({ queryKey }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h, enabled])

  const temDado = entry?.status === 'success'
  const isPending = !temDado && entry?.status !== 'error'
  return {
    data: (temDado || entry?.data !== undefined ? entry?.data : undefined) as T | undefined,
    error: (entry?.status === 'error' ? entry.error : null) as Error | null,
    status: (entry?.status ?? 'pending') as Status,
    isPending,
    isLoading: enabled && isPending,
    isFetching: !!entry?.fetching,
    isError: entry?.status === 'error',
    isSuccess: temDado,
    refetch: () => client.fetch(queryKey, () => fnRef.current({ queryKey })),
  }
}

interface InfiniteOptions<P, T> {
  queryKey: Key
  queryFn: (ctx: { queryKey: Key; pageParam: P }) => Promise<T>
  initialPageParam: P
  getNextPageParam: (ultima: T) => P | undefined
  enabled?: boolean
  [outra: string]: unknown
}

export function useInfiniteQuery<P, T>(opts: InfiniteOptions<P, T>) {
  const { queryKey, initialPageParam, enabled = true } = opts
  const optsRef = useRef(opts)
  optsRef.current = opts
  const [maisEmVoo, setMaisEmVoo] = useState(false)

  const q = useQuery<{ pages: T[]; pageParams: P[] }>({
    queryKey,
    enabled,
    queryFn: async () => {
      const p = await optsRef.current.queryFn({ queryKey, pageParam: initialPageParam })
      return { pages: [p], pageParams: [initialPageParam] }
    },
  })

  const ultima = q.data?.pages[q.data.pages.length - 1]
  const proximo = ultima !== undefined ? opts.getNextPageParam(ultima) : undefined

  const fetchNextPage = useCallback(async () => {
    const atual = client.getQueryData<{ pages: T[]; pageParams: P[] }>(queryKey)
    if (!atual) return
    const fim = atual.pages[atual.pages.length - 1]!
    const param = optsRef.current.getNextPageParam(fim)
    if (param === undefined) return
    setMaisEmVoo(true)
    try {
      const pagina = await optsRef.current.queryFn({ queryKey, pageParam: param })
      client.setQueryData(queryKey, {
        pages: [...atual.pages, pagina],
        pageParams: [...atual.pageParams, param],
      })
    } finally {
      setMaisEmVoo(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashKey(queryKey)])

  return {
    ...q,
    fetchNextPage,
    hasNextPage: proximo !== undefined,
    isFetchingNextPage: maisEmVoo,
  }
}

interface MutationOptions<TData, TVars> {
  mutationFn: (v: TVars) => Promise<TData>
  onMutate?: (v: TVars) => unknown
  onSuccess?: (data: TData, v: TVars, ctx: unknown) => unknown
  onError?: (e: unknown, v: TVars, ctx: unknown) => unknown
  onSettled?: (data: TData | undefined, e: unknown, v: TVars, ctx: unknown) => unknown
}

interface CallOptions<TData, TVars> {
  onSuccess?: (data: TData, v: TVars, ctx: unknown) => unknown
  onError?: (e: Error, v: TVars, ctx: unknown) => unknown
  onSettled?: (data: TData | undefined, e: unknown, v: TVars, ctx: unknown) => unknown
}

export function useMutation<TData = unknown, TVars = void>(opts: MutationOptions<TData, TVars>) {
  const optsRef = useRef(opts)
  optsRef.current = opts
  const [state, setState] = useState<{
    isPending: boolean
    error: Error | null
    data: TData | undefined
    variables: TVars | undefined
  }>({ isPending: false, error: null, data: undefined, variables: undefined })

  const mutateAsync = useCallback(async (vars: TVars, call?: CallOptions<TData, TVars>) => {
    const o = optsRef.current
    setState({ isPending: true, error: null, data: undefined, variables: vars })
    let ctx: unknown
    try {
      ctx = await o.onMutate?.(vars)
      const data = await o.mutationFn(vars)
      await o.onSuccess?.(data, vars, ctx)
      await call?.onSuccess?.(data, vars, ctx)
      await o.onSettled?.(data, null, vars, ctx)
      await call?.onSettled?.(data, null, vars, ctx)
      setState({ isPending: false, error: null, data, variables: vars })
      return data
    } catch (e) {
      const err = e as Error
      await o.onError?.(err, vars, ctx)
      await call?.onError?.(err, vars, ctx)
      await o.onSettled?.(undefined, err, vars, ctx)
      await call?.onSettled?.(undefined, err, vars, ctx)
      setState({ isPending: false, error: err, data: undefined, variables: vars })
      throw err
    }
  }, [])

  const mutate = useCallback(
    (vars: TVars, call?: CallOptions<TData, TVars>) => {
      mutateAsync(vars, call).catch(() => {})
    },
    [mutateAsync],
  )

  const reset = useCallback(
    () => setState({ isPending: false, error: null, data: undefined, variables: undefined }),
    [],
  )

  return {
    mutate,
    mutateAsync,
    reset,
    isPending: state.isPending,
    isError: !!state.error,
    isSuccess: !state.isPending && !state.error && state.data !== undefined,
    error: state.error,
    data: state.data,
    variables: state.variables,
  }
}
