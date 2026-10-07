import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Urologia Geral em Fortaleza | Dr. Érico Diógenes' },
  description:
    'Urologia geral em Fortaleza: o que é, quais doenças trata, como é feito o diagnóstico e quando consultar. Informação confiável com Dr. Érico Diógenes.',
  alternates: { canonical: '/urologia/urologia-geral' },
  openGraph: {
    title: 'Urologia Geral em Fortaleza | Dr. Érico Diógenes',
    description: 'Entenda o que é urologia geral, quais condições trata e como funciona o acompanhamento especializado em Fortaleza.',
    url: '/urologia/urologia-geral',
  },
}

const condicoes = [
  { nome: 'Próstata Aumentada (HPB)', desc: 'Afeta cerca de 50% dos homens acima de 50 anos. Causa dificuldade para urinar, jato fraco e urgência urinária.', href: '/condicoes-urologicas/prostata' },
  { nome: 'Cálculo Renal', desc: 'Depósitos minerais nos rins que causam cólica intensa. O Brasil tem alta prevalência, especialmente em regiões quentes como o Nordeste.', href: '/condicoes-urologicas/calculo-renal' },
  { nome: 'Câncer de Próstata', desc: 'O câncer mais comum em homens no Brasil. Com rastreamento adequado, a taxa de cura supera 90% nos estágios iniciais.', href: '/condicoes-urologicas/uro-oncologia/cancer-prostata' },
  { nome: 'Infecção Urinária', desc: 'Mais comum em mulheres, mas também afeta homens, especialmente aqueles com próstata aumentada ou cálculo renal.', href: '/condicoes-urologicas/bexiga/infeccao-urinaria' },
  { nome: 'Disfunção Erétil', desc: 'Estima-se que 50% dos homens acima de 40 anos tenham algum grau de disfunção erétil. Tem causas físicas, hormonais e psicológicas tratáveis.', href: '/saude-masculina/disfuncao-eretil' },
  { nome: 'Bexiga Hiperativa', desc: 'Urgência urinária frequente que impacta diretamente a qualidade de vida. Tem tratamento medicamentoso e cirúrgico eficaz.', href: '/condicoes-urologicas/bexiga/bexiga-hiperativa' },
]

const diagnostico = [
  {
    num: '01',
    titulo: 'Histórico Clínico',
    desc: 'O urologista avalia sintomas, histórico familiar, medicamentos em uso e fatores de risco individuais. É a base de todo diagnóstico preciso.',
  },
  {
    num: '02',
    titulo: 'Exame Físico',
    desc: 'Inclui palpação abdominal e, em homens, toque retal para avaliação da próstata. Rápido, seguro e essencial para o diagnóstico prostático.',
  },
  {
    num: '03',
    titulo: 'Exames Laboratoriais',
    desc: 'PSA, análise de urina, culturas e dosagens hormonais complementam a avaliação clínica e direcionam o diagnóstico.',
  },
  {
    num: '04',
    titulo: 'Exames de Imagem',
    desc: 'Ultrassom de vias urinárias, tomografia, ressonância magnética e urofluxometria permitem visualizar e quantificar as condições identificadas.',
  },
]

const faq = [
  {
    q: 'O que a urologia geral abrange?',
    a: 'A urologia geral trata condições do trato urinário (rins, ureteres, bexiga, uretra) em homens e mulheres, além do aparelho reprodutor masculino. Engloba desde condições comuns como infecção urinária e cálculo renal até doenças complexas como câncer urológico e disfunção erétil.',
  },
  {
    q: 'Qual é o exame mais importante em urologia?',
    a: 'Não existe um único exame universal, depende da condição investigada. Para a próstata, o PSA e o toque retal são fundamentais. Para cálculo renal, o ultrassom e a tomografia. Para função urinária, a urofluxometria. O urologista define os exames conforme a queixa de cada paciente.',
  },
  {
    q: 'Urologia trata problemas de rim?',
    a: 'Sim, a urologia trata condições cirúrgicas do rim: cálculos renais, tumores, cistos e obstruções. Para doenças clínicas (insuficiência renal crônica, glomerulonefrites), o especialista é o nefrologista. Em muitos casos, os dois trabalham juntos.',
  },
  {
    q: 'O que é PSA e por que é importante?',
    a: 'O PSA (Antígeno Prostático Específico) é uma proteína produzida pela próstata, detectada por exame de sangue. Valores elevados podem indicar hiperplasia benigna, prostatite ou câncer de próstata. Por isso, o rastreamento anual é recomendado para homens a partir dos 40-45 anos.',
  },
  {
    q: 'A urologia trata incontinência urinária?',
    a: 'Sim. A incontinência urinária, perda involuntária de urina, é tratada pela urologia. As causas variam desde bexiga hiperativa até sequelas pós-cirúrgicas. O tratamento pode ser fisioterapêutico, medicamentoso ou cirúrgico, conforme o tipo e a gravidade.',
  },
  {
    q: 'Vasectomia é feita pelo urologista?',
    a: 'Sim. A vasectomia é um procedimento urológico ambulatorial, realizado com anestesia local. É o método contraceptivo masculino mais eficaz e permanente, com recuperação rápida e mínimas complicações quando realizada por especialista.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Urologia', item: 'https://drericodiogenes.com.br/urologia' },
    { '@type': 'ListItem', position: 3, name: 'Urologia Geral', item: 'https://drericodiogenes.com.br/urologia/urologia-geral' },
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

export default function UrologiaGeral() {
  return (
    <>
      <MedicalWebPageSchema
        name="Urologia Geral em Fortaleza, Dr. Érico Diógenes"
        description="Urologia geral em Fortaleza: o que é, quais doenças trata, como funciona o diagnóstico e quando consultar. Informação confiável com Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/urologia/urologia-geral"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Especialidade médica</p>
              <h1 className="section-title mt-2">
                O que é Urologia Geral{' '}
                <span className="text-brand-gold">e quais condições ela trata?</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A urologia é a especialidade médico-cirúrgica dedicada ao diagnóstico e tratamento de doenças do sistema urinário, rins, ureteres, bexiga e uretra, e do aparelho reprodutor masculino. É uma das especialidades com maior impacto na qualidade de vida dos pacientes.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Consulta em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5.webp"
              alt="Urologia geral em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, CONDIÇÕES */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Doenças mais comuns</p>
            <h2 className="section-title mt-2">PRINCIPAIS CONDIÇÕES UROLÓGICAS</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              As doenças urológicas estão entre as mais prevalentes na população masculina adulta. Muitas evoluem de forma silenciosa nos estágios iniciais, o que torna o acompanhamento preventivo tão importante quanto o tratamento das queixas agudas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {condicoes.map((item, i) => (
              <Link
                key={item.nome}
                href={item.href}
                className="block bg-brand-beige-light rounded-2xl p-6 shadow-card hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <h3 className="font-display text-lg text-brand-gold">{item.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{item.desc}</p>
                <span className="inline-block mt-4 text-xs text-brand-navy font-medium">Saiba mais →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, COMO É O DIAGNÓSTICO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Metodologia</p>
            <h2 className="section-title mt-2">COMO FUNCIONA O DIAGNÓSTICO UROLÓGICO</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Um diagnóstico urológico preciso não depende de um único exame, mas de uma avaliação completa que combina histórico clínico, exame físico e exames complementares direcionados à queixa do paciente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {diagnostico.map((etapa, i) => (
              <div
                key={etapa.titulo}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className="h-24 bg-gradient-to-br from-brand-green/30 to-brand-gold/20 flex items-center justify-center">
                  <span className="font-display text-4xl text-brand-navy/80">{etapa.num}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base text-brand-navy">{etapa.titulo}</h3>
                  <p className="text-xs text-brand-muted mt-2">{etapa.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Urologia avançada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A urologia moderna combina clínica e tecnologia cirúrgica de forma cada vez mais sofisticada. Procedimentos que antes exigiam dias de internação e grandes incisões hoje são realizados com câmeras, laser e robôs, com alta no mesmo dia e recuperação em poucos dias.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes é um dos especialistas que incorporou essas inovações à prática clínica: o HoLEP para próstata, a cirurgia robótica Da Vinci para tumores urológicos e a ureteroscopia com laser para cálculos renais. Toda essa tecnologia, aliada a uma formação sólida pela UFC e atualização contínua, coloca o paciente cearense em contato com o mesmo padrão dos grandes centros médicos do país.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dr-erico-diogenes" className="btn-primary">
                Conhecer o Dr. Érico
              </Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                Agendar Consulta
              </a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-6.webp"
                alt="Dr. Érico Diógenes, Urologista referência em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE UROLOGIA GERAL</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Cuide da sua saúde urológica com diagnóstico especializado em Fortaleza" />
    </>
  )
}
