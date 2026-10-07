import Link from '@/demos/dr-erico/lib/Link'

/**
 * Renderizador do campo `content` de posts e notícias.
 *
 * Isto vivia dentro de app/blog/[slug]/page.tsx. Saiu de lá quando a seção de
 * notícias passou a precisar do mesmo formato: duplicar o parser daria duas
 * gramáticas que divergem na primeira correção feita só de um lado.
 *
 * Nada foi alterado na mudança, nem a marcação nem as classes. É o mesmo
 * código, em outro arquivo.
 *
 * ── Gramática aceita ──────────────────────────────────────────────────────
 *   ## Título          h2, com id para a navegação lateral
 *   ### Subtítulo      h3
 *   - item             lista
 *   | a | b |          tabela (precisa da linha | --- | --- |)
 *   **negrito**        negrito
 *   [texto](/destino)  link
 */

export type Block =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export function parseContent(raw: string): Block[] {
  const lines = raw.split('\n')
  const blocks: Block[] = []
  let listItems: string[] | null = null

  const flushList = () => {
    if (listItems) {
      blocks.push({ type: 'ul', items: listItems })
      listItems = null
    }
  }

  let tableRows: string[][] | null = null

  const flushTable = () => {
    if (tableRows && tableRows.length >= 2) {
      const [headers, , ...rows] = tableRows
      blocks.push({ type: 'table', headers, rows })
    }
    tableRows = null
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) { flushList(); flushTable(); continue }

    if (t.startsWith('|')) {
      flushList()
      const cells = t.split('|').slice(1, -1).map((c) => c.trim())
      if (!tableRows) tableRows = []
      tableRows.push(cells)
      continue
    }

    flushTable()

    if (t.startsWith('## ')) {
      flushList()
      const text = t.slice(3)
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      blocks.push({ type: 'h2', text, id })
    } else if (t.startsWith('### ')) {
      flushList()
      blocks.push({ type: 'h3', text: t.slice(4) })
    } else if (t.startsWith('- ')) {
      if (!listItems) listItems = []
      listItems.push(t.slice(2))
    } else {
      flushList()
      blocks.push({ type: 'p', text: t })
    }
  }
  flushList()
  flushTable()
  return blocks
}

/**
 * Formatação dentro de um parágrafo: [texto](/destino) e **negrito**.
 *
 * Antes disso o conteúdo era impresso cru, então `**negrito**` aparecia com os
 * asteriscos na tela em vários posts, e nenhum link interno funcionava: os
 * artigos citavam uns aos outros só em texto.
 *
 * Isso tinha custo real de indexação. O Search Console mostrava 10 páginas
 * como "O Google não reconhece o URL", ou seja, nunca alcançadas. Página que
 * existe só no sitemap e não recebe link interno é exatamente a que fica
 * assim.
 *
 * ── Sobre os destinos aceitos ─────────────────────────────────────────────
 * Só passam links internos (começam com /) e https://. Qualquer outra coisa,
 * incluindo javascript: e data:, é renderizada como texto simples. O conteúdo
 * é nosso, mas um renderizador que aceita qualquer esquema de URL é um buraco
 * esperando alguém colar algo de fora.
 */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g

export function renderInline(texto: string): React.ReactNode[] {
  const nos: React.ReactNode[] = []
  let cursor = 0
  let n = 0

  for (const m of texto.matchAll(INLINE)) {
    const inicio = m.index ?? 0
    if (inicio > cursor) nos.push(texto.slice(cursor, inicio))

    if (m[1] !== undefined) {
      const rotulo = m[1]
      const destino = m[2]
      const interno = destino.startsWith('/')
      const externo = destino.startsWith('https://')

      if (interno) {
        nos.push(
          <Link
            key={n}
            href={destino}
            className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors"
          >
            {rotulo}
          </Link>,
        )
      } else if (externo) {
        nos.push(
          <a
            key={n}
            href={destino}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors"
          >
            {rotulo}
          </a>,
        )
      } else {
        // Esquema não permitido: cai para texto, sem link.
        nos.push(rotulo)
      }
    } else if (m[3] !== undefined) {
      nos.push(
        <strong key={n} className="font-semibold text-brand-navy">
          {m[3]}
        </strong>,
      )
    }

    cursor = inicio + m[0].length
    n++
  }

  if (cursor < texto.length) nos.push(texto.slice(cursor))
  return nos
}

export function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={index}
          id={block.id}
          className="font-display text-2xl md:text-3xl text-brand-navy mt-12 mb-4 scroll-mt-28 pb-3 border-b border-brand-beige"
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={index} className="font-display text-xl text-brand-navy mt-8 mb-3">
          {renderInline(block.text)}
        </h3>
      )
    case 'p':
      return (
        <p key={index} className="text-brand-muted leading-relaxed mt-4 text-[15px]">
          {renderInline(block.text)}
        </p>
      )
    case 'ul':
      return (
        <ul key={index} className="mt-4 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-brand-muted text-[15px]">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div key={index} className="mt-6 overflow-x-auto rounded-xl border border-brand-beige">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-beige">
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 font-semibold text-brand-navy whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className="border-t border-brand-beige even:bg-brand-beige/30">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-brand-muted">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}
