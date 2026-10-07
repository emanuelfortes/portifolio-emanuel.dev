/**
 * Um `react-markdown` de bolso, sem a dependência.
 *
 * Entende o que a equipe de fato escreve nas demandas: títulos, listas
 * (inclusive de tarefas), citação, separador, bloco de código, negrito,
 * itálico, riscado, código solto, link e endereço colado sem sintaxe. Enter
 * vira quebra de linha, como o `remark-breaks` do original.
 *
 * Monta elementos React, nunca HTML em string: texto digitado continua sendo
 * texto, igual ao original.
 */
import { Fragment, type ReactNode } from 'react'

type Comp = (props: { children?: ReactNode; href?: string; className?: string; checked?: boolean }) => ReactNode
type Components = Partial<Record<string, Comp>>

/* Os plugins do original viram marcadores: o comportamento já está embutido. */
export const remarkGfm = 'gfm'
export const remarkBreaks = 'breaks'

let chave = 0

function el(tag: string, components: Components, props: Record<string, unknown>, children?: ReactNode): ReactNode {
  const C = components[tag]
  const k = `md${chave++}`
  if (C) return <Fragment key={k}>{C({ ...props, children })}</Fragment>
  const Tag = tag as 'p'
  return (
    <Tag key={k} {...props}>
      {children}
    </Tag>
  )
}

const INLINE =
  /(\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s][^*]*)\*|_([^_\s][^_]*)_|(https?:\/\/[^\s<]+[^\s<.,;:!?)]))/

function inline(texto: string, c: Components): ReactNode[] {
  const out: ReactNode[] = []
  let resto = texto
  while (resto) {
    const m = INLINE.exec(resto)
    if (!m) {
      out.push(resto)
      break
    }
    if (m.index) out.push(resto.slice(0, m.index))
    if (m[2] ?? m[3]) out.push(el('strong', c, {}, inline((m[2] ?? m[3])!, c)))
    else if (m[4]) out.push(el('del', c, {}, inline(m[4], c)))
    else if (m[5]) out.push(el('code', c, {}, m[5]))
    else if (m[6]) out.push(el('a', c, { href: m[7] }, inline(m[6], c)))
    else if (m[8] ?? m[9]) out.push(el('em', c, {}, inline((m[8] ?? m[9])!, c)))
    else if (m[10]) out.push(el('a', c, { href: m[10] }, m[10]))
    resto = resto.slice(m.index + m[0].length)
  }
  return out
}

/** Linhas de um parágrafo, com a quebra de linha do `remark-breaks`. */
function linhas(ls: string[], c: Components): ReactNode[] {
  return ls.flatMap((l, i) => (i ? [<br key={`br${chave++}`} />, ...inline(l, c)] : inline(l, c)))
}

function blocos(md: string, c: Components): ReactNode[] {
  const ls = md.replace(/\r\n/g, '\n').split('\n')
  const out: ReactNode[] = []
  let i = 0
  while (i < ls.length) {
    const l = ls[i]!
    if (!l.trim()) {
      i++
      continue
    }
    if (l.startsWith('```')) {
      const cod: string[] = []
      i++
      while (i < ls.length && !ls[i]!.startsWith('```')) cod.push(ls[i++]!)
      i++
      out.push(el('pre', c, {}, el('code', c, { className: 'language-text' }, cod.join('\n'))))
      continue
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(l)
    if (h) {
      out.push(el(`h${h[1]!.length}`, c, {}, inline(h[2]!, c)))
      i++
      continue
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) {
      out.push(el('hr', c, {}))
      i++
      continue
    }
    if (l.startsWith('>')) {
      const q: string[] = []
      while (i < ls.length && ls[i]!.startsWith('>')) q.push(ls[i++]!.replace(/^>\s?/, ''))
      out.push(el('blockquote', c, {}, blocos(q.join('\n'), c)))
      continue
    }
    const lista = /^\s*([-*+]|\d+\.)\s+/
    if (lista.test(l)) {
      const ordenada = /^\s*\d+\./.test(l)
      const itens: ReactNode[] = []
      while (i < ls.length && lista.test(ls[i]!)) {
        const txt = ls[i++]!.replace(lista, '')
        const tarefa = /^\[( |x|X)\]\s+(.*)$/.exec(txt)
        itens.push(
          el(
            'li',
            c,
            {},
            tarefa
              ? [el('input', c, { checked: tarefa[1] !== ' ' }), ...inline(tarefa[2]!, c)]
              : inline(txt, c),
          ),
        )
      }
      out.push(el(ordenada ? 'ol' : 'ul', c, {}, itens))
      continue
    }
    const p: string[] = []
    while (
      i < ls.length &&
      ls[i]!.trim() &&
      !/^(#{1,3}\s|>|```|\s*([-*+]|\d+\.)\s+)/.test(ls[i]!)
    ) {
      p.push(ls[i++]!)
    }
    out.push(el('p', c, {}, linhas(p, c)))
  }
  return out
}

export function ReactMarkdown({
  children,
  components = {},
}: {
  children: string
  components?: Components
  remarkPlugins?: unknown[]
}) {
  return <>{blocos(children ?? '', components)}</>
}
