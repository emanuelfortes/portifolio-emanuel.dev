'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Tag, X } from 'lucide-react'
import clsx from 'clsx'
import type { LabelRef } from '@/demos/kanban-cev/shared'

/**
 * Campo de etiquetas com sugestão enquanto se digita.
 *
 * Substituiu uma fileira de todas as etiquetas sempre visíveis. Com três
 * etiquetas aquilo funcionava; com trinta vira uma parede que empurra o
 * resultado da busca para baixo da dobra — e é justamente quando há muitas
 * que filtrar passa a importar.
 *
 * Aqui só aparece o que casa com o que se escreveu, e o que já foi escolhido
 * vira ficha dentro do próprio campo.
 */

/** Sem acento e sem caixa: quem procura "cronograma" acha "CRONOGRAMA". */
function chave(v: string): string {
  return v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Devolve o texto partido em três: antes, o trecho que casou, e depois.
 *
 * É o que permite destacar em negrito só a parte digitada. Sem o destaque, uma
 * lista de dez sugestões parecidas obriga a ler cada uma inteira para entender
 * por que ela está ali.
 */
function partir(texto: string, busca: string): [string, string, string] {
  const i = chave(texto).indexOf(chave(busca))
  if (!busca || i < 0) return [texto, '', '']
  return [texto.slice(0, i), texto.slice(i, i + busca.length), texto.slice(i + busca.length)]
}

export function BuscaEtiquetas({
  etiquetas,
  valor,
  onChange,
}: {
  etiquetas: LabelRef[]
  valor: string[]
  onChange: (ids: string[]) => void
}) {
  const [texto, setTexto] = useState('')
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState(0)
  const caixa = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)

  const escolhidas = useMemo(
    () => valor.map((id) => etiquetas.find((l) => l.id === id)).filter(Boolean) as LabelRef[],
    [valor, etiquetas],
  )

  const sugestoes = useMemo(() => {
    const restantes = etiquetas.filter((l) => !valor.includes(l.id))
    if (!texto.trim()) return restantes.slice(0, 8)
    return restantes.filter((l) => chave(l.name).includes(chave(texto))).slice(0, 8)
  }, [etiquetas, valor, texto])

  // O índice ativo não pode sobreviver à lista que o gerou: com a lista menor,
  // ele apontaria para fora e o Enter não escolheria nada.
  useEffect(() => setAtivo(0), [texto])

  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])

  function escolher(l: LabelRef) {
    onChange([...valor, l.id])
    setTexto('')
    // O foco fica: quem acabou de escolher uma costuma escolher a segunda, e
    // devolver o cursor manualmente a cada etiqueta seria trabalho à toa.
    campo.current?.focus()
  }

  function tirar(id: string) {
    onChange(valor.filter((v) => v !== id))
  }

  function aoTeclar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAberto(true)
      setAtivo((i) => Math.min(i + 1, sugestoes.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAtivo((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const l = sugestoes[ativo]
      if (l) escolher(l)
      return
    }
    if (e.key === 'Escape') {
      setAberto(false)
      return
    }
    /**
     * Backspace com o campo vazio tira a última ficha.
     *
     * É o gesto que todo campo de marcadores tem, e sem ele a única saída é
     * mirar o × de uma ficha pequena com o mouse — depois de a pessoa já estar
     * com as mãos no teclado.
     */
    if (e.key === 'Backspace' && !texto && valor.length) {
      onChange(valor.slice(0, -1))
    }
  }

  return (
    <div ref={caixa} className="relative">
      {/*
        * A caixa inteira é clicável e leva ao campo: mirar exatamente o
        * pedacinho de input que sobra entre as fichas seria pedir pontaria.
        */}
      <div
        onClick={() => {
          campo.current?.focus()
          setAberto(true)
        }}
        className="flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-ink-200 bg-pine-900/60 px-2.5 py-1.5 focus-within:border-brand-500"
      >
        <Tag className="size-4 shrink-0 text-ink-400" />

        {escolhidas.map((l) => (
          <span
            key={l.id}
            className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-1 pl-2 text-[12.5px] font-medium text-pine-950"
            style={{ background: l.color }}
          >
            {l.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                tirar(l.id)
              }}
              aria-label={`Tirar ${l.name}`}
              className="rounded-full p-0.5 transition hover:bg-pine-950/20"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <input
          ref={campo}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAberto(true)
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={aoTeclar}
          placeholder={escolhidas.length ? '' : 'Etiquetas — digite para buscar'}
          role="combobox"
          aria-expanded={aberto}
          aria-autocomplete="list"
          className="min-w-24 flex-1 bg-transparent text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {aberto && (
        <div className="animate-in absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl bg-pine-800 py-1 shadow-2xl ring-1 ring-inset ring-overlay/10">
          {sugestoes.length === 0 ? (
            <p className="px-3 py-2.5 text-[12.5px] text-ink-400">
              {texto.trim()
                ? `Nenhuma etiqueta com "${texto.trim()}".`
                : 'Todas as etiquetas já estão no filtro.'}
            </p>
          ) : (
            sugestoes.map((l, i) => {
              const [antes, meio, depois] = partir(l.name, texto.trim())
              return (
                <button
                  key={l.id}
                  type="button"
                  onMouseEnter={() => setAtivo(i)}
                  onClick={() => escolher(l)}
                  className={clsx(
                    'flex w-full items-center gap-2 px-3 py-2 text-left transition',
                    i === ativo && 'bg-overlay/10',
                  )}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: l.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-800">
                    {antes}
                    <span className="font-semibold text-gold-300">{meio}</span>
                    {depois}
                  </span>
                  {/* A contagem responde "vale a pena filtrar por esta?" antes
                      de clicar e descobrir que o resultado é vazio. */}
                  {l.emUso !== undefined && (
                    <span className="shrink-0 text-[11px] text-ink-400 tabular-nums">
                      {l.emUso}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
