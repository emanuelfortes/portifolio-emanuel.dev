import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Câncer de Rim Fortaleza | Diagnóstico e Tratamento — Dr. Érico Diógenes' },
  description:
    'Câncer de rim em Fortaleza: tipos de tumor renal, diagnóstico por imagem, tratamento cirúrgico com preservação do néfron e acompanhamento. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/uro-oncologia/cancer-rim' },
  openGraph: {
    title: 'Câncer de Rim Fortaleza | Dr. Érico Diógenes',
    description: 'Entenda o câncer renal: tipos, diagnóstico e tratamento com cirurgia robótica minimamente invasiva. Dr. Érico Diógenes, referência em uro-oncologia no Ceará.',
    url: '/condicoes-urologicas/uro-oncologia/cancer-rim',
  },
}

const tiposTumor = [
  {
    tipo: 'Carcinoma de Células Claras',
    freq: '70-75% dos cânceres renais',
    desc: 'O subtipo mais comum. Originado das células do túbulo proximal. Tende a ser vascularizado e responsivo à imunoterapia nos casos metastáticos. Frequentemente associado à mutação do gene VHL.',
    prog: 'Prognóstico variável — depende do estágio e grau de Fuhrman',
  },
  {
    tipo: 'Carcinoma Papilar',
    freq: '15-20% dos cânceres renais',
    desc: 'Segundo subtipo mais comum. Se divide em tipo 1 (menos agressivo, associado à mutação MET) e tipo 2 (mais agressivo, associado à mutação HLRCC). Múltiplos e bilaterais em casos hereditários.',
    prog: 'Geralmente melhor prognóstico que o de células claras',
  },
  {
    tipo: 'Carcinoma Cromófobo',
    freq: '5% dos cânceres renais',
    desc: 'Originado das células intercaladas do ducto coletor. Crescimento lento, raramente metastatiza quando localizado. Pode ser difícil de distinguir do oncocitoma benigno.',
    prog: 'Excelente prognóstico — raramente fatal quando localizado',
  },
  {
    tipo: 'Oncocitoma',
    freq: '5-7% das massas renais',
    desc: 'Tumor benigno que pode ter aparência idêntica ao carcinoma cromófobo na imagem. Diagnóstico definitivo apenas pela histologia. Em casos inconclusivos, pode ser indicada cirurgia diagnóstica e terapêutica.',
    prog: 'Benigno — não metastatiza',
  },
]

const estadios = [
  { estadio: 'T1 (até 7 cm, confinado ao rim)', tto: 'Nefrectomia parcial robótica ou vigilância ativa para T1a (<4 cm)', cor: 'text-brand-green' },
  { estadio: 'T2 (mais de 7 cm, confinado ao rim)', tto: 'Nefrectomia radical robótica ou laparoscópica', cor: 'text-brand-gold' },
  { estadio: 'T3 (invasão de veia renal/cava ou gordura perinéfrica)', tto: 'Nefrectomia radical, eventualmente com trombectomia de veia cava', cor: 'text-orange-500' },
  { estadio: 'T4/M1 (invasão de estruturas adjacentes ou metástases)', tto: 'Nefrectomia de debulking + imunoterapia/terapia-alvo sistêmica', cor: 'text-red-500' },
]

const faq = [
  {
    q: 'Câncer de rim tem sintomas?',
    a: 'Nos estágios iniciais, raramente. Mais de 50% dos tumores renais são descobertos incidentalmente em ultrassonografias ou tomografias feitas por outros motivos. Quando sintomático, o câncer renal pode causar sangue na urina (hematúria), dor no flanco e massa palpável no abdômen. Esses sintomas costumam aparecer em tumores maiores ou mais avançados.',
  },
  {
    q: 'Todo nódulo renal é câncer?',
    a: 'Não. Cistos renais simples são muito comuns e praticamente sempre benignos. Massas sólidas requerem investigação adicional. O sistema de classificação Bosniak (para cistos) e as características da massa na TC e RM orientam a probabilidade de malignidade. Alguns tumores sólidos são benignos: oncocitomas e angiomiolipomas não precisam de cirurgia na maioria dos casos.',
  },
  {
    q: 'Qual é a diferença entre nefrectomia parcial e radical?',
    a: 'Na nefrectomia parcial, apenas a parte do rim com o tumor é removida — preservando a maior parte do órgão. Na nefrectomia radical, o rim inteiro é retirado. A parcial é preferida sempre que tecnicamente possível, pois preserva a função renal de longo prazo e reduz o risco de insuficiência renal futura. Tumores T1 (<7 cm) devem ser operados com nefrectomia parcial sempre que possível.',
  },
  {
    q: 'O câncer de rim pode ser tratado sem cirurgia?',
    a: 'Em casos selecionados: tumores muito pequenos (menos de 2 cm) em pacientes idosos ou com comorbidades graves podem ser submetidos a vigilância ativa. A ablação por radiofrequência ou crioablação guiada por tomografia é alternativa para pacientes que não toleram cirurgia. Para doença metastática, imunoterapia (nivolumabe, ipilimumabe) e inibidores de tirosino-quinase (sunitinibe, pazopanibe) são os pilares do tratamento sistêmico.',
  },
  {
    q: 'O câncer de rim responde à quimioterapia?',
    a: 'O carcinoma de células renais é classicamente resistente à quimioterapia convencional. O tratamento sistêmico baseia-se em imunoterapia (inibidores de checkpoint PD-1/PD-L1 e CTLA-4) e terapia-alvo (inibidores de VEGF e mTOR). Combinações de imunoterapia como nivolumabe + ipilimumabe são o padrão atual para doença metastática de risco intermediário/alto.',
  },
  {
    q: 'Existe câncer de rim hereditário?',
    a: 'Sim. Cerca de 5% dos cânceres renais são hereditários. As principais síndromes são: síndrome de Von Hippel-Lindau (VHL), leiomiomatose hereditária com carcinoma de células renais (HLRCC) e síndrome de Birt-Hogg-Dubé. Tumores bilaterais, múltiplos ou em pacientes jovens devem levar à investigação genética.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uro-Oncologia', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia' },
    { '@type': 'ListItem', position: 3, name: 'Câncer de Rim', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-rim' },
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

export default function CancerRim() {
  return (
    <>
      <MedicalWebPageSchema
        name="Câncer de Rim em Fortaleza: Diagnóstico e Tratamento"
        description="Tipos de tumor renal, diagnóstico, estadiamento e tratamento cirúrgico com preservação do néfron. Dr. Érico Diógenes, especialista em uro-oncologia em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-rim"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Carcinoma Renal · Uro-Oncologia · Fortaleza</p>
              <h1 className="section-title mt-2">
                Mais de 50% dos cânceres de rim são descobertos por acidente.{' '}
                <span className="text-brand-gold">Quando detectado cedo, a cura supera 90%.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O câncer renal raramente avisa. Cresce silencioso, sem dor e sem sintomas, até ser encontrado em um ultrassom feito por outro motivo. Essa característica o torna ao mesmo tempo traiçoeiro e tratável: quando localizado, a nefrectomia parcial robótica remove o tumor e preserva o rim.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Consultar em Fortaleza
                </a>
                <Link href="/tratamentos/cirurgia-robotica/rim" className="btn-silver">
                  Ver Cirurgia Robótica do Rim
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/post/imgid04_02.webp"
              alt="Câncer de rim em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — TIPOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Patologia e biologia</p>
            <h2 className="section-title mt-2">TIPOS DE TUMOR RENAL</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O termo "câncer de rim" engloba tumores com origens celulares, comportamentos e prognósticos muito diferentes. A histologia, definida pela análise do tumor após a cirurgia, é determinante para o planejamento do acompanhamento e do tratamento sistêmico.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {tiposTumor.map((t, i) => (
              <div key={t.tipo} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-lg text-brand-navy">{t.tipo}</h3>
                  <span className="text-xs bg-white rounded-full px-3 py-1 shadow-sm font-medium shrink-0 ml-2">{t.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <p className="text-xs text-brand-gold font-medium mt-3">{t.prog}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — ESTADIAMENTO E TRATAMENTO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Estadiamento define o tratamento</p>
            <h2 className="section-title mt-2">DO ESTÁGIO AO TRATAMENTO</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              O estadiamento do tumor renal pelo sistema TNM é o principal determinante da conduta terapêutica. Entender em qual estágio o tumor foi diagnosticado é o que define a extensão da cirurgia, a necessidade de tratamento sistêmico e as perspectivas de cura.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {estadios.map((e, i) => (
              <div key={e.estadio} className="bg-white rounded-2xl p-5 shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start gap-4">
                  <Check size={18} className={`mt-0.5 shrink-0 ${e.cor}`} />
                  <div>
                    <h3 className={`font-display text-base ${e.cor}`}>{e.estadio}</h3>
                    <p className="text-sm text-brand-muted mt-1">{e.tto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center" data-aos="fade-up">
            <Link href="/tratamentos/cirurgia-robotica/rim" className="btn-primary">
              Saiba mais sobre Cirurgia Robótica do Rim
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-6.webp" alt="Dr. Érico Diógenes, câncer de rim Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Cirurgia renal especializada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A nefrectomia parcial robótica, que preserva o rim enquanto remove o tumor, representa o padrão ouro atual para cânceres renais localizados. Cada centímetro de rim preservado é importante: reduz o risco de insuficiência renal futura, hipertensão arterial e eventos cardiovasculares de longo prazo.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza nefrectomias parciais robóticas aplicando técnicas de isquemia mínima, garantindo que o rim fique sem fluxo sanguíneo pelo menor tempo possível durante a ressecção. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia e cirurgia minimamente invasiva, ele avalia cada tumor individualmente para definir a abordagem mais conservadora e mais curativa ao mesmo tempo.
              </p>
              <p>
                Descobriu um nódulo renal em exame de imagem? Não espere os sintomas aparecerem. Agende uma avaliação especializada.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Avaliação
              </a>
              <Link href="/condicoes-urologicas/uro-oncologia" className="btn-silver">
                Uro-Oncologia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE CÂNCER DE RIM</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Nódulo no rim? Avalie com Dr. Érico Diógenes em Fortaleza antes que avance." />
    </>
  )
}
