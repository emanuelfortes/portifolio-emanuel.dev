import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight, Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Condições Urológicas Fortaleza | Dr. Érico Diógenes' },
  description:
    'Condições urológicas em Fortaleza: próstata, bexiga, cálculo renal e uro-oncologia. Sintomas, causas e quando procurar avaliação. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas' },
  openGraph: {
    title: 'Condições Urológicas Fortaleza | Dr. Érico Diógenes',
    description:
      'Próstata, bexiga, cálculo renal e câncer urológico: o que a urologia trata e quando procurar avaliação.',
    url: '/condicoes-urologicas',
  },
}

const areas = [
  {
    nome: 'Próstata',
    href: '/condicoes-urologicas/prostata',
    resumo:
      'Aumento benigno, prostatite, PSA alterado e câncer de próstata. Jato fraco e idas noturnas ao banheiro começam aqui.',
    itens: ['Hiperplasia prostática', 'PSA alterado', 'Câncer de próstata'],
    img: '/demos/dr-erico/img/post/imgid05_02.webp',
  },
  {
    nome: 'Bexiga e Trato Urinário',
    href: '/condicoes-urologicas/bexiga',
    resumo:
      'Infecção urinária de repetição, urgência, perda de urina e sangue na urina. Atende homens e mulheres.',
    itens: ['Infecção urinária', 'Bexiga hiperativa', 'Incontinência', 'Sangue na urina'],
    img: '/demos/dr-erico/img/post/imgid16_01.webp',
  },
  {
    nome: 'Cálculo Renal',
    href: '/condicoes-urologicas/calculo-renal',
    resumo:
      'Pedra nos rins, cólica renal e prevenção de novas crises. Condição de alta prevalência no Nordeste.',
    itens: ['Pedra nos rins', 'Cólica renal', 'Dor nos rins'],
    img: '/demos/dr-erico/img/post/imgid10_02.webp',
  },
  {
    nome: 'Uro-Oncologia',
    href: '/condicoes-urologicas/uro-oncologia',
    resumo:
      'Tumores de próstata, rim, bexiga e testículo. Diagnóstico, estadiamento e acompanhamento de longo prazo.',
    itens: ['Câncer de rim', 'Câncer de bexiga', 'Câncer de testículo'],
    img: '/demos/dr-erico/img/post/imgid08_01.webp',
  },
  {
    nome: 'Saúde Masculina',
    href: '/saude-masculina',
    resumo:
      'Disfunção erétil, ejaculação precoce, baixa testosterona, infertilidade e vasectomia.',
    itens: ['Disfunção erétil', 'Baixa testosterona', 'Infertilidade'],
    img: '/demos/dr-erico/img/post/imgid17_02.webp',
  },
]

const quandoProcurar = [
  'Ardência ou dor ao urinar que persiste por mais de dois ou três dias',
  'Jato urinário fraco, interrompido ou com esforço para começar',
  'Acordar duas ou mais vezes por noite para urinar',
  'Sangue na urina ou no sêmen, mesmo uma única vez',
  'Dor lombar em cólica, irradiando para a virilha',
  'Nódulo, dor ou inchaço em um dos testículos',
  'Dificuldade de ereção ou queda importante de libido',
  'Um ano de tentativa de gravidez sem sucesso',
]

const faq = [
  {
    q: 'O que a urologia trata?',
    a: 'O trato urinário de homens e mulheres, que inclui rins, ureteres, bexiga e uretra, e o sistema reprodutor masculino. Isso abrange infecção urinária, cálculo renal, próstata, incontinência, disfunção erétil, infertilidade masculina e os tumores urológicos.',
  },
  {
    q: 'Urologia é especialidade só para homens?',
    a: 'Não. O trato urinário é o mesmo nos dois sexos, e mulheres representam parte importante do consultório, principalmente por infecção urinária de repetição, cálculo renal, bexiga hiperativa e incontinência. O que é exclusivo do homem é a parte reprodutora e sexual.',
  },
  {
    q: 'Preciso de encaminhamento para consultar?',
    a: 'No atendimento particular, não. No convênio, alguns planos exigem encaminhamento ou autorização prévia. Vale confirmar com a operadora antes de agendar para evitar idas e vindas.',
  },
  {
    q: 'Quando os sintomas urinários viram urgência?',
    a: 'Procure atendimento imediato se houver incapacidade total de urinar com bexiga cheia e dor, dor testicular súbita e intensa, cólica renal com febre e calafrios, ereção dolorosa com mais de quatro horas ou sangramento urinário volumoso com coágulos.',
  },
  {
    q: 'A partir de que idade devo fazer avaliação preventiva?',
    a: 'Havendo sintoma, em qualquer idade. Sem sintoma, a avaliação voltada à próstata costuma começar aos 50 anos, ou aos 45 para homens negros e para quem tem pai ou irmão com câncer de próstata. Idade de início e intervalo são decididos em consulta.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Condições Urológicas', item: 'https://drericodiogenes.com.br/condicoes-urologicas' },
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

export default function CondicoesUrologicas() {
  return (
    <>
      <MedicalWebPageSchema
        name="Condições Urológicas em Fortaleza"
        description="Próstata, bexiga, cálculo renal, uro-oncologia e saúde masculina. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Condições Urológicas · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                A urologia trata mais{' '}
                <span className="text-brand-gold">do que a maioria das pessoas imagina.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Rins, ureteres, bexiga e uretra em homens e mulheres, além do sistema reprodutor masculino. Da infecção urinária ao câncer, do cálculo renal à saúde sexual. Aqui estão as condições organizadas por área, com o que caracteriza cada uma.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/exames-orientacoes" className="btn-silver">
                  Exames e Orientações
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — ÁREAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Escolha a área do seu sintoma</p>
            <h2 className="section-title mt-2">AS ÁREAS DA UROLOGIA</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((a, i) => (
              <Link
                key={a.nome}
                href={a.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-card border border-black/5 flex flex-col hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 70}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt={a.nome} className="w-full h-40 object-cover" loading="lazy" />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-lg text-brand-navy">{a.nome}</h3>
                  <p className="text-sm text-brand-muted mt-2">{a.resumo}</p>
                  <ul className="mt-4 space-y-1.5 flex-1">
                    {a.itens.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-xs text-brand-muted">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-gold shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-navy mt-4 font-medium group-hover:text-brand-gold transition-colors">
                    Ver condições <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — QUANDO PROCURAR */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Sinais que pedem avaliação</p>
            <h2 className="section-title mt-2">QUANDO PROCURAR UM UROLOGISTA</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up">
            <ul className="space-y-3">
              {quandoProcurar.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Dor testicular súbita, incapacidade total de urinar, cólica renal com febre e ereção dolorosa acima de quatro horas são urgências. Procure atendimento imediato.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">SINTOMA URINÁRIO NÃO MELHORA SOZINHO</h2>
            <p className="text-brand-muted mt-4">
              A maior parte das condições urológicas evolui devagar, e é justamente isso que faz o paciente se acostumar. Jato que enfraquece ao longo de anos, idas noturnas que viram rotina, perda de urina que se resolve com protetor diário. Acostumar-se não é o mesmo que estar bem.
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
      <CtaBanner title="Sintoma urológico que persiste merece avaliação." />
    </>
  )
}
