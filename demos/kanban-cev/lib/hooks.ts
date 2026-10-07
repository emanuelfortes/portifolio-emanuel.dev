'use client'

import { useCallback, useEffect, useState } from 'react'
import { enviarLocal } from '@/demos/kanban-cev/lib/upload'
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@/demos/kanban-cev/lib/query'
import type { SomDeAviso } from '@/demos/kanban-cev/shared'
import { api, qk } from '@/demos/kanban-cev/lib/api'
import type {
  SessionUser,
  TaskListItem,
  TaskDetail,
  PersonalMetrics,
  LabelRef,
  ChecklistItem,
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from '@/demos/kanban-cev/shared'

export interface BoardColumn {
  slug: string
  displayName: string
  color: string
  isTerminal: boolean
  tasks: TaskListItem[]
}

/**
 * Os dois ritmos do tempo real da revisão. Só aqui: quem quiser ajustar o
 * custo mexe num número, não em dois lugares.
 */
/** Avisos (sino e cartão do canto), em aba visível. */
export const INTERVALO_AVISOS = 15_000
/**
 * Avisos onde a pessoa está esperando por eles: o painel "Eu" e a página do
 * cronograma. A consulta é uma só; o TanStack usa o menor intervalo entre
 * quem a observa, então basta um observador de 5s na página para o cartão
 * do canto acelerar junto.
 */
export const INTERVALO_AVISOS_AO_VIVO = 5_000
/** Peças do cronograma, na página dele. */
export const INTERVALO_PECAS = 5_000

export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => api.get<SessionUser>('/auth/me'),
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useBoard(
  scope: 'me' | 'created_by_me' | 'team' | 'role' | 'role_queue',
  extra = '',
) {
  return useQuery({
    queryKey: qk.board(scope + extra),
    queryFn: () => api.get<{ columns: BoardColumn[] }>(`/tasks/board?scope=${scope}${extra}`),
  })
}

export function useMetrics(period: string) {
  return useQuery({
    queryKey: qk.metrics(period),
    queryFn: () => api.get<PersonalMetrics & { period: string }>(`/dashboard/me?period=${period}`),
  })
}

export function useStatuses() {
  return useQuery({
    queryKey: qk.statuses,
    queryFn: () => api.get<any[]>('/meta/statuses'),
    staleTime: 30 * 60_000,
  })
}

export function useTaskTypes() {
  return useQuery({
    queryKey: qk.taskTypes,
    queryFn: () => api.get<any[]>('/meta/task-types'),
    staleTime: 30 * 60_000,
  })
}

/** Já vem filtrado pela matriz de delegação. É UX; o bloqueio real é no backend. */
export function useAssignableUsers() {
  return useQuery({
    queryKey: qk.assignable,
    queryFn: () => api.get<any[]>('/users/assignable'),
    staleTime: 10 * 60_000,
  })
}

export function useClients() {
  return useQuery({
    queryKey: qk.clients,
    queryFn: () => api.get<any[]>('/clients'),
    staleTime: 10 * 60_000,
  })
}

export function useNotifications(opcoes: { aoVivo?: boolean } = {}) {
  return useQuery({
    queryKey: qk.notifications,
    queryFn: () => api.get<{ unreadCount: number; items: any[] }>('/notifications'),
    /**
     * Polling de 15s em aba visível, por causa da revisão do cronograma: o
     * "revise" de quem coordena e o "aprovada/reprovada" de quem fez chegam
     * pelo cartão do canto (avisos-de-revisao.tsx), que lê desta consulta.
     * Com 60s a pessoa esperava um minuto por um aviso que pede ação agora.
     *
     * Aba em segundo plano não faz polling (padrão do TanStack), e voltar
     * para ela já refaz a consulta (`refetchOnWindowFocus` em providers.tsx).
     * Custo: ~1.900 chamadas por dia e aba em 8h de trabalho, dentro da
     * franquia da Lambda com folga; o banco já fica ligado o dia todo.
     *
     * Depois de um erro, espaça para 5 min: é o que impede uma aba esquecida
     * aberta à noite de encher o log quando o banco estiver desligado fora
     * do horário (Ação 2 do plano de custo). WebSocket segue previsto para a
     * Fase 6, e este endpoint vira o fallback.
     */
    refetchInterval: (query) =>
      query.state.status === 'error'
        ? 5 * 60_000
        : opcoes.aoVivo
          ? INTERVALO_AVISOS_AO_VIVO
          : INTERVALO_AVISOS,
  })
}


/* -------------------------------------------------------------- preferências */

/**
 * Preferência de interface guardada no aparelho.
 *
 * Kanban ou lista é escolha da pessoa, não estado de tela: guardar em
 * `useState` faz a opção se perder ao trocar de página e voltar, e ela precisa
 * reescolher toda vez. Em `localStorage` a escolha vale até ela trocar de
 * novo, inclusive depois de fechar o navegador.
 *
 * A leitura acontece DEPOIS da montagem, e não no inicializador do `useState`:
 * o `localStorage` não existe no servidor, e ler ali faria o valor renderizado
 * no build divergir do valor no navegador — o aviso de hidratação do React.
 * Não há piscada visível porque a lista só aparece depois que a consulta
 * termina, e até lá o efeito já rodou.
 *
 * Não guarde nada de sessão aqui: o aparelho pode ser compartilhado, e isto
 * sobrevive ao logout.
 */
export function usePreferencia<T extends string>(
  chave: string,
  padrao: T,
  valores: readonly T[],
): [T, (valor: T) => void] {
  const [valor, setValor] = useState<T>(padrao)

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(chave)
      if (salvo && (valores as readonly string[]).includes(salvo)) setValor(salvo as T)
    } catch {
      // Modo privado do Safari e navegador com armazenamento bloqueado lançam
      // aqui. A preferência deixa de persistir; a tela continua funcionando.
    }
    // `valores` é literal em todo uso; incluí-lo relançaria o efeito a cada
    // render por causa da identidade do array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  const definir = useCallback(
    (novo: T) => {
      setValor(novo)
      try {
        window.localStorage.setItem(chave, novo)
      } catch {
        /* idem */
      }
    },
    [chave],
  )

  return [valor, definir]
}

/* -------------------------------------------------------------- detalhe da demanda */

export interface TaskComment {
  id: string
  content: string
  createdAt: string
  /** O texto foi alterado depois de publicado. */
  editado: boolean
  author: { id: string; name: string; avatarUrl: string | null; roleDisplayName: string }
}

export interface ActivityEntry {
  id: string
  action: string
  oldValue: unknown
  newValue: unknown
  createdAt: string
  userName: string
  userAvatar: string | null
}

/** A origem de uma demanda materializada. `null` quando foi criada à mão. */
export interface TaskOrigin {
  id: string
  description: string
  schedule: string
  isActive: boolean
  nextRunAt: string
  deletedAt: string | null
}

export function useTask(id: string) {
  return useQuery({
    queryKey: qk.task(id),
    queryFn: () => api.get<TaskDetail>(`/tasks/${id}`),
    enabled: !!id,
  })
}

export function useTaskComments(id: string) {
  return useQuery({
    queryKey: qk.taskComments(id),
    queryFn: () => api.get<TaskComment[]>(`/tasks/${id}/comments`),
    enabled: !!id,
  })
}

/**
 * Editar um comentário já publicado. Só o autor — o backend recusa o resto.
 *
 * Invalida também o histórico: o comentário aparece por lá, e deixá-lo com o
 * texto antigo criaria duas versões da mesma frase na mesma tela.
 */
export function useUpdateComment(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; content: string }) =>
      api.patch(`/tasks/${taskId}/comments/${v.id}`, { content: v.content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.taskComments(taskId) })
      qc.invalidateQueries({ queryKey: qk.taskActivity(taskId) })
    },
  })
}

export function useTaskActivity(id: string) {
  return useQuery({
    queryKey: qk.taskActivity(id),
    queryFn: () => api.get<ActivityEntry[]>(`/tasks/${id}/activity`),
    enabled: !!id,
  })
}


/**
 * Só busca quando a demanda de fato veio de uma regra. O `recurrenceId` já
 * chega na listagem, então na maioria das demandas esta requisição nem sai.
 */
export function useTaskOrigin(id: string, temRecorrencia: boolean) {
  return useQuery({
    queryKey: qk.taskOrigin(id),
    queryFn: () => api.get<TaskOrigin | null>(`/tasks/${id}/recurrence`),
    enabled: !!id && temRecorrencia,
    staleTime: 5 * 60_000,
  })
}

export function useAddComment(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => api.post(`/tasks/${taskId}/comments`, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.taskComments(taskId) })
      qc.invalidateQueries({ queryKey: qk.task(taskId) })
      qc.invalidateQueries({ queryKey: ['board'] })
    },
  })
}

/* -------------------------------------------------------------- recorrências */

export interface Recurrence {
  id: string
  template: {
    title: string
    description?: string | null
    taskTypeId: number
    clientId?: string | null
    assigneeId: string
    priority: string
    observations?: string | null
    /**
     * Modo cronograma: uma demanda por social media, com o checklist dos
     * clientes dele. Quando ligado, `assigneeId` é só o dono da regra.
     */
    porResponsavelDeClientes?: boolean
    /**
     * Modo conferência: UMA demanda, para quem verifica, com todos os social
     * medias e seus clientes no checklist. Aqui o `assigneeId` é de verdade.
     */
    checklistDeVerificacao?: boolean
  }
  rrule: string
  /** "Toda segunda, quarta e sexta" — montado pela API, não guardado no banco. */
  description: string
  schedule: string
  leadTimeDays: number
  deadlineTime: string
  isActive: boolean
  nextRunAt: string
  lastRunAt: string | null
  nextDeadlines: string[]
  createdBy: string
  createdAt: string
}

export function useRecurrences() {
  return useQuery({
    queryKey: qk.recurrences,
    queryFn: () => api.get<Recurrence[]>('/recurrences'),
  })
}

/**
 * Pré-visualização das próximas datas enquanto a pessoa monta a regra.
 *
 * Quem expande a RRULE é o servidor, não o navegador: o prazo tem que sair no
 * fuso da agência, e o notebook de quem cadastra pode estar em qualquer fuso.
 */
export function useRecurrencePreview(input: {
  rrule: string
  leadTimeDays: number
  deadlineTime: string
}) {
  const assinatura = `${input.rrule}|${input.leadTimeDays}|${input.deadlineTime}`
  return useQuery({
    queryKey: qk.recurrencePreview(assinatura),
    queryFn: () =>
      api.post<{ description: string; schedule: string; deadlines: string[] }>(
        '/recurrences/preview',
        { ...input, count: 4 },
      ),
    enabled: input.rrule.length > 3,
    retry: false,
    staleTime: 5 * 60_000,
  })
}

function useRecurrenceMutation<T>(fn: (v: T) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.recurrences })
      /**
       * Recorrência cria demanda de verdade — no "gerar agora" e, desde que a
       * primeira ocorrência passou a nascer junto com a regra, no cadastro
       * também. Daí a lista ser a mesma de `useCreateTask`: sem os contadores
       * e a home aqui, a pessoa cadastrava a regra, via o card aparecer no
       * quadro e o "TOTAL 0" logo acima dele continuar dizendo que não havia
       * demanda nenhuma.
       */
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['metrics'] })
      qc.invalidateQueries({ queryKey: qk.home })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCreateRecurrence() {
  return useRecurrenceMutation((input: unknown) => api.post('/recurrences', input))
}

export function useUpdateRecurrence() {
  return useRecurrenceMutation((v: { id: string; patch: unknown }) =>
    api.patch(`/recurrences/${v.id}`, v.patch),
  )
}

export function useDeleteRecurrence() {
  return useRecurrenceMutation((id: string) => api.delete(`/recurrences/${id}`))
}

export function useRunRecurrence() {
  return useRecurrenceMutation((id: string) => api.post(`/recurrences/${id}/run`))
}

/* -------------------------------------------------------------- anexos */

export interface Attachment {
  id: string
  fileName: string
  mimeType: string
  fileSize: number
  createdAt: string
  /** A peça do cronograma a que pertence, ou nulo quando é da demanda inteira. */
  checklistItemId: string | null
  /**
   * URL assinada para exibir a imagem. Nula em PDF, documento e afins — e
   * também quando o armazenamento não está configurado.
   *
   * Expira em uma hora, e é por isso que a lista de anexos não fica em cache
   * indefinidamente (ver `staleTime` no `useAttachments`).
   */
  previewUrl: string | null
  uploadedBy: { id: string; name: string; avatarUrl: string | null }
}

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: qk.taskAttachments(taskId),
    queryFn: () => api.get<Attachment[]>(`/tasks/${taskId}/attachments`),
    enabled: !!taskId,
    /**
     * Meia hora, com folga para as URLs de preview que vivem uma.
     *
     * O que se evita aqui é a aba esquecida aberta a manhã inteira: passado o
     * prazo da assinatura, as miniaturas viravam quadrados quebrados sem nada
     * na tela explicando por quê. Estando velho, o próximo foco na janela já
     * traz URLs novas.
     */
    staleTime: 30 * 60 * 1000,
  })
}

export function useDeleteAttachment(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${taskId}/attachments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.taskAttachments(taskId) })
      qc.invalidateQueries({ queryKey: qk.task(taskId) })
    },
  })
}

/** A URL de download é gerada na hora e expira: nunca fica guardada. */
/**
 * Envia um anexo sem depender de hook.
 *
 * É função solta, e não hook, porque nem sempre há `taskId` na montagem: no
 * modal de criação a demanda só existe depois do POST. Chamar em laço para
 * mandar um lote inteiro também exige isso — hook não se chama dentro de loop.
 *
 * Três passos: pedir a URL assinada, mandar o arquivo direto ao S3, confirmar
 * o registro. O `fetch` do PUT vai ao S3, não à nossa API — por isso é o único
 * lugar do front que não passa pelo BFF. Sem `credentials`, senão o navegador
 * mandaria o cookie de sessão para a Amazon.
 *
 * Quem chama invalida o cache: num lote, uma invalidação por arquivo
 * recarregaria a lista tantas vezes quantos forem os arquivos.
 */
export async function enviarAnexo(taskId: string, file: File, checklistItemId?: string) {
  const assinatura = await api.post<{ uploadUrl: string; fileKey: string }>(
    `/tasks/${taskId}/attachments/sign`,
    { fileName: file.name, mimeType: file.type, fileSize: file.size },
  )

  const envio = await enviarLocal(assinatura.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'content-type': file.type },
  })
  if (!envio.ok) throw new Error('Falha ao enviar o arquivo')

  return api.post(`/tasks/${taskId}/attachments`, {
    fileKey: assinatura.fileKey,
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
    checklistItemId: checklistItemId ?? undefined,
  })
}

/**
 * Cria um item de checklist sem depender de hook.
 *
 * Mesmo motivo do `enviarAnexo`: no modal de nova demanda o `taskId` só existe
 * depois do POST, e `useAddChecklistItem` precisa dele na montagem.
 */
export async function criarItemChecklist(taskId: string, item: CreateChecklistItemInput) {
  return api.post<ChecklistItem[]>(`/tasks/${taskId}/checklist`, item)
}

export interface Ata {
  fileKey: string
  fileName: string
  fileSize: number
  createdAt: string
  /** Assinada pela API na leitura. Nula quando não há armazenamento configurado. */
  url: string | null
}

/**
 * Envia a ata da reunião para o cliente.
 *
 * Três passos, os mesmos do anexo de demanda: pede a URL, manda o arquivo
 * direto ao S3, grava o metadado. O que muda é o último — em vez de uma tabela
 * de anexos, o registro entra na seção `atas` do perfil, junto com as que já
 * existiam.
 *
 * A lista anterior vem por parâmetro porque a API substitui `content` inteiro:
 * mandar só a nova apagaria as reuniões passadas.
 */
export async function enviarAtaCliente(clientId: string, file: File, atuais: Ata[]) {
  const assinatura = await api.post<{ uploadUrl: string; fileKey: string }>(
    `/clients/${clientId}/attachments/sign`,
    { fileName: file.name, mimeType: file.type, fileSize: file.size },
  )

  const envio = await enviarLocal(assinatura.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'content-type': file.type },
  })
  if (!envio.ok) throw new Error('Falha ao enviar o arquivo')

  const nova = {
    fileKey: assinatura.fileKey,
    fileName: file.name,
    fileSize: file.size,
    createdAt: new Date().toISOString(),
  }

  return api.put(`/clients/${clientId}/sections`, {
    sectionType: 'atas',
    title: 'Atas de reunião',
    // `url` não é gravada: ela expira, e no banco viraria linha que para de
    // funcionar sozinha depois de uma hora.
    content: { arquivos: [...atuais.map(({ url: _, ...resto }) => resto), nova] },
  })
}

export async function removerAtaCliente(clientId: string, fileKey: string, atuais: Ata[]) {
  return api.put(`/clients/${clientId}/sections`, {
    sectionType: 'atas',
    title: 'Atas de reunião',
    content: {
      arquivos: atuais.filter((a) => a.fileKey !== fileKey).map(({ url: _, ...resto }) => resto),
    },
  })
}

export async function baixarAnexo(taskId: string, attachmentId: string) {
  const { url } = await api.get<{ url: string }>(
    `/tasks/${taskId}/attachments/${attachmentId}/download`,
  )
  window.open(url, '_blank', 'noopener')
}

/* -------------------------------------------------------------- clientes */

/**
 * Trocar quem cuida do cliente.
 *
 * Invalida o cliente E as recorrências: a lista de responsáveis é o que monta
 * o checklist do cronograma semanal, então a tela de recorrências passa a
 * anunciar outro número de demandas por ocorrência.
 */
export interface SocialMediaCandidato {
  id: string
  name: string
  avatarUrl: string | null
  roleDisplayName: string
}

/** Quem pode cuidar de cliente: só quem tem a função de social media. */
export function useSocialMedias() {
  return useQuery({
    queryKey: ['users', 'social-medias'],
    queryFn: () => api.get<SocialMediaCandidato[]>('/users/social-medias'),
    staleTime: 5 * 60_000,
  })
}

export function useSetClientSocialMedias(clientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userIds: string[]) =>
      api.put(`/clients/${clientId}/social-medias`, { userIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) })
      qc.invalidateQueries({ queryKey: qk.recurrences })
    },
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: qk.client(id),
    queryFn: () => api.get<any>(`/clients/${id}`),
    enabled: !!id,
  })
}

/**
 * O histórico de demandas do cliente, das mais recentes para as mais antigas.
 *
 * `scope` segue a mesma regra da tela Buscar: quem enxerga a agência inteira
 * vê tudo; quem não enxerga vê as suas. Antes era sempre `team`, e para quem
 * não tem `task:view_all` a API recusava e a seção sumia em silêncio.
 */
export function useClientTasks(id: string, scope: 'team' | 'me' = 'team') {
  return useQuery({
    queryKey: [...qk.clientTasks(id), scope],
    queryFn: () =>
      api.get<{ items: TaskListItem[]; total: number }>(
        `/tasks?clientId=${id}&scope=${scope}&orderBy=created_at&limit=200`,
      ),
    enabled: !!id,
  })
}

export function useSaveClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id?: string; data: unknown }) =>
      v.id ? api.patch(`/clients/${v.id}`, v.data) : api.post('/clients', v.data),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: qk.clients })
      if (v.id) qc.invalidateQueries({ queryKey: qk.client(v.id) })
    },
  })
}

/**
 * Apagar o cliente de vez — diferente de marcar como encerrado.
 *
 * O backend recusa quando há demanda ou compromisso ligado, e devolve a
 * contagem na mensagem. A tela não repete essa regra: as duas divergiriam na
 * primeira mudança, e é o backend que sabe o número.
 */
export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      qc.invalidateQueries({ queryKey: ['client'] })
    },
  })
}

export function useSaveClientSection(clientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.put(`/clients/${clientId}/sections`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.client(clientId) }),
  })
}

/* -------------------------------------------------------------- calendário */

export interface CalendarItem {
  kind: 'evento' | 'feriado' | 'aniversario' | 'demanda'
  id: string
  title: string
  startAt: string
  endAt: string
  allDay: boolean
  color?: string | null
  eventType?: string
  clientName?: string | null
  taskId?: string
  status?: string
  priority?: string
  isOverdue?: boolean
}

export function useCalendar(from: string, to: string, scope: 'agency' | 'me') {
  return useQuery({
    queryKey: qk.calendar(`${from}|${to}|${scope}`),
    queryFn: () =>
      api.get<{ items: CalendarItem[] }>(
        `/calendar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&scope=${scope}`,
      ),
  })
}

export function useSaveEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id?: string; data: unknown }) =>
      v.id ? api.patch(`/events/${v.id}`, v.data) : api.post('/events', v.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar'] })
      /**
       * A home também. O painel "Próximos eventos" vem da mesma fonte por
       * outra chave — invalidando só o calendário, um compromisso alterado
       * continuava com os dados velhos ali até alguém recarregar.
       */
      qc.invalidateQueries({ queryKey: qk.home })
      // E o registro aberto na edição, para reabrir não mostrar o estado
      // anterior à gravação.
      qc.invalidateQueries({ queryKey: ['event'] })
    },
  })
}

/**
 * Um compromisso inteiro, para abrir a edição.
 *
 * O item do calendário não serve: ele traz só o que a grade desenha, e o PATCH
 * substitui os participantes pelo que o formulário mandar — abrir a edição com
 * campos vazios apagaria local, descrição e equipe ao salvar.
 */
export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => api.get<any>(`/events/${id}`),
    enabled: !!id,
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar'] })
      // Sem isto, o compromisso excluído continuava listado em "Próximos
      // eventos" na home — e quem visse concluiria que a exclusão não pegou.
      qc.invalidateQueries({ queryKey: qk.home })
      qc.invalidateQueries({ queryKey: ['event'] })
    },
  })
}

/* -------------------------------------------------------------- equipe e matriz */

export interface TeamMember {
  /** Funções ADICIONAIS. A principal é `roleId`. */
  extraRoleIds?: number[]
  id: string
  name: string
  email: string
  avatarUrl: string | null
  birthday: string | null
  isActive: boolean
  isAdmin: boolean
  roleId: number
  roleSlug: string
  roleDisplayName: string
}

/**
 * Busca livre nas demandas, para a tela que procura em vez de acompanhar.
 *
 * Recebe a query montada porque os filtros dessa tela são muitos e mudam
 * juntos — passar cada um como argumento nomeado obrigaria a mexer aqui a cada
 * filtro novo. A string também é a chave de cache, então dois filtros iguais
 * reaproveitam o resultado.
 */
/** Quantas demandas por página da busca. */
export const BUSCA_POR_PAGINA = 100

/**
 * A busca é paginada de verdade: a primeira página vem sozinha e "Mostrar
 * mais" traz a seguinte, somando à que já está na tela.
 *
 * Antes era uma página só, com as cem de prazo mais próximo — e numa agência
 * com centenas de demandas antigas isso escondia justamente a recém-criada,
 * de prazo longe. A chave é própria (`['tasks','busca',…]`): a forma dos dados
 * é outra, em páginas, e não pode cair no cache de `useTasks`.
 */
export function useBuscarDemandas(query: string, ativo = true) {
  return useInfiniteQuery({
    queryKey: ['tasks', 'busca', query] as const,
    queryFn: ({ pageParam }) =>
      api.get<{ items: TaskListItem[]; total: number; limit: number; offset: number }>(
        `/tasks?${query}&limit=${BUSCA_POR_PAGINA}&offset=${pageParam}`,
      ),
    initialPageParam: 0,
    getNextPageParam: (ultima) => {
      const proximo = ultima.offset + ultima.items.length
      return ultima.items.length && proximo < ultima.total ? proximo : undefined
    },
    enabled: ativo,
    // O resultado de uma busca envelhece rápido, mas voltar da demanda para a
    // lista não pode piscar: meio minuto segura a ida e volta sem mostrar dado
    // velho de verdade.
    staleTime: 30_000,
  })
}

/* ------------------------------------------------------------- externas */

export interface ExternaAgora {
  id: string
  title: string
  eventType: string
  location: string | null
  startAt: string
  endAt: string
  /** Nulo enquanto ninguém confirmou a saída. */
  startedAt: string | null
  startedBy: { id: string; name: string } | null
  attendees: { id: string; name: string; avatarUrl: string | null }[]
}

/**
 * De quanto em quanto tempo o chip pergunta. Trinta segundos é o bastante
 * para quem não confirmou ver o cronômetro de quem confirmou sem recarregar;
 * o tique de um segundo é local, calculado da hora gravada.
 */
export const INTERVALO_EXTERNAS = 30_000

export function useExternasAgora() {
  return useQuery({
    queryKey: ['externas', 'agora'],
    queryFn: () =>
      api.get<{ emAndamento: ExternaAgora[]; paraConfirmar: ExternaAgora[] }>('/externas/agora'),
    refetchInterval: INTERVALO_EXTERNAS,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  })
}

function useExternaMutation<T>(fn: (v: T) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['externas'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
      qc.invalidateQueries({ queryKey: ['event'] })
      qc.invalidateQueries({ queryKey: ['admin', 'checklists'] })
      qc.invalidateQueries({ queryKey: qk.notifications })
    },
  })
}

/** Confirma quem foi (substitui a equipe) e dispara o cronômetro. */
export const useIniciarExterna = () =>
  useExternaMutation((v: { id: string; attendeeIds?: string[]; startedAt?: string }) =>
    api.post(`/events/${v.id}/iniciar`, { attendeeIds: v.attendeeIds, startedAt: v.startedAt }),
  )
export const useEncerrarExterna = () =>
  useExternaMutation((v: { id: string; finishedAt?: string }) =>
    api.post(`/events/${v.id}/encerrar`, { finishedAt: v.finishedAt }),
  )
export const useReabrirExterna = () =>
  useExternaMutation((v: { id: string }) => api.post(`/events/${v.id}/reabrir`, {}))
export const useEquipeExterna = () =>
  useExternaMutation((v: { id: string; attendeeIds: string[] }) =>
    api.put(`/events/${v.id}/equipe`, { attendeeIds: v.attendeeIds }),
  )

/** O som de cada aviso de peça. Pessoal: o backend só aceita o próprio id. */
export function useDefinirSons(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { somRevisar?: SomDeAviso; somAjustar?: SomDeAviso }) =>
      api.put(`/users/${userId}/sons`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.me }),
  })
}

export function useTeam(incluirInativos = false) {
  return useQuery({
    queryKey: qk.team(incluirInativos),
    queryFn: () =>
      api.get<TeamMember[]>(`/users${incluirInativos ? '?includeInactive=true' : ''}`),
  })
}

function useTeamMutation<T>(fn: (v: T) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: qk.assignable })
    },
  })
}

export function useSaveUser() {
  return useTeamMutation((v: { id?: string; data: unknown }) =>
    v.id ? api.patch(`/users/${v.id}`, v.data) : api.post('/users', v.data),
  )
}

export function useDeactivateUser() {
  return useTeamMutation((id: string) => api.delete(`/users/${id}`))
}

export function useResetUserPassword() {
  return useTeamMutation((v: { id: string; password: string }) =>
    api.post(`/users/${v.id}/password`, { password: v.password }),
  )
}

export interface DelegationMatrix {
  roles: { id: number; slug: string; displayName: string }[]
  matrix: { fromRoleId: number; targets: { toRoleId: number; allowed: boolean }[] }[]
  canEdit: boolean
}

export function useDelegationMatrix() {
  return useQuery({
    queryKey: qk.delegationMatrix,
    queryFn: () => api.get<DelegationMatrix>('/meta/delegation-matrix'),
  })
}

export function useSetDelegation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { fromRoleId: number; toRoleId: number; allowed: boolean }) =>
      api.put('/meta/delegation-matrix', v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.delegationMatrix })
      // Mudar quem delega muda o select de responsável na hora.
      qc.invalidateQueries({ queryKey: qk.assignable })
      qc.invalidateQueries({ queryKey: qk.me })
    },
  })
}

/* -------------------------------------------------------------- dashboards */

export function useAdminOverview(period: string) {
  return useQuery({
    queryKey: qk.adminOverview(period),
    queryFn: () => api.get<any>(`/dashboard/admin?period=${period}`),
  })
}


export function useUsersPerformance(period: string) {
  return useQuery({
    queryKey: qk.usersPerformance(period),
    queryFn: () => api.get<any>(`/dashboard/admin/users-performance?period=${period}`),
  })
}

export function useHome() {
  return useQuery({
    queryKey: qk.home,
    queryFn: () => api.get<any>('/dashboard/home'),
  })
}

export function useChangeOwnPassword() {
  return useMutation({
    mutationFn: (v: { currentPassword: string; newPassword: string }) =>
      api.post('/auth/change-password', v),
  })
}

/* -------------------------------------------------------------- mutations */

/**
 * Excluir demanda.
 *
 * É soft delete no banco (regra 7.3): a linha fica, com `deleted_at`, e o
 * histórico continua auditável. Da tela, some de tudo.
 *
 * Invalida a mesma lista de `useCreateTask` porque o efeito é o inverso do
 * mesmo evento: a demanda sai do quadro, dos contadores, da home e de toda
 * listagem. Esquecer uma delas deixaria a demanda excluída visível até alguém
 * recarregar a página, e quem visse concluiria que a exclusão não funcionou.
 */
export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['metrics'] })
      qc.invalidateQueries({ queryKey: qk.home })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    // O retorno é tipado porque quem cria com anexo precisa do id para o
    // upload: a chave no S3 é `tasks/{id}/...` e só existe depois do INSERT.
    mutationFn: (input: unknown) => api.post<TaskDetail>('/tasks', input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['metrics'] })
      qc.invalidateQueries({ queryKey: qk.home })
      // Sem isto, criar uma demanda não atualizava as telas que listam por
      // `/tasks` — o mesmo esquecimento que já tinha escondido a troca de
      // status na Home.
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Mover card no kanban.
 *
 * A UI já foi atualizada de forma otimista pelo componente antes desta chamada.
 * Aqui só mandamos o rank ao servidor e, se falhar, o onError restaura o cache.
 */
/**
 * Editar campos da demanda.
 *
 * Quem pode editar é decidido no backend — responsável, criador ou quem tem
 * `task:edit_any` — e vem resolvido em `can.edit`. A tela não recalcula a
 * regra: as duas divergiriam na primeira mudança.
 *
 * As invalidações são as mesmas do status, e pelo mesmo motivo: o título
 * aparece no quadro, nas listagens, na Home e no próprio detalhe. `['task']`
 * e `['tasks']` são chaves distintas — invalidar a listagem não alcança o
 * detalhe.
 */
export interface EdicaoDemanda {
  title?: string
  description?: string | null
  taskTypeId?: number
  clientId?: string | null
  assigneeId?: string
  deadline?: string
  priority?: string
  observations?: string | null
  /** Substitui a lista inteira. Omitir é diferente de mandar vazio. */
  participantIds?: string[]
}

export function useUpdateTask(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EdicaoDemanda) => api.patch(`/tasks/${taskId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task'] })
      qc.invalidateQueries({ queryKey: qk.home })
    },
  })
}

export function useChangeStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; status: string; beforeId?: string | null; afterId?: string | null }) =>
      api.patch(`/tasks/${v.id}/status`, {
        status: v.status,
        beforeId: v.beforeId ?? null,
        afterId: v.afterId ?? null,
      }),
    /**
     * Toda tela que mostra status precisa ser invalidada aqui.
     *
     * A invalidação do React Query casa por PREFIXO, e é aí que mora a
     * armadilha: `['tasks']` e `['task', id]` são chaves diferentes, porque
     * 'tasks' e 'task' são strings distintas. Invalidar a listagem não
     * alcançava o detalhe.
     *
     * Era o que fazia o seletor de status da tela de detalhe parecer quebrado:
     * a API gravava a mudança, a tela nunca rebuscava, e o status só aparecia
     * depois de recarregar. `['task']` cobre o detalhe e também os comentários,
     * o histórico e a origem, que são `['task', id, ...]`.
     */
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['metrics'] })
      qc.invalidateQueries({ queryKey: qk.notifications })
      qc.invalidateQueries({ queryKey: qk.home })
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task'] })
    },
  })
}

export function useReorderTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; beforeId?: string | null; afterId?: string | null }) =>
      api.patch(`/tasks/${v.id}/reorder`, { beforeId: v.beforeId ?? null, afterId: v.afterId ?? null }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['board'] }),
  })
}

/**
 * Assumir e devolver invalidam TUDO o que lista demanda.
 *
 * As duas mexem em quem é o dono, e é o dado do qual todo painel depende: a
 * demanda sai da fila da função e entra no "Eu" de alguém, ou o contrário.
 * Invalidar menos deixaria a mesma demanda visível nos dois lugares até o
 * próximo recarregamento — e duas pessoas achando que ela é delas é
 * exatamente o que a fila existe para evitar.
 *
 * Sem atualização otimista de propósito: quem clica precisa saber se PEGOU
 * mesmo. Com duas designers clicando junto, o servidor recusa a segunda com
 * `ja_assumida`, e adiantar a resposta na tela mostraria a demanda como sua
 * por um instante antes de tomá-la de volta.
 */
function useMudancaDeDono(acao: 'claim' | 'release') {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/tasks/${id}/${acao}`, {}),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['metrics'] })
      qc.invalidateQueries({ queryKey: qk.notifications })
      qc.invalidateQueries({ queryKey: qk.home })
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task'] })
    },
  })
}

export const useClaimTask = () => useMudancaDeDono('claim')
export const useReleaseTask = () => useMudancaDeDono('release')


/* =============================================================================
 * ETIQUETAS E CHECKLIST
 * ========================================================================== */

export function useLabels() {
  return useQuery({
    queryKey: qk.labels,
    queryFn: () => api.get<LabelRef[]>('/labels'),
    // A lista de etiquetas muda pouco e é lida em toda tela que mostra
    // demanda. Cinco minutos evitam uma requisição por navegação.
    staleTime: 5 * 60_000,
  })
}

export function useCreateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { name: string; color: string }) => api.post<LabelRef>('/labels', v),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.labels }),
  })
}

export function useUpdateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; name?: string; color?: string }) =>
      api.patch<LabelRef>(`/labels/${v.id}`, { name: v.name, color: v.color }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.labels })
      // A etiqueta aparece dentro das demandas: renomear ou recolorir precisa
      // alcançar todo lugar que a desenha.
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['task'] })
      qc.invalidateQueries({ queryKey: qk.home })
    },
  })
}

export function useDeleteLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<{ demandasAfetadas: number }>(`/labels/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.labels })
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: ['task'] })
      qc.invalidateQueries({ queryKey: qk.home })
    },
  })
}

/** Substitui o conjunto inteiro de etiquetas da demanda. */
export function useSetTaskLabels(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (labelIds: string[]) =>
      api.put<LabelRef[]>(`/tasks/${taskId}/labels`, { labelIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task'] })
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: qk.home })
    },
  })
}

/**
 * `aoVivo`: consulta de novo a cada 5s enquanto a aba está visível. É o
 * cronograma que pede: a equipe inteira mexe na mesma lista, e o que uma
 * pessoa marcou ou revisou precisa aparecer para as outras sem recarregar.
 * O checklist comum não precisa: é de uma pessoa só.
 */
export function useChecklist(taskId: string, opcoes: { aoVivo?: boolean } = {}) {
  return useQuery({
    queryKey: qk.taskChecklist(taskId),
    queryFn: () => api.get<ChecklistItem[]>(`/tasks/${taskId}/checklist`),
    enabled: !!taskId,
    refetchInterval: opcoes.aoVivo
      ? (query) => (query.state.status === 'error' ? 60_000 : INTERVALO_PECAS)
      : false,
  })
}

/**
 * As três escritas devolvem a lista inteira e a gravam direto no cache.
 *
 * `setQueryData` em vez de só invalidar: marcar um item é a ação mais repetida
 * do bloco, e um ciclo de rebusca a cada clique faria a lista piscar. O
 * `invalidate` do board segue, porque lá o que muda é a contagem no card.
 */
function useChecklistMutation(taskId: string) {
  const qc = useQueryClient()
  return (fn: (v: any) => Promise<ChecklistItem[]>) => ({
    mutationFn: fn,
    /**
     * Cancela a consulta em voo antes de escrever. Com o polling de 5s do
     * cronograma, uma resposta pedida ANTES do clique podia chegar DEPOIS da
     * gravação e devolver a lista velha por alguns segundos — o check que
     * "desmarca sozinho". Cancelar fecha essa janela.
     */
    onMutate: () => qc.cancelQueries({ queryKey: qk.taskChecklist(taskId) }),
    onSuccess: (itens: ChecklistItem[]) => {
      qc.setQueryData(qk.taskChecklist(taskId), itens)
      qc.invalidateQueries({ queryKey: ['board'] })
      qc.invalidateQueries({ queryKey: qk.home })
      // Dar uma peça a alguém põe a pessoa entre os participantes, que o
      // detalhe mostra. `exact` para não rebuscar o próprio checklist, que
      // acabou de ser gravado acima.
      qc.invalidateQueries({ queryKey: qk.task(taskId), exact: true })
    },
  })
}

export function useAddChecklistItem(taskId: string) {
  const base = useChecklistMutation(taskId)
  return useMutation(
    base((item: CreateChecklistItemInput) =>
      api.post<ChecklistItem[]>(`/tasks/${taskId}/checklist`, item),
    ),
  )
}

export function useUpdateChecklistItem(taskId: string) {
  const base = useChecklistMutation(taskId)
  return useMutation(
    base(({ itemId, ...campos }: { itemId: string } & UpdateChecklistItemInput) =>
      api.patch<ChecklistItem[]>(`/tasks/${taskId}/checklist/${itemId}`, campos),
    ),
  )
}

export function useDeleteChecklistItem(taskId: string) {
  const base = useChecklistMutation(taskId)
  return useMutation(
    base((itemId: string) => api.delete<ChecklistItem[]>(`/tasks/${taskId}/checklist/${itemId}`)),
  )
}

/**
 * Aprovar ou reprovar uma peça em revisão. Além do checklist, invalida as
 * notificações: o aviso "revise" desta peça some do canto na mesma hora.
 */
export function useReviewChecklistItem(taskId: string) {
  const qc = useQueryClient()
  const base = useChecklistMutation(taskId)
  const cfg = base(({ itemId, ...v }: { itemId: string; approved: boolean; note?: string }) =>
    api.post<ChecklistItem[]>(`/tasks/${taskId}/checklist/${itemId}/review`, v),
  )
  return useMutation({
    ...cfg,
    onSuccess: (itens: ChecklistItem[]) => {
      cfg.onSuccess(itens)
      qc.invalidateQueries({ queryKey: qk.notifications })
    },
  })
}

/* -------------------------------------------------------------- acessos do cliente */

/**
 * Os acessos das contas do cliente.
 *
 * A senha NÃO vem aqui — a API devolve `temSenha` e revelar é um pedido
 * próprio, por item, registrado na auditoria. Trazê-la na listagem a poria no
 * cache do navegador de todo mundo que abriu a tela do cliente.
 */
export function useAcessos(clientId: string) {
  return useQuery({
    queryKey: ['acessos', clientId],
    queryFn: () => api.get<{ cofreDisponivel: boolean; acessos: any[] }>(`/clients/${clientId}/acessos`),
  })
}

export function useSalvarAcesso(clientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id?: string; data: unknown }) =>
      v.id
        ? api.patch(`/clients/${clientId}/acessos/${v.id}`, v.data)
        : api.post(`/clients/${clientId}/acessos`, v.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['acessos', clientId] }),
  })
}

export function useApagarAcesso(clientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${clientId}/acessos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['acessos', clientId] }),
  })
}

/**
 * As funções ADICIONAIS de uma pessoa.
 *
 * Invalida a equipe E a lista de atribuíveis: quem ganha uma função passa a
 * aparecer no grupo dela no formulário de demanda, e sem esta segunda
 * invalidação o seletor continuaria mostrando o arranjo antigo até alguém
 * recarregar a página.
 */
export function useSetUserRoles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { id: string; roleIds: number[] }) =>
      api.put(`/users/${v.id}/roles`, { roleIds: v.roleIds }),
    onSuccess: () => {
      // Prefixo: `qk.team` é função (com/sem inativos) e as duas precisam cair.
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: qk.assignable })
      // A própria pessoa pode ser quem mudou: a sessão traz as funções.
      qc.invalidateQueries({ queryKey: qk.me })
    },
  })
}
