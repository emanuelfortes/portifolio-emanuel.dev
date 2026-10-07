'use client'

import { responder } from '@/demos/kanban-cev/mock/server'

/**
 * Cliente do navegador. No original bate em /api/... (o BFF) e dali na API.
 * Na réplica a "rede" é o servidor em memória de mock/server.ts: mesmas rotas,
 * mesmas respostas e os mesmos erros, sem sair do navegador.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Um respiro de rede: a resposta chega no próximo ciclo, como num fetch.
  await new Promise((r) => setTimeout(r, 0))
  const method = init.method ?? 'GET'
  const data = typeof init.body === 'string' ? JSON.parse(init.body) : undefined
  const res = responder(method, path, data)
  // Cópia: o cache das telas nunca segura referência ao "banco".
  const body = res.body === undefined ? null : JSON.parse(JSON.stringify(res.body))

  if (res.status >= 400) {
    throw new ApiError(res.status, codigoDoErro(body), mensagemDoErro(body), body?.details)
  }

  return body as T
}

/**
 * A API responde erro em dois formatos, e só um deles é nosso.
 *
 * O `AppError` do backend devolve `{ error, message }`. Mas o `zValidator`
 * responde antes de qualquer handler, com o formato cru do Zod:
 * `{ success: false, error: { issues: [{ message, path }] } }` — sem campo
 * `message` nenhum.
 *
 * Ler só `body.message` fazia toda falha de validação virar "Erro inesperado".
 * Era o que a tela de login mostrava para uma senha com menos de 8
 * caracteres, escondendo justamente a informação que resolvia o problema.
 */
function mensagemDoErro(body: any): string {
  if (typeof body?.message === 'string') return body.message

  const issues = body?.error?.issues
  if (Array.isArray(issues) && issues.length) {
    // Uma linha por campo, para o formulário não esconder o segundo erro.
    return [...new Set(issues.map((i: any) => i.message).filter(Boolean))].join('. ')
  }

  return 'Erro inesperado'
}

function codigoDoErro(body: any): string {
  if (typeof body?.error === 'string') return body.error
  if (body?.error?.issues) return 'validation_error'
  return 'unknown'
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data ?? {}) }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export const qk = {
  me: ['me'] as const,
  board: (scope: string) => ['board', scope] as const,
  tasks: (params: string) => ['tasks', params] as const,
  task: (id: string) => ['task', id] as const,
  taskComments: (id: string) => ['task', id, 'comments'] as const,
  taskActivity: (id: string) => ['task', id, 'activity'] as const,
  taskOrigin: (id: string) => ['task', id, 'origin'] as const,
  metrics: (period: string) => ['metrics', period] as const,
  home: ['home'] as const,
  notifications: ['notifications'] as const,
  statuses: ['statuses'] as const,
  taskTypes: ['taskTypes'] as const,
  assignable: ['assignable'] as const,
  clients: ['clients'] as const,
  recurrences: ['recurrences'] as const,
  recurrencePreview: (assinatura: string) => ['recurrencePreview', assinatura] as const,
  taskAttachments: (id: string) => ['task', id, 'attachments'] as const,
  // `['task', id, ...]` de propósito: assim a invalidação por `['task']`
  // alcança o checklist junto com o resto do detalhe.
  taskChecklist: (id: string) => ['task', id, 'checklist'] as const,
  labels: ['labels'] as const,
  client: (id: string) => ['client', id] as const,
  clientTasks: (id: string) => ['client', id, 'tasks'] as const,
  calendar: (chave: string) => ['calendar', chave] as const,
  delegationMatrix: ['delegationMatrix'] as const,
  team: (incluirInativos: boolean) => ['team', incluirInativos] as const,
  adminOverview: (period: string) => ['adminOverview', period] as const,
  usersPerformance: (period: string) => ['usersPerformance', period] as const,
}
