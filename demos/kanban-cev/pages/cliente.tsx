'use client'

import { useEffect, useMemo, useState } from 'react'
import Link, { useRouter } from '@/demos/kanban-cev/lib/nav'
import { ArrowLeft, Pencil, ChevronDown, Check, KeyRound, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { Avatar, Badge, Button, EmptyState, Spinner } from '@/demos/kanban-cev/components/ui'
import { ClientModal } from '@/demos/kanban-cev/components/client-modal'
import { AcessosCliente } from '@/demos/kanban-cev/components/acessos-cliente'
import { TaskCardBody } from '@/demos/kanban-cev/components/task-card'
import { AreaOnboarding } from '@/demos/kanban-cev/components/area-onboarding'
import { FotoPerfil } from '@/demos/kanban-cev/components/foto-perfil'
import { briefingIniciado, briefingFinalizado, progressoBriefing } from '@/demos/kanban-cev/components/briefing'
import {
  useClient,
  useClientTasks,
  useDeleteClient,
  useMe,
  useSaveClientSection,
  useTeam,
  useSocialMedias,
  useSetClientSocialMedias,
} from '@/demos/kanban-cev/lib/hooks'
import { formatDeadline } from '@/demos/kanban-cev/lib/format'
import { SECOES, secaoPreenchida } from '@/demos/kanban-cev/lib/secoes-cliente'

const STATUS_STYLE: Record<string, string> = {
  ativo: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/25',
  pausado: 'bg-amber-400/15 text-amber-200 ring-amber-300/25',
  encerrado: 'bg-ink-100 text-ink-600 ring-ink-300',
}

export default function ClientePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { data: me } = useMe()
  const cliente = useClient(id)
  const vejoTudo = !!me && (me.isAdmin || me.permissions.includes('task:view_all' as never))
  const demandas = useClientTasks(id, vejoTudo ? 'team' : 'me')
  const [editando, setEditando] = useState(false)
  const [acessosAberto, setAcessosAberto] = useState(false)

  const podeEditar = !!me && (me.isAdmin || me.permissions.includes('client:manage' as never))

  if (cliente.isLoading) {
    return (
      <Shell>
        <div className="flex justify-center py-24">
          <Spinner className="text-ink-400" />
        </div>
      </Shell>
    )
  }

  if (cliente.error || !cliente.data) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <EmptyState
            title="Cliente não encontrado"
            action={<Button onClick={() => router.push('/clientes')}>Voltar</Button>}
          />
        </div>
      </Shell>
    )
  }

  const c = cliente.data
  const porTipo = new Map<string, any>((c.sections ?? []).map((s: any) => [s.sectionType, s]))
  const blocosPreenchidos = SECOES.filter((s) =>
    secaoPreenchida(s.formato, porTipo.get(s.type)?.content),
  ).length

  return (
    <Shell>
      {/*
        * Bem mais larga que as outras telas, por dois motivos: são doze cards
        * em quatro colunas, e no briefing a tela se divide entre as perguntas
        * e o PDF da ata — que precisa de largura para ser lido sem zoom.
        *
        * O teto em 1600px continua existindo: sem nenhum, em monitor
        * ultrawide as linhas de texto ficariam longas demais para o olho
        * acompanhar da direita de volta para a esquerda.
        */}
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        <nav className="mb-4 flex items-center gap-1.5 text-[13px]">
          <button
            onClick={() => router.push('/clientes')}
            className="inline-flex items-center gap-1.5 text-ink-500 transition hover:text-ink-800"
          >
            <ArrowLeft className="size-4" />
            Clientes
          </button>
          <span className="text-ink-300">/</span>
          <span className="truncate font-medium text-ink-800">{c.name}</span>
        </nav>

        {/* O cabeçalho é um cartão, não texto solto: separa a identidade do
            cliente do trabalho que vem abaixo. */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-surface p-5">
          <div className="flex items-center gap-4">
            <FotoPerfil
              escopo="clients"
              id={id}
              nome={c.name}
              urlAtual={c.logoUrl}
              podeEditar={podeEditar}
              size={64}
              onTrocou={() => cliente.refetch()}
            />
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{c.name}</h1>
                <Badge className={STATUS_STYLE[c.status] ?? STATUS_STYLE.ativo}>
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current align-middle" />
                  {c.status}
                </Badge>
              </div>

              {/* Só o que a tabela realmente guarda. O responsável saiu desta
                  lista: virou o seletor de social media, ao lado do contato. */}
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-500">
                <span>Cliente desde {mesAno(c.createdAt)}</span>
                {c.segment && (
                  <>
                    <span className="text-ink-300">•</span>
                    <span>{c.segment}</span>
                  </>
                )}
                {c.anniversary && (
                  <>
                    <span className="text-ink-300">•</span>
                    <span>
                      Aniversário {c.anniversary.slice(8, 10)}/{c.anniversary.slice(5, 7)}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/*
            * Contato e progresso ficam AQUI, não numa coluna lateral.
            *
            * São as duas perguntas que se faz ao abrir um cliente — com quem
            * eu falo, e quanto do onboarding está de pé. Numa barra lateral
            * disputariam espaço com os blocos; no cabeçalho respondem antes
            * de a pessoa precisar procurar.
            */}
          <div className="flex flex-wrap items-center gap-5">
            {(c.contactName || c.contactEmail || c.contactPhone) && (
              <div className="min-w-0 max-w-[220px]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                  Contato
                </p>
                {c.contactName && (
                  <p className="truncate text-[15px] font-medium text-ink-900">{c.contactName}</p>
                )}
                {/*
                  * E-mail e telefone continuam aqui, miúdos.
                  * O layout novo tirou o cartão de contato da lateral, e sem
                  * estas duas linhas o dado ficaria só dentro do modal de
                  * edição — visível apenas para quem pode editar.
                  */}
                {c.contactEmail && (
                  <a
                    href={`mailto:${c.contactEmail}`}
                    className="block truncate text-[12px] text-ink-500 hover:text-brand-700"
                  >
                    {c.contactEmail}
                  </a>
                )}
                {c.contactPhone && (
                  <a
                    href={`https://wa.me/${
                      c.contactPhone.replace(/\D/g, '').length <= 11
                        ? `55${c.contactPhone.replace(/\D/g, '')}`
                        : c.contactPhone.replace(/\D/g, '')
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-[12px] text-ink-500 hover:text-brand-700"
                  >
                    {c.contactPhone}
                  </a>
                )}
              </div>
            )}

            <div className="hidden h-9 w-px bg-ink-200 sm:block" />

            {/**
              * Quem cuida deste cliente.
              *
              * Fica no cabeçalho, junto de contato e onboarding, porque é da
              * mesma natureza: responde "quem é o dono disso" antes de alguém
              * precisar procurar. E não é enfeite de cadastro — é daqui que sai
              * o checklist do cronograma semanal de cada social media.
              */}
            <SocialMedias
              clientId={c.id}
              atuais={c.socialMediaIds ?? []}
              podeEditar={podeEditar}
            />

            <div className="hidden h-9 w-px bg-ink-200 sm:block" />

            {/**
              * Acessos das contas do cliente.
              *
              * Fica na barra e não no onboarding porque a pergunta é de outra
              * natureza: o onboarding é o que se preenche uma vez para entender
              * o cliente; isto é o que se consulta no meio do trabalho, quando
              * alguém vai publicar e precisa entrar na conta agora.
              */}
            <button
              onClick={() => setAcessosAberto(true)}
              className="flex items-center gap-2 rounded-xl bg-overlay/5 px-3 py-2 ring-1 ring-inset ring-overlay/10 transition hover:bg-overlay/10"
            >
              <KeyRound className="size-4 text-ink-500" />
              <span className="text-[13px] font-medium text-ink-800">Acessos</span>
            </button>

            <div className="hidden h-9 w-px bg-ink-200 sm:block" />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Onboarding
              </p>
              <div className="mt-1.5 flex items-center gap-2.5">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-overlay/10">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all"
                    /* Um fiapo mesmo em zero: barra totalmente vazia parece
                       componente quebrado, não progresso inicial. */
                    style={{ width: `${Math.max(3, (blocosPreenchidos / SECOES.length) * 100)}%` }}
                  />
                </div>
                <span className="text-[13px] tabular-nums text-ink-500">
                  {blocosPreenchidos}/{SECOES.length}
                </span>
              </div>
            </div>

            {podeEditar && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditando(true)}>
                  <Pencil className="size-4" />
                  Editar
                </Button>
                <ExcluirCliente id={c.id} nome={c.name} />
              </div>
            )}
          </div>
        </header>

        {/* Os blocos ocupam a largura toda: doze cards espremidos em dois
            terços viravam duas colunas altas e uma rolagem sem fim. */}
        <AreaOnboarding
          clientId={id}
          nomeDoCliente={c.name}
          porTipo={porTipo}
          podeEditar={podeEditar}
        />

        {/* O rodapé em três: o que aconteceu, o que está aberto, o que anotar.
            Nenhum dos três é a razão de abrir a página, então dividem a faixa
            de baixo em vez de disputar a lateral com os blocos. */}
        <div className="mt-6 grid gap-5 border-t border-ink-100 pt-6 lg:grid-cols-3">
          <AtividadeRecente cliente={c} briefing={porTipo.get('briefing')} />

          {/* Mesma moldura das duas vizinhas: sem ela, a coluna do meio ficava
              solta no fundo e a faixa parecia desalinhada. */}
          <section className="rounded-2xl border border-ink-200 bg-surface p-5">
            <h2 className="mb-4 text-base font-semibold text-ink-900">
              Demandas{' '}
              <span className="font-normal text-ink-500">
                {demandas.data ? `(${demandas.data.items.length})` : ''}
              </span>
            </h2>
            {demandas.isLoading && <Spinner className="text-ink-400" />}
            {demandas.data?.items.length === 0 && (
              <p className="text-[13px] text-ink-400">Nenhuma demanda para este cliente.</p>
            )}
            <ul className="space-y-3">
              {demandas.data?.items.slice(0, 6).map((t) => (
                <li key={t.id} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                  <Link href={`/demandas/${t.id}`} className="block transition hover:opacity-80">
                    <p className="truncate text-[13px] font-medium text-ink-800">{t.title}</p>
                    <p
                      className={clsx(
                        'text-[12px]',
                        t.isOverdue ? 'font-medium text-red-300' : 'text-ink-500',
                      )}
                    >
                      {formatDeadline(t.deadline)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <Observacoes clientId={id} registro={porTipo.get('outros')} podeEditar={podeEditar} />
        </div>

        {demandas.data && demandas.data.items.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-ink-500 uppercase">
              Histórico completo
              <span className="ml-2 font-normal normal-case tracking-normal text-ink-400">
                {demandas.data.total} {demandas.data.total === 1 ? 'demanda' : 'demandas'}
                {(() => {
                  const abertas = demandas.data.items.filter((t) => !t.completedAt).length
                  return abertas > 0 ? ` · ${abertas} em aberto` : ''
                })()}
                {!vejoTudo && ' · só as suas'}
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {demandas.data.items.map((t) => (
                <TaskCardBody
                  key={t.id}
                  task={t}
                  onOpen={(taskId) => router.push(`/demandas/${taskId}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <ClientModal open={editando} onClose={() => setEditando(false)} editando={c} />

      {acessosAberto && (
        <AcessosCliente
          clientId={c.id}
          nomeDoCliente={c.name}
          podeEditar={podeEditar}
          onFechar={() => setAcessosAberto(false)}
        />
      )}
    </Shell>
  )
}

/**
 * Apagar o cliente de vez.
 *
 * Existe ao lado de "encerrado" e não no lugar dele, porque respondem a coisas
 * diferentes: encerrado é o cliente que foi embora e cujo trabalho continua
 * valendo em relatório; apagar é para o registro que nasceu errado — um teste,
 * um nome digitado duas vezes — e que sem isto ficava na base para sempre.
 *
 * Quem decide se pode é o backend: ele conta demandas e compromissos e recusa
 * com a quantidade na mensagem. A tela mostra o que ele responder em vez de
 * repetir a regra aqui — duas cópias divergiriam na primeira mudança.
 */
function ExcluirCliente({ id, nome }: { id: string; nome: string }) {
  const router = useRouter()
  const excluir = useDeleteClient()
  const [confirmando, setConfirmando] = useState(false)

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        title="Apagar cliente"
        className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-red-500/12 hover:text-red-300"
      >
        <Trash2 className="size-4" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-24 w-full max-w-sm rounded-2xl bg-pine-800 p-6 shadow-2xl ring-1 ring-inset ring-overlay/10">
        <h2 className="text-sm font-semibold text-ink-900">Apagar este cliente?</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
          <span className="font-medium text-ink-700">{nome}</span> sai da base junto com os
          acessos, o perfil e as associações de social media. Não dá para desfazer.
        </p>
        {/* Dito antes de a pessoa tentar: quem quer só tirar da lista tem o
            "encerrado", e descobrir isso depois de um erro seria tarde. */}
        <p className="mt-2 text-[12px] leading-relaxed text-ink-500">
          Se ele tiver demandas ou compromissos, a exclusão é recusada — nesse caso marque
          como <span className="font-medium text-ink-700">encerrado</span>, que tira das
          listas sem perder o histórico.
        </p>

        {excluir.isError && (
          <p className="mt-3 text-[13px] leading-relaxed text-red-300">
            {excluir.error instanceof ApiError
              ? excluir.error.message
              : 'Não foi possível apagar'}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
          <button
            onClick={() =>
              excluir.mutate(id, {
                // Ficar na tela de um cliente que já não existe mostraria "não
                // encontrado" logo depois de apagar.
                onSuccess: () => router.replace('/clientes'),
              })
            }
            disabled={excluir.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {excluir.isPending ? <Spinner /> : <Trash2 className="size-4" />}
            Apagar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- cabeçalho */

/** "ago. 2026" — para "Cliente desde". */
function mesAno(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

/** "Hoje, 13:20" quando é hoje; "14/08, 09:05" nos outros dias. */
function quando(iso: string): string {
  const d = new Date(iso)
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const hoje = new Date()
  const mesmoDia =
    d.getDate() === hoje.getDate() &&
    d.getMonth() === hoje.getMonth() &&
    d.getFullYear() === hoje.getFullYear()
  if (mesmoDia) return `Hoje, ${hora}`
  return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${hora}`
}

/* ------------------------------------------------------------- atividade */

/**
 * A linha do tempo do cliente, DERIVADA do que já existe.
 *
 * Não há tabela de atividade para cliente — só para demanda. Em vez de
 * inventar uma, os itens saem de `createdAt`, `updatedAt` e do estado do
 * briefing. É honesto e cobre o que interessa: quando entrou e em que pé
 * está o onboarding.
 *
 * Por isso não aparece "por Fulano": a tabela `clients` não guarda quem
 * cadastrou. Ver a nota no fim, sobre os campos que faltam.
 */
function AtividadeRecente({ cliente, briefing }: { cliente: any; briefing: any }) {
  const iniciado = briefingIniciado(briefing)
  const finalizado = briefingFinalizado(briefing)
  const progresso = progressoBriefing(briefing)

  const itens: { titulo: string; detalhe: string; quando: string; ativo: boolean }[] = [
    {
      titulo: 'Cliente cadastrado',
      detalhe: cliente.contactEmail || cliente.contactPhone
        ? 'Dados de contato preenchidos'
        : 'Sem dados de contato',
      quando: quando(cliente.createdAt),
      ativo: true,
    },
  ]

  if (!iniciado) {
    itens.push({
      titulo: 'Onboarding aguardando início',
      detalhe: 'Nenhum bloco respondido',
      quando: '—',
      ativo: false,
    })
  } else if (!finalizado) {
    itens.push({
      titulo: 'Briefing em andamento',
      detalhe:
        progresso.total > 0
          ? `${progresso.respondidas} de ${progresso.total} perguntas respondidas`
          : 'Começou sem perguntas',
      quando: briefing?.updatedAt ? quando(briefing.updatedAt) : '—',
      ativo: true,
    })
  } else {
    itens.push({
      titulo: 'Briefing encerrado',
      detalhe:
        progresso.total > 0
          ? `${progresso.respondidas} de ${progresso.total} perguntas respondidas`
          : 'Encerrado sem perguntas',
      quando: briefing?.updatedAt ? quando(briefing.updatedAt) : '—',
      ativo: true,
    })
  }

  return (
    <section className="rounded-2xl border border-ink-200 bg-surface p-5">
      <h2 className="mb-4 text-base font-semibold text-ink-900">Atividade recente</h2>
      <ul className="space-y-3.5">
        {itens.map((i, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 border-b border-ink-100 pb-3.5 last:border-0 last:pb-0"
          >
            <span
              className={clsx(
                'mt-1.5 size-1.5 shrink-0 rounded-full',
                i.ativo ? 'bg-brand-600' : 'bg-ink-300',
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink-800">{i.titulo}</p>
              <p className="text-[12px] text-ink-500">{i.detalhe}</p>
            </div>
            <span className="shrink-0 text-[12px] text-ink-400">{i.quando}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ----------------------------------------------------------- observações */

/**
 * Anotações livres sobre o cliente.
 *
 * Guardadas na seção `outros`, que já existia no enum e é jsonb — nenhuma
 * coluna nova. É o lugar do contexto que não cabe em bloco de onboarding:
 * "prefere ser chamado no WhatsApp", "não aprova arte na sexta".
 */
function Observacoes({
  clientId,
  registro,
  podeEditar,
}: {
  clientId: string
  registro: any
  podeEditar: boolean
}) {
  const salvar = useSaveClientSection(clientId)
  const [editando, setEditandoObs] = useState(false)
  const [texto, setTexto] = useState('')

  const atual: string = registro?.content?.texto ?? ''

  return (
    <section className="rounded-2xl border border-ink-200 bg-surface p-5">
      <h2 className="mb-4 text-base font-semibold text-ink-900">Observações</h2>

      {editando ? (
        <>
          <textarea
            rows={5}
            autoFocus
            className="w-full rounded-lg border border-ink-200 bg-surface px-2.5 py-2 text-[13px]"
            placeholder="Contexto que não cabe no onboarding"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              onClick={async () => {
                await salvar.mutateAsync({
                  sectionType: 'outros',
                  title: 'Observações',
                  content: { texto },
                })
                setEditandoObs(false)
              }}
              disabled={salvar.isPending}
            >
              {salvar.isPending && <Spinner />}
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditandoObs(false)}>
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <>
          {atual ? (
            <p className="whitespace-pre-wrap text-[13px] text-ink-700">{atual}</p>
          ) : (
            <p className="text-[13px] text-ink-500">
              Nada anotado ainda. Use este espaço para contexto que não cabe no onboarding.
            </p>
          )}

          {podeEditar && (
            <button
              onClick={() => {
                setTexto(atual)
                setEditandoObs(true)
              }}
              className="mt-4 w-full rounded-lg border border-dashed border-ink-300 px-3 py-2 text-[13px] font-medium text-ink-600 transition hover:border-ink-200 hover:bg-ink-100 hover:text-ink-800"
            >
              {atual ? 'Editar observação' : 'Adicionar observação'}
            </button>
          )}
        </>
      )}
    </section>
  )
}

/**
 * Quem cuida do cliente.
 *
 * Vários de propósito: a agência decidiu que uma conta pode estar sob mais de
 * um social media. Cada pessoa marcada aqui recebe este cliente no checklist
 * do próprio cronograma semanal, montado no momento em que a recorrência
 * gera as demandas — cadastrar um cliente e marcar alguém aqui basta, ninguém
 * precisa lembrar de editar demanda nenhuma.
 *
 * Grava ao FECHAR a lista, não a cada clique: marcar três pessoas dispararia
 * três gravações, e a terceira poderia chegar antes da segunda.
 */
function SocialMedias({
  clientId,
  atuais,
  podeEditar,
}: {
  clientId: string
  atuais: string[]
  podeEditar: boolean
}) {
  const { data: equipe } = useTeam(false)
  /**
   * Os candidatos são só quem tem a função de social media. A equipe
   * inteira continua carregada para NOMEAR quem já está marcado — inclusive
   * alguém que entrou antes desta regra e não tem a função: aparece com o
   * aviso, para ser tirado, e não some em silêncio.
   */
  const { data: sociais } = useSocialMedias()
  const salvar = useSetClientSocialMedias(clientId)
  const [aberto, setAberto] = useState(false)
  const [sel, setSel] = useState<string[]>(atuais)
  const candidatos = useMemo(() => {
    const lista = (sociais ?? []).map((u) => ({ ...u, foraDaFuncao: false }))
    for (const u of equipe ?? []) {
      if (atuais.includes(u.id) && !lista.some((c) => c.id === u.id)) {
        lista.push({ id: u.id, name: u.name, avatarUrl: u.avatarUrl, roleDisplayName: u.roleDisplayName, foraDaFuncao: true })
      }
    }
    return lista
  }, [sociais, equipe, atuais])
  const algumForaDaFuncao = candidatos.some((c) => c.foraDaFuncao)

  // A lista do servidor manda; o rascunho só existe enquanto o menu está
  // aberto. Sem isto, salvar em outra aba deixaria este seletor desatualizado.
  useEffect(() => {
    if (!aberto) setSel(atuais)
  }, [atuais.join(','), aberto])

  const nomes = equipe?.filter((u) => atuais.includes(u.id)) ?? []

  function fechar() {
    setAberto(false)
    const mudou =
      sel.length !== atuais.length || sel.some((id) => !atuais.includes(id))
    if (mudou) salvar.mutate(sel)
  }

  return (
    <div className="relative min-w-0 max-w-[240px]">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
        Social media
      </p>

      <button
        onClick={() => podeEditar && setAberto((v) => !v)}
        disabled={!podeEditar}
        className={clsx(
          'mt-1 flex items-center gap-1.5 text-left',
          podeEditar && 'transition hover:opacity-80',
        )}
      >
        {nomes.length === 0 ? (
          <span className="text-[13px] text-ink-400">
            {podeEditar ? 'Definir responsável' : 'Sem responsável'}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="flex -space-x-1.5">
              {nomes.slice(0, 3).map((u) => (
                <Avatar key={u.id} name={u.name} url={u.avatarUrl} size={22} />
              ))}
            </span>
            <span className="truncate text-[13px] text-ink-700">
              {nomes.length === 1
                ? nomes[0]!.name.split(' ')[0]
                : `${nomes.length} pessoas`}
              {algumForaDaFuncao && (
                <span className="ml-1.5 text-[11px] font-medium text-amber-300" title="Alguém aqui não tem a função de social media">
                  · sem a função
                </span>
              )}
            </span>
          </span>
        )}
        {podeEditar && <ChevronDown className="size-3.5 shrink-0 text-ink-400" />}
      </button>

      {aberto && (
        <>
          {/* Clique fora fecha e grava — é o gesto natural de "terminei". */}
          <button
            aria-label="Fechar"
            onClick={fechar}
            className="fixed inset-0 z-20 cursor-default"
          />
          <div className="absolute left-0 z-30 mt-2 max-h-64 w-60 overflow-y-auto rounded-xl bg-pine-800 p-1.5 shadow-2xl ring-1 ring-inset ring-overlay/12">
            {candidatos.length === 0 && (
              <p className="px-2.5 py-2 text-[12px] text-ink-400">
                Ninguém com a função de social media. Dê a função a alguém na Administração.
              </p>
            )}
            {candidatos.map((u) => {
              const marcado = sel.includes(u.id)
              return (
                <button
                  key={u.id}
                  onClick={() =>
                    setSel((s) => (marcado ? s.filter((x) => x !== u.id) : [...s, u.id]))
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-overlay/8"
                >
                  <span
                    className={clsx(
                      'flex size-4 shrink-0 items-center justify-center rounded border',
                      marcado ? 'border-brand-500 bg-brand-500' : 'border-ink-300',
                    )}
                  >
                    {marcado && <Check className="size-3 text-white" />}
                  </span>
                  <Avatar name={u.name} url={u.avatarUrl} size={22} />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-800">
                    {u.name}
                    {u.foraDaFuncao && (
                      <span className="ml-1 text-[11px] text-amber-300">sem a função de social media</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
