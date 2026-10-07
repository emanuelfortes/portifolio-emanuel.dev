'use client'

import { useState } from 'react'
import { Plus, Pencil, UserX, UserCheck, Check } from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { Avatar, Badge, Button, EmptyState, Spinner } from '@/demos/kanban-cev/components/ui'
import { UserModal } from '@/demos/kanban-cev/components/user-modal'
import { PainelChecklists } from '@/demos/kanban-cev/components/painel-checklists'
import { PainelConfiguracao } from '@/demos/kanban-cev/components/painel-configuracao'
import {
  useAdminOverview,
  useDelegationMatrix,
  useSetDelegation,
  useTeam,
  useUsersPerformance,
  useDeactivateUser,
  useSaveUser,
  useMe,
  type TeamMember,
} from '@/demos/kanban-cev/lib/hooks'

type Aba = 'visao' | 'equipe' | 'delegacao' | 'desempenho' | 'checklists' | 'configuracao'

export default function AdminPage() {
  const { data: me } = useMe()
  const [aba, setAba] = useState<Aba>('visao')
  const [period, setPeriod] = useState('month')

  const podeVerTudo = !!me && (me.isAdmin || me.permissions.includes('task:view_all' as never))

  if (me && !podeVerTudo) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <EmptyState
            title="Sem acesso"
            description="Esta área é da coordenação e da administração."
          />
        </div>
      </Shell>
    )
  }

  const abas: { id: Aba; label: string }[] = [
    { id: 'visao', label: 'Visão geral' },
    { id: 'equipe', label: 'Equipe' },
    { id: 'delegacao', label: 'Delegação' },
    { id: 'desempenho', label: 'Desempenho' },
    { id: 'checklists', label: 'Checklists' },
    { id: 'configuracao', label: 'Configuração' },
  ]

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900">Administração</h1>
            <p className="mt-0.5 text-[13px] text-ink-500">
              Números da agência, equipe e quem pode delegar para quem.
            </p>
          </div>

          {aba !== 'equipe' && aba !== 'delegacao' && (
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-ink-200 bg-surface px-2.5 py-1.5 text-[13px] text-ink-700"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último ano</option>
            </select>
          )}
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-1 rounded-lg bg-ink-100 p-1">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={clsx(
                'rounded-md px-3 py-1.5 text-[13px] font-medium transition',
                aba === a.id ? 'bg-surface text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800',
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        {aba === 'visao' && <VisaoGeral period={period} />}
        {aba === 'equipe' && <Equipe />}
        {aba === 'delegacao' && <Delegacao />}
        {aba === 'desempenho' && <Desempenho period={period} />}
        {aba === 'checklists' && <PainelChecklists />}
        {aba === 'configuracao' && <PainelConfiguracao />}
      </div>
    </Shell>
  )
}

/* -------------------------------------------------------------- visão geral */

function VisaoGeral({ period }: { period: string }) {
  const { data, isLoading } = useAdminOverview(period)

  if (isLoading) return <Carregando />
  if (!data) return null

  const maiorSemana = Math.max(1, ...data.byWeek.map((w: any) => Math.max(w.criadas, w.concluidas)))
  const maiorCarga = Math.max(1, ...data.workload.map((w: any) => w.abertas))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metrica label="Total no período" value={data.totals.total} />
        <Metrica label="Em aberto" value={data.totals.abertas} />
        <Metrica label="Concluídas" value={data.totals.concluidas} />
        <Metrica label="Atrasadas" value={data.totals.atrasadas} tone="danger" />
        <Metrica
          label="No prazo"
          value={data.totals.completedOnTimeRate != null ? `${data.totals.completedOnTimeRate}%` : '—'}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Bloco titulo="Por status">
          {data.byStatus.length === 0 && <Vazio>Nenhuma demanda no período.</Vazio>}
          <div className="space-y-2.5">
            {data.byStatus.map((s: any) => {
              const pct = data.totals.total ? Math.round((s.count / data.totals.total) * 100) : 0
              return (
                <div key={s.status}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-ink-700">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: s.color ?? '#94a3b8' }}
                      />
                      {s.displayName}
                    </span>
                    <span className="tabular-nums text-ink-500">
                      {s.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: s.color ?? '#94a3b8' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Bloco>

        <Bloco titulo="Carga de trabalho agora">
          <p className="mb-3 text-[11px] text-ink-500">
            Demandas em aberto hoje, não no período: é a fila de quem vai receber a próxima.
          </p>
          <div className="space-y-2">
            {data.workload.map((w: any) => (
              <div key={w.userId} className="flex items-center gap-2.5">
                <Avatar name={w.name} url={w.avatarUrl} size={24} />
                <span className="w-28 shrink-0 truncate text-[12px] text-ink-700">{w.name}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-ink-100">
                  <div
                    className={clsx('h-full', w.atrasadas > 0 ? 'bg-red-400' : 'bg-brand-500')}
                    style={{ width: `${(w.abertas / maiorCarga) * 100}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-ink-600">
                  {w.abertas}
                  {w.atrasadas > 0 && <span className="text-red-600"> ({w.atrasadas})</span>}
                </span>
              </div>
            ))}
          </div>
        </Bloco>
      </div>

      <Bloco titulo="Criadas x concluídas por semana">
        {data.byWeek.length === 0 ? (
          <Vazio>Sem dados no período.</Vazio>
        ) : (
          <div className="flex items-end gap-3 overflow-x-auto pb-2">
            {data.byWeek.map((w: any) => (
              <div key={w.semana} className="flex min-w-14 flex-col items-center gap-1">
                <div className="flex h-28 items-end gap-1">
                  <div
                    className="w-4 rounded-t bg-ink-300"
                    style={{ height: `${(w.criadas / maiorSemana) * 100}%` }}
                    title={`${w.criadas} criadas`}
                  />
                  <div
                    className="w-4 rounded-t bg-brand-500"
                    style={{ height: `${(w.concluidas / maiorSemana) * 100}%` }}
                    title={`${w.concluidas} concluídas`}
                  />
                </div>
                <span className="text-[10px] text-ink-400">{w.semana.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex gap-4 text-[11px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-ink-300" /> criadas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand-500" /> concluídas
          </span>
        </div>
      </Bloco>
    </div>
  )
}

/* -------------------------------------------------------------- equipe */

function Equipe() {
  const { data: me } = useMe()
  const { data: equipe, isLoading } = useTeam(true)
  const { data: papeis } = useDelegationMatrix()
  const desativar = useDeactivateUser()
  const salvar = useSaveUser()
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<TeamMember | null>(null)

  const podeGerenciar = !!me?.isAdmin || !!me?.permissions.includes('user:manage' as never)

  if (isLoading) return <Carregando />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-ink-500">
          {equipe?.filter((u) => u.isActive).length ?? 0} pessoas ativas
        </p>
        {podeGerenciar && (
          <Button
            onClick={() => {
              setEditando(null)
              setModalAberto(true)
            }}
          >
            <Plus className="size-4" />
            Novo colaborador
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-surface">
        <table className="w-full text-[13px]">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-left text-[11px] tracking-wide text-ink-500 uppercase">
            <tr>
              <th className="px-4 py-2.5 font-medium">Pessoa</th>
              <th className="px-4 py-2.5 font-medium">Função</th>
              <th className="px-4 py-2.5 font-medium">Situação</th>
              {podeGerenciar && <th className="px-4 py-2.5" />}
            </tr>
          </thead>
          <tbody>
            {equipe?.map((u) => (
              <tr
                key={u.id}
                className={clsx('border-b border-ink-50 last:border-0', !u.isActive && 'opacity-55')}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={u.name} url={u.avatarUrl} size={28} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{u.name}</p>
                      <p className="truncate text-[11px] text-ink-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-ink-600">{u.roleDisplayName}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {u.isAdmin && (
                      <Badge className="bg-violet-400/15 text-violet-200 ring-violet-300/25">
                        Admin
                      </Badge>
                    )}
                    <Badge
                      className={
                        u.isActive
                          ? 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/25'
                          : 'bg-ink-100 text-ink-600 ring-ink-300'
                      }
                    >
                      {u.isActive ? 'Ativo' : 'Desativado'}
                    </Badge>
                  </div>
                </td>
                {podeGerenciar && (
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditando(u)
                          setModalAberto(true)
                        }}
                        title="Editar"
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                      >
                        <Pencil className="size-4" />
                      </button>
                      {u.id !== me?.id &&
                        (u.isActive ? (
                          <button
                            onClick={() => desativar.mutate(u.id)}
                            title="Desativar"
                            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-500/12 hover:text-red-600"
                          >
                            <UserX className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => salvar.mutate({ id: u.id, data: { isActive: true } })}
                            title="Reativar"
                            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-emerald-500/12 hover:text-emerald-600"
                          >
                            <UserCheck className="size-4" />
                          </button>
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        editando={editando}
        papeis={papeis?.roles ?? []}
      />
    </>
  )
}

/* -------------------------------------------------------------- delegação */

function Delegacao() {
  const { data, isLoading } = useDelegationMatrix()
  const definir = useSetDelegation()

  if (isLoading) return <Carregando />
  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-brand-50/60 px-4 py-3 text-[13px] text-ink-700 ring-1 ring-inset ring-brand-600/15">
        Cada linha é quem <strong>cria</strong> a demanda; cada coluna, quem <strong>recebe</strong>.
        Marcar uma célula libera a delegação na hora, sem deploy — é um registro em
        <code className="mx-1 rounded bg-surface px-1 py-0.5 text-[12px]">role_assignment_rules</code>.
        Criar demanda para si mesmo é sempre permitido e não aparece na grade.
        {!data.canEdit && <strong className="block mt-1">Você só tem acesso de leitura.</strong>}
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-surface">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60">
              <th className="px-4 py-2.5 text-left text-[11px] tracking-wide text-ink-500 uppercase">
                Cria ↓ / Recebe →
              </th>
              {data.roles.map((r) => (
                <th
                  key={r.id}
                  className="px-2 py-2.5 text-center text-[11px] font-medium text-ink-600"
                >
                  {r.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.matrix.map((linha) => {
              const de = data.roles.find((r) => r.id === linha.fromRoleId)!
              return (
                <tr key={linha.fromRoleId} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-2 font-medium text-ink-800">{de.displayName}</td>
                  {linha.targets.map((alvo) => {
                    const mesmo = alvo.toRoleId === linha.fromRoleId
                    return (
                      <td key={alvo.toRoleId} className="px-2 py-2 text-center">
                        {mesmo ? (
                          <span className="text-ink-300" title="Sempre permitido">
                            —
                          </span>
                        ) : (
                          <button
                            disabled={!data.canEdit || definir.isPending}
                            onClick={() =>
                              definir.mutate({
                                fromRoleId: linha.fromRoleId,
                                toRoleId: alvo.toRoleId,
                                allowed: !alvo.allowed,
                              })
                            }
                            className={clsx(
                              'inline-flex size-6 items-center justify-center rounded-md ring-1 ring-inset transition',
                              alvo.allowed
                                ? 'bg-brand-600 text-pine-950 ring-brand-600'
                                : 'bg-surface text-transparent ring-ink-200 hover:bg-ink-50',
                              (!data.canEdit || definir.isPending) && 'cursor-not-allowed opacity-60',
                            )}
                            title={alvo.allowed ? 'Permitido — clique para remover' : 'Clique para permitir'}
                          >
                            <Check className="size-3.5" />
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- desempenho */

function Desempenho({ period }: { period: string }) {
  const { data, isLoading } = useUsersPerformance(period)

  if (isLoading) return <Carregando />
  if (!data) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 bg-surface">
      <table className="w-full text-[13px]">
        <thead className="border-b border-ink-100 bg-ink-50/60 text-left text-[11px] tracking-wide text-ink-500 uppercase">
          <tr>
            <th className="px-4 py-2.5 font-medium">Pessoa</th>
            <th className="px-3 py-2.5 text-right font-medium">Total</th>
            <th className="px-3 py-2.5 text-right font-medium">Concluídas</th>
            <th className="px-3 py-2.5 text-right font-medium">Abertas</th>
            <th className="px-3 py-2.5 text-right font-medium">Atrasadas</th>
            <th className="px-3 py-2.5 text-right font-medium">No prazo</th>
            <th className="px-3 py-2.5 text-right font-medium">Tempo médio</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r: any) => (
            <tr key={r.userId} className="border-b border-ink-50 last:border-0">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={r.name} url={r.avatarUrl} size={26} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{r.name}</p>
                    <p className="truncate text-[11px] text-ink-500">{r.roleDisplayName}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink-700">{r.total}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink-700">{r.completed}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink-700">{r.open}</td>
              <td
                className={clsx(
                  'px-3 py-2.5 text-right tabular-nums',
                  r.overdue > 0 ? 'font-medium text-red-600' : 'text-ink-400',
                )}
              >
                {r.overdue}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink-700">
                {r.completedOnTimeRate != null ? `${r.completedOnTimeRate}%` : '—'}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink-700">
                {r.avgCompletionHours != null ? `${r.avgCompletionHours}h` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -------------------------------------------------------------- comuns */

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <h2 className="mb-3 text-[13px] font-semibold text-ink-800">{titulo}</h2>
      {children}
    </section>
  )
}

function Metrica({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number | string
  tone?: 'default' | 'danger'
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-surface p-4">
      <p className="text-[11px] font-medium tracking-wide text-ink-500 uppercase">{label}</p>
      <p
        className={clsx(
          'mt-1.5 text-2xl font-semibold tabular-nums',
          tone === 'danger' && value ? 'text-red-600' : 'text-ink-900',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function Carregando() {
  return (
    <div className="flex justify-center py-20">
      <Spinner className="text-ink-400" />
    </div>
  )
}

function Vazio({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-ink-400">{children}</p>
}
