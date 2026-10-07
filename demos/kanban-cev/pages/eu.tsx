'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import { Plus, LayoutGrid, List, Inbox, HandMetal, CalendarRange } from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { KanbanBoard } from '@/demos/kanban-cev/components/kanban'
import { NewTaskModal } from '@/demos/kanban-cev/components/new-task-modal'
import { NovoCronogramaModal } from '@/demos/kanban-cev/components/novo-cronograma-modal'
import { PainelChecklists } from '@/demos/kanban-cev/components/painel-checklists'
import { TaskTable, COLUNAS_COMPLETAS } from '@/demos/kanban-cev/components/task-table'
import { Button, Spinner, EmptyState } from '@/demos/kanban-cev/components/ui'
import { useBoard, useClaimTask, useMe, useMetrics, useNotifications, usePreferencia } from '@/demos/kanban-cev/lib/hooks'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import type { TaskListItem } from '@/demos/kanban-cev/shared'
import { qk } from '@/demos/kanban-cev/lib/api'

type Tab = 'me' | 'created_by_me' | 'role_queue'
type View = 'kanban' | 'list'

const VIEWS = ['kanban', 'list'] as const

export default function EuPage() {
  const router = useRouter()
  const { data: me } = useMe()
  const [tab, setTab] = useState<Tab>('me')
  /**
   * Kanban ou lista fica guardado no aparelho, não em `useState`.
   *
   * Quem escolhe lista quer lista: com estado de componente, a escolha se
   * perdia ao abrir uma demanda e voltar, e era preciso reescolher a cada
   * navegação. Agora vale até a pessoa trocar de novo.
   */
  const [view, setView] = usePreferencia<View>('acev:eu:view', 'kanban', VIEWS)
  /**
   * No celular, a primeira visita abre em LISTA: o kanban de cinco colunas
   * numa tela de 390px é rolagem lateral, e a lista é o que se lê de pé no
   * ônibus. Só quando a pessoa nunca escolheu; a escolha dela fica gravada.
   */
  useEffect(() => {
    try {
      if (!window.localStorage.getItem('acev:eu:view') && window.matchMedia('(max-width: 767px)').matches) {
        setView('list')
      }
    } catch {
      // Sem localStorage (modo privado): fica no padrão.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [period, setPeriod] = useState('month')
  const [modalOpen, setModalOpen] = useState(false)
  const [cronogramaOpen, setCronogramaOpen] = useState(false)

  const board = useBoard(tab)
  // O painel é onde quem coordena espera o "revise" da equipe: avisos a cada 5s aqui.
  useNotifications({ aoVivo: true })
  const metrics = useMetrics(period)
  /**
   * A fila é buscada SEMPRE, mesmo fora da aba, só para saber quantas são.
   *
   * É o contador ao lado do rótulo, e ele é o recurso inteiro: uma fila que só
   * aparece para quem lembra de clicar na aba é uma fila que ninguém atende.
   * Custa uma consulta de lista por carregamento de painel.
   */
  const fila = useBoard('role_queue')
  const naFila = fila.data?.columns.reduce((n, c) => n + c.tasks.length, 0) ?? 0

  // Quem delega vê a aba de acompanhamento das demandas que criou.
  const showCreatedTab = (me?.canAssignToRoleIds.length ?? 0) > 1

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900">
              {me ? `Olá, ${me.name.split(' ')[0]}` : 'Painel'}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-500">
              {me?.role.displayName}
              {me?.isAdmin && ' · Administrador'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Cronograma é demanda de equipe: um cartão, várias pessoas, uma
                peça por item. Botão à parte porque o formulário é outro. */}
            <Button variant="outline" onClick={() => setCronogramaOpen(true)}>
              <CalendarRange className="size-4" />
              Novo cronograma
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="size-4" />
              Nova demanda
            </Button>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Total"
            value={metrics.data?.total}
            loading={metrics.isLoading}
          />
          <MetricCard label="Em aberto" value={metrics.data?.open} loading={metrics.isLoading} />
          <MetricCard
            label="Finalizadas"
            value={metrics.data?.completed}
            loading={metrics.isLoading}
          />
          <MetricCard
            label="Atrasadas"
            value={metrics.data?.overdue}
            loading={metrics.isLoading}
            tone={metrics.data?.overdue ? 'danger' : 'default'}
          />
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-ink-100 p-1">
            <TabButton active={tab === 'me'} onClick={() => setTab('me')}>
              Minhas demandas
            </TabButton>
            {showCreatedTab && (
              <TabButton active={tab === 'created_by_me'} onClick={() => setTab('created_by_me')}>
                Criadas por mim
              </TabButton>
            )}
            <TabButton active={tab === 'role_queue'} onClick={() => setTab('role_queue')}>
              Da minha função
              {naFila > 0 && (
                <span className="ml-1.5 rounded-full bg-gold-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-gold-300 tabular-nums">
                  {naFila}
                </span>
              )}
            </TabButton>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-ink-200 bg-surface px-2.5 py-1.5 text-[13px] text-ink-700"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="quarter">Último trimestre</option>
            </select>

            <div
              className={clsx(
                'flex items-center gap-1 rounded-lg bg-ink-100 p-1',
                // A fila não tem kanban: escondido em vez de removido para o
                // cabeçalho não mudar de largura ao trocar de aba.
                tab === 'role_queue' && 'invisible',
              )}
            >
              <IconToggle active={view === 'kanban'} onClick={() => setView('kanban')} title="Kanban">
                <LayoutGrid className="size-4" />
              </IconToggle>
              <IconToggle active={view === 'list'} onClick={() => setView('list')} title="Lista">
                <List className="size-4" />
              </IconToggle>
            </div>
          </div>
        </div>

        {board.isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="text-ink-400" />
          </div>
        )}

        {/* A fila tem lista própria: o que importa nela é pegar, não arrastar
            entre colunas. Cada linha traz o botão de assumir. */}
        {tab === 'role_queue' && board.data && (
          <FilaDaFuncao
            tarefas={board.data.columns.flatMap((c) => c.tasks)}
            funcao={me?.role.displayName}
            onAbrir={(id) => router.push(`/demandas/${id}`)}
          />
        )}

        {tab !== 'role_queue' && board.data && view === 'kanban' && (
          <KanbanBoard
            columns={board.data.columns}
            queryKey={qk.board(tab)}
            onOpenTask={(id) => router.push(`/demandas/${id}`)}
          />
        )}

        {tab !== 'role_queue' && board.data && view === 'list' && (
          <ListView
            columns={board.data.columns}
            onOpenTask={(id) => router.push(`/demandas/${id}`)}
          />
        )}

        {tab !== 'role_queue' && board.data && board.data.columns.every((c) => c.tasks.length === 0) && (
          <EmptyState
            title="Nenhuma demanda por aqui"
            description={
              tab === 'me'
                ? 'Quando alguém criar uma demanda para você, ela aparece neste painel.'
                : 'Você ainda não criou demandas para outras pessoas.'
            }
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="size-4" />
                Criar a primeira
              </Button>
            }
          />
        )}

        {/**
          * O checklist do próprio dia, embaixo do quadro.
          *
          * O quadro responde "o que eu tenho para fazer"; isto responde "o que
          * eu fiz hoje" — e são perguntas de momentos diferentes: uma de manhã,
          * outra no fim do expediente.
          *
          * Fica ABAIXO e não numa aba porque não compete com o quadro: quem
          * abre o /eu está indo trabalhar, e quem rola até o fim está fechando
          * o dia. Numa aba, a pessoa teria de lembrar que existe.
          *
          * É o mesmo painel da Administração, na mesma consulta — a diferença é
          * que sem `task:view_all` ela devolve só a própria pessoa.
          */}
        <section className="mt-10 border-t border-overlay/10 pt-8">
          <h2 className="mb-1 text-xl font-semibold tracking-tight text-ink-900">
            O que eu fiz no dia
          </h2>
          <p className="mb-5 text-[13.5px] text-ink-500">
            Os itens de checklist que você marcou, e os que ficaram por fazer.
          </p>
          <PainelChecklists />
        </section>
      </div>

      <NewTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Só monta aberto: o formulário é grande e guardaria rascunho velho. */}
      {cronogramaOpen && <NovoCronogramaModal onClose={() => setCronogramaOpen(false)} />}
    </Shell>
  )
}

function MetricCard({
  label,
  value,
  loading,
  hint,
  tone = 'default',
}: {
  label: string
  value?: number | string
  loading?: boolean
  hint?: string
  tone?: 'default' | 'danger'
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-surface p-4">
      <p className="text-[11px] font-medium tracking-wide text-ink-500 uppercase">{label}</p>
      <p
        className={clsx(
          'mt-1.5 text-2xl font-semibold tabular-nums',
          tone === 'danger' ? 'text-red-600' : 'text-ink-900',
        )}
      >
        {loading ? <span className="text-ink-300">—</span> : (value ?? 0)}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-ink-500">{hint}</p>}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-md px-3 py-1.5 text-[13px] font-medium transition',
        active ? 'bg-surface text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800',
      )}
    >
      {children}
    </button>
  )
}

function IconToggle({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'rounded-md p-1.5 transition',
        active ? 'bg-surface text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800',
      )}
    >
      {children}
    </button>
  )
}

/**
 * A fila da função: o que ninguém pegou ainda.
 *
 * Lista própria, e não a `TaskTable`, porque o que se faz aqui é outra coisa.
 * Nas outras abas a pessoa compara prazo, cliente e responsável; aqui só
 * existem duas perguntas — o que é, e para quando — e uma ação. Botão em cada
 * linha, sem precisar abrir a demanda: é o "vai que um quer oferecer para o
 * outro" resolvido em um clique.
 */
function FilaDaFuncao({
  tarefas,
  funcao,
  onAbrir,
}: {
  tarefas: TaskListItem[]
  funcao?: string
  onAbrir: (id: string) => void
}) {
  const assumir = useClaimTask()
  const [erro, setErro] = useState<string | null>(null)
  /**
   * Qual linha está em voo. Sem isto o `isPending` da mutação valeria para a
   * lista toda, e clicar em uma demanda deixaria TODOS os botões girando.
   */
  const [emVoo, setEmVoo] = useState<string | null>(null)

  async function pegar(id: string) {
    setErro(null)
    setEmVoo(id)
    try {
      await assumir.mutateAsync(id)
    } catch (e) {
      /**
       * O caso das duas designers clicando junto. O backend recusa a segunda
       * com `ja_assumida`, e a mensagem precisa aparecer: sem ela o botão
       * simplesmente pararia de girar e a demanda sumiria da lista, o que se
       * parece com um bug em vez de "a colega pegou primeiro".
       */
      setErro(e instanceof ApiError ? e.message : 'Não foi possível assumir a demanda')
    } finally {
      setEmVoo(null)
    }
  }

  if (!tarefas.length) {
    return (
      <EmptyState
        title="Nada esperando na fila"
        description={`Demandas criadas para ${funcao ?? 'sua função'} sem um nome definido aparecem aqui, e qualquer pessoa da função pode assumir.`}
      />
    )
  }

  return (
    <div className="space-y-2">
      {erro && (
        <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
          {erro}
        </div>
      )}

      {tarefas.map((t) => (
        <div
          key={t.id}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-surface p-3.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
            <Inbox className="size-4" />
          </span>

          <button
            onClick={() => onAbrir(t.id)}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-[14px] font-medium text-ink-900">{t.title}</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-500">
              {t.client?.name ?? 'Interna'} · {t.taskType?.displayName} · criada por{' '}
              {t.createdBy.name.split(' ')[0]}
            </p>
          </button>

          <span
            className={clsx(
              'shrink-0 text-[12px] tabular-nums',
              t.isOverdue ? 'font-medium text-red-400' : 'text-ink-500',
            )}
          >
            {t.isOverdue ? 'Atrasada · ' : ''}
            {new Date(t.deadline).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          <Button
            onClick={() => pegar(t.id)}
            disabled={emVoo === t.id}
            className="shrink-0"
          >
            {emVoo === t.id ? <Spinner /> : <HandMetal className="size-4" />}
            Assumir
          </Button>
        </div>
      ))}
    </div>
  )
}

/**
 * A mesma tabela da Home, com todas as colunas e ordenável.
 *
 * Era uma grade de cards, que é o kanban sem as colunas: repetia a informação
 * empilhada e não deixava comparar duas demandas lado a lado. Em lista, o que
 * se quer é justamente alinhar prazo, responsável e horas para achar o que
 * está fora da curva.
 */
/**
 * A lista, com recorte por situação.
 *
 * No kanban a demanda concluída tem lugar próprio — é uma coluna, e vê-la ali
 * é o ponto. Na lista tudo vira uma pilha só, e o que já foi entregue passa a
 * competir por atenção com o que falta fazer. Quanto mais tempo o painel roda,
 * pior fica: as concluídas só crescem.
 *
 * Por isso o padrão é "Em aberto". Nada é escondido de verdade — as demais
 * ficam a um clique, com a contagem à vista para ninguém achar que sumiram.
 */
function ListView({
  columns,
  onOpenTask,
}: {
  columns: { slug: string; displayName: string; isTerminal: boolean; tasks: any[] }[]
  onOpenTask?: (id: string) => void
}) {
  const [recorte, setRecorte] = useState('aberto')

  const todas = columns.flatMap((c) => c.tasks)
  const terminais = new Set(columns.filter((c) => c.isTerminal).map((c) => c.slug))

  /**
   * Os recortes saem das colunas que a API mandou, não de uma lista escrita
   * aqui. Status vive no banco neste projeto: fixar "concluido" no front faria
   * um status novo nascer invisível, e um renomeado aparecer com o nome velho.
   */
  const recortes = [
    { id: 'aberto', rotulo: 'Em aberto', filtra: (t: any) => !terminais.has(t.status) },
    { id: 'atrasadas', rotulo: 'Atrasadas', filtra: (t: any) => t.isOverdue },
    ...columns.map((c) => ({
      id: c.slug,
      rotulo: c.displayName,
      filtra: (t: any) => t.status === c.slug,
    })),
    { id: 'todas', rotulo: 'Todas', filtra: () => true },
  ]

  const atual = recortes.find((r) => r.id === recorte) ?? recortes[0]!
  const visiveis = todas.filter(atual.filtra)

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {recortes.map((r) => {
          const n = todas.filter(r.filtra).length
          /**
           * Recorte vazio não vira botão — exceto o escolhido, que precisa
           * continuar visível para a pessoa entender por que a tela está vazia
           * e conseguir voltar. Sem isso a barra viraria uma fileira de zeros.
           */
          if (n === 0 && r.id !== recorte) return null
          const ativo = r.id === recorte
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRecorte(r.id)}
              className={clsx(
                'rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium ring-1 ring-inset transition',
                ativo
                  ? 'bg-brand-600/15 text-brand-700 ring-brand-600/40'
                  : 'bg-overlay/5 text-ink-600 ring-overlay/10 hover:text-ink-900',
              )}
            >
              {r.rotulo}
              <span className="ml-1.5 tabular-nums opacity-70">{n}</span>
            </button>
          )
        })}
      </div>

      <TaskTable
        tasks={visiveis}
        colunas={COLUNAS_COMPLETAS}
        ordenavel
        onAbrir={(id) => onOpenTask?.(id)}
        vazio={
          <p className="rounded-xl border border-dashed border-overlay/12 px-4 py-8 text-center text-[13px] text-ink-500">
            Nenhuma demanda em "{atual.rotulo.toLowerCase()}".
          </p>
        }
      />
    </>
  )
}
