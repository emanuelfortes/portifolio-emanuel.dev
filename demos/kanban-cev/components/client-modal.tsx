'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createClientSchema } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { useSaveClient } from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'

const VAZIO = {
  name: '',
  segment: '',
  logoUrl: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  anniversary: '',
  status: 'ativo',
}

export function ClientModal({
  open,
  onClose,
  editando,
}: {
  open: boolean
  onClose: () => void
  editando?: any | null
}) {
  const salvar = useSaveClient()
  const [form, setForm] = useState(VAZIO)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setForm(
      editando
        ? {
            name: editando.name ?? '',
            segment: editando.segment ?? '',
            logoUrl: editando.logoUrl ?? '',
            contactName: editando.contactName ?? '',
            contactEmail: editando.contactEmail ?? '',
            contactPhone: editando.contactPhone ?? '',
            anniversary: editando.anniversary ?? '',
            status: editando.status ?? 'ativo',
          }
        : VAZIO,
    )
    setErrors({})
    setServerError(null)
  }, [open, editando])

  if (!open) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    // Campo de texto vazio é "não informado", não string vazia: o schema
    // recusaria `""` num e-mail ou numa URL.
    const payload = {
      name: form.name,
      segment: form.segment || null,
      logoUrl: form.logoUrl || null,
      contactName: form.contactName || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      anniversary: form.anniversary || null,
      status: form.status as never,
    }

    const parsed = createClientSchema.safeParse(payload)
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-2xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">{editando ? 'Editar cliente' : 'Novo cliente'}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <Field label="Nome" required error={errors.name}>
            <input
              className={inputClass}
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Segmento" error={errors.segment}>
              <input
                className={inputClass}
                placeholder="Ex: cafeteria, clínica, e-commerce"
                value={form.segment}
                onChange={(e) => setForm({ ...form, segment: e.target.value })}
              />
            </Field>

            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contato" error={errors.contactName}>
              <input
                className={inputClass}
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              />
            </Field>

            <Field label="E-mail do contato" error={errors.contactEmail}>
              <input
                type="email"
                className={inputClass}
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefone" error={errors.contactPhone}>
              <input
                className={inputClass}
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              />
            </Field>

            <Field
              label="Aniversário da conta"
              hint="Aparece no calendário todo ano"
              error={errors.anniversary}
            >
              <input
                type="date"
                className={inputClass}
                value={form.anniversary}
                onChange={(e) => setForm({ ...form, anniversary: e.target.value })}
              />
            </Field>
          </div>

          <Field label="URL do logo" error={errors.logoUrl}>
            <input
              className={inputClass}
              placeholder="https://..."
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
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
            <Button type="submit" disabled={salvar.isPending}>
              {salvar.isPending && <Spinner />}
              {editando ? 'Salvar' : 'Criar cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
