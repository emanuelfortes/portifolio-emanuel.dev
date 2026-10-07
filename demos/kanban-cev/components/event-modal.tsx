'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, Trash2 } from 'lucide-react'
import { createEventSchema, EVENT_TYPE } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { useSaveEvent, useDeleteEvent, useClients, useTeam, useMe } from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'

/**
 * O rótulo de cada tipo, e a ordem em que aparecem.
 *
 * Captação vem primeiro por ser a que a agência mais cadastra e a que mais
 * depende de aviso antecipado. Feriado fica fora: quem cria feriado é a
 * importação da BrasilAPI, e oferecê-lo aqui convidaria a duplicar.
 */
const TIPOS = [
  { valor: EVENT_TYPE.CAPTACAO, label: 'Captação de vídeo' },
  { valor: EVENT_TYPE.ASSESSORIA_IMPRENSA, label: 'Assessoria de imprensa' },
  { valor: EVENT_TYPE.REUNIAO, label: 'Reunião' },
  { valor: EVENT_TYPE.EVENTO, label: 'Evento' },
  { valor: EVENT_TYPE.DATA_IMPORTANTE, label: 'Data importante' },
] as const

/** `datetime-local` quer `YYYY-MM-DDTHH:mm` no fuso local, sem zona. */
function paraCampo(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function padraoInicio(dia?: string): string {
  const d = dia ? new Date(`${dia}T09:00:00`) : new Date()
  if (!dia) d.setHours(d.getHours() + 1, 0, 0, 0)
  return paraCampo(d.toISOString())
}

/** Duas horas depois do início: captação raramente dura menos. */
function somaHoras(local: string, h: number): string {
  const d = new Date(local)
  d.setHours(d.getHours() + h)
  return paraCampo(d.toISOString())
}

export function EventModal({
  open,
  onClose,
  editando,
  diaInicial,
}: {
  open: boolean
  onClose: () => void
  editando?: any | null
  diaInicial?: string
}) {
  const salvar = useSaveEvent()
  const remover = useDeleteEvent()
  const { data: me } = useMe()
  const { data: clientes } = useClients()
  const { data: equipe } = useTeam(false)

  const [form, setForm] = useState({
    title: '',
    eventType: EVENT_TYPE.CAPTACAO as string,
    startAt: '',
    endAt: '',
    allDay: false,
    location: '',
    clientId: '',
    description: '',
  })
  const [participantes, setParticipantes] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const inicio = editando ? paraCampo(editando.startAt) : padraoInicio(diaInicial)
    setForm({
      title: editando?.title ?? '',
      eventType: editando?.eventType ?? EVENT_TYPE.CAPTACAO,
      startAt: inicio,
      endAt: editando ? paraCampo(editando.endAt) : somaHoras(inicio, 2),
      allDay: editando?.allDay ?? false,
      location: editando?.location ?? '',
      clientId: editando?.clientId ?? '',
      description: editando?.description ?? '',
    })
    setParticipantes(editando?.attendeeIds ?? (me ? [me.id] : []))
    setErrors({})
    setServerError(null)
  }, [open, editando, diaInicial, me])

  if (!open) return null

  const ehCaptacao = form.eventType === EVENT_TYPE.CAPTACAO

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const payload = {
      title: form.title,
      description: form.description || null,
      eventType: form.eventType as never,
      // O `datetime-local` não tem fuso; `new Date` interpreta no fuso de quem
      // preenche, que é justamente o certo — quem marca está no local.
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      allDay: form.allDay,
      location: form.location || null,
      clientId: form.clientId || null,
      attendeeIds: participantes,
    }

    const parsed = createEventSchema.safeParse(payload)
    if (!parsed.success) {
      const campos: Record<string, string> = {}
      for (const issue of parsed.error.issues) campos[String(issue.path[0])] = issue.message
      setErrors(campos)
      return
    }

    try {
      await salvar.mutateAsync({ id: editando?.id, data: parsed.data })
      onClose()
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  async function excluir() {
    if (!editando) return
    try {
      await remover.mutateAsync(editando.id)
      onClose()
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível excluir')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-2xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">
            {editando ? 'Editar compromisso' : 'Novo compromisso'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <Field label="Tipo" required>
            <select
              className={inputClass}
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            >
              {TIPOS.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Título" required error={errors.title}>
            <input
              className={inputClass}
              autoFocus
              placeholder={ehCaptacao ? 'Ex: Gravação da série de depoimentos' : 'Ex: Reunião de alinhamento'}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Início" required error={errors.startAt}>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.startAt}
                onChange={(e) =>
                  // O término acompanha o início: mexer só no começo e deixar
                  // o fim para trás produziria um intervalo inválido.
                  setForm({ ...form, startAt: e.target.value, endAt: somaHoras(e.target.value, 2) })
                }
              />
            </Field>
            <Field label="Término" required error={errors.endAt}>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
              />
            </Field>
          </div>

          {/*
            * O local é destacado na captação porque é o dado que se procura com
            * pressa, saindo de casa. Nos outros tipos continua disponível, mas
            * sem o mesmo peso.
            */}
          <Field
            label={ehCaptacao ? 'Local da gravação' : 'Local'}
            hint={ehCaptacao ? 'Endereço completo — é o que a equipe vai abrir no mapa.' : 'Endereço, sala ou link da chamada.'}
          >
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-ink-400" />
              <input
                className={inputClass}
                placeholder={ehCaptacao ? 'Av. Santos Dumont, 1500 — Aldeota' : 'Sala de reunião / Meet'}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </Field>

          <Field label="Cliente" hint="Compromisso interno pode ficar sem cliente.">
            <select
              className={inputClass}
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">Nenhum (interno)</option>
              {clientes?.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </Field>

          {/*
            * Participante não é enfeite: é QUEM RECEBE o aviso antecipado.
            * Sem ninguém marcado, o compromisso aparece no calendário da
            * agência e não notifica pessoa nenhuma.
            */}
          <Field
            label="Quem vai"
            hint="Recebem o lembrete 7 dias e 1 dia antes. Sem ninguém marcado, não há para quem avisar."
          >
            <div className="flex flex-wrap gap-1.5">
              {equipe?.map((u) => {
                const dentro = participantes.includes(u.id)
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() =>
                      setParticipantes(
                        dentro ? participantes.filter((p) => p !== u.id) : [...participantes, u.id],
                      )
                    }
                    className={
                      dentro
                        ? 'rounded-lg bg-brand-600 px-2.5 py-1.5 text-[12px] font-medium text-pine-950'
                        : 'rounded-lg border border-ink-200 px-2.5 py-1.5 text-[12px] text-ink-600 transition hover:bg-ink-100'
                    }
                  >
                    {u.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Observações">
            <textarea
              rows={3}
              className={inputClass}
              placeholder={ehCaptacao ? 'Equipamento, roteiro, contato no local…' : ''}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          {serverError && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-ink-100 pt-4">
            {editando ? (
              <button
                type="button"
                onClick={excluir}
                disabled={remover.isPending}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 transition hover:text-red-300 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
                Excluir
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvar.isPending}>
                {salvar.isPending && <Spinner />}
                {editando ? 'Salvar' : 'Criar compromisso'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
