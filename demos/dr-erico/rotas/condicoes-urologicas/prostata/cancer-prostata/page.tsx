import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Câncer de Próstata Fortaleza | Diagnóstico e Tratamento, Dr. Érico Diógenes' },
  description:
    'Câncer de próstata em Fortaleza: fatores de risco, sintomas, diagnóstico e tratamento com cirurgia robótica. Dr. Érico Diógenes, referência em uro-oncologia no Ceará.',
  alternates: { canonical: '/condicoes-urologicas/prostata/cancer-prostata' },
  openGraph: {
    title: 'Câncer de Próstata Fortaleza | Dr. Érico Diógenes',
    description: 'Diagnóstico e tratamento do câncer de próstata em Fortaleza com cirurgia robótica Da Vinci. Dr. Érico Diógenes, especialista.',
    url: '/condicoes-urologicas/prostata/cancer-prostata',
  },
}

const fatoresRisco = [
  { fator: 'Idade', detalhe: 'A grande maioria dos casos ocorre após os 50 anos. O risco aumenta progressivamente com a idade.' },
  { fator: 'Histórico Familiar', detalhe: 'Homens com pai ou irmão diagnosticados têm 2 a 3 vezes mais risco. Inicie o rastreamento antes dos 40 anos.' },
  { fator: 'Etnia', detalhe: 'Homens negros têm maior incidência e tendem a desenvolver formas mais agressivas da doença.' },
  { fator: 'Dieta', detalhe: 'Dietas ricas em gordura animal e pobres em vegetais estão associadas a maior risco de câncer de próstata.' },
  { fator: 'Obesidade', detalhe: 'O excesso de peso está associado a formas mais agressivas e maior risco de recidiva após o tratamento.' },
  { fator: 'Sedentarismo', detalhe: 'A atividade física regular tem papel protetor comprovado na prevenção do câncer de próstata.' },
]

const tratamentos = [
  {
    titulo: 'Prostatectomia Robótica (Da Vinci)',
    desc: 'Remoção da próstata com o sistema robótico Da Vinci. Pequenas incisões, visão tridimensional ampliada, preservação de nervos responsáveis pela continência e ereção. Padrão ouro para câncer localizado.',
    img: '/demos/dr-erico/img/dr-erico-foto-1.webp',
  },
  {
    titulo: 'Radioterapia',
    desc: 'Alternativa cirúrgica para casos selecionados. Pode ser externa (IMRT/VMAT) ou braquiterapia. Frequentemente combinada com hormonioterapia nos casos intermediários e de alto risco.',
    img: '/demos/dr-erico/img/post/imgid10_02.webp',
  },
  {
    titulo: 'Vigilância Ativa',
    desc: 'Para tumores de baixo risco e baixo volume: monitoramento rigoroso sem tratamento imediato. Preserva a qualidade de vida e intervém somente se houver progressão.',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
]

const estadios = [
  { estadio: 'Localizado (I e II)', desc: 'Tumor confinado à próstata. Taxa de cura com cirurgia ou radioterapia superior a 95%. Sem metástases.', cor: 'text-brand-green' },
  { estadio: 'Localmente Avançado (III)', desc: 'Tumor que ultrapassou a cápsula prostática mas sem metástases a distância. Tratamento combinado com bons resultados.', cor: 'text-brand-gold' },
  { estadio: 'Metastático (IV)', desc: 'Doença que atingiu linfonodos, ossos ou outros órgãos. Tratamento paliativo com hormonioterapia, quimioterapia e novas terapias-alvo.', cor: 'text-red-400' },
]

const faq = [
  {
    q: 'Câncer de próstata tem cura?',
    a: 'Sim, especialmente quando diagnosticado precocemente. Tumores localizados (confinados à próstata) têm taxa de cura superior a 90-95% com cirurgia ou radioterapia. Por isso o rastreamento anual com PSA e toque retal é tão importante a partir dos 40 anos.',
  },
  {
    q: 'Quais são os sintomas do câncer de próstata?',
    a: 'O câncer de próstata em estágio inicial raramente causa sintomas. Quando surgem, os sintomas são similares aos da HPB: dificuldade para urinar, jato fraco, urgência urinária. Em estágios avançados, pode causar dor óssea, cansaço e perda de peso. O rastreamento é a única forma de detectá-lo antes dos sintomas.',
  },
  {
    q: 'Qual a diferença entre a cirurgia robótica e a cirurgia aberta para o câncer de próstata?',
    a: 'A prostatectomia radical robótica (com o sistema Da Vinci) oferece visão 3D ampliada, maior precisão na preservação dos nervos responsáveis pela continência e ereção, menor sangramento, menos dor e recuperação mais rápida. Os resultados oncológicos são equivalentes, mas a qualidade de vida pós-operatória tende a ser melhor com a abordagem robótica.',
  },
  {
    q: 'Todos os cânceres de próstata precisam de tratamento imediato?',
    a: 'Não. Tumores de baixo risco (Gleason 6, PSA baixo, volume pequeno) podem ser acompanhados com vigilância ativa, monitoramento rigoroso sem tratamento imediato. Essa abordagem preserva a qualidade de vida e intervém somente se houver progressão da doença. O Dr. Érico avalia criteriosamente cada caso para definir a conduta mais adequada.',
  },
  {
    q: 'A cirurgia afeta a função erétil e a continência urinária?',
    a: 'Esses são os principais efeitos colaterais da prostatectomia radical. Com a técnica robótica e a preservação cuidadosa dos feixes neurovasculares, as chances de preservação da ereção e continência são maiores do que com técnicas abertas. A recuperação varia conforme a idade, a função sexual prévia e a extensão do tumor.',
  },
  {
    q: 'O que é o Gleason score?',
    a: 'O Gleason score é um sistema de gradação do câncer de próstata que avalia a agressividade do tumor através da biópsia. Varia de 6 a 10: Gleason 6 são tumores de baixo risco; 7 é risco intermediário; 8-10 são tumores de alto risco. O Gleason orienta a escolha do tratamento e o prognóstico da doença.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata' },
    { '@type': 'ListItem', position: 3, name: 'Câncer de Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata/cancer-prostata' },
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

export default function CancerProstata() {
  return (
    <>
      <MedicalWebPageSchema
        name="Câncer de Próstata em Fortaleza, Diagnóstico e Tratamento"
        description="Câncer de próstata em Fortaleza: fatores de risco, diagnóstico e tratamento com cirurgia robótica Da Vinci. Dr. Érico Diógenes, referência em uro-oncologia no Ceará."
        url="https://drericodiogenes.com.br/condicoes-urologicas/prostata/cancer-prostata"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Uro-Oncologia · Fortaleza, CE</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Câncer de Próstata:{' '}
                <span className="text-brand-gold">diagnóstico precoce, tratamento moderno e altas taxas de cura.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                O câncer de próstata é o mais comum entre os homens brasileiros, excluindo os tumores de pele. Com mais de 65 mil novos casos estimados por ano no Brasil, é também um dos mais tratáveis, especialmente quando detectado em estágios localizados, com taxa de cura superior a 90%.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Avaliação Especializada
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5.webp"
              alt="Câncer de próstata, tratamento em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, FATORES DE RISCO */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Quem está em risco</p>
            <h2 className="section-title mt-2">FATORES DE RISCO DO CÂNCER DE PRÓSTATA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O câncer de próstata não tem uma causa única, é resultado de múltiplos fatores que aumentam a probabilidade de desenvolvimento da doença. Conhecer os principais fatores de risco permite antecipar o rastreamento e agir antes que o tumor progrida.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {fatoresRisco.map((item, i) => (
              <div
                key={item.fator}
                className="bg-brand-beige-light rounded-2xl p-5 shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <h3 className="font-display text-lg text-brand-gold">{item.fator}</h3>
                <p className="text-sm text-brand-muted mt-2">{item.detalhe}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-4xl mx-auto" data-aos="fade-up">
            <h3 className="font-display text-xl text-brand-navy text-center mb-6">Estágios da Doença</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {estadios.map((e, i) => (
                <div key={e.estadio} className="bg-brand-beige-light rounded-2xl p-5 shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                  <h4 className={`font-display text-base ${e.cor}`}>{e.estadio}</h4>
                  <p className="text-sm text-brand-muted mt-2">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, TRATAMENTOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Opções terapêuticas</p>
            <h2 className="section-title mt-2">TRATAMENTOS PARA CÂNCER DE PRÓSTATA</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              A escolha do tratamento depende do estágio do tumor, do Gleason score, do PSA, da idade e das preferências do paciente. Em Fortaleza, o Dr. Érico Diógenes oferece as principais modalidades terapêuticas com foco em resultados oncológicos e qualidade de vida.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tratamentos.map((card, i) => (
              <div
                key={card.titulo}
                className="bg-white rounded-2xl overflow-hidden shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.titulo} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{card.titulo}</h3>
                  <p className="text-sm text-brand-muted mt-2">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center" data-aos="fade-up">
            <Link href="/cirurgia-robotica" className="btn-primary">
              Saiba mais sobre a Cirurgia Robótica →
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Uro-oncologista referência no Ceará</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O tratamento do câncer de próstata evoluiu drasticamente com a cirurgia robótica. O sistema Da Vinci permite ao cirurgião operar com precisão milimétrica, preservando os feixes neurovasculares responsáveis pela continência urinária e função erétil, aspectos que impactam diretamente a qualidade de vida pós-operatória.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes é um dos especialistas em prostatectomia robótica, realizando a cirurgia com o sistema Da Vinci para casos de câncer de próstata localizado e localmente avançado. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia e cirurgia minimamente invasiva, o Dr. Érico avalia cada caso com rigor científico e transparência, apresentando ao paciente todas as opções disponíveis e seus resultados esperados.
              </p>
              <p>
                <strong className="text-brand-navy">O diagnóstico precoce salva vidas.</strong> Se você tem mais de 40 anos e ainda não realizou o rastreamento de próstata, agende agora.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cirurgia-robotica" className="btn-primary">Ver Cirurgia Robótica</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-7.webp" alt="Dr. Érico Diógenes, câncer de próstata Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE CÂNCER DE PRÓSTATA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Diagnóstico precoce do câncer de próstata salva vidas, agende em Fortaleza" />
    </>
  )
}
