'use client'

import Link from '@/demos/kanban-cev/lib/nav'
import { asset } from '@/demos/kanban-cev/lib/paths'
import { usePathname, useRouter } from '@/demos/kanban-cev/lib/nav'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Home,
  User,
  Search,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Repeat,
  KeyRound,
  X,
  Sun,
  Moon,
  Image as ImageIcon,
  Camera,
  Volume2,
} from 'lucide-react'
import { useMe, useNotifications, useChangeOwnPassword } from '@/demos/kanban-cev/lib/hooks'
import { api, qk, ApiError } from '@/demos/kanban-cev/lib/api'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import { FotoPerfil } from '@/demos/kanban-cev/components/foto-perfil'
import { SomDosAvisos } from '@/demos/kanban-cev/components/som-dos-avisos'
import { AvisosNoCelular } from '@/demos/kanban-cev/components/avisos-no-celular'
import { PopupAniversario } from '@/demos/kanban-cev/components/popup-aniversario'
import { AvisosDeRevisao } from '@/demos/kanban-cev/components/avisos-de-revisao'
import { Externas } from '@/demos/kanban-cev/components/externas'
import { Avatar, Button, Field, PasswordInput, Spinner } from '@/demos/kanban-cev/components/ui'
import { relativeTime } from '@/demos/kanban-cev/lib/format'
import { aplicarFavicon } from '@/demos/kanban-cev/lib/favicon'
import { salvarFundo } from '@/demos/kanban-cev/lib/fundo'
import { MeuFundo } from '@/demos/kanban-cev/components/meu-fundo'

interface NavItem {
  href: string
  label: string
  icon: typeof Home
  /** Some do menu de quem não tem a permissão. */
  permission?: string
}

/** Só entra aqui o que tem página: link que não leva a lugar nenhum é pior
 * do que não anunciar o recurso. */
const NAV: NavItem[] = [
  { href: '/inicio', label: 'Início', icon: Home },
  { href: '/eu', label: 'Eu', icon: User },
  /**
   * Sem `permission`: a tela encolhe em vez de recusar.
   *
   * Quem enxerga a agência inteira busca nela; quem não enxerga busca no que é
   * seu. Escondê-la de quem não tem `task:view_all` tiraria de todo mundo a
   * única tela que procura no que já foi concluído — e essa pergunta é de quem
   * executa tanto quanto de quem coordena.
   */
  { href: '/demandas', label: 'Buscar', icon: Search },
  { href: '/recorrencias', label: 'Recorrências', icon: Repeat },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/admin', label: 'Administração', icon: BarChart3, permission: 'task:view_all' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const qc = useQueryClient()
  const { data: me, isLoading } = useMe()
  const [bellOpen, setBellOpen] = useState(false)
  const [senhaAberta, setSenhaAberta] = useState(false)
  const [fotoAberta, setFotoAberta] = useState(false)
  const [fundoAberto, setFundoAberto] = useState(false)
  const [sonsAberto, setSonsAberto] = useState(false)
  const [contaAberta, setContaAberta] = useState(false)

  /**
   * Reconcilia o papel de parede com o que o servidor diz.
   *
   * O script do `layout.tsx` já pintou o fundo antes da primeira tinta, lendo
   * o espelho no `localStorage`. Este efeito corrige o espelho quando ele
   * discorda da sessão — que é o que acontece ao trocar o fundo em outro
   * aparelho, ou ao entrar com outra conta no mesmo navegador. Sem ele, a
   * segunda pessoa a usar aquele computador abriria o sistema com o fundo da
   * primeira, e nada na tela explicaria por quê.
   *
   * Antes dos `return` de carregamento de propósito: hook não pode ficar
   * atrás de saída antecipada.
   */
  useEffect(() => {
    if (!me) return
    salvarFundo(
      me.fundoUrl
        ? { url: me.fundoUrl, veu: me.fundoVeu, posX: me.fundoPosX, posY: me.fundoPosY }
        : null,
    )
  }, [me?.fundoUrl, me?.fundoVeu, me?.fundoPosX, me?.fundoPosY])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ink-400" />
      </div>
    )
  }

  if (!me) {
    router.replace('/login')
    return null
  }

  const visible = NAV.filter(
    (n) => !n.permission || me.isAdmin || me.permissions.includes(n.permission as never),
  )

  async function logout() {
    await api.post('/auth/logout')
    qc.clear()
    router.replace('/login')
  }

  return (
    /**
     * Altura travada na viewport, e não `min-h-screen`.
     *
     * Com `min-h-`, uma página comprida faz o container inteiro crescer: o
     * `overflow-auto` do <main> nunca chega a valer, quem rola é o documento,
     * e a barra lateral — que é filha flex — estica junto até o fim da página.
     * Fixando a altura, a rolagem acontece dentro do conteúdo e a lateral
     * fica parada.
     *
     * `dvh` em vez de `vh` por causa do mobile: com `vh`, a barra de endereço
     * do navegador entra na conta e sobra um pedaço cortado embaixo.
     *
     * O respiro do topo é a contrapartida do `black-translucent` declarado no
     * layout: a barra de status do iPhone fica transparente para o gradiente
     * aparecer por trás dela, e em troca o conteúdo passaria a começar atrás
     * do relógio. Aqui ele é empurrado para baixo do recorte. Mexer num sem o
     * outro quebra a tela.
     *
     * O padding entra na altura porque o box é `border-box`: `h-dvh` continua
     * valendo a tela inteira e quem encolhe é a área do conteúdo. Com
     * `content-box` isto estouraria a viewport e traria de volta a rolagem do
     * documento que o `h-dvh` existe para evitar.
     *
     * As laterais protegem o modo paisagem: deitado, o recorte come a borda
     * esquerda ou a direita, conforme o lado para o qual se virou o aparelho.
     */
    <div className="flex h-dvh overflow-hidden p-0 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] lg:gap-4 lg:p-4">
      {/**
       * Painel flutuante em vez de coluna colada na borda: o gradiente do body
       * aparece em volta, e é o que dá a profundidade do tema.
       */}
      <aside className="hidden w-60 shrink-0 flex-col overflow-hidden rounded-2xl bg-pine-900/70 ring-1 ring-inset ring-overlay/8 backdrop-blur-sm lg:flex">
        {/**
         * O SVG é o lockup inteiro — a águia, "TIME DE" sobre o filete branco
         * e "ÁGUIAS" grande, tudo no ouro da marca. Por isso não há texto ao
         * lado: repetir o nome escreveria "Time de Águias" duas vezes na mesma
         * linha.
         */}
        <div className="px-5 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("logo-time-de-aguias.svg")}
            alt="Time de Águias"
            className="h-auto w-[132px]"
            width={3195}
            height={2385}
          />
          <p className="mt-2.5 text-[11px] text-ink-500">Gestão da agência</p>
        </div>

        {/* Rola por dentro se um dia o menu passar da altura da tela. */}
        <nav className="thin-scroll flex-1 space-y-1 overflow-y-auto px-3">
          {visible.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] transition',
                  active
                    ? 'bg-overlay/8 font-semibold text-gold-300 ring-1 ring-inset ring-overlay/10'
                    : 'text-ink-600 hover:bg-overlay/5 hover:text-ink-900',
                )}
              >
                <Icon className="size-4.5" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            )
          })}
        </nav>


        <div className="p-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-overlay/5 px-3 py-2.5 ring-1 ring-inset ring-overlay/8">
            {/*
              * Clicar na própria foto abre a troca dela.
              *
              * Antes, o único caminho era a Administração — que colaborador
              * comum não acessa. A permissão sempre permitiu ("a própria
              * pessoa ou quem administra"); o que faltava era o lugar.
              */}
            <button
              onClick={() => setFotoAberta(true)}
              title="Trocar minha foto"
              className="shrink-0 rounded-full transition hover:opacity-80"
            >
              <Avatar name={me.name} url={me.avatarUrl} size={32} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink-900">
                {me.name.split(' ')[0]}
              </p>
              <p className="truncate text-[11px] text-ink-500">{me.role.displayName}</p>
            </div>
            <button
              onClick={() => setFundoAberto(true)}
              title="Trocar meu fundo"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
            >
              <ImageIcon className="size-4" />
            </button>
            <button
              onClick={() => setSonsAberto(true)}
              title="Avisos: som e celular"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
            >
              <Volume2 className="size-4" />
            </button>
            <button
              onClick={() => setSenhaAberta(true)}
              title="Trocar minha senha"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
            >
              <KeyRound className="size-4" />
            </button>
            <button
              onClick={logout}
              title="Sair"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-overlay/10 hover:text-ink-900"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <ChangePasswordModal open={senhaAberta} onClose={() => setSenhaAberta(false)} />

      {sonsAberto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
          <div className="animate-in mt-16 w-full max-w-md rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
            <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="text-sm font-semibold">Avisos</h2>
              <button
                onClick={() => setSonsAberto(false)}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4.5" />
              </button>
            </header>
            <div className="px-6 py-5">
              <SomDosAvisos userId={me.id} revisar={me.somRevisar} ajustar={me.somAjustar} />
              <div className="my-5 border-t border-ink-100" />
              <AvisosNoCelular />
            </div>
          </div>
        </div>
      )}

      {fundoAberto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
          <div className="animate-in mt-16 w-full max-w-md rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
            <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="text-sm font-semibold">Meu fundo</h2>
              <button
                onClick={() => setFundoAberto(false)}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4.5" />
              </button>
            </header>
            <div className="px-6 py-5">
              <MeuFundo
                userId={me.id}
                urlAtual={me.fundoUrl ?? null}
                veuAtual={me.fundoVeu ?? 60}
                posXAtual={me.fundoPosX ?? 50}
                posYAtual={me.fundoPosY ?? 50}
                onTrocou={() => qc.invalidateQueries({ queryKey: qk.me })}
              />
            </div>
          </div>
        </div>
      )}

      {fotoAberta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
          <div className="animate-in mt-16 w-full max-w-md rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
            <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="text-sm font-semibold">Minha foto</h2>
              <button
                onClick={() => setFotoAberta(false)}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4.5" />
              </button>
            </header>
            <div className="px-6 py-5">
              <FotoPerfil
                escopo="users"
                id={me.id}
                nome={me.name}
                urlAtual={me.avatarUrl ?? null}
                podeEditar
                size={96}
                /* `qk.me` para a barra lateral e todo lugar que mostra a
                   própria foto atualizarem sem recarregar a página. */
                onTrocou={() => qc.invalidateQueries({ queryKey: qk.me })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/**
         * O topo flutua sobre o conteúdo em vez de ocupar uma faixa própria:
         * é o que põe a data e o sino na mesma linha do título da página, sem
         * cada tela precisar saber que eles existem. `pointer-events-none` no
         * container evita que a faixa invisível engula cliques do conteúdo.
         */}
        {/**
         * Sem faixa de esmaecimento atrás: ela atravessava a largura inteira e
         * escurecia o título da página, que fica exatamente nesta altura. O
         * conteúdo que rola por baixo já é resolvido pelo `backdrop-blur` da
         * própria pílula e do sino, que é onde a sobreposição de fato acontece.
         */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-30 flex items-center justify-end px-5 py-5 lg:px-8">
          <div className="pointer-events-auto flex items-center gap-2">
            <DatePill />
            <BotaoTema />
            <NotificationBell open={bellOpen} onToggle={() => setBellOpen((v) => !v)} />
            {/**
             * Conta só no celular: no desktop o mesmo está no rodapé da
             * lateral. Antes daqui não havia como sair nem trocar a senha pelo
             * telefone — os dois botões viviam dentro do `<aside>`, que é
             * `hidden lg:flex`.
             */}
            <button
              onClick={() => setContaAberta(true)}
              aria-label="Sua conta"
              className="rounded-full ring-1 ring-overlay/10 ring-inset transition hover:ring-overlay/25 lg:hidden"
            >
              <Avatar name={me.name} url={me.avatarUrl} size={38} />
            </button>
          </div>
        </div>

        {/**
         * `pt-12` reserva a faixa que a data e o sino ocupam.
         *
         * Sem isso, toda página com ação no canto superior direito nasce com o
         * botão embaixo da pílula — foi o que aconteceu com o "Nova demanda" da
         * tela "Eu". Reservar aqui, e não em cada página, é o que impede a
         * próxima tela de repetir o erro.
         *
         * Quem quiser o título na mesma linha da pílula cancela com `-mt-12`,
         * como faz a Home — e aí precisa reservar o lado direito por conta.
         */}
        <main className="thin-scroll flex-1 overflow-y-auto pt-12">{children}</main>

        {/**
         * A barra de navegação é irmã do <main>, não `fixed` por cima dele.
         *
         * Sendo item do flex, ela ocupa altura própria e o `overflow-y-auto` do
         * conteúdo já para em cima dela. Se fosse flutuante, todo último item
         * de toda lista ficaria escondido atrás, e a correção seria um
         * `padding-bottom` que cada tela teria de lembrar de ter.
         */}
        <MobileTabBar items={visible} pathname={pathname} />
      </div>

      <MobileAccountSheet
        open={contaAberta}
        onClose={() => setContaAberta(false)}
        name={me.name}
        role={me.role.displayName}
        avatarUrl={me.avatarUrl}
        onFoto={() => {
          setContaAberta(false)
          setFotoAberta(true)
        }}
        onFundo={() => {
          setContaAberta(false)
          setFundoAberto(true)
        }}
        onSons={() => {
          setContaAberta(false)
          setSonsAberto(true)
        }}
        onChangePassword={() => {
          setContaAberta(false)
          setSenhaAberta(true)
        }}
        onLogout={logout}
      />

      {/*
        * No Shell, e não numa tela específica.
        *
        * A pessoa pode voltar de fim de semana e cair direto numa demanda pelo
        * link de uma notificação — o parabéns não pode depender de ela passar
        * pela Home. Aqui ele alcança qualquer página de dentro do sistema, e
        * ele mesmo decide se tem o que mostrar.
        */}
      <PopupAniversario />
      <AvisosDeRevisao />
      <Externas />
    </div>
  )
}

/**
 * Alterna claro e escuro.
 *
 * A fonte da verdade é o atributo `data-theme` no `<html>` — o mesmo que o
 * script do `layout.tsx` escreve antes da primeira pintura. O componente lê
 * dali na montagem em vez de guardar um estado próprio: dois donos para a
 * mesma informação dessincronizariam no primeiro carregamento.
 *
 * `null` até montar, para o servidor não desenhar um ícone e o navegador
 * trocar por outro.
 */
function BotaoTema() {
  const [tema, setTema] = useState<'dark' | 'light' | null>(null)

  useEffect(() => {
    setTema(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')
  }, [])

  function trocar() {
    const novo = tema === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', novo)
    // A aba faz parte do tema: sem isto o ícone só acertaria no próximo
    // carregamento, quando o script do `layout.tsx` lesse o storage.
    aplicarFavicon(novo)
    try {
      localStorage.setItem('acev-tema', novo)
    } catch {
      // Navegação privativa bloqueia o storage. A troca vale para esta aba;
      // perder a preferência é melhor que quebrar o botão.
    }
    setTema(novo)
  }

  if (!tema) return null

  return (
    <button
      onClick={trocar}
      className="rounded-full bg-overlay/6 p-2.5 text-ink-600 ring-1 ring-inset ring-overlay/10 backdrop-blur-sm transition hover:bg-overlay/12 hover:text-ink-900"
      aria-label={tema === 'light' ? 'Mudar para o tema escuro' : 'Mudar para o tema claro'}
      title={tema === 'light' ? 'Tema escuro' : 'Tema claro'}
    >
      {tema === 'light' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
    </button>
  )
}

/** "Qua, 6 de agosto". Renderizada no cliente para bater com o fuso de quem olha. */
function DatePill() {
  const [hoje, setHoje] = useState<string | null>(null)

  // Só depois da montagem: no servidor a data sairia no fuso da Vercel, e o
  // React acusaria divergência de hidratação na virada do dia.
  useEffect(() => {
    setHoje(
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
      }),
    )
  }, [])

  if (!hoje) return null

  return (
    <span className="hidden rounded-full bg-overlay/6 px-3.5 py-2 text-[12.5px] text-ink-600 ring-1 ring-inset ring-overlay/10 backdrop-blur-sm sm:inline-block">
      {hoje.replace('.,', ',').replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  )
}

/**
 * Troca de senha pelo próprio usuário — item 8 da lista de pendências.
 *
 * O backend derruba todas as sessões ao trocar, inclusive esta: por isso o
 * modal manda para o login em vez de fingir que continua tudo bem.
 */
function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const trocar = useChangeOwnPassword()
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  if (!open) return null

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (nova.length < 8) return setErro('A nova senha precisa de pelo menos 8 caracteres')
    if (nova !== confirma) return setErro('A confirmação não confere')

    try {
      await trocar.mutateAsync({ currentPassword: atual, newPassword: nova })
      router.replace('/login')
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível trocar a senha')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/70 p-4 backdrop-blur-[2px]">
      <div className="animate-in mt-16 w-full max-w-sm rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold">Trocar minha senha</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4" />
          </button>
        </header>

        <form onSubmit={enviar} className="space-y-3.5 px-5 py-4">
          <Field label="Senha atual" required>
            <PasswordInput
              autoFocus
              autoComplete="current-password"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
            />
          </Field>
          <Field label="Nova senha" required hint="Mínimo de 8 caracteres">
            <PasswordInput
              autoComplete="new-password"
              value={nova}
              onChange={(e) => setNova(e.target.value)}
            />
          </Field>
          <Field label="Repita a nova senha" required>
            <PasswordInput
              autoComplete="new-password"
              value={confirma}
              onChange={(e) => setConfirma(e.target.value)}
            />
          </Field>

          <p className="text-[11px] text-ink-500">
            Trocar a senha encerra todas as suas sessões, inclusive esta. Você vai precisar entrar
            de novo.
          </p>

          {erro && (
            <div className="rounded-lg bg-red-500/12 px-3 py-2 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={trocar.isPending}>
              {trocar.isPending && <Spinner />}
              Trocar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Navegação do celular, no rodapé.
 *
 * Antes era uma fileira de ícones no canto superior esquerdo, dentro da faixa
 * flutuante. Dois problemas com aquilo, e o primeiro era visível na tela:
 *
 *   - Disputava a linha com o título da página. A Home sobe a saudação para
 *     essa faixa e só reservava o lado direito, onde ficam a data e o sino;
 *     à esquerda o "Olá, Emanuel" passava por baixo dos ícones.
 *   - Ficava no canto mais distante do polegar. Num aparelho segurado com uma
 *     mão, o topo esquerdo é o ponto mais difícil de alcançar da tela.
 *
 * Embaixo resolve os dois, e é onde qualquer pessoa já procura a navegação de
 * um app instalado.
 */
function MobileTabBar({ items, pathname }: { items: typeof NAV; pathname: string }) {
  return (
    <nav
      // O respiro de baixo acompanha a barra de gestos do iPhone: sem ele, o
      // último rótulo fica atrás do risco horizontal do sistema.
      className="shrink-0 border-t border-overlay/8 bg-pine-900/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {/**
       * `pb-3` além da área segura: em aparelho Android com navegação por
       * gestos o `env(safe-area-inset-bottom)` costuma ser zero, e sem esta
       * folga os rótulos ficam colados na borda de baixo da tela.
       */}
      <div className="flex items-stretch justify-around px-1 pt-2 pb-3">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                // `min-w-0` com `flex-1`: com cinco itens, "Administração" e
                // "Recorrências" precisam poder encolher em vez de empurrar a
                // barra para além da largura da tela.
                'flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-1 transition',
                active ? 'text-gold-300' : 'text-ink-500 active:bg-overlay/5',
              )}
            >
              <Icon className="size-6.5 shrink-0" strokeWidth={active ? 2.1 : 1.7} />
              <span className="w-full truncate text-center text-[11px] leading-none font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * Painel da conta no celular, subindo de baixo.
 *
 * Existe porque sair e trocar a senha só existiam no rodapé da barra lateral,
 * que é `hidden lg:flex`: quem entrasse pelo telefone não tinha como fazer
 * nem um nem outro.
 */
function MobileAccountSheet({
  open,
  onClose,
  name,
  role,
  avatarUrl,
  onFoto,
  onFundo,
  onSons,
  onChangePassword,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  name: string
  role: string
  avatarUrl: string | null
  onFoto: () => void
  onFundo: () => void
  onSons: () => void
  onChangePassword: () => void
  onLogout: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-pine-950/70 backdrop-blur-[2px]"
      />

      <div className="animate-in relative rounded-t-2xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
          <Avatar name={name} url={avatarUrl} size={44} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{name}</p>
            <p className="truncate text-[12px] text-ink-500">{role}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/*
          * Foto e fundo também aqui, e não só na barra lateral.
          *
          * A lateral é `lg:` — no celular ela não existe, e este menu era o
          * único caminho para a conta. Sem estas duas linhas, quem usa o
          * sistema pelo telefone não tinha como trocar a própria foto nem o
          * fundo: o recurso existia e era inalcançável.
          */}
        <div className="p-2">
          <button
            onClick={onFoto}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-ink-800 transition active:bg-overlay/5"
          >
            <Camera className="size-4.5 text-ink-500" />
            Minha foto
          </button>
          <button
            onClick={onFundo}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-ink-800 transition active:bg-overlay/5"
          >
            <ImageIcon className="size-4.5 text-ink-500" />
            Meu fundo
          </button>
          <button
            onClick={onSons}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-ink-800 transition active:bg-overlay/5"
          >
            <Volume2 className="size-4.5 text-ink-500" />
            Avisos: som e celular
          </button>
          <button
            onClick={onChangePassword}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-ink-800 transition active:bg-overlay/5"
          >
            <KeyRound className="size-4.5 text-ink-500" />
            Trocar minha senha
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-red-300 transition active:bg-red-500/10"
          >
            <LogOut className="size-4.5" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}


function NotificationBell({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { data } = useNotifications()
  const qc = useQueryClient()
  const unread = data?.unreadCount ?? 0

  async function markAll() {
    await api.patch('/notifications/read-all')
    qc.invalidateQueries({ queryKey: qk.notifications })
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative rounded-full bg-overlay/6 p-2.5 text-ink-600 ring-1 ring-inset ring-overlay/10 backdrop-blur-sm transition hover:bg-overlay/12 hover:text-ink-900"
        aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}
      >
        <Bell className="size-4.5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-400 text-[10px] font-bold text-pine-950">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="animate-in absolute right-0 z-20 mt-2 w-88 overflow-hidden rounded-2xl bg-pine-800 shadow-2xl ring-1 ring-inset ring-overlay/10">
            <div className="flex items-center justify-between border-b border-ink-100 px-4 py-2.5">
              <span className="text-[13px] font-semibold">Notificações</span>
              {unread > 0 && (
                <button
                  onClick={markAll}
                  className="text-[12px] font-medium text-brand-600 hover:text-brand-700"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <div className="thin-scroll max-h-96 overflow-y-auto">
              {!data?.items.length && (
                <p className="px-4 py-8 text-center text-[13px] text-ink-400">
                  Nada por aqui ainda.
                </p>
              )}
              {data?.items.map((n) => (
                <NotificationRow key={n.id} n={n} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const NOTIFICATION_LABEL: Record<string, string> = {
  nova_demanda: 'atribuiu uma demanda a você',
  status_alterado: 'mudou o status de',
  demanda_concluida: 'concluiu',
  comentario: 'comentou em',
  mencao: 'mencionou você em',
  prazo_proximo: 'Prazo se aproximando:',
  demanda_atrasada: 'Demanda atrasada:',
  peca_para_revisar: 'concluiu uma peça em',
  peca_aprovada: 'aprovou a sua peça em',
  peca_reprovada: 'reprovou a sua peça em',
  externa_iniciada: 'iniciou a externa',
  externa_encerrada: 'encerrou a externa',
}

/**
 * Notificação sem ator é notificação do sistema: o job das 06:00, não uma
 * pessoa. Os rótulos acima são escritos para vir depois de um nome ("Carla
 * atribuiu uma demanda a você"), e sem o nome a frase fica sem sujeito.
 */
const NOTIFICATION_LABEL_SISTEMA: Record<string, string> = {
  nova_demanda: 'Demanda recorrente criada:',
  status_alterado: 'Status alterado:',
  demanda_concluida: 'Demanda concluída:',
}

function rotuloNotificacao(n: { type: string; actor: unknown }): string {
  if (!n.actor) {
    return NOTIFICATION_LABEL_SISTEMA[n.type] ?? NOTIFICATION_LABEL[n.type] ?? n.type
  }
  return NOTIFICATION_LABEL[n.type] ?? n.type
}

function NotificationRow({ n }: { n: any }) {
  const isDone = n.type === 'demanda_concluida'
  return (
    <Link
      href={
        n.taskId
          ? `/demandas/${n.taskId}${n.payload?.itemId ? `?peca=${n.payload.itemId}` : ''}`
          : '#'
      }
      className={clsx(
        'flex gap-3 border-b border-ink-50 px-4 py-3 transition last:border-0 hover:bg-ink-50',
        !n.readAt && 'bg-brand-50/40',
      )}
    >
      {n.actor ? (
        <Avatar name={n.actor.name} url={n.actor.avatarUrl} size={30} />
      ) : (
        <span className="inline-flex size-7.5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Bell className="size-3.5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-snug text-ink-800">
          {n.actor && <span className="font-medium">{n.actor.name} </span>}
          <span className={clsx(isDone && 'font-medium text-brand-700')}>
            {rotuloNotificacao(n)}
          </span>{' '}
          <span className="font-medium">{n.taskTitle ?? n.payload?.taskTitle ?? n.payload?.titulo}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-ink-400">{relativeTime(n.createdAt)}</p>
      </div>
    </Link>
  )
}
