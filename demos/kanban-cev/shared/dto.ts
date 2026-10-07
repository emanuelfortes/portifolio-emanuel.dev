import { PLATAFORMA_ACESSO } from './acesso'

/**
 * Os contratos de entrada que os formulários validam antes de enviar.
 *
 * No original são schemas do zod (packages/shared/src/dto.ts). Aqui cada um
 * é uma função com o mesmo `safeParse` e as mesmas mensagens, para os modais
 * continuarem lendo `parsed.error.issues` como lá.
 */

export { PLATAFORMA_ACESSO }

interface Issue {
  path: (string | number)[]
  message: string
}

type Regra = (v: any) => Issue[]

function schema<T>(regra: Regra) {
  return {
    safeParse(v: unknown):
      | { success: true; data: T }
      | { success: false; error: { issues: Issue[] } } {
      const issues = regra(v ?? {})
      return issues.length ? { success: false, error: { issues } } : { success: true, data: v as T }
    },
  }
}

const vazio = (s: unknown) => typeof s !== 'string' || s.trim() === ''
const curto = (s: unknown, min: number) => typeof s !== 'string' || s.trim().length < min
const minimo = (n: number) =>
  `O texto precisa ter pelo menos ${n} ${n === 1 ? 'caractere' : 'caracteres'}`
const emailInvalido = (s: unknown) =>
  typeof s === 'string' && s !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
const dataInvalida = (s: unknown) => typeof s !== 'string' || Number.isNaN(Date.parse(s))

function juntar(...listas: (Issue | false | null | undefined)[]): Issue[] {
  return listas.filter(Boolean) as Issue[]
}

// ---------------------------------------------------------------- tasks

function camposDaDemanda(v: any, parcial: boolean): Issue[] {
  return juntar(
    (!parcial || v.title !== undefined) &&
      curto(v.title, 3) && { path: ['title'], message: 'Título muito curto' },
    (!parcial || v.taskTypeId !== undefined) &&
      !(Number(v.taskTypeId) > 0) && { path: ['taskTypeId'], message: 'Escolha o tipo' },
    (!parcial || v.deadline !== undefined) &&
      dataInvalida(v.deadline) && { path: ['deadline'], message: 'Data inválida' },
  )
}

export const createTaskSchema = schema((v) => {
  const issues = camposDaDemanda(v, false)
  if (Boolean(v.assigneeId) === Boolean(v.queueRoleId)) {
    issues.push({ path: ['assigneeId'], message: 'Escolha uma pessoa OU uma função, não as duas' })
  }
  return issues
})
export type CreateTaskInput = Record<string, unknown>

export const updateTaskSchema = schema((v) => camposDaDemanda(v, true))

// ---------------------------------------------------------------- recorrência

export const createRecurrenceSchema = schema((v) =>
  juntar(
    curto(v.rrule, 3) && { path: ['rrule'], message: minimo(3) },
    v.deadlineTime !== undefined &&
      !/^\d{2}:\d{2}$/.test(String(v.deadlineTime)) && { path: ['deadlineTime'], message: 'Use HH:MM' },
    curto(v.template?.title, 3) && { path: ['template', 'title'], message: minimo(3) },
    !(Number(v.template?.taskTypeId) > 0) && { path: ['template', 'taskTypeId'], message: 'Escolha o tipo' },
    vazio(v.template?.assigneeId) && { path: ['template', 'assigneeId'], message: 'Escolha o responsável' },
  ),
)
export type CreateRecurrenceInput = Record<string, unknown>

// ---------------------------------------------------------------- usuários

function camposDoUsuario(v: any, parcial: boolean): Issue[] {
  return juntar(
    (!parcial || v.name !== undefined) && curto(v.name, 2) && { path: ['name'], message: minimo(2) },
    (!parcial || v.email !== undefined) &&
      (vazio(v.email) || emailInvalido(v.email)) && { path: ['email'], message: 'E-mail inválido' },
    (!parcial || v.roleId !== undefined) &&
      !(Number(v.roleId) > 0) && { path: ['roleId'], message: 'Escolha a função' },
  )
}

export const createUserSchema = schema((v) => [
  ...camposDoUsuario(v, false),
  ...juntar(curto(v.password, 8) && { path: ['password'], message: minimo(8) }),
])

export const updateUserSchema = schema((v) => camposDoUsuario(v, true))

// ---------------------------------------------------------------- clientes

export const createClientSchema = schema((v) =>
  juntar(
    curto(v.name, 2) && { path: ['name'], message: minimo(2) },
    emailInvalido(v.contactEmail) && { path: ['contactEmail'], message: 'E-mail inválido' },
  ),
)

// ---------------------------------------------------------------- calendário

export const createEventSchema = schema((v) =>
  juntar(
    curto(v.title, 2) && { path: ['title'], message: minimo(2) },
    dataInvalida(v.startAt) && { path: ['startAt'], message: 'Data inválida' },
    dataInvalida(v.endAt) && { path: ['endAt'], message: 'Data inválida' },
    !dataInvalida(v.startAt) &&
      !dataInvalida(v.endAt) &&
      new Date(v.endAt) < new Date(v.startAt) && {
        path: ['endAt'],
        message: 'O término não pode ser antes do início',
      },
  ),
)

// ---------------------------------------------------------------- checklist

export interface CreateChecklistItemInput {
  content: string
  description?: string | null
  assigneeId?: string | null
  taskTypeId?: number | null
  dueAt?: string | null
  delivery?: string | null
}

export interface UpdateChecklistItemInput {
  content?: string
  isDone?: boolean
  started?: boolean
  description?: string | null
  assigneeId?: string | null
  taskTypeId?: number | null
  dueAt?: string | null
  delivery?: string | null
}
