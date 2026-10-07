import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/demos/dr-erico/lib/Link'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'
import { posts } from '@/demos/dr-erico/data/posts'
import { getNoticiasOrdenadas } from '@/demos/dr-erico/data/noticias'
import { site } from '@/demos/dr-erico/data/site'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'

export const metadata: Metadata = {
  title: { absolute: 'Dr. Érico Diógenes | Urologista em Fortaleza' },
  description:
    'Urologista em Fortaleza formado pela UFC, com doutorado pela USP e fellowship no Sírio-Libanês. Referência em Cirurgia Robótica e HoLEP. Conheça sua trajetória.',
  alternates: { canonical: '/dr-erico-diogenes' },
  openGraph: {
    title: 'Dr. Érico Diógenes, Urologista em Fortaleza',
    description:
      'Urologista formado pela UFC com especialização em Uro-oncologia. Referência em cirurgia robótica e HoLEP no Ceará.',
    url: '/dr-erico-diogenes',
  },
}

const formacao = [
  'Graduação em Medicina pela Universidade Federal do Ceará UFC. 2005.',
  'Especialista em Urologia pela Associação Médica Brasileira (AMB) e membro da Sociedade Brasileira de Urologia. 2013',
  'Residência Médica em Urologia pelo Complexo Hospitalar Edmundo Vasconcelos. 2013.',
  'Especialização em Uro-Oncologia com professor Miguel Srougi pela Universidade de São Paulo (USP) e Hospital Sírio Libanês. 2014.',
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Dr. Érico Diógenes', item: 'https://drericodiogenes.com.br/dr-erico-diogenes' },
  ],
}

export default function Sobre() {
  const noticiasDele = getNoticiasOrdenadas()

  const artigos = [...posts]
    .filter((p) => p.content.length > 200)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  const artigosRecentes = artigos.slice(0, 6)
  const artigosAnteriores = artigos.slice(6)

  return (
    <>

      <section className="bg-brand-beige py-14 md:py-20">
        <div className="container-site text-center">
          <h1
            className="font-display text-3xl md:text-5xl text-brand-navy leading-tight max-w-4xl mx-auto"
            data-aos="fade-up"
          >
            Olá! Sou o Dr. Érico Diógenes,{' '}
            <span className="font-semibold">Urologista em Fortaleza</span> especialista em cirurgia
            robótica e tratamentos de alta complexidade,{' '}
            <span className="text-brand-gold">com atuação em Fortaleza</span>
          </h1>
        </div>

        <div className="container-site mt-10" data-aos="fade-up" data-aos-delay="120">
          <div className="max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-soft relative">
            <Image unoptimized
              src="/demos/dr-erico/img/dr-erico-foto-1.webp"
              alt="Dr. Érico Diógenes"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-[40%_60%_40%_60%/50%_40%_60%_50%] overflow-hidden shadow-soft relative">
              <Image unoptimized
                src="/demos/dr-erico/img/dr-erico-foto-4.webp"
                alt="Dr. Érico Diógenes"
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover"
              />
            </div>
          </div>

          <div data-aos="fade-left">
            <h2 className="section-title">
              <span className="text-brand-gold">Conheça a</span> minha história
            </h2>
            <div className="mt-5 space-y-4 text-brand-muted text-sm md:text-base">
              <p>
                O Dr. Érico Diógenes é referência em urologia, com atuação no Instituto de Urologia
                e Robótica, no Hospital Monte Klinikum e no Instituto Dr. José Frota, unindo
                tecnologia de ponta e atendimento humanizado. Certificado pela Intuitive desde 2016
                para a realização de cirurgias robóticas, possui sólida formação acadêmica:
                doutorado em Urologia pela Universidade de São Paulo (USP), com pesquisa em tumores
                de próstata, fellowship em Uro-oncologia no Hospital Sírio-Libanês, sob orientação
                do Prof. Miguel Srougi, e especialização internacional em cirurgia robótica na
                Clinique Saint Augustin, na França.
              </p>
              <p>
                Formado pela Universidade Federal do Ceará em 2004, com parte do internato no
                Detroit Medical Center (EUA), realizou residência em Urologia no Hospital Professor
                Edmundo Vasconcelos (SP) e em Cirurgia Geral e Avançada pelo SUS de São Paulo. É
                membro titular da Sociedade Brasileira de Urologia e da Associação Americana de
                Urologia, com atuação em laparoscopia, cirurgia robótica, uro-oncologia, tratamento
                de cálculos urinários e saúde masculina.
              </p>
              <p>
                Combinando conhecimento, experiência e empatia, o Dr. Érico oferece aos pacientes
                tratamentos modernos, seguros e eficazes, sempre com o compromisso de proporcionar{' '}
                <span className="font-semibold text-brand-navy">
                  mais conforto, segurança e tranquilidade
                </span>{' '}
                em cada etapa do cuidado.
              </p>
              {/*
                Este parágrafo existe por dois motivos. O editorial é que a
                trajetória contada acima fica mais concreta com o que veículos
                de fora publicaram sobre ela.

                O técnico é que a /midias tinha 87 links apontando para ela e
                nenhum no corpo de uma página: todos vinham do menu e do rodapé,
                que aparecem em todas as páginas e por isso valem pouco como
                sinal de descoberta. Era a única página do site nessa situação.
                Esta é a página sobre o médico e está indexada, então é a origem
                certa para o link.
              */}
              <p>
                O trabalho dele também aparece fora daqui: são entrevistas e reportagens em
                veículos de imprensa e em TV, entre janeiro e setembro de 2026, reunidas na página{' '}
                <Link href="/midias" className="text-brand-gold hover:underline font-semibold">
                  Dr. Érico na Mídia
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="section-title">Formação Acadêmica e Especializações</h2>
          </div>

          <ul className="max-w-3xl mx-auto space-y-4">
            {formacao.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
                  ✓
                </span>
                <span className="text-sm md:text-base text-brand-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        PRODUÇÃO ASSINADA
        ---------------------------------------------------------------------
        Fase 3 do plano de notícias. O Google quer saber quem escreve e quem
        responde pelo conteúdo, e é mais exigente nisso em saúde do que em
        qualquer outro tema. Uma página "sobre" que não mostra produção é uma
        biografia; com a produção, vira página de autor.

        Tem um efeito técnico junto. Esta página está indexada, e os artigos
        mais antigos aparecem aqui como lista de links, não como cards. Não é
        economia de espaço: são 36 artigos, e transformar todos em card daria
        uma página que ninguém rola até o fim. Como lista, todos recebem link
        de uma página que o Google já visita, que é o que falta para as que
        estão fora do índice.
      */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Assinado por ele</p>
            <h2 className="section-title mt-2">O QUE O DR. ÉRICO PUBLICA</h2>
            <p className="mt-4 text-brand-muted max-w-2xl mx-auto text-sm md:text-base">
              Todo conteúdo deste site é escrito ou revisado pelo Dr. Érico Diógenes,
              {' '}{site.crm} · {site.rqe}. Não há assinatura genérica: cada artigo e cada notícia passa
              por ele antes de publicar.
            </p>
            {/*
              O link para as duas políticas sai daqui porque esta página está
              indexada e é onde a afirmação acima precisa ser verificável:
              dizer "é revisado por ele" sem mostrar o critério é só uma frase.

              Tem efeito técnico junto. Sem este link, /politica-editorial e
              /politica-de-correcoes só receberiam link de páginas que o Google
              ainda não alcançou.
            */}
            <p className="mt-3 text-sm text-brand-muted/90 max-w-2xl mx-auto">
              O critério está na{' '}
              <Link href="/politica-editorial" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
                política editorial
              </Link>
              , e o que acontece quando há erro, na{' '}
              <Link href="/politica-de-correcoes" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
                política de correções
              </Link>
              .
            </p>
          </div>

          {noticiasDele.length > 0 && (
            <>
              <h3 className="font-display text-xl text-brand-navy mb-5">Notícias</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {noticiasDele.map((n, i) => (
                  <div key={n.id} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
                    <PostCard post={n} base="/noticias" />
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="font-display text-xl text-brand-navy mt-12 mb-5">Artigos recentes</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigosRecentes.map((p, i) => (
              <div key={p.id} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
                <PostCard post={p} />
              </div>
            ))}
          </div>

          {artigosAnteriores.length > 0 && (
            <div className="mt-12" data-aos="fade-up">
              <h3 className="font-display text-xl text-brand-navy mb-5">
                Todos os artigos
              </h3>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2.5">
                {artigosAnteriores.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Agende agora sua consulta com o Dr. Érico Diógenes" />
    </>
  )
}
