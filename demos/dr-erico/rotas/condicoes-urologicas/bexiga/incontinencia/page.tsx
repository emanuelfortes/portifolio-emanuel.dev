import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Incontinência Urinária Fortaleza | Tipos e Tratamento — Dr. Érico Diógenes' },
  description:
    'Incontinência urinária em Fortaleza: tipos, causas em homens e mulheres, e as opções de tratamento, da fisioterapia à cirurgia. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/condicoes-urologicas/bexiga/incontinencia' },
  openGraph: {
    title: 'Incontinência Urinária Fortaleza | Dr. Érico Diógenes',
    description:
      'Perder urina ao tossir, rir ou sem aviso tem tratamento. Entenda os tipos e as opções disponíveis.',
    url: '/condicoes-urologicas/bexiga/incontinencia',
  },
}

const tipos = [
  {
    nome: 'De esforço',
    gatilho: 'Tossir, rir, correr',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'A perda acontece quando a pressão dentro do abdome aumenta e o mecanismo de fechamento da uretra não segura. Não há vontade de urinar antes: o escape simplesmente ocorre.',
    contexto: 'Mais comum em mulheres após partos e na menopausa, e em homens após cirurgia de próstata.',
  },
  {
    nome: 'De urgência',
    gatilho: 'Vontade súbita',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'A vontade chega de repente e forte, e a urina escapa antes de chegar ao banheiro. Está associada à bexiga hiperativa e às contrações involuntárias do músculo vesical.',
    contexto: 'Costuma vir acompanhada de frequência aumentada e de idas ao banheiro à noite.',
  },
  {
    nome: 'Mista',
    gatilho: 'Os dois juntos',
    cor: 'bg-brand-green/10 border-t-4 border-brand-green',
    corTxt: 'text-brand-green',
    desc: 'Combina esforço e urgência na mesma pessoa. É frequente, e o tratamento começa pelo componente que mais incomoda no dia a dia.',
    contexto: 'Exige avaliação cuidadosa para definir qual mecanismo predomina.',
  },
  {
    nome: 'Por transbordamento',
    gatilho: 'Bexiga que não esvazia',
    cor: 'bg-red-50 border-t-4 border-red-400',
    corTxt: 'text-red-500',
    desc: 'A bexiga não se esvazia direito e a urina acumulada transborda em pequenas quantidades. Costuma vir com jato fraco e sensação de esvaziamento incompleto.',
    contexto: 'Merece avaliação mais urgente: a retenção prolongada pode comprometer os rins.',
  },
]

const causasMulher = [
  'Gestação e partos vaginais, que distendem a musculatura do assoalho pélvico',
  'Menopausa, pela queda de estrogênio e alteração dos tecidos da uretra',
  'Cirurgias pélvicas prévias, incluindo histerectomia',
  'Obesidade, que aumenta a pressão abdominal de forma crônica',
  'Tosse crônica, por tabagismo ou doença respiratória',
  'Constipação intestinal de longa data',
]

const causasHomem = [
  'Cirurgia de próstata, principalmente prostatectomia radical por câncer',
  'Obstrução prolongada pela próstata aumentada, que altera o funcionamento da bexiga',
  'Doenças neurológicas, como Parkinson, AVC e lesões medulares',
  'Radioterapia pélvica prévia',
  'Diabetes de longa data, pelo efeito sobre os nervos da bexiga',
]

const tratamentos = [
  {
    etapa: '1',
    nome: 'Fisioterapia do assoalho pélvico',
    desc: 'Primeira linha em boa parte dos casos, sobretudo na incontinência de esforço. O trabalho é de fortalecimento e coordenação, com profissional especializado, e exige constância para dar resultado.',
  },
  {
    etapa: '2',
    nome: 'Medidas comportamentais',
    desc: 'Controle de peso, ajuste de líquidos, tratamento da constipação e da tosse crônica, e treinamento vesical quando há componente de urgência. São medidas simples que mudam o resultado das demais.',
  },
  {
    etapa: '3',
    nome: 'Medicamentos',
    desc: 'Têm papel principalmente na incontinência de urgência, atuando sobre a atividade involuntária da bexiga. Na incontinência de esforço pura, o benefício medicamentoso é limitado.',
  },
  {
    etapa: '4',
    nome: 'Procedimentos cirúrgicos',
    desc: 'Para casos que não respondem às etapas anteriores existem opções como os slings, e no homem com incontinência após cirurgia de próstata, o esfíncter urinário artificial. A indicação é individual e discutida em detalhe.',
  },
]

const faq = [
  {
    q: 'Perder urina ao tossir é normal depois de ter filhos?',
    a: 'É frequente, mas frequente não é o mesmo que normal, e sobretudo não é algo para aceitar. A incontinência de esforço após partos tem tratamento, e a fisioterapia do assoalho pélvico resolve ou melhora muito boa parte dos casos sem precisar de cirurgia.',
  },
  {
    q: 'Homem também tem incontinência urinária?',
    a: 'Sim. A causa mais frequente é a cirurgia de próstata, especialmente a prostatectomia radical por câncer. Há também casos ligados a obstrução prolongada e a doenças neurológicas. O tratamento existe e vai da fisioterapia ao esfíncter artificial.',
  },
  {
    q: 'Usar absorvente resolve?',
    a: 'Resolve o constrangimento imediato, não a causa. Muita gente convive anos com protetor diário sem nunca ter sido avaliada, e nesse meio tempo o quadro costuma progredir. O absorvente é apoio durante o tratamento, não substituto dele.',
  },
  {
    q: 'A cirurgia é sempre necessária?',
    a: 'Não. A maioria dos pacientes começa e permanece em tratamento conservador, com fisioterapia e medidas comportamentais. A cirurgia entra quando essas medidas não bastam e o impacto na vida é significativo, e é decidida caso a caso.',
  },
  {
    q: 'Qual a diferença entre incontinência e bexiga hiperativa?',
    a: 'Bexiga hiperativa é a urgência e a frequência, que podem ou não vir com perda de urina. Incontinência é a perda em si, e pode ocorrer sem urgência nenhuma, como no escape ao tossir. Os dois se sobrepõem com frequência, e por isso a avaliação precisa distinguir o que predomina.',
  },
  {
    q: 'Beber menos água ajuda?',
    a: 'Não, e pode piorar. Urina muito concentrada irrita a bexiga e agrava a urgência, além de favorecer infecção e cálculo. O ajuste correto é distribuir melhor os líquidos ao longo do dia e reduzir o consumo nas horas que antecedem o sono, não restringir o total.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga' },
    { '@type': 'ListItem', position: 3, name: 'Incontinência Urinária', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga/incontinencia' },
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

export default function Incontinencia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Incontinência Urinária em Fortaleza: Tipos, Causas e Tratamento"
        description="Tipos de incontinência urinária, causas em homens e mulheres e as opções de tratamento. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/bexiga/incontinencia"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Bexiga e Trato Urinário · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Perder urina é comum.{' '}
                <span className="text-brand-gold">Mas comum não quer dizer que você precise conviver.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Muita gente troca a consulta por um protetor diário e segue assim por anos, achando que é consequência do parto, da idade ou da cirurgia. A incontinência tem tipos diferentes, causas identificáveis e tratamento que, na maioria das vezes, começa sem cirurgia nenhuma.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas/bexiga/bexiga-hiperativa" className="btn-silver">
                  Bexiga Hiperativa
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-2.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
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
            <p className="eyebrow">O tipo define o tratamento</p>
            <h2 className="section-title mt-2">OS QUATRO TIPOS DE INCONTINÊNCIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Identificar em qual grupo o quadro se encaixa é o passo que muda tudo: o que funciona para um tipo pode não fazer diferença nenhuma em outro.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-lg ${t.corTxt}`}>{t.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">{t.gatilho}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <div className="mt-4 pt-3 border-t border-white/60">
                  <p className="text-xs font-medium text-brand-navy">{t.contexto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — CAUSAS POR SEXO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">As causas não são as mesmas</p>
            <h2 className="section-title mt-2">EM MULHERES E EM HOMENS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up">
              <h3 className="font-display text-xl text-brand-navy mb-4">Em mulheres</h3>
              <ul className="space-y-3">
                {causasMulher.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                    <span className="text-sm text-brand-muted">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up" data-aos-delay={80}>
              <h3 className="font-display text-xl text-brand-navy mb-4">Em homens</h3>
              <ul className="space-y-3">
                {causasHomem.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-brand-navy" />
                    <span className="text-sm text-brand-muted">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — TRATAMENTO */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Quase sempre começa sem cirurgia</p>
            <h2 className="section-title mt-2">COMO SE TRATA</h2>
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
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">A CONSULTA QUE MUITA GENTE ADIA POR ANOS</h2>
            <p className="text-brand-muted mt-4">
              A incontinência urinária é uma das condições que mais afeta a rotina e uma das que menos chega ao consultório, por constrangimento. A avaliação é objetiva: entender quando a perda acontece, o que a desencadeia e qual mecanismo está envolvido.
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
                src="/demos/dr-erico/img/dr-erico-foto-7.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE INCONTINÊNCIA URINÁRIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Protetor diário não é tratamento. Existe solução." />
    </>
  )
}
