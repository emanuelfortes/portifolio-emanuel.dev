import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check, ChevronRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Bexiga e Trato Urinário Fortaleza | Dr. Érico Diógenes' },
  description:
    'Condições da bexiga em Fortaleza: infecção urinária, bexiga hiperativa, incontinência e sangue na urina. Avaliação com Dr. Érico Diógenes, urologista.',
  alternates: { canonical: '/condicoes-urologicas/bexiga' },
  openGraph: {
    title: 'Bexiga e Trato Urinário Fortaleza | Dr. Érico Diógenes',
    description:
      'Infecção urinária de repetição, urgência, perda de urina e sangue na urina: as condições da bexiga e quando procurar avaliação.',
    url: '/condicoes-urologicas/bexiga',
  },
}

const condicoes = [
  {
    nome: 'Infecção Urinária',
    href: '/condicoes-urologicas/bexiga/infeccao-urinaria',
    resumo:
      'Ardência, urgência e idas frequentes ao banheiro. Quando se repete três ou mais vezes por ano, existe quase sempre uma causa por trás que o antibiótico não resolve.',
    sinal: 'Febre e dor lombar indicam infecção no rim',
    img: '/demos/dr-erico/img/post/imgid16_01.webp',
  },
  {
    nome: 'Bexiga Hiperativa',
    href: '/condicoes-urologicas/bexiga/bexiga-hiperativa',
    resumo:
      'Vontade súbita e difícil de adiar, idas frequentes ao banheiro e despertar noturno. Não é beber muita água nem consequência inevitável da idade.',
    sinal: 'Urgência é o sintoma que define o quadro',
    img: '/demos/dr-erico/img/post/imgid11_02.webp',
  },
  {
    nome: 'Incontinência Urinária',
    href: '/condicoes-urologicas/bexiga/incontinencia',
    resumo:
      'Perda de urina ao tossir, rir ou correr, ou sem aviso nenhum. Tem quatro tipos diferentes, e a maioria começa com tratamento sem cirurgia.',
    sinal: 'Afeta mulheres e homens, por causas distintas',
    img: '/demos/dr-erico/img/post/imgid09_02.webp',
  },
  {
    nome: 'Sangue na Urina',
    href: '/condicoes-urologicas/bexiga/sangue-na-urina',
    resumo:
      'Visível ou detectada só no exame. Na maioria das vezes a causa é tratável, mas causas banais e graves se manifestam igual, e só a investigação separa.',
    sinal: 'Um episódio único já justifica avaliação',
    img: '/demos/dr-erico/img/post/imgid19_02.webp',
  },
]

const sinaisAlerta = [
  'Ardência ou dor ao urinar que dura mais de dois ou três dias',
  'Vontade urgente de urinar, com dificuldade de adiar',
  'Ir ao banheiro mais de oito vezes por dia, sem mudança no consumo de líquidos',
  'Acordar duas ou mais vezes por noite para urinar',
  'Perda de urina em qualquer situação, mesmo em pequena quantidade',
  'Sangue na urina, ainda que uma única vez e sem dor',
  'Sensação de que a bexiga não esvaziou por completo',
  'Febre com calafrios junto de sintomas urinários',
]

const faq = [
  {
    q: 'Quais condições da bexiga o urologista trata?',
    a: 'Infecção urinária e infecção de repetição, bexiga hiperativa, incontinência urinária em todos os seus tipos, sangue na urina, cálculos na bexiga, retenção urinária e tumores vesicais. A bexiga é um dos principais focos da urologia e atende tanto homens quanto mulheres.',
  },
  {
    q: 'Mulher deve procurar urologista ou ginecologista?',
    a: 'Para queixas urinárias, o urologista. A confusão é comum, mas o trato urinário é território da urologia nos dois sexos. Infecção urinária de repetição, incontinência e bexiga hiperativa em mulheres são atendidas rotineiramente no consultório urológico, muitas vezes em conjunto com a ginecologia.',
  },
  {
    q: 'Urinar muitas vezes ao dia é sempre problema de bexiga?',
    a: 'Nem sempre. Diabetes descompensado, uso de diuréticos, consumo elevado de líquidos e ansiedade também aumentam a frequência. A avaliação distingue o que vem da bexiga do que vem de outra causa, e o diário miccional de três dias ajuda muito nessa distinção.',
  },
  {
    q: 'Quando os sintomas urinários viram urgência?',
    a: 'Procure atendimento imediato se houver incapacidade total de urinar com bexiga cheia e dor, febre alta com calafrios e dor lombar, ou sangramento volumoso com coágulos que dificultem urinar. Fora esses casos, a avaliação pode ser agendada, mas não deve ser adiada por meses.',
  },
  {
    q: 'Preciso de exames antes da consulta?',
    a: 'Não é obrigatório. Se já tiver exames recentes, leve, mesmo que antigos, porque comparar resultados ao longo do tempo agrega informação. Na consulta define-se o que é realmente necessário, evitando exames repetidos sem indicação.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Condições Urológicas', item: 'https://drericodiogenes.com.br/condicoes-urologicas' },
    { '@type': 'ListItem', position: 3, name: 'Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga' },
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

export default function Bexiga() {
  return (
    <>
      <MedicalWebPageSchema
        name="Bexiga e Trato Urinário em Fortaleza"
        description="Infecção urinária, bexiga hiperativa, incontinência e sangue na urina: condições da bexiga avaliadas pelo Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/bexiga"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Condições Urológicas · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Bexiga e trato urinário.{' '}
                <span className="text-brand-gold">Queixas que homens e mulheres adiam por anos.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Arder ao urinar, não conseguir segurar, perder urina ao tossir, ver sangue no vaso. São sintomas que interferem no trabalho, no sono e na vida social, e que costumam ser tratados como detalhe até virarem rotina. Todos têm causa identificável e tratamento.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas" className="btn-silver">
                  Todas as Condições
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5b.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — AS CONDIÇÕES */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Escolha o que mais se parece com o seu caso</p>
            <h2 className="section-title mt-2">AS PRINCIPAIS CONDIÇÕES DA BEXIGA</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {condicoes.map((c, i) => (
              <Link
                key={c.nome}
                href={c.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-card border border-black/5 flex flex-col hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.nome} className="w-full h-44 object-cover" loading="lazy" />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl text-brand-navy">{c.nome}</h3>
                  <p className="text-sm text-brand-muted mt-2 flex-1">{c.resumo}</p>
                  <p className="text-xs text-brand-gold-dark mt-4 font-medium">{c.sinal}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-navy mt-4 font-medium group-hover:text-brand-gold transition-colors">
                    Saiba mais <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — SINAIS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Quando marcar consulta</p>
            <h2 className="section-title mt-2">SINAIS QUE PEDEM AVALIAÇÃO</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up">
            <ul className="space-y-3">
              {sinaisAlerta.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Incapacidade total de urinar, febre alta com dor lombar ou sangramento com coágulos são situações de urgência. Procure atendimento no mesmo dia.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">A BEXIGA NÃO É SÓ ASSUNTO DE HOMEM</h2>
            <p className="text-brand-muted mt-4">
              O trato urinário é o mesmo nos dois sexos, e boa parte do consultório urológico é feita de mulheres com infecção de repetição, incontinência e bexiga hiperativa. A ideia de que urologia é especialidade masculina faz muita paciente adiar a consulta que resolveria o problema.
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
      <CtaBanner title="Sintomas urinários não melhoram sozinhos com o tempo." />
    </>
  )
}
