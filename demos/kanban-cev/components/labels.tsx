'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Plus, Tag, Trash2, X } from 'lucide-react'
import clsx from 'clsx'
import type { LabelRef } from '@/demos/kanban-cev/shared'
import { useCreateLabel, useDeleteLabel, useLabels } from '@/demos/kanban-cev/lib/hooks'
import { Spinner } from '@/demos/kanban-cev/components/ui'

/**
 * Paleta fechada, e não um seletor de cor livre.
 *
 * Cada tom foi medido contra o texto que recebe: todos passam de 4.5:1, que é
 * o mínimo do WCAG AA para texto pequeno — o chip tem 11px. Os valores óbvios
 * de cada cor reprovavam por pouco (âmbar 3.19, verde 3.77), e "quase legível"
 * é pior que ilegível, porque só incomoda quem já está cansado.
 *
 * O ouro é o único claro, e recebe texto escuro; os outros sete levam branco.
 */
const PALETA = [
  '#d4af4a', // ouro da marca (leva texto escuro)
  '#b45309', // âmbar
  '#dc2626', // vermelho
  '#db2777', // rosa
  '#9333ea', // roxo
  '#2563eb', // azul
  '#047857', // verde
  '#64748b', // cinza
]

/**
 * Decide entre texto branco e texto escuro para uma cor de fundo.
 *
 * A paleta acima já garante branco legível, mas etiquetas criadas antes desta
 * mudança podem ter cor clara gravada no banco. Sem esta checagem, elas
 * ficariam branco sobre amarelo — ilegíveis, e sem forma de a pessoa perceber
 * que a culpa é da cor escolhida meses atrás.
 *
 * A fórmula é o brilho percebido do YIQ: o olho enxerga verde muito mais que
 * azul, e uma média simples dos canais trataria #0000ff como claro.
 */
function textoLegivel(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return '#ffffff'
  const n = parseInt(m[1]!, 16)
  const brilho = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000
  return brilho > 150 ? '#191919' : '#ffffff'
}

/** Etiqueta desenhada. Usada no card, na tabela e no detalhe. */
export function LabelChip({ label, onRemove }: { label: LabelRef; onRemove?: () => void }) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: label.color, color: textoLegivel(label.color) }}
    >
      <span className="truncate">{label.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={`Remover ${label.name}`}
          className="shrink-0 opacity-70 transition hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

/**
 * Seletor de etiquetas.
 *
 * Controlado por `value`/`onChange` de propósito: no modal de criação a
 * demanda ainda não existe e a escolha viaja no corpo do POST; no detalhe ela
 * vira uma chamada de gravação. Um componente que gravasse sozinho não serviria
 * ao primeiro caso.
 */
export function LabelPicker({
  value,
  onChange,
  disabled,
}: {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}) {
  const { data: labels, isLoading } = useLabels()
  const criar = useCreateLabel()
  const apagar = useDeleteLabel()
  /** Qual etiqueta está esperando confirmação para sumir. */
  const [confirmando, setConfirmando] = useState<string | null>(null)
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState(PALETA[0]!)
  const [erro, setErro] = useState<string | null>(null)
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false)
    }
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  const selecionadas = (labels ?? []).filter((l) => value.includes(l.id))

  function alternar(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  async function criarEtiqueta() {
    setErro(null)
    const limpo = nome.trim()
    if (!limpo) return

    try {
      const nova = await criar.mutateAsync({ name: limpo, color: cor })
      // Já aplica a recém-criada: quem digitou o nome quer usá-la agora, e
      // obrigar um segundo clique na lista seria trabalho à toa.
      onChange([...value, nova.id])
      setNome('')
    } catch (err: any) {
      setErro(err?.message ?? 'Não foi possível criar a etiqueta')
    }
  }

  return (
    <div className="relative" ref={caixa}>
      <div className="flex flex-wrap items-center gap-1.5">
        {selecionadas.map((l) => (
          <LabelChip key={l.id} label={l} onRemove={disabled ? undefined : () => alternar(l.id)} />
        ))}

        {!disabled && (
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-ink-500 ring-1 ring-inset ring-overlay/12 transition hover:bg-overlay/8 hover:text-ink-900"
          >
            {selecionadas.length ? <Plus className="size-3" /> : <Tag className="size-3" />}
            {selecionadas.length ? 'Etiqueta' : 'Adicionar etiqueta'}
          </button>
        )}
      </div>

      {aberto && (
        <div className="animate-in absolute z-50 mt-2 w-64 overflow-hidden rounded-xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
          <div className="thin-scroll max-h-56 overflow-y-auto py-1">
            {isLoading && (
              <div className="flex justify-center py-4">
                <Spinner className="text-ink-400" />
              </div>
            )}

            {!isLoading && !labels?.length && (
              <p className="px-3 py-4 text-center text-[12px] text-ink-400">
                Nenhuma etiqueta ainda. Crie a primeira abaixo.
              </p>
            )}

            {labels?.map((l) => {
              const marcada = value.includes(l.id)

              /**
               * A confirmação toma a linha, em vez de abrir outra janela.
               *
               * Apagar uma etiqueta a tira de TODAS as demandas de uma vez, e
               * essa consequência precisa ser dita antes — mas um modal por
               * cima de um menu que já está por cima de um formulário seria
               * três camadas para uma pergunta de sim ou não.
               */
              if (confirmando === l.id) {
                return (
                  <div key={l.id} className="bg-red-500/10 px-3 py-2">
                    <p className="text-[12px] leading-snug text-ink-700">
                      Apagar <span className="font-medium">{l.name}</span>?
                      {l.emUso
                        ? ` Ela sai de ${l.emUso} ${l.emUso === 1 ? 'demanda' : 'demandas'}.`
                        : ' Não está em nenhuma demanda.'}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Tirar da seleção junto: deixar o id de uma etiqueta
                          // que não existe mais faria o salvamento falhar.
                          onChange(value.filter((v) => v !== l.id))
                          apagar.mutate(l.id)
                          setConfirmando(null)
                        }}
                        className="rounded-md bg-red-500/90 px-2.5 py-1 text-[12px] font-medium text-white transition hover:bg-red-500"
                      >
                        Apagar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmando(null)}
                        className="rounded-md px-2.5 py-1 text-[12px] text-ink-600 transition hover:text-ink-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )
              }

              /*
               * Dois botões lado a lado, e não um dentro do outro: botão
               * aninhado é HTML inválido, e o navegador desmancha a árvore de
               * um jeito que faz o clique cair no lugar errado.
               */
              return (
                <div
                  key={l.id}
                  className="group flex w-full items-center transition hover:bg-overlay/8"
                >
                  <button
                    type="button"
                    onClick={() => alternar(l.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
                  >
                    <span
                      className="size-3 shrink-0 rounded"
                      style={{ background: l.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink-800">
                      {l.name}
                    </span>
                    {marcada && <Check className="size-3.5 shrink-0 text-gold-300" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmando(l.id)}
                    aria-label={`Apagar a etiqueta ${l.name}`}
                    title="Apagar etiqueta"
                    className="shrink-0 rounded p-2 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )
            })}
          </div>

          {/**
           * `div`, e NÃO `form`.
           *
           * Este seletor é usado dentro do formulário de nova demanda, e
           * formulário aninhado é HTML inválido: o botão de enviar acaba
           * associado ao de fora. Na prática, clicar no "+" para criar uma
           * etiqueta tentava criar a DEMANDA.
           *
           * Sem `form`, o Enter no campo não envia nada sozinho — daí o
           * `onKeyDown` abaixo, que também impede o Enter de vazar para o
           * formulário de fora.
           */}
          <div className="border-t border-overlay/8 p-2.5">
            <div className="mb-2 flex gap-1">
              {PALETA.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  aria-label={`Cor ${c}`}
                  className={clsx(
                    'size-5 rounded transition',
                    cor === c && 'ring-2 ring-overlay/70 ring-offset-1 ring-offset-pine-800',
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>

            <div className="flex gap-1.5">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  // `preventDefault` é o que impede o Enter de submeter o
                  // formulário de nova demanda, que envolve este seletor.
                  e.preventDefault()
                  e.stopPropagation()
                  void criarEtiqueta()
                }}
                placeholder="Nova etiqueta"
                maxLength={40}
                className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-pine-900/60 px-2 py-1.5 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  void criarEtiqueta()
                }}
                disabled={!nome.trim() || criar.isPending}
                aria-label="Criar etiqueta"
                className="shrink-0 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[13px] font-medium text-pine-950 transition disabled:opacity-50"
              >
                {criar.isPending ? <Spinner /> : <Plus className="size-4" />}
              </button>
            </div>

            {erro && <p className="mt-1.5 text-[11px] text-red-300">{erro}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
