'use client'

/**
 * Skeleton loading com shimmer.
 *
 * Cobre só a área onde o dado entra — o número, as barras, a pizza, as linhas
 * da lista. Título, moldura do painel e rótulos continuam visíveis, então a
 * página não muda de forma enquanto carrega.
 *
 * Usado na primeira carga e na troca manual (site, período, granularidade,
 * filtro). A atualização automática de 30s não passa por aqui: ela continua
 * silenciosa, com os números subindo no lugar.
 */

/** Bloco cinza com shimmer. A forma vem do className / style. */
export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`sf-skeleton ${className}`} style={style} />
}

const ALTURAS = [45, 70, 55, 85, 40, 95, 60, 75, 50, 88, 65, 42, 78, 58, 92, 48, 82, 68, 53, 90]

/** Barras de alturas variadas, no lugar de um gráfico de colunas */
export function SkeletonBars({ n = 14, height = 200 }: { n?: number; height?: number }) {
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {Array.from({ length: n }, (_, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${ALTURAS[i % ALTURAS.length]}%` }} />
      ))}
    </div>
  )
}

/** Barras horizontais, no lugar de um gráfico deitado */
export function SkeletonBarsH({ n = 7, height = 240 }: { n?: number; height?: number }) {
  return (
    <div className="flex flex-col justify-between w-full" style={{ height }}>
      {Array.from({ length: n }, (_, i) => (
        <Skeleton key={i} style={{ height: 14, width: `${ALTURAS[i % ALTURAS.length]}%` }} />
      ))}
    </div>
  )
}

/** Círculo no lugar da pizza, com a legenda embaixo */
export function SkeletonPie({ size = 140, height = 200 }: { size?: number; height?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ height }}>
      <Skeleton className="rounded-full" style={{ width: size, height: size }} />
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} style={{ width: 56, height: 10 }} />)}
      </div>
    </div>
  )
}

/** Linhas de lista/tabela */
export function SkeletonRows({ n = 4, height = 56 }: { n?: number; height?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: n }, (_, i) => (
        <Skeleton key={i} className="w-full rounded-xl" style={{ height }} />
      ))}
    </div>
  )
}

/** Grade 7 × 24 do heatmap */
export function SkeletonHeatmap() {
  return (
    <div className="space-y-1" style={{ minWidth: 620 }}>
      {Array.from({ length: 7 }, (_, d) => (
        <div key={d} className="flex items-center gap-1">
          <Skeleton className="w-8 flex-shrink-0" style={{ height: 22 }} />
          {Array.from({ length: 24 }, (_, h) => (
            <Skeleton key={h} className="flex-1" style={{ height: 22 }} />
          ))}
        </div>
      ))}
    </div>
  )
}
