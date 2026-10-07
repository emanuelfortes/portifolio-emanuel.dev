'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@/demos/kanban-cev/lib/query'
import { Plus, Pencil, Check, X, EyeOff, Eye, AlertTriangle, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { Button, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'

interface TipoDemanda {
  id: number
  slug: string
  displayName: string
  color: string
  defaultRoleId: number | null
  isActive: boolean
}

interface Funcao {
  id: number
  slug: string
  displayName: string
  isSystem: boolean
  isActive: boolean
  permissionKeys: string[]
  /** Calculado no servidor: tem TODAS as permissões que existem hoje. */
  acessoTotal: boolean
}

/**
 * Configuração de tipos de demanda e funções.
 *
 * As duas são tabelas de apoio que a agência ajusta sozinha — renomear "Vídeo
 * / Reels", criar "Edição de podcast", acrescentar uma função nova. Antes
 * disso, mexer em qualquer uma exigia alterar o seed e rodar migration.
 *
 * NADA aqui exclui de verdade. Tipo é referenciado por `tasks.task_type_id` e
 * função por `users.role_id`: apagar arrancaria o histórico junto. Desativar
 * tira da lista de escolha e preserva o passado.
 */
export function PainelConfiguracao() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <SecaoTipos />
      <SecaoFuncoes />
    </div>
  )
}

/* ------------------------------------------------------ tipos de demanda */

function SecaoTipos() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['config', 'task-types'],
    queryFn: () => api.get<TipoDemanda[]>('/meta/task-types/all'),
  })
  const { data: funcoes } = useQuery({
    queryKey: ['config', 'roles'],
    queryFn: () => api.get<Funcao[]>('/meta/roles/all'),
  })

  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')
  /** A função que faz o tipo, como texto do `<select>`; vazio = sem função. */
  const [funcaoNova, setFuncaoNova] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [rascunho, setRascunho] = useState('')
  const [rascunhoFuncao, setRascunhoFuncao] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const invalidar = () => {
    qc.invalidateQueries({ queryKey: ['config'] })
    // A lista usada nos formulários de demanda é outra query: sem isto, o
    // tipo novo só apareceria depois de recarregar a página.
    qc.invalidateQueries({ queryKey: ['taskTypes'] })
  }

  const criar = useMutation({
    mutationFn: (v: { displayName: string; defaultRoleId: number | null }) =>
      api.post('/meta/task-types', v),
    onSuccess: () => {
      invalidar()
      setNome('')
      setFuncaoNova('')
      setCriando(false)
      setErro(null)
    },
    onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível criar'),
  })

  const salvar = useMutation({
    mutationFn: (v: { id: number; data: Record<string, unknown> }) =>
      api.patch(`/meta/task-types/${v.id}`, v.data),
    onSuccess: () => {
      invalidar()
      setEditando(null)
      setErro(null)
    },
    onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível salvar'),
  })

  const nomeDaFuncao = (id: number | null) =>
    id ? (funcoes?.find((f) => f.id === id)?.displayName ?? null) : null

  const criarNovo = () => {
    if (nome.trim().length < 2) return
    criar.mutate({ displayName: nome.trim(), defaultRoleId: funcaoNova ? Number(funcaoNova) : null })
  }
  const salvarEdicao = (id: number) =>
    salvar.mutate({
      id,
      data: {
        displayName: rascunho.trim(),
        defaultRoleId: rascunhoFuncao ? Number(rascunhoFuncao) : null,
      },
    })

  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-900">Tipos de demanda</h2>
          <p className="text-[12px] text-ink-500">O que aparece no seletor ao criar uma demanda.</p>
        </div>
        {!criando && (
          <Button variant="outline" onClick={() => setCriando(true)}>
            <Plus className="size-4" />
            Novo
          </Button>
        )}
      </header>

      {criando && (
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            className={clsx(inputClass, 'min-w-[12rem] flex-1')}
            autoFocus
            placeholder="Ex: Vídeo Plus"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && criarNovo()}
          />
          {/* Quem faz esse tipo: sem isto o tipo nasce sem função, e o sistema
              não sabe para quem sugerir nem para qual fila devolver. */}
          <SelectFuncao valor={funcaoNova} onChange={setFuncaoNova} funcoes={funcoes} className="flex-1" />
          <button
            onClick={criarNovo}
            disabled={criar.isPending || nome.trim().length < 2}
            className="shrink-0 rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-500/12 disabled:opacity-40"
          >
            {criar.isPending ? <Spinner /> : <Check className="size-4" />}
          </button>
          <button
            onClick={() => {
              setCriando(false)
              setNome('')
              setErro(null)
            }}
            className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-ink-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="text-ink-400" />
        </div>
      ) : (
        <ul className="space-y-1.5">
          {data?.map((t) => (
            <li
              key={t.id}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition',
                t.isActive ? 'hover:bg-ink-100' : 'opacity-50',
              )}
            >
              <span className="size-3 shrink-0 rounded-full" style={{ background: t.color }} />

              {editando === t.id ? (
                <>
                  <input
                    className={clsx(inputClass, 'min-w-[8rem] flex-1')}
                    autoFocus
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && salvarEdicao(t.id)}
                  />
                  <SelectFuncao valor={rascunhoFuncao} onChange={setRascunhoFuncao} funcoes={funcoes} />
                  <button
                    onClick={() => salvarEdicao(t.id)}
                    className="shrink-0 rounded p-1.5 text-emerald-600 hover:bg-emerald-500/12"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="shrink-0 rounded p-1.5 text-ink-400 hover:bg-ink-100"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] text-ink-800">{t.displayName}</span>
                    <span className={clsx('text-[11px]', t.defaultRoleId ? 'text-ink-500' : 'text-ink-400')}>
                      {nomeDaFuncao(t.defaultRoleId)
                        ? `faz: ${nomeDaFuncao(t.defaultRoleId)}`
                        : 'sem função definida'}
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setEditando(t.id)
                      setRascunho(t.displayName)
                      setRascunhoFuncao(t.defaultRoleId ? String(t.defaultRoleId) : '')
                    }}
                    title="Editar nome e função"
                    className="shrink-0 rounded p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => salvar.mutate({ id: t.id, data: { isActive: !t.isActive } })}
                    title={t.isActive ? 'Desativar' : 'Reativar'}
                    className="shrink-0 rounded p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                  >
                    {t.isActive ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {erro && <p className="mt-2 text-[13px] text-red-300">{erro}</p>}

      <p className="mt-3 border-t border-ink-100 pt-3 text-[12px] text-ink-500">
        Desativar tira o tipo do seletor sem apagar as demandas que já o usam. A função do tipo é
        quem faz esse trabalho: sugere o responsável ao criar a demanda e recebe a demanda de
        volta quando alguém a devolve à fila.
      </p>
    </section>
  )
}

/** A função que faz um tipo. Só as ativas: fila de função desativada não tem quem pegue. */
function SelectFuncao({
  valor,
  onChange,
  funcoes,
  className,
}: {
  valor: string
  onChange: (v: string) => void
  funcoes: Funcao[] | undefined
  className?: string
}) {
  return (
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(inputClass, 'w-auto min-w-40', className)}
      aria-label="Quem faz esse tipo"
      title="Quem faz esse tipo: sugere o responsável e recebe a demanda de volta na fila"
    >
      <option value="">Sem função</option>
      {funcoes
        ?.filter((f) => f.isActive)
        .map((f) => (
          <option key={f.id} value={f.id}>
            {f.displayName}
          </option>
        ))}
    </select>
  )
}

/* ------------------------------------------------------------- funções */

function SecaoFuncoes() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['config', 'roles'],
    queryFn: () => api.get<Funcao[]>('/meta/roles/all'),
  })

  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')
  /** Padrão ligado: os cargos que motivaram esta tela são de direção. */
  const [acessoTotal, setAcessoTotal] = useState(true)
  const [editando, setEditando] = useState<number | null>(null)
  const [rascunho, setRascunho] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const invalidar = () => {
    qc.invalidateQueries({ queryKey: ['config'] })
    qc.invalidateQueries({ queryKey: ['delegationMatrix'] })
    qc.invalidateQueries({ queryKey: ['team'] })
  }

  const criar = useMutation({
    mutationFn: (v: { displayName: string; acessoTotal: boolean }) =>
      api.post<{ aviso?: string }>('/meta/roles', v),
    onSuccess: (r) => {
      invalidar()
      setNome('')
      setCriando(false)
      setErro(null)
      // O aviso vem da API: função nova nasce sem permissão nenhuma, e sem
      // dizer isso a pessoa cadastra alguém nela e não entende por que ela
      // não consegue fazer nada.
      if (r?.aviso) setAviso(r.aviso)
    },
    onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível criar'),
  })

  const salvar = useMutation({
    mutationFn: (v: { id: number; data: Record<string, unknown> }) =>
      api.patch(`/meta/roles/${v.id}`, v.data),
    onSuccess: () => {
      invalidar()
      setEditando(null)
      setErro(null)
    },
    onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível salvar'),
  })

  /**
   * Liga ou desliga o acesso total.
   *
   * As chaves saem da lista de permissões do sistema, buscada na hora — uma
   * lista fixa aqui sairia de sincronia na primeira permissão nova, e o cargo
   * de direção ficaria sem ela sem ninguém perceber.
   */
  const alternarAcesso = useMutation({
    mutationFn: async (f: Funcao) => {
      const todas = f.acessoTotal
        ? []
        : (await api.get<{ permissions: { key: string }[] }>('/meta/permissions')).permissions.map(
            (p) => p.key,
          )
      return api.put(`/meta/roles/${f.id}/permissions`, { permissionKeys: todas })
    },
    onSuccess: () => {
      invalidar()
      setErro(null)
    },
    onError: (e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível alterar o acesso'),
  })

  return (
    <section className="rounded-xl border border-ink-200 bg-surface p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-900">Funções</h2>
          <p className="text-[12px] text-ink-500">Os cargos da equipe.</p>
        </div>
        {!criando && (
          <Button variant="outline" onClick={() => setCriando(true)}>
            <Plus className="size-4" />
            Nova
          </Button>
        )}
      </header>

      {criando && (
        <div className="mb-3 space-y-2 rounded-lg bg-overlay/5 p-3 ring-1 ring-inset ring-overlay/10">
          <div className="flex gap-2">
            <input
              className={inputClass}
              autoFocus
              placeholder="Ex: CEO, Supervisor, Direção"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                nome.trim().length > 1 &&
                criar.mutate({ displayName: nome.trim(), acessoTotal })
              }
            />
            <button
              onClick={() =>
                nome.trim().length > 1 && criar.mutate({ displayName: nome.trim(), acessoTotal })
              }
              disabled={criar.isPending || nome.trim().length < 2}
              className="shrink-0 rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-500/12 disabled:opacity-40"
            >
              {criar.isPending ? <Spinner /> : <Check className="size-4" />}
            </button>
            <button
              onClick={() => {
                setCriando(false)
                setNome('')
                setErro(null)
              }}
              className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-ink-100"
            >
              <X className="size-4" />
            </button>
          </div>

          {/*
            * O atalho que evita o passo intermediário. Sem ele, a função nasce
            * sem permissão nenhuma e alguém tem que lembrar de voltar aqui —
            * enquanto isso, quem for cadastrado nela entra e não faz nada.
            */}
          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-ink-700">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={acessoTotal}
              onChange={(e) => setAcessoTotal(e.target.checked)}
            />
            <span>
              Acesso total — mesma visão do administrador
              <span className="block text-[12px] text-ink-500">
                Para cargos de direção. Marque se a pessoa deve enxergar e gerenciar tudo.
              </span>
            </span>
          </label>
        </div>
      )}

      {aviso && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-amber-400/12 px-3 py-2.5 text-[13px] text-amber-200 ring-1 ring-inset ring-amber-300/25">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span className="flex-1">{aviso}</span>
          <button
            onClick={() => setAviso(null)}
            className="shrink-0 rounded p-0.5 hover:bg-overlay/10"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="text-ink-400" />
        </div>
      ) : (
        <ul className="space-y-1.5">
          {data?.map((f) => (
            <li
              key={f.id}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition',
                f.isActive ? 'hover:bg-ink-100' : 'opacity-50',
              )}
            >
              {editando === f.id ? (
                <>
                  <input
                    className={inputClass}
                    autoFocus
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      salvar.mutate({ id: f.id, data: { displayName: rascunho.trim() } })
                    }
                  />
                  <button
                    onClick={() =>
                      salvar.mutate({ id: f.id, data: { displayName: rascunho.trim() } })
                    }
                    className="shrink-0 rounded p-1.5 text-emerald-600 hover:bg-emerald-500/12"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="shrink-0 rounded p-1.5 text-ink-400 hover:bg-ink-100"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] text-ink-800">{f.displayName}</span>
                    <span className="text-[11px] text-ink-500">
                      {f.acessoTotal
                        ? 'acesso total'
                        : f.permissionKeys.length === 0
                          ? 'sem permissões'
                          : `${f.permissionKeys.length} ${f.permissionKeys.length === 1 ? 'permissão' : 'permissões'}`}
                    </span>
                  </span>
                  {f.isSystem && (
                    <span className="shrink-0 rounded-full bg-overlay/5 px-2 py-0.5 text-[11px] text-ink-500 ring-1 ring-inset ring-overlay/10">
                      original
                    </span>
                  )}
                  {/* Liga e desliga o acesso total. A lista completa de
                      permissões vem da API para não sair de sincronia com o
                      que o sistema realmente tem. */}
                  <button
                    onClick={() => alternarAcesso.mutate(f)}
                    disabled={alternarAcesso.isPending}
                    title={f.acessoTotal ? 'Tirar acesso total' : 'Dar acesso total'}
                    className={clsx(
                      'shrink-0 rounded p-1.5 transition disabled:opacity-40',
                      f.acessoTotal
                        ? 'text-brand-600 hover:bg-brand-600/15'
                        : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700',
                    )}
                  >
                    <ShieldCheck className="size-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditando(f.id)
                      setRascunho(f.displayName)
                    }}
                    title="Renomear"
                    className="shrink-0 rounded p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  {/* Função original não pode ser desativada: o sistema
                      pressupõe que ela existe, e não há tela para consertar
                      um usuário que ficou sem lugar. */}
                  {!f.isSystem && (
                    <button
                      onClick={() => salvar.mutate({ id: f.id, data: { isActive: !f.isActive } })}
                      title={f.isActive ? 'Desativar' : 'Reativar'}
                      className="shrink-0 rounded p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                    >
                      {f.isActive ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {erro && <p className="mt-2 text-[13px] text-red-300">{erro}</p>}

      <p className="mt-3 border-t border-ink-100 pt-3 text-[12px] text-ink-500">
        As funções originais podem ser renomeadas, mas não desativadas. Função nova nasce sem
        permissões — configure o que ela pode fazer em Delegação.
      </p>
    </section>
  )
}
