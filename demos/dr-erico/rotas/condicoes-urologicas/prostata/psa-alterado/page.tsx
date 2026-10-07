import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'PSA Alterado: O que Fazer? | Dr. Érico Diógenes, Fortaleza' },
  description:
    'PSA alterado em Fortaleza: entenda o que significa, quais as causas além do câncer e quais são os próximos passos. Avaliação com Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/prostata/psa-alterado' },
  openGraph: {
    title: 'PSA Alterado: O que Fazer? | Dr. Érico Diógenes, Fortaleza',
    description: 'PSA elevado não significa necessariamente câncer. Entenda as causas e os próximos passos com Dr. Érico Diógenes em Fortaleza.',
    url: '/condicoes-urologicas/prostata/psa-alterado',
  },
}

const causas = [
  { causa: 'Hiperplasia Prostática Benigna (HPB)', detalhe: 'O aumento benigno da próstata eleva naturalmente o PSA. É a causa mais comum de PSA elevado em homens acima de 50 anos.' },
  { causa: 'Prostatite', detalhe: 'Inflamação ou infecção da próstata pode elevar significativamente o PSA, às vezes a valores muito altos, de forma temporária.' },
  { causa: 'Câncer de Próstata', detalhe: 'Tumores prostáticos produzem PSA em maior quantidade. Por isso o PSA é o principal marcador de rastreamento do câncer de próstata.' },
  { causa: 'Ejaculação recente', detalhe: 'A atividade sexual pode elevar o PSA temporariamente. O exame deve ser feito com abstinência de 48 horas.' },
  { causa: 'Exercício físico intenso', detalhe: 'Atividades como ciclismo ou corrida de longa distância podem elevar o PSA transitoriamente.' },
  { causa: 'Biópsia ou procedimentos urológicos', detalhe: 'Qualquer manipulação da próstata eleva o PSA. O exame deve ser feito antes de qualquer procedimento diagnóstico.' },
]

const proximosPassos = [
  {
    num: '01',
    titulo: 'Não entre em pânico',
    desc: 'PSA elevado não é sinônimo de câncer. A maioria dos homens com PSA alterado tem HPB ou prostatite, condições benígnas e tratáveis.',
  },
  {
    num: '02',
    titulo: 'Consulte um Urologista',
    desc: 'Apenas o urologista pode interpretar o PSA no contexto clínico correto, levando em conta idade, histórico, exame físico e outros fatores.',
  },
  {
    num: '03',
    titulo: 'Exames Complementares',
    desc: 'Conforme avaliação, o médico pode solicitar PSA livre/total, ressonância magnética multiparamétrica da próstata ou biópsia guiada por imagem.',
  },
  {
    num: '04',
    titulo: 'Plano Individualizado',
    desc: 'Com base em todos os dados, o especialista define se o caso requer vigilância ativa, tratamento medicamentoso ou intervenção cirúrgica.',
  },
]

const faq = [
  {
    q: 'Qual é o valor normal do PSA?',
    a: 'O PSA "normal" varia com a idade. Em linhas gerais: até 2,5 ng/mL para homens entre 40-49 anos; até 3,5 ng/mL entre 50-59 anos; até 4,5 ng/mL entre 60-69 anos; até 6,5 ng/mL acima de 70 anos. Porém, esses valores são referências, o urologista interpreta o PSA sempre em conjunto com outros fatores.',
  },
  {
    q: 'PSA de 5 significa câncer?',
    a: 'Não necessariamente. Um PSA de 5 ng/mL pode ser causado por HPB, prostatite ou outros fatores benignos. A probabilidade de câncer aumenta com valores mais altos, mas apenas a investigação completa, incluindo toque retal, ressonância e eventualmente biópsia, confirma ou exclui o diagnóstico.',
  },
  {
    q: 'O que é PSA livre e PSA total?',
    a: 'O PSA total mede toda a quantidade de PSA no sangue. O PSA livre é a fração não ligada a proteínas. A relação PSA livre/total ajuda a diferenciar HPB de câncer: uma proporção baixa (menos de 10-15%) aumenta a suspeita de malignidade.',
  },
  {
    q: 'Com que frequência devo dosar o PSA?',
    a: 'Homens acima de 40 anos devem dosar o PSA anualmente. Com histórico familiar de câncer de próstata, o início deve ser aos 35-40 anos. O urologista pode ajustar a frequência conforme os valores e a evolução ao longo do tempo (velocidade de ascensão do PSA).',
  },
  {
    q: 'O que é biópsia de próstata e quando é indicada?',
    a: 'A biópsia é o único exame que confirma ou exclui o câncer de próstata. É indicada quando o PSA está persistentemente elevado, quando há alteração ao toque retal ou quando a ressonância magnética mostra área suspeita. Hoje, a biópsia guiada por ressonância (fusion biopsy) aumentou muito a precisão do diagnóstico.',
  },
  {
    q: 'O PSA pode ser usado para acompanhar o tratamento do câncer?',
    a: 'Sim. Após tratamento cirúrgico do câncer de próstata (prostatectomia radical), o PSA deve cair a valores indetectáveis. A monitorização periódica do PSA é fundamental para detectar precocemente qualquer recidiva da doença.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata' },
    { '@type': 'ListItem', position: 3, name: 'PSA Alterado', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata/psa-alterado' },
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

export default function PsaAlterado() {
  return (
    <>
      <MedicalWebPageSchema
        name="PSA Alterado: O que Fazer, Dr. Érico Diógenes, Fortaleza"
        description="PSA alterado em Fortaleza: entenda o que significa, as causas além do câncer e os próximos passos. Avaliação especializada com Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/condicoes-urologicas/prostata/psa-alterado"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">PSA · Antígeno Prostático · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                PSA alterado:{' '}
                <span className="text-brand-gold">o que significa, o que fazer e quando se preocupar.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                Receber um resultado de PSA elevado costuma gerar ansiedade imediata. Mas PSA alto não significa, necessariamente, câncer, e entender o que esse exame realmente indica é o primeiro passo para tomar as decisões certas sobre a sua saúde.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Avaliar com Especialista
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-2.webp"
              alt="Avaliação de PSA alterado em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, CAUSAS */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Entenda o exame</p>
            <h2 className="section-title mt-2">O QUE PODE ELEVAR O PSA?</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O PSA (Antígeno Prostático Específico) é uma proteína produzida pelas células da próstata e detectada por exame de sangue. Ele aumenta naturalmente com a idade e pode ser elevado por diversas condições, a maioria delas benigna. Conheça as causas mais comuns:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {causas.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-brand-beige-light rounded-xl p-5 shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 50}
              >
                <Check size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <div>
                  <p className="font-medium text-brand-navy text-sm">{item.causa}</p>
                  <p className="text-xs text-brand-muted mt-1">{item.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, PRÓXIMOS PASSOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Passo a passo</p>
            <h2 className="section-title mt-2">O QUE FAZER COM PSA ALTERADO</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Um PSA elevado é um sinal de alerta, não um diagnóstico. A investigação correta, conduzida por um urologista experiente, define o caminho adequado para cada caso.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {proximosPassos.map((etapa, i) => (
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
            <p className="eyebrow">Diagnóstico preciso em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A interpretação correta do PSA exige muito mais do que comparar um número com uma tabela de referência. Fatores como idade, volume prostático, velocidade de ascensão do PSA, histórico familiar e achados ao toque retal compõem um quadro que apenas um especialista pode avaliar com precisão.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza a investigação completa do PSA alterado, incluindo PSA livre/total, ressonância magnética multiparamétrica da próstata e, quando indicada, biópsia guiada por imagem, garantindo o diagnóstico mais preciso possível e evitando tanto o subtratamento quanto intervenções desnecessárias.
              </p>
              <p>
                Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia, o Dr. Érico conduz cada investigação com rigor técnico e transparência, explicando cada etapa ao paciente e à família.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dr-erico-diogenes" className="btn-primary">Conhecer o Dr. Érico</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Avaliação</a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, PSA alterado Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE PSA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="PSA alterado? Agende sua avaliação especializada em Fortaleza" />
    </>
  )
}
