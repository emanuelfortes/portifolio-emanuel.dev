import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Disfunção Erétil Fortaleza | Tratamento — Dr. Érico Diógenes' },
  description:
    'Disfunção erétil em Fortaleza: causas, investigação cardiovascular e tratamento com Dr. Érico Diógenes. A DE afeta 50% dos homens acima de 40 anos e tem solução eficaz.',
  alternates: { canonical: '/saude-masculina/disfuncao-eretil' },
  openGraph: {
    title: 'Disfunção Erétil Fortaleza | Dr. Érico Diógenes',
    description: 'A disfunção erétil é o primeiro sinal de doença cardiovascular em muitos homens. Diagnóstico e tratamento completo em Fortaleza com Dr. Érico Diógenes.',
    url: '/saude-masculina/disfuncao-eretil',
  },
}

const causas = [
  {
    tipo: 'Causas Vasculares',
    freq: '70% dos casos orgânicos',
    desc: 'Aterosclerose das artérias penianas é a causa mais comum. As artérias do pênis têm diâmetro menor que as coronárias: a doença cardiovascular se manifesta na ereção antes de causar infarto ou AVC. A DE é um marcador precoce de risco cardiovascular.',
    cor: 'border-l-4 border-red-400 bg-red-50',
  },
  {
    tipo: 'Causas Hormonais',
    freq: 'Testosterona baixa, prolactina elevada',
    desc: 'O hipogonadismo (baixa testosterona) reduz a libido e compromete a qualidade das ereções. Hiperprolactinemia por tumores hipofisários é causa rara mas reversível. A avaliação hormonal é obrigatória na investigação da DE.',
    cor: 'border-l-4 border-brand-gold bg-brand-gold/5',
  },
  {
    tipo: 'Causas Neurológicas',
    freq: 'Diabetes, lesão medular, cirurgias pélvicas',
    desc: 'Diabetes é a causa neurológica mais frequente: neuropatia periférica compromete os nervos responsáveis pela ereção. Cirurgias de próstata, reto e bexiga podem lesionar os feixes neurovasculares penianos.',
    cor: 'border-l-4 border-brand-navy bg-brand-navy/5',
  },
  {
    tipo: 'Causas Psicogênicas',
    freq: 'Puras em menos de 20% dos casos',
    desc: 'Ansiedade de desempenho, depressão e estresse podem causar ou amplificar a DE. Mas atenção: a DE psicogênica pura é menos comum do que se acredita. Na maioria, há componente orgânico que se soma ao psicológico.',
    cor: 'border-l-4 border-brand-green bg-brand-green/5',
  },
]

const tratamentos = [
  {
    nome: 'Inibidores de PDE5',
    desc: 'Sildenafila (Viagra), tadalafila (Cialis) e vardenafila: mecanismo comum de vasodilatação peniana. A tadalafila em dose diária baixa é a única que permite ereção espontânea sem necessidade de timing. Eficácia de 70-80% em DE de grau leve a moderado.',
    indicacao: 'Primeira linha para maioria dos casos',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    nome: 'Injeção Intracavernosa',
    desc: 'Alprostadil injetado diretamente no corpo cavernoso produz ereção em 5-20 minutos independentemente da estimulação sexual. Eficácia superior a 80%, inclusive em casos resistentes aos iPDE5. Técnica simples aprendida pelo próprio paciente.',
    indicacao: 'Falha ou contraindicação aos iPDE5',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
  {
    nome: 'Implante Peniano (Prótese)',
    desc: 'Prótese maleável ou inflável implantada cirurgicamente no corpo cavernoso. Solução definitiva com satisfação do paciente superior a 90%. Indicada para DE refratária a outros tratamentos ou após radioterapia e prostatectomia.',
    indicacao: 'DE refratária ou pós-tratamento oncológico',
    img: '/demos/dr-erico/img/post/imgid04_02.webp',
  },
]

const investigacao = [
  'Glicemia de jejum e HbA1c (excluir diabetes)',
  'Perfil lipídico completo (risco cardiovascular)',
  'Testosterona total e livre matinal (hormonal)',
  'Prolactina e hormônios da tireoide',
  'PSA (avaliação prostática associada)',
  'Pressão arterial e frequência cardíaca',
  'Doppler peniano com estímulo (avaliação vascular)',
]

const faq = [
  {
    q: 'Disfunção erétil é problema psicológico ou físico?',
    a: 'Na maioria dos casos (80-90%), há componente orgânico: vascular, hormonal, neurológico ou medicamentoso. O componente psicológico puro é minoria. Dito isso, mesmo nas causas orgânicas, a ansiedade de desempenho e o impacto emocional amplificam o problema. O tratamento ideal aborda ambos os aspectos.',
  },
  {
    q: 'A disfunção erétil pode indicar problema cardíaco?',
    a: 'Sim. As artérias penianas têm diâmetro de 1-2 mm, menores que as coronárias (3-4 mm). A aterosclerose se manifesta primeiro nos vasos menores. Estudos mostram que a DE antecede o infarto agudo do miocárdio em média 3 a 5 anos. Todo homem com DE deve ter avaliação cardiovascular completa.',
  },
  {
    q: 'Viagra (sildenafila) resolve a disfunção erétil?',
    a: 'Os inibidores de PDE5 (sildenafila, tadalafila, vardenafila) são eficazes em 70-80% dos casos de DE leve a moderada. Não funcionam sem estimulação sexual e têm contraindicações importantes: uso de nitratos é contraindicação absoluta. O médico define a molécula, a dose e se o uso deve ser por demanda ou diário.',
  },
  {
    q: 'Com que idade começa a disfunção erétil?',
    a: 'A DE aumenta progressivamente com a idade: afeta cerca de 20% dos homens aos 40 anos, 40% aos 50, 60% aos 60 e mais de 70% acima dos 70 anos. Mas não é inevitável: fatores como diabetes, hipertensão, tabagismo e sedentarismo aceleram muito o processo. DE antes dos 40 anos deve levantar suspeita de causa hormonal ou neurológica específica.',
  },
  {
    q: 'A prótese peniana parece natural?',
    a: 'A prótese peniana inflável, quando implantada corretamente, produz ereção de aparência e sensação próximas ao natural. O mecanismo fica completamente dentro do corpo, sem partes visíveis externamente. A taxa de satisfação do paciente e da parceira é superior a 90%. O orgasmo, a sensibilidade peniana e a ejaculação são preservados.',
  },
  {
    q: 'Existe algum tratamento definitivo para a disfunção erétil?',
    a: 'O tratamento da causa subjacente pode ser curativo em casos selecionados: correção do hipogonadismo com testosterona, revascularização peniana em pacientes jovens com obstrução arterial focal, ou tratamento da depressão. Para a maioria dos casos de DE orgânica estabelecida, o tratamento é de controle (iPDE5, injeção) ou cirúrgico definitivo (prótese).',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
    { '@type': 'ListItem', position: 3, name: 'Disfunção Erétil', item: 'https://drericodiogenes.com.br/saude-masculina/disfuncao-eretil' },
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

export default function DisfuncaoEretil() {
  return (
    <>
      <MedicalWebPageSchema
        name="Disfunção Erétil em Fortaleza: Diagnóstico e Tratamento"
        description="Disfunção erétil em Fortaleza: causas vasculares, hormonais e neurológicas, investigação cardiovascular e tratamento com Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/saude-masculina/disfuncao-eretil"
        specialty="Urology"
      />



      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Andrologia · Saúde Cardiovascular · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                A disfunção erétil aparece na cama.{' '}
                <span className="text-brand-gold">Mas o problema pode estar no coração.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                Em 70% dos casos, a disfunção erétil tem causa vascular: as artérias do pênis são menores que as coronárias e se obstruem primeiro. A DE antecede o infarto em média 3 a 5 anos. Investigar e tratar pode salvar a vida do paciente.
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
            <img src="/demos/dr-erico/img/dr-erico-foto-5.webp" alt="Disfunção erétil Fortaleza" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Diagnóstico diferencial</p>
            <h2 className="section-title mt-2">AS CAUSAS DA DISFUNÇÃO ERÉTIL</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Tratar a DE com iPDE5 sem investigar a causa é mascarar um sintoma que pode ser sinal de doença sistêmica grave. O diagnóstico correto define o tratamento mais eficaz e pode revelar condições que precisam de atenção imediata.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {causas.map((c, i) => (
              <div key={c.tipo} className={`rounded-2xl p-6 ${c.cor}`} data-aos="fade-up" data-aos-delay={i * 70}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-lg text-brand-navy">{c.tipo}</h3>
                  <span className="text-xs bg-white rounded-full px-3 py-1 font-medium shrink-0 ml-3">{c.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação completa</p>
            <h2 className="section-title mt-2">INVESTIGAÇÃO DA DISFUNÇÃO ERÉTIL</h2>
            <p className="text-brand-muted mt-4 mb-6">
              O andrologista não trata apenas a ereção: investiga o homem como um todo. Esses são os exames que compõem a avaliação básica de um paciente com DE:
            </p>
            <ul className="space-y-3">
              {investigacao.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Do medicamento à prótese</p>
            <h2 className="section-title mt-2">OPÇÕES DE TRATAMENTO</h2>
            <div className="mt-6 space-y-4">
              {tratamentos.map((t, i) => (
                <div key={t.nome} className="bg-white rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.nome} className="h-28 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-display text-base text-brand-navy">{t.nome}</h3>
                    <p className="text-xs text-brand-gold font-medium mt-1">{t.indicacao}</p>
                    <p className="text-xs text-brand-muted mt-2">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Andrologia especializada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A consulta de andrologia começa muito antes de prescrever um medicamento. O Dr. Érico Diógenes conduz uma anamnese detalhada sobre histórico sexual, doenças associadas, medicamentos em uso e fatores de risco cardiovascular. Exames hormonais, metabólicos e de imagem (Doppler peniano) complementam a avaliação.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico oferece desde o tratamento medicamentoso com iPDE5 até a indicação de prótese peniana para casos refratários, passando pela instrução de injeção intracavernosa para pacientes que necessitam de alternativa mais potente. Cada tratamento é ajustado ao estilo de vida, às preferências e à condição clínica do paciente.
              </p>
              <p>
                A consulta de andrologia é sigilosa, sem julgamentos e com foco total na qualidade de vida do homem.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/saude-masculina/baixa-testosterona" className="btn-silver">Baixa Testosterona</Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, disfunção erétil Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE DISFUNÇÃO ERÉTIL</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Disfunção erétil tem tratamento eficaz. Consulte Dr. Érico em Fortaleza." />
    </>
  )
}
