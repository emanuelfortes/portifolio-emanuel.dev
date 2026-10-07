'use client'

import { useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Code,
  Quote,
  Eye,
  Pencil,
} from 'lucide-react'
import clsx from 'clsx'
import { Markdown } from '@/demos/kanban-cev/components/markdown'

/**
 * Editor de markdown com barra de ferramentas.
 *
 * É o mesmo desenho do Trello, e não por imitação: a barra ali também insere
 * SINTAXE, não formata o texto na tela. Guardar markdown é o que mantém a
 * descrição legível fora do sistema, versionável, e imune a HTML injetado —
 * um editor que guardasse HTML precisaria de sanitizador na leitura.
 *
 * Nada de WYSIWYG de propósito: o ganho visual não paga as ~100KB e a
 * superfície de bug de um editor de árvore. Quem digita `**` já vê negrito na
 * pré-visualização, que é a mesma que a demanda vai mostrar.
 */

interface Acao {
  icone: typeof Bold
  titulo: string
  /** Envolve a seleção. Ex.: `**` de cada lado. */
  envolver?: string
  /** Prefixa a linha. Ex.: `- ` na lista. */
  prefixo?: string
  /** Sufixo diferente do prefixo, para link. */
  fim?: string
  exemplo?: string
}

const ACOES: Acao[] = [
  { icone: Bold, titulo: 'Negrito', envolver: '**', exemplo: 'texto' },
  { icone: Italic, titulo: 'Itálico', envolver: '*', exemplo: 'texto' },
  { icone: Strikethrough, titulo: 'Riscado', envolver: '~~', exemplo: 'texto' },
  { icone: Heading2, titulo: 'Título', prefixo: '## ', exemplo: 'Título' },
  { icone: List, titulo: 'Lista', prefixo: '- ', exemplo: 'item' },
  { icone: ListOrdered, titulo: 'Lista numerada', prefixo: '1. ', exemplo: 'item' },
  { icone: Quote, titulo: 'Citação', prefixo: '> ', exemplo: 'citação' },
  { icone: Code, titulo: 'Código', envolver: '`', exemplo: 'código' },
  { icone: Link2, titulo: 'Link', envolver: '[', fim: '](https://)', exemplo: 'texto' },
]

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 6,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  autoFocus?: boolean
}) {
  const [previa, setPrevia] = useState(false)
  const campo = useRef<HTMLTextAreaElement>(null)

  /**
   * Aplica a marcação na seleção e devolve o cursor para dentro dela.
   *
   * Sem recolocar o cursor, o texto some da seleção e a pessoa precisa clicar
   * de novo para continuar digitando — o gesto quebra no meio.
   */
  function aplicar(acao: Acao) {
    const el = campo.current
    if (!el) return

    const ini = el.selectionStart
    const fim = el.selectionEnd
    const selecionado = value.slice(ini, fim) || acao.exemplo || ''

    let novo: string
    let cursorIni: number
    let cursorFim: number

    if (acao.prefixo) {
      // Prefixo vale para a linha inteira: encontra o começo dela.
      const inicioLinha = value.lastIndexOf('\n', ini - 1) + 1
      novo = value.slice(0, inicioLinha) + acao.prefixo + value.slice(inicioLinha)
      cursorIni = ini + acao.prefixo.length
      cursorFim = fim + acao.prefixo.length
    } else {
      const abre = acao.envolver ?? ''
      const fecha = acao.fim ?? acao.envolver ?? ''

      /**
       * Clicar de novo TIRA a marcação, em vez de empilhar outra.
       *
       * Sem isto, negritar duas vezes vira `****texto****`, e passar o itálico
       * por cima de um negrito vira `***texto***` — que o markdown lê como as
       * duas coisas juntas, não como a troca de uma pela outra. Quem clicou
       * duas vezes queria desfazer, não somar.
       */
      const antes = value.slice(Math.max(0, ini - abre.length), ini)
      const depois = value.slice(fim, fim + fecha.length)
      /**
       * O `*` do itálico vive dentro do `**` do negrito.
       *
       * Num texto já em negrito, o caractere colado à seleção é `*` nos dois
       * lados — e sem olhar o vizinho seguinte, clicar em itálico "desfaria" o
       * negrito pela metade, deixando `*texto*`. Se há mais do mesmo caractere
       * por fora, a marcação ali é outra.
       */
      const vizinhoIgual =
        abre.length === 1 &&
        (value[ini - abre.length - 1] === abre || value[fim + fecha.length] === fecha)
      const jaMarcado = !!abre && antes === abre && depois === fecha && !vizinhoIgual

      if (jaMarcado) {
        novo =
          value.slice(0, ini - abre.length) + selecionado + value.slice(fim + fecha.length)
        cursorIni = ini - abre.length
        cursorFim = cursorIni + selecionado.length
      } else {
        novo = value.slice(0, ini) + abre + selecionado + fecha + value.slice(fim)
        cursorIni = ini + abre.length
        cursorFim = cursorIni + selecionado.length
      }
    }

    /**
     * A rolagem é guardada e devolvida.
     *
     * Trocar o `value` remonta o conteúdo do campo e o navegador volta para o
     * topo; o `focus()` logo abaixo puxa de novo para o cursor, e o texto dá
     * um salto na frente de quem está escrevendo. Numa descrição longa a pessoa
     * perde o lugar onde estava a cada clique na barra.
     */
    const rolagem = el.scrollTop

    onChange(novo)

    // No próximo quadro: o React ainda não repintou o valor neste.
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorIni, cursorFim)
      el.scrollTop = rolagem
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-pine-900/60 focus-within:border-brand-500">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-overlay/8 px-1.5 py-1">
        {ACOES.map((a) => {
          const Icone = a.icone
          return (
            <button
              key={a.titulo}
              type="button" // dentro de um <form>, sem isto cada botão enviaria o formulário
              onClick={() => aplicar(a)}
              title={a.titulo}
              aria-label={a.titulo}
              disabled={previa}
              className="rounded p-1.5 text-ink-500 transition hover:bg-overlay/10 hover:text-ink-900 disabled:opacity-30"
            >
              <Icone className="size-3.5" />
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => setPrevia((v) => !v)}
          title={previa ? 'Voltar a editar' : 'Pré-visualizar'}
          className={clsx(
            'ml-auto flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition',
            previa ? 'bg-gold-300 text-pine-950' : 'text-ink-500 hover:bg-overlay/10 hover:text-ink-900',
          )}
        >
          {previa ? <Pencil className="size-3" /> : <Eye className="size-3" />}
          {previa ? 'Editar' : 'Ver'}
        </button>
      </div>

      {previa ? (
        // `min-h` casando com a altura do campo: sem isso a caixa encolhe ao
        // alternar e o botão de "Editar" foge de baixo do cursor.
        <div className="px-3 py-2" style={{ minHeight: rows * 22 }}>
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-[13px] text-ink-400">Nada para mostrar ainda.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={campo}
          rows={rows}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      )}

      <p className="border-t border-overlay/8 px-3 py-1.5 text-[11px] text-ink-400">
        Aceita markdown: <code className="text-ink-500">**negrito**</code>,{' '}
        <code className="text-ink-500">- lista</code>, <code className="text-ink-500">## título</code>.
        Endereço colado vira link sozinho.
      </p>
    </div>
  )
}
