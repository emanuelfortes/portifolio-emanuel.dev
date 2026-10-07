'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * O mascote da tela de login.
 *
 * Formas primitivas de propósito — círculos, elipses e dois triângulos. Um
 * desenho que não tenta parecer uma ave de verdade nunca erra a ave: a graça
 * está no movimento, não no traço, e é o mesmo motivo pelo qual o yeti que
 * popularizou este padrão funciona sendo apenas um boneco geométrico.
 *
 * Sem biblioteca de animação. Tudo o que se move é `transform` com transição
 * ou keyframe de CSS, que o navegador acelera na GPU — a plataforma abre no
 * celular e como PWA, e sessenta kilobytes de biblioteca para mover duas
 * pupilas seria caro.
 */

/** Deslocamento máximo da pupila, em unidades do viewBox. */
const ALCANCE = 5.5
/** Inclinação máxima da cabeça, em graus. */
const INCLINACAO = 7

interface Props {
  /** Quanto do campo de e-mail já foi digitado, de 0 a 1. Move o olhar junto. */
  progressoEmail: number
  /** Foco no campo de senha: as asas sobem. */
  escondendo: boolean
  /** Senha revelada pelo olho: espia entre as asas. */
  espiando: boolean
  /** Entrando: fecha os olhos, como quem torce. */
  ocupado: boolean
  /** Deu errado: uma negativa com a cabeça. */
  errou: boolean
  /** Chapéu de festa e um pulinho. Usado no popup de aniversário. */
  festa?: boolean
  className?: string
}

export function MascoteLogin({
  progressoEmail,
  escondendo,
  espiando,
  ocupado,
  errou,
  festa = false,
  className = 'w-[150px]',
}: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const [olhar, setOlhar] = useState({ x: 0, y: 0 })
  const [piscando, setPiscando] = useState(false)

  /**
   * O olhar segue o ponteiro pela TELA inteira, não só sobre o mascote.
   *
   * Limitar ao contorno dele faria o olhar morrer justamente quando a pessoa
   * vai para o formulário — que é para onde ela sempre vai. Seguir de longe é
   * o que dá a impressão de que ele está acompanhando o preenchimento.
   */
  useEffect(() => {
    // Enquanto as asas cobrem os olhos, não há para onde olhar.
    if (escondendo && !espiando) return

    function aoMover(e: PointerEvent) {
      const el = svg.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      // Normaliza e satura: perto do rosto o olhar acompanha, longe ele
      // encosta no limite em vez de estourar para fora do olho.
      const forca = Math.min(dist / 320, 1)
      setOlhar({ x: (dx / dist) * ALCANCE * forca, y: (dy / dist) * ALCANCE * forca * 0.7 })
    }

    window.addEventListener('pointermove', aoMover)
    return () => window.removeEventListener('pointermove', aoMover)
  }, [escondendo, espiando])

  /**
   * A piscada é o que mais separa "boneco" de "bicho".
   *
   * Intervalo irregular de propósito: piscar de dois em dois segundos exatos
   * é metrônomo, e o olho de quem vê percebe a cadência antes de perceber o
   * personagem. Entre 2,4 e 6,4 segundos ninguém consegue prever a próxima.
   */
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    function agendar() {
      id = setTimeout(
        () => {
          setPiscando(true)
          setTimeout(() => setPiscando(false), 130)
          agendar()
        },
        2400 + Math.random() * 4000,
      )
    }
    agendar()
    return () => clearTimeout(id)
  }, [])

  /**
   * Digitar manda mais do que o ponteiro.
   *
   * Quem está escrevendo o e-mail não move o mouse, e um olhar parado nesse
   * momento é o que denuncia o truque. O texto avança da esquerda para a
   * direita, então o olhar vai junto.
   */
  const digitando = progressoEmail > 0 && !escondendo
  const olho = digitando
    ? { x: -ALCANCE + progressoEmail * ALCANCE * 2, y: ALCANCE * 0.55 }
    : olhar

  const olhosFechados = ocupado || piscando || (escondendo && !espiando)

  /**
   * A cabeça acompanha o olhar, e o corpo acompanha a cabeça de leve.
   *
   * Só os olhos se mexendo dá o efeito de retrato que segue com o olhar — que
   * é inquietante, não simpático. O corpo entra com um terço da amplitude: o
   * suficiente para parecer que ele se virou, pouco o bastante para não virar
   * gangorra.
   *
   * Enquanto as asas cobrem os olhos a cabeça volta ao centro. Ninguém tapa os
   * olhos olhando de lado, e com a cabeça torta as asas não encaixariam.
   */
  const inclina = escondendo ? 0 : (olho.x / ALCANCE) * INCLINACAO
  const balanco = escondendo ? 0 : (olho.x / ALCANCE) * 2.2

  return (
    <svg
      ref={svg}
      viewBox="0 0 120 118"
      role="img"
      aria-label="Mascote da plataforma"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <style>{`
        svg { --mascote-corpo: #3d3d3d; --mascote-sombra: #2b2b2b;
              --mascote-pupila: #111111; --mascote-bico: #f7d88c;
              --mascote-asa: #c3993a }
        @keyframes mascote-negar {
          0%,100% { transform: translateX(0) rotate(0deg) }
          25%     { transform: translateX(-7px) rotate(-4deg) }
          75%     { transform: translateX(7px) rotate(4deg) }
        }
        @keyframes mascote-respira {
          0%,100% { transform: translateY(0) scale(1) }
          50%     { transform: translateY(-2.5px) scale(1.015) }
        }
        .mascote-vivo { animation: mascote-respira 3.6s ease-in-out infinite;
                        transform-box: fill-box; transform-origin: 50% 100% }
        /* No aniversário a respiração vira pulinho: mesma mecânica, amplitude
           e ritmo de quem está comemorando em vez de esperando. */
        @keyframes mascote-pula {
          0%,100% { transform: translateY(0) scale(1) }
          40%     { transform: translateY(-9px) scale(1.03, 0.97) }
          60%     { transform: translateY(0) scale(0.98, 1.02) }
        }
        .mascote-festa { animation: mascote-pula 1.1s ease-in-out infinite;
                         transform-box: fill-box; transform-origin: 50% 100% }
        @media (prefers-reduced-motion: reduce) {
          .mascote-festa { animation: none !important }
        }
        @media (prefers-reduced-motion: reduce) {
          .mv { transition: none !important }
          .mascote-vivo { animation: none !important }
          .mascote-abala { animation: none !important }
        }
      `}</style>

      {/*
        * As cores vivem no CSS acima, e não nos tokens do tema.
        *
        * `pine-800` vale um verde quase preto no tema escuro e BRANCO no
        * claro: os tokens de superfície invertem porque servem a fundos. Uma
        * ilustração é figura, não fundo, e precisa se destacar dos dois.
        */}
      <g
        className={errou ? 'mascote-abala' : undefined}
        style={
          errou
            ? {
                animation: 'mascote-negar 0.45s ease-in-out',
                transformBox: 'fill-box',
                transformOrigin: '50% 100%',
              }
            : undefined
        }
      >
        {/* A respiração é o movimento de base: enquanto ela existe, o mascote
            nunca fica completamente parado, e é isso que o mantém vivo entre
            uma interação e outra. */}
        <g className={festa ? 'mascote-festa' : 'mascote-vivo'}>
          {/* O corpo acompanha de leve. É o que transforma "olhos que seguem"
              em "bicho que se virou". */}
          <g
            className="mv"
            style={{
              transform: `translateX(${balanco}px)`,
              transition: 'transform 420ms cubic-bezier(.22,.9,.3,1)',
            }}
          >
            {/* Pés. Sem eles o corpo parece flutuar, e o balanço vira deriva. */}
            <path
              d="M49 104 v7 M49 111 h-6 M49 111 h6 M71 104 v7 M71 111 h-6 M71 111 h6"
              stroke="var(--mascote-asa)"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            <ellipse cx="60" cy="74" rx="34" ry="30" fill="var(--mascote-corpo)" />
            <ellipse cx="60" cy="78" rx="20" ry="21" fill="var(--mascote-sombra)" opacity="0.85" />

            {/* ------------------------------------------------------ cabeça */}
            <g
              className="mv"
              style={{
                transform: `rotate(${inclina}deg)`,
                transformBox: 'fill-box',
                transformOrigin: '50% 92%',
                transition: 'transform 420ms cubic-bezier(.22,.9,.3,1)',
              }}
            >
              <circle cx="60" cy="42" r="34" fill="var(--mascote-corpo)" />

              {/* Tufos: dois triângulos que dão a silhueta de ave sem exigir
                  desenho. */}
              <path d="M31 20 L38 3 L49 16 Z" fill="var(--mascote-corpo)" />
              <path d="M89 20 L82 3 L71 16 Z" fill="var(--mascote-corpo)" />

              {/* Chapéu, inclinado. Reto ele viraria um funil no meio da testa;
                  torto lê-se como chapéu de festa mal posto, que é o certo. */}
              {festa && (
                <g transform="rotate(-14 60 14)">
                  <path d="M60 -14 L74 16 L46 16 Z" fill="var(--mascote-bico)" />
                  <path d="M60 -14 L67 1 L53 1 Z" fill="#e8735f" />
                  <path d="M52 10 h16" stroke="#e8735f" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="60" cy="-16" r="4.2" fill="#F4F8F6" />
                </g>
              )}

              <ellipse cx="60" cy="44" rx="27" ry="24" fill="var(--mascote-sombra)" opacity="0.7" />

              {/* ---------------------------------------------------- olhos */}
              <g
                className="mv"
                style={{ transition: 'opacity 90ms ease' }}
                opacity={olhosFechados ? 0 : 1}
              >
                <circle cx="47" cy="42" r="12.5" fill="#F4F8F6" />
                <circle cx="73" cy="42" r="12.5" fill="#F4F8F6" />
                <g
                  className="mv"
                  style={{
                    transform: `translate(${olho.x}px, ${olho.y}px)`,
                    transition: 'transform 220ms cubic-bezier(.22,.9,.3,1)',
                  }}
                >
                  <circle cx="47" cy="42" r="5.6" fill="var(--mascote-pupila)" />
                  <circle cx="73" cy="42" r="5.6" fill="var(--mascote-pupila)" />
                  {/* O brilho é o que separa "olho" de "buraco". */}
                  <circle cx="49.2" cy="39.8" r="1.9" fill="#F4F8F6" opacity="0.9" />
                  <circle cx="75.2" cy="39.8" r="1.9" fill="#F4F8F6" opacity="0.9" />
                </g>
              </g>

              {/* Olhos fechados: dois arcos. Sem eles, o rosto fica sem olho
                  nenhum e parece defeito de carregamento. */}
              <g
                className="mv"
                style={{ transition: 'opacity 90ms ease' }}
                opacity={olhosFechados ? 1 : 0}
                stroke="#F4F8F6"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M39 43 Q47 50 55 43" />
                <path d="M65 43 Q73 50 81 43" />
              </g>

              <path d="M60 51 L67 62 L53 62 Z" fill="var(--mascote-bico)" />
            </g>

            {/* ------------------------------------------------------- asas */}
            {/*
              * Sobem no FOCO da senha, não na primeira tecla.
              *
              * É o detalhe que decide se o gesto parece intenção ou reação
              * atrasada: quem tapa os olhos depois de já ter visto não tapou
              * nada.
              *
              * `transform-box: fill-box` com origem no ombro faz a asa girar
              * presa ao corpo. Sem isso ela roda em torno do canto do SVG e
              * sai voando.
              */}
            {[
              { lado: 'esq', cx: 26, rot: -74, espia: -52, torce: -13 },
              { lado: 'dir', cx: 94, rot: 74, espia: 52, torce: 13 },
            ].map((a) => (
              <ellipse
                key={a.lado}
                className="mv"
                cx={a.cx}
                cy="70"
                rx="11"
                ry="26"
                fill="var(--mascote-asa)"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '50% 12%',
                  transform: escondendo
                    ? `rotate(${espiando ? a.espia : a.rot}deg)`
                    : // Entrando, as asas se apertam contra o corpo: é o gesto
                      // de quem torce, e combina com os olhos fechados.
                      `rotate(${ocupado ? a.torce : 0}deg)`,
                  transition: 'transform 380ms cubic-bezier(.34,1.3,.5,1)',
                }}
              />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}
