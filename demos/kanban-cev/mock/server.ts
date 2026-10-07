/**
 * A API da réplica, em memória.
 *
 * O original tem uma API Hono com Postgres por trás; o front fala com ela por
 * `/api/...`. Aqui `responder(método, caminho, corpo)` atende as mesmas rotas
 * e devolve as mesmas formas de resposta (os tipos de packages/shared), só
 * que lendo e gravando nos arrays de mock/data.ts. Nada sai do navegador e
 * recarregar a página volta aos dados de exemplo.
 *
 * As regras de negócio que a tela deixa ver estão aqui de forma simplificada:
 * atraso calculado, fila por função, assumir e devolver, ordem manual do
 * kanban, checklist com revisão de peça, recorrência que gera demanda.
 */
import {
  describeRrule,
  describeSchedule,
  parseRrule,
  type ChecklistItem,
  type SessionUser,
  type TaskDetail,
  type TaskListItem,
  type UserRef,
} from '@/demos/kanban-cev/shared'
import { urlLocal } from '@/demos/kanban-cev/lib/upload'
import {
  ACTIVITY,
  ATTACHMENTS,
  CHECKLIST,
  CLIENTS,
  COMMENTS,
  DELEGACAO,
  EVENTS,
  FERIADOS,
  LABELS,
  ME_ID,
  NOTIFICATIONS,
  ORDEM,
  RECURRENCES,
  ROLES,
  STATUSES,
  TASKS,
  TASK_TYPES,
  USERS,
  type DbChecklistItem,
  type DbClient,
  type DbTask,
} from './data'

interface Resposta {
  status: number
  body: unknown
}

class Falha extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
  }
}

/** Sessão da aba: "Sair" desliga, qualquer login religa. */
let logado = true
let seq = 1000
const novoId = (p: string) => `${p}-${(++seq).toString(36)}`
const agora = () => new Date().toISOString()

/* ================================================================== leituras */

const TERMINAIS = STATUSES.filter((s) => s.isTerminal).map((s) => s.slug)
const user = (id: string) => USERS.find((u) => u.id === id)
const role = (id: number) => ROLES.find((r) => r.id === id)
const tipo = (id: number) => TASK_TYPES.find((t) => t.id === id)!
const status = (slug: string) => STATUSES.find((s) => s.slug === slug)

function userRef(id: string | null): UserRef | null {
  const u = id ? user(id) : null
  if (!u) return null
  return { id: u.id, name: u.name, avatarUrl: u.avatarUrl, roleDisplayName: role(u.roleId)?.displayName ?? '' }
}

const funcoesDe = (id: string) => {
  const u = user(id)
  return u ? [u.roleId, ...u.extraRoleIds] : []
}

function sessao(): SessionUser {
  const u = user(ME_ID)!
  const r = role(u.roleId)!
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    birthday: u.birthday,
    fundoUrl: fundo.url,
    fundoVeu: fundo.veu,
    fundoPosX: fundo.posX,
    fundoPosY: fundo.posY,
    somRevisar: sons.revisar,
    somAjustar: sons.ajustar,
    isAdmin: u.isAdmin,
    role: { id: r.id, slug: r.slug, displayName: r.displayName },
    roleIds: funcoesDe(u.id),
    permissions: r.permissionKeys as SessionUser['permissions'],
    canAssignToRoleIds: ROLES.filter((x) => x.isActive).map((x) => x.id),
  }
}

const fundo: { url: string | null; veu: number; posX: number; posY: number } = {
  url: null,
  veu: 60,
  posX: 50,
  posY: 50,
}
const sons: { revisar: SessionUser['somRevisar']; ajustar: SessionUser['somAjustar'] } = {
  revisar: 'notificacao',
  ajustar: 'ta-maluco',
}

const vivas = () => TASKS
const atrasada = (t: DbTask) =>
  new Date(t.deadline).getTime() < Date.now() && !t.completedAt && !TERMINAIS.includes(t.status)

function listItem(t: DbTask): TaskListItem {
  const tt = tipo(t.taskTypeId)
  const cl = t.clientId ? CLIENTS.find((c) => c.id === t.clientId) : null
  const fila = t.queueRoleId ? role(t.queueRoleId) : null
  const itens = CHECKLIST.filter((i) => i.taskId === t.id)
  return {
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    deadline: t.deadline,
    rank: String(ORDEM.indexOf(t.id)).padStart(6, '0'),
    isOverdue: atrasada(t),
    commentCount: COMMENTS.filter((c) => c.taskId === t.id).length,
    attachmentCount: ATTACHMENTS.filter((a) => a.taskId === t.id).length,
    client: cl ? { id: cl.id, name: cl.name, logoUrl: cl.logoUrl } : null,
    taskType: { id: tt.id, name: tt.slug, displayName: tt.displayName, color: tt.color },
    assignee: userRef(t.assigneeId),
    queue: fila ? { id: fila.id, displayName: fila.displayName } : null,
    createdBy: userRef(t.createdById)!,
    createdAt: t.createdAt,
    completedAt: t.completedAt,
    recurrenceId: t.recurrenceId,
    canChangeStatus: true,
    labels: LABELS.filter((l) => t.labelIds.includes(l.id)),
    checklist: itens.length ? { done: itens.filter((i) => i.isDone).length, total: itens.length } : null,
  }
}

function detail(t: DbTask): TaskDetail {
  const minhaFila = !t.assigneeId && !!t.queueRoleId && funcoesDe(ME_ID).includes(t.queueRoleId)
  return {
    ...listItem(t),
    description: t.description,
    observations: t.observations,
    startedAt: t.startedAt,
    participants: t.participantIds.map((id) => userRef(id)!).filter(Boolean),
    can: {
      edit: true,
      changeStatus: true,
      delete: true,
      claim: minhaFila,
      release: !!t.assigneeId,
      contribute: true,
    },
  }
}

const ordenadas = (xs: DbTask[]) => [...xs].sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id))

function noEscopo(t: DbTask, scope: string): boolean {
  switch (scope) {
    case 'created_by_me':
      return t.createdById === ME_ID
    case 'team':
      return true
    case 'role_queue':
      return !t.assigneeId && !!t.queueRoleId && funcoesDe(ME_ID).includes(t.queueRoleId)
    case 'me':
    default:
      return t.assigneeId === ME_ID || t.participantIds.includes(ME_ID)
  }
}

function board(scope: string) {
  const doEscopo = ordenadas(vivas().filter((t) => noEscopo(t, scope)))
  return {
    columns: STATUSES.map((s) => ({
      slug: s.slug,
      displayName: s.displayName,
      color: s.color,
      isTerminal: s.isTerminal,
      tasks: doEscopo.filter((t) => t.status === s.slug).map(listItem),
    })),
  }
}

function listTasks(q: URLSearchParams) {
  let xs = vivas().filter((t) => noEscopo(t, q.get('scope') ?? 'me'))
  const clientId = q.get('clientId')
  if (clientId) xs = xs.filter((t) => t.clientId === clientId)
  const pessoa = q.get('personId')
  if (pessoa) {
    xs = xs.filter(
      (t) =>
        t.assigneeId === pessoa ||
        t.participantIds.includes(pessoa) ||
        CHECKLIST.some((i) => i.taskId === t.id && i.assigneeId === pessoa),
    )
  }
  const tt = q.get('taskTypeId')
  if (tt) xs = xs.filter((t) => t.taskTypeId === Number(tt))
  const labels = q.get('labelIds')
  if (labels) {
    const todas = labels.split(',')
    xs = xs.filter((t) => todas.every((l) => t.labelIds.includes(l)))
  }
  const busca = q.get('search')?.trim().toLowerCase()
  if (busca) {
    xs = xs.filter((t) => {
      const cl = CLIENTS.find((c) => c.id === t.clientId)?.name ?? ''
      return [t.title, t.description ?? '', tipo(t.taskTypeId).displayName, cl].some((s) =>
        s.toLowerCase().includes(busca),
      )
    })
  }
  const orderBy = q.get('orderBy') ?? 'deadline'
  xs = [...xs].sort((a, b) =>
    orderBy === 'created_at' ? b.createdAt.localeCompare(a.createdAt) : a.deadline.localeCompare(b.deadline),
  )
  const limit = Number(q.get('limit') ?? 50)
  const offset = Number(q.get('offset') ?? 0)
  return { items: xs.slice(offset, offset + limit).map(listItem), total: xs.length, limit, offset }
}

function checklistDe(taskId: string): ChecklistItem[] {
  return CHECKLIST.filter((i) => i.taskId === taskId)
    .sort((a, b) => a.position - b.position)
    .map((i) => {
      const tt = i.taskTypeId ? tipo(i.taskTypeId) : null
      return {
        id: i.id,
        content: i.content,
        isDone: i.isDone,
        position: i.position,
        doneBy: userRef(i.doneById),
        doneAt: i.doneAt,
        startedAt: i.startedAt,
        reviewStatus: i.reviewStatus,
        reviewNote: i.reviewNote,
        reviewedBy: userRef(i.reviewedById),
        reviewedAt: i.reviewedAt,
        description: i.description,
        assignee: userRef(i.assigneeId),
        taskType: tt ? { id: tt.id, name: tt.slug, displayName: tt.displayName, color: tt.color } : null,
        dueAt: i.dueAt,
        delivery: i.delivery,
      }
    })
}

/* ================================================================== painéis */

function periodo(p: string | null) {
  const dias = p === 'week' ? 7 : p === 'quarter' ? 90 : p === 'year' ? 365 : 30
  return Date.now() - dias * 86_400_000
}

function metricas(xs: DbTask[]) {
  const concluidas = xs.filter((t) => t.completedAt)
  const noPrazo = concluidas.filter((t) => t.completedAt! <= t.deadline).length
  const horas = concluidas
    .filter((t) => t.startedAt)
    .map((t) => (new Date(t.completedAt!).getTime() - new Date(t.startedAt!).getTime()) / 3_600_000)
  return {
    total: xs.length,
    open: xs.filter((t) => !TERMINAIS.includes(t.status)).length,
    completed: concluidas.length,
    overdue: xs.filter(atrasada).length,
    completedOnTimeRate: concluidas.length ? Math.round((noPrazo / concluidas.length) * 100) : null,
    avgCompletionHours: horas.length ? Math.round(horas.reduce((a, b) => a + b, 0) / horas.length) : null,
  }
}

/** Abertas contam sempre; encerradas só se caíram no período. */
const doPeriodo = (t: DbTask, desde: number) =>
  !TERMINAIS.includes(t.status) || new Date(t.completedAt ?? t.deadline).getTime() >= desde

function adminOverview(p: string | null) {
  const desde = periodo(p)
  const xs = vivas().filter((t) => doPeriodo(t, desde))
  const m = metricas(xs)
  const semanas = new Map<string, { criadas: number; concluidas: number }>()
  const segunda = (iso: string) => {
    const d = new Date(iso)
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const z = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
  }
  for (let d = desde; d <= Date.now(); d += 7 * 86_400_000) {
    semanas.set(segunda(new Date(d).toISOString()), { criadas: 0, concluidas: 0 })
  }
  for (const t of vivas()) {
    const c = semanas.get(segunda(t.createdAt))
    if (c && new Date(t.createdAt).getTime() >= desde) c.criadas++
    const f = t.completedAt ? semanas.get(segunda(t.completedAt)) : null
    if (f && new Date(t.completedAt!).getTime() >= desde) f.concluidas++
  }
  return {
    totals: {
      total: m.total,
      abertas: m.open,
      concluidas: m.completed,
      atrasadas: m.overdue,
      completedOnTimeRate: m.completedOnTimeRate,
    },
    byStatus: STATUSES.map((s) => ({
      status: s.slug,
      displayName: s.displayName,
      color: s.color,
      count: xs.filter((t) => t.status === s.slug).length,
    })).filter((s) => s.count > 0),
    workload: USERS.filter((u) => u.isActive)
      .map((u) => {
        const abertas = vivas().filter((t) => t.assigneeId === u.id && !TERMINAIS.includes(t.status))
        return { userId: u.id, name: u.name, avatarUrl: u.avatarUrl, abertas: abertas.length, atrasadas: abertas.filter(atrasada).length }
      })
      .sort((a, b) => b.abertas - a.abertas),
    byWeek: [...semanas.entries()].map(([semana, v]) => ({ semana, ...v })),
  }
}

function usersPerformance(p: string | null) {
  const desde = periodo(p)
  return {
    rows: USERS.filter((u) => u.isActive)
      .map((u) => ({
        userId: u.id,
        name: u.name,
        avatarUrl: u.avatarUrl,
        roleDisplayName: role(u.roleId)?.displayName,
        ...metricas(vivas().filter((t) => t.assigneeId === u.id && doPeriodo(t, desde))),
      }))
      .sort((a, b) => b.total - a.total),
  }
}

const chaveDia = (d: Date) => new Intl.DateTimeFormat('en-CA').format(d)

function checklistsDoDia(diaPedido: string | null) {
  const hoje = chaveDia(new Date())
  const dia = diaPedido ?? hoje
  const fimDoDia = new Date(`${dia}T23:59:59`).getTime()
  const profissionais = USERS.filter((u) => u.isActive)
    .map((u) => {
      const demandas = vivas()
        .filter((t) => t.assigneeId === u.id || CHECKLIST.some((i) => i.taskId === t.id && i.assigneeId === u.id))
        .map((t) => {
          const itens = CHECKLIST.filter(
            (i) => i.taskId === t.id && (i.assigneeId ? i.assigneeId === u.id : t.assigneeId === u.id),
          )
          const feitos = itens
            .filter((i) => i.isDone && i.doneAt && chaveDia(new Date(i.doneAt)) === dia)
            .map((i) => ({ itemId: i.id, content: i.content, doneAt: i.doneAt! }))
          const pendentes =
            TERMINAIS.includes(t.status) || dia !== hoje
              ? []
              : itens.filter((i) => !i.isDone).map((i) => ({ itemId: i.id, content: i.content }))
          const vencida = new Date(t.deadline).getTime() < fimDoDia && !t.completedAt
          return {
            taskId: t.id,
            taskTitle: t.title,
            clientName: CLIENTS.find((c) => c.id === t.clientId)?.name ?? null,
            deadline: t.deadline,
            atrasada: atrasada(t),
            vencida,
            feitos,
            pendentes,
          }
        })
        .filter((d) => d.feitos.length || d.pendentes.length)
      return {
        id: u.id,
        nome: u.name,
        avatarUrl: u.avatarUrl,
        funcao: role(u.roleId)?.displayName ?? '',
        demandas,
        totalFeitos: demandas.reduce((n, d) => n + d.feitos.length, 0),
        totalAtrasados: demandas.filter((d) => d.vencida).reduce((n, d) => n + d.pendentes.length, 0),
        totalEmAndamento: demandas.filter((d) => !d.vencida).reduce((n, d) => n + d.pendentes.length, 0),
      }
    })
    .filter((p) => p.demandas.length)
    .sort((a, b) => b.totalFeitos - a.totalFeitos)

  const externas = EVENTS.filter(
    (e) => ['captacao', 'assessoria_imprensa', 'evento'].includes(e.eventType) && chaveDia(new Date(e.startAt)) === dia,
  ).map((e) => ({
    id: e.id,
    titulo: e.title,
    tipo: e.eventType,
    local: e.location,
    inicioPrevisto: e.startAt,
    fimPrevisto: e.endAt,
    inicio: null,
    fim: null,
    minutos: null,
    pessoas: e.attendeeIds.map((id) => user(id)!).map((p) => ({ id: p.id, nome: p.name, avatarUrl: p.avatarUrl })),
  }))

  return { dia, hoje, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, profissionais, externas }
}

function calendario(q: URLSearchParams) {
  const de = new Date(q.get('from')!).getTime()
  const ate = new Date(q.get('to')!).getTime()
  const scope = q.get('scope') ?? 'me'
  const dentro = (iso: string) => {
    const x = new Date(iso).getTime()
    return x >= de && x <= ate
  }
  const items: unknown[] = []

  for (const t of vivas()) {
    if (TERMINAIS.includes(t.status) || !dentro(t.deadline)) continue
    if (scope === 'me' && !noEscopo(t, 'me')) continue
    items.push({
      kind: 'demanda',
      id: `d-${t.id}`,
      title: t.title,
      startAt: t.deadline,
      endAt: t.deadline,
      allDay: false,
      taskId: t.id,
      status: t.status,
      priority: t.priority,
      isOverdue: atrasada(t),
      clientName: CLIENTS.find((c) => c.id === t.clientId)?.name ?? null,
    })
  }
  for (const e of EVENTS) {
    if (!dentro(e.startAt)) continue
    if (scope === 'me' && !e.attendeeIds.includes(ME_ID)) continue
    items.push({
      kind: 'evento',
      id: e.id,
      title: e.title,
      startAt: e.startAt,
      endAt: e.endAt,
      allDay: e.allDay,
      eventType: e.eventType,
      clientName: CLIENTS.find((c) => c.id === e.clientId)?.name ?? null,
    })
  }
  const anos = new Set([new Date(de).getFullYear(), new Date(ate).getFullYear()])
  for (const ano of anos) {
    for (const [m, d, nome] of FERIADOS) {
      const iso = new Date(ano, m - 1, d, 12).toISOString()
      if (dentro(iso)) items.push({ kind: 'feriado', id: `f-${ano}-${m}-${d}`, title: nome, startAt: iso, endAt: iso, allDay: true })
    }
    for (const u of USERS) {
      if (!u.isActive || !u.birthday) continue
      const iso = new Date(ano, Number(u.birthday.slice(5, 7)) - 1, Number(u.birthday.slice(8, 10)), 12).toISOString()
      if (dentro(iso)) items.push({ kind: 'aniversario', id: `b-${u.id}-${ano}`, title: `Aniversário de ${u.name.split(' ')[0]}`, startAt: iso, endAt: iso, allDay: true })
    }
    for (const c of CLIENTS) {
      if (!c.anniversary || c.status === 'encerrado') continue
      const iso = new Date(ano, Number(c.anniversary.slice(5, 7)) - 1, Number(c.anniversary.slice(8, 10)), 12).toISOString()
      if (dentro(iso)) items.push({ kind: 'aniversario', id: `bc-${c.id}-${ano}`, title: `Aniversário de ${c.name}`, startAt: iso, endAt: iso, allDay: true, clientName: c.name })
    }
  }
  items.sort((a: any, b: any) => a.startAt.localeCompare(b.startAt))
  return { items }
}

function home() {
  const hoje = new Date()
  const fimDeHoje = new Date(hoje)
  fimDeHoje.setHours(23, 59, 59, 999)
  const inicioDeHoje = new Date(hoje)
  inicioDeHoje.setHours(0, 0, 0, 0)
  const minhas = vivas().filter((t) => noEscopo(t, 'me') && !TERMINAIS.includes(t.status))
  const mes = hoje.getMonth()
  return {
    todayTasks: minhas
      .filter((t) => {
        const d = new Date(t.deadline).getTime()
        return d >= inicioDeHoje.getTime() && d <= fimDeHoje.getTime()
      })
      .map(listItem),
    overdueTasks: minhas.filter(atrasada).map(listItem),
    upcomingEvents: EVENTS.filter((e) => {
      const d = new Date(e.startAt).getTime()
      return d >= Date.now() && d <= Date.now() + 7 * 86_400_000
    })
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
      .map((e) => ({
        id: e.id,
        title: e.title,
        startAt: e.startAt,
        eventType: e.eventType,
        clientName: CLIENTS.find((c) => c.id === e.clientId)?.name ?? null,
      })),
    birthdays: {
      people: USERS.filter((u) => u.isActive && u.birthday && Number(u.birthday.slice(5, 7)) - 1 === mes)
        .map((u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl, day: Number(u.birthday!.slice(8, 10)) }))
        .sort((a, b) => a.day - b.day),
      clients: CLIENTS.filter((c) => c.status !== 'encerrado' && c.anniversary && Number(c.anniversary.slice(5, 7)) - 1 === mes)
        .map((c) => ({ id: c.id, name: c.name, day: Number(c.anniversary!.slice(8, 10)) }))
        .sort((a, b) => a.day - b.day),
    },
  }
}

/* ================================================================== recorrência */

const DIAS_RRULE = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

/** Os próximos prazos de uma regra, a partir de hoje. Só o que as telas usam. */
function proximosPrazos(rrule: string, deadlineTime: string, n: number): string[] {
  let p
  try {
    p = parseRrule(rrule)
  } catch {
    return []
  }
  const [h, m] = deadlineTime.split(':').map(Number)
  const saida: string[] = []
  const cursor = new Date()
  cursor.setHours(h ?? 18, m ?? 0, 0, 0)
  const inicio = new Date(cursor)
  for (let i = 0; i < 800 && saida.length < n; i++) {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    if (d.getTime() < Date.now()) continue
    const semanas = Math.floor(i / 7)
    let ok = false
    if (p.freq === 'DAILY') ok = i % p.interval === 0
    if (p.freq === 'WEEKLY') {
      const dias = p.byDay.length ? p.byDay.map((x) => x.slice(-2)) : [DIAS_RRULE[inicio.getDay()]!]
      ok = dias.includes(DIAS_RRULE[d.getDay()]!) && semanas % p.interval === 0
    }
    if (p.freq === 'MONTHLY') ok = (p.byMonthDay.length ? p.byMonthDay : [inicio.getDate()]).includes(d.getDate())
    if (p.freq === 'YEARLY') ok = d.getDate() === inicio.getDate() && d.getMonth() === inicio.getMonth()
    if (ok) saida.push(d.toISOString())
  }
  return saida
}

function recorrencia(r: (typeof RECURRENCES)[number]) {
  const prazos = proximosPrazos(r.rrule, r.deadlineTime, 4)
  const proximo = prazos[0] ? new Date(prazos[0]) : new Date()
  proximo.setDate(proximo.getDate() - r.leadTimeDays)
  proximo.setHours(0, 0, 0, 0)
  return {
    ...r,
    description: describeRrule(r.rrule),
    schedule: describeSchedule(r.leadTimeDays, r.deadlineTime),
    nextRunAt: proximo.toISOString(),
    nextDeadlines: prazos,
  }
}

/* ================================================================== escritas */

function log(taskId: string, action: string, oldValue: unknown = null, newValue: unknown = null) {
  ACTIVITY.push({ id: novoId('ac'), taskId, userId: ME_ID, action, oldValue, newValue, createdAt: agora() })
}

/** Põe `id` entre os vizinhos que o kanban mandou, na ordem global. */
function reposicionar(id: string, beforeId?: string | null, afterId?: string | null) {
  const i = ORDEM.indexOf(id)
  if (i >= 0) ORDEM.splice(i, 1)
  if (beforeId && ORDEM.includes(beforeId)) ORDEM.splice(ORDEM.indexOf(beforeId) + 1, 0, id)
  else if (afterId && ORDEM.includes(afterId)) ORDEM.splice(ORDEM.indexOf(afterId), 0, id)
  else ORDEM.push(id)
}

function mudarStatus(t: DbTask, novo: string) {
  if (!status(novo)) throw new Falha(400, 'status_invalido', 'Status inválido')
  if (t.status === novo) return
  const de = status(t.status)!.displayName
  t.status = novo
  if (novo === 'concluido') t.completedAt = agora()
  else if (TERMINAIS.includes(novo)) t.completedAt = null
  else t.completedAt = null
  if (novo === 'em_andamento' && !t.startedAt) t.startedAt = agora()
  log(t.id, 'status_alterado', { status: de }, { status: status(novo)!.displayName })
}

function criarDemanda(b: any): DbTask {
  const t: DbTask = {
    id: novoId('t'),
    title: String(b.title),
    description: b.description ?? null,
    observations: b.observations ?? null,
    status: 'nao_iniciado',
    priority: b.priority ?? 'media',
    deadline: b.deadline,
    taskTypeId: Number(b.taskTypeId),
    clientId: b.clientId ?? null,
    assigneeId: b.assigneeId ?? null,
    queueRoleId: b.queueRoleId ?? null,
    createdById: ME_ID,
    createdAt: agora(),
    completedAt: null,
    startedAt: null,
    recurrenceId: b.recurrenceId ?? null,
    participantIds: b.participantIds ?? [],
    labelIds: b.labelIds ?? [],
  }
  TASKS.push(t)
  ORDEM.unshift(t.id)
  log(t.id, 'criada')
  return t
}

function itemNovo(taskId: string, b: any): DbChecklistItem {
  const max = Math.max(0, ...CHECKLIST.filter((i) => i.taskId === taskId).map((i) => i.position))
  const it: DbChecklistItem = {
    id: novoId('ci'),
    taskId,
    content: String(b.content ?? '').trim(),
    isDone: false,
    position: max + 1,
    doneById: null,
    doneAt: null,
    startedAt: null,
    reviewStatus: null,
    reviewNote: null,
    reviewedById: null,
    reviewedAt: null,
    description: b.description ?? null,
    assigneeId: b.assigneeId ?? null,
    taskTypeId: b.taskTypeId ?? null,
    dueAt: b.dueAt ?? null,
    delivery: b.delivery ?? null,
  }
  if (!it.content) throw new Falha(400, 'validation_error', 'Escreva o item')
  CHECKLIST.push(it)
  // Dar uma peça a alguém põe a pessoa entre os participantes.
  const t = TASKS.find((x) => x.id === taskId)
  if (t && it.assigneeId && it.assigneeId !== t.assigneeId && !t.participantIds.includes(it.assigneeId)) {
    t.participantIds.push(it.assigneeId)
  }
  return it
}

function clienteResumo(c: DbClient) {
  const xs = vivas().filter((t) => t.clientId === c.id)
  return {
    id: c.id,
    name: c.name,
    segment: c.segment,
    logoUrl: c.logoUrl,
    status: c.status,
    anniversary: c.anniversary,
    socialMediaIds: c.socialMediaIds,
    totalTasks: xs.length,
    openTasks: xs.filter((t) => !TERMINAIS.includes(t.status)).length,
  }
}

function clienteCompleto(c: DbClient) {
  const { acessos: _, ...resto } = c
  return { ...resto, ...clienteResumo(c), sections: c.sections }
}

function membro(u: (typeof USERS)[number]) {
  const r = role(u.roleId)!
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    birthday: u.birthday,
    isActive: u.isActive,
    isAdmin: u.isAdmin,
    roleId: u.roleId,
    roleSlug: r.slug,
    roleDisplayName: r.displayName,
    extraRoleIds: u.extraRoleIds,
  }
}

function notificacoes() {
  const items = [...NOTIFICATIONS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((n) => {
      const t = n.taskId ? TASKS.find((x) => x.id === n.taskId) : null
      return {
        id: n.id,
        type: n.type,
        taskId: n.taskId,
        taskTitle: t?.title ?? null,
        actor: userRef(n.actorId),
        payload: n.payload,
        readAt: n.readAt,
        createdAt: n.createdAt,
      }
    })
  return { unreadCount: items.filter((n) => !n.readAt).length, items }
}

/* ================================================================== rotas */

type Handler = (p: Record<string, string>, q: URLSearchParams, b: any) => unknown

const rotas: [string, string, Handler][] = []
const rota = (metodo: string, caminho: string, h: Handler) => rotas.push([metodo, caminho, h])

function tarefa(id: string): DbTask {
  const t = TASKS.find((x) => x.id === id)
  if (!t) throw new Falha(404, 'not_found', 'Demanda não encontrada')
  return t
}

function cliente(id: string): DbClient {
  const c = CLIENTS.find((x) => x.id === id)
  if (!c) throw new Falha(404, 'not_found', 'Cliente não encontrado')
  return c
}

/* ---------- sessão */
rota('GET', '/auth/me', () => {
  if (!logado) throw new Falha(401, 'unauthorized', 'Sessão expirada')
  return sessao()
})
rota('POST', '/auth/login', (_, __, b) => {
  if (!b?.email || !b?.password) throw new Falha(400, 'validation_error', 'Informe e-mail e senha')
  logado = true
  return { user: sessao() }
})
rota('POST', '/auth/logout', () => {
  logado = false
  return { ok: true }
})
rota('POST', '/auth/change-password', (_, __, b) => {
  if (!b?.currentPassword) throw new Falha(400, 'senha_incorreta', 'Senha atual incorreta')
  logado = false
  return { ok: true }
})

/* ---------- metadados */
rota('GET', '/meta/statuses', () => STATUSES)
rota('GET', '/meta/task-types', () =>
  TASK_TYPES.filter((t) => t.isActive).map((t) => ({ ...t, name: t.slug })),
)
rota('GET', '/meta/task-types/all', () => TASK_TYPES)
rota('POST', '/meta/task-types', (_, __, b) => {
  const id = Math.max(...TASK_TYPES.map((t) => t.id)) + 1
  TASK_TYPES.push({
    id,
    slug: String(b.displayName).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\W+/g, '_'),
    displayName: b.displayName,
    color: b.color ?? '#6366f1',
    defaultRoleId: b.defaultRoleId ?? null,
    isActive: true,
  })
  return { id }
})
rota('PATCH', '/meta/task-types/:id', (p, __, b) => {
  const t = TASK_TYPES.find((x) => x.id === Number(p.id))
  if (t) Object.assign(t, b)
  return t
})
rota('GET', '/meta/roles/all', () => ROLES)
rota('POST', '/meta/roles', (_, __, b) => {
  const id = Math.max(...ROLES.map((r) => r.id)) + 1
  ROLES.push({
    id,
    slug: `funcao_${id}`,
    displayName: b.displayName,
    isSystem: false,
    isActive: true,
    acessoTotal: !!b.acessoTotal,
    permissionKeys: b.acessoTotal ? ROLES[0]!.permissionKeys : [],
  })
  return { id }
})
rota('PATCH', '/meta/roles/:id', (p, __, b) => {
  const r = role(Number(p.id))
  if (r) Object.assign(r, b)
  return r
})
rota('PUT', '/meta/roles/:id/permissions', (p, __, b) => {
  const r = role(Number(p.id))
  if (r) r.permissionKeys = b.permissionKeys ?? []
  return r
})
rota('GET', '/meta/permissions', () => ({
  permissions: ROLES[0]!.permissionKeys.map((key) => ({ key })),
}))
rota('GET', '/meta/delegation-matrix', () => {
  const roles = ROLES.filter((r) => r.isActive).map((r) => ({ id: r.id, slug: r.slug, displayName: r.displayName }))
  return {
    roles,
    matrix: roles.map((de) => ({
      fromRoleId: de.id,
      targets: roles.map((para) => ({ toRoleId: para.id, allowed: de.id === para.id || DELEGACAO.has(`${de.id}-${para.id}`) })),
    })),
    canEdit: true,
  }
})
rota('PUT', '/meta/delegation-matrix', (_, __, b) => {
  const chave = `${b.fromRoleId}-${b.toRoleId}`
  if (b.allowed) DELEGACAO.add(chave)
  else DELEGACAO.delete(chave)
  return { ok: true }
})

/* ---------- pessoas */
rota('GET', '/users', (_, q) =>
  USERS.filter((u) => q.get('includeInactive') === 'true' || u.isActive)
    .map(membro)
    .sort((a, b) => a.name.localeCompare(b.name)),
)
rota('GET', '/users/assignable', () =>
  USERS.filter((u) => u.isActive)
    .map((u) => ({ ...membro(u), roleIds: funcoesDe(u.id) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
)
rota('GET', '/users/social-medias', () =>
  USERS.filter((u) => u.isActive && funcoesDe(u.id).includes(6)).map((u) => userRef(u.id)),
)
rota('POST', '/users', (_, __, b) => {
  if (USERS.some((u) => u.email === b.email)) throw new Falha(409, 'email_em_uso', 'Já existe alguém com este e-mail')
  const id = novoId('u')
  USERS.push({
    id,
    name: b.name,
    email: b.email,
    avatarUrl: null,
    birthday: b.birthday ?? null,
    isActive: true,
    isAdmin: !!b.isAdmin,
    roleId: Number(b.roleId),
    extraRoleIds: [],
  })
  return membro(user(id)!)
})
rota('PATCH', '/users/:id', (p, __, b) => {
  const u = user(p.id!)
  if (!u) throw new Falha(404, 'not_found', 'Pessoa não encontrada')
  Object.assign(u, b)
  return membro(u)
})
rota('DELETE', '/users/:id', (p) => {
  const u = user(p.id!)
  if (u) u.isActive = false
  return { ok: true }
})
rota('POST', '/users/:id/password', () => ({ ok: true }))
rota('PUT', '/users/:id/roles', (p, __, b) => {
  const u = user(p.id!)
  if (u) u.extraRoleIds = (b.roleIds ?? []).filter((r: number) => r !== u.roleId)
  return { ok: true }
})
rota('PUT', '/users/:id/sons', (_, __, b) => {
  if (b.somRevisar) sons.revisar = b.somRevisar
  if (b.somAjustar) sons.ajustar = b.somAjustar
  return { ok: true }
})
rota('POST', '/users/:id/fundo/sign', (p) => {
  const chave = `fundo/${p.id}/${++seq}`
  return { uploadUrl: `local:${chave}`, fileKey: chave }
})
rota('PUT', '/users/:id/fundo', (_, __, b) => {
  if (b.fileKey) fundo.url = urlLocal(b.fileKey) ?? fundo.url
  if (b.veu !== undefined) fundo.veu = b.veu
  if (b.posX !== undefined) fundo.posX = b.posX
  if (b.posY !== undefined) fundo.posY = b.posY
  return { fundoUrl: fundo.url }
})
rota('DELETE', '/users/:id/fundo', () => {
  fundo.url = null
  return { ok: true }
})

/* Foto de perfil e logo do cliente: o mesmo fluxo de assinar, enviar e confirmar. */
for (const escopo of ['users', 'clients']) {
  const caminho = escopo === 'users' ? 'avatar' : 'logo'
  rota('POST', `/${escopo}/:id/${caminho}/sign`, (p) => {
    const chave = `${escopo}/${p.id}/${++seq}`
    return { uploadUrl: `local:${chave}`, fileKey: chave }
  })
  rota('PUT', `/${escopo}/:id/${caminho}`, (p, __, b) => {
    const url = urlLocal(b.fileKey)
    if (escopo === 'users') {
      const u = user(p.id!)
      if (u) u.avatarUrl = url
    } else {
      cliente(p.id!).logoUrl = url
    }
    return { url }
  })
  rota('DELETE', `/${escopo}/:id/${caminho}`, (p) => {
    if (escopo === 'users') {
      const u = user(p.id!)
      if (u) u.avatarUrl = null
    } else {
      cliente(p.id!).logoUrl = null
    }
    return { ok: true }
  })
}

/* ---------- demandas */
rota('GET', '/tasks/board', (_, q) => board(q.get('scope') ?? 'me'))
rota('GET', '/tasks', (_, q) => listTasks(q))
rota('POST', '/tasks', (_, __, b) => detail(criarDemanda(b)))
rota('GET', '/tasks/:id', (p) => detail(tarefa(p.id!)))
rota('PATCH', '/tasks/:id', (p, __, b) => {
  const t = tarefa(p.id!)
  if (b.deadline && b.deadline !== t.deadline) log(t.id, 'prazo_alterado')
  if (b.assigneeId && b.assigneeId !== t.assigneeId) log(t.id, 'responsavel_alterado')
  else log(t.id, 'editada')
  for (const k of ['title', 'description', 'taskTypeId', 'clientId', 'assigneeId', 'deadline', 'priority', 'observations', 'participantIds'] as const) {
    if (b[k] !== undefined) (t as any)[k] = b[k]
  }
  return detail(t)
})
rota('DELETE', '/tasks/:id', (p) => {
  const i = TASKS.findIndex((x) => x.id === p.id)
  if (i >= 0) TASKS.splice(i, 1)
  return { ok: true }
})
rota('PATCH', '/tasks/:id/status', (p, __, b) => {
  const t = tarefa(p.id!)
  mudarStatus(t, b.status)
  if (b.beforeId !== undefined || b.afterId !== undefined) reposicionar(t.id, b.beforeId, b.afterId)
  return detail(t)
})
rota('PATCH', '/tasks/:id/reorder', (p, __, b) => {
  reposicionar(tarefa(p.id!).id, b.beforeId, b.afterId)
  return { ok: true }
})
rota('POST', '/tasks/:id/claim', (p) => {
  const t = tarefa(p.id!)
  if (t.assigneeId) throw new Falha(409, 'ja_assumida', 'Outra pessoa assumiu esta demanda antes de você')
  t.assigneeId = ME_ID
  log(t.id, 'assumida')
  return detail(t)
})
rota('POST', '/tasks/:id/release', (p) => {
  const t = tarefa(p.id!)
  t.queueRoleId ??= tipo(t.taskTypeId).defaultRoleId ?? user(ME_ID)!.roleId
  t.assigneeId = null
  log(t.id, 'devolvida_a_fila')
  return detail(t)
})
rota('GET', '/tasks/:id/recurrence', (p) => {
  const t = tarefa(p.id!)
  const r = RECURRENCES.find((x) => x.id === t.recurrenceId)
  if (!r) return null
  const v = recorrencia(r)
  return { id: r.id, description: v.description, schedule: v.schedule, isActive: r.isActive, nextRunAt: v.nextRunAt, deletedAt: null }
})
rota('GET', '/tasks/:id/comments', (p) =>
  COMMENTS.filter((c) => c.taskId === p.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((c) => ({ id: c.id, content: c.content, createdAt: c.createdAt, editado: c.editado, author: userRef(c.authorId) })),
)
rota('POST', '/tasks/:id/comments', (p, __, b) => {
  if (!String(b.content ?? '').trim()) throw new Falha(400, 'validation_error', 'Comentário vazio')
  COMMENTS.push({ id: novoId('cm'), taskId: p.id!, authorId: ME_ID, content: b.content, createdAt: agora(), editado: false })
  return { ok: true }
})
rota('PATCH', '/tasks/:id/comments/:cid', (p, __, b) => {
  const c = COMMENTS.find((x) => x.id === p.cid)
  if (c) {
    c.content = b.content
    c.editado = true
  }
  return { ok: true }
})
rota('GET', '/tasks/:id/activity', (p) =>
  ACTIVITY.filter((a) => a.taskId === p.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((a) => ({ ...a, userName: user(a.userId)?.name ?? 'Sistema', userAvatar: user(a.userId)?.avatarUrl ?? null })),
)
rota('PUT', '/tasks/:id/labels', (p, __, b) => {
  const t = tarefa(p.id!)
  t.labelIds = b.labelIds ?? []
  return LABELS.filter((l) => t.labelIds.includes(l.id))
})

/* ---------- anexos */
rota('GET', '/tasks/:id/attachments', (p) =>
  ATTACHMENTS.filter((a) => a.taskId === p.id).map((a) => ({
    id: a.id,
    fileName: a.fileName,
    mimeType: a.mimeType,
    fileSize: a.fileSize,
    createdAt: a.createdAt,
    checklistItemId: a.checklistItemId,
    previewUrl: a.mimeType.startsWith('image/') ? urlLocal(a.fileKey) : null,
    uploadedBy: userRef(a.uploadedById),
  })),
)
rota('POST', '/tasks/:id/attachments/sign', (p) => {
  const chave = `tasks/${p.id}/${++seq}`
  return { uploadUrl: `local:${chave}`, fileKey: chave }
})
rota('POST', '/tasks/:id/attachments', (p, __, b) => {
  ATTACHMENTS.push({
    id: novoId('at'),
    taskId: p.id!,
    fileKey: b.fileKey,
    fileName: b.fileName,
    mimeType: b.mimeType,
    fileSize: b.fileSize,
    createdAt: agora(),
    checklistItemId: b.checklistItemId ?? null,
    uploadedById: ME_ID,
  })
  return { ok: true }
})
rota('DELETE', '/tasks/:id/attachments/:aid', (p) => {
  const i = ATTACHMENTS.findIndex((a) => a.id === p.aid)
  if (i >= 0) ATTACHMENTS.splice(i, 1)
  return { ok: true }
})
rota('GET', '/tasks/:id/attachments/:aid/download', (p) => {
  const a = ATTACHMENTS.find((x) => x.id === p.aid)
  const url = a ? urlLocal(a.fileKey) : null
  if (!url) throw new Falha(404, 'sem_arquivo', 'Este arquivo é só de exemplo: na réplica não há o que baixar.')
  return { url }
})

/* ---------- checklist */
rota('GET', '/tasks/:id/checklist', (p) => checklistDe(p.id!))
rota('POST', '/tasks/:id/checklist', (p, __, b) => {
  itemNovo(p.id!, b)
  return checklistDe(p.id!)
})
rota('PATCH', '/tasks/:id/checklist/:iid', (p, __, b) => {
  const it = CHECKLIST.find((i) => i.id === p.iid)
  if (!it) throw new Falha(404, 'not_found', 'Item não encontrado')
  const ehCronograma = tarefa(p.id!).taskTypeId === 11
  if (b.isDone !== undefined && b.isDone !== it.isDone) {
    it.isDone = b.isDone
    it.doneById = b.isDone ? ME_ID : null
    it.doneAt = b.isDone ? agora() : null
    it.reviewStatus = b.isDone && ehCronograma ? 'em_revisao' : null
    it.reviewNote = null
  }
  if (b.started !== undefined) it.startedAt = b.started ? (it.startedAt ?? agora()) : null
  for (const k of ['content', 'description', 'assigneeId', 'taskTypeId', 'dueAt', 'delivery'] as const) {
    if (b[k] !== undefined) (it as any)[k] = b[k]
  }
  return checklistDe(p.id!)
})
rota('DELETE', '/tasks/:id/checklist/:iid', (p) => {
  const i = CHECKLIST.findIndex((x) => x.id === p.iid)
  if (i >= 0) CHECKLIST.splice(i, 1)
  return checklistDe(p.id!)
})
rota('POST', '/tasks/:id/checklist/:iid/review', (p, __, b) => {
  const it = CHECKLIST.find((i) => i.id === p.iid)
  if (!it) throw new Falha(404, 'not_found', 'Item não encontrado')
  if (!b.approved && !String(b.note ?? '').trim()) throw new Falha(400, 'validation_error', 'Diga o que precisa ajustar')
  it.reviewStatus = b.approved ? 'aprovada' : 'reprovada'
  it.reviewNote = b.approved ? null : b.note
  it.reviewedById = ME_ID
  it.reviewedAt = agora()
  if (!b.approved) {
    it.isDone = false
    it.doneAt = null
    it.doneById = null
  }
  return checklistDe(p.id!)
})

/* ---------- etiquetas */
rota('GET', '/labels', () =>
  LABELS.map((l) => ({ ...l, emUso: TASKS.filter((t) => t.labelIds.includes(l.id)).length })).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
)
rota('POST', '/labels', (_, __, b) => {
  const nome = String(b.name ?? '').trim()
  if (!nome) throw new Falha(400, 'validation_error', 'Dê um nome à etiqueta')
  if (LABELS.some((l) => l.name.toLowerCase() === nome.toLowerCase())) {
    throw new Falha(409, 'etiqueta_existe', 'Já existe uma etiqueta com esse nome')
  }
  const l = { id: novoId('l'), name: nome, color: b.color ?? '#94a3b8' }
  LABELS.push(l)
  return l
})
rota('PATCH', '/labels/:id', (p, __, b) => {
  const l = LABELS.find((x) => x.id === p.id)
  if (l) Object.assign(l, Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined)))
  return l
})
rota('DELETE', '/labels/:id', (p) => {
  const i = LABELS.findIndex((x) => x.id === p.id)
  if (i >= 0) LABELS.splice(i, 1)
  let n = 0
  for (const t of TASKS) {
    if (t.labelIds.includes(p.id!)) {
      t.labelIds = t.labelIds.filter((x) => x !== p.id)
      n++
    }
  }
  return { demandasAfetadas: n }
})

/* ---------- clientes */
rota('GET', '/clients', () => CLIENTS.map(clienteResumo).sort((a, b) => a.name.localeCompare(b.name)))
rota('POST', '/clients', (_, __, b) => {
  const c: DbClient = {
    id: novoId('c'),
    name: b.name,
    segment: b.segment ?? null,
    logoUrl: null,
    status: b.status ?? 'ativo',
    contactName: b.contactName ?? null,
    contactEmail: b.contactEmail || null,
    contactPhone: b.contactPhone ?? null,
    anniversary: b.anniversary ?? null,
    createdAt: agora(),
    socialMediaIds: [],
    sections: [],
    acessos: [],
  }
  CLIENTS.push(c)
  return clienteCompleto(c)
})
rota('GET', '/clients/:id', (p) => clienteCompleto(cliente(p.id!)))
rota('PATCH', '/clients/:id', (p, __, b) => {
  const c = cliente(p.id!)
  Object.assign(c, b)
  return clienteCompleto(c)
})
rota('DELETE', '/clients/:id', (p) => {
  const n = TASKS.filter((t) => t.clientId === p.id).length
  if (n) {
    throw new Falha(
      409,
      'cliente_em_uso',
      `Este cliente tem ${n} ${n === 1 ? 'demanda ligada' : 'demandas ligadas'}. Marque como encerrado em vez de apagar.`,
    )
  }
  const i = CLIENTS.findIndex((x) => x.id === p.id)
  if (i >= 0) CLIENTS.splice(i, 1)
  return { ok: true }
})
rota('PUT', '/clients/:id/sections', (p, __, b) => {
  const c = cliente(p.id!)
  const s = c.sections.find((x) => x.sectionType === b.sectionType)
  if (s) Object.assign(s, { title: b.title, content: b.content, updatedAt: agora() })
  else c.sections.push({ sectionType: b.sectionType, title: b.title, content: b.content, updatedAt: agora() })
  return { ok: true }
})
rota('POST', '/clients/:id/attachments/sign', (p) => {
  const chave = `clients/${p.id}/${++seq}`
  return { uploadUrl: `local:${chave}`, fileKey: chave }
})
rota('PUT', '/clients/:id/social-medias', (p, __, b) => {
  cliente(p.id!).socialMediaIds = b.userIds ?? []
  return { ok: true }
})
rota('GET', '/clients/:id/acessos', (p) => ({
  cofreDisponivel: true,
  acessos: cliente(p.id!).acessos.map(({ password, ...a }) => ({ ...a, temSenha: !!password })),
}))
rota('POST', '/clients/:id/acessos', (p, __, b) => {
  cliente(p.id!).acessos.push({ id: novoId('a'), label: null, username: null, password: null, phone: null, notes: null, ...b })
  return { ok: true }
})
rota('PATCH', '/clients/:id/acessos/:aid', (p, __, b) => {
  const a = cliente(p.id!).acessos.find((x) => x.id === p.aid)
  if (a) Object.assign(a, b)
  return { ok: true }
})
rota('DELETE', '/clients/:id/acessos/:aid', (p) => {
  const c = cliente(p.id!)
  c.acessos = c.acessos.filter((x) => x.id !== p.aid)
  return { ok: true }
})
rota('POST', '/clients/:id/acessos/:aid/revelar', () => ({
  // Senha de exemplo: a réplica não guarda credencial nenhuma.
  password: 'senha-de-exemplo',
}))

/* ---------- calendário e externas */
rota('GET', '/calendar', (_, q) => calendario(q))
rota('GET', '/events/:id', (p) => {
  const e = EVENTS.find((x) => x.id === p.id)
  if (!e) throw new Falha(404, 'not_found', 'Compromisso não encontrado')
  return e
})
rota('POST', '/events', (_, __, b) => {
  const e = { id: novoId('ev'), description: null, location: null, clientId: null, attendeeIds: [], allDay: false, eventType: 'reuniao', ...b }
  EVENTS.push(e)
  return e
})
rota('PATCH', '/events/:id', (p, __, b) => {
  const e = EVENTS.find((x) => x.id === p.id)
  if (e) Object.assign(e, b)
  return e
})
rota('DELETE', '/events/:id', (p) => {
  const i = EVENTS.findIndex((x) => x.id === p.id)
  if (i >= 0) EVENTS.splice(i, 1)
  return { ok: true }
})
rota('GET', '/externas/agora', () => ({ emAndamento: [], paraConfirmar: [] }))
for (const acao of ['iniciar', 'encerrar', 'reabrir']) rota('POST', `/events/:id/${acao}`, () => ({ ok: true }))
rota('PUT', '/events/:id/equipe', (p, __, b) => {
  const e = EVENTS.find((x) => x.id === p.id)
  if (e) e.attendeeIds = b.attendeeIds
  return { ok: true }
})

/* ---------- painéis */
rota('GET', '/dashboard/home', () => home())
rota('GET', '/dashboard/me', (_, q) => {
  const desde = periodo(q.get('period'))
  return { ...metricas(vivas().filter((t) => noEscopo(t, 'me') && doPeriodo(t, desde))), period: q.get('period') ?? 'month' }
})
rota('GET', '/dashboard/admin', (_, q) => adminOverview(q.get('period')))
rota('GET', '/dashboard/admin/users-performance', (_, q) => usersPerformance(q.get('period')))
rota('GET', '/dashboard/admin/checklists', (_, q) => checklistsDoDia(q.get('dia')))

/* ---------- avisos */
rota('GET', '/notifications', () => notificacoes())
rota('PATCH', '/notifications/read-all', () => {
  for (const n of NOTIFICATIONS) n.readAt ??= agora()
  return { ok: true }
})
rota('PATCH', '/notifications/:id/read', (p) => {
  const n = NOTIFICATIONS.find((x) => x.id === p.id)
  if (n) n.readAt ??= agora()
  return { ok: true }
})
rota('GET', '/push/chave-publica', () => ({ publicKey: null }))
rota('PUT', '/push/inscricao', () => ({ ok: true }))
rota('POST', '/push/inscricao/remover', () => ({ ok: true }))
rota('POST', '/push/teste', () => {
  throw new Falha(400, 'push_indisponivel', 'Os avisos no celular não estão disponíveis na demonstração')
})

/* ---------- recorrências */
rota('GET', '/recurrences', () => RECURRENCES.map(recorrencia))
rota('POST', '/recurrences/preview', (_, __, b) => ({
  description: describeRrule(b.rrule),
  schedule: describeSchedule(b.leadTimeDays ?? 0, b.deadlineTime ?? '18:00'),
  deadlines: proximosPrazos(b.rrule, b.deadlineTime ?? '18:00', b.count ?? 4),
}))
rota('POST', '/recurrences', (_, __, b) => {
  const r = {
    id: novoId('r'),
    template: b.template,
    rrule: b.rrule,
    leadTimeDays: b.leadTimeDays ?? 0,
    deadlineTime: b.deadlineTime ?? '18:00',
    isActive: b.isActive ?? true,
    lastRunAt: null,
    createdBy: ME_ID,
    createdAt: agora(),
  }
  RECURRENCES.push(r)
  return recorrencia(r)
})
rota('PATCH', '/recurrences/:id', (p, __, b) => {
  const r = RECURRENCES.find((x) => x.id === p.id)
  if (!r) throw new Falha(404, 'not_found', 'Recorrência não encontrada')
  Object.assign(r, b)
  return recorrencia(r)
})
rota('DELETE', '/recurrences/:id', (p) => {
  const i = RECURRENCES.findIndex((x) => x.id === p.id)
  if (i >= 0) RECURRENCES.splice(i, 1)
  return { ok: true }
})
rota('POST', '/recurrences/:id/run', (p) => {
  const r = RECURRENCES.find((x) => x.id === p.id)
  if (!r) throw new Falha(404, 'not_found', 'Recorrência não encontrada')
  const prazo = proximosPrazos(r.rrule, r.deadlineTime, 1)[0] ?? agora()
  const t = criarDemanda({ ...r.template, deadline: prazo, recurrenceId: r.id })
  r.lastRunAt = agora()
  return { created: 1, taskIds: [t.id] }
})

/* ================================================================== despacho */

function casar(modelo: string, caminho: string): Record<string, string> | null {
  const a = modelo.split('/')
  const b = caminho.split('/')
  if (a.length !== b.length) return null
  const p: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i]!.startsWith(':')) p[a[i]!.slice(1)] = decodeURIComponent(b[i]!)
    else if (a[i] !== b[i]) return null
  }
  return p
}

export function responder(metodo: string, caminhoCompleto: string, corpo: unknown): Resposta {
  const url = new URL(caminhoCompleto, 'http://replica')
  const caminho = url.pathname.replace(/\/$/, '')
  try {
    if (!logado && caminho !== '/auth/login' && caminho !== '/auth/me') {
      throw new Falha(401, 'unauthorized', 'Sessão expirada')
    }
    for (const [m, modelo, h] of rotas) {
      if (m !== metodo) continue
      const p = casar(modelo, caminho)
      if (p) return { status: 200, body: h(p, url.searchParams, corpo ?? {}) }
    }
    return { status: 404, body: { error: 'not_found', message: 'Rota não encontrada' } }
  } catch (e) {
    if (e instanceof Falha) return { status: e.status, body: { error: e.code, message: e.message } }
    return { status: 500, body: { error: 'internal', message: 'Erro inesperado' } }
  }
}
