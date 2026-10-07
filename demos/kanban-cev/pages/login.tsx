'use client'

import { useState } from 'react'
import { useRouter } from '@/demos/kanban-cev/lib/nav'
import { asset } from '@/demos/kanban-cev/lib/paths'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { Button, Field, inputClass, PasswordInput, Spinner } from '@/demos/kanban-cev/components/ui'
import { MascoteLogin } from '@/demos/kanban-cev/components/mascote-login'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /* ---------------------------------------------------- estado do mascote */
  const [naSenha, setNaSenha] = useState(false)
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [errou, setErrou] = useState(false)

  /**
   * O olhar acompanha o e-mail pelo comprimento, não pela posição do cursor.
   *
   * A posição real exigiria medir o texto em pixels a cada tecla; o
   * comprimento dá o mesmo efeito — o olhar corre da esquerda para a direita
   * conforme se escreve — por uma conta que não custa nada. O teto de 28 é
   * onde um e-mail típico termina.
   */
  const progressoEmail = naSenha ? 0 : Math.min(email.length / 28, 1)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/auth/login', { email, password })
      router.replace('/inicio')
      router.refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar')
      setLoading(false)
      // A negativa com a cabeça dura o tempo da animação e se desarma sozinha,
      // senão ela só rodaria uma vez por carregamento de página.
      setErrou(true)
      setTimeout(() => setErrou(false), 500)
    }
  }

  return (
    // O respiro de área segura é por conta desta tela: ela não passa pelo
    // Shell, que é onde o resto do app trata isso. Com `viewport-fit=cover` e
    // a barra de status translúcida, sem ele a logo nasceria atrás do relógio.
    <main className="grid min-h-dvh pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("logo-time-de-aguias.svg")}
              alt="Time de Águias"
              className="mb-7 h-auto w-[168px]"
              width={3195}
              height={2385}
            />
            {/*
              * No celular ele vive aqui, porque o painel escuro só existe a
              * partir de `lg`. São duas instâncias do mesmo componente, uma
              * escondida por CSS — o custo é um ouvinte de ponteiro a mais, e
              * decidir qual montar em JavaScript daria divergência de
              * hidratação entre servidor e navegador.
              */}
            <div className="mb-5 flex justify-center lg:hidden">
              <MascoteLogin
                progressoEmail={progressoEmail}
                escondendo={naSenha}
                espiando={senhaVisivel}
                ocupado={loading}
                errou={errou}
                className="w-[132px]"
              />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Entrar</h1>
            <p className="mt-1.5 text-sm text-ink-500">
              Plataforma interna de gestão de demandas.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="E-mail" required>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                className={inputClass}
                placeholder="voce@acev.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Senha" required>
              <PasswordInput
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setNaSenha(true)}
                onBlur={() => setNaSenha(false)}
                onVisibilidade={setSenhaVisivel}
              />
            </Field>

            {error && (
              <div className="rounded-lg bg-red-500/12 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-inset ring-red-400/25">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-8 text-xs text-ink-400">
            Acesso restrito à equipe. Esqueceu a senha? Fale com a coordenação.
          </p>
        </div>
      </div>

      {/* `bg-ink-900` virou quase branco na troca de tema, e o texto branco
          sumia dentro dele. O painel é o lado escuro da tela: pine-950. */}
      <div className="hidden bg-pine-950 lg:block">
        <div className="flex h-full flex-col justify-end p-12 text-white">
          {/* Canto inferior esquerdo do painel: ele fica grande sem disputar
              espaço com o formulário, e o fundo escuro é onde os verdes e o
              dourado dele rendem melhor. */}
          <div className="mb-9">
            <MascoteLogin
              progressoEmail={progressoEmail}
              escondendo={naSenha}
              espiando={senhaVisivel}
              ocupado={loading}
              errou={errou}
              className="w-[248px]"
            />
          </div>

          <blockquote className="max-w-md text-xl leading-relaxed font-light">
            Toda demanda com um responsável, um prazo e um histórico. Nada mais se perde entre
            uma conversa e outra.
          </blockquote>
          <p className="mt-6 text-sm text-ink-400">Plataforma interna · Time de Águias</p>
        </div>
      </div>
    </main>
  )
}
