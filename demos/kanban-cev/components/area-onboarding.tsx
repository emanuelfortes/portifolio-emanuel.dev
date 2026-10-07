'use client'

import { useRef, useState } from 'react'
import Link from '@/demos/kanban-cev/lib/nav'
import { Pencil, Check, FileDown } from 'lucide-react'
import clsx from 'clsx'
import { PERGUNTAS_PADRAO } from '@/demos/kanban-cev/shared'
import { BlocosOnboarding } from '@/demos/kanban-cev/components/blocos-onboarding'
import { AtaReuniao, VisorAta } from '@/demos/kanban-cev/components/ata-reuniao'
import type { Ata } from '@/demos/kanban-cev/lib/hooks'
import { briefingIniciado, briefingFinalizado, progressoBriefing } from '@/demos/kanban-cev/components/briefing'
import { Button, Spinner } from '@/demos/kanban-cev/components/ui'
import { useSaveClientSection } from '@/demos/kanban-cev/lib/hooks'
import { SECOES, secaoPreenchida } from '@/demos/kanban-cev/lib/secoes-cliente'
import { ConteudoSecao } from '@/demos/kanban-cev/components/conteudo-secao'
import { imprimirElemento } from '@/demos/kanban-cev/lib/imprimir'

/**
 * A área de onboarding do cliente, e os três momentos por que ela passa.
 *
 *   1. INÍCIO    cliente sem perfil. Escolhe começar com as perguntas de
 *                fábrica ou com os blocos vazios.
 *   2. BRIEFING  só as perguntas, em acordeão. É a reunião acontecendo.
 *   3. BLOCOS    só o conteúdo, em cards. É o material pronto, para consulta.
 *
 * Os modos 2 e 3 NÃO convivem na mesma tela de propósito. Quem está numa
 * reunião quer a próxima pergunta; quem vai produzir uma peça quer o tom de
 * voz e nada mais.
 *
 * Os três usam a mesma moldura — faixa dourada, etiqueta de estado, título e
 * a barra de progresso no rodapé. O que muda é o miolo, então a pessoa
 * reconhece onde está sem reaprender a tela a cada etapa.
 */
export function AreaOnboarding({
  clientId,
  nomeDoCliente,
  porTipo,
  podeEditar,
}: {
  clientId: string
  /** Sai no topo do PDF: a folha precisa dizer de quem ela é. */
  nomeDoCliente: string
  porTipo: Map<string, any>
  podeEditar: boolean
}) {
  const briefing = porTipo.get('briefing')
  const salvar = useSaveClientSection(clientId)
  /** Edição avulsa de um briefing já encerrado. Não persiste: é só a visita. */
  const [editando, setEditando] = useState(false)
  /** Qual ata está aberta ao lado. Nula = tela inteira para o briefing. */
  const [ataAberta, setAtaAberta] = useState<Ata | null>(null)

  const iniciado = briefingIniciado(briefing)
  const finalizado = briefingFinalizado(briefing)
  const progresso = progressoBriefing(briefing)

  const preenchidos = SECOES.filter((s) =>
    secaoPreenchida(s.formato, porTipo.get(s.type)?.content),
  ).length

  function gravarBriefing(content: Record<string, unknown>) {
    return salvar.mutateAsync({ sectionType: 'briefing', title: 'Briefing ACEV', content })
  }

  const emBriefing = iniciado && (!finalizado || editando)

  /* ---------------------------------------------------------------- blocos
   *
   * O material pronto ocupa a largura inteira, em quatro colunas e SEM cartão
   * em volta. Os outros dois estados pedem ação e por isso vivem dentro da
   * moldura de faixa dourada; este aqui é acervo — a moldura só empurraria os
   * doze cards para dentro de uma coluna estreita.
   */
  if (iniciado && finalizado && !editando) {
    return (
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-xl font-semibold tracking-tight text-ink-900">
              DNA do cliente
            </span>
            <span className="text-[13px] text-ink-500">
              {SECOES.length} blocos · {preenchidos} preenchidos
            </span>
          </h2>

          {podeEditar && (
            <button
              onClick={() => setEditando(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-3 py-2 text-[13px] font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-900"
            >
              <Pencil className="size-3.5" />
              Editar briefing
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SECOES.map((s, i) => {
            const preenchida = secaoPreenchida(s.formato, porTipo.get(s.type)?.content)
            const Icone = s.icone
            return (
              <CartaoSecao
                key={s.type}
                clientId={clientId}
                nomeDoCliente={nomeDoCliente}
                secao={s}
                numero={i + 1}
                conteudo={porTipo.get(s.type)?.content}
                preenchida={preenchida}
              />
            )
          })}
        </div>
      </section>
    )
  }

  const etiqueta = !iniciado ? 'Próximo passo' : 'Em andamento'
  const titulo = !iniciado
    ? 'Onboarding não iniciado'
    : editando
      ? 'Editando o briefing'
      : 'Briefing em andamento'

  return (
    /*
     * Com a ata aberta, a tela vira duas colunas: briefing à esquerda, PDF à
     * direita. É o ponto do recurso — transcrever a reunião lendo a ata na
     * mesma tela, em vez de alternar entre duas janelas.
     *
     * Só a partir de `xl`: abaixo disso as duas colunas ficariam estreitas
     * demais para servir a qualquer uma das duas, e o PDF vai para baixo.
     */
    <div
      className={clsx(
        ataAberta &&
          emBriefing &&
          /*
           * O PDF fica com a fatia maior: ele é o que se LÊ, e o briefing ao
           * lado é uma lista de linhas curtas que comprime bem. O contrário
           * obrigaria a dar zoom na ata a cada parágrafo.
           *
           * `minmax(0,1fr)` na primeira coluna, e não `1fr`: sem o mínimo
           * zero, um título longo dentro de um bloco empurraria a coluna e
           * roubaria espaço do PDF.
           */
          'grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(560px,56%)] xl:items-start',
      )}
    >
      <section className="overflow-hidden rounded-2xl border border-ink-200 bg-surface">
        {/* A faixa dourada na borda esquerda: marca o cartão que pede ação. */}
        <div className="border-l-[3px] border-brand-600 p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded bg-brand-600/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
              {etiqueta}
            </span>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{titulo}</h2>
          </div>

          {iniciado && finalizado && !editando && podeEditar && (
            <button
              onClick={() => setEditando(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 text-[12px] font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-800"
            >
              <Pencil className="size-3.5" />
              Editar briefing
            </button>
          )}
        </div>

        {/* ------------------------------------------------------- início */}
        {!iniciado && (
          <>
            <p className="mb-5 max-w-xl text-[13px] leading-relaxed text-ink-500">
              Os {SECOES.length} blocos existem sempre. O que você escolhe agora é se a entrevista
              começa com o roteiro da ACEV ou em branco.
            </p>

            {podeEditar ? (
              <div className="flex flex-wrap gap-2.5">
                <Button
                  onClick={() =>
                    gravarBriefing({
                      perguntas: [...PERGUNTAS_PADRAO],
                      respostas: {},
                      finalizado: false,
                    })
                  }
                  disabled={salvar.isPending}
                >
                  {salvar.isPending && <Spinner />}
                  Começar com as {PERGUNTAS_PADRAO.length} perguntas
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    gravarBriefing({ perguntas: [], respostas: {}, finalizado: false })
                  }
                  disabled={salvar.isPending}
                >
                  Começar sem perguntas
                </Button>
              </div>
            ) : (
              <p className="text-[13px] text-ink-400">
                Ninguém preencheu o onboarding deste cliente ainda.
              </p>
            )}
          </>
        )}

        {/* ----------------------------------------------------- briefing */}
        {emBriefing && (
          <>
            <p className="mb-4 text-[14px] text-ink-500">
              {progresso.total > 0
                ? `${progresso.respondidas} de ${progresso.total} perguntas respondidas`
                : 'Sem perguntas — acrescente as suas dentro de cada bloco'}
            </p>

            <AtaReuniao
              clientId={clientId}
              secao={porTipo.get('atas')}
              podeEditar={podeEditar}
              ataAberta={ataAberta}
              onAbrir={setAtaAberta}
            />

            <div className="mt-4">
              <BlocosOnboarding clientId={clientId} porTipo={porTipo} podeEditar={podeEditar} />
            </div>

            {podeEditar && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={async () => {
                    await gravarBriefing({
                      perguntas: briefing?.content?.perguntas ?? [],
                      respostas: briefing?.content?.respostas ?? {},
                      finalizado: true,
                    })
                    setEditando(false)
                  }}
                  disabled={salvar.isPending}
                >
                  {salvar.isPending ? <Spinner /> : <Check className="size-4" />}
                  {editando ? 'Salvar' : 'Finalizar briefing'}
                </Button>

                <p className="text-[13px] text-ink-500">
                  {editando
                    ? 'Volta para os blocos de conteúdo.'
                    : 'Responder não é obrigatório — dá para encerrar e preencher os blocos direto.'}
                </p>
              </div>
            )}
          </>
        )}

        </div>
      </section>

      {ataAberta && emBriefing && (
        <VisorAta ata={ataAberta} onFechar={() => setAtaAberta(null)} />
      )}
    </div>
  )
}

/**
 * Um card da grade, com o PDF só desta seção.
 *
 * O card em si é um `Link`: clicar em qualquer lugar abre a seção. O botão do
 * PDF vive DENTRO dele e por isso precisa parar o evento — sem `preventDefault`
 * o clique gera o PDF e navega junto, e quem voltasse encontraria a página
 * errada sem entender por quê.
 */
function CartaoSecao({
  clientId,
  nomeDoCliente,
  secao,
  numero,
  conteudo,
  preenchida,
}: {
  clientId: string
  nomeDoCliente: string
  secao: (typeof SECOES)[number]
  numero: number
  conteudo: any
  preenchida: boolean
}) {
  const paraImprimir = useRef<HTMLDivElement>(null)
  const Icone = secao.icone
  const i = numero - 1
  const s = secao

  return (
    <div className="relative">
      {/**
        * O conteúdo inteiro, escondido na tela e visível só na impressão.
        *
        * O card mostra título e dica; o PDF precisa do conteúdo. Como a página
        * do cliente já carregou todas as seções, o dado está aqui — buscar de
        * novo no clique atrasaria o PDF sem necessidade.
        *
        * `hidden` some da tela; a regra de impressão em `globals.css` o traz de
        * volta quando ele é o alvo marcado.
        */}
      <div ref={paraImprimir} data-so-impressao hidden>
        <h1 className="text-[20px] font-semibold text-ink-900">{s.title}</h1>
        <p className="mt-0.5 mb-4 text-[13px] text-ink-500">{nomeDoCliente}</p>
        <ConteudoSecao formato={s.formato} conteudo={conteudo} />
      </div>

      {preenchida && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            imprimirElemento(paraImprimir.current)
          }}
          title={`Gerar PDF de ${s.title}`}
          /* Acima do card no empilhamento, senão o Link engole o clique. */
          className="absolute right-2.5 top-2.5 z-10 rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-ink-100 hover:text-ink-800 focus:opacity-100 group-hover/card:opacity-100"
        >
          <FileDown className="size-4" />
        </button>
      )}

      <Link
        href={`/clientes/${clientId}/secoes/${s.type}`}
        className="group/card group relative flex min-h-[184px] flex-col overflow-hidden rounded-xl border border-ink-200 bg-surface p-4 transition hover:border-brand-600/50"
      >
                {/*
                  * O desenho colorido no canto: é o que identifica o bloco de
                  * relance, sem ler o título.
                  *
                  * Sangra para fora do cartão (`-bottom-4 -right-4`) e fica
                  * atrás do texto — é o que permite a cor ser cheia sem
                  * disputar leitura com o título. `pointer-events-none` porque
                  * o alvo do clique é o cartão inteiro, não o ícone.
                  */}
                {/*
                  * `text-icone` é um token do tema: o fundo do tema oposto —
                  * branco no escuro, verde escuro no claro.
                  *
                  * Fica a 70% e não em cheio porque ele passa por baixo da
                  * dica, e em cheio disputaria leitura com ela. No hover vai a
                  * 100%, quando a atenção já está no cartão.
                  */}
                <Icone
                  className="pointer-events-none absolute -bottom-4 -right-4 size-24 text-icone opacity-70 transition group-hover:scale-105 group-hover:opacity-100"
                  strokeWidth={1.5}
                />

                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] tabular-nums text-ink-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={clsx(
                      'size-1.5 rounded-full',
                      preenchida ? 'bg-emerald-400' : 'bg-ink-300',
                    )}
                    title={preenchida ? 'Preenchida' : 'Vazia'}
                  />
                </div>

                <h3 className="relative text-[17px] font-semibold leading-tight tracking-tight text-ink-900">
                  {s.title}
                </h3>
                <p className="relative mt-1.5 flex-1 text-[12px] leading-snug text-ink-500">
                  {s.hint}
                </p>

        <span className="relative mt-3 text-[12px] text-ink-400 transition group-hover:text-brand-700">
          {preenchida ? 'Ver' : 'Preencher'} →
        </span>
      </Link>
    </div>
  )
}
