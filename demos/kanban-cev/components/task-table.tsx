'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Clock, Repeat, MessageSquare, Paperclip, ChevronsUpDown, ChevronUp, ChevronDown, Check, Inbox } from 'lucide-react'
import clsx from 'clsx'
import type { TaskListItem } from '@/demos/kanban-cev/shared'
import { useChangeStatus, useStatuses } from '@/demos/kanban-cev/lib/hooks'
import { formatDeadline, PRIORITY_STYLE } from '@/demos/kanban-cev/lib/format'
import { Avatar, Badge, Spinner } from '@/demos/kanban-cev/components/ui'
import { LabelChip } from '@/demos/kanban-cev/components/labels'

/**
 * Tabela de demandas, usada na Home e na visão de lista do painel "Eu".
 *
 * Existe como componente próprio porque as duas telas mostram a mesma coisa
 * com recortes diferentes: a Home quer a fila do dia em oito colunas, o painel
 * "Eu" quer tudo, ordenável. Duplicar a marcação faria a segunda divergir da
 * primeira no primeiro ajuste de coluna.
 */

export type ColunaTarefa =
  | 'prazo'
  | 'status'
  | 'etiquetas'
  | 'titulo'
  | 'tipo'
  | 'cliente'
  | 'responsavel'
  | 'criador'
  | 'prioridade'
  | 'atividade'

export const COLUNAS_PADRAO: ColunaTarefa[] = [
  'prazo',
  'status',
  'titulo',
  'tipo',
  'cliente',
  'responsavel',
  'prioridade',
]

/** O painel "Eu" mostra tudo: é a tela de quem quer comparar demanda a demanda. */
export const COLUNAS_COMPLETAS: ColunaTarefa[] = [
  'prazo',
  'status',
  'etiquetas',
  'titulo',
  'tipo',
  'cliente',
  'responsavel',
  'criador',
  'prioridade',
  'atividade',
]

const PRIORIDADE_PESO: Record<string, number> = { urgente: 0, alta: 1, media: 2, baixa: 3 }

interface Definicao {
  rotulo: string
  alinhar?: 'right'
  /** Chave de ordenação. Sem ela, a coluna não é clicável para ordenar. */
  valor?: (t: TaskListItem) => string | number
  /**
   * A partir de que largura a coluna aparece. Vazio = sempre.
   *
   * Num telefone cabem três colunas, não dez. Rolar a tabela de lado para
   * descobrir o NOME da demanda é pedir à pessoa que procure justamente o que
   * ela veio ver — então prazo, status e demanda ficam, e o resto entra
   * conforme a tela dá espaço.
   *
   * Status fica entre as fixas de propósito: é por ele que se marca a demanda
   * como concluída, e escondê-lo tiraria a ação mais frequente do dia de quem
   * trabalha pelo celular.
   */
  desde?: string
}

const DEFINICOES: Record<ColunaTarefa, Definicao> = {
  prazo: { rotulo: 'Prazo', valor: (t) => t.deadline },
  status: { rotulo: 'Status', valor: (t) => t.status },
  // Sem `valor`: lista de etiquetas não tem ordem natural, então a coluna não
  // fica clicável para ordenar.
  etiquetas: { rotulo: 'Etiquetas', desde: 'hidden xl:table-cell' },
  titulo: { rotulo: 'Demanda', valor: (t) => t.title.toLowerCase() },
  tipo: { rotulo: 'Tipo', valor: (t) => t.taskType?.displayName ?? '', desde: 'hidden xl:table-cell' },
  cliente: { rotulo: 'Cliente', valor: (t) => t.client?.name ?? '￿', desde: 'hidden lg:table-cell' },
  /**
   * Sem dono ordena por ÚLTIMO, não por primeiro.
   *
   * O `￿` é o truque: é o maior caractere da tabela, então qualquer nome
   * vem antes dele. Ordenar por responsável serve para agrupar o trabalho de
   * cada pessoa, e a fila não é de ninguém — ela fica no fim, junta.
   */
  responsavel: {
    rotulo: 'Responsável',
    valor: (t) => t.assignee?.name ?? '￿',
    desde: 'hidden lg:table-cell',
  },
  criador: { rotulo: 'Criada por', valor: (t) => t.createdBy.name, desde: 'hidden xl:table-cell' },
  prioridade: {
    rotulo: 'Prioridade',
    valor: (t) => PRIORIDADE_PESO[t.priority] ?? 9,
    desde: 'hidden md:table-cell',
  },
  atividade: {
    rotulo: 'Atividade',
    alinhar: 'right',
    valor: (t) => t.commentCount + t.attachmentCount,
    desde: 'hidden xl:table-cell',
  },
}

export function TaskTable({
  tasks,
  colunas = COLUNAS_PADRAO,
  ordenavel = false,
  manterOrdem = false,
  carregando,
  vazio,
  onAbrir,
}: {
  tasks: TaskListItem[]
  colunas?: ColunaTarefa[]
  ordenavel?: boolean
  /**
   * Sem coluna escolhida, mantém a ordem em que a lista veio, em vez de
   * atrasada-primeiro-e-depois-prazo. A tela Buscar traz as mais recentes
   * primeiro; reordenar por prazo jogaria a recém-criada, de prazo longe,
   * para o fim da página, que é onde ninguém a procura.
   */
  manterOrdem?: boolean
  carregando?: boolean
  vazio?: React.ReactNode
  onAbrir: (id: string) => void
}) {
  const { data: statuses } = useStatuses()
  const [ordem, setOrdem] = useState<{ coluna: ColunaTarefa; desc: boolean } | null>(null)

  const statusPorSlug = useMemo(
    () => new Map((statuses ?? []).map((s: any) => [s.slug, s])),
    [statuses],
  )

  const linhas = useMemo(() => {
    const lista = [...tasks]

    /**
     * Sem ordenação escolhida, atrasada vem primeiro e depois o prazo mais
     * apertado. É a ordem em que se decide o que fazer agora — não faz sentido
     * abrir a tela em ordem alfabética.
     */
    if (!ordem) {
      if (manterOrdem) return lista
      return lista.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
        return a.deadline.localeCompare(b.deadline)
      })
    }

    const valor = DEFINICOES[ordem.coluna].valor
    if (!valor) return lista

    return lista.sort((a, b) => {
      const va = valor(a)
      const vb = valor(b)
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb), 'pt-BR')
      return ordem.desc ? -cmp : cmp
    })
  }, [tasks, ordem, manterOrdem])

  function alternar(coluna: ColunaTarefa) {
    if (!ordenavel || !DEFINICOES[coluna].valor) return
    setOrdem((atual) => {
      if (!atual || atual.coluna !== coluna) return { coluna, desc: false }
      // Terceiro clique volta para a ordem natural: sem isso não há como
      // desfazer a ordenação depois de aplicá-la.
      return atual.desc ? null : { coluna, desc: true }
    })
  }

  if (carregando) {
    return (
      <div className="rounded-2xl bg-surface/70 p-5 ring-1 ring-inset ring-overlay/8">
        <Spinner className="text-ink-400" />
      </div>
    )
  }

  if (!linhas.length) {
    return (
      <div className="rounded-2xl bg-surface/70 p-5 ring-1 ring-inset ring-overlay/8">
        {vazio ?? (
          <p className="rounded-xl border border-dashed border-overlay/12 px-4 py-8 text-center text-[13px] text-ink-500">
            Nenhuma demanda por aqui.
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      {/*
        * No celular, CARTÕES. Uma tabela de sete colunas não cabe em 390px,
        * e a rolagem lateral escondia justamente o nome da demanda. O cartão
        * traz o que se lê de relance: título, quem, prazo, status, tipo.
        */}
      <ul className="space-y-2.5 md:hidden">
        {linhas.map((t) => {
          const st = statusPorSlug.get(t.status)
          return (
            <li
              key={t.id}
              onClick={() => onAbrir(t.id)}
              className="cursor-pointer rounded-2xl bg-surface/70 p-4 ring-1 ring-inset ring-overlay/8 transition active:bg-overlay/5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-[15.5px] leading-snug font-semibold text-ink-900">{t.title}</p>
                {t.assignee ? (
                  <Avatar name={t.assignee.name} url={t.assignee.avatarUrl} size={30} />
                ) : (
                  <span
                    title={t.queue ? `Na fila de ${t.queue.displayName}` : 'Sem responsável'}
                    className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30"
                  >
                    <Inbox className="size-3.5" />
                  </span>
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13.5px]">
                <Celula coluna="prazo" task={t} status={st} />
                <Celula coluna="status" task={t} status={st} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-ink-500">
                <Celula coluna="tipo" task={t} status={st} />
                {t.client && <span className="truncate">{t.client.name}</span>}
              </div>
            </li>
          )
        })}
      </ul>

    {/* A rolagem horizontal continua, mas como rede de segurança — não como o
       jeito normal de ler no telefone. A largura mínima só entra no `xl`,
       onde todas as colunas aparecem; abaixo disso a tabela cabe porque as
       colunas menos importantes ficaram escondidas. */}
    <div className="thin-scroll hidden overflow-x-auto rounded-2xl bg-surface/70 ring-1 ring-inset ring-overlay/8 md:block">
      <table className="w-full min-w-0 border-collapse text-left xl:min-w-[980px]">
        <thead>
          <tr className="border-b border-overlay/8 text-[11px] tracking-wide text-ink-400 uppercase">
            {colunas.map((c) => {
              const def = DEFINICOES[c]
              const podeOrdenar = ordenavel && !!def.valor
              const ativa = ordem?.coluna === c

              return (
                <th
                  key={c}
                  onClick={() => alternar(c)}
                  aria-sort={ativa ? (ordem!.desc ? 'descending' : 'ascending') : undefined}
                  className={clsx(
                    'px-3 py-3 font-medium whitespace-nowrap sm:px-4',
                    def.desde,
                    def.alinhar === 'right' && 'text-right',
                    podeOrdenar && 'cursor-pointer select-none transition hover:text-ink-700',
                    ativa && 'text-gold-300',
                  )}
                >
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1',
                      def.alinhar === 'right' && 'flex-row-reverse',
                    )}
                  >
                    {def.rotulo}
                    {podeOrdenar &&
                      (ativa ? (
                        ordem!.desc ? (
                          <ChevronDown className="size-3" />
                        ) : (
                          <ChevronUp className="size-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3 opacity-35" />
                      ))}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {linhas.map((t) => (
            <tr
              key={t.id}
              onClick={() => onAbrir(t.id)}
              className="cursor-pointer border-b border-overlay/5 transition last:border-0 hover:bg-overlay/5"
            >
              {colunas.map((c) => (
                <td
                  key={c}
                  className={clsx(
                    'px-3 py-3 align-middle text-[13px] sm:px-4',
                    DEFINICOES[c].desde,
                    DEFINICOES[c].alinhar === 'right' && 'text-right',
                  )}
                >
                  <Celula coluna={c} task={t} status={statusPorSlug.get(t.status)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

/**
 * Etiqueta de status que também troca o status.
 *
 * Na lista, mudar o status exigia abrir a demanda e voltar — duas navegações
 * para a ação mais frequente do dia. A etiqueta já estava ali; torná-la
 * clicável é o gesto óbvio.
 *
 * O menu é `fixed`, e não `absolute`, porque a tabela vive dentro de um
 * `overflow-x-auto`: pela especificação, um eixo não-visível força o outro a
 * `auto`, então um menu absoluto seria recortado na borda de baixo da tabela.
 * Posicionar pela caixa do botão contorna isso sem portal.
 */
function CelulaStatus({ task, status }: { task: TaskListItem; status: any }) {
  const { data: statuses } = useStatuses()
  const mudar = useChangeStatus()
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const botao = useRef<HTMLButtonElement>(null)

  // Fechar ao rolar e ao apertar Esc: um menu `fixed` não acompanha a rolagem,
  // e ficaria pairando longe da linha que o abriu.
  useEffect(() => {
    if (!pos) return
    const fechar = () => setPos(null)
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('resize', fechar)
    window.addEventListener('keydown', tecla)
    return () => {
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('resize', fechar)
      window.removeEventListener('keydown', tecla)
    }
  }, [pos])

  const etiqueta = (
    <>
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ background: status?.color ?? '#94a3b8' }}
      />
      {status?.displayName ?? task.status}
    </>
  )

  if (!task.canChangeStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-ink-600">
        {etiqueta}
      </span>
    )
  }

  return (
    <>
      <button
        ref={botao}
        // Sem parar a propagação, o clique sobe até a linha e abre a demanda —
        // exatamente o que este menu existe para evitar.
        onClick={(e) => {
          e.stopPropagation()
          if (pos) return setPos(null)
          const r = e.currentTarget.getBoundingClientRect()
          // Abre para cima quando não há espaço embaixo, senão o menu nasce
          // fora da tela nas últimas linhas da tabela.
          const altura = 8 + (statuses?.length ?? 5) * 34
          const cabe = window.innerHeight - r.bottom > altura
          setPos({ top: cabe ? r.bottom + 4 : r.top - altura - 4, left: r.left })
        }}
        aria-haspopup="menu"
        aria-expanded={Boolean(pos)}
        title="Mudar status"
        className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 whitespace-nowrap text-ink-600 transition hover:bg-overlay/10 hover:text-ink-900"
      >
        {etiqueta}
        <ChevronDown className="size-3 shrink-0 opacity-50" />
      </button>

      {pos && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation()
              setPos(null)
            }}
          />
          <div
            role="menu"
            style={{ top: pos.top, left: pos.left }}
            className="animate-in fixed z-50 min-w-44 overflow-hidden rounded-xl bg-pine-800 py-1 shadow-2xl ring-1 ring-inset ring-overlay/10"
          >
            {statuses?.map((s: any) => {
              const atual = s.slug === task.status
              return (
                <button
                  key={s.slug}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPos(null)
                    if (!atual) mudar.mutate({ id: task.id, status: s.slug })
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition',
                    atual ? 'text-gold-300' : 'text-ink-700 hover:bg-overlay/8 hover:text-ink-900',
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="flex-1">{s.displayName}</span>
                  {atual && <Check className="size-3.5 shrink-0" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

function Celula({
  coluna,
  task: t,
  status,
}: {
  coluna: ColunaTarefa
  task: TaskListItem
  status: any
}) {
  switch (coluna) {
    case 'prazo':
      return t.isOverdue ? (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-red-300">
          <AlertTriangle className="size-3.5 shrink-0" />
          {formatDeadline(t.deadline)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-ink-600">
          <Clock className="size-3.5 shrink-0 text-ink-400" />
          {formatDeadline(t.deadline)}
        </span>
      )

    case 'status':
      return <CelulaStatus task={t} status={status} />

    case 'etiquetas':
      // Traço em vez de célula vazia: a coluna alinhada deixa claro que a
      // demanda não tem etiqueta, em vez de parecer dado faltando.
      return t.labels.length ? (
        <span className="flex flex-wrap gap-1">
          {t.labels.map((l) => (
            <LabelChip key={l.id} label={l} />
          ))}
        </span>
      ) : (
        <span className="text-ink-400">—</span>
      )

    case 'titulo':
      return (
        <span className="flex items-center gap-1.5 font-medium text-ink-900">
          {/* Nascida de uma regra: o ícone é o que a distingue da avulsa. */}
          {t.recurrenceId && (
            <Repeat className="size-3 shrink-0 text-gold-300" aria-label="Demanda recorrente" />
          )}
          {t.title}
        </span>
      )

    case 'tipo':
      return (
        <Badge
          dotColor={t.taskType?.color}
          className="bg-overlay/8 whitespace-nowrap text-ink-500 ring-overlay/12"
        >
          {t.taskType?.displayName ?? '—'}
        </Badge>
      )

    case 'cliente':
      return <span className="text-ink-600">{t.client?.name ?? '—'}</span>

    case 'responsavel':
      return t.assignee ? (
        <Pessoa nome={t.assignee.name} avatar={t.assignee.avatarUrl} />
      ) : (
        <span className="inline-flex items-center gap-1.5 text-gold-300">
          <Inbox className="size-3.5 shrink-0" />
          <span className="truncate">
            {t.queue ? `Fila · ${t.queue.displayName}` : 'Sem responsável'}
          </span>
        </span>
      )

    case 'criador':
      return <Pessoa nome={t.createdBy.name} avatar={t.createdBy.avatarUrl} />

    case 'prioridade': {
      const p = PRIORITY_STYLE[t.priority] ?? PRIORITY_STYLE.media!
      return <Badge className={clsx('whitespace-nowrap', p.className)}>{p.label}</Badge>
    }

    case 'atividade':
      return (
        <span className="inline-flex items-center justify-end gap-2.5 text-ink-500">
          {t.commentCount > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <MessageSquare className="size-3.5" />
              {t.commentCount}
            </span>
          )}
          {t.attachmentCount > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Paperclip className="size-3.5" />
              {t.attachmentCount}
            </span>
          )}
          {!t.commentCount && !t.attachmentCount && <span className="text-ink-400">—</span>}
        </span>
      )
  }
}

function Pessoa({ nome, avatar }: { nome: string; avatar: string | null }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <Avatar name={nome} url={avatar} size={22} />
      <span className="text-ink-600">{nome.split(' ')[0]}</span>
    </span>
  )
}
