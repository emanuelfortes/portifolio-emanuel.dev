'use client'

import { ReactMarkdown, remarkGfm, remarkBreaks } from '@/demos/kanban-cev/lib/mini-markdown'
import clsx from 'clsx'

/**
 * Renderiza markdown com o tema do app.
 *
 * O `react-markdown` monta elementos React a partir da árvore do markdown — não
 * gera string de HTML e não usa `dangerouslySetInnerHTML`. Isso é o que torna
 * seguro exibir texto que qualquer pessoa da equipe digitou: HTML cru embutido
 * na descrição é ignorado, não executado. Um caminho com `marked` + `innerHTML`
 * exigiria sanitizador, e sanitizador é coisa que se erra em silêncio.
 *
 * O `remark-gfm` traz o que as pessoas esperam de "markdown" hoje: tabelas,
 * riscado, lista de tarefas e — o que mais importa aqui — link automático em
 * endereço colado sem sintaxe. É o que aposentou o `TextoComLinks`.
 *
 * Cada elemento recebe classe explícita porque o `@tailwindcss/preflight` zera
 * a formatação padrão dos navegadores: sem isto, `#` viraria um h1 do mesmo
 * tamanho do parágrafo, e a lista sairia sem marcador.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={clsx('text-[13px] leading-relaxed text-ink-700', className)}>
      <ReactMarkdown
        /**
         * `remark-breaks`: Enter vira quebra de linha, como no editor.
         *
         * No markdown padrão uma linha só vira espaço, e "0:13 - ajustar…"
         * digitado linha a linha saía como um parágrafo corrido — a pessoa
         * via na página algo diferente do que tinha escrito (30/09/2026). É a
         * regra do GitHub em comentários, e é o que quem escreve espera.
         */
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

          h1: ({ children }) => (
            <h1 className="mt-3 mb-1.5 text-[15px] font-semibold text-ink-900 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-3 mb-1.5 text-[14px] font-semibold text-ink-900 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-2.5 mb-1 text-[13px] font-semibold text-ink-900 first:mt-0">
              {children}
            </h3>
          ),

          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="pl-0.5">{children}</li>,

          strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="text-ink-500">{children}</del>,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              // Sem `noopener`, a página aberta recebe referência a esta janela
              // e pode trocá-la de endereço por baixo.
              rel="noopener noreferrer"
              // Dentro de uma linha clicável, sem isto o clique no link também
              // dispara a navegação da linha.
              onClick={(e) => e.stopPropagation()}
              className="break-all text-gold-300 underline underline-offset-2 transition hover:text-gold-200"
            >
              {children}
            </a>
          ),

          code: ({ children, className: cls }) => {
            // Bloco de código vem com `language-*`; trecho solto vem sem.
            const emBloco = /language-/.test(cls ?? '')
            return emBloco ? (
              <code className="block">{children}</code>
            ) : (
              <code className="rounded bg-overlay/10 px-1 py-0.5 font-mono text-[12px] text-gold-200">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="thin-scroll mb-2 overflow-x-auto rounded-lg bg-pine-950/60 p-3 font-mono text-[12px] text-ink-700">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="mb-2 border-l-2 border-gold-300/40 pl-3 text-ink-600 italic">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-3 border-overlay/10" />,

          // A tabela rola dentro da própria caixa: sem isso, uma tabela larga
          // empurraria a coluna inteira da tela.
          table: ({ children }) => (
            <div className="thin-scroll mb-2 overflow-x-auto">
              <table className="w-full border-collapse text-left">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-overlay/12 px-2 py-1 font-medium text-ink-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-overlay/6 px-2 py-1">{children}</td>
          ),

          // Lista de tarefas do GFM: `- [ ]` e `- [x]`. Só de leitura aqui — o
          // checklist de verdade é a tabela `task_checklist_items`, que conta e
          // registra quem marcou.
          input: ({ checked }) => (
            <input
              type="checkbox"
              checked={!!checked}
              readOnly
              className="mr-1.5 size-3.5 align-[-2px] accent-gold-300"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
