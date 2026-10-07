import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check, X as XIcon } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Hiperplasia Prostática Benigna (HPB) Fortaleza | Dr. Érico Diógenes' },
  description:
    'HPB em Fortaleza: o que é hiperplasia prostática benigna, sintomas, diagnóstico e tratamentos modernos incluindo HoLEP e medicamentos. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/prostata/hiperplasia-prostatica' },
  openGraph: {
    title: 'Hiperplasia Prostática Benigna (HPB) | Dr. Érico Diógenes, Fortaleza',
    description: 'Entenda a HPB: causas, sintomas e os melhores tratamentos disponíveis em Fortaleza com Dr. Érico Diógenes.',
    url: '/condicoes-urologicas/prostata/hiperplasia-prostatica',
  },
}

const sintomas = [
  'Jato urinário fraco ou que demora para começar',
  'Necessidade de fazer força para urinar',
  'Interrupção do jato durante a micção',
  'Sensação de bexiga cheia mesmo após urinar',
  'Urgência, vontade súbita e difícil de segurar',
  'Frequência aumentada, especialmente à noite (noctúria)',
  'Gotejamento após urinar',
  'Em casos avançados: retenção urinária completa',
]

const tratamentos = [
  {
    titulo: 'Tratamento Medicamentoso',
    desc: 'Alfa-bloqueadores (relaxam a musculatura da próstata e bexiga) e inibidores da 5-alfa-redutase (reduzem o volume prostático). Indicados para sintomas leves a moderados.',
    ideal: 'Próstatas pequenas a médias, sintomas controláveis',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    titulo: 'HoLEP, Cirurgia a Laser',
    desc: 'Padrão ouro mundial para HPB. Remove o tecido prostático obstrutivo via uretra, sem cortes, com laser de Holmium. Alta em 24h, resultados definitivos.',
    ideal: 'Próstatas de qualquer tamanho, especialmente grandes',
    img: '/demos/dr-erico/img/post/imgid05_01.webp',
  },
  {
    titulo: 'RTU de Próstata (RTUP)',
    desc: 'Ressecção transuretral clássica, técnica consolidada que retira o tecido obstrutivo por via endoscópica com alça elétrica. Indicada em casos selecionados.',
    ideal: 'Próstatas de volume médio',
    img: '/demos/dr-erico/img/post/imgid08_01.webp',
  },
]

const faq = [
  {
    q: 'HPB é a mesma coisa que câncer de próstata?',
    a: 'Não. A hiperplasia prostática benigna é um processo natural e não canceroso de crescimento da próstata. O câncer de próstata é uma doença distinta. Ter HPB não aumenta o risco de desenvolver câncer, mas as duas condições podem coexistir e exigem investigação separada.',
  },
  {
    q: 'Todo homem com HPB precisa de cirurgia?',
    a: 'Não. A cirurgia é indicada quando os sintomas são moderados a graves, quando não há resposta adequada aos medicamentos, quando surgem complicações (retenção urinária, infecções repetidas, lesão renal) ou quando o paciente prefere uma solução definitiva. Casos leves podem ser acompanhados com medicação.',
  },
  {
    q: 'O HoLEP é o melhor tratamento para HPB?',
    a: 'O HoLEP é considerado o padrão ouro mundial para o tratamento cirúrgico da HPB, com vantagens sobre técnicas tradicionais: menor sangramento, internação de ~24h, resultados mais duradouros e indicação mesmo para próstatas muito grandes. Em Fortaleza, o Dr. Érico Diógenes é pioneiro na técnica.',
  },
  {
    q: 'A HPB pode piorar com o tempo?',
    a: 'Sim. A próstata continua a crescer com a idade, e os sintomas tendem a se agravar progressivamente sem tratamento. Em casos avançados, pode ocorrer retenção urinária aguda (incapacidade de urinar), situação de emergência que exige cateterismo imediato.',
  },
  {
    q: 'O tratamento da HPB afeta a função sexual?',
    a: 'Alguns medicamentos podem reduzir a libido ou causar ejaculação retrógrada. O HoLEP também pode causar ejaculação retrógrada (sêmen vai para a bexiga em vez de ser ejaculado), mas preserva a ereção na maioria dos casos. O Dr. Érico discute esses aspectos antes de qualquer decisão terapêutica.',
  },
  {
    q: 'Com que frequência devo fazer acompanhamento após o diagnóstico de HPB?',
    a: 'Depende do tratamento escolhido. Em casos com medicação, revisões semestrais ou anuais com PSA e ultrassom são habituais. Após cirurgia, a recuperação é acompanhada em consultas específicas. O Dr. Érico define o protocolo conforme cada caso.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata' },
    { '@type': 'ListItem', position: 3, name: 'Hiperplasia Prostática Benigna', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata/hiperplasia-prostatica' },
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

export default function HiperplasiaProstata() {
  return (
    <>
      <MedicalWebPageSchema
        name="Hiperplasia Prostática Benigna (HPB) em Fortaleza"
        description="HPB em Fortaleza: o que é, sintomas, diagnóstico e tratamentos modernos incluindo HoLEP e medicamentos. Dr. Érico Diógenes, especialista."
        url="https://drericodiogenes.com.br/condicoes-urologicas/prostata/hiperplasia-prostatica"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">HPB · Próstata Aumentada · Fortaleza</p>
              <h1 className="section-title mt-2">
                Hiperplasia Prostática Benigna:{' '}
                <span className="text-brand-gold">entenda o que acontece com a próstata e como tratar.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A hiperplasia prostática benigna (HPB) é o aumento não canceroso da próstata, condição tão comum que afeta mais de 50% dos homens acima de 60 anos e quase 90% dos que chegam aos 85. Apesar de benigna, a HPB pode comprometer significativamente a qualidade de vida e, sem tratamento, levar a complicações sérias.
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
              src="/demos/dr-erico/img/dr-erico-foto-5b.webp"
              alt="Hiperplasia Prostática Benigna, tratamento em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, SINTOMAS */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Como identificar</p>
            <h2 className="section-title mt-2">SINTOMAS DA HPB</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A próstata aumentada comprime a uretra, o canal por onde a urina passa, causando sintomas progressivos do trato urinário inferior (STUI). Muitos homens normalizam esses sintomas como "coisa da idade", adiando o diagnóstico. Reconhecê-los é essencial para agir a tempo.
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {sintomas.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-brand-beige-light rounded-xl p-4 shadow-card text-sm"
                data-aos="fade-up"
                data-aos-delay={i * 40}
              >
                <Check size={16} className="mt-0.5 shrink-0 text-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SEÇÃO 3, TRATAMENTOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Abordagens disponíveis</p>
            <h2 className="section-title mt-2">OPÇÕES DE TRATAMENTO PARA HPB</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              O tratamento da HPB é altamente individualizado. A escolha entre medicação e cirurgia depende do volume prostático, da intensidade dos sintomas e das preferências do paciente. Em Fortaleza, o Dr. Érico Diógenes oferece todas as modalidades disponíveis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tratamentos.map((card, i) => (
              <div
                key={card.titulo}
                className="bg-white rounded-2xl overflow-hidden shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.titulo} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{card.titulo}</h3>
                  <p className="text-sm text-brand-muted mt-2">{card.desc}</p>
                  <p className="text-xs text-brand-gold font-medium mt-3">Ideal para: {card.ideal}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center" data-aos="fade-up">
            <Link href="/holep" className="btn-primary">
              Saiba mais sobre o HoLEP →
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-7.webp" alt="Dr. Érico Diógenes, HPB e HoLEP em Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Pioneiro no Ceará</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O tratamento da HPB passou por uma revolução nos últimos anos. O HoLEP, cirurgia a laser para próstata, tornou-se o padrão ouro mundial por oferecer resultados equivalentes às cirurgias abertas, mas com mínimo sangramento, alta em 24 horas e indicação mesmo para próstatas muito grandes.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes foi um dos primeiros especialistas a introduzir o HoLEP no Ceará, tornando-se referência na técnica e oferecendo a homens cearenses acesso a um tratamento antes disponível apenas nos grandes centros do país.
              </p>
              <p>
                Formado pela Universidade Federal do Ceará e com especialização em endourologia e cirurgia minimamente invasiva, o Dr. Érico avalia cada caso individualmente, determinando se o tratamento ideal é medicamentoso ou cirúrgico, e qual a técnica mais indicada para cada paciente.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/holep" className="btn-primary">Conhecer o HoLEP</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE HPB</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Não normalize os sintomas urinários, agende sua avaliação em Fortaleza" />
    </>
  )
}
