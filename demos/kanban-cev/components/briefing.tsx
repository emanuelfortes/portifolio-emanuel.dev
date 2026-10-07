'use client'

import { useState } from 'react'
import { Pencil, Check, X, Plus, Trash2, MessageSquareQuote } from 'lucide-react'
import { PERGUNTAS_PADRAO } from '@/demos/kanban-cev/shared'
import { useSaveClientSection } from '@/demos/kanban-cev/lib/hooks'
import { Spinner, inputClass } from '@/demos/kanban-cev/components/ui'

/**
 * Um item do briefing. Dois tipos, e a diferença é ter resposta ou não.
 *
 *   pergunta   o que se PERGUNTA ao cliente. Tem campo de resposta e entra
 *              na contagem de "3 de 15 respondidas".
 *   texto      anotação, contexto, lembrete — "levar o termo de imagem",
 *              "confirmar o endereço na véspera". Não tem resposta, e por
 *              isso NÃO entra na contagem: um lembrete que aparece como
 *              pendente faz o briefing parecer eternamente incompleto.
 *
 * `tipo` ausente significa pergunta. É o que faz os briefings já preenchidos
 * continuarem funcionando sem migração de dado.
 */
export type TipoItem = 'pergunta' | 'texto'

export interface Pergunta {
  id: string
  secao: string
  texto: string
  nota?: string
  tipo?: TipoItem
}

export function ehPergunta(item: Pergunta): boolean {
  return (item.tipo ?? 'pergunta') === 'pergunta'
}

/** O mesmo botão nos dois tipos de item — só muda o rótulo. */
function BotaoRemover({ onClick, pendente }: { onClick: () => void; pendente: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={pendente}
      title="Remover"
      className="shrink-0 rounded p-1 text-ink-400 opacity-0 transition hover:bg-red-500/12 hover:text-red-300 focus:opacity-100 group-hover:opacity-100"
    >
      <Trash2 className="size-3.5" />
    </button>
  )
}

/**
 * O briefing de um cliente: as perguntas dele e as respostas dele.
 *
 * `perguntas` AUSENTE significa "cliente novo, ainda não mexeram" — aí valem
 * as de fábrica. Um array VAZIO é diferente: significa que alguém apagou
 * todas, de propósito. Sem essa distinção, apagar a última pergunta faria as
 * quinze padrão voltarem na próxima visita.
 */
export function perguntasDoCliente(briefing: any): Pergunta[] {
  const guardadas = briefing?.content?.perguntas
  return guardadas === undefined ? [...PERGUNTAS_PADRAO] : guardadas
}

export function respostasDoCliente(briefing: any): Record<string, string> {
  return briefing?.content?.respostas ?? {}
}

/**
 * O briefing já foi começado? Cliente sem perfil nenhum ainda não escolheu se
 * quer as perguntas de fábrica ou uma folha em branco — e essa escolha é a
 * primeira coisa que a tela pergunta.
 */
export function briefingIniciado(briefing: any): boolean {
  return briefing?.content?.perguntas !== undefined
}

/**
 * Briefing encerrado é o que troca a tela de perguntas pela de conteúdo.
 *
 * Encerrar NÃO exige ter respondido: dá para fechar com tudo em branco e
 * preencher os blocos direto. A entrevista é um caminho, não um pedágio.
 */
export function briefingFinalizado(briefing: any): boolean {
  return briefing?.content?.finalizado === true
}

/**
 * Quantas perguntas do cliente já têm resposta.
 *
 * Só PERGUNTAS entram na conta. Anotação não se responde, e incluí-la faria
 * "12 de 15" num briefing que na prática está completo.
 */
export function progressoBriefing(briefing: any) {
  const perguntas = perguntasDoCliente(briefing).filter(ehPergunta)
  const respostas = respostasDoCliente(briefing)
  const respondidas = perguntas.filter((p) => respostas[p.id]?.trim()).length
  return { respondidas, total: perguntas.length }
}

/**
 * As perguntas de UM bloco, na página daquele bloco.
 *
 * O bloco é a seção: pergunta de tom de voz aparece na página de Tom de voz.
 * Quem conduz o briefing percorre as seções pelo anterior/próxima e responde
 * ali mesmo, ao lado do conteúdo que a resposta vai virar.
 */
export function BriefingSecao({
  clientId,
  secao,
  briefing,
  podeEditar,
}: {
  clientId: string
  secao: string
  briefing: any
  podeEditar: boolean
}) {
  return (
    <section className="mt-5 rounded-xl border border-ink-200 bg-surface p-5">
      <div className="mb-4 flex items-start gap-2">
        <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-ink-400" />
        <div>
          <h2 className="text-[15px] font-semibold text-ink-800">Briefing deste bloco</h2>
          <p className="text-[13px] text-ink-500">
            O que perguntar ao cliente para preencher esta seção.
          </p>
        </div>
      </div>

      <PerguntasDoBloco
        clientId={clientId}
        secao={secao}
        briefing={briefing}
        podeEditar={podeEditar}
      />
    </section>
  )
}

/**
 * As perguntas e respostas de um bloco, SEM moldura.
 *
 * Sem chrome próprio porque aparece dentro de dois donos diferentes: o corpo
 * do acordeão na página do cliente e o cartão da página da seção. Quem embrulha
 * é quem chama.
 */
export function PerguntasDoBloco({
  clientId,
  secao,
  briefing,
  podeEditar,
}: {
  clientId: string
  secao: string
  briefing: any
  podeEditar: boolean
}) {
  const salvar = useSaveClientSection(clientId)

  const todasPerguntas = perguntasDoCliente(briefing)
  const respostas = respostasDoCliente(briefing)
  const minhas = todasPerguntas.filter((p) => p.secao === secao)

  const [editandoRespostas, setEditandoRespostas] = useState(false)
  const [rascunho, setRascunho] = useState<Record<string, string>>({})
  const [criando, setCriando] = useState(false)
  const [nova, setNova] = useState({ texto: '', nota: '' })
  /** O que está sendo criado: uma pergunta ou uma anotação sem resposta. */
  const [tipoNovo, setTipoNovo] = useState<TipoItem>('pergunta')

  /**
   * Toda gravação manda o briefing INTEIRO — perguntas e respostas, de todas
   * as seções. A API substitui `content` de uma vez, então enviar só este
   * bloco apagaria os outros onze, e o estrago só apareceria dias depois.
   */
  function gravar(perguntas: Pergunta[], novasRespostas: Record<string, string>) {
    return salvar.mutateAsync({
      sectionType: 'briefing',
      title: 'Briefing ACEV',
      /**
       * `finalizado` é copiado do que já estava, não recalculado.
       *
       * A API troca `content` inteiro. Omitir esta chave ao gravar uma
       * resposta apagaria o encerramento do briefing, e o cliente voltaria
       * sozinho para a tela de perguntas na próxima visita.
       */
      content: {
        perguntas,
        respostas: novasRespostas,
        finalizado: briefingFinalizado(briefing),
      },
    })
  }

  async function salvarRespostas() {
    await gravar(todasPerguntas, { ...respostas, ...rascunho })
    setEditandoRespostas(false)
  }

  async function adicionar() {
    const texto = nova.texto.trim()
    if (!texto) return
    /**
     * Id com sufixo aleatório, nunca um contador.
     *
     * A resposta é guardada por id. Um contador reaproveitaria o número de uma
     * pergunta apagada, e a resposta antiga reapareceria sob a pergunta nova.
     */
    const item: Pergunta = {
      id: `p-${secao}-${crypto.randomUUID().slice(0, 8)}`,
      secao,
      texto,
      // Anotação não tem nota de apoio: ela JÁ é a observação.
      ...(tipoNovo === 'pergunta' && nova.nota.trim() ? { nota: nova.nota.trim() } : {}),
      ...(tipoNovo === 'texto' ? { tipo: 'texto' as const } : {}),
    }
    await gravar([...todasPerguntas, item], respostas)
    setNova({ texto: '', nota: '' })
    setCriando(false)
  }

  async function remover(id: string) {
    // A resposta fica no jsonb, órfã: se a pergunta voltar por engano, o que
    // o cliente disse ainda está lá. Custa alguns bytes.
    await gravar(
      todasPerguntas.filter((p) => p.id !== id),
      respostas,
    )
  }

  // Só o que é pergunta conta: anotação não se responde.
  const perguntasDoBloco = minhas.filter(ehPergunta)
  const respondidas = perguntasDoBloco.filter((p) => respostas[p.id]?.trim()).length

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-500">
          {perguntasDoBloco.length > 0
            ? `${respondidas} de ${perguntasDoBloco.length} respondidas`
            : 'Nenhuma pergunta neste bloco'}
        </p>

        {podeEditar && !editandoRespostas && perguntasDoBloco.length > 0 && (
          <button
            onClick={() => {
              setRascunho(Object.fromEntries(perguntasDoBloco.map((p) => [p.id, respostas[p.id] ?? ''])))
              setEditandoRespostas(true)
            }}
            title="Responder"
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <Pencil className="size-4" />
          </button>
        )}

        {editandoRespostas && (
          <div className="flex shrink-0 gap-1">
            <button
              onClick={salvarRespostas}
              disabled={salvar.isPending}
              title="Salvar respostas"
              className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-500/12 disabled:opacity-50"
            >
              {salvar.isPending ? <Spinner /> : <Check className="size-4" />}
            </button>
            <button
              onClick={() => setEditandoRespostas(false)}
              title="Cancelar"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/*
        * `ol` não numera mais: a numeração agora é calculada só entre as
        * perguntas. Com anotações no meio, o contador automático pularia — a
        * anotação levaria um número e a pergunta seguinte saltaria de 2 para 4.
        */}
      <ol className="list-none space-y-3.5">
        {minhas.map((p) => {
          const pergunta = ehPergunta(p)
          // A posição da pergunta entre as PERGUNTAS, ignorando as anotações.
          const numero = pergunta ? perguntasDoBloco.findIndex((x) => x.id === p.id) + 1 : null

          return (
            <li key={p.id} className="group">
              {pergunta ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-medium text-ink-700">
                      {numero}. {p.texto}
                    </p>
                    {podeEditar && !editandoRespostas && (
                      <BotaoRemover onClick={() => remover(p.id)} pendente={salvar.isPending} />
                    )}
                  </div>

                  {p.nota && <p className="mt-0.5 text-[13px] italic text-ink-500">{p.nota}</p>}

                  {editandoRespostas ? (
                    <textarea
                      rows={3}
                      className="mt-1.5 w-full rounded border border-ink-200 bg-surface px-2 py-1.5 text-[15px]"
                      placeholder="Resposta do cliente"
                      value={rascunho[p.id] ?? ''}
                      onChange={(e) => setRascunho({ ...rascunho, [p.id]: e.target.value })}
                    />
                  ) : respostas[p.id]?.trim() ? (
                    // A resposta é transcrição de fala: as quebras de linha de
                    // quem anotou fazem parte do sentido.
                    <p className="mt-1 whitespace-pre-wrap text-[15px] text-ink-700">
                      {respostas[p.id]}
                    </p>
                  ) : (
                    <p className="mt-1 text-[14px] text-ink-400">Sem resposta.</p>
                  )}
                </>
              ) : (
                /*
                 * Anotação: sem número, sem campo de resposta, sem "sem
                 * resposta". Visualmente destacada do fluxo de perguntas para
                 * não ser lida como uma que alguém esqueceu de responder.
                 */
                <div className="flex items-start justify-between gap-2 rounded-lg border-l-2 border-brand-600/50 bg-overlay/5 py-2 pl-3 pr-2">
                  <p className="whitespace-pre-wrap text-[15px] text-ink-700">{p.texto}</p>
                  {podeEditar && !editandoRespostas && (
                    <BotaoRemover onClick={() => remover(p.id)} pendente={salvar.isPending} />
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {podeEditar && !editandoRespostas && (
        <div className="mt-4 border-t border-ink-100 pt-3">
          {criando ? (
            <div className="space-y-2">
              {/* A escolha vem ANTES do campo: ela muda o que o campo é. */}
              <div className="inline-flex rounded-lg bg-overlay/5 p-0.5 ring-1 ring-inset ring-overlay/10">
                {(
                  [
                    ['pergunta', 'Pergunta'],
                    ['texto', 'Anotação'],
                  ] as const
                ).map(([valor, rotulo]) => (
                  <button
                    key={valor}
                    onClick={() => setTipoNovo(valor)}
                    className={
                      tipoNovo === valor
                        ? 'rounded-md bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-900 shadow-sm'
                        : 'rounded-md px-3 py-1.5 text-[13px] text-ink-500 transition hover:text-ink-800'
                    }
                  >
                    {rotulo}
                  </button>
                ))}
              </div>

              {tipoNovo === 'texto' ? (
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-ink-200 bg-surface px-3 py-2 text-[15px]"
                  autoFocus
                  placeholder="Anotação, contexto ou lembrete — ex: levar o termo de imagem assinado"
                  value={nova.texto}
                  onChange={(e) => setNova({ ...nova, texto: e.target.value })}
                />
              ) : (
                <>
                  <input
                    className={inputClass}
                    autoFocus
                    placeholder="A pergunta que você quer fazer ao cliente"
                    value={nova.texto}
                    onChange={(e) => setNova({ ...nova, texto: e.target.value })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Nota para quem conduz (opcional)"
                    value={nova.nota}
                    onChange={(e) => setNova({ ...nova, nota: e.target.value })}
                  />
                </>
              )}
              <div className="flex gap-1">
                <button
                  onClick={adicionar}
                  disabled={salvar.isPending || !nova.texto.trim()}
                  className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-500/12 disabled:opacity-40"
                  title="Adicionar"
                >
                  {salvar.isPending ? <Spinner /> : <Check className="size-4" />}
                </button>
                <button
                  onClick={() => {
                    setNova({ texto: '', nota: '' })
                    setCriando(false)
                  }}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100"
                  title="Cancelar"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCriando(true)}
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-500 transition hover:text-brand-700"
            >
              <Plus className="size-3.5" />
              Adicionar pergunta ou anotação
            </button>
          )}
        </div>
      )}
    </div>
  )
}
