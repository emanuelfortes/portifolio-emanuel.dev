import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight, Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Check-Up Urológico Fortaleza | O Que Inclui — Dr. Érico Diógenes' },
  description:
    'Check-up urológico em Fortaleza: o que inclui, com que idade começar e de quanto em quanto tempo repetir. Dr. Érico Diógenes, urologista, orienta.',
  alternates: { canonical: '/urologia' },
  openGraph: {
    title: 'Check-Up Urológico Fortaleza | Dr. Érico Diógenes',
    description:
      'O que a avaliação preventiva inclui, por faixa etária, e por que o rastreamento não é igual para todos.',
    url: '/urologia',
  },
}

const etapas = [
  {
    num: '1',
    nome: 'Conversa e histórico',
    desc: 'A parte mais longa. Frequência urinária, força do jato, despertar noturno, vida sexual, medicamentos em uso e histórico familiar de câncer urológico. É daqui que sai a definição do que realmente precisa ser investigado.',
  },
  {
    num: '2',
    nome: 'Exame físico',
    desc: 'Abdome, região lombar e genitália externa. O toque retal é indicado conforme idade e queixa, sempre explicado antes e dependente do seu consentimento.',
  },
  {
    num: '3',
    nome: 'Exames laboratoriais',
    desc: 'Exame de urina e, conforme a faixa etária e os fatores de risco, PSA. Função renal e glicemia entram quando há indicação clínica.',
  },
  {
    num: '4',
    nome: 'Imagem e função, quando indicado',
    desc: 'Ultrassonografia do aparelho urinário e urofluxometria não são obrigatórias em todo check-up. São pedidas quando a conversa e o exame físico apontam necessidade.',
  },
  {
    num: '5',
    nome: 'Plano e retorno',
    desc: 'Você deve sair com a interpretação dos achados, o que precisa de acompanhamento, o que não precisa, e quando repetir. Check-up sem plano de seguimento é exame solto.',
  },
]

const porIdade = [
  {
    faixa: '15 a 19 anos',
    foco: 'Avaliação testicular, orientação de autoexame, saúde sexual e ISTs. Varicocele nessa fase pode afetar o desenvolvimento do testículo.',
    freq: 'Uma avaliação na adolescência',
  },
  {
    faixa: '20 a 39 anos',
    foco: 'ISTs, dor ou nódulo testicular e avaliação de fertilidade. É a faixa de maior incidência do câncer de testículo, que tem ótimo prognóstico quando tratado cedo.',
    freq: 'A cada 2 a 3 anos',
  },
  {
    faixa: '40 a 49 anos',
    foco: 'Saúde sexual, testosterona e avaliação de risco cardiovascular associada. Dificuldade de ereção nessa faixa merece investigação vascular.',
    freq: 'Anual, se houver fator de risco',
  },
  {
    faixa: '50 anos ou mais',
    foco: 'Rastreamento de próstata e avaliação dos sintomas urinários. A partir dos 45 anos para homens negros ou com pai ou irmão com câncer de próstata.',
    freq: 'Anual',
  },
]

const naoEsperar = [
  'Sangue na urina ou no sêmen, mesmo uma única vez',
  'Ardência ou dor ao urinar que persiste',
  'Jato fraco que piorou de forma rápida',
  'Nódulo endurecido em um dos testículos',
  'Dor lombar em cólica com náusea',
  'Febre com sintomas urinários',
]

const faq = [
  {
    q: 'Com quantos anos devo fazer o primeiro check-up urológico?',
    a: 'Havendo sintoma, em qualquer idade. Sem sintoma, uma primeira avaliação na adolescência ou no início da vida adulta faz sentido, com foco em exame testicular e saúde sexual. A avaliação voltada à próstata costuma começar aos 50 anos, ou aos 45 para homens negros e para quem tem pai ou irmão com câncer de próstata.',
  },
  {
    q: 'O check-up sempre inclui toque retal?',
    a: 'Não. O exame é indicado conforme a idade, a queixa e os fatores de risco, é explicado antes e depende do seu consentimento. Se não se sentir confortável naquele momento, diga: isso é conversado e não compromete o atendimento.',
  },
  {
    q: 'Quanto tempo dura?',
    a: 'A consulta com anamnese e exame físico costuma levar de trinta a quarenta e cinco minutos. Exames complementares, quando indicados, são feitos depois, e a interpretação acontece em uma consulta de retorno.',
  },
  {
    q: 'Preciso repetir todo ano?',
    a: 'Depende da idade e dos fatores de risco. A partir dos 50 anos, o intervalo anual é o mais comum. Antes disso, costuma ser mais espaçado. Quem tem diabetes, obesidade, tabagismo ou histórico familiar de câncer urológico costuma precisar de seguimento mais próximo.',
  },
  {
    q: 'Mulher faz check-up urológico?',
    a: 'Sim, quando há indicação, principalmente em casos de infecção urinária de repetição, cálculo renal, incontinência ou bexiga hiperativa. O trato urinário é o mesmo nos dois sexos, e a avaliação é adaptada à queixa.',
  },
  {
    q: 'Convênio cobre?',
    a: 'Os planos costumam cobrir consulta e exames solicitados com indicação clínica. A cobertura varia conforme operadora e plano, e vale confirmar antes de agendar, inclusive se há exigência de encaminhamento.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Check-Up Urológico', item: 'https://drericodiogenes.com.br/urologia' },
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

export default function Urologia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Check-Up Urológico em Fortaleza"
        description="O que inclui o check-up urológico, com que idade começar e com que frequência repetir. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/urologia"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Check-Up Urológico · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Check-up urológico não é{' '}
                <span className="text-brand-gold">uma bateria de exames igual para todo mundo.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O que faz sentido aos 25 anos não é o que faz sentido aos 60, e pedir tudo para todos gera mais achado irrelevante do que informação útil. A avaliação começa pela conversa, e é ela que define o que realmente precisa ser investigado.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Check-Up
                </a>
                <Link href="/urologia/consulta" className="btn-silver">
                  Como é a Consulta
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-7.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — O QUE INCLUI */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Cinco etapas</p>
            <h2 className="section-title mt-2">O QUE O CHECK-UP INCLUI</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {etapas.map((e, i) => (
              <div key={e.nome} className="flex gap-5 bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <span className="font-display text-3xl text-brand-gold shrink-0 leading-none">{e.num}</span>
                <div>
                  <h3 className="font-display text-base text-brand-navy">{e.nome}</h3>
                  <p className="text-sm text-brand-muted mt-1">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — POR IDADE */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O foco muda com a idade</p>
            <h2 className="section-title mt-2">O QUE AVALIAR EM CADA FASE</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {porIdade.map((p, i) => (
              <div key={p.faixa} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-lg text-brand-navy">{p.faixa}</h3>
                  <span className="text-xs font-semibold bg-brand-beige rounded-full px-3 py-1 whitespace-nowrap text-brand-navy">{p.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{p.foco}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-brand-muted mt-8 max-w-2xl mx-auto" data-aos="fade-up">
            São orientações gerais. Diabetes, obesidade, tabagismo e histórico familiar de câncer urológico costumam antecipar o início e encurtar o intervalo.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — NÃO ESPERAR */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Fora do calendário</p>
            <h2 className="section-title mt-2">O QUE NÃO ESPERA O PRÓXIMO CHECK-UP</h2>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {naoEsperar.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-red-500" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — LINKS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Para se aprofundar</p>
            <h2 className="section-title mt-2">CONTEÚDOS RELACIONADOS</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { nome: 'Como é a Consulta', href: '/urologia/consulta' },
              { nome: 'Urologia Geral', href: '/urologia/urologia-geral' },
              { nome: 'Exames Urológicos', href: '/exames-orientacoes' },
            ].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="group bg-white rounded-2xl p-6 shadow-card text-center hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <h3 className="font-display text-base text-brand-navy">{l.nome}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-brand-muted mt-3 group-hover:text-brand-gold transition-colors">
                  Acessar <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">RASTREAR DEMAIS TAMBÉM TEM CUSTO</h2>
            <p className="text-brand-muted mt-4">
              Pedir todos os exames para todos os pacientes parece cuidado, mas gera achado irrelevante, investigação em cascata e ansiedade desnecessária. Um bom check-up é o que pede o exame certo para a pessoa certa, e explica o porquê de cada um.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é urologista com mais de 21 anos de experiência, doutor em Urologia pela USP. Atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas" className="btn-silver">
                Condições Urológicas
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-3.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE O CHECK-UP</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Check-up sem sintoma é o que evita o diagnóstico tardio." />
    </>
  )
}
