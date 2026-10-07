'use client'

import { useMemo, useState } from 'react'
import Link from '@/demos/kanban-cev/lib/nav'
import { Plus, Search, Users } from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { Avatar, Badge, Button, EmptyState, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'
import { ClientModal } from '@/demos/kanban-cev/components/client-modal'
import { useClients, useMe, useTeam } from '@/demos/kanban-cev/lib/hooks'

const STATUS_STYLE: Record<string, string> = {
  ativo: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/25',
  pausado: 'bg-amber-400/15 text-amber-200 ring-amber-300/25',
  encerrado: 'bg-ink-100 text-ink-600 ring-ink-300',
}

export default function ClientesPage() {
  const { data: me } = useMe()
  const { data: clients, isLoading } = useClients()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('todos')
  const [socialMedia, setSocialMedia] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const { data: equipe } = useTeam(false)

  const podeGerenciar = !!me && (me.isAdmin || me.permissions.includes('client:manage' as never))

  /**
   * Só quem de fato cuida de algum cliente entra no seletor.
   *
   * Listar a equipe inteira encheria o filtro de gente que nunca vai devolver
   * resultado — e cada uma dessas opções é um caminho para uma lista vazia,
   * que a pessoa lê como defeito antes de ler como "essa não tem cliente".
   */
  const socialMedias = useMemo(() => {
    const comClientes = new Set<string>()
    for (const c of clients ?? []) for (const id of (c as any).socialMediaIds ?? []) comClientes.add(id)
    return (equipe ?? [])
      .filter((u) => comClientes.has(u.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [clients, equipe])

  const filtrados = (clients ?? []).filter((c: any) => {
    if (status !== 'todos' && c.status !== status) return false

    if (socialMedia !== 'todos') {
      const donos: string[] = c.socialMediaIds ?? []
      // "sem" é o recorte que denuncia a conta fora de todo cronograma.
      if (socialMedia === 'sem' ? donos.length > 0 : !donos.includes(socialMedia)) return false
    }

    return c.name.toLowerCase().includes(busca.trim().toLowerCase())
  })

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900">Clientes</h1>
            <p className="mt-0.5 text-[13px] text-ink-500">
              DNA, persona, SWOT e o histórico de demandas de cada conta.
            </p>
          </div>

          {podeGerenciar && (
            <Button onClick={() => setModalAberto(true)}>
              <Plus className="size-4" />
              Novo cliente
            </Button>
          )}
        </header>

        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Buscar cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select
            className="rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="pausado">Pausados</option>
            <option value="encerrado">Encerrados</option>
          </select>

          {/**
            * Filtro por social media.
            *
            * Todo mundo continua vendo todo mundo — isto é RECORTE de tela, não
            * permissão: a lista completa segue a um clique de distância em
            * "Todos". Serve tanto para a coordenação ver a carteira de uma
            * pessoa quanto para a própria pessoa isolar as contas dela.
            *
            * Só aparece quando há alguém associado a algum cliente. Antes de a
            * agência marcar os responsáveis, um seletor vazio só levantaria a
            * pergunta de para que ele serve.
            */}
          {socialMedias.length > 0 && (
            <select
              className="rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-700"
              value={socialMedia}
              onChange={(e) => setSocialMedia(e.target.value)}
            >
              <option value="todos">Todos os social medias</option>
              {socialMedias.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
              {/* Sem responsável é o recorte mais útil da lista: é o que
                  denuncia a conta que não entra em cronograma nenhum. */}
              <option value="sem">Sem responsável</option>
            </select>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner className="text-ink-400" />
          </div>
        )}

        {clients && filtrados.length === 0 && (
          <EmptyState
            icon={<Users className="size-8" />}
            title={busca ? 'Nenhum cliente com esse nome' : 'Nenhum cliente cadastrado'}
            description={
              busca
                ? 'Tente outro termo ou limpe o filtro de status.'
                : 'Cadastre a primeira conta para começar a organizar as demandas por cliente.'
            }
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((c: any) => (
            <Link
              key={c.id}
              href={`/clientes/${c.id}`}
              className="group rounded-xl border border-ink-200 bg-surface p-4 transition hover:border-ink-300 hover:shadow-sm"
            >
              <div className="mb-3 flex items-start gap-3">
                <Avatar name={c.name} url={c.logoUrl} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{c.name}</p>
                  {c.segment && <p className="truncate text-[12px] text-ink-500">{c.segment}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Badge className={STATUS_STYLE[c.status] ?? STATUS_STYLE.ativo}>{c.status}</Badge>

                {/* Quem cuida, no próprio card: assim a carteira de cada um se
                    lê sem precisar filtrar, e a conta órfã salta à vista. */}
                <span className="flex items-center gap-1.5">
                  <span className="flex -space-x-1.5">
                    {(c.socialMediaIds ?? []).slice(0, 3).map((id: string) => {
                      const u = equipe?.find((x) => x.id === id)
                      return u ? (
                        <Avatar key={id} name={u.name} url={u.avatarUrl} size={20} />
                      ) : null
                    })}
                  </span>
                  {/* Total e em aberto: "0 demandas" numa conta com 29 concluídas
                      lia-se como demanda perdida. */}
                  <span
                    className={clsx(
                      'text-[12px]',
                      (c.totalTasks ?? 0) > 0 ? 'text-ink-600' : 'text-ink-400',
                    )}
                  >
                    {(c.totalTasks ?? 0) === 0
                      ? 'sem demandas'
                      : `${c.totalTasks} ${c.totalTasks === 1 ? 'demanda' : 'demandas'}`}
                    {c.openTasks > 0 && (
                      <span className="font-medium text-ink-800"> · {c.openTasks} em aberto</span>
                    )}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ClientModal open={modalAberto} onClose={() => setModalAberto(false)} />
    </Shell>
  )
}
