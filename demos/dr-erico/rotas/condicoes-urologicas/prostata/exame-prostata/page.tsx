import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Exame de Próstata Fortaleza | PSA e Toque Retal, Dr. Érico Diógenes' },
  description:
    'Tudo sobre o exame de próstata em Fortaleza: o que é o PSA, como funciona o toque retal, quando fazer e como se preparar. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/condicoes-urologicas/prostata/exame-prostata' },
  openGraph: {
    title: 'Exame de Próstata Fortaleza | Dr. Érico Diógenes',
    description: 'Entenda o exame de próstata: PSA, toque retal, quando fazer e o que os resultados significam. Informação de confiança com Dr. Érico Diógenes.',
    url: '/condicoes-urologicas/prostata/exame-prostata',
  },
}

const exames = [
  {
    nome: 'PSA (Antígeno Prostático Específico)',
    desc: 'Exame de sangue que mede a concentração do antígeno prostático específico. É o principal marcador para rastreamento do câncer de próstata e monitoramento de doenças benignas. Rápido, simples e sem desconforto.',
    quando: 'Anualmente a partir dos 40-45 anos, ou antes se houver histórico familiar.',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    nome: 'Toque Retal',
    desc: 'Exame físico em que o médico avalia a consistência, tamanho e superfície da próstata por via retal. Permite detectar nódulos ou endurecimentos suspeitos que o PSA não identifica. Rápido, seguro e indolor.',
    quando: 'Anualmente a partir dos 40 anos, sempre em conjunto com o PSA.',
    img: '/demos/dr-erico/img/post/imgid14_02.webp',
  },
  {
    nome: 'Ultrassom Transretal (USTR)',
    desc: 'Imagem da próstata obtida por sonda retal. Avalia o volume prostático com precisão e pode guiar a biópsia quando necessário.',
    quando: 'Quando solicitado pelo urologista para complementar a investigação.',
    img: '/demos/dr-erico/img/post/imgid02_01.webp',
  },
  {
    nome: 'Ressonância Magnética da Próstata',
    desc: 'Exame de imagem de alta resolução que identifica áreas suspeitas com grande precisão. Reduz biópsias desnecessárias e guia procedimentos quando indicados.',
    quando: 'Indicada em casos de PSA persistentemente elevado ou suspeita clínica.',
    img: '/demos/dr-erico/img/post/imgid03_02.webp',
  },
]

const preparacao = [
  'Abstinência sexual por 48 horas antes do exame de PSA',
  'Evitar exercícios físicos intensos no dia anterior ao exame',
  'Não realizar toque retal antes de colher o PSA (a manipulação altera o resultado)',
  'Informar ao médico todos os medicamentos em uso',
  'Levar exames anteriores de PSA para comparação',
  'Chegar em jejum apenas se o laboratório solicitar outros exames junto',
]

const faq = [
  {
    q: 'O toque retal é doloroso?',
    a: 'O toque retal é um exame rápido, dura menos de 1 minuto, e causa apenas leve desconforto. Não é doloroso. O médico sempre explica o procedimento antes de realizá-lo e respeita o ritmo do paciente. O desconforto psicológico de antecipar o exame costuma ser muito maior do que o exame em si.',
  },
  {
    q: 'Posso fazer o PSA sem o toque retal?',
    a: 'É possível, mas não é o ideal. O PSA e o toque retal são complementares: o PSA pode ser normal mesmo com nódulo palpável ao toque, e vice-versa. A combinação dos dois aumenta significativamente a sensibilidade do rastreamento.',
  },
  {
    q: 'Com que frequência devo repetir o exame de próstata?',
    a: 'Para homens sem fatores de risco, o rastreamento anual é recomendado a partir dos 40-45 anos. Com histórico familiar de câncer de próstata ou etnia negra (maior risco), o início deve ser aos 35-40 anos. O urologista pode ajustar a frequência conforme a evolução dos resultados.',
  },
  {
    q: 'Preciso de jejum para o exame de PSA?',
    a: 'Não. O exame de PSA não requer jejum. No entanto, deve-se evitar relação sexual e exercícios físicos intensos nas 48 horas anteriores, pois podem alterar o resultado.',
  },
  {
    q: 'O exame de próstata detecta outros problemas além do câncer?',
    a: 'Sim. O rastreamento urológico pode identificar hiperplasia benigna (HPB), prostatite, alterações no volume prostático e outros achados relevantes para a saúde do paciente. Por isso, o acompanhamento regular é importante mesmo para homens assintomáticos.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata' },
    { '@type': 'ListItem', position: 3, name: 'Exame de Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata/exame-prostata' },
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

export default function ExameProstata() {
  return (
    <>
      <MedicalWebPageSchema
        name="Exame de Próstata em Fortaleza, PSA e Toque Retal"
        description="Tudo sobre exame de próstata em Fortaleza: PSA, toque retal, quando fazer e como se preparar. Dr. Érico Diógenes explica com clareza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/prostata/exame-prostata"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Prevenção · Diagnóstico · Fortaleza</p>
              <h1 className="section-title mt-2">
                Exame de Próstata:{' '}
                <span className="text-brand-gold">o que é, como funciona e por que não adiar.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O exame de próstata é a principal ferramenta de rastreamento do câncer de próstata, a neoplasia mais comum no homem brasileiro. Quando feito regularmente a partir dos 40 anos, permite detectar a doença em estágios iniciais, quando a taxa de cura supera 90%.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Exame em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-6.webp"
              alt="Exame de próstata em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, EXAMES */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Métodos disponíveis</p>
            <h2 className="section-title mt-2">EXAMES PARA AVALIAÇÃO DA PRÓSTATA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O "exame de próstata" não é um único exame, mas uma combinação de avaliações que juntas fornecem um quadro completo da saúde prostática. Cada método tem seu papel específico e suas indicações.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {exames.map((ex, i) => (
              <div
                key={ex.nome}
                className="bg-brand-beige-light rounded-2xl overflow-hidden shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ex.img} alt={ex.nome} className="h-36 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{ex.nome}</h3>
                  <p className="text-sm text-brand-muted mt-2">{ex.desc}</p>
                  <p className="text-xs text-brand-gold font-medium mt-3">Quando: {ex.quando}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, PREPARAÇÃO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Antes do exame</p>
            <h2 className="section-title mt-2">COMO SE PREPARAR</h2>
            <p className="text-brand-muted mt-4 mb-8">
              Uma preparação adequada garante resultados mais precisos e evita repetições desnecessárias. Siga as orientações abaixo antes de realizar o exame de PSA ou a consulta urológica.
            </p>
            <ul className="space-y-3">
              {preparacao.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm"
                  data-aos="fade-up"
                  data-aos-delay={i * 40}
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/post/imgid12_01.webp" alt="Preparação para exame urológico" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-3.webp" alt="Dr. Érico Diógenes, exame de próstata Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Rastreamento especializado em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O rastreamento do câncer de próstata não é apenas sobre fazer um exame de sangue. É sobre interpretar corretamente os resultados, conhecer os fatores de risco individuais e saber quando aprofundar a investigação, e quando tranquilizar o paciente.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes conduz o rastreamento prostático de forma completa e individualizada. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia, ele associa PSA, toque retal, ressonância magnética e biópsia guiada por imagem quando necessário, garantindo diagnósticos precisos e evitando tanto o subtratamento quanto intervenções desnecessárias.
              </p>
              <p>
                <strong className="text-brand-navy">Não adie o exame de próstata.</strong> O câncer de próstata detectado precocemente tem taxa de cura superior a 90%. Detectado tardiamente, as opções são mais limitadas e o tratamento, mais complexo.
              </p>
            </div>
            <Link href="/dr-erico-diogenes" className="btn-primary mt-8">
              Conhecer o Dr. Érico
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE O EXAME DE PRÓSTATA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Agende seu exame de próstata em Fortaleza com Dr. Érico Diógenes" />
    </>
  )
}
