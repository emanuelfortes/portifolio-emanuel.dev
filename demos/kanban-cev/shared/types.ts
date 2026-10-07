import type { Permission } from './permissions'
import type { TaskPriority, SomDeAviso } from './constants'

/** Formatos de resposta da API, compartilhados com o front. */

export interface SessionUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  /**
   * Data de nascimento, AAAA-MM-DD, ou nulo se ninguém preencheu.
   *
   * Vem na sessão porque quem precisa dela é a própria pessoa: é o que permite
   * a tela saber que hoje é o aniversário de quem está olhando sem uma
   * consulta a mais em todo carregamento.
   */
  birthday: string | null
  /**
   * Papel de parede escolhido pela pessoa, ou `null` para o fundo do tema.
   *
   * Vem na sessão, e não de uma consulta à parte, porque o fundo precisa estar
   * pintado no primeiro quadro: buscá-lo depois faria a tela abrir no tema e
   * trocar de cara na frente de quem olha, a cada navegação.
   */
  fundoUrl: string | null
  /** 0 a 100: quanto o fundo é abafado para o texto continuar legível. */
  fundoVeu: number
  /**
   * Enquadramento da imagem, em porcentagem. 50/50 é o centro.
   *
   * O fundo é recortado com `cover`, então um dos eixos sempre sobra cortado.
   * Numa foto alta o corte come o topo e a base — estes dois dizem qual parte
   * fica à mostra.
   */
  fundoPosX: number
  fundoPosY: number
  /**
   * O som de cada aviso de peça, já com o padrão aplicado a quem nunca
   * escolheu: `revisar` toca para quem coordena, `ajustar` para quem fez.
   * `nenhum` é silêncio.
   */
  somRevisar: SomDeAviso
  somAjustar: SomDeAviso
  isAdmin: boolean
  /** O CARGO: o que aparece embaixo do nome. */
  role: { id: number; slug: string; displayName: string }
  /**
   * Todas as funções, a principal mais as adicionais.
   *
   * É o que decide trabalho — fila, notificação por função, em que grupo a
   * pessoa aparece ao atribuir. O `role` decide identidade; isto decide alcance.
   */
  roleIds: number[]
  permissions: Permission[]
  /** Funções para as quais este usuário pode criar demanda (já resolvido pelo backend). */
  canAssignToRoleIds: number[]
}

export interface TaskStatusRef {
  slug: string
  displayName: string
  color: string
  order: number
  isTerminal: boolean
}

export interface UserRef {
  id: string
  name: string
  avatarUrl: string | null
  roleDisplayName: string
}

export interface ClientRef {
  id: string
  name: string
  logoUrl: string | null
}

/** Uma função da equipe, quando ela aparece como fila de demandas. */
export interface RoleRef {
  id: number
  displayName: string
}

export interface TaskTypeRef {
  id: number
  name: string
  displayName: string
  color: string
}

export interface LabelRef {
  /** Em quantas demandas ela está. Presente na listagem geral. */
  emUso?: number
  id: string
  name: string
  color: string
}

/**
 * Progresso do checklist, já somado no backend.
 *
 * A listagem devolve a contagem, não os itens: o card do kanban só precisa
 * mostrar "3/7", e mandar o conteúdo de todos os itens de todas as demandas
 * engordaria a resposta para exibir um número.
 */
export interface ChecklistProgress {
  done: number
  total: number
}

export interface ChecklistItem {
  id: string
  content: string
  isDone: boolean
  position: number
  doneBy: UserRef | null
  doneAt: string | null
  /** Quando alguém começou a peça; nulo = não iniciada. É o "em andamento". */
  startedAt: string | null
  /**
   * A revisão: `em_revisao` (quem fez marcou; quem coordena ainda não viu),
   * `aprovada` ou `reprovada`. Nulo quando nunca foi marcada.
   */
  reviewStatus: 'em_revisao' | 'aprovada' | 'reprovada' | null
  /** O motivo da reprovação, para quem fez saber o que ajustar. */
  reviewNote: string | null
  reviewedBy: UserRef | null
  reviewedAt: string | null
  /**
   * Os quatro abaixo só existem em item de cronograma: a peça tem dono, tipo,
   * data e briefing próprios. Num checklist comum vêm nulos.
   */
  description: string | null
  assignee: UserRef | null
  taskType: TaskTypeRef | null
  dueAt: string | null
  /** A entrega de quem fez a peça: o link do Drive, do post final. */
  delivery: string | null
}

export interface TaskListItem {
  id: string
  title: string
  status: string
  priority: TaskPriority
  deadline: string
  rank: string
  /** Correção 3.6: atraso é CALCULADO, nunca armazenado. Vem pronto da view. */
  isOverdue: boolean
  commentCount: number
  attachmentCount: number
  client: ClientRef | null
  taskType: TaskTypeRef
  /**
   * NULO quando a demanda está na fila de uma função e ninguém assumiu.
   * Nesse caso `queue` diz de qual função ela está esperando alguém.
   */
  assignee: UserRef | null
  /**
   * A fila de origem. Continua preenchida depois que alguém assume, porque é
   * ela que diz para onde a demanda volta quando a pessoa repassa o trabalho.
   * Nula em demanda criada direto para uma pessoa, que não veio de fila
   * nenhuma.
   */
  queue: RoleRef | null
  createdBy: UserRef
  createdAt: string
  completedAt: string | null
  /**
   * Preenchido quando a demanda foi materializada por uma recorrência.
   * Sem isso, uma demanda nascida da regra semanal é indistinguível de uma
   * criada à mão, e não há caminho de volta até a regra que a gerou.
   */
  recurrenceId: string | null
  /**
   * Se quem pediu a lista pode mover esta demanda de status.
   *
   * Vem na listagem, e não só no detalhe, porque a tabela deixa trocar o
   * status pela própria linha. Sem isso a tela teria duas saídas ruins:
   * oferecer o menu a todo mundo e deixar a API recusar depois do clique, ou
   * buscar o detalhe de cada linha só para saber se pode.
   *
   * Não custa consulta: `authorizeTask` é função pura, e a regra de
   * `changeStatus` — responsável, criador ou quem tem `task:edit_any` — não
   * depende dos participantes, que são o único dado que faltaria aqui.
   */
  canChangeStatus: boolean
  /** Etiquetas aplicadas. Vazio quando não há: a demanda não precisa de nenhuma. */
  labels: LabelRef[]
  /** `null` quando a demanda não tem checklist, para a tela não desenhar "0/0". */
  checklist: ChecklistProgress | null
}

export interface TaskDetail extends TaskListItem {
  description: string | null
  observations: string | null
  startedAt: string | null
  participants: UserRef[]
  /** Permissões do usuário logado sobre ESTA demanda, resolvidas no backend. */
  can: {
    edit: boolean
    changeStatus: boolean
    delete: boolean
    /** Está sem dono, na fila da minha função: posso pegar para mim. */
    claim: boolean
    /** Sou o dono (ou a coordenação) e posso devolver para a fila. */
    release: boolean
    /**
     * Posso ALIMENTAR a demanda sem poder editá-la: marcar item do checklist
     * e escrever no briefing dos meus itens. É o que participante tem num
     * cronograma — quem edita vídeo entrega a peça dela sem mexer no resto.
     */
    contribute: boolean
  }
}

export interface PersonalMetrics {
  total: number
  open: number
  completed: number
  overdue: number
  completedOnTimeRate: number | null
  avgCompletionHours: number | null
}

export interface NotificationItem {
  id: string
  type: string
  taskId: string | null
  taskTitle: string | null
  actor: UserRef | null
  payload: Record<string, unknown>
  readAt: string | null
  createdAt: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface ApiError {
  error: string
  message: string
  details?: unknown
}
