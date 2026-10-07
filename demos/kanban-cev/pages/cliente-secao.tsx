'use client'


import Link from '@/demos/kanban-cev/lib/nav'
import { ArrowLeft } from 'lucide-react'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { SecaoPerfil } from '@/demos/kanban-cev/components/secao-perfil'
import { BriefingSecao } from '@/demos/kanban-cev/components/briefing'
import { Avatar, EmptyState, Spinner } from '@/demos/kanban-cev/components/ui'
import { useClient, useMe } from '@/demos/kanban-cev/lib/hooks'
import { SECOES, secaoPorTipo } from '@/demos/kanban-cev/lib/secoes-cliente'

/**
 * A página de UMA seção do onboarding.
 *
 * É uma rota só para as doze seções, resolvida pelo `[tipo]`. Doze arquivos
 * iguais mudando o título seria a alternativa, e cada formato novo teria de
 * ser lembrado em doze lugares.
 */
export default function SecaoPage({
  params,
}: {
  params: { id: string; tipo: string }
}) {
  const { id, tipo } = params
  const { data: me } = useMe()
  const cliente = useClient(id)

  const secao = secaoPorTipo(tipo)
  // Mesmo critério da página do cliente: admin também edita.
  const podeEditar = !!me && (me.isAdmin || me.permissions.includes('client:manage' as never))

  /** URL inventada na barra de endereços não pode virar tela quebrada. */
  if (!secao) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-6 lg:px-8">
          <VoltarPara id={id} />
          <EmptyState
            title="Seção não encontrada"
            description="Este endereço não corresponde a nenhuma seção do onboarding."
          />
        </div>
      </Shell>
    )
  }

  if (cliente.isLoading) {
    return (
      <Shell>
        <div className="flex justify-center py-24">
          <Spinner className="text-ink-400" />
        </div>
      </Shell>
    )
  }

  if (!cliente.data) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-6 lg:px-8">
          <VoltarPara id={id} />
          <EmptyState title="Cliente não encontrado" />
        </div>
      </Shell>
    )
  }

  const c = cliente.data
  const registro = (c.sections ?? []).find((s: any) => s.sectionType === tipo)

  /** Para navegar entre seções sem voltar à lista a cada uma. */
  const i = SECOES.findIndex((s) => s.type === tipo)
  const anterior = i > 0 ? SECOES[i - 1] : null
  const proxima = i < SECOES.length - 1 ? SECOES[i + 1] : null

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-6 lg:px-8">
        <VoltarPara id={id} nome={c.name} />

        <div className="mb-4 flex items-center gap-2.5">
          <Avatar name={c.name} url={c.logoUrl} size={28} />
          <p className="text-[13px] text-ink-500">
            {c.name} · <span className="text-ink-400">seção {i + 1} de {SECOES.length}</span>
          </p>
        </div>

        <SecaoPerfil
          clientId={id}
          tipo={secao.type}
          titulo={secao.title}
          hint={secao.hint}
          formato={secao.formato}
          registro={registro}
          podeEditar={podeEditar}
        />

        {/* A entrevista fica embaixo do conteúdo que ela produz. */}
        <BriefingSecao
          clientId={id}
          secao={secao.type}
          briefing={(c.sections ?? []).find((s: any) => s.sectionType === 'briefing')}
          podeEditar={podeEditar}
        />

        <nav className="mt-5 flex items-stretch justify-between gap-3">
          {anterior ? (
            <Link
              href={`/clientes/${id}/secoes/${anterior.type}`}
              className="flex-1 rounded-xl border border-ink-200 bg-surface px-4 py-3 transition hover:border-ink-300"
            >
              <p className="text-[11px] text-ink-500">Anterior</p>
              <p className="text-[13px] font-medium text-ink-800">{anterior.title}</p>
            </Link>
          ) : (
            <span className="flex-1" />
          )}

          {proxima ? (
            <Link
              href={`/clientes/${id}/secoes/${proxima.type}`}
              className="flex-1 rounded-xl border border-ink-200 bg-surface px-4 py-3 text-right transition hover:border-ink-300"
            >
              <p className="text-[11px] text-ink-500">Próxima</p>
              <p className="text-[13px] font-medium text-ink-800">{proxima.title}</p>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </Shell>
  )
}

function VoltarPara({ id, nome }: { id: string; nome?: string }) {
  return (
    <Link
      href={`/clientes/${id}`}
      className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition hover:text-ink-800"
    >
      <ArrowLeft className="size-4" />
      {nome ?? 'Voltar ao cliente'}
    </Link>
  )
}
