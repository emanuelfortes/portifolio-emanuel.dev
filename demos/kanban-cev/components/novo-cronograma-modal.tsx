'use client'

import { useMemo, useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import { ChevronDown, ChevronUp, ClipboardPaste, Plus, Trash2, X } from 'lucide-react'
import clsx from 'clsx'
import { TASK_TYPE_CRONOGRAMA, createTaskSchema } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import {
  criarItemChecklist,
  useAssignableUsers,
  useClients,
  useCreateTask,
  useMe,
  useTaskTypes,
} from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'

/**
 * Novo cronograma: uma demanda para a equipe, com uma peça por linha.
 *
 * É um formulário próprio, e não uma opção do de demanda, porque o que se
 * cadastra aqui é uma TABELA — quinze peças com formato, dono e copy — e o
 * outro modal é uma ficha de uma coisa só.
 *
 * O prazo é um só, o da demanda: a peça não tem data própria. A copy de cada
 * post entra aqui mesmo, pelo botão de texto da linha, ou colando o texto que
 * hoje vai na descrição: cada "POST 1 - ..." abre uma peça e as linhas abaixo
 * viram a copy dela. A equipe da demanda é quem recebe peça: não há lista à
 * parte para escolher gente, porque cada linha já escolhe.
 *
 * A demanda nasce primeiro, as peças depois, uma a uma: o item aponta para
 * `task_id`, que só existe depois do POST, e a ordem importa.
 */

interface Linha {
  key: number
  content: string
  taskTypeId: string
  assigneeId: string
  /** A copy do post, em markdown. Vai para `description` do item. */
  description: string

  /**
   * A pessoa recolheu a caixa da copy. Estado de tela, não de dado.
   *
   * É "fechada" e não "aberta" porque o padrão é abrir sozinha: assim que o
   * título ganha texto, a caixa aparece embaixo, sem clique. Só fica
   * escondida quando alguém a recolheu, ou quando a peça veio colada já com
   * copy — quinze caixas abertas de uma vez seriam uma parede.
   */
  copyFechada: boolean
}

interface Pessoa {
  id: string
  name: string
  avatarUrl: string | null
  roleId: number
  roleDisplayName: string
}

interface Tipo {
  id: number
  slug: string
  displayName: string
  defaultRoleId: number | null
}

let proximaChave = 1
const novaLinha = (parcial: Partial<Linha> = {}): Linha => ({
  key: proximaChave++,
  content: '',
  taskTypeId: '',
  assigneeId: '',
  description: '',
  copyFechada: false,
  ...parcial,
})

/** Prazo padrão: uma semana, às 18h, no formato do <input type="datetime-local">. */
function prazoPadrao(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  d.setHours(18, 0, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Uma linha que COMEÇA uma peça: "POST 1 - ...", "VÍDEO 2: ...", "STORIES ...",
 * "3) ...". O resto do bloco, até a próxima dessas, é a copy da peça.
 */
// "arte" e "card" ficam de fora de propósito: aparecem no meio da copy
// ("Arte única, frase curta…") e abririam uma peça onde há só texto.
const INICIO_DE_PECA = /^\s*(?:(?:post|v[ií]deo|reels?|stor(?:y|ies)|carrossel|est[áa]tico)\b|\d{1,2}\s*[.)-])/i

/**
 * Lê o texto colado.
 *
 * Se alguma linha começa uma peça, o texto é lido em blocos: aquela linha é o
 * nome, e as seguintes, até o próximo início, são a copy. Sem nenhuma, cai no
 * modo simples: uma peça por linha, sem copy — o formato de quem só tem a
 * lista de títulos.
 *
 * As palavras carrossel, estático, vídeo/reels e stories no nome dizem o
 * formato; o dono sai do formato: a primeira pessoa cuja função é
 * a dele. É sugestão, não sentença — cada linha continua editável.
 */
function interpretar(texto: string, tipos: Tipo[], pessoas: Pessoa[]): Linha[] {
  const porSlug = (slug: string) => tipos.find((t) => t.slug === slug)
  const tipoDe = (l: string) => {
    if (/carrossel/i.test(l)) return porSlug('carrossel')
    if (/est[áa]tic[oa]/i.test(l)) return porSlug('estatico')
    if (/v[ií]deo|reels?|edi[çc][ãa]o/i.test(l)) return porSlug('video_reels')
    if (/stor(y|ies)/i.test(l)) return porSlug('stories')
    if (/post|feed|arte|card/i.test(l)) return porSlug('post_feed')
    return undefined
  }
  const montar = (content: string, description: string) => {
    const tipo = tipoDe(content)
    const dono = tipo?.defaultRoleId ? pessoas.find((p) => p.roleId === tipo.defaultRoleId) : undefined
    return novaLinha({
      content: content.trim().slice(0, 300),
      taskTypeId: tipo ? String(tipo.id) : '',
      assigneeId: dono?.id ?? '',
      description: description.trim(),
      copyFechada: description.trim().length > 0,
    })
  }

  const linhas = texto.split('\n').map((l) => l.replace(/\s+$/, ''))
  const emBlocos = linhas.some((l) => INICIO_DE_PECA.test(l))

  if (!emBlocos) {
    return linhas
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => montar(l, ''))
  }

  const pecas: Linha[] = []
  let nome: string | null = null
  let copy: string[] = []
  for (const l of linhas) {
    if (INICIO_DE_PECA.test(l)) {
      if (nome !== null) pecas.push(montar(nome, copy.join('\n')))
      nome = l
      copy = []
    } else if (nome !== null) {
      copy.push(l)
    }
    // Texto antes da primeira peça é ignorado: não há a quem pertencer.
  }
  if (nome !== null) pecas.push(montar(nome, copy.join('\n')))
  return pecas
}

export function NovoCronogramaModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { data: me } = useMe()
  const { data: tipos } = useTaskTypes()
  const { data: clients } = useClients()
  const { data: assignable } = useAssignableUsers()
  const create = useCreateTask()

  const [form, setForm] = useState({
    title: '',
    clientId: '',
    assigneeId: '',
    deadline: prazoPadrao(),
    description: '',
  })

  const [linhas, setLinhas] = useState<Linha[]>(() => [novaLinha()])
  const [colando, setColando] = useState(false)
  const [colado, setColado] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [progresso, setProgresso] = useState<string | null>(null)
  /** Quando as peças falham no meio, a demanda já existe: o link leva até ela. */
  const [criadaId, setCriadaId] = useState<string | null>(null)

  /** Quem pode estar no cronograma: quem posso delegar, mais eu. */
  const pessoas = useMemo<Pessoa[]>(() => {
    const lista: Pessoa[] = (assignable ?? []).map((u: any) => ({
      id: u.id,
      name: u.name,
      avatarUrl: u.avatarUrl,
      roleId: u.roleId,
      roleDisplayName: u.roleDisplayName,
    }))
    if (me && !lista.some((p) => p.id === me.id)) {
      lista.unshift({
        id: me.id,
        name: me.name,
        avatarUrl: me.avatarUrl,
        roleId: me.role.id,
        roleDisplayName: me.role.displayName,
      })
    }
    return lista
  }, [assignable, me])

  const tiposDePeca = useMemo<Tipo[]>(
    () => ((tipos ?? []) as Tipo[]).filter((t) => t.slug !== TASK_TYPE_CRONOGRAMA),
    [tipos],
  )

  const responsavel = form.assigneeId || me?.id || ''

  function mudarLinha(key: number, parcial: Partial<Linha>) {
    setLinhas((atual) => atual.map((l) => (l.key === key ? { ...l, ...parcial } : l)))
  }

  function aoTrocarTipo(linha: Linha, taskTypeId: string) {
    const tipo = tiposDePeca.find((t) => String(t.id) === taskTypeId)
    const sugerido =
      !linha.assigneeId && tipo?.defaultRoleId
        ? pessoas.find((p) => p.roleId === tipo.defaultRoleId)?.id
        : undefined
    mudarLinha(linha.key, { taskTypeId, ...(sugerido ? { assigneeId: sugerido } : {}) })
  }

  function transformarColado() {
    const novas = interpretar(colado, tiposDePeca, pessoas)
    if (!novas.length) return
    // Substitui as linhas vazias; as preenchidas ficam.
    setLinhas((atual) => [...atual.filter((l) => l.content.trim()), ...novas])
    setColado('')
    setColando(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const tipoCronograma = (tipos ?? []).find((t: any) => t.slug === TASK_TYPE_CRONOGRAMA)
    if (!tipoCronograma) {
      setServerError(
        'O tipo "Cronograma" ainda não existe neste banco. Rode a migration (npm run db:migrate) e recarregue.',
      )
      return
    }

    const pecas = linhas
      .map((l) => ({ ...l, content: l.content.trim(), description: l.description.trim() }))
      .filter((l) => l.content)
    if (!pecas.length) {
      setErrors({ pecas: 'Adicione pelo menos uma peça' })
      return
    }

    // A equipe é quem recebeu peça. Quem coordena já está dentro por ser o responsável.
    const participantIds = [...new Set(pecas.map((p) => p.assigneeId).filter(Boolean))].filter(
      (id) => id !== responsavel,
    )

    const payload = {
      title: form.title,
      description: form.description || undefined,
      taskTypeId: tipoCronograma.id,
      clientId: form.clientId || null,
      assigneeId: responsavel,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : '',
      priority: 'media' as const,
      participantIds,
    }

    const parsed = createTaskSchema.safeParse(payload)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message
      setErrors(fieldErrors)
      return
    }

    let id: string
    try {
      const criada = await create.mutateAsync(parsed.data)
      id = criada.id
      setCriadaId(id)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível criar o cronograma')
      return
    }

    // Em sequência: o `position` de cada peça sai do maior já gravado, e
    // disparar todas juntas embaralharia a ordem da tabela.
    for (const [i, peca] of pecas.entries()) {
      setProgresso(`Gravando peça ${i + 1} de ${pecas.length}…`)
      try {
        await criarItemChecklist(id, {
          content: peca.content,
          taskTypeId: peca.taskTypeId ? Number(peca.taskTypeId) : undefined,
          assigneeId: peca.assigneeId || undefined,
          description: peca.description || undefined,
        })
      } catch (err) {
        const motivo = err instanceof ApiError ? err.message : 'a conexão falhou'
        setProgresso(null)
        setServerError(
          `O cronograma foi criado, mas a peça "${peca.content.slice(0, 40)}" não entrou: ${motivo}. As seguintes também não foram gravadas; acrescente pela tela do cronograma.`,
        )
        return
      }
    }

    onClose()
    router.push(`/demandas/${id}`)
  }

  const ocupado = create.isPending || progresso !== null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-3xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Novo cronograma</h2>
            <p className="text-[12.5px] text-ink-500">
              Uma demanda para a equipe inteira, com uma peça por linha e um prazo só.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label="Fechar"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <Field label="Título" required error={errors.title}>
            <input
              className={inputClass}
              autoFocus
              placeholder="Ex: Cronograma de outubro · Dra. Fabiana"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente" hint="Cronograma interno pode ficar sem cliente">
              <select
                className={inputClass}
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Nenhum (interno)</option>
                {clients?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Prazo" required error={errors.deadline} hint="Vale para o cronograma inteiro">
              <input
                type="datetime-local"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quem coordena" required error={errors.assigneeId} hint="Responsável pela demanda: vê e edita tudo">
              <select
                className={inputClass}
                value={responsavel}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              >
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.roleDisplayName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Peças"
            required
            error={errors.pecas}
            hint="Escreva o título da peça e a caixa da copy abre embaixo. Colando a lista, o texto embaixo de cada título vira a copy. O prazo é um só, o do cronograma."
          >
            <div className="space-y-2">
              {linhas.map((l) => {
                const temCopy = l.description.trim().length > 0
                // Abre sozinha com o título; a seta recolhe.
                const aberta = !l.copyFechada && (l.content.trim().length > 0 || temCopy)
                return (
                  <div key={l.key} className="space-y-2">
                    <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_150px_150px_auto]">
                      <input
                        className={inputClass}
                        placeholder="Ex: POST 1 - Carrossel sobre prevenção"
                        maxLength={300}
                        value={l.content}
                        onChange={(e) => mudarLinha(l.key, { content: e.target.value })}
                      />
                      <select
                        className={inputClass}
                        value={l.taskTypeId}
                        onChange={(e) => aoTrocarTipo(l, e.target.value)}
                        aria-label="Formato"
                      >
                        <option value="">Formato</option>
                        {tiposDePeca.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.displayName}
                          </option>
                        ))}
                      </select>
                      <select
                        className={inputClass}
                        value={l.assigneeId}
                        onChange={(e) => mudarLinha(l.key, { assigneeId: e.target.value })}
                        aria-label="Quem faz"
                      >
                        <option value="">Quem faz</option>
                        {pessoas.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name.split(' ')[0]}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center justify-end gap-0.5">
                        {/* A seta do acordeão. Acesa quando a peça já tem copy:
                            dá para ver de relance quais ainda estão sem texto. */}
                        <button
                          type="button"
                          onClick={() => mudarLinha(l.key, { copyFechada: aberta })}
                          aria-label={aberta ? 'Recolher copy' : temCopy ? 'Mostrar copy' : 'Escrever copy'}
                          aria-expanded={aberta}
                          title={temCopy ? 'Copy preenchida' : 'Copy do post'}
                          className={clsx(
                            'rounded p-1.5 transition hover:bg-ink-100',
                            temCopy ? 'text-brand-700' : 'text-ink-300 hover:text-ink-700',
                          )}
                        >
                          {aberta ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setLinhas((atual) =>
                              atual.length > 1 ? atual.filter((x) => x.key !== l.key) : [novaLinha()],
                            )
                          }
                          aria-label="Remover linha"
                          className="rounded p-1.5 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sem autoFocus: a caixa abre enquanto a pessoa ainda
                        está digitando o título, e roubar o foco cortaria a
                        palavra no meio. */}
                    {aberta && (
                      <div className="rounded-lg border border-ink-200 bg-pine-900/40 p-3">
                        <p className="mb-1.5 text-[11.5px] font-semibold tracking-wide text-ink-500 uppercase">
                          Copy do post
                        </p>
                        <textarea
                          className={clsx(inputClass, 'min-h-32 text-[13px]')}
                          rows={6}
                          placeholder="O que vai ser este post: texto dos slides, legenda, referências, links…"
                          value={l.description}
                          onChange={(e) => mudarLinha(l.key, { description: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setLinhas((a) => [...a, novaLinha()])}>
                  <Plus className="size-3.5" />
                  Mais uma peça
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setColando((v) => !v)}>
                  <ClipboardPaste className="size-3.5" />
                  Colar lista
                </Button>
              </div>

              {colando && (
                <div className="space-y-2 rounded-lg border border-ink-200 bg-pine-900/40 p-3">
                  <textarea
                    className={clsx(inputClass, 'min-h-40 font-mono text-[12.5px]')}
                    placeholder={
                      'Cole o cronograma inteiro. Cada "POST 1 - ...", "VÍDEO 2 - ..." ou "STORIES ..." abre uma peça, e o texto embaixo vira a copy dela. Ex.:\n\nPOST 1 - CARROSSEL: Essa ferida não cicatriza?\nSlide 1 - Capa...\nSlide 2 - Pode ser um carcinoma...\n\nVÍDEO 1 - REELS: Mito ou verdade\nRoteiro no Drive...'
                    }
                    value={colado}
                    onChange={(e) => setColado(e.target.value)}
                  />
                  <p className="text-[12px] text-ink-400">
                    "Carrossel", "estático", "vídeo" e "stories" no título sugerem o formato e quem faz. Sem títulos assim, cada linha vira uma peça.
                  </p>
                  <div className="flex justify-end">
                    <Button type="button" size="sm" onClick={transformarColado} disabled={!colado.trim()}>
                      Transformar em peças
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Field>

          <Field label="Contexto geral" hint="Opcional. O que vale para o cronograma inteiro; a copy de cada peça fica nela">
            <textarea
              className={clsx(inputClass, 'min-h-20')}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          {serverError && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2 text-[13px] text-red-200">
              {serverError}
              {criadaId && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    router.push(`/demandas/${criadaId}`)
                  }}
                  className="ml-2 font-medium underline"
                >
                  Abrir o cronograma
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-4">
            {progresso && <span className="mr-auto text-[12.5px] text-ink-500">{progresso}</span>}
            <Button type="button" variant="outline" onClick={onClose} disabled={ocupado}>
              Cancelar
            </Button>
            <Button type="submit" disabled={ocupado}>
              {ocupado ? <Spinner /> : null}
              Criar cronograma
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
