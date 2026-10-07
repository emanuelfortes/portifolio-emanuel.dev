import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Câncer de Bexiga Fortaleza | Diagnóstico e Tratamento — Dr. Érico Diógenes' },
  description:
    'Câncer de bexiga em Fortaleza: sangue na urina, diagnóstico por cistoscopia, tratamento endoscópico com BCG e cistectomia robótica. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/uro-oncologia/cancer-bexiga' },
  openGraph: {
    title: 'Câncer de Bexiga Fortaleza | Dr. Érico Diógenes',
    description: 'Câncer de bexiga: sintomas, diagnóstico, tratamento com RTU e BCG intravesical, e quando indicar cistectomia. Dr. Érico Diógenes em Fortaleza.',
    url: '/condicoes-urologicas/uro-oncologia/cancer-bexiga',
  },
}

const estadios = [
  {
    grupo: 'Não Músculo-Invasivo (NMIB)',
    estadio: 'Ta, T1, Tis (carcinoma in situ)',
    desc: 'Representa 75% dos diagnósticos. O tumor ainda não invadiu a camada muscular. Tratamento endoscópico (RTU de bexiga) com alta taxa de sucesso, mas recidiva frequente exige vigilância rigorosa.',
    tto: 'RTU de bexiga + instilação intravesical de BCG ou quimioterapia',
    cor: 'bg-brand-green/10 border-l-4 border-brand-green',
  },
  {
    grupo: 'Músculo-Invasivo (MIB)',
    estadio: 'T2, T3 (músculo e perivesical)',
    desc: 'O tumor invadiu a camada muscular. Representa a mudança de paradigma no tratamento: cistectomia radical é necessária. A sobrevida cai significativamente em relação ao estágio superficial.',
    tto: 'Quimioterapia neoadjuvante + cistectomia radical (robótica)',
    cor: 'bg-brand-gold/10 border-l-4 border-brand-gold',
  },
  {
    grupo: 'Localmente Avançado / Metastático',
    estadio: 'T4, N+ ou M1',
    desc: 'Invasão de estruturas adjacentes ou disseminação para linfonodos e órgãos distantes. Tratamento multimodal com quimioterapia, imunoterapia e cirurgia paliativa em casos selecionados.',
    tto: 'Quimioterapia baseada em cisplatina + imunoterapia',
    cor: 'bg-red-50 border-l-4 border-red-400',
  },
]

const tratamentos = [
  {
    nome: 'RTU de Bexiga (Ressecção Transuretral)',
    indicacao: 'Tumores não músculo-invasivos',
    desc: 'Procedimento endoscópico sem incisão: ressecção do tumor pela uretra sob anestesia. É ao mesmo tempo diagnóstico (permite análise histológica completa) e terapêutico. Procedimento ambulatorial ou com curta internação.',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    nome: 'BCG Intravesical',
    indicacao: 'NMIB de alto risco após RTU',
    desc: 'O bacilo de Calmette-Guérin (BCG) instilado diretamente na bexiga é a imunoterapia mais antiga e mais eficaz da oncologia. Estimula o sistema imune local a destruir células tumorais residuais. Reduz em até 32% o risco de progressão para invasão muscular.',
    img: '/demos/dr-erico/img/post/imgid03_02.webp',
  },
  {
    nome: 'Cistectomia Radical Robótica',
    indicacao: 'Tumor músculo-invasivo',
    desc: 'Remoção da bexiga com sistema Da Vinci, linfadenectomia pélvica ampliada e reconstrução urinária. O procedimento mais complexo da urologia, hoje realizado com mínimas incisões, menos sangramento e recuperação mais rápida.',
    img: '/demos/dr-erico/img/dr-erico-foto-7.webp',
  },
]

const vigilancia = [
  'Cistoscopia 3 meses após RTU inicial (obrigatória)',
  'A cada 3 meses nos primeiros 2 anos (tumores de alto risco)',
  'A cada 6 meses do 3o ao 5o ano',
  'Anualmente após o 5o ano (se sem recidiva)',
  'Citologia urinária em cada consulta',
  'Tomografia anual para avaliar trato urinário superior',
]

const faq = [
  {
    q: 'O sangue na urina sempre indica câncer de bexiga?',
    a: 'Não. Sangue na urina tem muitas causas: infecção urinária, cálculo renal, trauma, hiperplasia prostática. Mas o câncer de bexiga sempre deve ser excluído, especialmente em fumantes e pessoas acima de 50 anos. A hematúria do câncer de bexiga costuma ser indolor, intermitente e macroscópica (visível). Todo episódio de sangue na urina sem causa identificada deve ser investigado com cistoscopia.',
  },
  {
    q: 'O câncer de bexiga é hereditário?',
    a: 'A maioria dos casos não é hereditária. É uma doença predominantemente ambiental. O tabagismo é o fator de risco mais importante, responsável por cerca de 50% dos casos. Exposição ocupacional a aminas aromáticas (indústria de borracha, tintas, corantes) é o segundo maior fator. A predisposição genética existe mas é rara.',
  },
  {
    q: 'O que é o BCG e como funciona no tratamento da bexiga?',
    a: 'O BCG (bacilo de Calmette-Guérin) é a mesma vacina usada contra a tuberculose, adaptada para uso intravesical. Quando instilado na bexiga, induz uma resposta imune local intensa que ataca células tumorais residuais. É considerado o agente intravesical mais eficaz disponível e reduz significativamente o risco de recidiva e progressão dos tumores superficiais de alto risco.',
  },
  {
    q: 'Por que o câncer de bexiga recidiva tanto?',
    a: 'O epitélio da bexiga (urotélio) é toda a superfície interna que reveste a bexiga e que sofreu exposição crônica aos carcinógenos urinários. Mesmo após a remoção do tumor, o campo urotélico permanece sob risco. Isso explica por que tumores superficiais recidivam em 50-70% dos casos e exigem vigilância endoscópica por toda a vida.',
  },
  {
    q: 'É possível viver normalmente sem a bexiga?',
    a: 'Sim. Após a cistectomia, uma nova forma de armazenar e eliminar a urina é criada: a neobexiga (micção natural pela uretra), o conduto ileal (bolsa externa) ou o reservatório continente (cateterismo pelo umbigo). A adaptação varia conforme o tipo de reconstrução, mas a grande maioria dos pacientes retoma uma vida ativa e satisfatória.',
  },
  {
    q: 'Parar de fumar ajuda quem já tem câncer de bexiga?',
    a: 'Sim. Mesmo após o diagnóstico, parar de fumar reduz o risco de recidiva e melhora a resposta ao tratamento com BCG. Fumantes ativos têm risco 2-3 vezes maior de recidiva após RTU comparado a ex-fumantes. A cessação do tabagismo é a intervenção mais impactante no controle da doença.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uro-Oncologia', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia' },
    { '@type': 'ListItem', position: 3, name: 'Câncer de Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-bexiga' },
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

export default function CancerBexiga() {
  return (
    <>
      <MedicalWebPageSchema
        name="Câncer de Bexiga em Fortaleza: Diagnóstico e Tratamento"
        description="Câncer de bexiga em Fortaleza: sangue na urina, cistoscopia, RTU, BCG intravesical e cistectomia robótica. Dr. Érico Diógenes, uro-oncologista."
        url="https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-bexiga"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Uro-Oncologia · Bexiga · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Sangue na urina sem dor.{' '}
                <span className="text-brand-gold">Esse é o sinal que o câncer de bexiga usa para avisar. Não ignore.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                O câncer de bexiga é o quarto tumor mais comum nos homens brasileiros. O principal sintoma é a hematúria macroscópica indolor: sangue visível na urina, frequentemente intermitente, que muitos pacientes ignoram por sumir sozinho. Não some: volta. E cada episódio ignorado pode ser meses de progressão silenciosa.
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
              src="/demos/dr-erico/img/dr-erico-foto-5.webp"
              alt="Câncer de bexiga em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — ESTADIOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">A distinção mais importante</p>
            <h2 className="section-title mt-2">SUPERFICIAL OU INVASIVO: A FRONTEIRA QUE MUDA TUDO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              No câncer de bexiga, a divisão entre tumor não músculo-invasivo e músculo-invasivo não é apenas um detalhe técnico: é a fronteira que separa o tratamento endoscópico da cirurgia radical, e a sobrevida de 90% da sobrevida de 50%.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {estadios.map((e, i) => (
              <div key={e.grupo} className={`rounded-2xl p-6 ${e.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h3 className="font-display text-lg text-brand-navy">{e.grupo}</h3>
                  <span className="text-xs bg-white/80 rounded-full px-3 py-1 font-medium">{e.estadio}</span>
                </div>
                <p className="text-sm text-brand-muted">{e.desc}</p>
                <p className="text-xs font-semibold text-brand-navy mt-3">Tratamento: {e.tto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — TRATAMENTOS + VIGILÂNCIA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <p className="eyebrow">Abordagens terapêuticas</p>
            <h2 className="section-title mt-2">DO ENDOSCÓPIO AO ROBÔ</h2>
            <div className="mt-6 space-y-4">
              {tratamentos.map((t, i) => (
                <div key={t.nome} className="bg-white rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.nome} className="h-32 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-display text-base text-brand-navy">{t.nome}</h3>
                    <p className="text-xs text-brand-gold font-medium mt-1">Indicação: {t.indicacao}</p>
                    <p className="text-xs text-brand-muted mt-2">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">A doença que exige vigilância permanente</p>
            <h2 className="section-title mt-2">PROTOCOLO DE VIGILÂNCIA</h2>
            <p className="text-brand-muted mt-4 mb-6">
              O câncer de bexiga superficial tem alto risco de recidiva: até 70% dos pacientes terão novo tumor nos primeiros 5 anos. Por isso, a cistoscopia de vigilância regular não é opcional, é parte do tratamento.
            </p>
            <ul className="space-y-3">
              {vigilancia.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-5 bg-brand-navy rounded-2xl text-white text-sm" data-aos="fade-up">
              <p className="font-display text-base text-brand-gold mb-2">Parar de fumar é tratamento</p>
              <p className="text-white/80">Pacientes que param de fumar após o diagnóstico têm risco 2-3 vezes menor de recidiva. A cessação do tabagismo é a intervenção mais impactante que o paciente pode fazer por si mesmo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Uro-oncologista em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O manejo do câncer de bexiga exige o domínio de técnicas que vão do simples ao extremamente complexo: da ressecção endoscópica sob visão direta à cistectomia radical robótica com reconstrução urinária intracorpórea. Em cada estágio da doença, a decisão terapêutica é diferente e exige experiência específica.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza RTUs de bexiga, conduz programas de instilação de BCG e indica cistectomia radical robótica quando necessário. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia, ele acompanha o paciente desde o diagnóstico inicial até o protocolo de vigilância de longo prazo.
              </p>
              <p>
                Sangue na urina uma vez já é suficiente para investigar. Não espere acontecer de novo.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/tratamentos/cirurgia-robotica/bexiga" className="btn-silver">
                Cistectomia Robótica
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-3.webp" alt="Dr. Érico Diógenes, câncer de bexiga Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE CÂNCER DE BEXIGA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Sangue na urina é sinal de alerta. Avalie com Dr. Érico em Fortaleza." />
    </>
  )
}
