import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  // PLANO DE RECUPERAÇÃO · ITEM 5: o title trazia o termo principal
  // ('Urologista em Fortaleza') e disputava a home. Trocado por um title de
  // intenção própria, alinhado ao H1 que a página já usa.
  title: { absolute: 'Consulta Urológica em Fortaleza: Como Funciona e Quando Fazer' },
  description:
    'Saiba o que esperar de uma consulta urológica: etapas, exames, quando ir e como se preparar. Agende com Dr. Érico Diógenes em Fortaleza.',
  alternates: { canonical: '/urologia/consulta' },
  openGraph: {
    title: 'Consulta Urológica em Fortaleza: Como Funciona e Quando Fazer',
    description: 'Como funciona uma consulta urológica, quando você precisa de uma e como agendar em Fortaleza com Dr. Érico Diógenes.',
    url: '/urologia/consulta',
  },
}

const motivosConsulta = [
  { sintoma: 'Dificuldade para urinar ou jato fraco', detalhe: 'Pode indicar próstata aumentada, obstrução uretral ou bexiga hiperativa.' },
  { sintoma: 'Sangue na urina (hematúria)', detalhe: 'Sinal que nunca deve ser ignorado, pode indicar cálculo, infecção ou tumor.' },
  { sintoma: 'Dor lombar ou cólica intensa', detalhe: 'Frequentemente relacionada a cálculo renal em trânsito pelo ureter.' },
  { sintoma: 'Infecções urinárias frequentes', detalhe: 'Repetição de ITU pode indicar causa estrutural que exige investigação urológica.' },
  { sintoma: 'PSA alterado em exame de rotina', detalhe: 'Resultado elevado deve ser avaliado por urologista para excluir câncer de próstata.' },
  { sintoma: 'Disfunção erétil', detalhe: 'Pode ter causas vasculares, hormonais ou psicológicas, todas tratáveis com abordagem correta.' },
  { sintoma: 'Urgência ou incontinência urinária', detalhe: 'Perda de urina involuntária afeta a qualidade de vida e tem tratamento eficaz.' },
  { sintoma: 'Check-up preventivo masculino', detalhe: 'Homens acima de 40 anos devem realizar avaliação urológica anual mesmo sem sintomas.' },
]

const etapas = [
  {
    num: '01',
    titulo: 'Anamnese Detalhada',
    desc: 'O urologista ouve com atenção todos os sintomas, há quanto tempo existem, medicamentos em uso, histórico familiar e hábitos de vida. Quanto mais informação, mais preciso o diagnóstico.',
  },
  {
    num: '02',
    titulo: 'Exame Físico Dirigido',
    desc: 'A avaliação física pode incluir palpação do abdômen, exame genital e toque retal para avaliação da próstata em homens a partir dos 40 anos. É seguro, rápido e essencial.',
  },
  {
    num: '03',
    titulo: 'Exames Complementares',
    desc: 'Conforme a queixa, podem ser solicitados PSA, ultrassom de vias urinárias, urofluxometria, análise de urina, tomografia ou outros. A solicitação é sempre direcionada, não genérica.',
  },
  {
    num: '04',
    titulo: 'Diagnóstico e Plano Terapêutico',
    desc: 'Com base na avaliação completa, o especialista apresenta o diagnóstico em linguagem clara e as opções de tratamento disponíveis, sempre com espaço para perguntas e decisão compartilhada.',
  },
]

const preparacao = [
  'Listar os sintomas e há quanto tempo os percebe',
  'Levar exames anteriores (PSA, ultrassom, urofluxometria)',
  'Anotar todos os medicamentos em uso, inclusive suplementos',
  'Informar histórico familiar de câncer urológico ou renal',
  'Chegar bem hidratado, pois pode ser necessária amostra de urina',
  'Trazer acompanhante se preferir (é bem-vindo)',
]

const faq = [
  {
    q: 'Quanto tempo dura uma consulta urológica?',
    a: 'A primeira consulta costuma durar entre 30 e 50 minutos, garantindo tempo suficiente para anamnese completa, exame físico e esclarecimento de dúvidas. Consultas de retorno são geralmente mais curtas, focadas nos resultados de exames e evolução do tratamento.',
  },
  {
    q: 'Preciso de encaminhamento médico para consultar um urologista?',
    a: 'Não necessariamente. É possível agendar consulta diretamente com o urologista, seja por convênio com autorização prévia ou de forma particular. Qualquer pessoa com sintomas urológicos ou que deseja fazer check-up preventivo pode agendar diretamente.',
  },
  {
    q: 'O que acontece se o urologista encontrar algo grave?',
    a: 'O especialista explicará o achado com clareza, apresentará as opções de tratamento disponíveis e, se necessário, solicitará exames complementares para confirmar o diagnóstico. Nada é decidido sem o entendimento e consentimento do paciente.',
  },
  {
    q: 'É necessário fazer jejum para a consulta urológica?',
    a: 'Não é necessário jejum para a consulta em si. Se forem solicitados exames de sangue como PSA, o laboratório orientará sobre o preparo específico. Para ultrassom de bexiga, geralmente é necessário chegar com bexiga cheia.',
  },
  {
    q: 'Posso consultar um urologista mesmo sem sintomas?',
    a: 'Sim, e é recomendado. Homens a partir dos 40 anos devem realizar rastreamento anual do câncer de próstata (PSA + toque retal) mesmo sem sintomas. Condições como câncer de próstata em estágio inicial raramente causam dor ou desconforto.',
  },
  {
    q: 'Como funciona a consulta de retorno?',
    a: 'Na consulta de retorno, o urologista analisa os resultados dos exames solicitados, confirma ou revisa o diagnóstico e apresenta o plano de tratamento definitivo. É o momento de tirar dúvidas sobre o tratamento proposto e discutir alternativas.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Urologia', item: 'https://drericodiogenes.com.br/urologia' },
    { '@type': 'ListItem', position: 3, name: 'Consulta Urologista', item: 'https://drericodiogenes.com.br/urologia/consulta' },
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

export default function ConsultaUrologista() {
  return (
    <>
      <MedicalWebPageSchema
        name="Consulta Urológica em Fortaleza, Dr. Érico Diógenes"
        description="Como funciona uma consulta urológica, quando você precisa de uma e como se preparar. Agende com Dr. Érico Diógenes em Fortaleza."
        url="https://drericodiogenes.com.br/urologia/consulta"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Como funciona · O que esperar</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Consulta urológica em Fortaleza:{' '}
                <span className="text-brand-gold">o que é, como funciona e quando você precisa.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                Muitos pacientes chegam ao consultório urológico sem saber o que esperar, e isso gera adiamentos desnecessários. Entender como funciona a consulta urológica ajuda a dar o primeiro passo com mais segurança e menos dúvidas.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Consulta
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-3.webp"
              alt="Consulta urológica em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, QUANDO CONSULTAR */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Sinais de alerta</p>
            <h2 className="section-title mt-2">QUANDO VOCÊ PRECISA DE UMA CONSULTA UROLÓGICA?</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Sintomas urológicos muitas vezes são minimizados ou confundidos com problemas passageiros. Alguns desaparecem sozinhos, mas outros sinalizam condições que, sem tratamento, evoluem para complicações sérias. Abaixo, os sinais mais comuns que indicam a necessidade de consulta especializada.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {motivosConsulta.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-brand-beige-light rounded-xl p-5 shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 40}
              >
                <Check size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <div>
                  <p className="font-medium text-brand-navy text-sm">{item.sintoma}</p>
                  <p className="text-xs text-brand-muted mt-1">{item.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, COMO FUNCIONA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Passo a passo</p>
            <h2 className="section-title mt-2">COMO FUNCIONA A CONSULTA UROLÓGICA</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Uma boa consulta urológica vai muito além da prescrição de um exame. É um processo estruturado que garante um diagnóstico completo e um plano de tratamento adequado a cada paciente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {etapas.map((etapa, i) => (
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

          <div className="mt-14 max-w-3xl mx-auto" data-aos="fade-up">
            <h3 className="font-display text-xl text-brand-navy text-center mb-6">Como se preparar para a consulta</h3>
            <ul className="space-y-3">
              {preparacao.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-7.webp"
                alt="Dr. Érico Diógenes em consulta, Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Atendimento humanizado em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A qualidade de uma consulta urológica depende tanto da competência técnica do especialista quanto da forma como ele se comunica com o paciente. Diagnósticos precisos, explicados em linguagem acessível, aumentam a adesão ao tratamento e os resultados clínicos.
              </p>
              <p>
                Formado pela Universidade Federal do Ceará e com especialização em urologia minimamente invasiva e oncológica, o Dr. Érico Diógenes conduz cada consulta com atenção integral ao paciente: ouve com cuidado, explica com clareza e respeita o tempo necessário para cada caso.
              </p>
              <p className="italic">
                "Simplesmente encantado na consulta do Dr. Érico, com certeza uma das melhores visitas médicas. Muito atencioso e calmo, me passou segurança.", Fernando Torres, paciente.
              </p>
            </div>
            <Link href="/dr-erico-diogenes" className="btn-primary mt-8">
              Conhecer o Dr. Érico
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS SOBRE A CONSULTA UROLÓGICA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Agende agora sua consulta urológica em Fortaleza" />
    </>
  )
}
