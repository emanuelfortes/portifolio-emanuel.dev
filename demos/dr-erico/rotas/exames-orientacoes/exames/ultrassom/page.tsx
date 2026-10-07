import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Ultrassom Urológico Fortaleza | Tipos e Preparo — Dr. Érico Diógenes' },
  description:
    'Ultrassom urológico em Fortaleza: tipos de exame, qual o preparo de cada um e o que consegue mostrar. Dr. Érico Diógenes, urologista, explica.',
  alternates: { canonical: '/exames-orientacoes/exames/ultrassom' },
  openGraph: {
    title: 'Ultrassom Urológico Fortaleza | Dr. Érico Diógenes',
    description:
      'Sem radiação e sem preparo complicado. Conheça os tipos de ultrassom urológico e o que cada um avalia.',
    url: '/exames-orientacoes/exames/ultrassom',
  },
}

const tipos = [
  {
    nome: 'Ultrassom de rins e vias urinárias',
    preparo: 'Bexiga cheia',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'Avalia tamanho e forma dos rins, identifica cálculos, dilatação da via urinária e massas. É o primeiro exame de imagem na maioria das queixas urinárias.',
  },
  {
    nome: 'Ultrassom de próstata por via abdominal',
    preparo: 'Bexiga cheia',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'Estima o volume prostático e mede o resíduo de urina após urinar. Feito por fora, apoiando o transdutor sobre o abdome. É o método usado na avaliação inicial da próstata aumentada.',
  },
  {
    nome: 'Ultrassom de próstata transretal',
    preparo: 'Preparo intestinal',
    cor: 'bg-brand-green/10 border-t-4 border-brand-green',
    corTxt: 'text-brand-green',
    desc: 'Transdutor introduzido pelo reto, o que fornece imagem bem mais detalhada da glândula. Usado em situações específicas e como guia em procedimentos.',
  },
  {
    nome: 'Ultrassom de bolsa escrotal',
    preparo: 'Nenhum',
    cor: 'bg-brand-beige border-t-4 border-brand-muted',
    corTxt: 'text-brand-navy',
    desc: 'Avalia testículos, epidídimos e o fluxo sanguíneo local. Indicado em nódulo, dor, inchaço, varicocele e investigação de infertilidade.',
  },
]

const oQueMostra = [
  {
    achado: 'Cálculos',
    detalhe:
      'Enxerga bem pedras no rim e na bexiga. Cálculos pequenos no ureter podem escapar, e nesses casos a tomografia costuma ser necessária para completar a avaliação.',
  },
  {
    achado: 'Dilatação da via urinária',
    detalhe:
      'Mostra quando a urina está represada acima de um ponto de obstrução. É um achado importante porque indica que o rim pode estar sob pressão.',
  },
  {
    achado: 'Volume da próstata',
    detalhe:
      'Estima o tamanho da glândula, informação que participa da decisão terapêutica na próstata aumentada e da escolha da técnica cirúrgica quando ela é indicada.',
  },
  {
    achado: 'Resíduo pós-miccional',
    detalhe:
      'Quanta urina permanece na bexiga depois de urinar. Complementa a urofluxometria e ajuda a entender o quanto o esvaziamento está comprometido.',
  },
  {
    achado: 'Massas e cistos',
    detalhe:
      'Identifica lesões nos rins e distingue cistos simples, que geralmente não preocupam, de lesões que pedem investigação adicional.',
  },
  {
    achado: 'Alterações nos testículos',
    detalhe:
      'Diferencia nódulos sólidos de cistos, avalia varicocele e o fluxo sanguíneo, e é fundamental na dor testicular aguda.',
  },
]

const preparo = [
  'Para exames de rins, bexiga e próstata abdominal: beba água e não urine antes, para chegar com a bexiga cheia',
  'A quantidade e o tempo variam: siga a orientação dada no agendamento',
  'O ultrassom de bolsa escrotal não exige preparo nenhum',
  'O transretal pede preparo intestinal, informado com antecedência',
  'Leve exames de imagem anteriores, mesmo antigos, para comparação',
  'Não é necessário suspender medicação por conta própria',
]

const faq = [
  {
    q: 'Ultrassom tem radiação?',
    a: 'Não. O exame usa ondas sonoras, não radiação ionizante. Por isso pode ser repetido quantas vezes for necessário e é seguro inclusive em gestantes e crianças. É essa característica que o torna o exame de primeira linha em boa parte das queixas urológicas.',
  },
  {
    q: 'Por que preciso ficar com a bexiga cheia?',
    a: 'A bexiga cheia funciona como janela acústica: o líquido conduz bem o som e permite enxergar a própria bexiga e a próstata por trás dela. Com a bexiga vazia, essas estruturas ficam mal visualizadas e o exame perde qualidade.',
  },
  {
    q: 'Ultrassom substitui a tomografia?',
    a: 'Nem sempre. O ultrassom é excelente como primeira avaliação, é seguro e barato, mas tem limitações: cálculos pequenos no ureter e algumas lesões só aparecem bem na tomografia. Os exames são complementares, e a escolha depende da suspeita clínica.',
  },
  {
    q: 'O ultrassom de próstata precisa ser transretal?',
    a: 'Não na maioria dos casos. A avaliação inicial da próstata aumentada costuma ser feita por via abdominal, que é indolor e sem preparo especial. O transretal fica para situações específicas, e a indicação é explicada quando é o caso.',
  },
  {
    q: 'O exame dói?',
    a: 'Os exames abdominais e de bolsa escrotal não doem: apenas o gel e a pressão do transdutor sobre a pele. O maior desconforto costuma ser segurar a urina com a bexiga cheia. O transretal causa desconforto breve, semelhante ao do toque retal.',
  },
  {
    q: 'O resultado sai na hora?',
    a: 'As imagens são vistas durante o exame e o laudo costuma ficar pronto rapidamente. Como em todo exame de imagem, o que muda a conduta é a leitura dentro do contexto clínico, feita em consulta, e não o laudo isolado.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Ultrassom Urológico', item: 'https://drericodiogenes.com.br/exames-orientacoes/exames/ultrassom' },
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

export default function Ultrassom() {
  return (
    <>
      <MedicalWebPageSchema
        name="Ultrassom Urológico em Fortaleza: Tipos e Preparo"
        description="Tipos de ultrassom urológico, preparo de cada um e o que o exame consegue mostrar. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/exames/ultrassom"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Exames Urológicos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Sem radiação, sem agulha.{' '}
                <span className="text-brand-gold">E quase sempre o primeiro exame pedido.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O ultrassom é a porta de entrada da investigação urológica: enxerga rins, bexiga, próstata e testículos, identifica cálculos e obstruções, e pode ser repetido sem limite. Conhecer o tipo e o preparo certo evita a viagem perdida de chegar e não poder fazer.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Exame
                </a>
                <Link href="/exames-orientacoes" className="btn-silver">
                  Ver Todos os Exames
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
            <p className="eyebrow">Não existe um ultrassom só</p>
            <h2 className="section-title mt-2">OS TIPOS DE ULTRASSOM UROLÓGICO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Cada um avalia estruturas diferentes e exige um preparo diferente. Chegar preparado para o exame errado é motivo frequente de remarcação.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className={`font-display text-base ${t.corTxt}`}>{t.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">{t.preparo}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — O QUE MOSTRA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">E também o que não mostra</p>
            <h2 className="section-title mt-2">O QUE O EXAME CONSEGUE VER</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {oQueMostra.map((o, i) => (
              <div key={o.achado} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{o.achado}</h3>
                <p className="text-sm text-brand-muted mt-2">{o.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — PREPARO */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Evite remarcar por detalhe</p>
            <h2 className="section-title mt-2">COMO SE PREPARAR</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {preparo.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
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
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">O LAUDO É UM COMEÇO, NÃO UM DESFECHO</h2>
            <p className="text-brand-muted mt-4">
              Achados de ultrassom só significam algo dentro do contexto. Um cisto renal pode ser irrelevante ou merecer seguimento; uma próstata aumentada pode não exigir tratamento nenhum. É a leitura junto dos sintomas que define o passo seguinte.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/calculo-renal" className="btn-silver">
                Cálculo Renal
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-2.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE ULTRASSOM</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Fez ultrassom e não entendeu o laudo? Traga para a consulta." />
    </>
  )
}
