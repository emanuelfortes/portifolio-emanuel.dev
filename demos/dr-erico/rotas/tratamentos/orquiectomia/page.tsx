import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Orquiectomia Fortaleza | Cirurgia do Testículo — Dr. Érico Diógenes' },
  description:
    'Orquiectomia em Fortaleza: tipos de cirurgia do testículo, quando é indicada, recuperação e prótese testicular. Dr. Érico Diógenes, uro-oncologista, explica.',
  alternates: { canonical: '/tratamentos/orquiectomia' },
  openGraph: {
    title: 'Orquiectomia Fortaleza | Dr. Érico Diógenes',
    description:
      'Quando a retirada do testículo é indicada, como é feita e o que muda depois. Com fellowship em uro-oncologia.',
    url: '/tratamentos/orquiectomia',
  },
}

const tipos = [
  {
    nome: 'Orquiectomia radical inguinal',
    quando: 'Suspeita de tumor',
    cor: 'bg-red-50 border-t-4 border-red-400',
    corTxt: 'text-red-500',
    desc: 'O acesso é feito pela virilha, e o testículo é removido junto do cordão espermático. A via inguinal, e não pela bolsa escrotal, é adotada justamente para não comprometer o estadiamento quando há suspeita de câncer.',
  },
  {
    nome: 'Orquiectomia simples',
    quando: 'Doença benigna',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'Acesso pela bolsa escrotal, indicada em situações benignas como infarto testicular, infecção grave sem resposta ao tratamento ou dor crônica refratária. Não é usada quando há suspeita de tumor.',
  },
  {
    nome: 'Orquiectomia subcapsular',
    quando: 'Bloqueio hormonal',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'Remove o tecido produtor de testosterona preservando o envoltório do testículo. Usada como forma de bloqueio hormonal definitivo em casos selecionados de câncer de próstata avançado.',
  },
]

const indicacoes = [
  {
    motivo: 'Tumor de testículo',
    detalhe:
      'É a principal indicação. O câncer de testículo é mais comum em homens jovens e está entre os tumores com melhor prognóstico da medicina, sobretudo quando tratado cedo. A cirurgia costuma ser o primeiro passo, e também fornece o diagnóstico definitivo.',
  },
  {
    motivo: 'Torção testicular com perda do órgão',
    detalhe:
      'Quando a torção não é revertida a tempo, o testículo pode sofrer necrose. Nessa situação a remoção é necessária, e o testículo contralateral costuma receber fixação preventiva no mesmo tempo cirúrgico.',
  },
  {
    motivo: 'Infecção grave sem resposta',
    detalhe:
      'Orquiepididimite com abscesso ou necrose que não responde ao tratamento clínico. É uma indicação menos frequente e avaliada com critério.',
  },
  {
    motivo: 'Dor testicular crônica refratária',
    detalhe:
      'Reservada a casos muito selecionados, após esgotadas as alternativas menos invasivas. O resultado sobre a dor não é garantido, e isso é discutido em detalhe antes da decisão.',
  },
  {
    motivo: 'Bloqueio hormonal no câncer de próstata',
    detalhe:
      'Em situações específicas de doença avançada, a retirada do tecido produtor de testosterona é uma alternativa ao bloqueio medicamentoso contínuo. A escolha entre as duas é individual.',
  },
]

const depois = [
  'Retirada de um testículo não impede ereção nem orgasmo quando o outro é saudável',
  'O testículo remanescente costuma manter a produção hormonal e de espermatozoides',
  'A prótese testicular pode ser colocada no mesmo tempo cirúrgico ou depois, conforme o caso',
  'Em caso de tumor, o congelamento de sêmen antes da cirurgia é discutido com antecedência',
  'O acompanhamento oncológico segue por anos, com exames e consultas em intervalos definidos',
  'Retorno a atividades leves é rápido; esforço físico tem prazo informado na alta',
]

const faq = [
  {
    q: 'Vou perder a capacidade de ter ereção?',
    a: 'Não. A ereção depende de fatores vasculares e nervosos que não são afetados pela retirada de um testículo. Quando o testículo remanescente é saudável, a função sexual e a produção hormonal tendem a se manter. É a dúvida mais frequente e a resposta costuma tranquilizar.',
  },
  {
    q: 'Ainda vou poder ter filhos?',
    a: 'Na maioria dos casos sim, quando o outro testículo é normal. Ainda assim, quando a cirurgia é por tumor, discute-se o congelamento de sêmen antes do procedimento, porque tratamentos complementares como quimioterapia podem afetar a fertilidade.',
  },
  {
    q: 'É possível colocar prótese?',
    a: 'Sim. A prótese testicular pode ser colocada no mesmo tempo cirúrgico ou em um segundo momento, e tem finalidade estética e de conforto. A decisão é do paciente e vale ser conversada antes da cirurgia, porque isso muda o planejamento.',
  },
  {
    q: 'Por que o acesso é pela virilha e não pela bolsa?',
    a: 'Quando há suspeita de tumor, o acesso inguinal é o recomendado porque respeita a via de drenagem linfática natural do testículo. Operar pela bolsa escrotal nessa situação pode comprometer o estadiamento e alterar a conduta posterior.',
  },
  {
    q: 'A cirurgia cura o câncer de testículo?',
    a: 'Em parte dos casos, sim, quando a doença está restrita ao testículo. Em outros, a cirurgia é o primeiro passo e o tratamento segue com outras modalidades conforme o tipo e o estágio. O câncer de testículo está entre os de melhor prognóstico, mesmo em estágios mais avançados.',
  },
  {
    q: 'Quanto tempo de recuperação?',
    a: 'O retorno a atividades leves costuma ser rápido, em poucos dias. Esforço físico, academia e atividade sexual têm prazos maiores, definidos na alta conforme o procedimento realizado e a sua evolução.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Tratamentos', item: 'https://drericodiogenes.com.br/tratamentos' },
    { '@type': 'ListItem', position: 3, name: 'Orquiectomia', item: 'https://drericodiogenes.com.br/tratamentos/orquiectomia' },
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

export default function Orquiectomia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Orquiectomia em Fortaleza: Cirurgia do Testículo"
        description="Tipos de orquiectomia, indicações, recuperação e prótese testicular. Dr. Érico Diógenes, uro-oncologista em Fortaleza."
        url="https://drericodiogenes.com.br/tratamentos/orquiectomia"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Tratamentos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                A pergunta que todo paciente faz primeiro{' '}
                <span className="text-brand-gold">não é sobre a cirurgia.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                É sobre o que muda depois. Com o testículo remanescente saudável, ereção, orgasmo e produção hormonal tendem a se manter, e a fertilidade costuma ser preservada. Entender isso antes da decisão muda completamente como se encara o procedimento.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas/uro-oncologia/cancer-testiculo" className="btn-silver">
                  Câncer de Testículo
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5.webp"
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
            <p className="eyebrow">A via de acesso importa</p>
            <h2 className="section-title mt-2">OS TIPOS DE ORQUIECTOMIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A escolha da técnica não é detalhe técnico: quando há suspeita de tumor, a via de acesso influencia o estadiamento e a conduta posterior.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm">{t.quando}</span>
                <h3 className={`font-display text-base mt-3 ${t.corTxt}`}>{t.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — INDICAÇÕES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Quando é indicada</p>
            <h2 className="section-title mt-2">AS PRINCIPAIS INDICAÇÕES</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {indicacoes.map((ind, i) => (
              <div key={ind.motivo} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{ind.motivo}</h3>
                <p className="text-sm text-brand-muted mt-2">{ind.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — O QUE MUDA DEPOIS */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">O que realmente preocupa</p>
            <h2 className="section-title mt-2">O QUE MUDA DEPOIS</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {depois.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Uro-oncologia em Fortaleza</p>
            <h2 className="section-title mt-2">NÓDULO NO TESTÍCULO NÃO ESPERA</h2>
            <p className="text-brand-muted mt-4">
              O câncer de testículo acomete sobretudo homens jovens e está entre os tumores com melhor prognóstico da medicina. O que mais influencia o resultado é o tempo entre notar a alteração e procurar avaliação, e é justamente esse intervalo que costuma ser desperdiçado.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes tem fellowship em uro-oncologia pelo Hospital Sírio-Libanês e doutorado em Urologia pela USP. Atende no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/uro-oncologia" className="btn-silver">
                Uro-Oncologia
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-1.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE ORQUIECTOMIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Notou nódulo ou alteração no testículo? Não adie a avaliação." />
    </>
  )
}
