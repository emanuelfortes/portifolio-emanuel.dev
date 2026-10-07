import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Bexiga Hiperativa Fortaleza | Sintomas e Tratamento — Dr. Érico Diógenes' },
  description:
    'Bexiga hiperativa em Fortaleza: urgência para urinar, idas frequentes ao banheiro e escapes. Entenda as causas e as opções de tratamento com Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/bexiga/bexiga-hiperativa' },
  openGraph: {
    title: 'Bexiga Hiperativa Fortaleza | Dr. Érico Diógenes',
    description:
      'Urgência urinária, frequência e escapes têm tratamento. Conheça as opções, do comportamental ao procedimento.',
    url: '/condicoes-urologicas/bexiga/bexiga-hiperativa',
  },
}

const sintomas = [
  {
    nome: 'Urgência',
    desc: 'Vontade súbita e difícil de adiar. É o sintoma que define a condição: não é urinar muito, é não conseguir esperar.',
  },
  {
    nome: 'Frequência aumentada',
    desc: 'Ir ao banheiro mais de oito vezes ao longo do dia, mesmo bebendo uma quantidade normal de líquido.',
  },
  {
    nome: 'Noctúria',
    desc: 'Acordar uma ou mais vezes por noite para urinar, com prejuízo do sono e do descanso no dia seguinte.',
  },
  {
    nome: 'Urge-incontinência',
    desc: 'Perda de urina que acontece junto com a urgência, antes de conseguir chegar ao banheiro. Nem todos apresentam.',
  },
]

const causas = [
  {
    fator: 'Contrações involuntárias do músculo da bexiga',
    detalhe:
      'O detrusor, que é o músculo da parede vesical, contrai quando não deveria, mesmo com a bexiga longe de cheia. O cérebro interpreta isso como vontade urgente. Na maior parte dos casos não se identifica uma doença por trás, e a condição é chamada de idiopática.',
  },
  {
    fator: 'Obstrução pela próstata',
    detalhe:
      'No homem, a próstata aumentada obriga a bexiga a trabalhar contra pressão. Com o tempo o músculo fica irritável e hiperativo. Aqui os sintomas de urgência convivem com jato fraco e esforço para iniciar.',
  },
  {
    fator: 'Alterações neurológicas',
    detalhe:
      'AVC, doença de Parkinson, esclerose múltipla e lesões da medula alteram o controle nervoso da bexiga. Nesses casos fala-se em bexiga neurogênica, e o acompanhamento costuma ser conjunto com a neurologia.',
  },
  {
    fator: 'Infecção urinária',
    detalhe:
      'A inflamação da mucosa causa urgência e frequência que imitam a bexiga hiperativa. Por isso a investigação começa sempre afastando infecção: são quadros parecidos com tratamentos completamente diferentes.',
  },
  {
    fator: 'Cafeína, álcool e refrigerantes',
    detalhe:
      'São irritantes vesicais conhecidos e aumentam a produção de urina. Não causam a condição, mas pioram muito os sintomas, e a redução costuma trazer melhora perceptível em poucas semanas.',
  },
  {
    fator: 'Alterações da menopausa',
    detalhe:
      'A queda de estrogênio afeta a mucosa da uretra e da bexiga, e pode intensificar urgência e frequência. É um fator frequente, tratável e muitas vezes não considerado.',
  },
]

const tratamentos = [
  {
    etapa: '1',
    nome: 'Mudanças comportamentais',
    desc: 'Diário miccional, ajuste da ingestão de líquidos ao longo do dia, redução de cafeína e álcool, e treinamento vesical para espaçar progressivamente as idas ao banheiro. É a primeira linha e resolve uma parcela relevante dos casos.',
  },
  {
    etapa: '2',
    nome: 'Fisioterapia do assoalho pélvico',
    desc: 'Fortalecimento e coordenação da musculatura pélvica, com orientação de profissional especializado. Ajuda tanto no controle da urgência quanto na redução dos escapes.',
  },
  {
    etapa: '3',
    nome: 'Medicamentos',
    desc: 'Existem classes diferentes que atuam relaxando o músculo da bexiga ou reduzindo sua atividade involuntária. A escolha considera idade, outras doenças e os medicamentos já em uso, porque nem toda opção serve para todo paciente.',
  },
  {
    etapa: '4',
    nome: 'Procedimentos',
    desc: 'Para quem não responde às etapas anteriores, existem opções como aplicação de toxina botulínica na parede da bexiga e técnicas de neuromodulação. São reservadas a casos selecionados e avaliadas individualmente.',
  },
]

const faq = [
  {
    q: 'Bexiga hiperativa tem cura?',
    a: 'O termo mais honesto é controle. A maioria dos pacientes consegue redução importante dos sintomas e retomada da rotina normal, muitas vezes só com medidas comportamentais e fisioterapia. O acompanhamento costuma ser contínuo, com ajustes ao longo do tempo.',
  },
  {
    q: 'Qual a diferença entre bexiga hiperativa e incontinência urinária?',
    a: 'Bexiga hiperativa é a urgência e a frequência, com ou sem perda de urina. Incontinência é a perda em si, e pode ter outras causas, como o esforço ao tossir ou rir, que não envolve urgência. Os dois quadros podem coexistir, e o tratamento muda conforme o que predomina.',
  },
  {
    q: 'Acordar à noite para urinar é normal?',
    a: 'Acordar uma vez pode ser aceitável conforme a idade e o volume de líquido ingerido à noite. Duas ou mais vezes, de forma habitual, merece avaliação. Nem sempre a causa é a bexiga: produção noturna aumentada de urina, apneia do sono e uso de diuréticos também entram na conta.',
  },
  {
    q: 'Preciso parar com café completamente?',
    a: 'Não necessariamente. A orientação é reduzir e observar: muitos pacientes percebem melhora ao diminuir a quantidade e evitar o consumo no fim da tarde. O diário miccional ajuda a enxergar a relação entre o que se bebe e quando os sintomas pioram.',
  },
  {
    q: 'É coisa da idade?',
    a: 'É mais frequente com o avanço da idade, mas não é consequência inevitável de envelhecer, e não deve ser aceito sem avaliação. Tratar bexiga hiperativa em idoso reduz risco de queda noturna e melhora sono e autonomia, que são ganhos concretos.',
  },
  {
    q: 'Homem também tem bexiga hiperativa?',
    a: 'Sim. No homem é comum que os sintomas venham associados ao aumento da próstata, e aí o tratamento precisa considerar os dois lados. Tratar só a urgência sem avaliar a próstata costuma dar resultado parcial.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga' },
    { '@type': 'ListItem', position: 3, name: 'Bexiga Hiperativa', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga/bexiga-hiperativa' },
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

export default function BexigaHiperativa() {
  return (
    <>
      <MedicalWebPageSchema
        name="Bexiga Hiperativa em Fortaleza: Sintomas, Causas e Tratamento"
        description="Urgência urinária, frequência aumentada e escapes: causas e opções de tratamento da bexiga hiperativa. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/bexiga/bexiga-hiperativa"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Bexiga e Trato Urinário · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Não é beber muita água.{' '}
                <span className="text-brand-gold">É a bexiga avisando antes da hora.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Mapear onde tem banheiro antes de sair, recusar convites, acordar várias vezes à noite. A bexiga hiperativa encolhe a rotina aos poucos, e muita gente convive com ela por anos achando que é da idade ou do nervoso. Tem nome, tem causa e tem tratamento.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas/bexiga/incontinencia" className="btn-silver">
                  Incontinência Urinária
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-1.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — SINTOMAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Como ela se manifesta</p>
            <h2 className="section-title mt-2">OS QUATRO SINTOMAS</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Não é preciso ter todos. A urgência é o sintoma que define o quadro; os demais variam de pessoa para pessoa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {sintomas.map((s, i) => (
              <div key={s.nome} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <h3 className="font-display text-lg text-brand-navy">{s.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — CAUSAS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O que está por trás</p>
            <h2 className="section-title mt-2">AS CAUSAS MAIS COMUNS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {causas.map((c, i) => (
              <div key={c.fator} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{c.fator}</h3>
                <p className="text-sm text-brand-muted mt-2">{c.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — TRATAMENTO EM ETAPAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Do mais simples ao mais específico</p>
            <h2 className="section-title mt-2">COMO SE TRATA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O tratamento é escalonado. Começa pelas medidas de menor risco, e só avança quando elas não bastam.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {tratamentos.map((t, i) => (
              <div key={t.nome} className="flex gap-5 bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <span className="font-display text-3xl text-brand-gold shrink-0 leading-none">{t.etapa}</span>
                <div>
                  <h3 className="font-display text-base text-brand-navy">{t.nome}</h3>
                  <p className="text-sm text-brand-muted mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-brand-muted mt-8 max-w-2xl mx-auto" data-aos="fade-up">
            A definição de qual etapa se aplica a cada paciente é feita em consulta, considerando os sintomas predominantes, outras condições de saúde e os medicamentos já em uso.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">URGÊNCIA URINÁRIA NÃO É FRESCURA NEM VELHICE</h2>
            <p className="text-brand-muted mt-4">
              É uma condição clínica com critérios definidos e tratamento estabelecido. A avaliação começa afastando o que imita bexiga hiperativa, como infecção e obstrução prostática, e segue com um plano escalonado.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/bexiga" className="btn-silver">
                Ver Condições da Bexiga
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-4.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE BEXIGA HIPERATIVA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Pare de planejar o dia em função do banheiro." />
    </>
  )
}
