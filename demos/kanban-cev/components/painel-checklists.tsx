'use client'

import { useState } from 'react'
import Link from '@/demos/kanban-cev/lib/nav'
import { useQuery } from '@/demos/kanban-cev/lib/query'
import { CheckSquare, XSquare, Square, CalendarDays, ListChecks, Timer } from 'lucide-react'
import clsx from 'clsx'
import { api } from '@/demos/kanban-cev/lib/api'
import { duracaoCurta } from '@/demos/kanban-cev/lib/duracao'
import { Avatar, EmptyState, Spinner } from '@/demos/kanban-cev/components/ui'

interface Item {
  itemId: string
  content: string
  doneAt?: string
}

interface Demanda {
  taskId: string
  taskTitle: string
  clientName: string | null
  deadline: string
  /** Prazo vencido, ou demanda encerrada com o item ainda aberto. */
  atrasada: boolean
  /** Só o prazo vencido. É o que autoriza a tela a escrever "venceu tal dia". */
  vencida: boolean
  feitos: Item[]
  pendentes: Item[]
}

interface Resposta {
  /** O dia efetivamente consultado. */
  dia: string
  /** O hoje da AGÊNCIA. A tela não calcula o dela. */
  hoje: string
  /** Fuso da agência, para formatar a hora dos itens. */
  tz: string
  profissionais: Profissional[]
  externas: ExternaDoDia[]
}

/** Uma saída da agência no dia: quem foi, quando, por quanto tempo. */
interface ExternaDoDia {
  id: string
  titulo: string
  tipo: string
  local: string | null
  inicioPrevisto: string
  fimPrevisto: string
  inicio: string | null
  fim: string | null
  /** Até o fim, ou até agora quando ainda está em andamento. Nulo = não começou. */
  minutos: number | null
  pessoas: { id: string; nome: string; avatarUrl: string | null }[]
}

interface Profissional {
  id: string
  nome: string
  avatarUrl: string | null
  funcao: string
  demandas: Demanda[]
  totalFeitos: number
  totalAtrasados: number
  totalEmAndamento: number
}

/**
 * NÃO existe mais um "hoje" calculado aqui.
 *
 * `Intl.DateTimeFormat('en-CA')` sem `timeZone` usa o fuso de QUEM OLHA. Às
 * 22h de São Paulo já é o dia seguinte em Lisboa: o navegador pedia o dia
 * errado, a tela vinha vazia, e a leitura era "a equipe não fez nada".
 *
 * O dia da agência vem do servidor, no campo `hoje`, junto com o fuso.
 */

function somarDias(dia: string, n: number): string {
  // `T12:00` e não meia-noite: data pura vira UTC e, em fuso negativo,
  // recuaria um dia sozinha. Meio-dia sobrevive a qualquer fuso.
  const d = new Date(`${dia}T12:00:00`)
  d.setDate(d.getDate() + n)
  return new Intl.DateTimeFormat('en-CA').format(d)
}

/** "segunda, 17 de agosto" — com "Hoje"/"Ontem" quando for o caso. */
function porExtenso(dia: string, hoje: string): string {
  if (dia === hoje) return 'Hoje'
  if (dia === somarDias(hoje, -1)) return 'Ontem'
  // `T12:00` pelo mesmo motivo do `somarDias`: data pura vira UTC e recua.
  return new Date(`${dia}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/**
 * Hora no fuso da AGÊNCIA, não no de quem olha.
 *
 * Sem o `timeZone`, um item marcado às 18h em São Paulo apareceria como 22h
 * para quem abrisse de Lisboa — e a coordenação leria que a pessoa terminou
 * fora do horário de trabalho.
 */
/** "sex, 29/08" no fuso da agência. Dia da semana porque prazo se pensa assim. */
function prazoCurto(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: tz,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
    .format(new Date(iso))
    .replace('.', '')
}

function hora(iso: string | undefined, tz: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  })
}

/**
 * O checklist do dia, por profissional.
 *
 * O eixo é a PESSOA, não a demanda: quem trabalhou em duas demandas aparece
 * uma vez só, com as duas dentro. Agrupado por demanda, a mesma pessoa
 * apareceria espalhada pela tela e ninguém conseguiria ler a linha dela.
 *
 * Duas listas com regras diferentes, e a diferença é o ponto:
 *
 *   Feito hoje    pertence ao dia em que foi marcado. O que saiu hoje não
 *                 aparece amanhã — é registro do dia, não acúmulo.
 *   Em andamento  não tem dia. Continua aparecendo até alguém marcar.
 */
export function PainelChecklists() {
  /**
   * Começa VAZIO, e não com uma data calculada aqui.
   *
   * Sem dia na consulta, o servidor responde com o hoje da agência — que é o
   * único que sabe qual dia a equipe está vivendo. A tela então adota o que
   * voltou. Chutar a data no navegador era o que fazia quem abrisse de outro
   * fuso pedir o dia errado.
   */
  const [dia, setDia] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'checklists', dia],
    queryFn: () =>
      api.get<Resposta>(
        dia ? `/dashboard/admin/checklists?dia=${dia}` : '/dashboard/admin/checklists',
      ),
  })

  const profissionais = data?.profissionais ?? []
  const externas = data?.externas ?? []
  // Antes da primeira resposta não há data nenhuma para mostrar, e é por isso
  // que os controles ficam desabilitados enquanto carrega.
  const hoje = data?.hoje ?? ''
  const diaAtivo = data?.dia ?? ''
  const tz = data?.tz ?? 'America/Sao_Paulo'
  const totalFeitos = profissionais.reduce((n, p) => n + p.totalFeitos, 0)
  const quemProduziu = profissionais.filter((p) => p.totalFeitos > 0).length

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-ink-200 bg-surface px-3 py-2">
          <CalendarDays className="size-4 text-ink-400" />
          <input
            type="date"
            value={diaAtivo}
            disabled={isLoading && !data}
            onChange={(e) => setDia(e.target.value)}
            className="bg-transparent text-[13px] text-ink-800 outline-none"
            aria-label="Dia do checklist"
          />
        </div>

        {/* Os dois atalhos saem do hoje do SERVIDOR: calcular aqui traria de
            volta o fuso de quem olha, que é o bug que esta tela teve. */}
        {hoje &&
          (
            [
              ['Ontem', somarDias(hoje, -1)],
              ['Hoje', hoje],
            ] as const
          ).map(([label, valor]) => (
          <button
            key={label}
            onClick={() => setDia(valor)}
            className={clsx(
              'rounded-lg px-3 py-2 text-[13px] font-medium transition',
              diaAtivo === valor
                ? 'bg-brand-600 text-pine-950'
                : 'border border-ink-200 text-ink-700 hover:bg-ink-100',
            )}
          >
            {label}
          </button>
        ))}

        {/*
          * A data por extenso, uma vez só e no cabeçalho.
          * Os cards não repetem: número perto da palavra "dia" foi lido como
          * data mais de uma vez, e a correção é tirar a data de lá, não
          * espalhá-la.
          */}
        {!isLoading && (
          <span className="text-[13px] text-ink-500">
            <span className="font-medium text-ink-800">{porExtenso(diaAtivo, hoje)}</span>
            {' · '}
            {totalFeitos === 0
              ? 'ninguém concluiu itens'
              : `${totalFeitos} ${totalFeitos === 1 ? 'item concluído' : 'itens concluídos'} por ${quemProduziu} ${quemProduziu === 1 ? 'pessoa' : 'pessoas'}`}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-ink-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {externas.length > 0 && <BlocoExternas externas={externas} tz={tz} />}
          {profissionais.length === 0 ? (
            <EmptyState
              icon={<ListChecks className="size-6 text-ink-400" />}
              title="Nada para mostrar neste dia"
              description="Aparecem aqui os itens marcados no dia, em verde; o que ainda está no prazo, em caixa vazia com a data de entrega; e o que venceu sem ser feito, em vermelho."
            />
          ) : (
            profissionais.map((p) => <CartaoProfissional key={p.id} p={p} tz={tz} />)
          )}
        </div>
      )}
    </div>
  )
}

const ROTULO_EXTERNA: Record<string, string> = {
  captacao: 'Captação',
  assessoria_imprensa: 'Imprensa',
  evento: 'Evento',
}

function descricaoDoTempo(e: ExternaDoDia, tz: string): string {
  if (e.inicio && e.fim) return `${hora(e.inicio, tz)} → ${hora(e.fim, tz)} · ${duracaoCurta(e.minutos ?? 0)}`
  if (e.inicio) return `desde ${hora(e.inicio, tz)} · em andamento, ${duracaoCurta(e.minutos ?? 0)}`
  return `prevista ${hora(e.inicioPrevisto, tz)}–${hora(e.fimPrevisto, tz)} · não iniciada`
}

/**
 * As externas do dia: quem saiu, quando, por quanto tempo. O tempo fora da
 * agência é trabalho como o checklist, e fica no mesmo painel — com as
 * pessoas que de fato foram, que é o que a confirmação corrige.
 */
function BlocoExternas({ externas, tz }: { externas: ExternaDoDia[]; tz: string }) {
  const total = externas.reduce((n, e) => n + (e.minutos ?? 0), 0)
  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <header className="mb-3 flex flex-wrap items-center gap-2 border-b border-ink-100 pb-3">
        <Timer className="size-4 text-ink-400" />
        <p className="text-[15px] font-semibold text-ink-900">Externas</p>
        <span className="text-[12px] text-ink-500">
          {externas.length} {externas.length === 1 ? 'saída' : 'saídas'}
          {total > 0 && <> · {duracaoCurta(total)} fora da agência</>}
        </span>
      </header>
      <ul className="space-y-2.5">
        {externas.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="rounded-full bg-overlay/6 px-2 py-0.5 text-[11px] font-medium text-ink-600 ring-1 ring-inset ring-overlay/10">
              {ROTULO_EXTERNA[e.tipo] ?? e.tipo}
            </span>
            <span className="min-w-0 flex-1 text-[13.5px] font-medium text-ink-900">
              {e.titulo}
              {e.local && <span className="font-normal text-ink-500"> · {e.local}</span>}
            </span>
            <span className="text-[12.5px] tabular-nums text-ink-600">{descricaoDoTempo(e, tz)}</span>
            <span className="flex flex-wrap items-center gap-1">
              {e.pessoas.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 rounded-full bg-overlay/6 py-0.5 pr-2 pl-0.5 text-[11.5px] text-ink-700"
                >
                  <Avatar name={p.nome} url={p.avatarUrl} size={18} />
                  {p.nome.split(' ')[0]}
                </span>
              ))}
              {e.pessoas.length === 0 && <span className="text-[11.5px] text-ink-400">sem equipe</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartaoProfissional({ p, tz }: { p: Profissional; tz: string }) {
  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={p.nome} url={p.avatarUrl} size={36} />
          <div>
            <p className="text-[15px] font-semibold text-ink-900">{p.nome}</p>
            <p className="text-[12px] text-ink-500">{p.funcao}</p>
          </div>
        </div>

        {/*
          * "0 no dia" e "5 em aberto" foram lidos como DATA — a palavra "dia"
          * ao lado de um número convida a isso. Agora o rótulo nomeia o que se
          * conta ("itens concluídos"), e o número vem depois. Nenhum dos dois
          * selos carrega data: a data está no cabeçalho da tela, uma vez só.
          */}
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'rounded-full px-3 py-1 text-[12px] font-medium ring-1 ring-inset',
              p.totalFeitos > 0
                ? 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/25'
                : 'bg-overlay/5 text-ink-500 ring-overlay/10',
            )}
          >
            {p.totalFeitos === 0
              ? 'Nada concluído'
              : `${p.totalFeitos} ${p.totalFeitos === 1 ? 'item concluído' : 'itens concluídos'}`}
          </span>
          {/**
            * O resumo acompanha a lista, e por isso são DOIS contadores.
            *
            * Um número só, em vermelho, era o que fazia a coordenação ler
            * "cinco falhas" onde havia uma falha e quatro trabalhos em curso.
            * O vermelho aqui em cima passa a significar exatamente o que o ✗
            * significa lá embaixo.
            */}
          {p.totalAtrasados > 0 && (
            <span className="rounded-full bg-red-500/12 px-3 py-1 text-[12px] font-medium text-red-300 ring-1 ring-inset ring-red-400/25">
              {p.totalAtrasados} {p.totalAtrasados === 1 ? 'não feito' : 'não feitos'}
            </span>
          )}
          {p.totalEmAndamento > 0 && (
            <span className="rounded-full bg-overlay/5 px-3 py-1 text-[12px] font-medium text-ink-500 ring-1 ring-inset ring-overlay/10">
              {p.totalEmAndamento} em andamento
            </span>
          )}
        </div>
      </header>

      <div className="space-y-3">
        {p.demandas.map((d) => (
          <div key={d.taskId}>
            <Link
              href={`/demandas/${d.taskId}`}
              className="inline-flex flex-wrap items-baseline gap-x-2 text-[13px] font-medium text-ink-800 hover:text-brand-700"
            >
              {d.taskTitle}
              {d.clientName && (
                <span className="text-[12px] font-normal text-ink-500">{d.clientName}</span>
              )}
            </Link>

            <ul className="mt-1 space-y-1">
              {/* Feitos primeiro: é o que a coordenação abre a tela para ver. */}
              {d.feitos.map((i) => (
                <li key={i.itemId} className="flex items-start gap-2">
                  <CheckSquare className="mt-px size-4 shrink-0 text-emerald-400" />
                  <span className="min-w-0 flex-1 text-[13px] text-ink-600 line-through">
                    {i.content}
                  </span>
                  {i.doneAt && (
                    <span className="shrink-0 text-[11px] tabular-nums text-ink-400">
                      {hora(i.doneAt, tz)}
                    </span>
                  )}
                </li>
              ))}

              {/**
                * O símbolo do item aberto depende do PRAZO, não só de estar
                * aberto.
                *
                * O ✗ vermelho nasceu para o checklist de stories, que é diário:
                * ali "não marcado" ao fim do dia significa mesmo "este cliente
                * não teve story", e caixa vazia se leria como "ainda não
                * cheguei lá" — uma ausência onde era preciso uma resposta.
                *
                * Só que a mesma marca caía sobre um cronograma criado na
                * segunda para entregar na sexta. Na terça ele aparecia todo em
                * vermelho, e quem olhava de fora lia atraso onde havia trabalho
                * em curso. O símbolo afirmava mais do que os dados sabiam.
                *
                * Agora o vermelho fica reservado ao que de fato venceu, e o que
                * está em dia aparece em caixa vazia com a data de entrega ao
                * lado — que é a informação que faltava para a leitura de fora
                * ser a certa.
                */}
              {d.pendentes.map((i) => (
                <li key={i.itemId} className="flex items-start gap-2">
                  {d.atrasada ? (
                    <XSquare className="mt-px size-4 shrink-0 text-red-400" />
                  ) : (
                    <Square className="mt-px size-4 shrink-0 text-ink-400" />
                  )}
                  <span
                    className={clsx(
                      'min-w-0 flex-1 text-[13px]',
                      d.atrasada ? 'font-medium text-red-300' : 'text-ink-600',
                    )}
                  >
                    {i.content}
                  </span>
                  {/**
                    * A data aparece nos DOIS casos, e o verbo muda com o
                    * motivo.
                    *
                    * "venceu" só quando o prazo de fato passou. Na demanda
                    * encerrada com o item aberto o ✗ é veredito e nada venceu —
                    * escrever uma data ali daria a entender um atraso que não
                    * houve. O que houve foi outra coisa, e é o que se diz.
                    */}
                  <span
                    className={clsx(
                      'shrink-0 text-[11px] whitespace-nowrap',
                      d.atrasada ? 'text-red-400/80' : 'text-ink-400',
                    )}
                  >
                    {d.vencida
                      ? `venceu ${prazoCurto(d.deadline, tz)}`
                      : d.atrasada
                        ? 'encerrada em aberto'
                        : `até ${prazoCurto(d.deadline, tz)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
