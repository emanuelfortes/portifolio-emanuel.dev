'use client'

import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import type { TaskListItem } from '@/demos/kanban-cev/shared'
import { qk } from '@/demos/kanban-cev/lib/api'
import { useChangeStatus, useReorderTask, type BoardColumn } from '@/demos/kanban-cev/lib/hooks'
import { SortableTaskCard, TaskCardBody } from '@/demos/kanban-cev/components/task-card'

/**
 * Kanban com ordenação manual.
 *
 * A UI atualiza em zero milissegundo (optimistic update no cache do
 * TanStack Query) e só depois o servidor confirma. O rank fracionário
 * (correção 5.8) faz cada movimento virar UM update de UMA linha, sem
 * reescrever a coluna e sem conflito quando duas pessoas arrastam ao mesmo
 * tempo.
 */
export function KanbanBoard({
  columns,
  queryKey,
  onOpenTask,
}: {
  columns: BoardColumn[]
  queryKey: readonly unknown[]
  onOpenTask?: (id: string) => void
}) {
  const qc = useQueryClient()
  const changeStatus = useChangeStatus()
  const reorder = useReorderTask()
  const [dragging, setDragging] = useState<TaskListItem | null>(null)

  const sensors = useSensors(
    // 6px de tolerância: distingue clique de arrasto sem atrapalhar o toque.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const taskById = useMemo(() => {
    const map = new Map<string, TaskListItem>()
    for (const col of columns) for (const t of col.tasks) map.set(t.id, t)
    return map
  }, [columns])

  function onDragStart(e: DragStartEvent) {
    setDragging(taskById.get(String(e.active.id)) ?? null)
  }

  function onDragEnd(e: DragEndEvent) {
    setDragging(null)
    const { active, over } = e
    if (!over) return

    const activeId = String(active.id)
    const task = taskById.get(activeId)
    if (!task) return

    // O alvo pode ser uma coluna vazia (id = slug) ou outro card.
    const overId = String(over.id)
    const overTask = taskById.get(overId)
    const targetStatus = overTask?.status ?? overId

    const targetColumn = columns.find((c) => c.slug === targetStatus)
    if (!targetColumn) return

    // Lista da coluna de destino sem o card arrastado.
    const list = targetColumn.tasks.filter((t) => t.id !== activeId)
    const overIndex = overTask ? list.findIndex((t) => t.id === overId) : list.length

    // dnd-kit entrega o card sobre o qual soltamos. Inserimos ANTES dele,
    // exceto quando arrastamos de cima para baixo na mesma coluna.
    const movingDown =
      task.status === targetStatus &&
      targetColumn.tasks.findIndex((t) => t.id === activeId) < (overIndex === -1 ? list.length : overIndex)

    const insertAt = overIndex === -1 ? list.length : movingDown ? overIndex + 1 : overIndex

    const beforeId = insertAt > 0 ? (list[insertAt - 1]?.id ?? null) : null
    const afterId = list[insertAt]?.id ?? null

    if (beforeId === activeId || afterId === activeId) return
    if (task.status === targetStatus && beforeId === null && afterId === null) return

    // ---- optimistic update: a UI já mostra o resultado final ----
    const previous = qc.getQueryData(queryKey)
    qc.setQueryData(queryKey, (old: { columns: BoardColumn[] } | undefined) => {
      if (!old) return old
      const moved = { ...task, status: targetStatus }
      return {
        columns: old.columns.map((col) => {
          if (col.slug === task.status && col.slug === targetStatus) {
            const without = col.tasks.filter((t) => t.id !== activeId)
            without.splice(insertAt, 0, moved)
            return { ...col, tasks: without }
          }
          if (col.slug === task.status) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== activeId) }
          }
          if (col.slug === targetStatus) {
            const next = [...col.tasks]
            next.splice(insertAt, 0, moved)
            return { ...col, tasks: next }
          }
          return col
        }),
      }
    })

    const rollback = () => qc.setQueryData(queryKey, previous)

    if (task.status === targetStatus) {
      reorder.mutate({ id: activeId, beforeId, afterId }, { onError: rollback })
    } else {
      changeStatus.mutate(
        { id: activeId, status: targetStatus, beforeId, afterId },
        { onError: rollback },
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <div className="thin-scroll flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <Column
            key={col.slug}
            column={col}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2,0,0,1)' }}>
        {dragging && (
          <div className="w-72 rotate-1 opacity-95 shadow-lg">
            <TaskCardBody task={dragging} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function Column({
  column,
  onOpenTask,
}: {
  column: BoardColumn
  onOpenTask?: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.slug })
  const ids = column.tasks.map((t) => t.id)

  return (
    <section className="flex w-72 shrink-0 flex-col">
      <header className="mb-2.5 flex items-center gap-2 px-1">
        <span className="size-2 rounded-full" style={{ background: column.color }} aria-hidden />
        <h3 className="text-[13px] font-semibold text-ink-800">{column.displayName}</h3>
        <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
          {column.tasks.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`thin-scroll min-h-32 flex-1 space-y-2.5 overflow-y-auto rounded-xl p-1 transition ${
          isOver ? 'bg-brand-50 ring-1 ring-brand-500/30 ring-inset' : ''
        }`}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onOpen={onOpenTask}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <p className="rounded-lg border border-dashed border-ink-200 px-3 py-6 text-center text-[12px] text-ink-400">
            Arraste uma demanda para cá
          </p>
        )}
      </div>
    </section>
  )
}
