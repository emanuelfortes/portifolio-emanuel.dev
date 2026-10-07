'use client'

import { useRef, useState } from 'react'
import { Pencil, Plus, Check, X, FileDown, Link as LinkIcon } from 'lucide-react'
import clsx from 'clsx'
import { Markdown } from '@/demos/kanban-cev/components/markdown'
import { MarkdownEditor } from '@/demos/kanban-cev/components/markdown-editor'
import { Spinner, inputClass } from '@/demos/kanban-cev/components/ui'
import { useSaveClientSection } from '@/demos/kanban-cev/lib/hooks'
import { LISTAS_DO_FORMATO, secaoPreenchida } from '@/demos/kanban-cev/lib/secoes-cliente'
import { imprimirElemento } from '@/demos/kanban-cev/lib/imprimir'
import { ConteudoSecao } from '@/demos/kanban-cev/components/conteudo-secao'

/**
 * O editor de uma seção do onboarding, nos quatro formatos.
 *
 * Mora fora da página porque cada seção tem a sua própria rota: a página é só
 * o cabeçalho e o caminho de volta, o conteúdo é isto aqui.
 */
export function SecaoPerfil({
  clientId,
  tipo,
  titulo,
  hint,
  formato,
  registro,
  podeEditar,
}: {
  clientId: string
  tipo: string
  titulo: string
  hint: string
  formato: string
  registro: any
  podeEditar: boolean
}) {
  const salvar = useSaveClientSection(clientId)
  const [editando, setEditando] = useState(false)
  /** O alvo do recorte de impressão: esta seção, e só ela. */
  const caixa = useRef<HTMLElement>(null)

  const listas = LISTAS_DO_FORMATO[formato] ?? []
  const temTexto = formato === 'texto' || formato === 'voz'
  const ehIdv = formato === 'idv'

  const conteudo = registro?.content ?? {}
  const [texto, setTexto] = useState<string>(conteudo.texto ?? '')
  /** Cada lista vira um textarea de "um item por linha" enquanto se edita. */
  const [itens, setItens] = useState<Record<string, string>>(() =>
    Object.fromEntries(listas.map((l) => [l.key, (conteudo[l.key] ?? []).join('\n')])),
  )
  const [idv, setIdv] = useState({
    fonte: conteudo.fonte ?? '',
    cores: (conteudo.cores ?? []).join('\n'),
    logoUrl: conteudo.logoUrl ?? '',
  })

  function abrir() {
    const atual = registro?.content ?? {}
    setTexto(atual.texto ?? '')
    setItens(Object.fromEntries(listas.map((l) => [l.key, (atual[l.key] ?? []).join('\n')])))
    setIdv({
      fonte: atual.fonte ?? '',
      cores: (atual.cores ?? []).join('\n'),
      logoUrl: atual.logoUrl ?? '',
    })
    setEditando(true)
  }

  /** "um item por linha" → array, sem linha em branco nem espaço sobrando. */
  function porLinha(bruto: string): string[] {
    return bruto
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }

  async function gravar() {
    // Os quatro formatos cabem no mesmo jsonb — é o motivo de a coluna ser
    // jsonb, e o que permite acrescentar seção sem migração.
    const content: Record<string, unknown> = {}
    if (temTexto) content.texto = texto
    for (const l of listas) content[l.key] = porLinha(itens[l.key] ?? '')
    if (ehIdv) {
      content.fonte = idv.fonte.trim()
      content.cores = porLinha(idv.cores)
      content.logoUrl = idv.logoUrl.trim()
    }

    await salvar.mutateAsync({ sectionType: tipo, title: titulo, content })
    setEditando(false)
  }

  const vazia = !secaoPreenchida(formato, conteudo)

  return (
    <section ref={caixa} className="rounded-xl border border-ink-200 bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-900">{titulo}</h2>
          <p className="text-[12px] text-ink-500">{hint}</p>
        </div>

        {/**
          * O PDF só desta seção.
          *
          * `data-sem-impressao` no grupo dos botões: eles são para interagir e
          * não têm o que fazer no papel. Sai da impressão, não da tela.
          *
          * Some enquanto edita — imprimir um formulário aberto sairia com os
          * campos, não com o conteúdo.
          */}
        {!editando && !vazia && (
          <button
            data-sem-impressao
            onClick={() => imprimirElemento(caixa.current)}
            title="Gerar PDF desta seção"
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <FileDown className="size-4" />
          </button>
        )}

        {podeEditar && !editando && (
          <button
            onClick={abrir}
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            title={vazia ? 'Preencher' : 'Editar'}
          >
            {vazia ? <Plus className="size-4" /> : <Pencil className="size-4" />}
          </button>
        )}

        {editando && (
          <div className="flex shrink-0 gap-1">
            <button
              onClick={gravar}
              disabled={salvar.isPending}
              className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-500/12 disabled:opacity-50"
              title="Salvar"
            >
              {salvar.isPending ? <Spinner /> : <Check className="size-4" />}
            </button>
            <button
              onClick={() => setEditando(false)}
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100"
              title="Cancelar"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/*
        * Editando: os campos. Lendo: o componente compartilhado.
        *
        * A leitura saiu daqui para o `ConteudoSecao` porque o bloco de
        * impressão de cada card precisa exatamente do mesmo desenho — e duas
        * implementações divergiriam no primeiro formato novo, com a diferença
        * aparecendo só no PDF.
        */}
      {editando ? (
        <>
          {temTexto && <MarkdownEditor rows={12} value={texto} onChange={setTexto} />}

          {listas.length > 0 && (
            <div className={clsx('grid gap-3 sm:grid-cols-2', temTexto && 'mt-4')}>
              {listas.map((l) => (
                <div key={l.key} className={clsx('rounded-lg p-3 ring-1 ring-inset', l.className)}>
                  <p className="mb-1.5 text-[12px] font-semibold text-ink-800">{l.label}</p>
                  <textarea
                    rows={6}
                    className="w-full rounded border border-ink-200 bg-surface px-2 py-1.5 text-[13px]"
                    placeholder="Um item por linha"
                    value={itens[l.key] ?? ''}
                    onChange={(e) => setItens({ ...itens, [l.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          {ehIdv && (
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[12px] font-medium text-ink-700">Fonte</p>
                <input
                  className={inputClass}
                  placeholder="Ex: Sora (títulos) / Manrope (texto)"
                  value={idv.fonte}
                  onChange={(e) => setIdv({ ...idv, fonte: e.target.value })}
                />
              </div>
              <div>
                <p className="mb-1 text-[12px] font-medium text-ink-700">Cores</p>
                <textarea
                  rows={5}
                  className="w-full rounded border border-ink-200 bg-surface px-2 py-1.5 text-[13px]"
                  placeholder={'Um código por linha\n#063C36\n#F7D88C'}
                  value={idv.cores}
                  onChange={(e) => setIdv({ ...idv, cores: e.target.value })}
                />
              </div>
              <div>
                <p className="mb-1 text-[12px] font-medium text-ink-700">Link da logo</p>
                <input
                  className={inputClass}
                  placeholder="https://drive.google.com/..."
                  value={idv.logoUrl}
                  onChange={(e) => setIdv({ ...idv, logoUrl: e.target.value })}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <ConteudoSecao
          formato={formato}
          conteudo={conteudo}
          vazioTexto={podeEditar ? 'Ainda não preenchido.' : 'Nada cadastrado aqui.'}
        />
      )}
    </section>
  )
}
