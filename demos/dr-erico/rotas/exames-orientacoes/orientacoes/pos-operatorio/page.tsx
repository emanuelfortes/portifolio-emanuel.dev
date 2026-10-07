import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Orientações Pós-Operatórias | Recuperação — Dr. Érico Diógenes' },
  description:
    'Recuperação após cirurgia urológica em Fortaleza: cuidados com a ferida, retorno às atividades, sinais de alerta e quando procurar atendimento. Dr. Érico Diógenes orienta.',
  alternates: { canonical: '/exames-orientacoes/orientacoes/pos-operatorio' },
  openGraph: {
    title: 'Orientações Pós-Operatórias | Dr. Érico Diógenes',
    description:
      'O que é esperado na recuperação, o que não é, e quando procurar atendimento sem esperar o retorno.',
    url: '/exames-orientacoes/orientacoes/pos-operatorio',
  },
}

const cuidados = [
  {
    nome: 'Ferida operatória',
    desc: 'Mantenha limpa e seca conforme a orientação recebida na alta. Banho é permitido na maioria dos casos, mas evite esfregar a região e seque por leve compressão, sem atrito. Curativos e pontos seguem instrução específica do procedimento.',
  },
  {
    nome: 'Dor',
    desc: 'Algum desconforto é esperado nos primeiros dias e é controlado com a analgesia prescrita. Tome nos horários orientados, sem esperar a dor ficar forte. Dor que aumenta em vez de diminuir com o passar dos dias não é esperada e deve ser comunicada.',
  },
  {
    nome: 'Sonda vesical',
    desc: 'Quando houver, mantenha a bolsa sempre abaixo do nível da bexiga e evite dobras no tubo. Beba bastante líquido. Urina um pouco rosada nos primeiros dias é comum; coágulos que bloqueiem o fluxo não são.',
  },
  {
    nome: 'Hidratação e intestino',
    desc: 'Beber água ajuda a limpar a via urinária e reduz o desconforto. Evite fazer força para evacuar: constipação aumenta a pressão abdominal e atrapalha a cicatrização. Ajuste a alimentação e comunique se o intestino não funcionar.',
  },
  {
    nome: 'Atividade física e esforço',
    desc: 'Caminhadas leves são estimuladas cedo, porque reduzem risco de trombose. Esforço, peso e exercício intenso têm prazo próprio para cada cirurgia, informado na alta. Não antecipe por se sentir bem.',
  },
  {
    nome: 'Atividade sexual e direção',
    desc: 'Os prazos variam conforme o procedimento e são orientados individualmente. Não dirija enquanto estiver usando analgésico que cause sonolência ou enquanto a dor limitar seus movimentos.',
  },
]

const esperado = [
  'Desconforto na região operada, que diminui progressivamente a cada dia',
  'Urina levemente rosada nos primeiros dias, quando houve manipulação da via urinária',
  'Cansaço e menos disposição na primeira semana',
  'Inchaço discreto ao redor da incisão',
  'Ardência leve ao urinar nos primeiros dias',
  'Alteração transitória do hábito intestinal',
]

const alerta = [
  'Febre igual ou acima de 38 °C, principalmente com calafrios',
  'Dor que piora em vez de melhorar, ou que não cede com a analgesia prescrita',
  'Sangramento volumoso, com coágulos, ou que aumenta',
  'Incapacidade de urinar, com bexiga cheia e dor',
  'Saída de secreção com odor, vermelhidão ou calor na ferida',
  'Dor, inchaço ou vermelhidão em uma das pernas',
  'Falta de ar, dor no peito ou palpitações',
  'Vômitos persistentes ou barriga distendida e dolorosa',
]

const faq = [
  {
    q: 'Em quanto tempo volto às atividades normais?',
    a: 'Depende muito do procedimento. Cirurgias minimamente invasivas costumam permitir retorno mais rápido à rotina leve, enquanto atividades com esforço têm prazo maior. A orientação específica é dada na alta, e ela considera o seu procedimento e a sua evolução.',
  },
  {
    q: 'Urina com sangue depois da cirurgia é normal?',
    a: 'Urina levemente rosada nos primeiros dias é comum quando houve manipulação da via urinária, e tende a clarear progressivamente. O que não é esperado é sangramento volumoso, com coágulos, ou que aumenta em vez de diminuir. Nesses casos procure atendimento.',
  },
  {
    q: 'Posso tomar banho?',
    a: 'Na maioria dos casos sim, e costuma ser liberado cedo. O cuidado é não esfregar a incisão e secar por leve compressão, sem atrito. Banho de imersão, piscina e mar têm liberação mais tardia. Siga a orientação recebida na alta.',
  },
  {
    q: 'Quando retiro os pontos?',
    a: 'Depende do tipo de sutura e do procedimento: há pontos absorvíveis que não precisam de retirada e outros com prazo definido. Isso é informado na alta e conferido no retorno.',
  },
  {
    q: 'Esqueci de tomar o remédio no horário. E agora?',
    a: 'Em geral, tome assim que lembrar e siga o esquema. Não dobre a dose para compensar. Se houver dúvida sobre um medicamento específico, entre em contato com a equipe em vez de improvisar.',
  },
  {
    q: 'Quando é o retorno?',
    a: 'A consulta de retorno é agendada conforme o procedimento, geralmente nas primeiras semanas. Ela serve para avaliar a cicatrização, discutir o resultado do exame anatomopatológico quando houver e ajustar as orientações. Não deixe de comparecer mesmo se estiver se sentindo bem.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Pós-Operatório', item: 'https://drericodiogenes.com.br/exames-orientacoes/orientacoes/pos-operatorio' },
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

export default function PosOperatorio() {
  return (
    <>
      <MedicalWebPageSchema
        name="Orientações Pós-Operatórias em Cirurgia Urológica"
        description="Cuidados na recuperação, o que é esperado, sinais de alerta e quando procurar atendimento. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/orientacoes/pos-operatorio"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Orientações ao Paciente · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Saber o que é esperado{' '}
                <span className="text-brand-gold">é o que permite reconhecer o que não é.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Algum desconforto, cansaço e urina levemente rosada fazem parte da recuperação. Febre com calafrios, dor que piora e sangramento com coágulos não fazem. A diferença entre esperar o retorno e procurar atendimento hoje está nessa distinção.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Falar com a Equipe
                </a>
                <Link href="/exames-orientacoes/orientacoes/pre-operatorio" className="btn-silver">
                  Orientações Pré-Operatórias
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

      {/* SEÇÃO 2 — CUIDADOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">No dia a dia da recuperação</p>
            <h2 className="section-title mt-2">OS CUIDADOS PRINCIPAIS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {cuidados.map((c, i) => (
              <div key={c.nome} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{c.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — ESPERADO x ALERTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">A distinção que importa</p>
            <h2 className="section-title mt-2">O QUE É ESPERADO E O QUE NÃO É</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up">
              <h3 className="font-display text-xl text-brand-navy mb-4">Faz parte da recuperação</h3>
              <ul className="space-y-3">
                {esperado.map((e) => (
                  <li key={e} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-brand-green" />
                    <span className="text-sm text-brand-muted">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8" data-aos="fade-up" data-aos-delay={80}>
              <h3 className="font-display text-xl text-red-500 mb-4">Procure atendimento</h3>
              <ul className="space-y-3">
                {alerta.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-red-500" />
                    <span className="text-sm text-brand-muted">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-brand-muted mt-8 max-w-2xl mx-auto" data-aos="fade-up">
            Na dúvida, entre em contato. Avaliar um sintoma cedo é sempre mais simples do que tratar uma complicação instalada.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Acompanhamento em Fortaleza</p>
            <h2 className="section-title mt-2">ESTAS SÃO ORIENTAÇÕES GERAIS</h2>
            <p className="text-brand-muted mt-4">
              Cada cirurgia tem prazos e cuidados próprios, e as instruções entregues na alta prevalecem sobre qualquer orientação geral encontrada na internet, inclusive esta página. Use este conteúdo para entender o contexto, não para substituir o que a equipe orientou.
            </p>
            <p className="text-brand-muted mt-4">
              A consulta de retorno faz parte do tratamento. Comparecer mesmo estando bem permite conferir a cicatrização e discutir resultados de exames quando houver.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Falar com a Equipe
              </a>
              <Link href="/contato" className="btn-silver">
                Onde Fica o Consultório
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-5.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE O PÓS-OPERATÓRIO</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Na dúvida sobre um sintoma no pós-operatório, entre em contato." />
    </>
  )
}
