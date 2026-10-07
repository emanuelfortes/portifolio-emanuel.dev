import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cistoscopia Fortaleza | Como é o Exame e Dói? — Dr. Érico Diógenes' },
  description:
    'Cistoscopia em Fortaleza: como é feito o exame, se dói, qual o preparo e quando ele é indicado. Dr. Érico Diógenes, urologista, explica passo a passo.',
  alternates: { canonical: '/exames-orientacoes/exames/cistoscopia' },
  openGraph: {
    title: 'Cistoscopia Fortaleza | Dr. Érico Diógenes',
    description:
      'O único exame que enxerga o interior da bexiga por dentro. Entenda como é feito e por que é indicado.',
    url: '/exames-orientacoes/exames/cistoscopia',
  },
}

const etapas = [
  {
    num: '1',
    nome: 'Preparo e anestesia local',
    desc: 'A região é higienizada e aplica-se um gel anestésico na uretra, que age em alguns minutos. O gel também lubrifica, o que facilita a passagem do aparelho.',
  },
  {
    num: '2',
    nome: 'Introdução do cistoscópio',
    desc: 'Um tubo fino com câmera é introduzido pela uretra até a bexiga. Na maioria dos casos usa-se o aparelho flexível, mais fino e mais confortável que o rígido.',
  },
  {
    num: '3',
    nome: 'Inspeção da bexiga',
    desc: 'A bexiga é preenchida com soro para distender as paredes, e o médico percorre toda a superfície interna, observando mucosa, orifícios dos ureteres e uretra.',
  },
  {
    num: '4',
    nome: 'Conclusão',
    desc: 'O aparelho é retirado e você urina normalmente em seguida. Nos exames diagnósticos simples, você vai para casa logo depois e retoma a rotina no mesmo dia.',
  },
]

const indicacoes = [
  {
    motivo: 'Sangue na urina',
    detalhe:
      'É a principal indicação. A cistoscopia é o único método que enxerga diretamente a parede da bexiga, e por isso é indispensável para afastar tumor vesical em pacientes com hematúria e fatores de risco.',
  },
  {
    motivo: 'Sintomas urinários sem causa definida',
    detalhe:
      'Urgência, frequência ou dor que persistem apesar do tratamento, com exames de imagem normais. A visão direta esclarece alterações que o ultrassom não mostra.',
  },
  {
    motivo: 'Acompanhamento de tumor de bexiga',
    detalhe:
      'Quem já tratou um tumor vesical faz cistoscopias periódicas por anos. É o método de vigilância mais sensível para detectar recidiva precocemente.',
  },
  {
    motivo: 'Suspeita de estreitamento da uretra',
    detalhe:
      'Permite ver o ponto e a extensão do estreitamento, informação que define a técnica de tratamento.',
  },
  {
    motivo: 'Infecção urinária de repetição',
    detalhe:
      'Em casos selecionados, quando a investigação inicial não explicou por que a infecção retorna, a cistoscopia ajuda a identificar alterações estruturais.',
  },
  {
    motivo: 'Avaliação antes de procedimentos',
    detalhe:
      'Em alguns planejamentos cirúrgicos, ver o interior da bexiga e da uretra antecipa detalhes que mudam a estratégia do procedimento.',
  },
]

const apos = [
  'Ardência leve ao urinar nas primeiras micções, que tende a melhorar rapidamente',
  'Pequena quantidade de sangue na urina por um ou dois dias',
  'Vontade de urinar com mais frequência nas primeiras horas',
  'Beber bastante água ajuda a aliviar o desconforto e a limpar a via urinária',
  'Procure atendimento se houver febre, sangramento volumoso ou dificuldade para urinar',
]

const faq = [
  {
    q: 'Cistoscopia dói?',
    a: 'O termo mais preciso é desconforto, não dor. Usa-se gel anestésico na uretra e, na maioria dos casos, o aparelho flexível, que é fino. A sensação costuma ser de pressão e de vontade de urinar. É desconfortável por poucos minutos e a maior parte dos pacientes relata que foi melhor do que imaginava.',
  },
  {
    q: 'Precisa de anestesia geral?',
    a: 'Para o exame diagnóstico, não. Basta a anestesia local com gel. A anestesia geral ou raquidiana fica reservada para quando o procedimento é terapêutico, como retirada de lesões ou de cálculo, ou em situações específicas avaliadas caso a caso.',
  },
  {
    q: 'Qual o preparo?',
    a: 'Em geral é simples: não requer jejum prolongado e você pode manter suas medicações, salvo orientação em contrário. Costuma-se pedir um exame de urina recente, porque fazer cistoscopia com infecção ativa não é recomendado. As instruções exatas são passadas no agendamento.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'O exame diagnóstico leva em torno de cinco a dez minutos. Contando preparo, tempo de ação do anestésico e orientações depois, reserve cerca de uma hora.',
  },
  {
    q: 'Posso dirigir e trabalhar depois?',
    a: 'Na cistoscopia diagnóstica com anestesia local, sim, na maioria dos casos. Pode haver ardência nas primeiras micções, mas não há sedação que impeça dirigir. Se houver sedação ou o procedimento for terapêutico, a orientação muda e você será avisado antes.',
  },
  {
    q: 'O resultado sai na hora?',
    a: 'O que se vê é descrito logo após o exame. Se houver necessidade de biópsia, o material vai para análise e o resultado leva alguns dias. A conduta é definida na consulta de retorno, com o laudo em mãos.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Cistoscopia', item: 'https://drericodiogenes.com.br/exames-orientacoes/exames/cistoscopia' },
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

export default function Cistoscopia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cistoscopia em Fortaleza: Como é o Exame"
        description="Como é feita a cistoscopia, se dói, qual o preparo e quando é indicada. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/exames/cistoscopia"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Exames Urológicos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                O exame que mais assusta antes{' '}
                <span className="text-brand-gold">e mais surpreende depois.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A cistoscopia é o único método que enxerga o interior da bexiga por dentro, e é por isso que ela não tem substituto na investigação de sangue na urina. Feita com anestesia local e aparelho flexível, dura poucos minutos e a maioria dos pacientes sai dizendo que esperava pior.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Tirar Dúvidas
                </a>
                <Link href="/condicoes-urologicas/bexiga/sangue-na-urina" className="btn-silver">
                  Sangue na Urina
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-6.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — PASSO A PASSO */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Sem mistério</p>
            <h2 className="section-title mt-2">COMO O EXAME É FEITO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Saber exatamente o que vai acontecer reduz metade da apreensão. São quatro etapas e o exame diagnóstico dura em torno de cinco a dez minutos.
            </p>
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

      {/* SEÇÃO 3 — INDICAÇÕES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Quando não há substituto</p>
            <h2 className="section-title mt-2">PRINCIPAIS INDICAÇÕES</h2>
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

      {/* SEÇÃO 4 — DEPOIS DO EXAME */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">O que esperar</p>
            <h2 className="section-title mt-2">DEPOIS DO EXAME</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {apos.map((s) => (
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
            <h2 className="section-title mt-2">QUEM FAZ E COMO FAZ MUDA A EXPERIÊNCIA</h2>
            <p className="text-brand-muted mt-4">
              A escolha entre aparelho flexível e rígido, o tempo dado ao anestésico agir e a comunicação durante o exame fazem diferença real no desconforto relatado. Não é detalhe: é o que separa um exame tranquilo de uma experiência ruim.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é urologista com mais de 21 anos de experiência e fellowship em uro-oncologia pelo Hospital Sírio-Libanês. Atende no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/uro-oncologia/cancer-bexiga" className="btn-silver">
                Câncer de Bexiga
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
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE CISTOSCOPIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Tem cistoscopia marcada? Tire suas dúvidas antes." />
    </>
  )
}
