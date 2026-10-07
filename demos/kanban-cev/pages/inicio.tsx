'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import {
  ChevronLeft,
  ChevronRight,
  Cake,
  CalendarDays,
  AlertTriangle,
  Clock,
  Repeat,
  X,
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { Avatar, Badge, Button, Spinner } from '@/demos/kanban-cev/components/ui'
import { EventModal } from '@/demos/kanban-cev/components/event-modal'
import { TaskTable } from '@/demos/kanban-cev/components/task-table'
import { useCalendar, useEvent, useHome, useMe, useStatuses, type CalendarItem } from '@/demos/kanban-cev/lib/hooks'
import type { TaskListItem } from '@/demos/kanban-cev/shared'
import { formatDeadline, PRIORITY_STYLE } from '@/demos/kanban-cev/lib/format'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Cada fonte do calendário tem a sua cor, e a legenda é o que as decifra. */
const KIND_STYLE: Record<CalendarItem['kind'], string> = {
  demanda: 'bg-gold-300',
  evento: 'bg-emerald-300',
  feriado: 'bg-gold-500',
  aniversario: 'bg-rose-300',
}

/**
 * Quantos títulos cabem num dia da TELA CHEIA.
 *
 * Só vale expandido: encaixado na coluna o dia continua mostrando bolinhas,
 * porque 60px de altura não comportam texto nenhum.
 *
 * Quatro é a conta de um mês de seis semanas numa tela comum — sobra a altura
 * do número do dia e cabem quatro linhas de 16px. Num monitor grande caberia
 * mais, e o preço de anunciar "+2 no dia" ali é pequeno perto do de esconder
 * dois compromissos sem avisar.
 */
const MAX_NO_DIA = 4

/**
 * A hora do item, ou `null` quando não faz sentido mostrar uma.
 *
 * Aniversário e feriado são datas de PAREDE: não têm hora, e o instante que os
 * representa é meia-noite por convenção. Estampar "00:00" ao lado deles seria
 * inventar precisão que o dado não tem — e ainda por cima uma precisão errada,
 * porque ninguém comemora à meia-noite. Por isso o corte é o `allDay`, que
 * vem do backend, e não a leitura do horário.
 */
function horaDoItem(i: CalendarItem): string | null {
  if (i.allDay) return null
  return new Date(i.startAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Chave YYYY-MM-DD no fuso local, que é como o usuário enxerga o dia. */
function chaveDoDia(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function InicioPage() {
  const router = useRouter()
  const { data: me } = useMe()
  const home = useHome()
  const [mesBase, setMesBase] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [escopo, setEscopo] = useState<'me' | 'agency'>('me')
  /**
   * Calendário em tela cheia.
   *
   * Encaixado na coluna, cada dia tem uns 60px de altura e só cabe um punhado
   * de bolinhas — dá para ver QUE há algo, nunca O QUE é. Expandido, a mesma
   * grade recebe a tela inteira e cada dia passa a listar os títulos, que é o
   * que se quer quando a pergunta é "como está o mês".
   */
  const [expandido, setExpandido] = useState(false)
  /** `{ novo: true }` abre em branco; com `evento` abre para editar. */
  const [eventoAberto, setEventoAberto] = useState<{ novo?: boolean; evento?: any } | null>(null)
  /**
   * Compromisso escolhido no detalhe do dia, para editar ou excluir.
   *
   * Guarda o ID e não o item do calendário: aquele traz só o que a grade
   * desenha, e o PATCH substitui os participantes pelo que o formulário mandar
   * — abrir a edição sem local, descrição e equipe apagaria os três ao salvar.
   */
  const [eventoId, setEventoId] = useState<string | null>(null)
  const eventoParaEditar = useEvent(eventoId)
  const podeAgendar = !!me && (me.isAdmin || me.permissions.includes('event:manage' as never))

  /**
   * Esc sai da tela cheia.
   *
   * Tela cheia cobre a navegação inteira, então precisa da saída que todo
   * mundo tenta primeiro — sem ela, quem não reparar no botão fica preso e a
   * única saída aparente é recarregar a página.
   *
   * O modal de dia também fecha no Esc e está por cima; como ele para a
   * propagação do próprio Esc, um pressionar não fecha os dois de uma vez.
   */
  useEffect(() => {
    if (!expandido) return
    const sair = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandido(false)
    }
    window.addEventListener('keydown', sair)
    return () => window.removeEventListener('keydown', sair)
  }, [expandido])

  // A grade começa no domingo anterior e termina no sábado seguinte, então a
  // busca cobre esse intervalo — não só o primeiro e o último dia do mês.
  const { inicio, fim } = useMemo(() => {
    const primeiro = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1)
    const ultimo = new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 0, 23, 59, 59)
    const inicioGrade = new Date(primeiro)
    inicioGrade.setDate(primeiro.getDate() - primeiro.getDay())
    const fimGrade = new Date(ultimo)
    fimGrade.setDate(ultimo.getDate() + (6 - ultimo.getDay()))
    fimGrade.setHours(23, 59, 59, 999)
    return { inicio: inicioGrade, fim: fimGrade }
  }, [mesBase])

  const calendario = useCalendar(inicio.toISOString(), fim.toISOString(), escopo)

  const porDia = useMemo(() => {
    const mapa = new Map<string, CalendarItem[]>()
    for (const item of calendario.data?.items ?? []) {
      const chave = chaveDoDia(new Date(item.startAt))
      const lista = mapa.get(chave) ?? []
      lista.push(item)
      mapa.set(chave, lista)
    }
    return mapa
  }, [calendario.data])

  const dias = useMemo(() => {
    const saida: Date[] = []
    const cursor = new Date(inicio)
    while (cursor <= fim) {
      saida.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return saida
  }, [inicio, fim])

  const hoje = chaveDoDia(new Date())
  // Nasce fechado: o detalhe do dia agora é um modal, e modal que já abre
  // sozinho ao carregar a tela é interrupção, não informação.
  const [diaAberto, setDiaAberto] = useState<string | null>(null)

  const hojeTasks = home.data?.todayTasks ?? []
  const atrasadas = home.data?.overdueTasks ?? []

  return (
    <Shell>
      <div className="mx-auto max-w-[1500px] px-5 py-5 lg:px-8">
        {/**
         * `-mt-12` cancela a reserva que o Shell dá ao topo, subindo a saudação
         * para a mesma linha da data e do sino — é o desenho da referência.
         * Por isso o `pr-*`: aqui o título divide a linha com eles.
         *
         * O lado ESQUERDO não precisa de reserva porque a navegação do celular
         * saiu do topo e foi para o rodapé. Enquanto ela estava lá, "Olá,
         * Emanuel" começava na margem e passava por baixo dos ícones — o "Ol"
         * simplesmente não aparecia.
         */}
        <header className="-mt-12 mb-6 pr-28 sm:pr-72">
          <h1 className="text-[26px] leading-tight font-bold text-ink-900">
            {me ? `Olá, ${me.name.split(' ')[0]}` : 'Início'}{' '}
            <span className="align-middle">👋</span>
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            O que vence hoje, o que está atrasado e o que vem pela frente.
          </p>
        </header>

        {/**
          * `min-w-0` nos dois filhos, e é o que fazia a Home estourar no
          * telefone.
          *
          * Filho de grid nasce com `min-width: auto`, que resolve para o
          * tamanho mínimo do CONTEÚDO. A tabela da fila tinha largura mínima
          * própria, então a coluna crescia até caber a tabela inteira em vez
          * de deixá-la rolar — e a página inteira ia junto. O calendário, que
          * reparte a largura da coluna em sete frações, esticava atrás: no
          * iPhone apareciam três dias de sete.
          *
          * O `overflow-x-auto` da tabela não resolvia sozinho justamente por
          * isso: ele só contém depois que o pai pode encolher.
          */}
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="min-w-0 space-y-4 xl:col-span-2">
            <ListaDoDia
              hoje={hojeTasks}
              atrasadas={atrasadas}
              carregando={home.isLoading}
              onAbrir={(id) => router.push(`/demandas/${id}`)}
            />

            {/**
              * A MESMA seção, encaixada ou em tela cheia — não duas.
              *
              * Duplicar a grade num modal separado significaria manter dois
              * calendários em sincronia: mês, escopo, legenda e o clique que
              * abre o dia. Na primeira mudança um dos dois ficaria para trás.
              *
              * `z-40` de propósito: os modais de dia e de compromisso são
              * `z-50`, então clicar num dia daqui continua abrindo por cima em
              * vez de sumir atrás do calendário.
              */}
            <section
              className={clsx(
                'bg-surface/70 ring-1 ring-inset ring-overlay/8',
                expandido
                  ? 'fixed inset-0 z-40 flex flex-col overflow-y-auto p-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md'
                  : 'rounded-2xl p-5',
              )}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BotaoMes
                    onClick={() =>
                      setMesBase(new Date(mesBase.getFullYear(), mesBase.getMonth() - 1, 1))
                    }
                    rotulo="Mês anterior"
                  >
                    <ChevronLeft className="size-4" />
                  </BotaoMes>
                  <h2
                    className={clsx(
                      'min-w-44 text-center font-semibold text-ink-900',
                      expandido ? 'text-[21px]' : 'text-[15px]',
                    )}
                  >
                    {MESES[mesBase.getMonth()]} de {mesBase.getFullYear()}
                  </h2>
                  <BotaoMes
                    onClick={() =>
                      setMesBase(new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 1))
                    }
                    rotulo="Próximo mês"
                  >
                    <ChevronRight className="size-4" />
                  </BotaoMes>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-pine-900/60 p-1 ring-1 ring-inset ring-overlay/8">
                  {(
                    [
                      ['me', 'Meu'],
                      ['agency', 'Agência'],
                    ] as const
                  ).map(([valor, rotulo]) => (
                    <button
                      key={valor}
                      onClick={() => setEscopo(valor)}
                      className={clsx(
                        'rounded-full px-4 py-1.5 text-[12.5px] font-medium transition',
                        escopo === valor
                          ? 'bg-gold-300 text-pine-950'
                          : 'text-ink-500 hover:text-ink-900',
                      )}
                    >
                      {rotulo}
                    </button>
                  ))}
                </div>

                {/*
                  * O botão que faltava: a API de eventos existe desde sempre e
                  * os hooks também, mas nunca houve por onde criar um pela
                  * interface — nem captação, nem reunião, nem feriado.
                  */}
                {podeAgendar && (
                  <Button onClick={() => setEventoAberto({ novo: true })}>
                    <Plus className="size-4" />
                    Novo compromisso
                  </Button>
                )}

                <button
                  onClick={() => setExpandido((v) => !v)}
                  title={expandido ? 'Sair da tela cheia (Esc)' : 'Ver o mês em tela cheia'}
                  aria-label={expandido ? 'Sair da tela cheia' : 'Ver o mês em tela cheia'}
                  className="rounded-lg p-2 text-ink-400 ring-1 ring-inset ring-overlay/10 transition hover:bg-overlay/10 hover:text-ink-900"
                >
                  {expandido ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                </button>
              </div>

              {/**
                * Cabeçalho em grade PRÓPRIA, separado dos dias.
                *
                * Juntos, o `auto-rows-fr` da tela cheia valeria também para a
                * linha dos nomes: o cabeçalho ganharia a altura de uma semana
                * inteira e comeria um sétimo do calendário.
                */}
              <div className="grid grid-cols-7 gap-1.5">
                {DIAS.map((d) => (
                  <div
                    key={d}
                    className={clsx(
                      'pb-2 text-center font-medium tracking-wide text-ink-400 uppercase',
                      expandido ? 'text-[15px]' : 'text-[11px]',
                    )}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/**
                * Em tela cheia a grade estica para preencher o que sobrou.
                *
                * `auto-rows-fr` reparte a altura igualmente entre as semanas, e
                * `min-h-0` é o que permite encolher dentro do flex — sem ele o
                * conteúdo define a altura, a grade estoura a viewport e volta a
                * rolagem que a tela cheia existe para evitar.
                *
                * Linhas fixas não serviriam: o número de semanas varia entre 5
                * e 6 conforme o mês.
                */}
              <div
                className={clsx(
                  'grid grid-cols-7 gap-1.5',
                  expandido && 'min-h-0 flex-1 auto-rows-fr',
                )}
              >
                {dias.map((dia) => {
                  const chave = chaveDoDia(dia)
                  const itens = porDia.get(chave) ?? []
                  const doMes = dia.getMonth() === mesBase.getMonth()
                  const ehHoje = chave === hoje

                  return (
                    <button
                      key={chave}
                      onClick={() => setDiaAberto(chave)}
                      className={clsx(
                        'rounded-xl p-2 text-left ring-1 ring-inset transition',
                        expandido ? 'flex min-h-0 flex-col overflow-hidden' : 'min-h-16',
                        doMes
                          ? 'bg-overlay/5 ring-overlay/8 hover:ring-overlay/20'
                          : 'bg-transparent ring-overlay/5',
                        ehHoje && 'bg-gold-300/10 ring-gold-300/50',
                        diaAberto === chave && !ehHoje && 'bg-overlay/10 ring-overlay/25',
                      )}
                    >
                      <span
                        className={clsx(
                          'tabular-nums',
                          // Em tela cheia o número do dia é âncora de leitura,
                          // não etiqueta: sobe de tamanho e de peso.
                          expandido ? 'text-[22px] font-semibold' : 'text-[12px] font-medium',
                          ehHoje ? 'text-gold-300' : doMes ? 'text-ink-800' : 'text-ink-300/60',
                        )}
                      >
                        {dia.getDate()}
                      </span>

                      {/**
                        * Encaixado: bolinhas. Em tela cheia: os títulos.
                        *
                        * É a razão de o botão existir. A bolinha diz que HÁ
                        * algo naquele dia e esconde O QUE é — para saber, é
                        * preciso clicar dia a dia. Com a tela toda disponível,
                        * o mês inteiro pode ser lido de uma vez.
                        */}
                      {expandido ? (
                        <div className="mt-1.5 min-h-0 flex-1 space-y-1 overflow-hidden">
                          {itens.slice(0, MAX_NO_DIA).map((i) => {
                            const hora = horaDoItem(i)
                            return (
                              <div key={i.id} className="flex items-center gap-2" title={i.title}>
                                <span
                                  className={clsx(
                                    'size-2 shrink-0 rounded-full',
                                    KIND_STYLE[i.kind],
                                  )}
                                />

                                {/* A hora vem ANTES do título e não encolhe.
                                    É o que se procura primeiro num dia com
                                    vários compromissos — "o que tenho às 14h" —,
                                    e um horário cortado no meio não serve para
                                    nada. Quem cede espaço é o título. */}
                                {hora && (
                                  <span
                                    className={clsx(
                                      'shrink-0 text-[15px] font-semibold tabular-nums',
                                      doMes ? 'text-ink-800' : 'text-ink-400/70',
                                    )}
                                  >
                                    {hora}
                                  </span>
                                )}

                                {/* O texto é o conteúdo da tela cheia, não um
                                    rótulo de apoio — por isso o corpo de leitura
                                    e não o tamanho de legenda. */}
                                <span
                                  className={clsx(
                                    'truncate text-[16px] leading-snug',
                                    doMes ? 'text-ink-700' : 'text-ink-400/70',
                                  )}
                                >
                                  {i.title}
                                </span>
                              </div>
                            )
                          })}

                          {/* O que não coube é ANUNCIADO, não engolido: com o
                              texto maior o corte chega mais cedo, e um dia
                              cheio que parece ter três compromissos é pior do
                              que um que assume ter mais. Clicar abre todos. */}
                          {itens.length > MAX_NO_DIA && (
                            <span className="block pl-4 text-[13px] font-medium text-ink-400">
                              +{itens.length - MAX_NO_DIA} no dia
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {itens.slice(0, 5).map((i) => (
                            <span
                              key={i.id}
                              title={i.title}
                              className={clsx('size-1.5 rounded-full', KIND_STYLE[i.kind])}
                            />
                          ))}
                          {itens.length > 5 && (
                            <span className="text-[10px] leading-none text-ink-400">
                              +{itens.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div
                className={clsx(
                  'mt-4 flex flex-wrap gap-4 text-ink-500',
                  expandido ? 'shrink-0 text-[14px]' : 'text-[11.5px]',
                )}
              >
                {(
                  [
                    ['demanda', 'demandas'],
                    ['evento', 'eventos'],
                    ['feriado', 'feriados'],
                    ['aniversario', 'aniversários'],
                  ] as const
                ).map(([kind, rotulo]) => (
                  <span key={kind} className="flex items-center gap-1.5">
                    <span className={clsx('size-2 rounded-full', KIND_STYLE[kind])} />
                    {rotulo}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="min-w-0 space-y-4">
            <Painel icone={<CalendarDays className="size-4" />} titulo="Próximos eventos">
              {home.data?.upcomingEvents.length === 0 && (
                <Vazio>Nada agendado nos próximos 7 dias.</Vazio>
              )}
              <ul className="space-y-2">
                {home.data?.upcomingEvents.map((e: any) => (
                  <li
                    key={e.id}
                    className="rounded-xl border-l-2 border-gold-300 bg-overlay/5 py-2.5 pr-3 pl-3"
                  >
                    <p className="text-[13.5px] font-medium text-ink-900">{e.title}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-500">
                      {formatDeadline(e.startAt)}
                      {e.clientName && ` · ${e.clientName}`}
                    </p>
                  </li>
                ))}
              </ul>
            </Painel>

            <Painel icone={<Cake className="size-4" />} titulo="Aniversários do mês">
              {!home.data?.birthdays.people.length && !home.data?.birthdays.clients.length && (
                <Vazio>Nenhum aniversário este mês.</Vazio>
              )}

              <ul className="space-y-3">
                {home.data?.birthdays.people.map((p: any) => (
                  <li key={p.id} className="flex items-center gap-2.5">
                    <Avatar name={p.name} url={p.avatarUrl} size={28} />
                    <span className="flex-1 truncate text-[13.5px] text-ink-800">{p.name}</span>
                    <span className="shrink-0 text-[12px] tabular-nums text-gold-300">
                      dia {p.day}
                    </span>
                  </li>
                ))}
                {home.data?.birthdays.clients.map((cl: any) => (
                  <li key={cl.id} className="flex items-center gap-2.5">
                    <Avatar name={cl.name} size={28} />
                    <span className="flex min-w-0 flex-1 items-center gap-1.5">
                      <span className="truncate text-[13.5px] text-ink-800">{cl.name}</span>
                      <Badge className="shrink-0 bg-overlay/8 text-ink-500 ring-overlay/12">
                        cliente
                      </Badge>
                    </span>
                    <span className="shrink-0 text-[12px] tabular-nums text-gold-300">
                      dia {cl.day}
                    </span>
                  </li>
                ))}
              </ul>
            </Painel>
          </div>
        </div>
      </div>

      <ModalDia
        chave={diaAberto}
        itens={diaAberto ? (porDia.get(diaAberto) ?? []) : []}
        carregando={calendario.isLoading}
        onFechar={() => setDiaAberto(null)}
        onAbrirDemanda={(id) => router.push(`/demandas/${id}`)}
        onAbrirEvento={(id) => setEventoId(id)}
      />

      <EventModal
        open={!!eventoAberto}
        onClose={() => setEventoAberto(null)}
        editando={eventoAberto?.evento ?? null}
        /* Clicou num dia e mandou criar: o formulário já nasce naquela data. */
        diaInicial={diaAberto ?? undefined}
      />

      {/**
        * O mesmo formulário, aberto num compromisso existente.
        *
        * Só monta depois que o registro completo chegou. Abrir antes exibiria
        * campos vazios que o PATCH gravaria por cima — local, descrição e
        * participantes sumiriam de um compromisso que a pessoa só queria abrir
        * para conferir.
        */}
      <EventModal
        open={!!eventoId && !!eventoParaEditar.data}
        onClose={() => setEventoId(null)}
        editando={eventoParaEditar.data ?? null}
      />
    </Shell>
  )
}

/* -------------------------------------------------------------- lista do dia */

/**
 * Atrasadas e vencendo hoje na MESMA lista, atrasadas primeiro.
 *
 * Eram dois painéis lado a lado, e isso obrigava a ler duas vezes para saber
 * o que fazer primeiro: a fila real de trabalho é uma só, ordenada por
 * urgência. Em tabela porque as colunas — status, tipo, cliente, responsável,
 * prioridade — só se comparam entre demandas quando ficam alinhadas.
 */
function ListaDoDia({
  hoje,
  atrasadas,
  carregando,
  onAbrir,
}: {
  hoje: TaskListItem[]
  atrasadas: TaskListItem[]
  carregando?: boolean
  onAbrir: (id: string) => void
}) {
  const { data: statuses } = useStatuses()

  const statusPorSlug = useMemo(
    () => new Map((statuses ?? []).map((s: any) => [s.slug, s])),
    [statuses],
  )

  const itens = useMemo(() => {
    /**
     * Dedupe antes de tudo.
     *
     * O backend devolve as duas listas por critérios que se sobrepõem: uma
     * demanda com prazo HOJE às 09:00, lida às 14:00, é "de hoje" e também
     * está atrasada — e voltava nas duas. Concatenar sem cruzar os ids a
     * mostraria duas vezes na mesma tela.
     */
    const porId = new Map<string, TaskListItem>()
    for (const t of atrasadas) porId.set(t.id, t)
    for (const t of hoje) if (!porId.has(t.id)) porId.set(t.id, t)

    // Atrasadas no topo; dentro de cada grupo, o prazo mais apertado primeiro.
    return [...porId.values()].sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
      return a.deadline.localeCompare(b.deadline)
    })
  }, [hoje, atrasadas])

  const nAtrasadas = itens.filter((t) => t.isOverdue).length

  return (
    <section className="rounded-2xl bg-surface/70 ring-1 ring-inset ring-overlay/8">
      <header className="flex flex-wrap items-center gap-2.5 px-5 py-4">
        <span
          className={clsx(
            'inline-flex size-8 items-center justify-center rounded-lg ring-1 ring-inset',
            nAtrasadas
              ? 'bg-red-400/15 text-red-300 ring-red-300/25'
              : 'bg-overlay/8 text-gold-300 ring-overlay/10',
          )}
        >
          {nAtrasadas ? <AlertTriangle className="size-4" /> : <Clock className="size-4" />}
        </span>

        <h2 className="flex-1 text-[15px] font-semibold text-ink-900">Sua fila</h2>

        {nAtrasadas > 0 && (
          <span className="rounded-full bg-red-400/20 px-2.5 py-0.5 text-[12px] font-medium tabular-nums text-red-200">
            {nAtrasadas} {nAtrasadas === 1 ? 'atrasada' : 'atrasadas'}
          </span>
        )}
        <span className="rounded-full bg-overlay/8 px-2.5 py-0.5 text-[12px] font-medium tabular-nums text-ink-500">
          {itens.length} no total
        </span>
      </header>

      <div className="px-5 pb-5">
        <TaskTable
          tasks={itens}
          carregando={carregando}
          onAbrir={onAbrir}
          vazio={<Vazio>Nada vence hoje e nada está atrasado. Fila limpa. ✨</Vazio>}
        />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- peças */

/** O cartão padrão da Home: ícone, título, contagem opcional e corpo. */
function Painel({
  icone,
  titulo,
  contagem,
  tom = 'neutro',
  carregando,
  children,
}: {
  icone: React.ReactNode
  titulo: string
  contagem?: number
  tom?: 'neutro' | 'alerta'
  carregando?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-surface/70 p-5 ring-1 ring-inset ring-overlay/8">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={clsx(
            'inline-flex size-8 items-center justify-center rounded-lg ring-1 ring-inset',
            tom === 'alerta'
              ? 'bg-red-400/15 text-red-300 ring-red-300/25'
              : 'bg-overlay/8 text-gold-300 ring-overlay/10',
          )}
        >
          {icone}
        </span>
        <h2 className="flex-1 text-[15px] font-semibold text-ink-900">{titulo}</h2>
        {contagem !== undefined && (
          <span
            className={clsx(
              'inline-flex min-w-7 justify-center rounded-full px-2 py-0.5 text-[12px] font-medium tabular-nums',
              tom === 'alerta' ? 'bg-red-400/20 text-red-200' : 'bg-overlay/8 text-ink-500',
            )}
          >
            {contagem}
          </span>
        )}
      </div>

      {carregando ? <Spinner className="text-ink-400" /> : children}
    </section>
  )
}

/** Caixa tracejada: faz o silêncio parecer intencional, não tela quebrada. */
function Vazio({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-overlay/12 px-4 py-8 text-center text-[13px] leading-relaxed text-ink-500">
      {children}
    </div>
  )
}

function BotaoMes({
  onClick,
  rotulo,
  children,
}: {
  onClick: () => void
  rotulo: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={rotulo}
      className="rounded-full bg-overlay/6 p-2 text-ink-500 ring-1 ring-inset ring-overlay/10 transition hover:bg-overlay/12 hover:text-ink-900"
    >
      {children}
    </button>
  )
}

const ROTULO_KIND: Record<CalendarItem['kind'], string> = {
  demanda: 'Demanda',
  evento: 'Evento',
  feriado: 'Feriado',
  aniversario: 'Aniversário',
}

/**
 * Detalhe do dia em modal.
 *
 * Antes abria embaixo do calendário, o que empurrava a página para baixo a
 * cada clique — e num mês cheio o conteúdo saía da vista, obrigando a rolar
 * para ler o que se acabou de clicar.
 */
function ModalDia({
  chave,
  itens,
  carregando,
  onFechar,
  onAbrirDemanda,
  onAbrirEvento,
}: {
  chave: string | null
  itens: CalendarItem[]
  carregando?: boolean
  onFechar: () => void
  onAbrirDemanda: (id: string) => void
  onAbrirEvento: (id: string) => void
}) {
  // Fechar no Esc é o que se espera de qualquer modal; sem isso só resta
  // mirar no X.
  useEffect(() => {
    if (!chave) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [chave, onFechar])

  if (!chave) return null

  /**
   * `new Date('2026-08-06')` seria lido como meia-noite UTC, que no Brasil é
   * o dia 5 às 21h — o título mostraria o dia anterior. Montando por
   * componentes, a data nasce no fuso local.
   */
  const [ano, mes, dia] = chave.split('-').map(Number)
  const data = new Date(ano!, mes! - 1, dia!)

  const porExtenso = data.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const diaDaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' })

  return (
    <div
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]"
    >
      <div
        // Clique dentro não pode fechar junto com o clique no fundo.
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="animate-in mt-16 w-full max-w-md rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10"
      >
        <header className="flex items-start justify-between gap-3 border-b border-overlay/8 px-5 py-4">
          <div>
            <h2 className="text-[17px] leading-tight font-semibold text-ink-900">{porExtenso}</h2>
            <p className="mt-0.5 text-[12.5px] text-gold-300 capitalize">{diaDaSemana}</p>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {carregando ? (
            <Spinner className="text-ink-400" />
          ) : itens.length === 0 ? (
            <p className="rounded-xl border border-dashed border-overlay/12 px-4 py-8 text-center text-[13px] text-ink-500">
              Nada neste dia.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {itens.map((i) => (
                <li key={i.id}>
                  {/**
                    * Demanda leva ao detalhe; compromisso abre a edição.
                    *
                    * Antes só a demanda era clicável, e o compromisso ficava
                    * `disabled`: não havia nenhum caminho na interface até um
                    * evento já criado. O botão Excluir existia no formulário,
                    * mas o formulário só abria em branco — dava para criar uma
                    * captação e nunca mais mexer nela.
                    *
                    * Aniversário e feriado seguem sem clique: o primeiro é
                    * calculado do cadastro da pessoa e o segundo vem da
                    * BrasilAPI. Nenhum dos dois se edita por aqui.
                    */}
                  <button
                    onClick={() => {
                      if (i.taskId) {
                        onFechar()
                        onAbrirDemanda(i.taskId)
                        return
                      }
                      if (i.kind === 'evento') {
                        onFechar()
                        onAbrirEvento(i.id)
                      }
                    }}
                    disabled={!i.taskId && i.kind !== 'evento'}
                    className={clsx(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition',
                      i.taskId || i.kind === 'evento' ? 'hover:bg-overlay/8' : 'cursor-default',
                    )}
                  >
                    <span className={clsx('mt-0.5 size-2 shrink-0 rounded-full', KIND_STYLE[i.kind])} />
                    <span className="min-w-0 flex-1">
                      <span
                        className={clsx(
                          'block truncate text-[13.5px]',
                          i.isOverdue ? 'font-medium text-red-300' : 'text-ink-800',
                        )}
                      >
                        {i.title}
                      </span>
                      <span className="block text-[11px] text-ink-500">
                        {ROTULO_KIND[i.kind]}
                        {i.clientName && ` · ${i.clientName}`}
                        {i.isOverdue && ' · atrasada'}
                      </span>
                    </span>
                    {!i.allDay && (
                      <span className="shrink-0 rounded-md bg-overlay/8 px-2 py-0.5 text-[11.5px] tabular-nums text-gold-300">
                        {new Date(i.startAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
