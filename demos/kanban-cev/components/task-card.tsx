'use client'

import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MessageSquare, Paperclip, Clock, AlertTriangle, Repeat, CheckSquare, Inbox } from 'lucide-react'
import type { TaskListItem } from '@/demos/kanban-cev/shared'
import { Avatar, Badge } from '@/demos/kanban-cev/components/ui'
import { LabelChip } from '@/demos/kanban-cev/components/labels'
import { formatDeadline, PRIORITY_STYLE } from '@/demos/kanban-cev/lib/format'

export function TaskCardBody({
  task,
  onOpen,
}: {
  task: TaskListItem
  onOpen?: (id: string) => void
}) {
  const priority = PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE.media!

  return (
    <div
      onClick={() => onOpen?.(task.id)}
      className="group cursor-pointer rounded-xl border border-ink-200 bg-surface p-3.5 transition hover:border-ink-300 hover:shadow-sm lg:p-3"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge dotColor={task.taskType.color} className="bg-ink-50 text-ink-600 ring-ink-200">
          {task.taskType.displayName}
        </Badge>
        <Badge className={priority.className}>{priority.label}</Badge>
      </div>

      {/* Acima do título de propósito: a etiqueta é o filtro visual que se lê
          antes de ler o texto, varrendo a coluna de cima a baixo. */}
      {task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <LabelChip key={l.id} label={l} />
          ))}
        </div>
      )}

      <p className="mb-2 text-[15px] leading-snug font-medium text-ink-900 lg:text-[13px]">
        {/* Nasceu de uma regra: o ícone é o que diferencia da demanda avulsa. */}
        {task.recurrenceId && (
          <Repeat
            className="mr-1 inline size-3 shrink-0 align-[-1px] text-brand-600"
            aria-label="Demanda recorrente"
          />
        )}
        {task.title}
      </p>

      {task.client && (
        <p className="mb-2.5 truncate text-[13.5px] text-ink-500 lg:text-[12px]">{task.client.name}</p>
      )}

      <div
        className={clsx(
          'mb-2.5 flex items-center gap-1.5 text-[13.5px] lg:text-[12px]',
          task.isOverdue ? 'font-medium text-red-600' : 'text-ink-500',
        )}
      >
        {task.isOverdue ? (
          <AlertTriangle className="size-3.5" />
        ) : (
          <Clock className="size-3.5" />
        )}
        {formatDeadline(task.deadline)}
      </div>


      <div className="flex items-center justify-between border-t border-ink-100 pt-2.5">
        <div className="flex items-center gap-2.5 text-[12.5px] text-ink-400 lg:text-[11px]">
          {task.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {task.commentCount}
            </span>
          )}
          {task.attachmentCount > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="size-3.5" />
              {task.attachmentCount}
            </span>
          )}
          {/* Fica verde quando fecha: é o sinal de "pode passar de coluna" que
              se lê sem abrir a demanda. */}
          {task.checklist && (
            <span
              className={clsx(
                'flex items-center gap-1 tabular-nums',
                task.checklist.done === task.checklist.total && 'text-emerald-300',
              )}
            >
              <CheckSquare className="size-3.5" />
              {task.checklist.done}/{task.checklist.total}
            </span>
          )}
        </div>
        {/* Sem dono: um marcador de fila no lugar do avatar. O espaço não pode
            ficar vazio — é ele que diz, de relance, que a demanda espera alguém. */}
        {task.assignee ? (
          <Avatar name={task.assignee.name} url={task.assignee.avatarUrl} size={22} />
        ) : (
          <span
            title={task.queue ? `Na fila de ${task.queue.displayName}` : 'Sem responsável'}
            className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30"
          >
            <Inbox className="size-3" />
          </span>
        )}
      </div>
    </div>
  )
}

/** Wrapper arrastável. Separado do corpo para o DragOverlay reutilizar o visual. */
export function SortableTaskCard({
  task,
  onOpen,
}: {
  task: TaskListItem
  onOpen?: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={clsx('touch-none', isDragging && 'opacity-40')}
    >
      <TaskCardBody task={task} onOpen={onOpen} />
    </div>
  )
}
