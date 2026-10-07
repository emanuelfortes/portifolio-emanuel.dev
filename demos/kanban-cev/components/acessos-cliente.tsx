'use client'

import { useState } from 'react'
import { Instagram, Facebook, Youtube, Linkedin, Chrome } from '@/demos/kanban-cev/lib/marcas'
import {
  Music2,
  MessageCircle,
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  X,
  Pencil,
} from 'lucide-react'
import clsx from 'clsx'
import { PLATAFORMA_ACESSO } from '@/demos/kanban-cev/shared'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { useAcessos, useSalvarAcesso, useApagarAcesso } from '@/demos/kanban-cev/lib/hooks'
import { Button, Field, Spinner, inputClass } from '@/demos/kanban-cev/components/ui'

/**
 * O ícone e o rótulo de cada plataforma.
 *
 * O ícone é o que faz a lista ser lida de relance: quem procura o Instagram
 * acha a câmera antes de ler a palavra. TikTok não existe no conjunto de
 * ícones — `Music2` é o mais próximo do que a marca comunica, e melhor do que
 * um genérico que não diria nada.
 */
const PLATAFORMAS: Record<string, { rotulo: string; Icone: typeof Instagram; cor: string }> = {
  instagram: { rotulo: 'Instagram', Icone: Instagram, cor: 'text-pink-400' },
  facebook: { rotulo: 'Facebook', Icone: Facebook, cor: 'text-blue-400' },
  tiktok: { rotulo: 'TikTok', Icone: Music2, cor: 'text-ink-800' },
  youtube: { rotulo: 'YouTube', Icone: Youtube, cor: 'text-red-400' },
  linkedin: { rotulo: 'LinkedIn', Icone: Linkedin, cor: 'text-sky-400' },
  whatsapp: { rotulo: 'WhatsApp', Icone: MessageCircle, cor: 'text-emerald-400' },
  google: { rotulo: 'Google', Icone: Chrome, cor: 'text-amber-400' },
  site: { rotulo: 'Site', Icone: Globe, cor: 'text-ink-500' },
  outro: { rotulo: 'Outro', Icone: KeyRound, cor: 'text-ink-500' },
}

interface Acesso {
  id: string
  platform: string
  label: string | null
  username: string | null
  phone: string | null
  notes: string | null
  temSenha: boolean
}

/**
 * Os acessos das contas do cliente.
 *
 * A senha NUNCA vem na listagem: a API devolve `temSenha`, e revelar é um
 * pedido próprio, por item, que fica registrado na auditoria. É o que separa
 * "a equipe tem acesso quando precisa" de "a senha de todo cliente está no
 * cache do navegador de quem abriu a tela por outro motivo".
 */
export function AcessosCliente({
  clientId,
  nomeDoCliente,
  podeEditar,
  onFechar,
}: {
  clientId: string
  nomeDoCliente: string
  podeEditar: boolean
  onFechar: () => void
}) {
  const { data, isLoading } = useAcessos(clientId)
  const [editando, setEditando] = useState<Acesso | 'novo' | null>(null)

  const acessos: Acesso[] = data?.acessos ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-12 w-full max-w-lg rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
        <header className="flex items-start justify-between gap-3 border-b border-ink-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink-900">Acessos</h2>
            <p className="mt-0.5 truncate text-[12.5px] text-ink-500">{nomeDoCliente}</p>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="text-ink-400" />
            </div>
          ) : editando ? (
            <Formulario
              clientId={clientId}
              acesso={editando === 'novo' ? null : editando}
              cofreDisponivel={data?.cofreDisponivel ?? false}
              onPronto={() => setEditando(null)}
            />
          ) : (
            <>
              {acessos.length === 0 ? (
                <p className="rounded-xl border border-dashed border-overlay/12 px-4 py-8 text-center text-[13px] text-ink-500">
                  Nenhum acesso cadastrado.
                </p>
              ) : (
                <ul className="space-y-2">
                  {acessos.map((a) => (
                    <Linha
                      key={a.id}
                      clientId={clientId}
                      acesso={a}
                      podeEditar={podeEditar}
                      onEditar={() => setEditando(a)}
                    />
                  ))}
                </ul>
              )}

              {podeEditar && (
                <button
                  onClick={() => setEditando('novo')}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 transition hover:text-brand-500"
                >
                  <Plus className="size-4" />
                  Adicionar acesso
                </button>
              )}

              {/* O aviso é curto e fica no rodapé porque a pessoa precisa saber
                  que a consulta é registrada — sem virar sermão a cada abertura. */}
              {acessos.length > 0 && (
                <p className="mt-4 border-t border-overlay/10 pt-3 text-[11.5px] leading-relaxed text-ink-400">
                  As senhas são guardadas cifradas. Cada vez que uma é revelada, fica
                  registrado quem viu e quando.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/** Uma conta: ícone, identificação e os botões de copiar e revelar. */
function Linha({
  clientId,
  acesso,
  podeEditar,
  onEditar,
}: {
  clientId: string
  acesso: Acesso
  podeEditar: boolean
  onEditar: () => void
}) {
  const meta = PLATAFORMAS[acesso.platform] ?? PLATAFORMAS.outro!
  const apagar = useApagarAcesso(clientId)
  const [senha, setSenha] = useState<string | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function revelar() {
    if (senha) {
      // Esconder é local: some da tela sem outra ida ao servidor.
      setSenha(null)
      return
    }
    setBuscando(true)
    setErro(null)
    try {
      const r = await api.post<{ password: string }>(
        `/clients/${clientId}/acessos/${acesso.id}/revelar`,
        {},
      )
      setSenha(r.password)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível abrir')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <li className="group rounded-xl bg-overlay/5 p-3 ring-1 ring-inset ring-overlay/8">
      <div className="flex items-start gap-3">
        <meta.Icone className={clsx('mt-0.5 size-5 shrink-0', meta.cor)} />

        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-medium text-ink-900">
            {meta.rotulo}
            {acesso.label && <span className="ml-1.5 text-ink-500">· {acesso.label}</span>}
          </p>

          {acesso.username && <Copiavel valor={acesso.username} />}
          {acesso.phone && <Copiavel valor={acesso.phone} />}
          {acesso.notes && (
            <p className="mt-1 text-[12px] leading-relaxed text-ink-400">{acesso.notes}</p>
          )}

          {senha && <Copiavel valor={senha} mono />}
          {erro && <p className="mt-1 text-[12px] text-red-300">{erro}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {acesso.temSenha && (
            <button
              onClick={revelar}
              disabled={buscando}
              title={senha ? 'Esconder a senha' : 'Revelar a senha'}
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900 disabled:opacity-50"
            >
              {buscando ? <Spinner /> : senha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}

          {podeEditar && (
            <>
              <button
                onClick={onEditar}
                title="Editar"
                className="rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-overlay/10 hover:text-ink-900 focus:opacity-100 group-hover:opacity-100"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => apagar.mutate(acesso.id)}
                disabled={apagar.isPending}
                title="Remover"
                className="rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-red-500/12 hover:text-red-300 focus:opacity-100 group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

/**
 * Um valor com botão de copiar.
 *
 * Copiar é o gesto real: ninguém digita uma senha lida na tela. Sem isto, a
 * pessoa selecionaria com o mouse e erraria o começo ou o fim.
 */
function Copiavel({ valor, mono }: { valor: string; mono?: boolean }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // Sem permissão de área de transferência: o valor continua na tela para
      // ser selecionado à mão. Melhor do que um erro que não ajuda em nada.
    }
  }

  return (
    <button
      onClick={copiar}
      title="Copiar"
      className="mt-0.5 flex w-full items-center gap-1.5 text-left"
    >
      <span
        className={clsx(
          'min-w-0 flex-1 truncate text-[12.5px] text-ink-600',
          mono && 'font-mono tracking-tight text-ink-800',
        )}
      >
        {valor}
      </span>
      {copiado ? (
        <Check className="size-3.5 shrink-0 text-emerald-400" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-ink-400" />
      )}
    </button>
  )
}

function Formulario({
  clientId,
  acesso,
  cofreDisponivel,
  onPronto,
}: {
  clientId: string
  acesso: Acesso | null
  cofreDisponivel: boolean
  onPronto: () => void
}) {
  const salvar = useSalvarAcesso(clientId)
  const [form, setForm] = useState({
    platform: acesso?.platform ?? 'instagram',
    label: acesso?.label ?? '',
    username: acesso?.username ?? '',
    password: '',
    phone: acesso?.phone ?? '',
    notes: acesso?.notes ?? '',
  })
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    try {
      await salvar.mutateAsync({
        id: acesso?.id,
        data: {
          platform: form.platform,
          label: form.label || null,
          username: form.username || null,
          phone: form.phone || null,
          notes: form.notes || null,
          /**
           * Na edição, campo vazio NÃO vai — omitir mantém a senha guardada.
           *
           * A tela nunca recebe a senha de volta, então o campo abre sempre
           * vazio: enviá-lo assim apagaria a senha de quem só queria corrigir
           * o @ da conta.
           */
          ...(form.password ? { password: form.password } : {}),
        },
      })
      onPronto()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-3">
      <Field label="Plataforma" required>
        <select
          className={inputClass}
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value })}
        >
          {PLATAFORMA_ACESSO.map((p) => (
            <option key={p} value={p}>
              {PLATAFORMAS[p]?.rotulo ?? p}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Identificação" hint="O @ ou o nome da conta, quando há mais de uma">
        <input
          className={inputClass}
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="@contadocliente"
        />
      </Field>

      <Field label="E-mail, ID ou usuário">
        <input
          className={inputClass}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </Field>

      {cofreDisponivel ? (
        <Field
          label="Senha"
          hint={acesso ? 'Deixe em branco para manter a senha atual' : 'Guardada cifrada'}
        >
          <input
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
      ) : (
        /* O campo some quando o cofre não está configurado, em vez de aceitar
           a digitação e recusar depois do clique em salvar. */
        <p className="rounded-lg bg-amber-400/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-200 ring-1 ring-inset ring-amber-300/20">
          O cofre de senhas não está configurado neste ambiente. Dá para guardar login e
          telefone; a senha, não.
        </p>
      )}

      <Field label="Telefone">
        <input
          className={inputClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </Field>

      <Field label="Observação">
        <input
          className={inputClass}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Autenticação em duas etapas no celular do cliente, por exemplo"
        />
      </Field>

      {erro && <p className="text-[13px] text-red-300">{erro}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onPronto}>
          Cancelar
        </Button>
        <Button type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? <Spinner /> : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
