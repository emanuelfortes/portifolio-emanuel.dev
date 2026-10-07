import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Sangue na Urina Fortaleza | Causas e Quando Investigar — Dr. Érico Diógenes' },
  description:
    'Sangue na urina em Fortaleza: o que pode causar, por que nunca deve ser ignorado, quais exames investigam e quando procurar atendimento. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/condicoes-urologicas/bexiga/sangue-na-urina' },
  openGraph: {
    title: 'Sangue na Urina Fortaleza | Dr. Érico Diógenes',
    description:
      'Hematúria não é diagnóstico, é sinal. Entenda as causas, os exames que investigam e por que um episódio único já justifica avaliação.',
    url: '/condicoes-urologicas/bexiga/sangue-na-urina',
  },
}

const tipos = [
  {
    nome: 'Hematúria Macroscópica',
    freq: 'Visível a olho nu',
    cor: 'bg-red-50 border-t-4 border-red-400',
    corTxt: 'text-red-500',
    desc: 'A urina fica rosada, avermelhada ou cor de refrigerante escuro. É o tipo que assusta e leva o paciente ao consultório, e é também o que tem maior associação com causas que precisam de diagnóstico rápido.',
    conduta: 'Avaliação em poucos dias, mesmo que tenha acontecido uma única vez e parado sozinho.',
  },
  {
    nome: 'Hematúria Microscópica',
    freq: 'Só aparece no exame',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'A urina tem aparência normal e o sangue só é detectado no exame de urina, geralmente pedido por outro motivo. Por não dar sintoma, costuma ser ignorada por anos.',
    conduta: 'Confirmar em novo exame e investigar conforme idade e fatores de risco.',
  },
]

const causas = [
  {
    causa: 'Infecção urinária',
    detalhe:
      'É a causa mais frequente, sobretudo em mulheres. Costuma vir acompanhada de ardência, urgência e aumento da frequência urinária. Tratada a infecção, o sangramento cessa, mas o exame deve ser repetido depois para confirmar que a urina normalizou.',
  },
  {
    causa: 'Cálculo urinário',
    detalhe:
      'A pedra machuca a parede do ureter ou da bexiga ao se deslocar. Aqui o sangramento quase sempre vem junto de dor em cólica, que irradia da região lombar para a virilha. É uma causa comum no Ceará, onde a prevalência de cálculo é alta.',
  },
  {
    causa: 'Aumento benigno da próstata',
    detalhe:
      'A próstata aumentada tem vasos mais frágeis e dilatados, que podem romper e sangrar. Ocorre em homens acima dos 50 anos e costuma vir com jato fraco e aumento da frequência urinária noturna.',
  },
  {
    causa: 'Tumores do trato urinário',
    detalhe:
      'Câncer de bexiga, de rim e da via urinária podem se manifestar por sangramento SEM dor nenhuma. É justamente a ausência de dor que faz o paciente adiar a consulta, e é o cenário que mais preocupa em quem tem mais de 40 anos ou histórico de tabagismo.',
  },
  {
    causa: 'Exercício intenso e trauma',
    detalhe:
      'Corrida de longa distância e esportes de contato podem causar sangramento transitório. É um diagnóstico de exclusão: só se aceita essa explicação depois que a investigação afastou as demais causas.',
  },
  {
    causa: 'Doenças do rim',
    detalhe:
      'Glomerulonefrites e outras doenças do parênquima renal cursam com sangue na urina, em geral acompanhado de proteína no exame e alteração da função renal. Nesses casos o acompanhamento é feito em conjunto com o nefrologista.',
  },
]

const sinaisAlerta = [
  'Sangramento visível sem nenhuma dor associada',
  'Coágulos na urina, principalmente se dificultam urinar',
  'Idade acima de 40 anos com episódio de hematúria visível',
  'Histórico de tabagismo, atual ou passado',
  'Exposição ocupacional a tintas, solventes, borracha ou corantes',
  'Perda de peso sem explicação, cansaço ou dor lombar persistente',
  'Hematúria que retorna depois de tratada uma infecção',
]

const exames = [
  {
    nome: 'Exame de urina com sedimento',
    papel:
      'Confirma que o que se vê é mesmo sangue e verifica se há infecção associada. Também mostra a forma das hemácias, o que ajuda a distinguir origem renal de origem na via urinária.',
  },
  {
    nome: 'Ultrassonografia do aparelho urinário',
    papel:
      'Primeiro exame de imagem na maioria dos casos. Avalia rins, bexiga e próstata, identifica cálculos e massas maiores, e não usa radiação.',
  },
  {
    nome: 'Tomografia (urotomografia)',
    papel:
      'Exame de escolha quando há hematúria visível ou fatores de risco. Enxerga cálculos pequenos, tumores renais e alterações do ureter que o ultrassom não alcança.',
  },
  {
    nome: 'Cistoscopia',
    papel:
      'Visualiza o interior da bexiga com uma ótica fina. É o único método que enxerga diretamente a parede vesical e, por isso, indispensável para afastar tumor de bexiga em pacientes de risco.',
  },
  {
    nome: 'Citologia urinária',
    papel:
      'Procura células tumorais na urina. Complementa a cistoscopia, principalmente na suspeita de lesões planas que são difíceis de ver.',
  },
]

const faq = [
  {
    q: 'Sangue na urina uma única vez precisa de investigação?',
    a: 'Sim. Um episódio isolado que passou sozinho não afasta causa importante, porque tumores de bexiga costumam sangrar de forma intermitente: sangram, param, e voltam semanas depois. Esperar o próximo episódio significa perder tempo de diagnóstico. A conduta correta é investigar já no primeiro.',
  },
  {
    q: 'Sangue na urina sempre significa câncer?',
    a: 'Não, e na maioria das vezes não é. Infecção urinária e cálculo respondem por boa parte dos casos. O ponto é que as causas graves e as banais se manifestam do mesmo jeito, e só a investigação diferencia. O objetivo do exame não é confirmar câncer, é afastá-lo com segurança.',
  },
  {
    q: 'Urina vermelha é sempre sangue?',
    a: 'Não. Beterraba, corantes alimentares e alguns medicamentos, como a rifampicina e a fenazopiridina, deixam a urina avermelhada ou alaranjada sem haver sangue. O exame de urina esclarece isso em minutos. Ainda assim, não presuma que foi alimentação: confirme.',
  },
  {
    q: 'Sangue na urina dói?',
    a: 'Depende da causa. Quando vem de infecção ou cálculo, quase sempre há ardência ou cólica. Quando vem de tumor, costuma ser indolor, e é exatamente essa ausência de dor que faz o paciente adiar a consulta. Hematúria sem dor merece mais atenção, não menos.',
  },
  {
    q: 'Mulher com sangue na urina é sempre infecção?',
    a: 'Não. Infecção é a causa mais comum em mulheres, mas não é a única. Se o sangramento persiste após o tratamento, se retorna com frequência ou se há fatores de risco como tabagismo, a investigação precisa continuar mesmo que a urocultura tenha vindo positiva no início.',
  },
  {
    q: 'Posso estar menstruada e confundir?',
    a: 'Sim, e por isso o exame de urina em mulheres deve ser coletado fora do período menstrual sempre que possível. Se houver dúvida, repete-se a coleta alguns dias depois para evitar tanto o falso positivo quanto o adiamento de uma investigação necessária.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga' },
    { '@type': 'ListItem', position: 3, name: 'Sangue na Urina', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga/sangue-na-urina' },
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

export default function SangueNaUrina() {
  return (
    <>
      <MedicalWebPageSchema
        name="Sangue na Urina em Fortaleza: Causas e Quando Investigar"
        description="Causas de hematúria, exames que investigam e sinais que pedem avaliação imediata. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/bexiga/sangue-na-urina"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Bexiga e Trato Urinário · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Sangue na urina nunca é normal.{' '}
                <span className="text-brand-gold">Mesmo que tenha acontecido só uma vez.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A hematúria não é um diagnóstico: é um sinal de que algo no trato urinário precisa ser explicado. Na maioria das vezes a causa é tratável e sem gravidade. O problema é que causas banais e causas sérias se manifestam exatamente do mesmo jeito, e só a investigação separa uma da outra.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas/bexiga" className="btn-silver">
                  Ver Condições da Bexiga
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/*
              object-top ancora o corte no topo da imagem.
              Sem isso, o object-cover recorta pelo centro e decepa a cabeça em
              fotos verticais, que é o caso de todas as fotos do Dr. Érico:
              o rosto fica no terço superior do enquadramento.
            */}
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

      {/* SEÇÃO 2 — OS DOIS TIPOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Nem todo sangramento se vê</p>
            <h2 className="section-title mt-2">OS DOIS TIPOS DE HEMATÚRIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A distinção importa porque muda a urgência e a profundidade da investigação. Uma é impossível de ignorar. A outra passa despercebida por anos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-lg ${t.corTxt}`}>{t.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">{t.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <div className="mt-4 pt-3 border-t border-white/60">
                  <p className="text-xs font-medium text-brand-navy">Conduta: {t.conduta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — CAUSAS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O que pode estar por trás</p>
            <h2 className="section-title mt-2">AS PRINCIPAIS CAUSAS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {causas.map((c, i) => (
              <div key={c.causa} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-lg text-brand-navy">{c.causa}</h3>
                <p className="text-sm text-brand-muted mt-2">{c.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — SINAIS DE ALERTA */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Não espere o próximo episódio</p>
            <h2 className="section-title mt-2">QUANDO A INVESTIGAÇÃO É PRIORITÁRIA</h2>
            <p className="text-brand-muted mt-4">
              Qualquer sangue na urina merece avaliação. Os itens abaixo aumentam a chance de uma causa que não pode esperar.
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {sinaisAlerta.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-red-500" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Se houver coágulos que impeçam urinar, dor intensa ou febre alta associada, procure atendimento de urgência.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — EXAMES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Como se chega ao diagnóstico</p>
            <h2 className="section-title mt-2">OS EXAMES QUE INVESTIGAM</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Nem todo paciente faz todos. A escolha depende da idade, dos fatores de risco e de o sangramento ser visível ou apenas laboratorial.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {exames.map((e, i) => (
              <div key={e.nome} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{e.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{e.papel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">INVESTIGAÇÃO COMPLETA, SEM ETAPAS PULADAS</h2>
            <p className="text-brand-muted mt-4">
              O Dr. Érico Diógenes é urologista com mais de 21 anos de experiência, doutor em Urologia pela USP e com fellowship em uro-oncologia no Hospital Sírio-Libanês. A investigação de hematúria exige exatamente essa combinação: conhecer as causas benignas, que são a maioria, e reconhecer cedo as que não são.
            </p>
            <p className="text-brand-muted mt-4">
              O atendimento acontece no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/bexiga/infeccao-urinaria" className="btn-silver">
                Infecção Urinária
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
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE SANGUE NA URINA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Viu sangue na urina? Não espere acontecer de novo para investigar." />
    </>
  )
}
