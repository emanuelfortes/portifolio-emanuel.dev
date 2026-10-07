'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import { Check, Eye, TriangleAlert, X } from 'lucide-react'
import clsx from 'clsx'
import { NOTIFICATION_TYPE } from '@/demos/kanban-cev/shared'
import { api, qk } from '@/demos/kanban-cev/lib/api'
import { useMe, useNotifications } from '@/demos/kanban-cev/lib/hooks'
import { tocarSom } from '@/demos/kanban-cev/lib/sons'
import { Avatar, Button } from '@/demos/kanban-cev/components/ui'

/**
 * Os avisos de revisão das peças, no canto da tela, brilhando.
 *
 * O sino guarda tudo; isto aqui é só o que pede ação AGORA: "revise" para
 * quem coordena, "aprovada" ou "reprovada" para quem fez. Cada cartão é uma
 * notificação não lida desses três tipos. Marcar como lida — abrindo a peça,
 * ou a API quando a peça é revisada ou a demanda concluída — é o que faz o
 * cartão sumir de vez, em todo aparelho da pessoa.
 *
 * O "revise" e o "ajuste" não se descartam: o X só RECOLHE os cartões num
 * círculo com a contagem, e de tempos em tempos sai um balão citando a peça,
 * que aparece e some sozinho. É o lembrete de que há algo pendente sem o
 * cartão ocupar a tela o dia inteiro. Um aviso novo reabre os cartões.
 *
 * A cor diz de quem é a vez: DOURADO para quem coordena revisar, VERMELHO
 * para quem fez ajustar — reprovada é a peça que voltou, e vermelho é o que
 * faz a pessoa não deixar para depois. Havendo os dois, o vermelho ganha o
 * círculo: o ajuste é trabalho da própria pessoa. O "ajuste" some sozinho
 * quando a peça é reenviada; a aprovada, que é só notícia boa, o X descarta.
 *
 * Reaproveita o polling do sino: nenhuma consulta a mais.
 */

const TIPOS = new Set<string>([
  NOTIFICATION_TYPE.PECA_PARA_REVISAR,
  NOTIFICATION_TYPE.PECA_APROVADA,
  NOTIFICATION_TYPE.PECA_REPROVADA,
])

/** Quantos cartões de uma vez. O resto fica no sino, que já sabe contar. */
const MAXIMO = 3
/** De quanto em quanto tempo o balão lembra, com os cartões recolhidos. */
const INTERVALO_LEMBRETE = 45_000
/** O primeiro balão vem logo depois de recolher: é o que diz "eu continuo aqui". */
const PRIMEIRO_LEMBRETE = 3_000
/** Quanto tempo o balão fica antes de sumir. */
const DURACAO_BALAO = 6_000
/** Por aba: recolher numa aba não recolhe na outra, e recarregar reabre. */
const CHAVE_RECOLHIDO = 'acev:avisos:recolhido'

interface Aviso {
  id: string
  type: string
  taskId: string | null
  taskTitle: string | null
  actor: { name: string; avatarUrl: string | null } | null
  payload: { itemId?: string; itemTitle?: string; note?: string | null }
  readAt: string | null
  createdAt: string
}

function lerRecolhido(): string | null {
  try {
    return sessionStorage.getItem(CHAVE_RECOLHIDO)
  } catch {
    return null
  }
}

function gravarRecolhido(valor: string | null) {
  try {
    if (valor === null) sessionStorage.removeItem(CHAVE_RECOLHIDO)
    else sessionStorage.setItem(CHAVE_RECOLHIDO, valor)
  } catch {}
}

export function AvisosDeRevisao() {
  const { data } = useNotifications()
  const { data: me } = useMe()
  const qc = useQueryClient()
  const router = useRouter()
  const [ocupado, setOcupado] = useState<string | null>(null)
  /**
   * Recolhido guarda o `createdAt` do "revise" mais novo no momento do X.
   * Chegou um mais novo que isso, reabre: é pedido novo, não o que a pessoa
   * já viu e escolheu deixar para depois.
   */
  const [recolhidoAte, setRecolhidoAte] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : lerRecolhido(),
  )
  const [balao, setBalao] = useState<Aviso | null>(null)
  const proximoBalao = useRef(0)
  /**
   * No celular os cartões começam RECOLHIDOS: três cartões cobrem metade da
   * tela em cima do que a pessoa abriu. Fica o círculo com a contagem e o
   * balão de tempos em tempos; tocar no círculo abre os cartões, o X recolhe.
   * No computador continua como antes: o cartão aparece na hora.
   */
  const [celular, setCelular] = useState(false)
  const [abertoNoCelular, setAbertoNoCelular] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const ler = () => setCelular(mq.matches)
    ler()
    mq.addEventListener('change', ler)
    return () => mq.removeEventListener('change', ler)
  }, [])

  const avisos = ((data?.items ?? []) as Aviso[]).filter((n) => !n.readAt && TIPOS.has(n.type))
  const paraRevisar = avisos.filter((n) => n.type === NOTIFICATION_TYPE.PECA_PARA_REVISAR)
  const paraAjustar = avisos.filter((n) => n.type === NOTIFICATION_TYPE.PECA_REPROVADA)
  /** O que pede ação e por isso recolhe em vez de descartar: revisar e ajustar. */
  const pendentes = [...paraAjustar, ...paraRevisar]
  const maisNovo = pendentes.reduce<string | null>(
    (m, n) => (m === null || n.createdAt > m ? n.createdAt : m),
    null,
  )
  const recolhido = celular
    ? !abertoNoCelular
    : recolhidoAte !== null && (maisNovo === null || maisNovo <= recolhidoAte)

  // Sem nada pendente, o estado de recolhido não tem mais o que guardar.
  useEffect(() => {
    if (!avisos.length && recolhidoAte !== null) {
      setRecolhidoAte(null)
      gravarRecolhido(null)
    }
  }, [avisos.length, recolhidoAte])

  /**
   * O balão, com os cartões recolhidos: um lembrete curto de tempos em
   * tempos, rodando entre as peças que esperam revisão. Nunca fica: aparece,
   * dura alguns segundos e some.
   */
  useEffect(() => {
    if (!recolhido || !pendentes.length) {
      setBalao(null)
      return
    }
    let some: ReturnType<typeof setTimeout> | undefined
    const mostrar = () => {
      const alvo = pendentes[proximoBalao.current % pendentes.length] ?? null
      proximoBalao.current += 1
      setBalao(alvo)
      some = setTimeout(() => setBalao(null), DURACAO_BALAO)
    }
    const primeiro = setTimeout(mostrar, PRIMEIRO_LEMBRETE)
    const ciclo = setInterval(mostrar, INTERVALO_LEMBRETE)
    return () => {
      clearTimeout(primeiro)
      clearInterval(ciclo)
      if (some) clearTimeout(some)
    }
    // A lista muda de identidade a cada polling; o que importa é o tamanho.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recolhido, pendentes.length])

  /**
   * O som, para o que CHEGA com a tela aberta.
   *
   * A primeira leitura só anota o que já estava lá: tocar nessa hora faria
   * cada navegação repetir o som de um aviso que a pessoa já viu brilhando.
   * Daí em diante, aviso novo que pede ação toca o som que ela escolheu; o
   * de ajuste ganha, pelo mesmo motivo do círculo. Aba em segundo plano não
   * consulta, então o som vem quando ela volta para cá.
   */
  const anotados = useRef<Set<string> | null>(null)
  useEffect(() => {
    if (!data) return
    if (anotados.current === null) {
      anotados.current = new Set(avisos.map((n) => n.id))
      return
    }
    const novos = avisos.filter((n) => !anotados.current!.has(n.id))
    for (const n of novos) anotados.current.add(n.id)
    if (novos.some((n) => n.type === NOTIFICATION_TYPE.PECA_REPROVADA)) tocarSom(me?.somAjustar)
    else if (novos.some((n) => n.type === NOTIFICATION_TYPE.PECA_PARA_REVISAR)) tocarSom(me?.somRevisar)
    // `avisos` nasce a cada render; o que muda de verdade é `data`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!avisos.length) return null

  async function marcarLida(id: string) {
    await api.patch(`/notifications/${id}/read`)
    qc.invalidateQueries({ queryKey: qk.notifications })
  }

  async function abrir(n: Aviso) {
    setOcupado(n.id)
    try {
      await marcarLida(n.id)
    } finally {
      setOcupado(null)
    }
    if (n.taskId) {
      router.push(`/demandas/${n.taskId}${n.payload.itemId ? `?peca=${n.payload.itemId}` : ''}`)
    }
  }

  function recolher() {
    setAbertoNoCelular(false)
    const marca = maisNovo ?? new Date().toISOString()
    setRecolhidoAte(marca)
    gravarRecolhido(marca)
  }

  function reabrir() {
    setAbertoNoCelular(true)
    setRecolhidoAte(null)
    gravarRecolhido(null)
    setBalao(null)
  }

  const posicao =
    /* Mesmo canto do presente de aniversário, e pelo mesmo motivo: acima da
       barra de navegação do celular, no rodapé do desktop. */
    /* Abaixo dos modais (z-50) de propósito: com um formulário aberto, o
       aviso não pode ficar em cima do botão de salvar. */
    'fixed right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 lg:bottom-6'

  const estilos = (
    <style>{`
      /* O brilho: um anel dourado que nasce colado e se abre sumindo. É o
         que faz o cartão ser notado sem gritar. */
      @keyframes aviso-brilho {
        0%   { box-shadow: 0 0 0 0 rgb(247 216 140 / .6) }
        70%  { box-shadow: 0 0 0 14px rgb(247 216 140 / 0) }
        100% { box-shadow: 0 0 0 14px rgb(247 216 140 / 0) }
      }
      .aviso-brilha { animation: aviso-brilho 2.4s ease-out infinite }
      /* O mesmo anel em vermelho: é a peça que voltou para quem fez. */
      @keyframes aviso-brilho-vermelho {
        0%   { box-shadow: 0 0 0 0 rgb(239 68 68 / .65) }
        70%  { box-shadow: 0 0 0 14px rgb(239 68 68 / 0) }
        100% { box-shadow: 0 0 0 14px rgb(239 68 68 / 0) }
      }
      .aviso-brilha-vermelho { animation: aviso-brilho-vermelho 2.4s ease-out infinite }
      /* O balão entra deslizando do círculo, fica, e sai do mesmo jeito. */
      @keyframes balao-passa {
        0%   { opacity: 0; transform: translateX(8px) }
        12%  { opacity: 1; transform: translateX(0) }
        85%  { opacity: 1; transform: translateX(0) }
        100% { opacity: 0; transform: translateX(8px) }
      }
      .balao { animation: balao-passa ${DURACAO_BALAO}ms ease-in-out forwards }
      @media (prefers-reduced-motion: reduce) {
        .aviso-brilha, .aviso-brilha-vermelho { animation: none }
        .balao { animation: none; opacity: 1 }
      }
    `}</style>
  )

  if (recolhido) {
    const balaoDeAjuste = balao?.type === NOTIFICATION_TYPE.PECA_REPROVADA
    // Vermelho ganha: ajustar é trabalho da própria pessoa; revisar, dos outros.
    const vermelho = paraAjustar.length > 0
    return (
      <div className={clsx(posicao, 'flex items-center gap-3')} aria-live="polite">
        {estilos}
        {balao && (
          <button
            type="button"
            onClick={() => abrir(balao)}
            className={clsx(
              'balao max-w-[min(20rem,calc(100vw-7rem))] rounded-2xl border bg-surface px-3.5 py-2.5 text-left text-[12.5px] leading-snug text-ink-900 shadow-2xl',
              balaoDeAjuste ? 'border-red-500/60' : 'border-brand-600/50',
            )}
          >
            <span className="font-semibold">{balao.payload.itemTitle ?? 'Uma peça'}</span>
            {balao.taskTitle ? <> em {balao.taskTitle}</> : null}
            {balaoDeAjuste ? (
              <>
                {' '}
                <span className="font-semibold text-red-300">voltou para ajuste.</span>
                {balao.payload.note && (
                  <span className="mt-0.5 line-clamp-2 block text-red-200/90">“{balao.payload.note}”</span>
                )}
              </>
            ) : (
              <> espera a sua revisão.</>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={reabrir}
          aria-label={`${avisos.length} aviso${avisos.length > 1 ? 's' : ''}: ${
            vermelho ? 'peça para ajustar' : 'peça para revisar'
          }. Abrir`}
          title={vermelho ? 'Peça para ajustar' : 'Avisos de revisão'}
          className={clsx(
            'relative flex size-12 shrink-0 items-center justify-center rounded-full shadow-2xl transition hover:scale-[1.06]',
            vermelho
              ? 'aviso-brilha-vermelho bg-red-500 text-white'
              : paraRevisar.length
                ? 'aviso-brilha bg-brand-600 text-pine-950'
                : 'bg-pine-800 text-ink-700 ring-1 ring-inset ring-overlay/10',
          )}
        >
          <Eye className="size-5" />
          <span
            className={clsx(
              'absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums',
              vermelho
                ? 'bg-white text-red-600'
                : paraRevisar.length
                  ? 'bg-red-500 text-white'
                  : 'bg-ink-300 text-pine-950',
            )}
          >
            {avisos.length > 9 ? '9+' : avisos.length}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={clsx(posicao, 'flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2')} aria-live="polite">
      {estilos}

      {avisos.slice(0, MAXIMO).map((n) => {
        const revisar = n.type === NOTIFICATION_TYPE.PECA_PARA_REVISAR
        const aprovada = n.type === NOTIFICATION_TYPE.PECA_APROVADA
        const reprovada = n.type === NOTIFICATION_TYPE.PECA_REPROVADA
        const quem = n.actor?.name?.split(' ')[0] ?? 'Alguém'
        const peca = n.payload.itemTitle ?? 'uma peça'
        const cronograma = n.taskTitle ?? ''
        return (
          <div
            key={n.id}
            className={clsx(
              'rounded-2xl border bg-surface p-3.5 shadow-2xl',
              revisar && 'aviso-brilha border-brand-600/60',
              aprovada && 'aviso-brilha border-emerald-500/60',
              reprovada && 'aviso-brilha-vermelho border-red-500/60',
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={clsx(
                  'mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full',
                  revisar && 'bg-brand-600/20 text-brand-700',
                  aprovada && 'bg-emerald-500/20 text-emerald-300',
                  reprovada && 'bg-red-500/20 text-red-300',
                )}
                aria-hidden
              >
                {revisar ? <Eye className="size-4" /> : aprovada ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-ink-900">
                  {revisar && (
                    <>
                      <span className="font-semibold">{quem}</span> concluiu <span className="font-semibold">{peca}</span>
                      {cronograma ? <> em {cronograma}</> : null}. <span className="font-semibold text-brand-700">Revise.</span>
                    </>
                  )}
                  {aprovada && (
                    <>
                      <span className="font-semibold">{quem}</span> aprovou <span className="font-semibold">{peca}</span>. Passou.
                    </>
                  )}
                  {reprovada && (
                    <>
                      <span className="font-semibold">{quem}</span> reprovou <span className="font-semibold">{peca}</span>.
                      {n.payload.note && <span className="mt-1 block text-red-200/90">“{n.payload.note}”</span>}
                      <span className="mt-1 block font-semibold text-red-200">Ajuste e envie de novo.</span>
                    </>
                  )}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button type="button" size="sm" onClick={() => abrir(n)} disabled={ocupado === n.id}>
                    Abrir a peça
                  </Button>
                  {n.actor && <Avatar name={n.actor.name} url={n.actor.avatarUrl} size={22} />}
                </div>
              </div>
              {/* "Revise" e "ajuste" recolhem; a aprovada, que é só notícia, descarta. */}
              <button
                type="button"
                onClick={() => (aprovada ? marcarLida(n.id) : recolher())}
                aria-label={
                  aprovada
                    ? 'Dispensar este aviso'
                    : revisar
                      ? 'Recolher os avisos; a revisão continua pendente'
                      : 'Recolher os avisos; o ajuste continua pendente'
                }
                title={aprovada ? 'Dispensar' : 'Recolher. Fica um lembrete no canto'}
                className="rounded p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )
      })}

      {avisos.length > MAXIMO && (
        <p className="text-right text-[11.5px] text-ink-400">e mais {avisos.length - MAXIMO} no sino</p>
      )}
    </div>
  )
}
