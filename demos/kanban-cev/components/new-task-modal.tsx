'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Paperclip, Plus, Trash2, X } from 'lucide-react'
import {
  createTaskSchema,
  ALLOWED_ATTACHMENT_MIME,
  MAX_ATTACHMENT_BYTES,
  isPreviewableImage,
} from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { useAssignableUsers, useClients, useCreateTask, useTaskTypes, useMe, enviarAnexo, criarItemChecklist } from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, inputClass, Spinner } from '@/demos/kanban-cev/components/ui'
import { ImageLightbox } from '@/demos/kanban-cev/components/image-lightbox'
import { LabelPicker } from '@/demos/kanban-cev/components/labels'

/**
 * O editor entra sob demanda, e não no pacote da página.
 *
 * O `react-markdown` e o `remark-gfm` somam ~50KB, e o painel "Eu" carregava
 * os dois só por ter o botão de nova demanda na tela — peso pago por toda
 * pessoa que abre o quadro, para um editor que a maioria das visitas nem usa.
 * Com o import dinâmico, o pacote só desce quando o modal abre.
 *
 * `ssr: false` porque o editor é interativo e não tem o que renderizar no
 * servidor; o esqueleto abaixo ocupa a mesma altura para o formulário não
 * pular quando ele chega.
 */
const MarkdownEditor = dynamic(
  () => import('./markdown-editor').then((m) => m.MarkdownEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse rounded-lg border border-ink-200 bg-pine-900/40" />
    ),
  },
)

/** Converte um <input type="datetime-local"> para ISO com offset. */
function toIso(local: string): string {
  return new Date(local).toISOString()
}

function defaultDeadline(): string {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  d.setHours(18, 0, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function NewTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: me } = useMe()
  const { data: types } = useTaskTypes()
  const { data: clients } = useClients()
  const { data: assignable } = useAssignableUsers()
  const create = useCreateTask()

  const [form, setForm] = useState({
    title: '',
    description: '',
    taskTypeId: '',
    clientId: '',
    assigneeId: '',
    deadline: defaultDeadline(),
    priority: 'media',
    observations: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  // Etiquetas e anexos são opcionais: nenhum dos dois entra na validação, e a
  // demanda é criada normalmente sem eles.
  const [etiquetas, setEtiquetas] = useState<string[]>([])
  const [arquivos, setArquivos] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)
  /**
   * Itens do checklist juntados aqui e gravados depois do POST.
   *
   * Mesma restrição do anexo: a linha aponta para `task_id`, que só existe
   * depois da demanda. A diferença é que aqui a ordem importa — o `position`
   * é atribuído na inserção, então eles vão um a um, em sequência.
   */
  const [checklist, setChecklist] = useState<string[]>([])
  const [novoItem, setNovoItem] = useState('')
  /** Qual imagem escolhida está ampliada. Nulo = nenhuma. */
  const [ampliada, setAmpliada] = useState<{ src: string; alt: string; i: number } | null>(null)

  /**
   * Miniatura do que ainda NÃO foi enviado.
   *
   * Aqui a demanda não existe, então não há anexo no S3 nem URL assinada para
   * pedir: a imagem sai do próprio arquivo em memória, via `blob:`. É o que
   * permite conferir que veio a arte certa antes de criar a demanda.
   *
   * Nulo nas posições que não são imagem — o índice acompanha `arquivos` para
   * a miniatura não desencontrar do nome ao lado.
   */
  const previews = useMemo(
    () => arquivos.map((f) => (isPreviewableImage(f.type) ? URL.createObjectURL(f) : null)),
    [arquivos],
  )

  /**
   * Cada `blob:` segura o arquivo na memória até ser revogado, e trocar a
   * seleção três vezes deixaria três cópias presas até a aba fechar. A limpeza
   * roda na troca de `previews` e na desmontagem do modal.
   */
  useEffect(() => {
    return () => {
      for (const url of previews) if (url) URL.revokeObjectURL(url)
    }
  }, [previews])

  // Ao abrir, o responsável padrão é a própria pessoa.
  useEffect(() => {
    if (open && me) setForm((f) => ({ ...f, assigneeId: f.assigneeId || me.id }))
  }, [open, me])

  /**
   * As funções que aparecem como fila, derivadas de `assignable`.
   *
   * Só entram as com DUAS ou mais pessoas: com uma só, "qualquer um de X" e o
   * nome dela são a mesma coisa, e a opção viraria ruído. Como sai da lista de
   * quem posso delegar, ela também já respeita a matriz — e uma função que
   * ganhar a segunda pessoa passa a aparecer sozinha, sem mexer em código.
   */
  const filas = useMemo(() => {
    const porFuncao = new Map<number, { id: number; nome: string; quantos: number }>()
    for (const u of assignable ?? []) {
      const atual = porFuncao.get(u.roleId)
      if (atual) atual.quantos++
      else porFuncao.set(u.roleId, { id: u.roleId, nome: u.roleDisplayName, quantos: 1 })
    }
    return [...porFuncao.values()].filter((f) => f.quantos > 1).sort((a, b) => a.nome.localeCompare(b.nome))
  }, [assignable])

  /**
   * As pessoas agrupadas por função, para escolher um nome específico.
   *
   * Mesmo corte das filas — duas ou mais —, e pela mesma razão: o cabeçalho
   * serve para separar candidatos, e uma função de uma pessoa só não tem
   * candidatos a separar.
   */
  const { gruposPorFuncao, pessoasSozinhas } = useMemo(() => {
    const porFuncao = new Map<number, { roleId: number; nome: string; pessoas: typeof lista }>()
    const lista = assignable ?? []

    for (const u of lista) {
      const atual = porFuncao.get(u.roleId)
      if (atual) atual.pessoas.push(u)
      else porFuncao.set(u.roleId, { roleId: u.roleId, nome: u.roleDisplayName, pessoas: [u] })
    }

    const todos = [...porFuncao.values()]
    const ordemNome = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)

    return {
      gruposPorFuncao: todos
        .filter((g) => g.pessoas.length > 1)
        .map((g) => ({ ...g, pessoas: [...g.pessoas].sort(ordemNome) }))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
      pessoasSozinhas: todos
        .filter((g) => g.pessoas.length === 1)
        .map((g) => g.pessoas[0]!)
        .sort(ordemNome),
    }
  }, [assignable])

  // task_types.default_role_id sugere o responsável e a estimativa.
  function onTypeChange(id: string) {
    const type = types?.find((t) => String(t.id) === id)
    setForm((f) => ({
      ...f,
      taskTypeId: id,
      assigneeId:
        f.assigneeId && f.assigneeId !== me?.id
          ? f.assigneeId
          : (assignable?.find((u) => u.roleId === type?.defaultRoleId)?.id ?? f.assigneeId),
    }))
  }

  /**
   * Acrescenta o item à lista local. Nada vai ao servidor ainda: a linha
   * aponta para uma demanda que só nasce no envio do formulário.
   */
  function adicionarItem() {
    const limpo = novoItem.trim()
    if (!limpo) return
    setChecklist((atual) => [...atual, limpo])
    setNovoItem('')
  }

  if (!open) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const payload = {
      title: form.title,
      description: form.description || undefined,
      taskTypeId: Number(form.taskTypeId),
      clientId: form.clientId || null,
      /**
       * O `select` guarda os dois tipos de destino no mesmo campo, distinguidos
       * pelo prefixo `fila:`. Um `<select>` só carrega uma string, e manter dois
       * campos sincronizados — um para pessoa, outro para função — daria estados
       * impossíveis, como os dois preenchidos ao mesmo tempo, que é justamente o
       * que o backend recusa.
       */
      ...(form.assigneeId.startsWith('fila:')
        ? { queueRoleId: Number(form.assigneeId.slice(5)) }
        : { assigneeId: form.assigneeId }),
      deadline: form.deadline ? toIso(form.deadline) : '',
      priority: form.priority as never,
      observations: form.observations || null,
      labelIds: etiquetas.length ? etiquetas : undefined,
    }

    const parsed = createTaskSchema.safeParse(payload)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    try {
      const criada = await create.mutateAsync(parsed.data)

      /**
       * Os arquivos sobem DEPOIS da demanda existir, e não há como ser antes:
       * a chave no S3 é `tasks/{id}/...` e o backend recusa qualquer outra —
       * é o que impede pendurar numa demanda o arquivo de outra.
       *
       * Se um envio falhar, a demanda já está criada e o erro aparece na tela
       * sem fechar o modal. Perder o anexo é recuperável; perder o formulário
       * inteiro preenchido não seria.
       */
      /**
       * Item vazio NÃO vai para a API, e o filtro tem de estar aqui.
       *
       * A linha some sozinha ao sair do campo, mas quem apaga o texto e clica
       * direto em "Criar demanda" nunca sai dele: a string vazia seguia na
       * lista, o schema exige um caractere no mínimo, e o 400 chegava depois
       * de a demanda já existir — o pior momento possível, porque não dá para
       * desfazer nem repetir.
       */
      const itens = checklist.map((c) => c.trim()).filter(Boolean)

      if ((arquivos.length || itens.length) && criada?.id) {
        setEnviando(true)
        /**
         * Guarda o que está sendo feito para a mensagem poder dizer.
         *
         * A versão anterior tinha `catch {}` sem parâmetro: o erro real era
         * descartado e sobrava "nem tudo foi salvo", que não diz o que falhou
         * nem por quê. Quem recebe isso não tem o que fazer além de adivinhar,
         * e nem eu conseguia diagnosticar depois.
         */
        let etapa = ''
        try {
          // Em sequência, não em paralelo: o `position` de cada item sai do
          // maior já gravado, e disparar todos juntos embaralharia a ordem que
          // a pessoa digitou.
          for (const item of itens) {
            etapa = `o item "${item.length > 32 ? item.slice(0, 32) + '…' : item}"`
            await criarItemChecklist(criada.id, { content: item })
          }
          for (const arquivo of arquivos) {
            etapa = `o arquivo ${arquivo.name}`
            await enviarAnexo(criada.id, arquivo)
          }
        } catch (err) {
          const motivo = err instanceof ApiError ? err.message : 'a conexão falhou'
          setServerError(
            `A demanda foi criada, mas ${etapa} não entrou: ${motivo}. Dá para acrescentar pela tela da demanda.`,
          )
          setEnviando(false)
          return
        }
        setEnviando(false)
      }

      setForm((f) => ({ ...f, title: '', description: '', observations: '' }))
      setEtiquetas([])
      setArquivos([])
      setChecklist([])
      setNovoItem('')
      onClose()
    } catch (err) {
      // A matriz de delegação é revalidada no backend: aqui só exibimos.
      setServerError(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-8 w-full max-w-2xl rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold">Nova demanda</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <Field label="Título" required error={errors.title}>
            <input
              className={inputClass}
              autoFocus
              placeholder="Ex: Carrossel de lançamento do blend de inverno"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de demanda" required error={errors.taskTypeId}>
              <select
                className={inputClass}
                value={form.taskTypeId}
                onChange={(e) => onTypeChange(e.target.value)}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Responsável"
              required
              error={errors.assigneeId}
              hint={
                form.assigneeId.startsWith('fila:')
                  ? 'Fica disponível para a função inteira até alguém assumir'
                  : 'A lista já respeita a matriz de delegação da sua função'
              }
            >
              <select
                className={inputClass}
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              >
                {/* As filas vêm ANTES das pessoas: quando serve qualquer um da
                    função, escolher um nome no chute só faz a demanda dormir
                    com quem está cheio enquanto a colega tem folga. */}
                {filas.length > 0 && (
                  <optgroup label="Deixar para a função pegar">
                    {filas.map((f) => (
                      <option key={f.id} value={`fila:${f.id}`}>
                        Qualquer um de {f.nome} ({f.quantos} pessoas)
                      </option>
                    ))}
                  </optgroup>
                )}
                {/**
                  * Função com mais de uma pessoa vira grupo; com uma só, não.
                  *
                  * O grupo existe para ESCOLHER entre pessoas: com social media
                  * e design lado a lado numa lista corrida, achar quem se
                  * procura obriga a ler a função no fim de cada linha. Como
                  * cabeçalho, ela aparece uma vez e os nomes ficam limpos.
                  *
                  * Numa função de uma pessoa só não há entre quem escolher, e
                  * o cabeçalho gastaria uma linha para anunciar um item. Essas
                  * ficam soltas, com a função ao lado do nome — que é como a
                  * lista inteira era antes.
                  */}
                {pessoasSozinhas.length > 0 && (
                  <optgroup label="Pessoa específica">
                    {pessoasSozinhas.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} · {u.roleDisplayName}
                      </option>
                    ))}
                  </optgroup>
                )}

                {gruposPorFuncao.map((g) => (
                  <optgroup key={g.roleId} label={g.nome}>
                    {g.pessoas.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            <Field label="Prazo" required error={errors.deadline}>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

          <Field label="Descrição">
            <MarkdownEditor
              rows={5}
              placeholder="Contexto, referências, links do Drive..."
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
            />
          </Field>

          {/**
           * Etiquetas e anexos ficam no fim, e sem asterisco: são opcionais, e
           * subi-los para o meio do formulário faria a captura parecer mais
           * pesada do que é. Quem só quer registrar a demanda ignora os dois.
           */}
          <Field label="Etiquetas">
            <LabelPicker value={etiquetas} onChange={setEtiquetas} />
          </Field>

          <Field label="Checklist">
            {checklist.length > 0 && (
              <ul className="mb-2 space-y-1">
                {checklist.map((item, i) => (
                  <li
                    /**
                     * A key é a POSIÇÃO, não o texto.
                     *
                     * Com o texto na key, cada tecla digitada mudava a key e o
                     * React remontava o campo — o foco se perdia depois de uma
                     * letra e era impossível editar. A posição é estável
                     * enquanto o campo está aberto, que é o que importa aqui.
                     */
                    key={i}
                    className="group flex items-start gap-2 rounded-lg bg-overlay/5 px-2.5 py-1.5"
                  >
                    <span className="mt-0.5 text-[11px] text-ink-400 tabular-nums">{i + 1}.</span>
                    {/* Editar no lugar: corrigir uma palavra não pode custar a
                        posição do item na sequência. */}
                    <input
                      value={item}
                      onChange={(e) =>
                        setChecklist(checklist.map((x, j) => (j === i ? e.target.value : x)))
                      }
                      onBlur={(e) => {
                        // Item esvaziado não fica como linha em branco: some.
                        // Sair do campo é o momento certo, não a cada tecla —
                        // apagar tudo para reescrever removeria o item no meio.
                        if (!e.target.value.trim()) {
                          setChecklist(checklist.filter((_, j) => j !== i))
                        }
                      }}
                      onKeyDown={(e) => {
                        // Enter aqui submeteria o formulário da demanda.
                        if (e.key === 'Enter') e.preventDefault()
                      }}
                      className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 text-[13px] text-ink-800 transition hover:border-ink-200 focus:border-ink-200 focus:bg-surface focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setChecklist(checklist.filter((_, j) => j !== i))}
                      aria-label={`Remover ${item}`}
                      /**
                       * SEMPRE visível.
                       *
                       * Escondida no hover, ela era um botão que apaga sendo
                       * invisível e clicável ao mesmo tempo: clicar perto da
                       * borda direita sumia com o item, e no celular, sem
                       * hover, isso acontecia sem nunca aparecer.
                       */
                      className="shrink-0 rounded p-0.5 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-1.5">
              <input
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  // Sem o `preventDefault`, o Enter aqui submete o formulário
                  // da demanda em vez de acrescentar o item.
                  e.preventDefault()
                  adicionarItem()
                }}
                placeholder="Um passo por linha. Enter para adicionar."
                maxLength={300}
                className={inputClass}
              />
              <button
                type="button"
                onClick={adicionarItem}
                disabled={!novoItem.trim()}
                aria-label="Adicionar item"
                className="shrink-0 rounded-lg bg-brand-600 px-3 text-pine-950 transition disabled:opacity-50"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-ink-400">
              Criados junto com a demanda. Dá para acrescentar mais depois.
            </p>
          </Field>

          <Field label="Anexos">
            <input
              type="file"
              multiple
              accept={ALLOWED_ATTACHMENT_MIME.join(',')}
              onChange={(e) => {
                const escolhidos = Array.from(e.target.files ?? [])
                e.target.value = '' // permite reescolher o mesmo arquivo depois
                if (!escolhidos.length) return

                // Barra pelo tamanho aqui só para avisar cedo. O limite de
                // verdade está na assinatura do S3, que o navegador não burla.
                const limiteMb = Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)
                /**
                 * O tipo é conferido aqui também, e não só pelo `accept`.
                 *
                 * O `accept` filtra o que o seletor MOSTRA; em vários sistemas
                 * dá para trocar para "todos os arquivos" e escolher assim
                 * mesmo. Sem esta barreira o arquivo só era recusado na
                 * assinatura do S3 — depois de a demanda já ter sido criada.
                 */
                const aceitos = (ALLOWED_ATTACHMENT_MIME as readonly string[])
                const invalidos = escolhidos.filter((f) => !aceitos.includes(f.type))
                const grandes = escolhidos.filter(
                  (f) => f.size > MAX_ATTACHMENT_BYTES && aceitos.includes(f.type),
                )
                const bons = escolhidos.filter(
                  (f) => f.size <= MAX_ATTACHMENT_BYTES && aceitos.includes(f.type),
                )

                /**
                 * SOMA ao que já estava escolhido, em vez de substituir.
                 *
                 * Trocar a lista inteira era o que obrigava a escolher tudo num
                 * gesto só: quem pegava três fotos e depois lembrava do PDF
                 * perdia as três sem aviso — e o sintoma parecia ser "só dá para
                 * anexar um por vez".
                 *
                 * A chave nome+tamanho evita subir a mesma foto duas vezes,
                 * que passa a ser fácil agora que a lista acumula.
                 */
                setArquivos((atuais) => {
                  const jaTem = new Set(atuais.map((f) => `${f.name}:${f.size}`))
                  return [...atuais, ...bons.filter((f) => !jaTem.has(`${f.name}:${f.size}`))]
                })

                // Os recusados ficam de fora, mas os outros já entraram acima.
                const recusados = [
                  ...grandes.map((f) => `${f.name} (passa de ${limiteMb} MB)`),
                  ...invalidos.map((f) => `${f.name} (tipo não aceito)`),
                ]
                setServerError(recusados.length ? `Não anexei: ${recusados.join(', ')}` : null)
              }}
              className="w-full text-[13px] text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-overlay/8 file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-ink-800 hover:file:bg-overlay/12"
            />
            {arquivos.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {arquivos.map((a, i) => (
                  <li
                    key={`${a.name}-${i}`}
                    className="flex items-center gap-2.5 rounded-lg bg-overlay/5 px-2.5 py-2"
                  >
                    {previews[i] ? (
                      <button
                        type="button"
                        onClick={() => setAmpliada({ src: previews[i]!, alt: a.name, i })}
                        title="Ampliar"
                        className="shrink-0 overflow-hidden rounded-md ring-1 ring-overlay/15 transition hover:ring-brand-500"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element --
                            `blob:` local, nada para o otimizador do Next fazer. */}
                        <img src={previews[i]!} alt={a.name} className="size-10 object-cover" />
                      </button>
                    ) : (
                      <Paperclip className="size-3.5 shrink-0 text-ink-400" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-[12px] text-ink-500">
                      {a.name}
                    </span>
                    {/* Tirar da lista antes de criar a demanda. Sem isto o
                        único jeito de desfazer uma escolha errada era fechar o
                        modal e começar de novo. */}
                    <button
                      type="button"
                      onClick={() => setArquivos(arquivos.filter((_, j) => j !== i))}
                      aria-label={`Remover ${a.name}`}
                      className="shrink-0 rounded p-1 text-ink-300 transition hover:bg-red-500/12 hover:text-red-300"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1 text-[11px] text-ink-400">
              Enviados depois que a demanda for criada.
            </p>
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
            {/* O rótulo muda durante o upload: sem isso o botão fica travado
                e mudo enquanto os arquivos sobem, e parece que engasgou. */}
            <Button type="submit" disabled={create.isPending || enviando}>
              {(create.isPending || enviando) && <Spinner />}
              {enviando ? 'Salvando o resto…' : 'Criar demanda'}
            </Button>
          </div>
        </form>
      </div>

      {ampliada && (
        <ImageLightbox
          src={ampliada.src}
          alt={ampliada.alt}
          onClose={() => setAmpliada(null)}
          /* Fecha junto: continuar olhando, ampliada, uma foto que acabou de
             sair da lista não faria sentido nenhum. */
          onRemover={() => {
            setArquivos(arquivos.filter((_, j) => j !== ampliada.i))
            setAmpliada(null)
          }}
        />
      )}
    </div>
  )
}
