'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from '@/demos/kanban-cev/lib/nav'
import { Check, ChevronRight, Download, Paperclip, Play, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import clsx from 'clsx'
import { format } from '@/demos/kanban-cev/lib/date-fns'
import {
  ALLOWED_ATTACHMENT_MIME,
  MAX_ATTACHMENT_BYTES,
  PERMISSIONS,
  TASK_TYPE_CRONOGRAMA,
  type ChecklistItem,
  type TaskDetail,
  type UpdateChecklistItemInput,
  type UserRef,
} from '@/demos/kanban-cev/shared'
import { ApiError, qk } from '@/demos/kanban-cev/lib/api'
import {
  baixarAnexo,
  enviarAnexo,
  useAddChecklistItem,
  useAssignableUsers,
  useAttachments,
  useChecklist,
  useDeleteAttachment,
  useDeleteChecklistItem,
  useMe,
  useNotifications,
  useReviewChecklistItem,
  useTaskTypes,
  useUpdateChecklistItem,
  type Attachment,
} from '@/demos/kanban-cev/lib/hooks'
import { Avatar, Button, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'
import { Markdown } from '@/demos/kanban-cev/components/markdown'
import { MarkdownEditor } from '@/demos/kanban-cev/components/markdown-editor'

/**
 * O cronograma: uma demanda, a equipe inteira, uma peça por item.
 *
 * Substitui o checklist simples quando a demanda é do tipo Cronograma. Cada
 * peça é um cartão-linha: o check, o formato numa pílula na cor dele, o
 * conteúdo, o status, a referência (o link da entrega ou, sem ela, o primeiro
 * link da copy) e a data de publicação. Clicar na linha abre um pop-up com a
 * copy e a entrega; assim a lista fica limpa e o texto longo fica onde vai
 * ser lido.
 *
 * O prazo continua UM só, o da demanda. A data da peça é a de publicação —
 * o calendário do cliente —, não um prazo: nada atrasa por ela, ela só
 * ordena a lista.
 *
 * Quem coordena abre em "Todos". Quem só entrega abre em "Meus": quem edita
 * vídeo vê as peças dela sem o resto poluindo, e um clique mostra tudo.
 *
 * O que cada um pode está resolvido no backend (`can.edit`, `can.contribute`)
 * e a tela só obedece: participante marca e escreve na copy e na entrega das
 * SUAS peças; quem edita a demanda mexe em tudo.
 */

type Filtro = 'todos' | 'meus' | `tipo:${number}` | `pessoa:${string}`

interface Pessoa extends UserRef {
  /** Só quem veio da lista de delegação tem função conhecida; serve à sugestão. */
  roleId?: number
}

interface Tipo {
  id: number
  slug: string
  displayName: string
  color: string
  defaultRoleId: number | null
}


/** Texto legível sobre uma cor de fundo: a mesma fórmula das etiquetas (YIQ). */
function textoSobre(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return '#ffffff'
  const n = parseInt(m[1]!, 16)
  const brilho = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000
  return brilho > 150 ? '#191919' : '#ffffff'
}

/** O primeiro endereço de um texto, ou nada. */
function urlEm(texto: string | null): string | null {
  if (!texto) return null
  return /https?:\/\/[^\s)>\]]+/.exec(texto)?.[0] ?? null
}

/**
 * A referência da peça: o link da entrega, se já existe; senão o primeiro
 * link da copy, que é onde o social media põe a inspiração.
 */
function referenciaDe(item: ChecklistItem): string | null {
  return urlEm(item.delivery) ?? urlEm(item.description)
}

/**
 * A grade das colunas, compartilhada por cabeçalho e linhas.
 *
 * Cabeçalho e cada linha são grades SEPARADAS, então toda coluna precisa de
 * largura fixa, menos a do conteúdo: uma coluna `auto` resolvia diferente em
 * cada uma — zero no cabeçalho, ~90px na linha — e os rótulos escorregavam
 * para a direita, "Status" caindo sobre a referência e "Data" sobre os
 * avatares.
 *
 * Não há coluna de data: o prazo é um só, o do cronograma, e é até ele que a
 * equipe constrói tudo. A data por peça existiu e foi tirada de propósito.
 */
// Só a partir do tablet: no celular a linha vira um cartão (ver LinhaPeca).
const GRADE = 'md:grid md:grid-cols-[3rem_8.5rem_minmax(0,1fr)_9.5rem_11rem_5.5rem] md:items-stretch'

export function Cronograma({ task }: { task: TaskDetail }) {
  const { data: me } = useMe()
  const { data: itens, isLoading } = useChecklist(task.id, { aoVivo: true })
  const { data: tipos } = useTaskTypes()
  const { data: assignable } = useAssignableUsers()
  const adicionar = useAddChecklistItem(task.id)
  const atualizar = useUpdateChecklistItem(task.id)
  const remover = useDeleteChecklistItem(task.id)
  /** Os anexos da demanda inteira; cada peça filtra os seus pelo id. */
  const { data: anexos } = useAttachments(task.id)
  // Na página do cronograma, o aprovado/reprovado chega em 5s, como as peças.
  useNotifications({ aoVivo: true })

  const [filtroEscolhido, setFiltro] = useState<Filtro | null>(null)
  /** A peça aberta no pop-up. O item em si vem da lista, sempre fresco. */
  const [abertaId, setAbertaId] = useState<string | null>(null)
  const [novoAberto, setNovoAberto] = useState(false)

  /**
   * `?peca=<id>` abre a peça ao chegar: é o destino dos avisos de revisão,
   * que apontam para a peça e não para o cronograma inteiro.
   */
  const pecaNaUrl = useSearchParams().get('peca')
  useEffect(() => {
    if (pecaNaUrl && (itens ?? []).some((i) => i.id === pecaNaUrl)) setAbertaId(pecaNaUrl)
  }, [pecaNaUrl, itens])

  /** Avança o ciclo da peça; nada acontece quando o passo é de quem coordena. */
  function ciclar(item: ChecklistItem) {
    const passo = proximoPasso(item)
    if (passo) atualizar.mutate({ itemId: item.id, ...passo })
  }

  /** Na ordem de cadastro, que é a ordem do cronograma. */
  const lista = useMemo(() => [...(itens ?? [])].sort((a, b) => a.position - b.position), [itens])
  const meuId = me?.id

  /** Quem pode receber uma peça: a equipe da demanda mais quem posso delegar. */
  const equipe = useMemo<Pessoa[]>(() => {
    const mapa = new Map<string, Pessoa>()
    const por = (u: Pessoa | null | undefined) => {
      if (!u) return
      const atual = mapa.get(u.id)
      if (!atual) mapa.set(u.id, u)
      else if (u.roleId && !atual.roleId) atual.roleId = u.roleId
    }
    por(task.assignee)
    for (const p of task.participants) por(p)
    for (const u of assignable ?? []) {
      por({ id: u.id, name: u.name, avatarUrl: u.avatarUrl, roleDisplayName: u.roleDisplayName, roleId: u.roleId })
    }
    return [...mapa.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [task.assignee, task.participants, assignable])

  /** Formatos de peça: qualquer tipo menos o próprio cronograma. */
  const tiposDePeca = useMemo<Tipo[]>(
    () => ((tipos ?? []) as Tipo[]).filter((t) => t.slug !== TASK_TYPE_CRONOGRAMA),
    [tipos],
  )

  const temMeus = lista.some((i) => i.assignee?.id === meuId)
  const filtro: Filtro = filtroEscolhido ?? (task.can.edit || !temMeus ? 'todos' : 'meus')

  const visiveis = lista.filter((i) => {
    if (filtro === 'todos') return true
    if (filtro === 'meus') return i.assignee?.id === meuId
    if (filtro.startsWith('tipo:')) return i.taskType?.id === Number(filtro.slice(5))
    if (filtro.startsWith('pessoa:')) return (i.assignee?.id ?? 'ninguem') === filtro.slice(7)
    return true
  })

  /** O progresso de cada pessoa, que é o que o cronograma existe para mostrar. */
  const porPessoa = useMemo(() => {
    const mapa = new Map<string, { pessoa: UserRef | null; feitos: number; total: number }>()
    for (const i of lista) {
      const chave = i.assignee?.id ?? 'ninguem'
      const atual = mapa.get(chave) ?? { pessoa: i.assignee, feitos: 0, total: 0 }
      atual.total++
      if (i.isDone) atual.feitos++
      mapa.set(chave, atual)
    }
    return [...mapa.entries()].sort(([, a], [, b]) =>
      (a.pessoa?.name ?? '￿').localeCompare(b.pessoa?.name ?? '￿'),
    )
  }, [lista])

  const tiposPresentes = useMemo(() => {
    const mapa = new Map<number, NonNullable<ChecklistItem['taskType']>>()
    for (const i of lista) if (i.taskType) mapa.set(i.taskType.id, i.taskType)
    return [...mapa.values()].sort((a, b) => a.displayName.localeCompare(b.displayName))
  }, [lista])

  const total = lista.length
  const feitos = lista.filter((i) => i.isDone).length
  const emRevisao = lista.filter((i) => i.reviewStatus === 'em_revisao').length
  const paraAjustar = lista.filter((i) => i.reviewStatus === 'reprovada').length
  const pct = total ? Math.round((feitos / total) * 100) : 0
  const aberta = abertaId ? lista.find((i) => i.id === abertaId) : undefined
  const anexosPorPeca = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const a of anexos ?? []) {
      if (a.checklistItemId) mapa.set(a.checklistItemId, (mapa.get(a.checklistItemId) ?? 0) + 1)
    }
    return mapa
  }, [anexos])
  /** Remover anexo alheio é de quem tem `task:edit_any`, a regra da API. */
  const podeRemoverQualquer = !!me?.permissions?.includes(PERMISSIONS.TASK_EDIT_ANY)

  if (isLoading) return null

  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-[13px] font-semibold text-ink-800">
            Cronograma
            {total > 0 && (
              <span className="ml-1.5 text-ink-500">
                {feitos}/{total}
              </span>
            )}
          </h2>
          {emRevisao > 0 && (
            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11.5px] font-medium text-indigo-200">
              {emRevisao} em revisão
            </span>
          )}
          {paraAjustar > 0 && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11.5px] font-medium text-red-200">
              {paraAjustar} para ajustar
            </span>
          )}
          {/* Quem coordena, já que o card de pessoas não aparece no cronograma. */}
          {task.assignee && (
            <span className="flex items-center gap-1.5 text-[12px] text-ink-500">
              <Avatar name={task.assignee.name} url={task.assignee.avatarUrl} size={16} />
              coordena {task.assignee.name.split(' ')[0]}
            </span>
          )}
        </div>
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

      {/* A equipe, com o quanto cada um já entregou. Clicar filtra. */}
      {porPessoa.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {porPessoa.map(([chave, { pessoa, feitos: f, total: t }]) => (
            <Chip
              key={chave}
              ativo={filtro === `pessoa:${chave}`}
              onClick={() => setFiltro(filtro === `pessoa:${chave}` ? 'todos' : `pessoa:${chave}`)}
            >
              {pessoa ? (
                <Avatar name={pessoa.name} url={pessoa.avatarUrl} size={18} />
              ) : (
                <span className="size-[18px] rounded-full bg-overlay/10" aria-hidden />
              )}
              {pessoa ? pessoa.name.split(' ')[0] : 'Sem dono'}
              <span className={clsx('tabular-nums', f === t ? 'text-emerald-300' : 'text-ink-400')}>
                {f}/{t}
              </span>
            </Chip>
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5 border-t border-ink-100 pt-3">
          <Chip ativo={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Todos
          </Chip>
          {temMeus && (
            <Chip ativo={filtro === 'meus'} onClick={() => setFiltro('meus')}>
              Meus
            </Chip>
          )}
          {tiposPresentes.map((t) => (
            <Chip key={t.id} ativo={filtro === `tipo:${t.id}`} onClick={() => setFiltro(`tipo:${t.id}`)}>
              <span className="size-1.5 rounded-full" style={{ background: t.color }} aria-hidden />
              {t.displayName}
            </Chip>
          ))}
        </div>
      )}

      {visiveis.length === 0 ? (
        <p className="py-3 text-center text-[13px] text-ink-400">
          {total === 0 ? 'Nenhuma peça ainda.' : 'Nada neste filtro.'}
        </p>
      ) : (
        /* Rolagem horizontal só como rede de segurança no telefone: no
           desktop as sete colunas cabem na coluna do detalhe. */
        <div className="thin-scroll -mx-1 overflow-x-auto px-1">
          <div className="md:min-w-[760px]">
            <div className={clsx(GRADE, 'mb-2 hidden text-[15px] font-medium text-ink-400')}>
              <span aria-hidden />
              <span className="px-4 text-center">Formato</span>
              <span className="px-4">Conteúdo</span>
              <span className="px-4 text-center">Status</span>
              <span className="px-4">Referência</span>
              <span aria-hidden />
            </div>
            <ul className="space-y-2">
              {visiveis.map((item) => (
                <LinhaPeca
                  key={item.id}
                  item={item}
                  podeMarcar={task.can.contribute}
                  podeEditar={task.can.edit}
                  anexos={anexosPorPeca.get(item.id) ?? 0}
                  prazo={task.deadline}
                  onCiclar={() => ciclar(item)}
                  pendente={atualizar.isPending}
                  onAbrir={() => setAbertaId(item.id)}
                  onMarcar={(isDone) => atualizar.mutate({ itemId: item.id, isDone })}
                  onRemover={() => remover.mutate(item.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {task.can.edit &&
        (novoAberto ? (
          <FormNovaPeca
            equipe={equipe}
            tipos={tiposDePeca}
            pendente={adicionar.isPending}
            onCancelar={() => setNovoAberto(false)}
            onCriar={(dados) => adicionar.mutate(dados)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setNovoAberto(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-700 hover:underline"
          >
            <Plus className="size-3.5" />
            Adicionar peça
          </button>
        ))}

      {aberta && (
        <PecaModal
          item={aberta}
          task={task}
          meuId={meuId}
          equipe={equipe}
          tipos={tiposDePeca}
          atualizar={atualizar}
          anexos={(anexos ?? []).filter((a) => a.checklistItemId === aberta.id)}
          podeRemoverQualquer={podeRemoverQualquer}
          onClose={() => setAbertaId(null)}
        />
      )}
    </section>
  )
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 text-[12px] font-medium ring-1 ring-inset transition',
        ativo
          ? 'bg-brand-600/15 text-brand-700 ring-brand-600/40'
          : 'bg-overlay/5 text-ink-600 ring-overlay/10 hover:text-ink-900',
      )}
    >
      {children}
    </button>
  )
}

/** A pílula cheia, na cor que vier: formato na cor do tipo, status em verde ou vermelho. */
function Pilula({ cor, children }: { cor: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-block max-w-full truncate rounded-full px-3 py-1.5 text-[13.5px] leading-snug font-semibold md:py-1 md:text-[12.5px]"
      style={{ background: cor, color: textoSobre(cor) }}
    >
      {children}
    </span>
  )
}

interface Situacao {
  rotulo: string
  cor: string
  atrasada: boolean
  dica: string
}

/**
 * A situação da peça, derivada do que ela guarda, nunca gravada:
 *
 *   concluída       is_done
 *   em andamento    started_at — alguém começou; amarela, está em produção
 *   pendente        ninguém começou e o prazo passou; vermelha
 *   não iniciada    o resto; cinza
 *
 * O prazo é o da peça quando ela tem data de publicação; senão o do
 * cronograma. Em andamento depois do prazo continua amarela, com borda
 * vermelha: quem olha precisa ver que está em produção E atrasada.
 */
function situacaoDe(item: ChecklistItem, prazoDaDemanda: string): Situacao {
  if (item.isDone) {
    return { rotulo: 'Concluído', cor: '#10b981', atrasada: false, dica: 'Clique para reabrir' }
  }
  const atrasada = new Date(prazoDaDemanda).getTime() < Date.now()
  // A revisão vem antes do resto: quem fez já marcou, falta quem coordena.
  if (item.reviewStatus === 'em_revisao') {
    return { rotulo: 'Em revisão', cor: '#6366f1', atrasada, dica: 'Aguardando quem coordena revisar. Abra a peça' }
  }
  if (item.reviewStatus === 'reprovada') {
    return { rotulo: 'Ajustar', cor: '#e11d48', atrasada, dica: 'Não passou na revisão. Ajuste e clique para reenviar' }
  }
  if (item.startedAt) {
    return {
      rotulo: 'Em andamento',
      cor: '#f59e0b',
      atrasada,
      dica: atrasada ? 'Passou do prazo. Clique para concluir' : 'Clique para concluir',
    }
  }
  if (atrasada) {
    return { rotulo: 'Pendente', cor: '#ef4444', atrasada: true, dica: 'Passou do prazo sem começar. Clique para iniciar' }
  }
  return { rotulo: 'Não iniciado', cor: '#94a3b8', atrasada: false, dica: 'Clique para iniciar' }
}

/**
 * O próximo passo do ciclo: não iniciado → em andamento → concluído (ou em
 * revisão, para quem só contribui) → não iniciado. Nulo quando não há passo
 * pelo clique: em revisão se resolve no pop-up, por quem coordena.
 */
function proximoPasso(item: ChecklistItem): UpdateChecklistItemInput | null {
  if (item.isDone) return { isDone: false, started: false }
  if (item.reviewStatus === 'em_revisao') return null
  if (item.reviewStatus === 'reprovada') return { isDone: true }
  if (item.startedAt) return { isDone: true }
  return { started: true }
}

/**
 * A pílula de situação. Para quem contribui é um botão que avança o ciclo;
 * para quem só olha, uma etiqueta. Para o clique: o check à esquerda conclui
 * direto, para quem não quer passar pelo "em andamento".
 */
function PilulaStatus({
  item,
  prazo,
  podeMarcar,
  pendente,
  onCiclar,
}: {
  item: ChecklistItem
  prazo: string
  podeMarcar: boolean
  pendente: boolean
  onCiclar: () => void
}) {
  const s = situacaoDe(item, prazo)
  const classe = clsx(
    'inline-block max-w-full truncate rounded-full px-3 py-1.5 text-[13.5px] leading-snug font-semibold md:py-1 md:text-[12.5px]',
    s.atrasada && item.startedAt && 'ring-2 ring-red-500/70',
  )
  const estilo = { background: s.cor, color: textoSobre(s.cor) }
  if (!podeMarcar || !proximoPasso(item)) {
    return (
      <span className={classe} style={estilo} title={s.atrasada ? 'Passou do prazo' : undefined}>
        {s.rotulo}
      </span>
    )
  }
  return (
    <button
      type="button"
      disabled={pendente}
      onClick={(e) => {
        e.stopPropagation()
        onCiclar()
      }}
      title={s.dica}
      className={clsx(classe, 'cursor-pointer transition hover:brightness-110 disabled:cursor-wait')}
      style={estilo}
    >
      {s.rotulo}
    </button>
  )
}

/**
 * Um cartão-linha: check, formato, conteúdo, status, referência, data e a
 * seta que abre. A linha inteira abre o pop-up, menos o check, o link e a
 * lixeira, que param o clique: marcar uma peça ou abrir a referência não
 * pode abrir a copy dela no meio do caminho.
 */
function LinhaPeca({
  item,
  podeMarcar,
  podeEditar,
  anexos,
  prazo,
  pendente,
  onAbrir,
  onMarcar,
  onCiclar,
  onRemover,
}: {
  item: ChecklistItem
  podeMarcar: boolean
  podeEditar: boolean
  /** Quantos anexos a peça tem; zero não desenha nada. */
  anexos: number
  /** O prazo do cronograma: é dele que a peça vira pendente. */
  prazo: string
  pendente: boolean
  onAbrir: () => void
  onMarcar: (isDone: boolean) => void
  /** Avança a situação: não iniciado → em andamento → concluído → não iniciado. */
  onCiclar: () => void
  onRemover: () => void
}) {
  /**
   * No celular a peça é um CARTÃO em duas linhas — check, título e ações em
   * cima; formato, status e referência embaixo — e a partir do tablet volta
   * a ser a linha da grade. A ordem dos elementos muda com `order`, porque a
   * grade quer formato antes do título e o cartão quer o título primeiro.
   */
  const cel = 'flex min-w-0 items-center text-[14px] md:border-l md:border-ink-200 md:px-4 md:py-3 md:text-[13px]'
  const referencia = referenciaDe(item)

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={onAbrir}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onAbrir()
        }
      }}
      className={clsx(
        GRADE,
        'flex flex-wrap items-center gap-x-3 gap-y-2.5 px-3.5 py-3 md:flex-nowrap md:gap-0 md:p-0',
        'cursor-pointer overflow-hidden rounded-xl border border-ink-200 bg-surface/70 transition hover:border-ink-300 hover:bg-overlay/5 focus:outline-none focus-visible:border-brand-500',
      )}
    >
      <div className="order-1 flex items-center justify-center md:order-1">
        <input
          type="checkbox"
          /* Marcada também enquanto espera revisão: quem marcou precisa ver a
             marca ficar, senão parece que o clique não pegou. A cor diz que
             ainda falta a revisão; desmarcar retira da fila. */
          checked={item.isDone || item.reviewStatus === 'em_revisao'}
          disabled={!podeMarcar || pendente}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onMarcar(e.target.checked)}
          aria-label={
            item.isDone || item.reviewStatus === 'em_revisao'
              ? `Desmarcar ${item.content}`
              : `Marcar ${item.content}`
          }
          title={item.reviewStatus === 'em_revisao' && !item.isDone ? 'Marcada, aguardando revisão' : undefined}
          className={clsx(
            'size-6 cursor-pointer rounded-md disabled:cursor-not-allowed md:size-5',
            item.reviewStatus === 'em_revisao' && !item.isDone ? 'accent-indigo-400' : 'accent-gold-300',
          )}
        />
      </div>

      <div className={clsx(cel, 'order-5 md:order-2 md:justify-center')}>
        {item.taskType ? (
          <Pilula cor={item.taskType.color}>{item.taskType.displayName}</Pilula>
        ) : (
          <span className="text-ink-400">—</span>
        )}
      </div>

      <div className={clsx(cel, 'order-2 min-w-0 flex-1 md:order-3')}>
        <span
          className={clsx(
            // No cartão o título quebra em até duas linhas; na grade, uma linha com reticências.
            'line-clamp-2 text-[15px] leading-snug font-medium md:line-clamp-none md:truncate md:text-[13px]',
            item.isDone ? 'text-ink-500 line-through' : 'text-ink-900',
          )}
          title={item.content}
        >
          {item.content}
        </span>
      </div>

      <div className={clsx(cel, 'order-6 md:order-4 md:justify-center')}>
        <PilulaStatus item={item} prazo={prazo} podeMarcar={podeMarcar} pendente={pendente} onCiclar={onCiclar} />
      </div>

      <div className={clsx(cel, 'order-7 max-w-[55%] md:order-5 md:max-w-none')}>
        {referencia ? (
          <a
            href={referencia}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={referencia}
            className="truncate text-brand-700 underline underline-offset-2 hover:text-brand-500"
          >
            {referencia.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-ink-400">—</span>
        )}
      </div>



      {/* Quebra de linha do cartão: o que vem depois vai para a segunda linha. */}
      <span className="order-4 basis-full md:hidden" aria-hidden />

      <div className="order-3 ml-auto flex items-center gap-1 md:order-6 md:ml-0 md:border-l md:border-ink-200 md:px-2">
        {anexos > 0 && (
          <span
            className="mr-1 inline-flex items-center gap-0.5 text-[11px] text-ink-500"
            title={`${anexos} anexo${anexos > 1 ? 's' : ''}`}
          >
            <Paperclip className="size-3.5" />
            {anexos}
          </span>
        )}
        {item.assignee && (
          <span title={item.assignee.name} className="mr-1">
            <Avatar name={item.assignee.name} url={item.assignee.avatarUrl} size={26} />
          </span>
        )}
        <ChevronRight className="size-5 text-ink-400 md:size-4" aria-hidden />
        {podeEditar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemover()
            }}
            aria-label={`Remover ${item.content}`}
            className="rounded p-2 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300 md:p-1"
          >
            <Trash2 className="size-4 md:size-3.5" />
          </button>
        )}
      </div>
    </li>
  )
}

/**
 * O pop-up da peça: a copy do que vai ser o post e a entrega de quem fez.
 *
 * Quem edita a demanda muda título, formato, quem faz e data aqui mesmo.
 * Quem só contribui vê tudo e escreve na copy e na entrega das próprias
 * peças. O check também está aqui, para quem lê a copy e termina o trabalho
 * não precisar voltar à lista para marcar.
 */
function PecaModal({
  item,
  task,
  meuId,
  equipe,
  tipos,
  atualizar,
  anexos,
  podeRemoverQualquer,
  onClose,
}: {
  item: ChecklistItem
  task: TaskDetail
  meuId: string | undefined
  equipe: Pessoa[]
  tipos: Tipo[]
  atualizar: ReturnType<typeof useUpdateChecklistItem>
  anexos: Attachment[]
  podeRemoverQualquer: boolean
  onClose: () => void
}) {
  const [editandoCopy, setEditandoCopy] = useState(false)
  const [rascunho, setRascunho] = useState('')
  const [editandoEntrega, setEditandoEntrega] = useState(false)
  const [rascunhoEntrega, setRascunhoEntrega] = useState('')
  const [reprovando, setReprovando] = useState(false)
  const [motivo, setMotivo] = useState('')
  const revisar = useReviewChecklistItem(task.id)

  const podeEditar = task.can.edit
  function ciclar(i: ChecklistItem) {
    const passo = proximoPasso(i)
    if (passo) atualizar.mutate({ itemId: i.id, ...passo })
  }
  const podeMarcar = task.can.contribute
  const minha = item.assignee?.id === meuId
  /** Quem edita a demanda escreve em qualquer copy; quem contribui, só na sua. */
  const podeEscrever = podeEditar || (podeMarcar && minha)

  // Esc fecha, como nos outros modais.
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onClose])

  function salvarCopy() {
    setEditandoCopy(false)
    const limpo = rascunho.trim()
    if (limpo === (item.description ?? '')) return
    atualizar.mutate({ itemId: item.id, description: limpo || null })
  }

  function salvarEntrega() {
    setEditandoEntrega(false)
    const limpo = rascunhoEntrega.trim()
    if (limpo === (item.delivery ?? '')) return
    atualizar.mutate({ itemId: item.id, delivery: limpo || null })
  }

  function salvarTitulo(novo: string) {
    const limpo = novo.trim()
    if (!limpo || limpo === item.content) return
    atualizar.mutate({ itemId: item.id, content: limpo })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.content}
        onClick={(e) => e.stopPropagation()}
        className="animate-in mt-8 w-full max-w-2xl rounded-2xl bg-surface shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-ink-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            {podeEditar ? (
              // `key` no título: quando a lista volta do servidor com outro
              // texto, o campo precisa nascer de novo com ele.
              <input
                key={item.content}
                defaultValue={item.content}
                onBlur={(e) => salvarTitulo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                maxLength={300}
                aria-label="Nome da peça"
                className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-base font-semibold text-ink-900 transition hover:border-ink-200 focus:border-brand-500 focus:outline-none"
              />
            ) : (
              <h2
                className={clsx(
                  'line-clamp-2 px-1 text-base leading-snug font-semibold break-words',
                  item.isDone ? 'text-ink-500 line-through' : 'text-ink-900',
                )}
              >
                {item.content}
              </h2>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 px-1">
              {item.taskType && <Pilula cor={item.taskType.color}>{item.taskType.displayName}</Pilula>}
              <PilulaStatus
                item={item}
                prazo={task.deadline}
                podeMarcar={podeMarcar}
                pendente={atualizar.isPending}
                onCiclar={() => ciclar(item)}
              />
              {item.assignee && (
                <span className="flex items-center gap-1.5 text-[12.5px] text-ink-600">
                  <Avatar name={item.assignee.name} url={item.assignee.avatarUrl} size={18} />
                  {item.assignee.name}
                </span>
              )}

              {item.isDone && item.doneBy && (
                <span className="text-[12px] text-ink-400">feito por {item.doneBy.name}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label="Fechar"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          {/* O veredito da revisão vem antes de tudo: é o que quem fez precisa
              ler primeiro, e o que quem coordena precisa decidir. */}
          {item.reviewStatus === 'reprovada' && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-[13px]">
              <p className="font-semibold text-red-200">
                Não passou na revisão
                {item.reviewedBy ? ` de ${item.reviewedBy.name}` : ''}
                {item.reviewedAt ? ` em ${format(new Date(item.reviewedAt), 'dd/MM HH:mm')}` : ''}
              </p>
              {item.reviewNote && <p className="mt-1 whitespace-pre-line text-red-100/90">{item.reviewNote}</p>}
              <p className="mt-1 text-[12px] text-red-200/80">Ajuste e marque de novo para voltar à revisão.</p>
            </div>
          )}
          {item.reviewStatus === 'em_revisao' && (
            <div className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-2.5 text-[13px] text-indigo-100">
              Enviada para revisão
              {item.doneBy ? ` por ${item.doneBy.name}` : ''}
              {item.doneAt ? ` em ${format(new Date(item.doneAt), 'dd/MM HH:mm')}` : ''}.{' '}
              {podeEditar ? 'Aprove ou reprove no rodapé.' : 'Aguardando quem coordena.'}
            </div>
          )}
          {reprovando && (
            <div className="space-y-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
              <p className="text-[12.5px] font-semibold text-red-200">O que precisa ajustar? Vai para quem fez a peça.</p>
              <textarea
                autoFocus
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                placeholder="Ex.: a capa está com a fonte errada e o slide 3 sem a referência."
                className={clsx(inputClass, 'min-h-20 text-[13px]')}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setReprovando(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={!motivo.trim() || revisar.isPending}
                  onClick={() =>
                    revisar.mutate(
                      { itemId: item.id, approved: false, note: motivo.trim() },
                      {
                        onSuccess: () => {
                          setReprovando(false)
                          setMotivo('')
                        },
                      },
                    )
                  }
                >
                  {revisar.isPending ? <Spinner /> : null}
                  Confirmar reprovação
                </Button>
              </div>
            </div>
          )}
          {podeEditar && (
            <div className="grid gap-2 sm:grid-cols-3">
              <select
                value={item.taskType?.id ?? ''}
                onChange={(e) =>
                  atualizar.mutate({
                    itemId: item.id,
                    taskTypeId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                aria-label="Formato da peça"
                className={inputClass}
              >
                <option value="">Sem formato</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.displayName}
                  </option>
                ))}
              </select>
              <select
                value={item.assignee?.id ?? ''}
                onChange={(e) =>
                  atualizar.mutate({ itemId: item.id, assigneeId: e.target.value || null })
                }
                aria-label="Quem faz"
                className={inputClass}
              >
                <option value="">Sem dono</option>
                {equipe.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {u.roleDisplayName ? ` · ${u.roleDisplayName}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-[12px] font-semibold tracking-wide text-ink-500 uppercase">Copy</h3>
            {editandoCopy ? (
              <div className="space-y-2">
                <MarkdownEditor
                  value={rascunho}
                  onChange={setRascunho}
                  rows={10}
                  autoFocus
                  placeholder="O que vai ser este post: texto dos slides, legenda, referências, links…"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditandoCopy(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" size="sm" onClick={salvarCopy}>
                    Salvar copy
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {item.description ? (
                  <Markdown className="text-[13.5px]">{item.description}</Markdown>
                ) : (
                  <p className="text-[13px] text-ink-400 italic">Sem copy ainda.</p>
                )}
                {podeEscrever && (
                  <button
                    type="button"
                    onClick={() => {
                      setRascunho(item.description ?? '')
                      setEditandoCopy(true)
                    }}
                    className="mt-2 text-[12.5px] font-medium text-brand-700 hover:underline"
                  >
                    {item.description ? 'Editar copy' : 'Escrever copy'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* A resposta de quem fez: separada da copy para o texto do social
              media ficar intacto. Quem edita vídeo cola o link aqui. */}
          <div>
            <h3 className="mb-2 text-[12px] font-semibold tracking-wide text-ink-500 uppercase">Entrega</h3>
            {editandoEntrega ? (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={rascunhoEntrega}
                  onChange={(e) => setRascunhoEntrega(e.target.value)}
                  rows={3}
                  placeholder="Link do Drive, do post final, ou o que for preciso para conferir…"
                  className={clsx(inputClass, 'min-h-20 text-[13px]')}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditandoEntrega(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" size="sm" onClick={salvarEntrega}>
                    Salvar entrega
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {item.delivery ? (
                  <Markdown className="text-[13.5px]">{item.delivery}</Markdown>
                ) : (
                  <p className="text-[13px] text-ink-400 italic">
                    {podeEscrever ? 'Quando terminar, cole aqui o link do que foi feito.' : 'Ainda sem entrega.'}
                  </p>
                )}
                {podeEscrever && (
                  <button
                    type="button"
                    onClick={() => {
                      setRascunhoEntrega(item.delivery ?? '')
                      setEditandoEntrega(true)
                    }}
                    className="mt-2 text-[12.5px] font-medium text-brand-700 hover:underline"
                  >
                    {item.delivery ? 'Editar entrega' : 'Registrar entrega'}
                  </button>
                )}
              </div>
            )}
          </div>

          <AnexosDaPeca
            task={task}
            item={item}
            anexos={anexos}
            podeAnexar={podeEscrever}
            meuId={meuId}
            podeRemoverQualquer={podeRemoverQualquer}
          />
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-ink-100 px-6 py-4">
          {podeEditar && !item.isDone && (item.reviewStatus === 'em_revisao' || item.reviewStatus === 'reprovada') ? (
            /* A decisão de quem coordena. Reprovar abre a caixa do motivo lá em cima. */
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                disabled={revisar.isPending || reprovando}
                onClick={() => revisar.mutate({ itemId: item.id, approved: true })}
              >
                {revisar.isPending ? <Spinner /> : <Check className="size-4" />}
                Aprovar
              </Button>
              {item.reviewStatus === 'em_revisao' && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={revisar.isPending || reprovando}
                  onClick={() => setReprovando(true)}
                >
                  <X className="size-4" />
                  Reprovar
                </Button>
              )}
            </div>
          ) : podeMarcar ? (
            item.reviewStatus === 'em_revisao' && !item.isDone ? (
              <span className="text-[12.5px] text-indigo-200">Aguardando a revisão de quem coordena</span>
            ) : (
              <Button
                type="button"
                variant={item.isDone ? 'outline' : 'primary'}
                size="sm"
                disabled={atualizar.isPending}
                onClick={() => ciclar(item)}
              >
                {atualizar.isPending ? (
                  <Spinner />
                ) : item.isDone ? (
                  <RotateCcw className="size-4" />
                ) : item.startedAt || item.reviewStatus === 'reprovada' ? (
                  <Check className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
                {item.isDone
                  ? 'Reabrir'
                  : item.reviewStatus === 'reprovada'
                    ? 'Reenviar para revisão'
                    : item.startedAt
                      ? podeEditar
                        ? 'Marcar como feito'
                        : 'Enviar para revisão'
                      : 'Iniciar'}
              </Button>
            )
          ) : (
            <span />
          )}
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </footer>
      </div>
    </div>
  )
}

/**
 * A linha de cadastro. Nome, formato, quem faz, data e, se já existir, a
 * copy; ela também pode entrar depois, pelo pop-up da peça.
 *
 * Depois de criar, só o nome e a copy esvaziam: quem cadastra cinco vídeos
 * seguidos para a mesma pessoa não quer reescolher formato e dono a cada um.
 */
function FormNovaPeca({
  equipe,
  tipos,
  pendente,
  onCancelar,
  onCriar,
}: {
  equipe: Pessoa[]
  tipos: Tipo[]
  pendente: boolean
  onCancelar: () => void
  onCriar: (dados: {
    content: string
    taskTypeId?: number
    assigneeId?: string
    description?: string
  }) => void
}) {
  const [content, setContent] = useState('')
  const [taskTypeId, setTaskTypeId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [description, setDescription] = useState('')

  // O formato já sabe de que função é, e sugere quem faz.
  function aoTrocarTipo(id: string) {
    setTaskTypeId(id)
    if (assigneeId) return
    const tipo = tipos.find((t) => String(t.id) === id)
    const sugerido = tipo?.defaultRoleId ? equipe.find((u) => u.roleId === tipo.defaultRoleId) : undefined
    if (sugerido) setAssigneeId(sugerido.id)
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const limpo = content.trim()
    if (!limpo) return
    onCriar({
      content: limpo,
      taskTypeId: taskTypeId ? Number(taskTypeId) : undefined,
      assigneeId: assigneeId || undefined,
      description: description.trim() || undefined,
    })
    setContent('')
    setDescription('')
  }

  return (
    <form onSubmit={enviar} className="mt-3 space-y-2 rounded-lg border border-ink-200 bg-pine-900/40 p-3">
      <input
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Peça (ex.: POST 3 - Estático sobre prevenção)"
        maxLength={300}
        className={inputClass}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <select value={taskTypeId} onChange={(e) => aoTrocarTipo(e.target.value)} className={inputClass} aria-label="Formato">
          <option value="">Formato</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.displayName}
            </option>
          ))}
        </select>
        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={inputClass} aria-label="Quem faz">
          <option value="">Quem faz</option>
          {equipe.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="Copy do post (opcional): texto dos slides, legenda, referências, links…"
        className={clsx(inputClass, 'min-h-24 text-[13px]')}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancelar}>
          Fechar
        </Button>
        <Button type="submit" size="sm" disabled={!content.trim() || pendente}>
          {pendente ? <Spinner /> : <Plus className="size-4" />}
          Adicionar
        </Button>
      </div>
    </form>
  )
}

function tamanhoLegivel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Os anexos da peça: a arte final de quem faz design, ao lado da entrega.
 *
 * Usa o mesmo mecanismo dos anexos da demanda — URL assinada, envio direto
 * ao S3, confirmação — só que a confirmação leva o id da peça. Quem edita
 * vídeo não passa por aqui: entrega pelo link do Drive, na entrega.
 *
 * Remover é de quem enviou ou de quem tem `task:edit_any`, a regra da API;
 * a tela só esconde a lixeira de quem a API recusaria.
 */
function AnexosDaPeca({
  task,
  item,
  anexos,
  podeAnexar,
  meuId,
  podeRemoverQualquer,
}: {
  task: TaskDetail
  item: ChecklistItem
  anexos: Attachment[]
  podeAnexar: boolean
  meuId: string | undefined
  podeRemoverQualquer: boolean
}) {
  const qc = useQueryClient()
  const remover = useDeleteAttachment(task.id)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const escolhidos = Array.from(e.target.files ?? [])
    e.target.value = '' // permite reescolher o mesmo arquivo depois de um erro
    if (!escolhidos.length) return
    setErro(null)
    const limiteMb = Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)
    const falhas: string[] = []
    setEnviando(true)
    for (const f of escolhidos) {
      if (f.size > MAX_ATTACHMENT_BYTES) {
        falhas.push(`${f.name} (passa de ${limiteMb} MB)`)
        continue
      }
      if (!(ALLOWED_ATTACHMENT_MIME as readonly string[]).includes(f.type)) {
        falhas.push(`${f.name} (tipo não aceito)`)
        continue
      }
      try {
        await enviarAnexo(task.id, f, item.id)
      } catch (err) {
        falhas.push(`${f.name}${err instanceof ApiError ? ` (${err.message})` : ''}`)
      }
    }
    setEnviando(false)
    // Uma invalidação para o lote todo, como no bloco da demanda.
    qc.invalidateQueries({ queryKey: qk.taskAttachments(task.id) })
    if (falhas.length) setErro(`Não entrou: ${falhas.join(', ')}`)
  }

  return (
    <div>
      <h3 className="mb-2 text-[12px] font-semibold tracking-wide text-ink-500 uppercase">
        Anexos{anexos.length > 0 && <span className="ml-1.5 text-ink-400">{anexos.length}</span>}
      </h3>

      {anexos.length === 0 && (
        <p className="text-[13px] text-ink-400 italic">
          {podeAnexar
            ? 'Quem faz design anexa a arte final aqui. Vídeo vai pelo link do Drive, na entrega.'
            : 'Nenhum anexo.'}
        </p>
      )}

      {anexos.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {anexos.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-2.5 rounded-lg border border-ink-200 bg-pine-900/40 p-2"
            >
              {a.previewUrl ? (
                <a href={a.previewUrl} target="_blank" rel="noreferrer" className="shrink-0" title="Abrir a imagem">
                  <img src={a.previewUrl} alt={a.fileName} className="size-12 rounded-md object-cover" />
                </a>
              ) : (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-overlay/8 text-ink-400">
                  <Paperclip className="size-4" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-ink-900" title={a.fileName}>
                  {a.fileName}
                </p>
                <p className="text-[11px] text-ink-400">
                  {tamanhoLegivel(a.fileSize)} · {a.uploadedBy.name.split(' ')[0]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => baixarAnexo(task.id, a.id)}
                aria-label={`Baixar ${a.fileName}`}
                className="rounded p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <Download className="size-4" />
              </button>
              {(a.uploadedBy.id === meuId || podeRemoverQualquer) && (
                <button
                  type="button"
                  onClick={() => remover.mutate(a.id)}
                  disabled={remover.isPending}
                  aria-label={`Remover ${a.fileName}`}
                  className="rounded p-1 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {podeAnexar && (
        <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[12.5px] font-medium text-brand-700 hover:underline">
          {enviando ? <Spinner /> : <Paperclip className="size-3.5" />}
          {enviando ? 'Enviando…' : 'Anexar arquivo'}
          <input
            type="file"
            multiple
            accept={ALLOWED_ATTACHMENT_MIME.join(',')}
            onChange={aoEscolher}
            disabled={enviando}
            className="sr-only"
          />
        </label>
      )}

      {erro && <p className="mt-1 text-[12px] text-red-300">{erro}</p>}
    </div>
  )
}
