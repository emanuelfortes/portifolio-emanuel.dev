'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, CalendarClock } from 'lucide-react'
import clsx from 'clsx'
import { createRecurrenceSchema, WEEKDAYS } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import {
  useAssignableUsers,
  useClients,
  useCreateRecurrence,
  useRecurrencePreview,
  useTaskTypes,
  useMe,
  useUpdateRecurrence,
  type Recurrence,
} from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'
import { formatDeadline } from '@/demos/kanban-cev/lib/format'

/* -------------------------------------------------------------- a regra */

type Frequencia = 'DAILY' | 'WEEKLY' | 'MONTHLY'

interface Regra {
  freq: Frequencia
  /** Só para semanal: 1 = toda semana, 2 = a cada 15 dias. */
  intervalo: number
  diasDaSemana: string[]
  diaDoMes: number
}

/**
 * O formulário não pede RRULE: pede frequência e dias, e monta a string aqui.
 * Ninguém numa agência vai digitar `FREQ=WEEKLY;BYDAY=MO,WE,FR`.
 */
function montarRrule(r: Regra): string {
  if (r.freq === 'DAILY') return 'FREQ=DAILY'

  if (r.freq === 'WEEKLY') {
    const dias = r.diasDaSemana.length ? r.diasDaSemana : ['MO']
    const intervalo = r.intervalo > 1 ? `;INTERVAL=${r.intervalo}` : ''
    return `FREQ=WEEKLY${intervalo};BYDAY=${dias.join(',')}`
  }

  return `FREQ=MONTHLY;BYMONTHDAY=${r.diaDoMes}`
}

/** Caminho inverso, para a edição abrir com os campos já marcados. */
function lerRrule(rrule: string): Regra {
  const partes = new Map(
    rrule
      .replace(/^RRULE:/i, '')
      .split(';')
      .map((p) => p.split('=') as [string, string]),
  )
  const freq = (partes.get('FREQ') ?? 'WEEKLY') as Frequencia

  return {
    freq: freq === 'DAILY' || freq === 'MONTHLY' ? freq : 'WEEKLY',
    intervalo: Number(partes.get('INTERVAL') ?? 1),
    diasDaSemana: (partes.get('BYDAY') ?? 'MO').split(',').filter(Boolean),
    diaDoMes: Number(partes.get('BYMONTHDAY') ?? 1),
  }
}

const REGRA_PADRAO: Regra = {
  freq: 'WEEKLY',
  intervalo: 1,
  diasDaSemana: ['MO'],
  diaDoMes: 1,
}

/* -------------------------------------------------------------- modal */

export function RecurrenceModal({
  open,
  onClose,
  editando,
}: {
  open: boolean
  onClose: () => void
  /** Quando presente, o modal abre em modo edição. */
  editando?: Recurrence | null
}) {
  const { data: me } = useMe()
  const { data: types } = useTaskTypes()
  const { data: clients } = useClients()
  const { data: assignable } = useAssignableUsers()

  /**
   * Quem hoje receberia uma demanda no modo cronograma.
   *
   * Sai dos CLIENTES, não de um campo da regra, porque é assim que a geração
   * decide: quem tem cliente ativo sob responsabilidade entra. Mostrar a lista
   * aqui responde a pergunta que o formulário não respondia — "isso vai para
   * quem?" — e deixa visível que ela cresce sozinha quando a agência contrata
   * mais uma social media.
   */
  const sociaisHoje = useMemo(() => {
    const ids = new Set(
      (clients ?? []).filter((c) => c.status === 'ativo').flatMap((c) => c.socialMediaIds ?? []),
    )
    return (assignable ?? []).filter((u) => ids.has(u.id)).map((u) => u.name)
  }, [clients, assignable])
  const criar = useCreateRecurrence()
  const atualizar = useUpdateRecurrence()

  const [regra, setRegra] = useState<Regra>(REGRA_PADRAO)
  const [form, setForm] = useState({
    title: '',
    description: '',
    taskTypeId: '',
    clientId: '',
    assigneeId: '',
    priority: 'media',
    deadlineTime: '18:00',
    leadTimeDays: '2',
    /**
     * Como a regra gera as demandas.
     *
     *   comum             uma demanda para o responsável escolhido
     *   por_social_media  uma por pessoa que tem cliente, com os clientes dela
     *   verificacao       uma só, para quem confere, com todo mundo dentro
     */
    modo: 'comum' as 'comum' | 'por_social_media' | 'verificacao',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Ao abrir: carrega o que está sendo editado, ou zera com o usuário atual.
  useEffect(() => {
    if (!open) return

    if (editando) {
      setRegra(lerRrule(editando.rrule))
      setForm({
        title: editando.template.title,
        description: editando.template.description ?? '',
        taskTypeId: String(editando.template.taskTypeId),
        clientId: editando.template.clientId ?? '',
        assigneeId: editando.template.assigneeId,
        priority: editando.template.priority,
        deadlineTime: editando.deadlineTime,
        leadTimeDays: String(editando.leadTimeDays),
        modo: editando.template.checklistDeVerificacao
          ? 'verificacao'
          : editando.template.porResponsavelDeClientes
            ? 'por_social_media'
            : 'comum',
      })
    } else {
      setRegra(REGRA_PADRAO)
      setForm((f) => ({ ...f, assigneeId: me?.id ?? '' }))
    }

    setErrors({})
    setServerError(null)
  }, [open, editando, me])

  const rrule = useMemo(() => montarRrule(regra), [regra])
  const leadTimeDays = Number(form.leadTimeDays) || 0

  const preview = useRecurrencePreview({ rrule, leadTimeDays, deadlineTime: form.deadlineTime })

  if (!open) return null

  function alternarDia(code: string) {
    setRegra((r) => {
      const tem = r.diasDaSemana.includes(code)
      const dias = tem ? r.diasDaSemana.filter((d) => d !== code) : [...r.diasDaSemana, code]
      // Nunca deixa a regra sem nenhum dia: geraria uma recorrência vazia.
      return { ...r, diasDaSemana: dias.length ? dias : r.diasDaSemana }
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const payload = {
      rrule,
      leadTimeDays,
      deadlineTime: form.deadlineTime,
      isActive: editando?.isActive ?? true,
      template: {
        title: form.title,
        description: form.description || undefined,
        taskTypeId: Number(form.taskTypeId),
        clientId: form.clientId || null,
        assigneeId: form.assigneeId,
        priority: form.priority as never,
        /**
         * As duas vão SEMPRE, com o valor verdadeiro — inclusive `false`.
         *
         * Mandar só quando ligado impediria DESLIGAR: trocar de "por social
         * media" para "comum" deixaria a flag antiga no molde, e a regra
         * continuaria gerando uma demanda por pessoa sem nada na tela dizer
         * por quê.
         */
        porResponsavelDeClientes: form.modo === 'por_social_media',
        checklistDeVerificacao: form.modo === 'verificacao',
      },
    }

    const parsed = createRecurrenceSchema.safeParse(payload)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        // O caminho de um erro do molde vem como ['template', 'title'].
        fieldErrors[String(issue.path[issue.path.length - 1])] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    try {
      if (editando) await atualizar.mutateAsync({ id: editando.id, patch: parsed.data })
      else await criar.mutateAsync(parsed.data)
      onClose()
    } catch (err) {
      // A matriz de delegação é revalidada no backend; aqui só exibimos.
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-3xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">
            {editando ? 'Editar recorrência' : 'Nova demanda recorrente'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-5">
          {/* ---------------------------------------------------- o molde */}
          <Field label="Título da demanda" required error={errors.title}>
            <input
              className={inputClass}
              autoFocus
              placeholder="Ex: Relatório semanal de tráfego"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de demanda" required error={errors.taskTypeId}>
              <select
                className={inputClass}
                value={form.taskTypeId}
                onChange={(e) => setForm({ ...form, taskTypeId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {types?.map((t) => (
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
                {clients?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/**
            * Modo cronograma.
            *
            * Fica ANTES do responsável porque muda o que aquele campo
            * significa: ligado, a demanda deixa de ser de uma pessoa e passa a
            * ser uma por social media. Depois do campo, quem lesse na ordem já
            * teria escolhido um responsável que o sistema vai ignorar.
            */}
          {/**
            * Os três modos, como escolha única.
            *
            * Eram duas caixas independentes na primeira versão, e marcar as
            * duas não queria dizer nada — o backend teria de eleger uma. Como
            * escolha, a tela já impede o estado sem sentido.
            *
            * Fica ANTES do responsável porque muda o que aquele campo
            * significa: no modo por social media ele é só o dono da regra.
            */}
          <div className="space-y-2">
            {(
              [
                [
                  'comum',
                  'Uma demanda, como sempre',
                  'A regra cria uma demanda para o responsável escolhido abaixo.',
                ],
                [
                  'por_social_media',
                  'Uma demanda POR SOCIAL MEDIA, com os clientes dele',
                  'Cada pessoa que tem cliente sob responsabilidade recebe a sua, com um item de checklist por cliente. É ela quem marca o próprio trabalho. Cliente novo entra sozinho — basta associá-lo na tela dele.',
                ],
                [
                  'verificacao',
                  'Uma demanda para CONFERIR, com todos os social medias',
                  'Uma demanda só, para quem verifica se a equipe entregou. O checklist traz cada cliente com o nome do responsável ao lado, agrupado por pessoa — e quem confere é quem marca.',
                ],
              ] as const
            ).map(([valor, titulo, texto]) => (
              <label
                key={valor}
                className={clsx(
                  'flex cursor-pointer items-start gap-3 rounded-xl p-3.5 ring-1 ring-inset transition',
                  form.modo === valor
                    ? 'bg-brand-600/12 ring-brand-600/40'
                    : 'bg-overlay/5 ring-overlay/10 hover:ring-overlay/20',
                )}
              >
                <input
                  type="radio"
                  name="modo-da-regra"
                  checked={form.modo === valor}
                  onChange={() => setForm({ ...form, modo: valor })}
                  className="mt-0.5 size-4 shrink-0 accent-brand-500"
                />
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-ink-800">{titulo}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500">
                    {texto}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field
                /**
                 * O rótulo muda porque o campo muda de significado.
                 *
                 * Chamá-lo de "Responsável" no modo cronograma fazia a regra
                 * parecer de uma pessoa só — quem escolhesse a Ana leria depois
                 * "Ana Lima" na lista e concluiria que as outras ficaram de
                 * fora. Aqui ele não escolhe quem trabalha; escolhe quem pode
                 * mexer na regra.
                 */
                label={form.modo === 'por_social_media' ? 'Dono da regra' : 'Responsável'}
                required
                error={errors.assigneeId}
                hint={
                  form.modo === 'por_social_media'
                    ? 'Só define quem administra a regra. As demandas vão para TODAS as social medias.'
                    : form.modo === 'verificacao'
                      ? 'É quem vai CONFERIR: a demanda com a lista inteira nasce para esta pessoa'
                      : 'A lista já respeita a matriz de delegação da sua função'
                }
              >
                <select
                  className={inputClass}
                  value={form.assigneeId}
                  onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                >
                  {assignable?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {u.roleDisplayName}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Concreto, e não só a regra: quem exatamente receberia hoje.
                  É o que mostra que a lista não é fixa — quem for associado a
                  um cliente depois entra sem ninguém editar esta regra. */}
              {form.modo === 'por_social_media' && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                  {sociaisHoje.length === 0 ? (
                    <>
                      Hoje ninguém receberia: nenhum cliente ativo tem social media associada. A
                      regra passa a gerar assim que a primeira associação existir.
                    </>
                  ) : (
                    <>
                      Hoje seriam{' '}
                      <span className="font-medium text-ink-700">
                        {sociaisHoje.length} {sociaisHoje.length === 1 ? 'pessoa' : 'pessoas'}
                      </span>{' '}
                      — {sociaisHoje.join(', ')}. Quem for associada a um cliente depois entra
                      sozinha, sem mexer nesta regra.
                    </>
                  )}
                </p>
              )}
            </div>

            <Field label="Prioridade">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </Field>
          </div>

          {/* ---------------------------------------------------- a cadência */}
          <fieldset className="rounded-xl border border-ink-200 p-4">
            <legend className="px-1.5 text-[13px] font-medium text-ink-700">Quando se repete</legend>

            <div className="mb-4 flex items-center gap-1 rounded-lg bg-ink-100 p-1">
              {(
                [
                  ['WEEKLY', 'Semanal'],
                  ['DAILY', 'Diária'],
                  ['MONTHLY', 'Mensal'],
                ] as const
              ).map(([valor, rotulo]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setRegra({ ...regra, freq: valor })}
                  className={clsx(
                    'flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition',
                    regra.freq === valor
                      ? 'bg-surface text-ink-900 shadow-sm'
                      : 'text-ink-500 hover:text-ink-800',
                  )}
                >
                  {rotulo}
                </button>
              ))}
            </div>

            {regra.freq === 'WEEKLY' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map((d) => {
                    const ativo = regra.diasDaSemana.includes(d.code)
                    return (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => alternarDia(d.code)}
                        className={clsx(
                          'rounded-lg px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset transition',
                          ativo
                            ? 'bg-brand-600 text-pine-950 ring-brand-600'
                            : 'bg-surface text-ink-600 ring-ink-200 hover:bg-ink-50',
                        )}
                      >
                        {d.short}
                      </button>
                    )
                  })}
                </div>

                <label className="flex items-center gap-2 text-[13px] text-ink-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500/30"
                    checked={regra.intervalo === 2}
                    onChange={(e) => setRegra({ ...regra, intervalo: e.target.checked ? 2 : 1 })}
                  />
                  A cada 15 dias, e não toda semana
                </label>
              </div>
            )}

            {regra.freq === 'MONTHLY' && (
              <Field label="Dia do mês">
                <input
                  type="number"
                  min={1}
                  max={31}
                  className={inputClass}
                  value={regra.diaDoMes}
                  onChange={(e) =>
                    setRegra({ ...regra, diaDoMes: Math.min(31, Math.max(1, Number(e.target.value) || 1)) })
                  }
                />
              </Field>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Prazo às" hint="Hora de Brasília">
                <input
                  type="time"
                  className={inputClass}
                  value={form.deadlineTime}
                  onChange={(e) => setForm({ ...form, deadlineTime: e.target.value || '18:00' })}
                />
              </Field>

              <Field
                label="Criar quantos dias antes"
                hint="Zero cria na madrugada do próprio dia do prazo"
                error={errors.leadTimeDays}
              >
                <input
                  type="number"
                  min={0}
                  max={60}
                  className={inputClass}
                  value={form.leadTimeDays}
                  onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })}
                />
              </Field>
            </div>
          </fieldset>

          {/* ---------------------------------------------------- conferência */}
          <div className="rounded-xl bg-ink-50 px-4 py-3.5 ring-1 ring-inset ring-ink-200">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-ink-800">
              <CalendarClock className="size-4 text-brand-600" />
              {preview.isLoading ? 'Calculando...' : (preview.data?.description ?? 'Defina a regra')}
            </div>

            {preview.error && (
              <p className="text-[13px] text-red-600">
                Esta regra não gera nenhuma data. Revise os dias escolhidos.
              </p>
            )}

            {preview.data && (
              <>
                <p className="mb-2 text-[12px] text-ink-500">{preview.data.schedule}</p>
                {preview.data.deadlines.length === 0 ? (
                  <p className="text-[13px] text-amber-700">
                    Nenhuma data futura: a regra já se esgotou.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {preview.data.deadlines.map((d) => (
                      <li key={d} className="text-[13px] text-ink-700">
                        <span className="mr-2 text-ink-400">·</span>
                        {formatDeadline(d)}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <Field label="Descrição">
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Contexto que vale para toda vez que a demanda for criada..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          {serverError && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Spinner />}
              {editando ? 'Salvar alterações' : 'Criar recorrência'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
