'use client'

import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { Button } from '@/demos/kanban-cev/components/ui'

/**
 * Avisos no celular: ligar NESTE aparelho.
 *
 * É por aparelho, não por pessoa: o celular e o computador se inscrevem
 * separados, e cada um pede a permissão do navegador uma vez. Ligado, o
 * aviso chega com o app fechado — é o Web Push, e vale para qualquer site
 * instalado com os mesmos limites: no iPhone só com o app na tela inicial.
 */

type Estado =
  | 'verificando'
  | 'sem-suporte'
  | 'instalar'
  | 'negado'
  | 'sem-worker'
  | 'desligado'
  | 'ligado'

/** A chave pública VAPID vem em base64url; o navegador quer os bytes. */
function base64UrlParaBytes(s: string): ArrayBuffer {
  const pad = '='.repeat((4 - (s.length % 4)) % 4)
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes.buffer
}

function ehIphone() {
  return /iP(hone|ad|od)/.test(navigator.userAgent)
}

function instalado() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export function AvisosNoCelular() {
  const [estado, setEstado] = useState<Estado>('verificando')
  const [ocupado, setOcupado] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setEstado(ehIphone() && !instalado() ? 'instalar' : 'sem-suporte')
        return
      }
      if (Notification.permission === 'denied') return setEstado('negado')
      const reg = await navigator.serviceWorker.getRegistration()
      if (!vivo) return
      if (!reg) return setEstado('sem-worker')
      const sub = await reg.pushManager.getSubscription()
      if (vivo) setEstado(sub ? 'ligado' : 'desligado')
    })().catch(() => vivo && setEstado('sem-suporte'))
    return () => {
      vivo = false
    }
  }, [])

  async function ativar() {
    setOcupado(true)
    setErro(null)
    setMsg(null)
    try {
      const permissao = await Notification.requestPermission()
      if (permissao !== 'granted') {
        setEstado('negado')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const { publicKey } = await api.get<{ publicKey: string | null }>('/push/chave-publica')
      if (!publicKey) throw new Error('Os avisos no celular não estão configurados no servidor')
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlParaBytes(publicKey),
      })
      const json = sub.toJSON()
      await api.put('/push/inscricao', {
        endpoint: json.endpoint,
        keys: json.keys,
        userAgent: navigator.userAgent.slice(0, 300),
      })
      setEstado('ligado')
      setMsg('Ligado neste aparelho.')
    } catch (err) {
      setErro(err instanceof ApiError || err instanceof Error ? err.message : 'Não foi possível ligar')
    } finally {
      setOcupado(false)
    }
  }

  async function desativar() {
    setOcupado(true)
    setErro(null)
    setMsg(null)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()
        await api.post('/push/inscricao/remover', { endpoint })
      }
      setEstado('desligado')
    } catch (err) {
      setErro(err instanceof ApiError || err instanceof Error ? err.message : 'Não foi possível desligar')
    } finally {
      setOcupado(false)
    }
  }

  async function testar() {
    setOcupado(true)
    setErro(null)
    setMsg(null)
    try {
      await api.post('/push/teste')
      setMsg('Enviado. Deve chegar em alguns segundos, mesmo com o app fechado.')
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível enviar o teste')
    } finally {
      setOcupado(false)
    }
  }

  const texto: Record<Estado, string> = {
    verificando: 'Verificando este aparelho…',
    'sem-suporte': 'Este navegador não recebe avisos com o app fechado.',
    instalar:
      'No iPhone, os avisos só funcionam com o app na tela inicial: no Safari, toque em Compartilhar e em "Adicionar à Tela de Início", e ligue por lá.',
    negado:
      'A permissão de notificações está bloqueada neste navegador. Libere nas configurações do site e tente de novo.',
    'sem-worker': 'Disponível no app publicado, em acev.site.',
    desligado: 'Desligado neste aparelho.',
    ligado: 'Ligado neste aparelho.',
  }

  return (
    <div>
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-700"
          aria-hidden
        >
          <BellRing className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink-900">Avisos no celular</p>
          <p className="text-[11.5px] leading-snug text-ink-500">
            Chegam com o app fechado: peça para revisar ou ajustar, externa iniciada e encerrada, demanda nova,
            compromisso. É por aparelho: ligue no celular e, se quiser, no computador.
          </p>
        </div>
      </div>

      <p className="mt-2.5 text-[12.5px] text-ink-700">{texto[estado]}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {estado === 'desligado' && (
          <Button type="button" size="sm" onClick={ativar} disabled={ocupado}>
            Ligar neste aparelho
          </Button>
        )}
        {estado === 'ligado' && (
          <>
            <Button type="button" size="sm" onClick={testar} disabled={ocupado}>
              Enviar um teste
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={desativar} disabled={ocupado}>
              Desligar
            </Button>
          </>
        )}
      </div>
      {msg && <p className="mt-2 text-[12px] text-emerald-300">{msg}</p>}
      {erro && <p className="mt-2 text-[12px] text-red-300">{erro}</p>}
    </div>
  )
}
