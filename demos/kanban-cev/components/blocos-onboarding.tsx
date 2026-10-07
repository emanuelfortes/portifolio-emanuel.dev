'use client'

import { useState } from 'react'
import Link from '@/demos/kanban-cev/lib/nav'
import { CheckCircle2, Circle, AlignLeft, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import {
  PerguntasDoBloco,
  perguntasDoCliente,
  respostasDoCliente,
  ehPergunta,
} from '@/demos/kanban-cev/components/briefing'
import { SECOES, secaoPreenchida } from '@/demos/kanban-cev/lib/secoes-cliente'

/**
 * A coluna de blocos do onboarding, em acordeão.
 *
 * É a tela de ALIMENTAR: durante a reunião, abre-se um bloco por vez, as
 * perguntas dele aparecem ali mesmo e a resposta é escrita no lugar. Não
 * navega — sair da página a cada bloco quebraria o ritmo da conversa.
 *
 * A consulta é outra tela (os cards abaixo desta): quem lê depois quer um
 * bloco isolado e inteiro, não a entrevista que o produziu. Uma única visão
 * serviria mal aos dois usos.
 *
 * Um bloco aberto por vez, de propósito: com vários abertos, a coluna vira
 * uma parede de texto e se perde a noção de onde a reunião está.
 */
export function BlocosOnboarding({
  clientId,
  porTipo,
  podeEditar,
}: {
  clientId: string
  porTipo: Map<string, any>
  podeEditar: boolean
}) {
  const [aberto, setAberto] = useState<string | null>(null)

  const briefing = porTipo.get('briefing')
  const perguntas = perguntasDoCliente(briefing)
  const respostas = respostasDoCliente(briefing)

  return (
    <div className="space-y-2">
      {SECOES.map((s) => {
        /**
         * Só PERGUNTAS entram na conta do bloco.
         *
         * Uma anotação não se responde. Contando-a, o bloco nunca alcançaria
         * "todas respondidas" e o visto verde jamais apareceria — quem
         * escrevesse um lembrete estaria condenando o bloco a parecer
         * incompleto para sempre.
         */
        const minhas = perguntas.filter((p) => p.secao === s.type && ehPergunta(p))
        const respondidas = minhas.filter((p) => respostas[p.id]?.trim()).length

        /**
         * O visto verde é "este bloco está pronto".
         *
         * Bloco com pergunta fica pronto quando todas foram respondidas. Bloco
         * sem pergunta nenhuma — SWOT, Links — não teria como ficar pronto por
         * esse critério, então vale o conteúdo da seção.
         */
        const conteudo = porTipo.get(s.type)?.content
        const temConteudo = secaoPreenchida(s.formato, conteudo)
        const pronto = minhas.length > 0 ? respondidas === minhas.length : temConteudo

        const estaAberto = aberto === s.type

        return (
          <div
            key={s.type}
            className={clsx(
              'overflow-hidden rounded-lg border transition',
              estaAberto ? 'border-brand-500/40 bg-overlay/5' : 'border-ink-200 bg-surface',
            )}
          >
            <button
              onClick={() => setAberto(estaAberto ? null : s.type)}
              className="flex w-full items-start gap-2.5 p-3 text-left"
            >
              {pronto ? (
                <CheckCircle2 className="mt-px size-4 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="mt-px size-4 shrink-0 text-ink-300" />
              )}

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-snug text-ink-800">
                  {s.title}
                </span>

                {/* Mesma ideia do risquinho do Trello: diz que há conteúdo
                    aqui dentro sem obrigar a abrir para descobrir. */}
                {(temConteudo || respondidas > 0) && !estaAberto && (
                  <span className="mt-1.5 flex items-center gap-2 text-ink-400">
                    {temConteudo && <AlignLeft className="size-4" />}
                    {minhas.length > 0 && (
                      <span className="text-[13px] tabular-nums">
                        {respondidas}/{minhas.length}
                      </span>
                    )}
                  </span>
                )}
              </span>
            </button>

            {estaAberto && (
              <div className="border-t border-overlay/10 px-3 pb-3 pt-3">
                <PerguntasDoBloco
                  clientId={clientId}
                  secao={s.type}
                  briefing={briefing}
                  podeEditar={podeEditar}
                />

                <Link
                  href={`/clientes/${clientId}/secoes/${s.type}`}
                  className="mt-3 inline-flex items-center gap-1.5 border-t border-overlay/10 pt-3 text-[12px] font-medium text-ink-500 transition hover:text-brand-700"
                >
                  Abrir o bloco inteiro
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
