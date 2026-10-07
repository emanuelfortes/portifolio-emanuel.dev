'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Timer, X } from 'lucide-react'
import clsx from 'clsx'
import { EVENT_TYPE } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { formatarCronometro } from '@/demos/kanban-cev/lib/duracao'
import {
  useEncerrarExterna,
  useEquipeExterna,
  useExternasAgora,
  useIniciarExterna,
  useTeam,
  type ExternaAgora,
  type TeamMember,
} from '@/demos/kanban-cev/lib/hooks'
import { Avatar, Button, inputClass } from '@/demos/kanban-cev/components/ui'

/**
 * O cronômetro da externa, presente em todas as telas.
 *
 * Na hora do compromisso sobe um cartão para quem vai: confirma quem foi de
 * fato (a equipe pode mudar na hora: quem não pôde ir sai, quem foi no lugar
 * entra) e inicia. Qualquer um da equipe basta. A partir daí todos os que vão
 * veem o tempo correr num chip fixo, com o Encerrar.
 *
 * O tempo é calculado da hora gravada no servidor, não de um contador local:
 * fechar o app não para nada, e cada aparelho mostra o mesmo tempo. A
 * consulta é a cada 30s, o bastante para quem não confirmou ver o cronômetro
 * de quem confirmou sem recarregar.
 */

const ROTULO: Record<string, string> = {
  [EVENT_TYPE.CAPTACAO]: 'Captação de vídeo',
  [EVENT_TYPE.ASSESSORIA_IMPRENSA]: 'Assessoria de imprensa',
  [EVENT_TYPE.EVENTO]: 'Evento',
}

/** "Agora não" esconde o cartão por meia hora. A externa continua lá. */
const DISPENSA_MS = 30 * 60_000

function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/** `HH:mm` local de agora, para o campo "começou às". */
function agoraHHmm() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Hoje às HH:mm, em ISO. Se cair no futuro (virada de dia), é ontem. */
function hojeAs(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h ?? 0, m ?? 0, 0, 0)
  if (d.getTime() > Date.now() + 60_000) d.setDate(d.getDate() - 1)
  return d.toISOString()
}

export function Externas() {
  const { data } = useExternasAgora()
  const [dispensadas, setDispensadas] = useState<Record<string, number>>({})

  const emAndamento = data?.emAndamento ?? []
  const paraConfirmar = (data?.paraConfirmar ?? []).filter(
    (e) => !(dispensadas[e.id] && dispensadas[e.id]! > Date.now()),
  )

  if (!emAndamento.length && !paraConfirmar.length) return null

  return (
    <div
      /* Canto de baixo à esquerda, ao lado da barra lateral no desktop e
         acima da barra de navegação no celular. O canto direito é dos avisos
         de revisão. */
      className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-[4.75rem] z-40 flex flex-col gap-2 lg:bottom-6 lg:left-[17.5rem] lg:right-auto lg:w-[min(24rem,calc(100vw-2rem))]"
      aria-live="polite"
    >
      <style>{`
        @keyframes externa-pulsa { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }
        .externa-pulsa { animation: externa-pulsa 1.6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .externa-pulsa { animation: none } }
      `}</style>
      {emAndamento.map((e) => (
        <ChipExterna key={e.id} externa={e} />
      ))}
      {paraConfirmar.slice(0, 1).map((e) => (
        <CartaoConfirmar
          key={e.id}
          externa={e}
          onDispensar={() => setDispensadas((d) => ({ ...d, [e.id]: Date.now() + DISPENSA_MS }))}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ confirmar */

function CartaoConfirmar({ externa, onDispensar }: { externa: ExternaAgora; onDispensar: () => void }) {
  const { data: equipe } = useTeam(false)
  const iniciar = useIniciarExterna()
  const [ids, setIds] = useState<string[]>(() => externa.attendees.map((a) => a.id))
  const [inicio, setInicio] = useState(agoraHHmm)
  const [erro, setErro] = useState<string | null>(null)
  const atrasado = Date.now() > new Date(externa.startAt).getTime() + 5 * 60_000

  async function confirmar() {
    setErro(null)
    if (!ids.length) return setErro('Marque quem foi')
    try {
      await iniciar.mutateAsync({ id: externa.id, attendeeIds: ids, startedAt: hojeAs(inicio) })
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível iniciar')
    }
  }

  return (
    <div className="rounded-2xl border border-brand-600/60 bg-surface p-3.5 shadow-2xl">
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-700"
          aria-hidden
        >
          <Timer className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-ink-500">
            {ROTULO[externa.eventType] ?? 'Externa'} · {horaCurta(externa.startAt)}–{horaCurta(externa.endAt)}
            {externa.location ? <> · {externa.location}</> : null}
          </p>
          <p className="text-[13.5px] font-semibold text-ink-900">{externa.title}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-600">
            {atrasado
              ? 'Já começou? Confirme quem foi e inicie o cronômetro.'
              : 'Está na hora. Confirme quem vai e inicie o cronômetro.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onDispensar}
          aria-label="Agora não"
          title="Agora não. Volto a perguntar em meia hora"
          className="rounded p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-2.5 text-[11.5px] font-medium text-ink-500">Quem foi</p>
      <SeletorDeEquipe equipe={equipe} ids={ids} onChange={setIds} />

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[12px] text-ink-500">
          Começou às
          <input
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className={clsx(inputClass, 'w-auto py-1')}
          />
        </label>
        <span className="flex-1" />
        <Button type="button" size="sm" onClick={confirmar} disabled={iniciar.isPending}>
          Iniciar externa
        </Button>
      </div>
      {erro && <p className="mt-2 text-[12px] text-red-300">{erro}</p>}
    </div>
  )
}

/* ----------------------------------------------------------- em andamento */

function ChipExterna({ externa }: { externa: ExternaAgora }) {
  const encerrar = useEncerrarExterna()
  const [aberto, setAberto] = useState(false)
  const [confirmandoFim, setConfirmandoFim] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [agora, setAgora] = useState(() => Date.now())

  // O tique de um segundo, só enquanto o chip existe.
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const decorrido = Math.max(0, agora - new Date(externa.startedAt ?? externa.startAt).getTime())

  async function encerrarAgora() {
    setErro(null)
    try {
      await encerrar.mutateAsync({ id: externa.id })
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível encerrar')
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/40 bg-surface shadow-2xl">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left"
        aria-expanded={aberto}
      >
        <span className="externa-pulsa size-2.5 shrink-0 rounded-full bg-red-500" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11.5px] text-ink-500">
            {ROTULO[externa.eventType] ?? 'Externa'} · em andamento
          </span>
          <span className="block truncate text-[13.5px] font-semibold text-ink-900">{externa.title}</span>
        </span>
        <span className="font-mono text-[18px] font-semibold tabular-nums text-ink-900">
          {formatarCronometro(decorrido)}
        </span>
        {aberto ? (
          <ChevronDown className="size-4 shrink-0 text-ink-400" />
        ) : (
          <ChevronUp className="size-4 shrink-0 text-ink-400" />
        )}
      </button>

      {aberto && (
        <div className="border-t border-ink-100 px-3.5 py-3">
          <p className="text-[12px] text-ink-500">
            Começou às {horaCurta(externa.startedAt ?? externa.startAt)}
            {externa.startedBy ? <> · confirmado por {externa.startedBy.name.split(' ')[0]}</> : null}
            {externa.location ? <> · {externa.location}</> : null}
          </p>
          <EquipeDaExterna externa={externa} />
          {erro && <p className="mt-2 text-[12px] text-red-300">{erro}</p>}
          <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
            {confirmandoFim ? (
              <>
                <span className="text-[12.5px] text-ink-600">Encerrar com {formatarCronometro(decorrido)}?</span>
                <Button type="button" size="sm" variant="outline" onClick={() => setConfirmandoFim(false)}>
                  Ainda não
                </Button>
                <Button type="button" size="sm" onClick={encerrarAgora} disabled={encerrar.isPending}>
                  Encerrar
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" onClick={() => setConfirmandoFim(true)}>
                Encerrar externa
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Quem foi, com a correção na hora: quem não pôde ir sai, quem foi no lugar entra. */
function EquipeDaExterna({ externa }: { externa: ExternaAgora }) {
  const { data: equipe } = useTeam(false)
  const salvar = useEquipeExterna()
  const [editando, setEditando] = useState(false)
  const [ids, setIds] = useState<string[]>([])
  const [erro, setErro] = useState<string | null>(null)

  function comecar() {
    setIds(externa.attendees.map((a) => a.id))
    setErro(null)
    setEditando(true)
  }

  async function gravar() {
    if (!ids.length) return setErro('Alguém precisa ficar')
    try {
      await salvar.mutateAsync({ id: externa.id, attendeeIds: ids })
      setEditando(false)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  if (!editando) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {externa.attendees.map((a) => (
          <span
            key={a.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-overlay/6 py-0.5 pr-2.5 pl-0.5 text-[12px] text-ink-800"
          >
            <Avatar name={a.name} url={a.avatarUrl} size={20} />
            {a.name.split(' ')[0]}
          </span>
        ))}
        <button type="button" onClick={comecar} className="text-[12px] text-brand-700 hover:underline">
          corrigir quem foi
        </button>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <SeletorDeEquipe equipe={equipe} ids={ids} onChange={setIds} />
      {erro && <p className="mt-1.5 text-[12px] text-red-300">{erro}</p>}
      <div className="mt-2 flex items-center gap-2">
        <Button type="button" size="sm" onClick={gravar} disabled={salvar.isPending}>
          Salvar quem foi
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setEditando(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

/**
 * A equipe inteira como chips: marcados são quem vai. Quem já estava marcado
 * quando o seletor abriu vem primeiro, para a equipe indicada aparecer
 * inteira sem rolar; a ordem não muda enquanto a pessoa clica.
 */
function SeletorDeEquipe({
  equipe,
  ids,
  onChange,
}: {
  equipe: TeamMember[] | undefined
  ids: string[]
  onChange: (ids: string[]) => void
}) {
  const [iniciais] = useState(() => new Set(ids))
  const ordenada = useMemo(
    () =>
      [...(equipe ?? [])].sort(
        (a, b) =>
          Number(iniciais.has(b.id)) - Number(iniciais.has(a.id)) || a.name.localeCompare(b.name, 'pt-BR'),
      ),
    [equipe, iniciais],
  )

  return (
    <div className="thin-scroll mt-1 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
      {ordenada.map((u) => {
        const marcado = ids.includes(u.id)
        return (
          <button
            key={u.id}
            type="button"
            onClick={() => onChange(marcado ? ids.filter((x) => x !== u.id) : [...ids, u.id])}
            aria-pressed={marcado}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-0.5 text-[12px] ring-1 ring-inset transition',
              marcado
                ? 'bg-brand-600/20 text-ink-900 ring-brand-600/50'
                : 'bg-overlay/5 text-ink-500 ring-overlay/10 hover:text-ink-800',
            )}
          >
            <Avatar name={u.name} url={u.avatarUrl} size={20} />
            {u.name.split(' ')[0]}
          </button>
        )
      })}
    </div>
  )
}
