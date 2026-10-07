'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import {
  useAddChecklistItem,
  useChecklist,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from '@/demos/kanban-cev/lib/hooks'
import { Spinner } from '@/demos/kanban-cev/components/ui'

/**
 * Checklist da demanda.
 *
 * Existe separado da descrição porque o que se quer aqui é CONTAGEM — 3 de 7 —
 * e isso não se extrai de texto corrido. A barra em cima é o que responde
 * "quanto falta" sem ler item por item.
 *
 * Some inteiro quando não há itens e a pessoa não pode editar: bloco vazio em
 * tela de leitura é ruído. Quem pode editar sempre vê o campo, senão não teria
 * como criar o primeiro.
 */
export function Checklist({ taskId, podeEditar }: { taskId: string; podeEditar: boolean }) {
  const { data: itens, isLoading } = useChecklist(taskId)
  const adicionar = useAddChecklistItem(taskId)
  const atualizar = useUpdateChecklistItem(taskId)
  const remover = useDeleteChecklistItem(taskId)
  const [novo, setNovo] = useState('')
  /** Qual item está aberto para edição. Um por vez. */
  const [editando, setEditando] = useState<string | null>(null)

  /**
   * Grava o texto novo, e só quando ele mudou de verdade.
   *
   * Sem a comparação, clicar num item e clicar fora dispararia um PATCH que
   * grava exatamente o que já estava lá — barulho na rede e uma invalidação de
   * cache que repinta a lista sem motivo.
   *
   * Texto vazio também não passa: apagar tudo e sair do campo apagaria o item
   * por um caminho que não é a lixeira, que é justamente o que esta mudança
   * existe para evitar.
   */
  function gravarTexto(itemId: string, atual: string, novoTexto: string) {
    setEditando(null)
    const limpo = novoTexto.trim()
    if (!limpo || limpo === atual) return
    atualizar.mutate({ itemId, content: limpo })
  }

  if (isLoading) return null
  if (!itens?.length && !podeEditar) return null

  const total = itens?.length ?? 0
  const feitos = itens?.filter((i) => i.isDone).length ?? 0
  const pct = total ? Math.round((feitos / total) * 100) : 0

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const limpo = novo.trim()
    if (!limpo) return
    // Limpa antes da resposta: o campo precisa estar livre para o próximo item,
    // que é o padrão de quem cadastra uma lista inteira de uma vez.
    setNovo('')
    adicionar.mutate({ content: limpo })
  }

  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink-800">
          Checklist{total > 0 && <span className="ml-1.5 text-ink-500">{feitos}/{total}</span>}
        </h2>
        {total > 0 && (
          <span
            className={clsx(
              'text-[12px] font-medium tabular-nums',
              pct === 100 ? 'text-emerald-300' : 'text-ink-500',
            )}
          >
            {pct}%
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-overlay/8">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-300',
              pct === 100 ? 'bg-emerald-400' : 'bg-gold-300',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <ul className="space-y-0.5">
        {itens?.map((item) => (
          <li key={item.id} className="group flex items-start gap-2.5 rounded-lg px-1 py-1.5">
            <input
              type="checkbox"
              checked={item.isDone}
              disabled={!podeEditar || atualizar.isPending}
              onChange={(e) => atualizar.mutate({ itemId: item.id, isDone: e.target.checked })}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-gold-300 disabled:cursor-not-allowed"
            />

            <div className="min-w-0 flex-1">
              {editando === item.id ? (
                /**
                 * Editar no lugar, sem apagar e recriar.
                 *
                 * Recriar joga o item para o fim da lista — e num checklist,
                 * que é sequência de passos, corrigir uma palavra bagunçaria a
                 * ordem do trabalho. Aqui só o texto muda; posição, quem marcou
                 * e quando ficam como estavam.
                 */
                <input
                  autoFocus
                  defaultValue={item.content}
                  onBlur={(e) => gravarTexto(item.id, item.content, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                    // Esc desiste: o `defaultValue` volta sozinho porque o
                    // campo é descartado sem gravar.
                    if (e.key === 'Escape') setEditando(null)
                  }}
                  className="w-full rounded border border-ink-200 bg-surface px-2 py-1 text-[13px] text-ink-900"
                />
              ) : (
                <p
                  onClick={() => podeEditar && setEditando(item.id)}
                  className={clsx(
                    'text-[13px] leading-snug transition',
                    item.isDone ? 'text-ink-500 line-through' : 'text-ink-800',
                    podeEditar && 'cursor-text',
                  )}
                  title={podeEditar ? 'Clique para editar' : undefined}
                >
                  {item.content}
                </p>
              )}
              {/* Quem marcou responde "quem disse que estava feito", que é a
                  pergunta que aparece quando o item volta atrás. */}
              {item.isDone && item.doneBy && (
                <p className="mt-0.5 text-[11px] text-ink-400">por {item.doneBy.name}</p>
              )}
            </div>

            {podeEditar && (
              <button
                type="button"
                onClick={() => remover.mutate(item.id)}
                aria-label={`Remover ${item.content}`}
                /**
                 * SEMPRE visível, e a razão de ter mudado importa.
                 *
                 * Antes ela só aparecia no hover, para não competir com o texto.
                 * O efeito foi pior que o problema: um botão que APAGA ficava
                 * invisível e clicável ao mesmo tempo. Quem clicava perto da
                 * borda direita perdia o item sem entender por quê, e no celular
                 * — onde não existe hover — ela nunca aparecia e continuava
                 * apagando.
                 *
                 * A discrição agora vem da cor, não da ausência: cinza apagado,
                 * vermelho só no hover.
                 */
                className="shrink-0 rounded p-1 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {podeEditar && (
        <form onSubmit={enviar} className="mt-2 flex gap-1.5">
          <input
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            placeholder="Adicionar item…"
            maxLength={300}
            className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-pine-900/60 px-2.5 py-1.5 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!novo.trim() || adicionar.isPending}
            className="shrink-0 rounded-lg bg-brand-600 px-2.5 py-1.5 text-pine-950 transition disabled:opacity-50"
            aria-label="Adicionar item"
          >
            {adicionar.isPending ? <Spinner /> : <Plus className="size-4" />}
          </button>
        </form>
      )}
    </section>
  )
}
