'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import {
  useAssignableUsers,
  useClients,
  useTaskTypes,
  useUpdateTask,
  type EdicaoDemanda,
} from '@/demos/kanban-cev/lib/hooks'
import { Avatar, Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'
import { MarkdownEditor } from '@/demos/kanban-cev/components/markdown-editor'

/**
 * Editar a demanda depois de criada.
 *
 * O backend sempre aceitou todos estes campos — o `PATCH /tasks/:id` grava
 * título, descrição, tipo, cliente, responsável, prazo, prioridade e
 * observações, com registro próprio na auditoria para prazo e responsável.
 * Faltava caminho até ele: a tela mostrava tudo isso como texto fixo.
 *
 * O efeito prático era que adiar uma demanda exigia apagá-la e criar outra,
 * perdendo comentários, anexos, checklist e histórico — justamente o que a
 * plataforma existe para guardar.
 *
 * Checklist, etiquetas e anexos NÃO estão aqui de propósito: eles se editam na
 * própria demanda, item a item, e trazê-los para um formulário de salvar tudo
 * de uma vez faria a pessoa perder trabalho ao cancelar.
 */

/** ISO com fuso → o formato que o `datetime-local` entende, em hora local. */
function paraCampoLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const PRIORIDADES = [
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
  { valor: 'urgente', rotulo: 'Urgente' },
]

interface Demanda {
  id: string
  title: string
  description?: string | null
  observations?: string | null
  deadline: string
  priority: string
  taskType: { id: number }
  client?: { id: string } | null
  assignee?: { id: string } | null
  participants?: { id: string }[]
}

export function EditarDemandaModal({
  open,
  onClose,
  demanda,
}: {
  open: boolean
  onClose: () => void
  demanda: Demanda
}) {
  const { data: tipos } = useTaskTypes()
  const { data: clientes } = useClients()
  const { data: assignable } = useAssignableUsers()
  const salvar = useUpdateTask(demanda.id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    observations: '',
    deadline: '',
    priority: 'media',
    taskTypeId: '',
    clientId: '',
    assigneeId: '',
  })
  const [participantes, setParticipantes] = useState<string[]>([])
  const [erro, setErro] = useState<string | null>(null)

  /**
   * Recarrega do servidor a cada abertura.
   *
   * Sem isto, quem abre, cancela, e abre de novo depois de outra pessoa ter
   * mexido continuaria vendo o estado antigo — e salvaria por cima do que a
   * colega acabou de gravar, sem sinal nenhum de que houve conflito.
   */
  useEffect(() => {
    if (!open) return
    setForm({
      title: demanda.title,
      description: demanda.description ?? '',
      observations: demanda.observations ?? '',
      deadline: paraCampoLocal(demanda.deadline),
      priority: demanda.priority,
      taskTypeId: String(demanda.taskType.id),
      clientId: demanda.client?.id ?? '',
      assigneeId: demanda.assignee?.id ?? '',
    })
    setParticipantes((demanda.participants ?? []).map((p) => p.id))
    setErro(null)
  }, [open, demanda])

  /**
   * Responsáveis agrupados por função, e só quando a função tem mais de uma
   * pessoa: um grupo de um nome só é um cabeçalho que não agrupa nada.
   */
  const { grupos, sozinhas } = useMemo(() => {
    const lista = assignable ?? []
    const porFuncao = new Map<number, { nome: string; pessoas: typeof lista }>()
    for (const u of lista) {
      const atual = porFuncao.get(u.roleId)
      if (atual) atual.pessoas.push(u)
      else porFuncao.set(u.roleId, { nome: u.roleDisplayName, pessoas: [u] })
    }
    const todos = [...porFuncao.values()]
    const porNome = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)
    return {
      grupos: todos
        .filter((g) => g.pessoas.length > 1)
        .map((g) => ({ ...g, pessoas: [...g.pessoas].sort(porNome) }))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
      sozinhas: todos
        .filter((g) => g.pessoas.length === 1)
        .map((g) => g.pessoas[0]!)
        .sort(porNome),
    }
  }, [assignable])

  if (!open) return null

  function alternarParticipante(id: string) {
    setParticipantes((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id],
    )
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (form.title.trim().length < 3) return setErro('O título precisa de pelo menos 3 letras')
    if (!form.deadline) return setErro('Escolha um prazo')

    /**
     * Manda tudo, e não só o que mudou.
     *
     * Comparar campo a campo para enviar um patch mínimo economizaria bytes e
     * criaria uma classe de bug difícil de achar: o dia em que a comparação
     * errasse um campo, ele deixaria de ser salvo em silêncio. O endpoint já
     * trata cada campo como opcional.
     */
    const dados: EdicaoDemanda = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      observations: form.observations.trim() || null,
      taskTypeId: Number(form.taskTypeId),
      clientId: form.clientId || null,
      deadline: new Date(form.deadline).toISOString(),
      priority: form.priority,
      participantIds: participantes,
    }
    // Só vai quando há alguém: a demanda pode estar na fila, sem dono, e
    // mandar string vazia faria o backend recusar por uuid inválido.
    if (form.assigneeId) dados.assigneeId = form.assigneeId

    try {
      await salvar.mutateAsync(dados)
      onClose()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 mb-8 w-full max-w-2xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">Editar demanda</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={enviar} className="space-y-4 px-6 py-5">
          <Field label="Título" required>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={200}
            />
          </Field>

          <Field label="Descrição" hint="Aceita negrito, lista e link">
            <MarkdownEditor
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              rows={6}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de demanda" required>
              <select
                className={inputClass}
                value={form.taskTypeId}
                onChange={(e) => setForm({ ...form, taskTypeId: e.target.value })}
              >
                {tipos?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.displayName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cliente" hint="Demanda interna pode ficar sem cliente">
              <select
                className={inputClass}
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Nenhum (interna)</option>
                {clientes
                  ?.filter((c: any) => c.status === 'ativo' || c.id === form.clientId)
                  .map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prazo" required>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>

            <Field label="Prioridade">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORIDADES.map((p) => (
                  <option key={p.valor} value={p.valor}>
                    {p.rotulo}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Responsável"
            hint="Trocar move o card para o fim da coluna da nova pessoa, e ela é avisada"
          >
            <select
              className={inputClass}
              value={form.assigneeId}
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            >
              {/* Sem dono é estado legítimo — a demanda pode estar esperando
                  alguém da fila. A opção existe para não forçar uma escolha
                  ao editar outra coisa qualquer. */}
              {!form.assigneeId && <option value="">Sem responsável (na fila)</option>}
              {grupos.map((g) => (
                <optgroup key={g.nome} label={g.nome}>
                  {g.pessoas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              {sozinhas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {u.roleDisplayName}
                </option>
              ))}
            </select>
          </Field>

          {/**
            * Participantes: quem acompanha sem ser responsável.
            *
            * A lista enviada substitui a anterior, então desmarcar é o que
            * remove. O responsável não aparece aqui: ele já está na demanda
            * por outro caminho, e deixá-lo escolhível criaria a dúvida de se
            * marcar a si mesmo muda alguma coisa.
            */}
          <Field label="Participantes" hint="Acompanham e recebem avisos, sem serem responsáveis">
            <div className="flex flex-wrap gap-1.5">
              {(assignable ?? [])
                .filter((u) => u.id !== form.assigneeId)
                .map((u) => {
                  const marcado = participantes.includes(u.id)
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => alternarParticipante(u.id)}
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-[12.5px] font-medium ring-1 ring-inset transition',
                        marcado
                          ? 'bg-brand-600/15 text-brand-700 ring-brand-600/40'
                          : 'bg-overlay/5 text-ink-600 ring-overlay/10 hover:text-ink-900',
                      )}
                    >
                      <Avatar name={u.name} url={u.avatarUrl} size={20} />
                      {u.name.split(' ')[0]}
                    </button>
                  )
                })}
            </div>
          </Field>

          <Field label="Observações" hint="Notas internas que não vão na descrição">
            <textarea
              rows={3}
              maxLength={5000}
              className={inputClass}
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
            />
          </Field>

          {erro && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvar.isPending}>
              {salvar.isPending && <Spinner />}
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
