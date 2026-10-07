import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cirurgia Robótica da Bexiga Fortaleza | Cistectomia Da Vinci, Dr. Érico Diógenes' },
  description:
    'Cistectomia robótica em Fortaleza para câncer de bexiga: cirurgia minimamente invasiva com Da Vinci, derivação urinária e menor tempo de recuperação. Dr. Érico Diógenes.',
  alternates: { canonical: '/tratamentos/cirurgia-robotica/bexiga' },
  openGraph: {
    title: 'Cirurgia Robótica da Bexiga Fortaleza | Dr. Érico Diógenes',
    description: 'Cistectomia radical robótica em Fortaleza: o tratamento mais avançado para o câncer de bexiga músculo-invasivo.',
    url: '/tratamentos/cirurgia-robotica/bexiga',
  },
}

const estagios = [
  {
    estagio: 'Câncer Não Músculo-Invasivo (NMIB)',
    desc: 'Tumor confinado ao revestimento interno da bexiga. Tratado com ressecção endoscópica (RTU de bexiga) e instilação de BCG. Acompanhamento rigoroso é essencial, pois há alto risco de recidiva.',
    cor: 'bg-brand-green/10 border-l-4 border-brand-green',
  },
  {
    estagio: 'Câncer Músculo-Invasivo (MIB)',
    desc: 'Tumor que invadiu a camada muscular da bexiga. Exige cistectomia radical (remoção da bexiga), o padrão ouro do tratamento. A quimioterapia neoadjuvante pode ser indicada antes da cirurgia.',
    cor: 'bg-brand-gold/10 border-l-4 border-brand-gold',
  },
  {
    estagio: 'Câncer Metastático',
    desc: 'Doença com comprometimento de linfonodos ou órgãos distantes. Tratamento sistêmico com quimioterapia, imunoterapia ou terapias-alvo. Cirurgia tem papel paliativo em casos selecionados.',
    cor: 'bg-red-50 border-l-4 border-red-400',
  },
]

const derivacoes = [
  {
    tipo: 'Neobexiga Ortotópica',
    desc: 'Uma nova bexiga é criada com segmento do intestino delgado e conectada à uretra, permitindo micção natural. É a opção que mais preserva a qualidade de vida, mas exige reabilitação e acompanhamento rigoroso.',
    vantagem: 'Micção natural sem bolsa externa',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    tipo: 'Conduto Ileal (Bricker)',
    desc: 'Segmento intestinal conduz a urina para um estoma na parede abdominal, coletada por bolsa externa. É a derivação mais utilizada mundialmente, simples, confiável e com menor complexidade de reabilitação.',
    vantagem: 'Técnica mais consolidada e confiável',
    img: '/demos/dr-erico/img/post/imgid03_02.webp',
  },
  {
    tipo: 'Reservatório Continente',
    desc: 'Uma bolsa interna criada com intestino é esvaziada pelo paciente por sondagem, sem estoma visível. Exige habilidade técnica do paciente para autocateterismo.',
    vantagem: 'Sem bolsa externa, discreta',
    img: '/demos/dr-erico/img/post/imgid02_01.webp',
  },
]

const vantagens = [
  'Incisões menores, menor cicatriz e dor pós-operatória',
  'Menor tempo de internação comparado à cirurgia aberta',
  'Melhor visualização para linfadenectomia pélvica ampliada',
  'Menor perda de sangue e redução de transfusões',
  'Retorno mais precoce à dieta e às atividades',
  'Possibilidade de nerve-sparing em casos selecionados',
]

const faq = [
  {
    q: 'Quais são os sintomas do câncer de bexiga?',
    a: 'O sinal mais comum, e que nunca deve ser ignorado, é o sangue na urina (hematúria), especialmente quando indolor e sem infecção confirmada. Outros sintomas incluem urgência urinária, frequência aumentada e dor ao urinar. A cistoscopia é o exame diagnóstico de referência.',
  },
  {
    q: 'Todo câncer de bexiga precisa de cistectomia?',
    a: 'Não. Tumores não músculo-invasivos (superficiais) são tratados com ressecção endoscópica (RTU de bexiga) + instilação de BCG intravesical. A cistectomia radical é indicada quando o tumor invade a camada muscular da bexiga (estágio T2 ou superior), situação que representa cerca de 25% dos casos ao diagnóstico.',
  },
  {
    q: 'É possível viver sem bexiga?',
    a: 'Sim. Após a cistectomia, uma nova forma de armazenar e eliminar a urina é criada, a derivação urinária. As opções variam desde a neobexiga (que permite micção natural) até o conduto ileal com bolsa externa. A escolha depende das condições clínicas do paciente, do estadiamento e das preferências individuais.',
  },
  {
    q: 'O que é a linfadenectomia pélvica e por que ela é importante?',
    a: 'A linfadenectomia pélvica, remoção dos linfonodos da pelve, é parte essencial da cistectomia radical. Além de estadiar com precisão a doença (presença ou ausência de metástases linfonodais), tem papel terapêutico: a remoção de linfonodos comprometidos melhora os resultados oncológicos. A robótica permite uma linfadenectomia mais ampla e precisa.',
  },
  {
    q: 'O câncer de bexiga tem relação com cigarro?',
    a: 'Sim, o tabagismo é o principal fator de risco para o câncer de bexiga, responsável por aproximadamente 50% dos casos. Os carcinógenos do cigarro são filtrados pelos rins e concentrados na urina, expondo o epitélio vesical por horas. Exposição ocupacional a corantes, tintas e solventes é o segundo fator de risco mais importante.',
  },
  {
    q: 'Qual é o tempo de recuperação após cistectomia robótica?',
    a: 'A cistectomia robótica tem recuperação significativamente mais rápida que a cirurgia aberta. A internação costuma durar de 5 a 7 dias. O retorno às atividades leves ocorre em 3 a 4 semanas. A recuperação completa, incluindo a adaptação à nova forma de micção, pode levar alguns meses, especialmente com a neobexiga.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cirurgia Robótica', item: 'https://drericodiogenes.com.br/cirurgia-robotica' },
    { '@type': 'ListItem', position: 3, name: 'Cirurgia Robótica da Bexiga', item: 'https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/bexiga' },
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

export default function CirurgiaRoboticaBexiga() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cirurgia Robótica da Bexiga em Fortaleza, Cistectomia Da Vinci"
        description="Cistectomia radical robótica em Fortaleza para câncer de bexiga. Sistema Da Vinci, derivação urinária e recuperação mais rápida. Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/bexiga"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Cistectomia Robótica · Sistema Da Vinci · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Cirurgia Robótica da Bexiga:{' '}
                <span className="text-brand-gold">o tratamento mais avançado para o câncer de bexiga músculo-invasivo.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                A cistectomia radical, remoção da bexiga, é a cirurgia urológica de maior complexidade técnica. Com o sistema robótico Da Vinci, o procedimento ganha precisão cirúrgica superior, menor sangramento e recuperação mais rápida, sem abrir mão da radicalidade oncológica que o câncer de bexiga exige.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Avaliação
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-7.webp"
              alt="Cirurgia robótica da bexiga em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, ESTÁGIOS */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Entenda a doença</p>
            <h2 className="section-title mt-2">ESTÁGIOS DO CÂNCER DE BEXIGA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O tratamento do câncer de bexiga depende fundamentalmente do estágio da doença, especificamente se o tumor invadiu ou não a camada muscular da bexiga. Essa distinção determina se o tratamento será endoscópico ou cirúrgico radical.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {estagios.map((e, i) => (
              <div key={e.estagio} className={`rounded-2xl p-6 ${e.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <h3 className="font-display text-lg text-brand-navy">{e.estagio}</h3>
                <p className="text-sm text-brand-muted mt-2">{e.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 font-display italic text-brand-navy text-lg max-w-2xl mx-auto" data-aos="fade-up">
            O sangue na urina é o principal sinal de alerta. Nunca ignore, mesmo que apareça uma única vez e desapareça sozinho.
          </p>
        </div>
      </section>

      {/* SEÇÃO 3, DERIVAÇÃO URINÁRIA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Após a remoção da bexiga</p>
            <h2 className="section-title mt-2">OPÇÕES DE DERIVAÇÃO URINÁRIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Após a cistectomia, uma nova forma de armazenar e eliminar a urina precisa ser criada. A escolha da derivação urinária é uma das decisões mais importantes do tratamento e deve ser tomada em conjunto com o cirurgião, considerando as condições clínicas e as preferências do paciente.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {derivacoes.map((d, i) => (
              <div key={d.tipo} className="bg-white rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 100}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.tipo} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{d.tipo}</h3>
                  <p className="text-sm text-brand-muted mt-2">{d.desc}</p>
                  <p className="text-xs text-brand-gold font-medium mt-3">{d.vantagem}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-2.webp" alt="Dr. Érico Diógenes, cistectomia robótica Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Alta complexidade cirúrgica em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A cistectomia radical robótica é considerada a cirurgia urológica mais complexa. Exige domínio técnico de múltiplos campos: oncologia pélvica, cirurgia intestinal para confecção da derivação urinária e linfadenectomia ampliada, tudo realizado em sessão única.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza a cistectomia robótica com o sistema Da Vinci, aplicando técnicas de dissecção precisa, linfadenectomia pélvica ampliada e confecção intracorpórea da derivação urinária. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia, o Dr. Érico avalia cada paciente individualmente, discutindo abertamente as opções de derivação, os resultados esperados e os riscos cirúrgicos.
              </p>
              <p>
                A vantagem da robótica também se aplica aqui: menor sangramento, internação mais curta e melhor visualização das estruturas pélvicas, comparados à abordagem aberta convencional.
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {vantagens.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-brand-muted">
                  <Check size={14} className="mt-0.5 shrink-0 text-brand-green" />
                  {v}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/condicoes-urologicas/uro-oncologia/cancer-bexiga" className="btn-primary">Sobre o Câncer de Bexiga</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Câncer de bexiga exige especialista. Agende com Dr. Érico em Fortaleza." />
    </>
  )
}
