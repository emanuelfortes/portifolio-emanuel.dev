import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ArrowUpRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'
import { midias, type TamanhoMidia } from '@/demos/dr-erico/data/midias'

export const metadata: Metadata = {
  title: { absolute: 'Mídias | Dr. Érico Diógenes na Imprensa — Urologista em Fortaleza' },
  description:
    'Participações do Dr. Érico Diógenes, urologista em Fortaleza, na imprensa, em TV e em veículos de saúde. Entrevistas e matérias sobre urologia.',
  alternates: { canonical: '/midias' },
  openGraph: {
    title: 'Mídias | Dr. Érico Diógenes na Imprensa',
    description:
      'Entrevistas e matérias com o Dr. Érico Diógenes, urologista em Fortaleza.',
    url: '/midias',
  },
}

/**
 * Mosaico irregular sem JavaScript.
 *
 * A grade tem 4 colunas no desktop e linhas de altura fixa. Cada card ocupa um
 * número diferente de colunas e linhas, e `grid-auto-flow: dense` faz os cards
 * menores preencherem os buracos deixados pelos maiores. O resultado é o
 * mosaico desencontrado, sem biblioteca e sem cálculo em tempo de execução.
 *
 * A distribuição é determinística, derivada do índice: a mesma lista sempre
 * produz o mesmo desenho. Aleatório embaralharia o layout a cada build, o que
 * atrapalha revisão e deixa o site instável visualmente entre deploys.
 *
 * O padrão de 7 em 7 foi escolhido por não dividir 4, que é o número de
 * colunas. Isso evita que os cards grandes caiam sempre na mesma coluna e
 * formem uma faixa vertical.
 */
const CLASSES_TAMANHO: Record<TamanhoMidia, string> = {
  grande: 'md:col-span-2 md:row-span-2',
  alto: 'md:row-span-2',
  largo: 'md:col-span-2',
  normal: '',
}

function tamanhoDe(indice: number, forcado?: TamanhoMidia): TamanhoMidia {
  if (forcado) return forcado

  const posicao = indice % 7
  if (posicao === 0) return 'grande'
  if (posicao === 3) return 'alto'
  if (posicao === 5) return 'largo'
  return 'normal'
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Mídias', item: 'https://drericodiogenes.com.br/midias' },
  ],
}

export default function Midias() {
  return (
    <>
      <MedicalWebPageSchema
        name="Dr. Érico Diógenes na Imprensa"
        description="Entrevistas e matérias com o Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/midias"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      {/* Faixa mais baixa que o padrao: sobrou so o titulo, e a altura
          original foi dimensionada para retranca, titulo e paragrafo. */}
      <section className="bg-brand-beige py-12 md:py-14">
        <div className="container-site max-w-3xl text-center" data-aos="fade-up">
          <h1 className="section-title">
            Dr. Érico{' '}
            <span className="text-brand-gold">na Mídia</span>
          </h1>
        </div>
      </section>

      {/* SEÇÃO 2 — MOSAICO */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container-site">
          {midias.length === 0 ? (
            <p className="text-center text-brand-muted py-16">
              Conteúdo em atualização.
            </p>
          ) : (
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
                auto-rows-[200px] md:auto-rows-[220px]
                gap-4 md:gap-5
                [grid-auto-flow:dense]
              "
            >
              {midias.map((m, i) => {
                const tamanho = tamanhoDe(i, m.tamanho)

                return (
                  <a
                    key={m.url}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group relative overflow-hidden rounded-2xl shadow-card
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold
                      ${CLASSES_TAMANHO[tamanho]}
                    `}
                    data-aos="fade-up"
                    data-aos-delay={(i % 6) * 70}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.imagem}
                      alt={`${m.titulo} — ${m.veiculo}`}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />

                    {/*
                      Degradê de baixo para cima, para o texto ficar legível
                      sobre qualquer print. Sem ele, título claro sobre imagem
                      clara some, e print de jornal costuma ter fundo branco.
                    */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <p className="text-brand-gold text-[11px] uppercase tracking-widest font-semibold">
                        {m.veiculo}
                      </p>
                      <h2
                        className={`
                          text-white font-display leading-snug mt-1
                          ${tamanho === 'grande' ? 'text-lg md:text-xl' : 'text-sm md:text-base'}
                        `}
                      >
                        {m.titulo}
                      </h2>
                      {m.data && (
                        <p className="text-white/60 text-xs mt-1.5">{m.data}</p>
                      )}
                    </div>

                    <span
                      className="
                        absolute top-4 right-4 h-9 w-9 rounded-full
                        bg-white/15 backdrop-blur-sm
                        flex items-center justify-center text-white
                        opacity-0 group-hover:opacity-100 transition-opacity
                      "
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 3 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Sobre o especialista</p>
            <h2 className="section-title mt-2">POR QUE A IMPRENSA PROCURA</h2>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é urologista com mais de 21 anos de experiência, doutor em Urologia
              pela USP com pesquisa em tumores de próstata, fellowship em uro-oncologia pelo Hospital
              Sírio-Libanês e formação em cirurgia robótica pelo Hospital Albert Einstein.
            </p>
            <p className="text-brand-muted mt-4">
              Atua em cirurgia robótica, cirurgia a laser da próstata, uro-oncologia e saúde
              masculina, e é membro da Sociedade Brasileira de Urologia e da Associação Americana
              de Urologia.
            </p>
            {/*
              Porta de entrada da seção de notícias.

              O plano prevê que /noticias seja alcançada pelo sitemap, pelos
              links dentro dos textos e por aqui. O menu fica como está: incluir
              a seção nele é decisão do Dr. Érico, não nossa.
            */}
            <p className="text-brand-muted mt-4">
              Os assuntos tratados nessas matérias estão comentados em detalhe na seção de{' '}
              <Link href="/noticias" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
                notícias
              </Link>
              , com a leitura dele sobre cada um.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/dr-erico-diogenes" className="btn-silver">
                Conheça o Dr. Érico
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-3.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Precisa de uma avaliação urológica em Fortaleza?" />
    </>
  )
}
