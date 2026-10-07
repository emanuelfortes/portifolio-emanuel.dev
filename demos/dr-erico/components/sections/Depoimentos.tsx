import { Star } from 'lucide-react'
import { depoimentos, GOOGLE_PERFIL_URL, type Depoimento } from '@/demos/dr-erico/data/depoimentos'

/**
 * PLANO DE RECUPERAÇÃO · ITEM 14 · Depoimentos na home.
 *
 * Antes desta seção, depoimentos existiam só dentro de /cirurgia-robotica e de
 * algumas páginas de condição. A home, que é a página escolhida para
 * "urologista em fortaleza", não tinha nenhuma prova social, enquanto um dos
 * concorrentes do top 4 tem seção de depoimentos na home.
 *
 * Conteúdo VISUAL apenas. Nada aqui vai para o JSON-LD, pelos motivos
 * explicados em data/depoimentos.ts.
 *
 * ── Como o carrossel roda sem JavaScript ──────────────────────────────────
 * A lista é renderizada duas vezes na mesma trilha, e a animação desloca a
 * trilha em -50%. Como -50% da trilha dupla é exatamente a largura de uma
 * cópia, o fim do ciclo cai no mesmo quadro visual do começo e o reinício não
 * tem emenda.
 *
 * Detalhe que faz isso funcionar: o espaçamento vem de margem em cada card,
 * NÃO de `gap` na trilha. Com `gap`, a trilha mede (2 cópias + 1 vão) e -50%
 * erra o ponto por meio vão, produzindo um tranco visível a cada volta.
 *
 * É CSS puro: sem 'use client', sem timer, sem biblioteca. A seção continua
 * Server Component e não acrescenta nada ao bundle.
 */

/** Tempo que cada card leva para atravessar. Mantém a velocidade de leitura
 *  constante mesmo que a lista cresça ou diminua. */
const SEGUNDOS_POR_CARD = 9

/** Espaçamento entre cards, em px. Precisa bater com a margem aplicada no
 *  card, porque é ele que garante a simetria das duas cópias. */
const ESPACO = 24

function Card({ d, duplicado }: { d: Depoimento; duplicado?: boolean }) {
  return (
    <figure
      // A segunda cópia existe só para fechar o loop visual. Fica fora da
      // árvore de acessibilidade para o leitor de tela não ler tudo em dobro.
      aria-hidden={duplicado || undefined}
      className="bg-white rounded-2xl p-6 shadow-card flex flex-col w-[320px] md:w-[360px] shrink-0"
      style={{ marginRight: ESPACO }}
    >
      <div className="flex items-center gap-1" aria-label={`Nota ${d.nota} de 5`}>
        {Array.from({ length: d.nota }).map((_, s) => (
          <Star key={s} size={14} className="fill-brand-gold text-brand-gold" />
        ))}
      </div>

      <blockquote className="mt-4 flex-1">
        <p className="text-brand-muted text-sm leading-relaxed">{d.texto}</p>
      </blockquote>

      <figcaption className="mt-5 pt-4 border-t border-brand-beige">
        <p className="font-semibold text-brand-navy text-sm">{d.autor}</p>
        <p className="text-xs text-brand-muted mt-0.5">
          {d.perfil} · {d.quando}
        </p>
      </figcaption>
    </figure>
  )
}

export default function Depoimentos() {
  const duracao = depoimentos.length * SEGUNDOS_POR_CARD
  const trilha = [...depoimentos, ...depoimentos]

  const mascara = 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)'

  return (
    <section className="py-16 md:py-20 bg-brand-beige-light overflow-hidden">
      <div className="container-site">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="eyebrow">Quem já passou por aqui</p>
          <h2 className="section-title mt-2">O QUE OS PACIENTES DIZEM</h2>
          <p className="text-brand-muted mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Avaliações publicadas por pacientes no perfil do Google do Dr. Érico Diógenes.
          </p>
        </div>
      </div>

      {/*
        Sai do container e ocupa a largura toda: num carrossel, o card cortado
        na borda é o que sinaliza que há mais conteúdo adiante. A máscara faz
        ele desaparecer nas pontas em vez de ser decepado.

        Com "reduzir movimento" ativo no sistema, a animação para e o bloco
        vira uma faixa de rolagem horizontal. Carrossel que gira sozinho e não
        pode ser parado é um problema real para quem tem sensibilidade
        vestibular, e aqui o conteúdo continua acessível do mesmo jeito.
      */}
      <div
        className="relative w-full motion-reduce:overflow-x-auto"
        style={{ maskImage: mascara, WebkitMaskImage: mascara }}
        data-aos="fade-up"
      >
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ '--marquee-duration': `${duracao}s` } as React.CSSProperties}
        >
          {trilha.map((d, i) => (
            <Card
              key={`${d.autor}-${i}`}
              d={d}
              duplicado={i >= depoimentos.length}
            />
          ))}
        </div>
      </div>

      <div className="container-site">
        {/*
          Atribuição à fonte. Exibir avaliação do Google sem dizer de onde veio,
          e sem caminho para conferir, é o tipo de coisa que corrói confiança
          justamente onde ela deveria ser construída.
        */}
        <div className="text-center mt-10" data-aos="fade-up">
          <a
            href={GOOGLE_PERFIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors"
          >
            Ver todas as avaliações no perfil do Google
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
