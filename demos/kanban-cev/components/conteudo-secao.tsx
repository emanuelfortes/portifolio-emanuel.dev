'use client'

import clsx from 'clsx'
import { Link as LinkIcon } from 'lucide-react'
import { Markdown } from '@/demos/kanban-cev/components/markdown'
import { LISTAS_DO_FORMATO, secaoPreenchida } from '@/demos/kanban-cev/lib/secoes-cliente'

/**
 * O conteúdo de uma seção do onboarding, só leitura, nos quatro formatos.
 *
 * Extraído do `SecaoPerfil` porque agora tem DOIS donos: a página da seção,
 * onde se lê e edita, e o bloco escondido que cada card usa para gerar o PDF.
 * Duas implementações do mesmo desenho divergiriam no primeiro formato novo —
 * e a divergência apareceria só no PDF, que é onde ninguém olha até mandar
 * para o cliente.
 */
export function ConteudoSecao({
  formato,
  conteudo,
  vazioTexto = 'Nada cadastrado aqui.',
}: {
  formato: string
  conteudo: any
  vazioTexto?: string
}) {
  const listas = LISTAS_DO_FORMATO[formato] ?? []
  const temTexto = formato === 'texto' || formato === 'voz'
  const ehIdv = formato === 'idv'
  const vazia = !secaoPreenchida(formato, conteudo ?? {})

  if (vazia) return <p className="text-[13px] text-ink-400">{vazioTexto}</p>

  return (
    <>
      {/* markdown: sozinho no formato `texto`, acima das listas no `voz` */}
      {temTexto && conteudo.texto && <Markdown>{conteudo.texto}</Markdown>}

      {listas.length > 0 && (
        <div className={clsx('grid gap-3 sm:grid-cols-2', temTexto && conteudo.texto && 'mt-4')}>
          {listas.map((l) => (
            <div key={l.key} className={clsx('rounded-lg p-3 ring-1 ring-inset', l.className)}>
              <p className="mb-1.5 text-[12px] font-semibold text-ink-800">{l.label}</p>
              {(conteudo[l.key] ?? []).length ? (
                <ul className="space-y-0.5">
                  {(conteudo[l.key] as string[]).map((item, i) => (
                    <li key={i} className="text-[13px] text-ink-700">
                      · {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-ink-400">Vazio</p>
              )}
            </div>
          ))}
        </div>
      )}

      {ehIdv && (
        <div className="space-y-3 text-[13px]">
          {conteudo.fonte && (
            <p className="text-ink-700">
              <span className="text-ink-500">Fonte: </span>
              {conteudo.fonte}
            </p>
          )}

          {(conteudo.cores ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(conteudo.cores as string[]).map((cor, i) => (
                /*
                 * A amostra é o ponto da seção: código hexadecimal em texto
                 * não diz nada a quem está montando a peça, e obrigaria a
                 * colar num editor só para saber que verde é esse.
                 */
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-overlay/5 py-1 pl-1 pr-2.5 ring-1 ring-inset ring-overlay/10"
                >
                  <span
                    className="size-5 rounded ring-1 ring-inset ring-overlay/25"
                    style={{ background: cor }}
                  />
                  <code className="text-[12px] text-ink-700">{cor}</code>
                </span>
              ))}
            </div>
          )}

          {conteudo.logoUrl && (
            <a
              href={conteudo.logoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-700"
            >
              <LinkIcon className="size-3.5" />
              {/* No PDF o link não clica: o endereço aparece ao lado para poder
                  ser copiado de um papel ou de uma tela de leitura. */}
              <span className="hidden print:inline">{conteudo.logoUrl}</span>
              <span className="print:hidden">Abrir a logo</span>
            </a>
          )}
        </div>
      )}
    </>
  )
}
