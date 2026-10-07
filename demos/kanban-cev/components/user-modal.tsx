'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import { X, KeyRound } from 'lucide-react'
import clsx from 'clsx'
import { createUserSchema, updateUserSchema } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import {
  useSaveUser,
  useResetUserPassword,
  useSetUserRoles,
  useMe,
  type TeamMember,
} from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'
import { FotoPerfil } from '@/demos/kanban-cev/components/foto-perfil'

export function UserModal({
  open,
  onClose,
  editando,
  papeis,
}: {
  open: boolean
  onClose: () => void
  editando?: TeamMember | null
  papeis: { id: number; displayName: string }[]
}) {
  const { data: me } = useMe()
  const qc = useQueryClient()
  const salvar = useSaveUser()
  const salvarFuncoes = useSetUserRoles()
  const trocarSenha = useResetUserPassword()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    isAdmin: false,
    birthday: '',
    /** Funções adicionais. A principal é `roleId` e não entra aqui. */
    extraRoleIds: [] as number[],
  })
  const [novaSenha, setNovaSenha] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setForm({
      name: editando?.name ?? '',
      email: editando?.email ?? '',
      password: '',
      roleId: editando ? String(editando.roleId) : (papeis[0] ? String(papeis[0].id) : ''),
      isAdmin: editando?.isAdmin ?? false,
      birthday: editando?.birthday ?? '',
      extraRoleIds: editando?.extraRoleIds ?? [],
    })
    setNovaSenha('')
    setErrors({})
    setServerError(null)
    setAviso(null)
  }, [open, editando, papeis])

  if (!open) return null

  const editandoASiMesmo = !!editando && editando.id === me?.id

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const base = {
      name: form.name,
      email: form.email,
      roleId: Number(form.roleId),
      isAdmin: form.isAdmin,
      birthday: form.birthday || null,
    }

    const parsed = editando
      ? updateUserSchema.safeParse(base)
      : createUserSchema.safeParse({ ...base, password: form.password })

    if (!parsed.success) {
      const campos: Record<string, string> = {}
      for (const issue of parsed.error.issues) campos[String(issue.path[0])] = issue.message
      setErrors(campos)
      return
    }

    try {
      await salvar.mutateAsync({ id: editando?.id, data: parsed.data })

      /**
       * As funções adicionais vão numa chamada à parte, DEPOIS do cadastro.
       *
       * Elas vivem noutra tabela e o `PATCH /users/:id` não as conhece — juntar
       * as duas num endpoint só faria o cadastro passar a saber de uma tabela
       * que não é dele. Só na edição: na criação a pessoa ainda não existe para
       * receber as linhas de ligação.
       */
      if (editando) {
        await salvarFuncoes.mutateAsync({ id: editando.id, roleIds: form.extraRoleIds })
      }

      onClose()
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  async function redefinirSenha() {
    if (!editando || novaSenha.length < 8) return
    setServerError(null)
    try {
      await trocarSenha.mutateAsync({ id: editando.id, password: novaSenha })
      setAviso('Senha redefinida. As sessões desta pessoa foram encerradas.')
      setNovaSenha('')
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível redefinir')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-lg rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">
            {editando ? 'Editar colaborador' : 'Novo colaborador'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          {/*
            * A foto só aparece na EDIÇÃO: o upload precisa do id da pessoa
            * para montar a chave no S3, e na criação ela ainda não existe.
            * Quem acabou de criar reabre e põe a foto.
            */}
          {editando && (
            <FotoPerfil
              escopo="users"
              id={editando.id}
              nome={editando.name}
              urlAtual={editando.avatarUrl ?? null}
              podeEditar
              size={72}
              /* Prefixo `['team']`: a chave real carrega o filtro de inativos,
                 e invalidar por prefixo alcança as duas variantes. */
              onTrocou={() => qc.invalidateQueries({ queryKey: ['team'] })}
            />
          )}

          <Field label="Nome" required error={errors.name}>
            <input
              className={inputClass}
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label="E-mail" required error={errors.email} hint="É com ele que a pessoa entra">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          {!editando && (
            <Field
              label="Senha inicial"
              required
              error={errors.password}
              hint="Mínimo de 8 caracteres. A pessoa pode trocar depois."
            >
              <input
                type="text"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Função" required error={errors.roleId}>
              <select
                className={inputClass}
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              >
                {papeis.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.displayName}
                  </option>
                ))}
              </select>
            </Field>

            {/**
              * Funções ADICIONAIS, só na edição.
              *
              * Na criação o cargo basta — e a pessoa ainda não existe para
              * receber as linhas da tabela de ligação. Quem acumula funções
              * ganha as outras depois, que é como acontece na vida: primeiro
              * se contrata para um cargo, depois se descobre que ela também
              * edita vídeo.
              *
              * A principal não aparece aqui: guardá-la nos dois lugares criaria
              * duas verdades para o mesmo fato, e o dia em que o cargo mudasse
              * a linha antiga ficaria para trás.
              */}
            {editando && (
              <div className="sm:col-span-2">
                <Field
                  label="Também exerce"
                  hint="Entra na fila destas funções, recebe os avisos delas e aparece nos grupos delas ao atribuir demanda"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {papeis
                      .filter((r) => String(r.id) !== form.roleId)
                      .map((r) => {
                        const marcado = form.extraRoleIds.includes(r.id)
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                extraRoleIds: marcado
                                  ? form.extraRoleIds.filter((x) => x !== r.id)
                                  : [...form.extraRoleIds, r.id],
                              })
                            }
                            className={clsx(
                              'rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium ring-1 ring-inset transition',
                              marcado
                                ? 'bg-brand-600/15 text-brand-700 ring-brand-600/40'
                                : 'bg-overlay/5 text-ink-600 ring-overlay/10 hover:text-ink-900',
                            )}
                          >
                            {r.displayName}
                          </button>
                        )
                      })}
                  </div>
                </Field>
              </div>
            )}

            <Field label="Aniversário" hint="Aparece no calendário" error={errors.birthday}>
              <input
                type="date"
                className={inputClass}
                value={form.birthday}
                onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              />
            </Field>
          </div>

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500/30"
              checked={form.isAdmin}
              disabled={editandoASiMesmo}
              onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
            />
            <span className="text-[13px] text-ink-700">
              Administrador
              <span className="block text-[11px] text-ink-500">
                Ignora a matriz de delegação, exclui demandas e gerencia a equipe.
                {editandoASiMesmo && ' Você não pode remover o próprio acesso.'}
              </span>
            </span>
          </label>

          {serverError && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
              {serverError}
            </div>
          )}

          {aviso && (
            <div className="rounded-lg bg-emerald-500/12 px-3 py-2.5 text-[13px] text-emerald-200 ring-1 ring-inset ring-emerald-400/25">
              {aviso}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvar.isPending}>
              {salvar.isPending && <Spinner />}
              {editando ? 'Salvar' : 'Criar colaborador'}
            </Button>
          </div>
        </form>

        {editando && (
          <div className="border-t border-ink-100 bg-ink-50/60 px-6 py-4">
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-ink-800">
              <KeyRound className="size-3.5" />
              Redefinir senha
            </p>
            <p className="mb-2.5 text-[11px] text-ink-500">
              Enquanto não existe recuperação por e-mail, é assim que se destrava quem esqueceu a
              senha. Encerra as sessões abertas da pessoa.
            </p>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Nova senha (mínimo 8 caracteres)"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={redefinirSenha}
                disabled={novaSenha.length < 8 || trocarSenha.isPending}
              >
                {trocarSenha.isPending && <Spinner />}
                Redefinir
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
