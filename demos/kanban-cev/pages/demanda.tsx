'use client'

import { useState } from 'react'
import Link from '@/demos/kanban-cev/lib/nav'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import {
  ArrowLeft,
  Pencil,
  Clock,
  AlertTriangle,
  Repeat,
  Send,
  MessageSquare,
  History,
  Paperclip,
  Upload,
  Trash2,
  Inbox,
  HandMetal,
  Undo2,
} from 'lucide-react'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import clsx from 'clsx'
import {
  ALLOWED_ATTACHMENT_MIME,
  MAX_ATTACHMENT_BYTES,
  TASK_TYPE_CRONOGRAMA,
  type LabelRef,
} from '@/demos/kanban-cev/shared'
import { ApiError, qk } from '@/demos/kanban-cev/lib/api'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { Checklist } from '@/demos/kanban-cev/components/checklist'
import { Cronograma } from '@/demos/kanban-cev/components/cronograma'
import { LabelPicker } from '@/demos/kanban-cev/components/labels'
import { ImageLightbox } from '@/demos/kanban-cev/components/image-lightbox'
import { Markdown } from '@/demos/kanban-cev/components/markdown'
import { MarkdownEditor } from '@/demos/kanban-cev/components/markdown-editor'
import { EditarDemandaModal } from '@/demos/kanban-cev/components/editar-demanda-modal'
import { Avatar, Badge, Button, EmptyState, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'
import {
  useTask,
  useTaskComments,
  type TaskComment,
  useTaskActivity,
  useTaskOrigin,
  useAddComment,
  useClaimTask,
  useReleaseTask,
  useChangeStatus,
  useStatuses,
  useAttachments,
  enviarAnexo,
  useUpdateTask,
  useUpdateComment,
  useDeleteAttachment,
  baixarAnexo,
  useMe,
  useSetTaskLabels,
  useDeleteTask,
} from '@/demos/kanban-cev/lib/hooks'
import { formatDeadline, relativeTime, PRIORITY_STYLE } from '@/demos/kanban-cev/lib/format'

export default function DemandaPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  const task = useTask(id)
  const origem = useTaskOrigin(id, !!task.data?.recurrenceId)
  const [editandoDemanda, setEditandoDemanda] = useState(false)

  if (task.isLoading) {
    return (
      <Shell>
        <div className="flex justify-center py-24">
          <Spinner className="text-ink-400" />
        </div>
      </Shell>
    )
  }

  if (task.error || !task.data) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <EmptyState
            title="Demanda não encontrada"
            description="Ela pode ter sido excluída, ou você não tem acesso a ela."
            action={<Button onClick={() => router.push('/eu')}>Voltar ao painel</Button>}
          />
        </div>
      </Shell>
    )
  }

  const t = task.data
  const prioridade = PRIORITY_STYLE[t.priority] ?? PRIORITY_STYLE.media!

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition hover:text-ink-800"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>

        <header className="mb-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge dotColor={t.taskType.color} className="bg-ink-50 text-ink-600 ring-ink-200">
              {t.taskType.displayName}
            </Badge>
            <Badge className={prioridade.className}>{prioridade.label}</Badge>
            {t.client && <Badge>{t.client.name}</Badge>}
            {origem.data && <OrigemBadge origem={origem.data} />}
          </div>

          <div className="flex items-start justify-between gap-3">
            <TituloDaDemanda id={id} titulo={t.title} podeEditar={t.can.edit} />

            {/* `can.delete` vem resolvido do backend — a tela não recalcula a
                regra, senão as duas divergiriam na primeira mudança. */}
            <div className="flex shrink-0 items-center gap-1">
              {/* Só quem pode editar vê o lápis. A regra vem resolvida do
                  backend em can.edit; a tela não a recalcula. */}
              {t.can.edit && (
                <button
                  onClick={() => setEditandoDemanda(true)}
                  title="Editar demanda"
                  className="rounded-lg p-2 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
                >
                  <Pencil className="size-4" />
                </button>
              )}
              {t.can.delete && <ExcluirDemanda id={id} titulo={t.title} />}
            </div>
          </div>

          <div
            className={clsx(
              'mt-2 flex items-center gap-1.5 text-[13px]',
              t.isOverdue ? 'font-medium text-red-600' : 'text-ink-500',
            )}
          >
            {t.isOverdue ? <AlertTriangle className="size-4" /> : <Clock className="size-4" />}
            {formatDeadline(t.deadline)}
            {t.isOverdue && ' · atrasada'}
          </div>
        </header>

        {origem.data && <OrigemCard origem={origem.data} />}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <StatusSelector task={t} />

            {t.description && (
              <Bloco titulo="Descrição">
                <Markdown>{t.description}</Markdown>
              </Bloco>
            )}

            {t.observations && (
              <Bloco titulo="Observações">
                <Markdown>{t.observations}</Markdown>
              </Bloco>
            )}

            {/* No cronograma o checklist simples sai daqui: a tabela de peças
                tem sete colunas e vai para a largura inteira, logo abaixo. */}
            {t.taskType.name !== TASK_TYPE_CRONOGRAMA && (
              <>
                <Checklist taskId={id} podeEditar={t.can.edit} />
                <Anexos taskId={id} />
                <Comentarios taskId={id} podeComentar />
                <Timeline taskId={id} />
              </>
            )}
          </div>

          <div className="space-y-5">
            {/* Etiqueta é de quem colabora também, não só de quem edita: a API
                aceita `contribute`, e a tela acompanha. */}
            <EtiquetasDaDemanda taskId={id} labels={t.labels} podeEditar={t.can.contribute} />
            {/* No cronograma a equipe já está no bloco de peças, pessoa por
                pessoa; o card só repetiria e empurraria a tabela para baixo. */}
            {t.taskType.name !== TASK_TYPE_CRONOGRAMA && <Pessoas task={t} />}
          </div>
        </div>

        {t.taskType.name === TASK_TYPE_CRONOGRAMA && (
          <>
            <div className="mt-5">
              <Cronograma task={t} />
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <Anexos taskId={id} />
                <Comentarios taskId={id} podeComentar />
                <Timeline taskId={id} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Só monta quando abre: o formulário lê a demanda no efeito de abertura,
          e mantê-lo montado o tempo todo guardaria um rascunho velho entre uma
          visita e outra. */}
      {editandoDemanda && (
        <EditarDemandaModal
          open
          demanda={t as never}
          onClose={() => setEditandoDemanda(false)}
        />
      )}
    </Shell>
  )
}

/* -------------------------------------------------------------- origem */

function OrigemBadge({ origem }: { origem: { isActive: boolean; deletedAt: string | null } }) {
  const viva = origem.isActive && !origem.deletedAt
  return (
    <Badge
      className={
        viva
          ? 'bg-brand-50 text-brand-700 ring-brand-600/20'
          : 'bg-ink-100 text-ink-600 ring-ink-300'
      }
    >
      <Repeat className="size-3" />
      Recorrente
    </Badge>
  )
}

/**
 * O caminho de volta da demanda até a regra que a criou.
 *
 * Sem isto, quem recebe a quinta demanda igual na quinta semana não tem como
 * descobrir de onde ela vem, nem como fazê-la parar.
 */
function OrigemCard({
  origem,
}: {
  origem: { id: string; description: string; schedule: string; isActive: boolean; deletedAt: string | null }
}) {
  const excluida = !!origem.deletedAt

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50/60 px-4 py-3 ring-1 ring-inset ring-brand-600/15">
      <div className="flex items-start gap-2.5">
        <Repeat className="mt-0.5 size-4 shrink-0 text-brand-600" />
        <div>
          <p className="text-[13px] text-ink-800">
            Criada automaticamente por uma recorrência: <strong>{origem.description}</strong>
          </p>
          <p className="mt-0.5 text-[12px] text-ink-500">
            {origem.schedule}
            {excluida && ' · a regra foi excluída'}
            {!excluida && !origem.isActive && ' · a regra está pausada'}
          </p>
        </div>
      </div>

      {!excluida && (
        <Link
          href="/recorrencias"
          className="shrink-0 rounded-lg bg-surface px-3 py-1.5 text-[13px] font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20 transition hover:bg-brand-50"
        >
          Ver a regra
        </Link>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- blocos */

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <h2 className="mb-3 text-[13px] font-semibold text-ink-800">{titulo}</h2>
      {children}
    </section>
  )
}

function StatusSelector({ task }: { task: { id: string; status: string; can: { changeStatus: boolean } } }) {
  const { data: statuses } = useStatuses()
  const mudar = useChangeStatus()

  if (!task.can.changeStatus) return null

  return (
    <Bloco titulo="Status">
      <div className="flex flex-wrap gap-1.5">
        {statuses?.map((s: any) => {
          const ativo = s.slug === task.status
          return (
            <button
              key={s.slug}
              onClick={() => !ativo && mudar.mutate({ id: task.id, status: s.slug })}
              disabled={mudar.isPending}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset transition',
                'disabled:cursor-not-allowed disabled:opacity-60',
                ativo
                  ? 'bg-brand-600 text-pine-950 ring-brand-600'
                  : 'bg-surface text-ink-600 ring-ink-200 hover:bg-ink-50',
              )}
            >
              {s.displayName}
            </button>
          )
        })}
      </div>
    </Bloco>
  )
}

function Pessoas({ task }: { task: any }) {
  const assumir = useClaimTask()
  const devolver = useReleaseTask()
  const [erro, setErro] = useState<string | null>(null)

  async function agir(fn: () => Promise<unknown>) {
    setErro(null)
    try {
      await fn()
    } catch (e) {
      // `ja_assumida` cai aqui: alguém da função clicou primeiro.
      setErro(e instanceof ApiError ? e.message : 'Não foi possível concluir a ação')
    }
  }

  const emVoo = assumir.isPending || devolver.isPending

  return (
    <Bloco titulo="Pessoas">
      <div className="space-y-3">
        {task.assignee ? (
          <Pessoa rotulo="Responsável" u={task.assignee} />
        ) : (
          <div>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-500 uppercase">
              Responsável
            </p>
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                <Inbox className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-gold-300">Na fila</p>
                <p className="truncate text-[11px] text-ink-500">
                  {task.queue ? `Aguardando ${task.queue.displayName}` : 'Sem responsável'}
                </p>
              </div>
            </div>
          </div>
        )}

        {(task.can?.claim || task.can?.release) && (
          <div>
            {task.can.claim && (
              <Button
                onClick={() => agir(() => assumir.mutateAsync(task.id))}
                disabled={emVoo}
                className="w-full"
              >
                {assumir.isPending ? <Spinner /> : <HandMetal className="size-4" />}
                Assumir esta demanda
              </Button>
            )}
            {task.can.release && (
              <button
                onClick={() => agir(() => devolver.mutateAsync(task.id))}
                disabled={emVoo}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 disabled:opacity-50"
              >
                {devolver.isPending ? <Spinner /> : <Undo2 className="size-3.5" />}
                Devolver para a fila
              </button>
            )}
            {erro && <p className="mt-1.5 text-[12px] text-red-400">{erro}</p>}
          </div>
        )}

        <Pessoa rotulo="Criada por" u={task.createdBy} />
        {task.participants?.length > 0 && (
          <div>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-500 uppercase">
              Participantes
            </p>
            <div className="space-y-2">
              {task.participants.map((p: any) => (
                <Pessoa key={p.id} u={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Bloco>
  )
}

function Pessoa({ rotulo, u }: { rotulo?: string; u: any }) {
  return (
    <div>
      {rotulo && (
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-500 uppercase">
          {rotulo}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Avatar name={u.name} url={u.avatarUrl} size={28} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink-900">{u.name}</p>
          <p className="truncate text-[11px] text-ink-500">{u.roleDisplayName}</p>
        </div>
      </div>
    </div>
  )
}


/* -------------------------------------------------------------- anexos */

function tamanhoLegivel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function Anexos({ taskId }: { taskId: string }) {
  const { data, isLoading } = useAttachments(taskId)
  const qc = useQueryClient()
  const remover = useDeleteAttachment(taskId)
  const { data: me } = useMe()
  const [erro, setErro] = useState<string | null>(null)
  /** Quantos já subiram do lote atual. Nulo = nada em andamento. */
  const [progresso, setProgresso] = useState<{ feitos: number; total: number } | null>(null)
  /** Qual imagem está ampliada. Nulo = nenhuma. */
  const [ampliada, setAmpliada] = useState<{
    id: string
    src: string
    alt: string
    podeRemover: boolean
  } | null>(null)

  /**
   * Recebe o lote inteiro que a pessoa escolheu.
   *
   * O caso real é a sessão de fotos: quinze imagens de uma vez. Uma por vez
   * significava quinze idas ao seletor de arquivos, e é por isso que o
   * `multiple` do input importa mais que a velocidade do envio.
   */
  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const escolhidos = Array.from(e.target.files ?? [])
    e.target.value = '' // permite reescolher os mesmos arquivos depois de um erro
    if (!escolhidos.length) return

    setErro(null)
    const limiteMb = Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)

    /**
     * O arquivo recusado NÃO leva os outros junto.
     *
     * Num lote grande é quase certo que um passe do limite ou venha num
     * formato estranho. Abortar tudo por causa dele obrigaria a pessoa a
     * descobrir qual era o culpado e reescolher os outros catorze na mão.
     */
    const recusados: string[] = []
    const aceitos = escolhidos.filter((f) => {
      if (f.size > MAX_ATTACHMENT_BYTES) {
        recusados.push(`${f.name} (passa de ${limiteMb} MB)`)
        return false
      }
      if (!(ALLOWED_ATTACHMENT_MIME as readonly string[]).includes(f.type)) {
        recusados.push(`${f.name} (tipo não aceito)`)
        return false
      }
      return true
    })

    const falhas: string[] = []
    let motivo: string | null = null

    if (aceitos.length) {
      setProgresso({ feitos: 0, total: aceitos.length })

      /**
       * Três de cada vez, não todos e não um por um.
       *
       * Um por um deixa a conexão ociosa entre os arquivos; todos de uma vez,
       * num lote grande de fotos de celular, disputam a mesma banda e o
       * primeiro arquivo só termina junto com o último — a barra fica parada
       * o tempo todo e depois salta.
       */
      const fila = [...aceitos]
      await Promise.all(
        Array.from({ length: Math.min(3, fila.length) }, async () => {
          while (fila.length) {
            const f = fila.shift()!
            try {
              await enviarAnexo(taskId, f)
            } catch (err) {
              falhas.push(f.name)
              motivo ??= err instanceof ApiError ? err.message : null
            }
            setProgresso((p) => (p ? { ...p, feitos: p.feitos + 1 } : p))
          }
        }),
      )

      setProgresso(null)
      // Uma invalidação para o lote todo: uma por arquivo recarregaria a lista
      // quinze vezes para chegar ao mesmo resultado.
      qc.invalidateQueries({ queryKey: qk.taskAttachments(taskId) })
      qc.invalidateQueries({ queryKey: qk.task(taskId) })
    }

    const problemas = [...recusados, ...falhas.map((n) => `${n} (falhou no envio)`)]
    if (problemas.length) {
      // Dizer QUAIS ficaram de fora: o que subiu já está na lista acima, e sem
      // os nomes a pessoa teria de conferir arquivo por arquivo.
      setErro(`Não enviei: ${problemas.join(', ')}${motivo ? ` — ${motivo}` : ''}`)
    }
  }

  return (
    <Bloco titulo={`Anexos${data?.length ? ` (${data.length})` : ''}`}>
      {isLoading && <Spinner className="text-ink-400" />}

      {data && data.length === 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-[12px] text-ink-400">
          <Paperclip className="size-3.5" />
          Nenhum arquivo anexado.
        </p>
      )}

      <ul className="mb-3 space-y-2">
        {data?.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-2.5 rounded-lg border border-ink-100 px-3 py-2"
          >
            {a.previewUrl ? (
              /*
               * A miniatura é o botão de ampliar, e o nome ao lado segue sendo
               * o de baixar. São ações diferentes para intenções diferentes:
               * quem clica na imagem quer VER, quem clica no nome quer o
               * arquivo. Juntar as duas obrigaria a escolher qual delas
               * frustrar.
               */
              <button
                onClick={() =>
                  setAmpliada({
                    id: a.id,
                    src: a.previewUrl!,
                    alt: a.fileName,
                    podeRemover: a.uploadedBy.id === me?.id || !!me?.isAdmin,
                  })
                }
                title="Ampliar"
                className="shrink-0 overflow-hidden rounded-md ring-1 ring-ink-100 transition hover:ring-brand-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- URL
                    assinada e efêmera do S3; ver nota em image-lightbox.tsx */}
                <img
                  src={a.previewUrl}
                  alt={a.fileName}
                  loading="lazy"
                  className="size-10 bg-ink-50 object-cover"
                />
              </button>
            ) : (
              <Paperclip className="size-3.5 shrink-0 text-ink-400" />
            )}
            <button
              onClick={() => baixarAnexo(taskId, a.id)}
              className="min-w-0 flex-1 text-left"
              title="Baixar"
            >
              <p className="truncate text-[13px] font-medium text-ink-800 hover:text-brand-700">
                {a.fileName}
              </p>
              <p className="text-[11px] text-ink-500">
                {tamanhoLegivel(a.fileSize)} · {a.uploadedBy.name} · {relativeTime(a.createdAt)}
              </p>
            </button>

            {(a.uploadedBy.id === me?.id || me?.isAdmin) && (
              <button
                onClick={() => remover.mutate(a.id)}
                disabled={remover.isPending}
                title="Remover"
                className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-red-500/12 hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 bg-surface px-3 py-2 text-[13px] font-medium text-ink-700 transition hover:bg-ink-50">
        {progresso ? <Spinner /> : <Upload className="size-4" />}
        {progresso
          ? `Enviando ${Math.min(progresso.feitos + 1, progresso.total)} de ${progresso.total}…`
          : 'Anexar arquivos'}
        <input
          type="file"
          multiple
          accept={ALLOWED_ATTACHMENT_MIME.join(',')}
          className="hidden"
          onChange={aoEscolher}
          disabled={!!progresso}
        />
      </label>

      {/* `red-300`, não `red-600`: no tema escuro o vermelho fechado some no
          fundo verde, e a mensagem de erro do anexo é justamente a que
          precisa ser lida. Mesmo tom do resto do projeto. */}
      {erro && <p className="mt-2 text-[12px] text-red-300">{erro}</p>}

      {ampliada && (
        <ImageLightbox
          src={ampliada.src}
          alt={ampliada.alt}
          onClose={() => setAmpliada(null)}
          /* Fecha junto: sem isso a pessoa continuaria olhando, ampliada, uma
             foto que já não existe mais. */
          onRemover={
            ampliada.podeRemover
              ? () => {
                  remover.mutate(ampliada.id)
                  setAmpliada(null)
                }
              : undefined
          }
        />
      )}
    </Bloco>
  )
}

/**
 * Um comentário, editável por quem o escreveu.
 *
 * Antes só existia publicar, e um erro de digitação ficava para sempre: o
 * jeito de corrigir era escrever outro comentário embaixo, o que enche a
 * conversa de remendos e deixa a versão errada no topo.
 *
 * O lápis aparece só para o autor. Nem o administrador edita fala alheia —
 * apagar o que alguém disse é uma coisa, reescrever sob o nome da pessoa é
 * outra. Quem lesse depois atribuiria a ela palavras que não são dela.
 */
function Comentario({
  taskId,
  comentario,
  souEu,
}: {
  taskId: string
  comentario: TaskComment
  souEu: boolean
}) {
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(comentario.content)
  const [erro, setErro] = useState<string | null>(null)
  const salvar = useUpdateComment(taskId)

  function abrir() {
    // O rascunho parte SEMPRE do texto atual, e não do que sobrou de uma
    // edição abandonada: reabrir e encontrar o texto de antes seria assustador.
    setRascunho(comentario.content)
    setErro(null)
    setEditando(true)
  }

  function gravar(novo: string) {
    const limpo = novo.trim()
    // Vazio se lê como desistir, e igual ao que estava não vai para a rede.
    if (!limpo || limpo === comentario.content) return setEditando(false)
    setErro(null)
    salvar.mutate(
      { id: comentario.id, content: limpo },
      {
        onSuccess: () => setEditando(false),
        onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não consegui salvar'),
      },
    )
  }

  return (
    <div className="group flex gap-2.5">
      <Avatar name={comentario.author.name} url={comentario.author.avatarUrl} size={28} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-ink-500">
          <span className="font-medium text-ink-800">{comentario.author.name}</span>
          {relativeTime(comentario.createdAt)}
          {/* Comentário alterado sem aviso é pior do que comentário sem edição:
              quem leu antes fica discutindo uma frase que já não existe. */}
          {comentario.editado && <span className="text-ink-400">· editado</span>}
          {souEu && !editando && (
            <button
              type="button"
              onClick={abrir}
              className="text-ink-400 underline decoration-dotted underline-offset-2 transition hover:text-brand-700"
            >
              editar
            </button>
          )}
        </p>

        {editando ? (
          <div className="mt-1 space-y-2">
            <MarkdownEditor value={rascunho} onChange={setRascunho} rows={4} autoFocus />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => gravar(rascunho)} disabled={salvar.isPending}>
                {salvar.isPending && <Spinner />}
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setErro(null)
                  setEditando(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          /* Sem `whitespace-pre-wrap`: quem trata quebra de linha agora é o
             markdown, e mantê-lo dobraria o espaçamento entre parágrafos. */
          <Markdown className="mt-0.5">{comentario.content}</Markdown>
        )}

        {erro && <p className="mt-1 text-[12px] text-red-300">{erro}</p>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- comentários */

function Comentarios({ taskId, podeComentar }: { taskId: string; podeComentar: boolean }) {
  const { data, isLoading } = useTaskComments(taskId)
  const { data: me } = useMe()
  const adicionar = useAddComment(taskId)
  const [texto, setTexto] = useState('')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const conteudo = texto.trim()
    if (!conteudo) return
    await adicionar.mutateAsync(conteudo)
    setTexto('')
  }

  return (
    <Bloco titulo={`Comentários${data?.length ? ` (${data.length})` : ''}`}>
      {isLoading && <Spinner className="text-ink-400" />}

      {data && data.length === 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-[12px] text-ink-400">
          <MessageSquare className="size-3.5" />
          Nenhum comentário ainda.
        </p>
      )}

      <div className="mb-4 space-y-3.5">
        {data?.map((c) => (
          <Comentario key={c.id} taskId={taskId} comentario={c} souEu={c.author.id === me?.id} />
        ))}
      </div>

      {podeComentar && (
        <form onSubmit={enviar} className="space-y-2">
          {/* Editor completo, e não um campo de uma linha: comentário aqui
              carrega link do Drive, lista de ajustes e trecho de copy — as
              três coisas que um input raso obriga a espremer numa linha só. */}
          <MarkdownEditor
            rows={3}
            placeholder="Escreva um comentário..."
            value={texto}
            onChange={setTexto}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!texto.trim() || adicionar.isPending}>
              {adicionar.isPending ? <Spinner /> : <Send className="size-4" />}
              Comentar
            </Button>
          </div>
        </form>
      )}
    </Bloco>
  )
}

/* -------------------------------------------------------------- timeline */

const ACAO_LABEL: Record<string, string> = {
  criada: 'criou a demanda',
  status_alterado: 'mudou o status',
  prazo_alterado: 'alterou o prazo',
  responsavel_alterado: 'trocou o responsável',
  editada: 'editou',
  excluida: 'excluiu',
  reaberta: 'reabriu',
  delegacao_alterada: 'alterou a delegação',
  horas_editadas: 'editou as horas',
}

function Timeline({ taskId }: { taskId: string }) {
  const { data } = useTaskActivity(taskId)

  if (!data?.length) return null

  return (
    <Bloco titulo="Histórico">
      <ol className="space-y-3">
        {data.map((a) => (
          <li key={a.id} className="flex gap-2.5">
            <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
              <History className="size-3" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-ink-700">
                <span className="font-medium text-ink-900">{a.userName}</span>{' '}
                {ACAO_LABEL[a.action] ?? a.action}
                {a.action === 'status_alterado' && (
                  <StatusDelta oldValue={a.oldValue} newValue={a.newValue} />
                )}
              </p>
              <p className="text-[11px] text-ink-400">{relativeTime(a.createdAt)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Bloco>
  )
}

function StatusDelta({ oldValue, newValue }: { oldValue: any; newValue: any }) {
  const de = oldValue?.status
  const para = newValue?.status
  if (!de || !para) return null
  return (
    <span className="text-ink-500">
      {' '}
      de <span className="font-medium text-ink-700">{de}</span> para{' '}
      <span className="font-medium text-ink-700">{para}</span>
    </span>
  )
}

/* -------------------------------------------------------------- etiquetas */

/**
 * Bloco de etiquetas na coluna lateral.
 *
 * O `LabelPicker` é controlado, então quem grava é este componente: no modal
 * de criação a mesma peça só junta ids para mandar no POST, porque lá a
 * demanda ainda não existe.
 */
function EtiquetasDaDemanda({
  taskId,
  labels,
  podeEditar,
}: {
  taskId: string
  labels: LabelRef[]
  podeEditar: boolean
}) {
  const salvar = useSetTaskLabels(taskId)

  // Some para quem não pode editar e não há nada a mostrar: bloco vazio numa
  // tela de leitura é ruído.
  if (!podeEditar && !labels.length) return null

  return (
    <Bloco titulo="Etiquetas">
      <LabelPicker
        value={labels.map((l) => l.id)}
        onChange={(ids) => salvar.mutate(ids)}
        disabled={!podeEditar || salvar.isPending}
      />
    </Bloco>
  )
}

/**
 * Excluir a demanda.
 *
 * Confirmação em dois passos, e não um `confirm()` do navegador: o diálogo
 * nativo não diz QUAL demanda vai sumir, e numa tela de detalhe aberta há
 * meia hora isso importa. Aqui o título aparece no aviso.
 *
 * A exclusão é reversível no banco (soft delete, regra 7.3) e irreversível
 * pela interface — não existe tela de lixeira. Por isso o aviso fala em
 * "não dá para desfazer": é a verdade para quem está lendo, e prometer um
 * desfazer que só um acesso ao banco realiza seria pior que não prometer.
 */
/**
 * O título, editável no lugar.
 *
 * O backend sempre aceitou: `updateTask` exige `authz.edit`, que já cobre
 * quem criou a demanda. Faltava a tela — o título era um `h1` puro, e o
 * efeito prático era que corrigir um erro de digitação exigia apagar a
 * demanda e criar outra, perdendo comentários, anexos e histórico.
 *
 * Editar no lugar, e não um modal: a alteração é de um campo só, e um modal
 * para trocar uma palavra pede mais cliques do que a correção vale.
 */
function TituloDaDemanda({
  id,
  titulo,
  podeEditar,
}: {
  id: string
  titulo: string
  podeEditar: boolean
}) {
  const [editando, setEditando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const salvar = useUpdateTask(id)

  const classe = 'text-xl font-semibold tracking-tight text-ink-900'

  function gravar(novo: string) {
    setEditando(false)
    const limpo = novo.trim()
    // Igual ao que já estava não vai para a rede, e vazio se lê como desistir.
    if (!limpo || limpo === titulo) return
    /**
     * O mínimo é o do schema, não uma regra inventada aqui. Barrar antes de
     * enviar troca um 400 silencioso por uma frase que diz o que houve — sem
     * isso o título voltava ao antigo sem explicação nenhuma.
     */
    if (limpo.length < 3) return setErro('Título muito curto — não salvei')
    setErro(null)
    salvar.mutate(
      { title: limpo },
      { onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não consegui salvar') },
    )
  }

  if (!podeEditar) return <h1 className={classe}>{titulo}</h1>

  return (
    <div className="min-w-0 flex-1">
      {editando ? (
        <input
          autoFocus
          defaultValue={titulo}
          maxLength={200}
          onBlur={(e) => gravar(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.blur()
            }
            // Esc desiste: o campo é descartado sem gravar, e o valor antigo
            // volta sozinho porque nunca saiu do lugar.
            if (e.key === 'Escape') {
              setErro(null)
              setEditando(false)
            }
          }}
          className={clsx(classe, 'w-full rounded-lg border border-ink-200 bg-surface px-2 py-1')}
        />
      ) : (
        <h1
          onClick={() => {
            setErro(null)
            setEditando(true)
          }}
          title="Clique para editar"
          className={clsx(classe, 'cursor-text')}
        >
          {titulo}
        </h1>
      )}
      {erro && <p className="mt-1 text-[12px] text-red-300">{erro}</p>}
    </div>
  )
}

function ExcluirDemanda({ id, titulo }: { id: string; titulo: string }) {
  const router = useRouter()
  const excluir = useDeleteTask()
  const [confirmando, setConfirmando] = useState(false)

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        title="Excluir demanda"
        className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-red-500/12 hover:text-red-300"
      >
        <Trash2 className="size-4" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-24 w-full max-w-sm rounded-2xl bg-pine-800 p-6 shadow-2xl ring-1 ring-inset ring-overlay/10">
        <h2 className="text-sm font-semibold text-ink-900">Excluir esta demanda?</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
          <span className="font-medium text-ink-700">{titulo}</span> sai do quadro, das
          listagens e dos contadores. Não dá para desfazer pela tela.
        </p>

        {excluir.isError && (
          <p className="mt-3 text-[13px] text-red-300">
            {excluir.error instanceof ApiError
              ? excluir.error.message
              : 'Não foi possível excluir'}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
          <button
            onClick={() =>
              excluir.mutate(id, {
                // Volta para o painel: ficar na tela de uma demanda que já não
                // existe mostraria "não encontrada" logo depois de excluir.
                onSuccess: () => router.replace('/eu'),
              })
            }
            disabled={excluir.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {excluir.isPending ? <Spinner /> : <Trash2 className="size-4" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
