'use client'

import { useState } from 'react'
import { Plus, Repeat, Pause, Play, Pencil, Trash2, Zap } from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { RecurrenceModal } from '@/demos/kanban-cev/components/recurrence-modal'
import { Badge, Button, EmptyState, Spinner } from '@/demos/kanban-cev/components/ui'
import {
  useAssignableUsers,
  useClients,
  useDeleteRecurrence,
  useRecurrences,
  useRunRecurrence,
  useUpdateRecurrence,
  type Recurrence,
} from '@/demos/kanban-cev/lib/hooks'
import { formatDeadline, relativeTime, PRIORITY_STYLE } from '@/demos/kanban-cev/lib/format'

export default function RecorrenciasPage() {
  const { data, isLoading } = useRecurrences()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Recurrence | null>(null)

  function abrirNova() {
    setEditando(null)
    setModalOpen(true)
  }

  function abrirEdicao(rec: Recurrence) {
    setEditando(rec)
    setModalOpen(true)
  }

  const ativas = data?.filter((r) => r.isActive) ?? []
  const pausadas = data?.filter((r) => !r.isActive) ?? []

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900">Recorrências</h1>
            <p className="mt-0.5 max-w-xl text-[13px] text-ink-500">
              O que se repete toda semana é cadastrado uma vez. O sistema cria a demanda sozinho,
              todo dia às 06:00, com a antecedência que você definir.
            </p>
          </div>

          <Button onClick={abrirNova}>
            <Plus className="size-4" />
            Nova recorrência
          </Button>
        </header>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="text-ink-400" />
          </div>
        )}

        {data && data.length === 0 && (
          <EmptyState
            icon={<Repeat className="size-8" />}
            title="Nenhuma demanda recorrente ainda"
            description="Relatório semanal, reunião de pauta, fechamento mensal: cadastre uma vez e pare de recadastrar toda semana."
            action={
              <Button onClick={abrirNova}>
                <Plus className="size-4" />
                Criar a primeira
              </Button>
            }
          />
        )}

        {ativas.length > 0 && (
          <section className="space-y-3">
            {ativas.map((rec) => (
              <RecurrenceCard key={rec.id} rec={rec} onEdit={() => abrirEdicao(rec)} />
            ))}
          </section>
        )}

        {pausadas.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-ink-500 uppercase">
              Pausadas
            </h2>
            <div className="space-y-3">
              {pausadas.map((rec) => (
                <RecurrenceCard key={rec.id} rec={rec} onEdit={() => abrirEdicao(rec)} />
              ))}
            </div>
          </section>
        )}
      </div>

      <RecurrenceModal open={modalOpen} onClose={() => setModalOpen(false)} editando={editando} />
    </Shell>
  )
}

function RecurrenceCard({ rec, onEdit }: { rec: Recurrence; onEdit: () => void }) {
  const { data: assignable } = useAssignableUsers()
  const { data: clients } = useClients()
  const atualizar = useUpdateRecurrence()
  const excluir = useDeleteRecurrence()
  const gerar = useRunRecurrence()
  const [confirmando, setConfirmando] = useState(false)

  const responsavel = assignable?.find((u) => u.id === rec.template.assigneeId)
  const cliente = clients?.find((c) => c.id === rec.template.clientId)
  const prioridade = PRIORITY_STYLE[rec.template.priority]

  /**
   * No modo cronograma o `assigneeId` NÃO é o responsável — é só o dono
   * nominal da regra. Quem recebe é calculado na hora de gerar, a partir de
   * quem tem cliente sob responsabilidade.
   *
   * Mostrar o nome sozinho fazia a regra parecer de uma pessoa só: um
   * cronograma que gera para três social medias aparecia como "Ana Lima", e a
   * leitura óbvia era que as outras duas tinham ficado de fora. Aqui se diz o
   * que a regra faz, e quantas pessoas alcança.
   */
  const porSocialMedia =
    rec.template.porResponsavelDeClientes === true &&
    rec.template.checklistDeVerificacao !== true

  const quantosSociais = new Set(
    (clients ?? [])
      .filter((c) => c.status === 'ativo')
      .flatMap((c) => c.socialMediaIds ?? []),
  ).size

  return (
    <article
      className={clsx(
        'rounded-xl border bg-surface p-4 transition',
        rec.isActive ? 'border-ink-200' : 'border-ink-200 bg-ink-50/60 opacity-75',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-ink-900">{rec.template.title}</h3>
            {prioridade && <Badge className={prioridade.className}>{prioridade.label}</Badge>}
            {!rec.isActive && <Badge>Pausada</Badge>}
          </div>

          <p className="text-[13px] text-ink-700">
            <Repeat className="mr-1.5 inline size-3.5 text-brand-600" />
            {rec.description}
          </p>
          <p className="mt-0.5 text-[12px] text-ink-500">{rec.schedule}</p>

          <p className="mt-2 text-[12px] text-ink-500">
            {porSocialMedia ? (
              <>
                Uma para cada social media
                {quantosSociais > 0 && ` · ${quantosSociais} ${quantosSociais === 1 ? 'pessoa' : 'pessoas'}`}
              </>
            ) : (
              <>
                {responsavel?.name ?? 'Responsável'}
                {cliente && ` · ${cliente.name}`}
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            title={rec.isActive ? 'Pausar' : 'Retomar'}
            onClick={() =>
              atualizar.mutate({ id: rec.id, patch: { isActive: !rec.isActive } })
            }
            disabled={atualizar.isPending}
          >
            {rec.isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
          </IconButton>

          <IconButton
            title="Gerar a próxima agora, sem esperar as 06:00"
            onClick={() => gerar.mutate(rec.id)}
            disabled={gerar.isPending}
          >
            <Zap className="size-4" />
          </IconButton>

          <IconButton title="Editar" onClick={onEdit}>
            <Pencil className="size-4" />
          </IconButton>

          <IconButton
            title="Excluir"
            onClick={() => setConfirmando(true)}
            className="hover:bg-red-500/12 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>

      {rec.isActive && rec.nextDeadlines.length > 0 && (
        <div className="mt-3 border-t border-ink-100 pt-3">
          <p className="text-[12px] text-ink-500">
            <span className="font-medium text-ink-700">Próximos prazos:</span>{' '}
            {rec.nextDeadlines.map((d) => formatDeadline(d)).join(' · ')}
          </p>
          <p className="mt-0.5 text-[12px] text-ink-400">
            A próxima demanda nasce {relativeTime(rec.nextRunAt)}
          </p>
        </div>
      )}

      {confirmando && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/12 px-3 py-2.5 ring-1 ring-inset ring-red-400/25">
          <p className="text-[13px] text-red-200">
            Excluir esta recorrência? As demandas já criadas por ela continuam no quadro.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => excluir.mutate(rec.id)}
              disabled={excluir.isPending}
            >
              {excluir.isPending && <Spinner />}
              Excluir
            </Button>
          </div>
        </div>
      )}
    </article>
  )
}

function IconButton({
  children,
  title,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  )
}
