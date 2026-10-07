import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Exames e Orientações Urológicas Fortaleza | Dr. Érico Diógenes' },
  description:
    'Exames urológicos em Fortaleza: PSA, ultrassom, cistoscopia e urofluxometria. Orientações de preparo para consulta, pré e pós-operatório. Dr. Érico Diógenes.',
  alternates: { canonical: '/exames-orientacoes' },
  openGraph: {
    title: 'Exames e Orientações Urológicas | Dr. Érico Diógenes',
    description:
      'Como cada exame é feito, qual o preparo e o que ele mostra. Mais as orientações de consulta e de cirurgia.',
    url: '/exames-orientacoes',
  },
}

const exames = [
  {
    nome: 'Exame de PSA',
    href: '/exames-orientacoes/exames/psa',
    resumo:
      'Coleta de sangue simples, mas o preparo muda o resultado. Ciclismo, relação sexual recente e infecção urinária elevam o valor.',
    tag: 'Preparo de 48 horas',
    img: '/demos/dr-erico/img/post/imgid05_01.webp',
  },
  {
    nome: 'Ultrassom Urológico',
    href: '/exames-orientacoes/exames/ultrassom',
    resumo:
      'Sem radiação e quase sempre o primeiro exame de imagem pedido. Avalia rins, bexiga, próstata e testículos.',
    tag: 'Sem radiação',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
  {
    nome: 'Cistoscopia',
    href: '/exames-orientacoes/exames/cistoscopia',
    resumo:
      'O único método que enxerga o interior da bexiga por dentro. Feito com anestesia local e aparelho flexível.',
    tag: 'Anestesia local',
    img: '/demos/dr-erico/img/post/imgid12_01.webp',
  },
  {
    nome: 'Urofluxometria',
    href: '/exames-orientacoes/exames/urofluxometria',
    resumo:
      'Transforma a queixa de jato fraco em número. Você apenas urina em um vaso com sensor: sem sonda, sem contraste.',
    tag: 'Indolor',
    img: '/demos/dr-erico/img/post/imgid15_01.webp',
  },
]

const orientacoes = [
  {
    nome: 'Preparo para a Consulta',
    href: '/exames-orientacoes/orientacoes/consulta',
    resumo:
      'O que levar, por que os exames antigos importam e como fazer o diário urinário de três dias que muda a conduta.',
  },
  {
    nome: 'Orientações Pré-Operatórias',
    href: '/exames-orientacoes/orientacoes/pre-operatorio',
    resumo:
      'Exames, ajuste de medicamentos, jejum e organização das semanas que antecedem a cirurgia urológica.',
  },
  {
    nome: 'Orientações Pós-Operatórias',
    href: '/exames-orientacoes/orientacoes/pos-operatorio',
    resumo:
      'Cuidados na recuperação, o que é esperado, o que não é, e quando procurar atendimento sem esperar o retorno.',
  },
]

const faq = [
  {
    q: 'Preciso fazer exames antes da primeira consulta?',
    a: 'Não é necessário. Se já tiver exames recentes, leve, inclusive os antigos, porque comparar resultados ao longo do tempo agrega informação que um exame isolado não dá. Fazer bateria por conta própria costuma gerar repetição, porque sem avaliação clínica não dá para saber o que é útil no seu caso.',
  },
  {
    q: 'Os exames podem ser feitos no mesmo dia da consulta?',
    a: 'Alguns sim, como exame de urina, urofluxometria e determinadas ultrassonografias, conforme a estrutura disponível e a indicação. Exames que exigem preparo próprio, agendamento ou equipamento hospitalar, como ressonância e biópsia, são marcados separadamente.',
  },
  {
    q: 'Qual exame devo fazer para avaliar a próstata?',
    a: 'Não existe exame único. A avaliação costuma combinar história clínica, exame físico, PSA e, conforme o caso, ultrassom e urofluxometria. A escolha depende da idade, dos sintomas e dos fatores de risco, e é definida em consulta.',
  },
  {
    q: 'Exame alterado significa doença?',
    a: 'Não necessariamente. Muitos achados são variações sem significado clínico, e outros pedem apenas acompanhamento. O que transforma um resultado em conduta é a leitura dentro do contexto: idade, sintomas, exame físico e valores anteriores.',
  },
  {
    q: 'Posso trazer exames feitos em outro serviço?',
    a: 'Sim, e é recomendado. Traga laudos impressos e também as imagens em CD ou link quando houver, porque rever as imagens costuma agregar mais do que ler apenas o laudo. Exames de anos atrás também são úteis.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function ExamesOrientacoes() {
  return (
    <>
      <MedicalWebPageSchema
        name="Exames e Orientações Urológicas em Fortaleza"
        description="Exames urológicos e orientações de preparo para consulta e cirurgia. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Exames e Orientações · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Saber como é o exame{' '}
                <span className="text-brand-gold">costuma ser metade do problema resolvido.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Boa parte da apreensão com exames urológicos vem de imaginar algo pior do que é. Aqui está o passo a passo de cada um, o preparo que realmente muda o resultado e as orientações de consulta e de cirurgia.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Consulta
                </a>
                <Link href="/exames-orientacoes/orientacoes/consulta" className="btn-silver">
                  Como se Preparar
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-4.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — EXAMES */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Como é feito e qual o preparo</p>
            <h2 className="section-title mt-2">EXAMES UROLÓGICOS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {exames.map((e, i) => (
              <Link
                key={e.nome}
                href={e.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-card border border-black/5 flex flex-col hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.nome} className="w-full h-44 object-cover" loading="lazy" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl text-brand-navy">{e.nome}</h3>
                    <span className="text-xs font-semibold bg-brand-beige rounded-full px-3 py-1 whitespace-nowrap text-brand-navy">{e.tag}</span>
                  </div>
                  <p className="text-sm text-brand-muted mt-2 flex-1">{e.resumo}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-navy mt-4 font-medium group-hover:text-brand-gold transition-colors">
                    Saiba mais <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — ORIENTAÇÕES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Antes e depois</p>
            <h2 className="section-title mt-2">ORIENTAÇÕES AO PACIENTE</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {orientacoes.map((o, i) => (
              <Link
                key={o.nome}
                href={o.href}
                className="group bg-white rounded-2xl p-6 shadow-card flex flex-col hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <h3 className="font-display text-lg text-brand-navy">{o.nome}</h3>
                <p className="text-sm text-brand-muted mt-2 flex-1">{o.resumo}</p>
                <span className="inline-flex items-center gap-1 text-sm text-brand-navy mt-4 font-medium group-hover:text-brand-gold transition-colors">
                  Ver orientações <ChevronRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">EXAME NÃO É DIAGNÓSTICO</h2>
            <p className="text-brand-muted mt-4">
              Nenhum exame decide conduta sozinho. O mesmo PSA significa coisas diferentes conforme a idade e o volume da próstata; o mesmo fluxo urinário pode indicar obstrução em um paciente e bexiga com contração fraca em outro. O que transforma resultado em decisão é a leitura no contexto.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é urologista com mais de 21 anos de experiência, doutor em Urologia pela USP. Atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
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

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Tem exame marcado e ficou com dúvida? Fale com a equipe." />
    </>
  )
}
