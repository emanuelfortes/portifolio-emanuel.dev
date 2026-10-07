'use client'

import { useMemo, useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import { Search, X } from 'lucide-react'
import clsx from 'clsx'
import { Shell } from '@/demos/kanban-cev/components/shell'
import { TaskTable, COLUNAS_COMPLETAS } from '@/demos/kanban-cev/components/task-table'
import { Spinner, inputClass } from '@/demos/kanban-cev/components/ui'
import { BuscaEtiquetas } from '@/demos/kanban-cev/components/busca-etiquetas'
import { BUSCA_POR_PAGINA, useBuscarDemandas, useLabels, useMe, useTaskTypes, useTeam } from '@/demos/kanban-cev/lib/hooks'

/**
 * A tela de PROCURAR demanda, diferente das telas de acompanhar.
 *
 * O painel e o quadro respondem "o que eu tenho para fazer agora" e por isso
 * escondem o que já passou. Aqui a pergunta é outra: "onde foi parar aquele
 * cronograma da Dra. Roberta de 2026" — e a resposta pode estar em qualquer
 * demanda já criada, concluída há meses inclusive.
 *
 * As mais recentes vêm primeiro, e "Mostrar mais" desce no tempo. Já foi "as
 * cem de prazo mais próximo": numa agência com centenas de demandas antigas,
 * a de hoje, com prazo daqui a um mês, ficava fora do corte e parecia não
 * existir. Foi assim que o cronograma sumiu desta tela (23/09/2026).
 */

export default function TodasAsDemandasPage() {
  const router = useRouter()
  const { data: me } = useMe()
  const { data: equipe } = useTeam(true)
  const { data: etiquetas } = useLabels()
  const { data: tipos } = useTaskTypes()

  const [responsavel, setResponsavel] = useState('')
  const [tipo, setTipo] = useState('')
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [texto, setTexto] = useState('')

  /**
   * Quem enxerga a agência inteira busca nela; quem não enxerga busca no que é
   * seu.
   *
   * Recusar com 403 seria pior: a pessoa clicaria no menu, tomaria um erro e
   * não saberia que a tela funciona para ela em escala menor. Mesma decisão do
   * painel de checklist do dia.
   */
  const vejoTudo = !!me && (me.isAdmin || me.permissions.includes('task:view_all' as never))

  const query = useMemo(() => {
    const p = new URLSearchParams()
    p.set('scope', vejoTudo ? 'team' : 'me')
    p.set('orderBy', 'created_at')
    // Envolvida, não só responsável: pega o cronograma de quem tem peça nele.
    if (responsavel) p.set('personId', responsavel)
    if (tipo) p.set('taskTypeId', tipo)
    if (selecionadas.length) p.set('labelIds', selecionadas.join(','))
    const t = texto.trim()
    if (t) p.set('search', t)
    return p.toString()
  }, [vejoTudo, responsavel, tipo, selecionadas, texto])

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBuscarDemandas(query, !!me)
  const itens = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data])
  const total = data?.pages[0]?.total ?? 0

  const temFiltro = !!responsavel || !!tipo || selecionadas.length > 0 || !!texto.trim()

  function limpar() {
    setResponsavel('')
    setTipo('')
    setSelecionadas([])
    setTexto('')
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink-900">
            Todas as demandas
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-500">
            {vejoTudo
              ? 'Tudo que já foi criado, aberto ou concluído, das mais recentes para as mais antigas. Filtre por pessoa, tipo e etiqueta.'
              : 'Tudo que já foi criado para você, aberto ou concluído, das mais recentes para as mais antigas.'}
          </p>
        </header>

        <section className="mb-5 space-y-3 rounded-2xl bg-surface/70 p-4 ring-1 ring-inset ring-overlay/8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Buscar por título, descrição, tipo ou cliente…"
                /* `lg:pl-9` também: o `lg:px-3` do inputClass venceria o `pl-9` no desktop. */
                className={clsx(inputClass, 'pl-9 lg:pl-9')}
              />
            </div>

            {vejoTudo && (
              <select
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className={clsx(inputClass, 'w-auto min-w-44')}
              >
                <option value="">Todas as pessoas</option>
                {equipe?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {!u.isActive && ' (inativo)'}
                  </option>
                ))}
              </select>
            )}

            {/* Tipo é o filtro que acha "todos os cronogramas" de uma vez. */}
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={clsx(inputClass, 'w-auto min-w-40')}
              aria-label="Tipo da demanda"
            >
              <option value="">Todos os tipos</option>
              {tipos?.map((t: { id: number; displayName: string }) => (
                <option key={t.id} value={t.id}>
                  {t.displayName}
                </option>
              ))}
            </select>

            {temFiltro && (
              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-500 transition hover:text-ink-900"
              >
                <X className="size-3.5" />
                Limpar
              </button>
            )}
          </div>

          {/**
            * As etiquetas SOMAM: cada uma escolhida estreita o resultado.
            *
            * Marcar cronograma, ss3 e 2026 quer dizer "o cronograma ss3 de
            * 2026" — uma coisa só. Se acrescentar etiqueta alargasse a busca,
            * procurar mais específico devolveria mais demandas, que é o
            * contrário do que se quer. A frase abaixo do campo existe para a
            * regra não depender de a pessoa deduzir pelo resultado.
            */}
          <div>
            <BuscaEtiquetas
              etiquetas={etiquetas ?? []}
              valor={selecionadas}
              onChange={setSelecionadas}
            />
            {selecionadas.length > 1 && (
              <p className="mt-1.5 text-[12px] text-ink-400">
                Mostrando só as demandas que têm as {selecionadas.length} etiquetas juntas.
              </p>
            )}
          </div>
        </section>

        <div className="mb-2.5 flex items-center gap-2 text-[13px] text-ink-500">
          {isLoading ? (
            <Spinner className="text-ink-400" />
          ) : (
            <>
              <span className="font-medium text-ink-800 tabular-nums">{total}</span>
              {total === 1 ? 'demanda' : 'demandas'}
              {/*
                * O corte precisa ser dito: sem isso, "247 demandas" com cem na
                * tela parece defeito, e a pessoa procura na lista uma que está
                * fora dela.
                */}
              {total > itens.length && (
                <span className="text-ink-400">
                  · as {itens.length} mais recentes na tela
                </span>
              )}
              {isFetching && !isFetchingNextPage && <Spinner className="text-ink-400" />}
            </>
          )}
        </div>

        <TaskTable
          tasks={itens}
          colunas={COLUNAS_COMPLETAS}
          ordenavel
          manterOrdem
          carregando={isLoading}
          onAbrir={(id) => router.push(`/demandas/${id}`)}
          vazio={
            <p className="rounded-xl border border-dashed border-overlay/12 px-4 py-10 text-center text-[13px] text-ink-500">
              {temFiltro
                ? 'Nenhuma demanda com esses filtros. Tire uma etiqueta para alargar a busca.'
                : 'Nenhuma demanda ainda.'}
            </p>
          }
        />

        {hasNextPage && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-[13px] font-medium text-ink-800 ring-1 ring-inset ring-overlay/10 transition hover:bg-ink-100 disabled:opacity-60"
            >
              {isFetchingNextPage && <Spinner className="text-ink-400" />}
              Mostrar mais {Math.min(BUSCA_POR_PAGINA, total - itens.length)} mais antigas
            </button>
          </div>
        )}
      </div>
    </Shell>
  )
}
