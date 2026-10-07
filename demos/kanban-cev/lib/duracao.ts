/** Formatação de tempo decorrido, para o cronômetro da externa e as listas. */

/** `HH:MM:SS` de um intervalo em milissegundos. Nunca negativo. */
export function formatarCronometro(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const dois = (n: number) => String(n).padStart(2, '0')
  return `${dois(h)}:${dois(m)}:${dois(r)}`
}

/** "2h15", "45min", "3h": de minutos, para listas e totais. */
export function duracaoCurta(minutos: number): string {
  const m = Math.max(0, Math.round(minutos))
  const h = Math.floor(m / 60)
  const r = m % 60
  if (!h) return `${r}min`
  return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`
}
