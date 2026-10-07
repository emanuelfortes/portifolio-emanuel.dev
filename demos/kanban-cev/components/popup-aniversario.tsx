'use client'

import { useEffect, useRef, useState } from 'react'
import { Gift } from 'lucide-react'
import { useMe } from '@/demos/kanban-cev/lib/hooks'
import { Avatar, Button } from '@/demos/kanban-cev/components/ui'
import { MascoteLogin } from '@/demos/kanban-cev/components/mascote-login'

/**
 * O parabéns que espera a pessoa chegar.
 *
 * A agência não trabalha fim de semana e o país tem feriado no meio da semana,
 * então "aparecer no dia" falha justamente nos aniversários que mais precisam
 * disso — o do Valberson cai num sábado e o da Cleane, num 7 de setembro. Por
 * isso a janela é de alguns dias: o que manda é o primeiro acesso DEPOIS, não
 * a data exata.
 */

/** Até quantos dias depois ainda vale mostrar. Cobre feriado emendado. */
/**
 * Por quantos dias DEPOIS o presente continua no canto.
 *
 * Seis cobre a semana útil inteira a partir do dia, qualquer que seja o dia
 * da semana. É o que permite reabrir o parabéns na quinta para mostrar a
 * alguém que não estava na segunda.
 */
const JANELA_DIAS = 6

/** Só uma vez por ano, por aparelho. */
function chaveDoAno(ano: number) {
  return `acev:aniversario:${ano}`
}

function jaViu(ano: number): boolean {
  try {
    return localStorage.getItem(chaveDoAno(ano)) === 'visto'
  } catch {
    // Janela anônima ou site bloqueado: mostrar de novo é melhor do que
    // quebrar a tela por causa de um parabéns.
    return false
  }
}

function marcarVisto(ano: number) {
  try {
    localStorage.setItem(chaveDoAno(ano), 'visto')
  } catch {
    /* sem armazenamento: aparece de novo no próximo acesso, e tudo bem */
  }
}

const NOME_DO_DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

interface Situacao {
  /** Negativo é antes do dia; zero é hoje; positivo é depois. */
  dias: number
  /** O dia ainda não chegou: cai no fim de semana e o parabéns vem adiantado. */
  antecipado: boolean
  /** "sábado" ou "domingo", para o texto poder dizer qual. */
  diaDaSemana: string
}

/**
 * Se hoje é dia de dar o parabéns, e de que jeito.
 *
 * Duas janelas, e a segunda existe por causa do calendário da agência.
 *
 *   DEPOIS   seis dias, cobrindo a semana útil inteira.
 *   ANTES    a partir da última sexta, quando o dia cai de sábado a segunda.
 *            Dizer adiantado é melhor do que dizer atrasado: na sexta a
 *            equipe ainda está reunida, e o parabéns chega antes de a data
 *            passar.
 *
 * A conta é feita na data LOCAL de quem olha, e não no fuso da agência: é o
 * aniversário da pessoa, e o dia que vale é o dela.
 */
function situacaoDe(birthday: string): Situacao | null {
  const [, mes, dia] = birthday.split('-').map(Number)
  if (!mes || !dia) return null

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const alvo = new Date(hoje.getFullYear(), mes - 1, dia)
  const dias = Math.round((hoje.getTime() - alvo.getTime()) / 86400000)
  const diaDaSemana = NOME_DO_DIA[alvo.getDay()]!

  if (dias >= 0 && dias <= JANELA_DIAS) return { dias, antecipado: false, diaDaSemana }

  /**
   * Sábado abre na sexta; domingo também, que é dois dias antes.
   *
   * Ancorar na sexta, e não num número fixo de dias, é o que faz a antecipação
   * cair sempre no último dia útil — que é quando existe alguém para comemorar
   * junto.
   */
  /**
   *   sábado   a sexta é 1 dia antes
   *   domingo  2 dias
   *   segunda  3 dias
   *
   * A segunda entra junto com o fim de semana, e é o que resolve o feriado
   * sem precisar de uma lista deles: quem faz numa segunda ou não trabalha
   * — 7 de setembro é o caso desta semana — ou chega na primeira manhã
   * depois de dois dias fora, quando ninguém lembra. A sexta cobre os dois.
   */
  const diasAteSexta: Record<number, number> = { 6: 1, 0: 2, 1: 3 }
  const antecipacao = diasAteSexta[alvo.getDay()]
  if (antecipacao !== undefined && dias < 0 && dias >= -antecipacao) {
    return { dias, antecipado: true, diaDaSemana }
  }

  return null
}

export function PopupAniversario() {
  const { data: me } = useMe()
  const [aberto, setAberto] = useState(false)
  /** Nulo quando não é a semana dela. É o que decide se o presente aparece. */
  const [situacao, setSituacao] = useState<Situacao | null>(null)

  useEffect(() => {
    /**
     * Espiada: `?festa=1` mostra como está no dia, `?festa=antes` como fica
     * adiantado.
     *
     * Existe porque a coisa só aparece na semana de cada aniversário, e quem
     * decidiu como ela seria não consegue ver o resultado até a data chegar —
     * o que empurra qualquer ajuste para depois de a pessoa já ter visto.
     *
     * Lido de `window.location` e não de `useSearchParams`, que no App Router
     * exige envolver a árvore num `Suspense` e faria uma tela inteira esperar
     * por causa de uma pré-visualização.
     */
    const espiar = new URLSearchParams(window.location.search).get('festa')
    if (espiar) {
      setSituacao(
        espiar === 'antes'
          ? { dias: -1, antecipado: true, diaDaSemana: 'sábado' }
          : { dias: 0, antecipado: false, diaDaSemana: 'hoje' },
      )
      setAberto(true)
      return
    }

    if (!me?.birthday) return
    const d = situacaoDe(me.birthday)
    if (d === null) return
    setSituacao(d)
    // Abre sozinho só da primeira vez. Depois disso o presente no canto fica
    // à disposição: quem quiser rever, ou mostrar para alguém do lado, clica.
    if (!jaViu(new Date().getFullYear())) setAberto(true)
  }, [me?.birthday])

  function fechar() {
    // Na espiada não marca nada: quem está só olhando não pode gastar o
    // parabéns de verdade de quem faz aniversário nesta máquina.
    if (!new URLSearchParams(window.location.search).get('festa')) {
      marcarVisto(new Date().getFullYear())
    }
    setAberto(false)
  }

  if (!situacao || !me) return null

  const primeiro = me.name.split(' ')[0]

  /**
   * O presente fica no canto durante a semana inteira.
   *
   * Sem ele, o parabéns acontece uma vez e some — e quem fechou sem querer,
   * ou quer mostrar para a colega do lado, não tem como voltar. Um popup que
   * só existe uma vez é um popup que algumas pessoas nunca vão ver direito.
   */
  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir o seu presente de aniversário"
        /* No celular a barra de navegação de baixo ocupa o rodapé, e no PWA
           ainda há o risco do gesto de voltar embaixo dela. O presente sobe
           acima das duas; no desktop não existe barra e ele desce. */
        className="group fixed right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[65] flex items-center gap-2.5 rounded-full bg-brand-600 py-3 pr-5 pl-4 text-pine-950 shadow-2xl transition hover:scale-[1.04] lg:bottom-6"
      >
        <style>{`
          @keyframes presente-chama {
            0%,86%,100% { transform: rotate(0deg) }
            89%         { transform: rotate(-13deg) }
            92%         { transform: rotate(11deg) }
            95%         { transform: rotate(-6deg) }
          }
          /* Balança de vez em quando, não sem parar: um ícone em movimento
             constante vira enfeite e o olho para de ver depois de um minuto. */
          .presente { animation: presente-chama 4s ease-in-out infinite }

          /* O halo é o que faz o botão ser notado sem gritar: nasce colado e
             se abre desaparecendo, como uma gota na água. Fica ATRÁS e não
             recebe clique, senão ele roubaria a borda do botão. */
          @keyframes presente-halo {
            0%   { transform: scale(1);    opacity: .55 }
            70%  { transform: scale(1.45); opacity: 0 }
            100% { transform: scale(1.45); opacity: 0 }
          }
          .halo { animation: presente-halo 2.6s ease-out infinite }

          @media (prefers-reduced-motion: reduce) {
            .presente, .halo { animation: none }
            .halo { opacity: 0 }
          }
        `}</style>

        <span
          aria-hidden
          className="halo pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand-600"
        />

        <Gift className="presente size-5 shrink-0" />
        {/*
          * Com texto, e não só o ícone.
          *
          * Um presente sozinho num canto é decoração: quem vê não sabe se
          * clica, e não tem como mostrar para a colega do lado dizendo "olha o
          * que apareceu aqui". A frase é o convite.
          */}
        <span className="text-[13px] font-semibold whitespace-nowrap">Tem algo para você</span>
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Feliz aniversário"
      /**
       * Respiro de área segura por causa do PWA.
       *
       * Instalado no telefone, o app roda com `viewport-fit=cover`: o
       * `inset-0` vai até a borda física da tela, e num aparelho com entalhe o
       * cartão nasceria atrás do relógio em cima e do risco do gesto de voltar
       * embaixo. No navegador esses valores são zero e nada muda.
       *
       * `overflow-y-auto` junto: numa tela curta e deitada, o cartão com foto,
       * mascote e três parágrafos não cabe, e sem rolagem o botão de fechar
       * ficaria fora do alcance.
       */
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-pine-950/80 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[3px]"
      onClick={fechar}
    >
      <Confete />

      <div
        onClick={(e) => e.stopPropagation()}
        /* `p-6` no celular: com `p-8` num aparelho de 360px sobra pouco mais
           de 290 para o texto, e a frase quebra em quatro linhas curtas. */
        className="animate-in relative w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-2xl ring-1 ring-inset ring-overlay/10 sm:p-8"
      >
        {/*
          * A foto ao lado do mascote, e não no lugar dele.
          *
          * O parabéns é para uma pessoa, e um cartão sem o rosto dela vale para
          * qualquer um — deixa de ser dela. O mascote sozinho seria simpático e
          * genérico; os dois juntos leem como a plataforma cumprimentando
          * alguém em particular.
          */}
        <div className="mb-4 flex items-end justify-center gap-1 sm:gap-2">
          <MascoteLogin
            progressoEmail={0}
            escondendo={false}
            espiando={false}
            ocupado={false}
            errou={false}
            festa
            className="w-[104px] shrink-0 sm:w-[122px]"
          />

          <div className="relative -ml-3 mb-2 shrink-0">
            {/* O anel dourado separa a foto do fundo do cartão em qualquer
                tema, e é a mesma cor do botão do presente. */}
            <span className="absolute -inset-1 rounded-full bg-brand-600/25" />
            <div className="relative rounded-full ring-2 ring-brand-600">
              <Avatar name={me.name} url={me.avatarUrl} size={72} />
            </div>
          </div>
        </div>

        <h2 className="text-[22px] leading-tight font-semibold tracking-tight text-ink-900 sm:text-2xl">
          {situacao.antecipado ? `Feliz aniversário adiantado, ${primeiro}!` : `Feliz aniversário, ${primeiro}!`}
        </h2>

        {/*
          * O texto muda quando o dia já passou.
          *
          * "Feliz aniversário" num dia 8 para quem fez no dia 5 soa a
          * esquecimento disfarçado. Reconhecer o atraso é mais honesto do que
          * fingir que a data é hoje — e é o caso comum aqui, porque a agência
          * não abre no fim de semana.
          */}
        {/*
          * Duas frases, e a segunda é fixa.
          *
          * A primeira acerta o tempo — hoje, adiantado ou atrasado — e sozinha
          * soaria a aviso de calendário. A segunda é o que a pessoa vai
          * lembrar, e por isso não muda com a data: o que se diz a alguém no
          * aniversário dela não depende de que dia da semana caiu.
          */}
        <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
          {situacao.antecipado
            ? `Seu dia é ${situacao.diaDaSemana} e a gente não vai estar por aqui — então o parabéns vem antes. Ele não fica menor por isso.`
            : situacao.dias === 0
              ? 'Hoje o dia é seu, e a gente faz questão de dizer.'
              : `Seu dia foi ${situacao.dias === 1 ? 'ontem' : `há ${situacao.dias} dias`} e a gente não estava aqui para dizer na hora. Fica o abraço, atrasado e inteiro.`}
        </p>

        <p className="mt-3 text-[15px] leading-relaxed font-medium text-ink-800">
          Que o próximo ano seja do tamanho do que você constrói aqui.
          <br />
          O Time de Águias é maior com você dentro.
        </p>

        <Button onClick={fechar} className="mt-5 w-full">
          Obrigado, pessoal!
        </Button>

        <p className="mt-3 text-[11px] text-ink-400">Time de Águias</p>
      </div>
    </div>
  )
}

/**
 * Confete em canvas, e não em elementos na página.
 *
 * Cento e vinte papéis viram cento e vinte nós no DOM, cada um com o seu
 * `transform` — o navegador recalcula layout a cada quadro e a animação
 * engasga no celular. No canvas é um desenho só por quadro.
 */
function Confete() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = el.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let largura = 0
    let altura = 0

    function medir() {
      largura = window.innerWidth
      altura = window.innerHeight
      el!.width = largura * dpr
      el!.height = altura * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    medir()
    window.addEventListener('resize', medir)

    const cores = ['#f7d88c', '#c3993a', '#4fbf8b', '#e8735f', '#F4F8F6']

    /**
     * Metade começa logo acima da borda, metade espalhada bem mais alto.
     *
     * Só o segundo grupo daria uma tela vazia nos primeiros instantes — a
     * abertura, que é quando a pessoa está olhando. Só o primeiro daria uma
     * cortina que passa e acaba. Juntos, a chuva já começa cheia e continua.
     */
    const papeis = Array.from({ length: 170 }, (_, i) => ({
      x: Math.random() * largura,
      y: i % 2 === 0 ? -20 - Math.random() * altura * 0.5 : -20 - Math.random() * altura * 2,
      l: 6 + Math.random() * 8,
      vy: 1.8 + Math.random() * 2.8,
      vx: -0.9 + Math.random() * 1.8,
      giro: Math.random() * Math.PI,
      vgiro: -0.11 + Math.random() * 0.22,
      // Balanço lateral próprio: sem ele, cada papel cai numa reta e o
      // conjunto parece chuva de risquinhos em vez de papel no ar.
      fase: Math.random() * Math.PI * 2,
      cor: cores[Math.floor(Math.random() * cores.length)]!,
    }))

    let raf = 0
    const inicio = performance.now()

    function quadro(agora: number) {
      const passado = agora - inicio
      // Some depois de seis segundos: confete eterno deixa de ser festa e vira
      // ruído por cima do texto que a pessoa está tentando ler.
      const opacidade = passado < 5200 ? 1 : Math.max(0, 1 - (passado - 5200) / 2200)

      ctx!.clearRect(0, 0, largura, altura)
      ctx!.globalAlpha = opacidade

      for (const p of papeis) {
        p.y += p.vy
        p.x += p.vx + Math.sin(passado / 620 + p.fase) * 0.55
        p.giro += p.vgiro
        if (p.y > altura + 20) {
          p.y = -20
          p.x = Math.random() * largura
        }

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.giro)
        ctx!.fillStyle = p.cor
        // Retângulo achatado e girando: o mesmo papel parece ora largo, ora
        // de lado, que é o que dá volume a uma forma plana.
        ctx!.fillRect(-p.l / 2, -p.l / 4, p.l, p.l / 2)
        ctx!.restore()
      }

      if (opacidade > 0) raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', medir)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  )
}
