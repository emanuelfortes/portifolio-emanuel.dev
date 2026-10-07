import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import CalculoRenalFaq from '@/demos/dr-erico/components/calculo-renal/CalculoRenalFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cálculo Renal Fortaleza | Pedra nos Rins, Dr. Érico Diógenes' },
  description:
    'Tratamento de cálculo renal e pedra nos rins em Fortaleza com Dr. Érico Diógenes. Ureteroscopia, litotripsia e cirurgia minimamente invasiva. Agende sua consulta.',
  alternates: { canonical: '/condicoes-urologicas/calculo-renal' },
  openGraph: {
    title: 'Cálculo Renal Fortaleza | Pedra nos Rins, Dr. Érico Diógenes',
    description:
      'Especialista em cálculo renal em Fortaleza. Diagnóstico preciso e tratamento moderno para pedra nos rins.',
    url: '/condicoes-urologicas/calculo-renal',
  },
}

const sintomas = [
  'Dor intensa nas costas ou na lateral do abdômen (cólica renal)',
  'Dor que irradia para a virilha ou parte baixa do abdômen',
  'Sangue na urina (hematúria)',
  'Náusea e vômito durante as crises de dor',
  'Necessidade frequente de urinar',
  'Ardência ou dificuldade ao urinar',
  'Febre e calafrios (sinal de infecção)',
  'Urina turva ou com odor forte',
]

const tratamentos = [
  {
    titulo: 'Ureteroscopia com Laser',
    desc: 'Procedimento minimamente invasivo onde o urologista acessa o cálculo pela via urinária natural e o fragmenta com laser de Holmium. Sem cortes e com alta no mesmo dia.',
    img: '/demos/dr-erico/img/post/imgid05_01.webp',
  },
  {
    titulo: 'Litotripsia Extracorpórea (LECO)',
    desc: 'Ondas de choque aplicadas externamente fragmentam o cálculo em pequenos pedaços que são eliminados naturalmente pela urina. Indicada para cálculos menores.',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    titulo: 'Nefrolitotripsia Percutânea',
    desc: 'Para cálculos grandes ou de difícil acesso. Uma pequena incisão no dorso permite acesso direto ao rim para fragmentação e retirada do cálculo.',
    img: '/demos/dr-erico/img/post/imgid04_01.webp',
  },
]

const faq = [
  {
    q: 'Cálculo renal e pedra nos rins são a mesma coisa?',
    a: 'Sim. "Pedra nos rins" é o nome popular para cálculo renal, depósitos sólidos de minerais e sais que se formam nos rins ou nas vias urinárias.',
  },
  {
    q: 'Qual o tamanho que exige cirurgia?',
    a: 'Cálculos menores que 5 mm frequentemente são eliminados espontaneamente. Acima disso, especialmente a partir de 8–10 mm, o tratamento intervencionista costuma ser indicado.',
  },
  {
    q: 'A ureteroscopia é dolorosa?',
    a: 'O procedimento é realizado sob anestesia. O desconforto pós-operatório é leve e controlado com analgésicos comuns.',
  },
  {
    q: 'Como prevenir o aparecimento de novos cálculos?',
    a: 'Hidratação adequada (2 a 3 litros de água por dia), dieta com menos sal e proteínas de origem animal e, em alguns casos, medicamentos específicos conforme o tipo de cálculo.',
  },
  {
    q: 'O cálculo renal pode causar infecção?',
    a: 'Sim. Quando o cálculo obstrui o fluxo urinário, há risco de infecção renal (pielonefrite), que pode ser grave. Febre associada à cólica renal exige avaliação médica urgente.',
  },
  {
    q: 'Quanto tempo leva a recuperação após a ureteroscopia?',
    a: 'A maioria dos pacientes recebe alta no mesmo dia ou no dia seguinte e retorna às atividades normais em 3 a 5 dias.',
  },
  {
    q: 'O cálculo renal pode afetar os dois rins ao mesmo tempo?',
    a: 'Sim, é possível ter cálculos em ambos os rins simultaneamente. O tratamento de cada lado é avaliado individualmente.',
  },
  {
    q: 'Preciso de dieta especial após o tratamento?',
    a: 'Depende do tipo de cálculo. Após a análise do material retirado, o Dr. Érico orienta sobre a dieta e as medidas de prevenção mais adequadas para o seu caso.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Condições Urológicas', item: 'https://drericodiogenes.com.br/condicoes-urologicas' },
    { '@type': 'ListItem', position: 3, name: 'Cálculo Renal', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal' },
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

export default function CalculoRenal() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cálculo Renal em Fortaleza, Pedra nos Rins"
        description="Tratamento de cálculo renal e pedra nos rins em Fortaleza com Dr. Érico Diógenes. Ureteroscopia com laser, litotripsia e cirurgia minimamente invasiva. Agende sua consulta."
        url="https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal"
        specialty="Urology"
      />



      {/* HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Cálculo Renal · Pedra nos Rins · Fortaleza</p>
              <h1 className="section-title mt-2">
                Diagnóstico preciso e{' '}
                <span className="text-brand-gold">tratamento moderno</span>{' '}
                para pedra nos rins em Fortaleza.
              </h1>
              <div className="mt-8">
                <a
                  href="https://wa.me/5585981781020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-silver"
                >
                  Agendar Consulta
                </a>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/post/imgid04_01.webp"
              alt="Cálculo renal, pedra nos rins"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* O QUE É */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl text-center" data-aos="fade-up">
          <h2 className="section-title">O QUE É CÁLCULO RENAL?</h2>
          <div className="mt-6 text-brand-muted space-y-4 text-left md:text-justify">
            <p>
              Cálculo renal, popularmente chamado de pedra nos rins, é um depósito sólido de
              minerais e sais que se forma dentro dos rins ou ao longo das vias urinárias. Quando
              pequenos, podem ser eliminados espontaneamente pela urina. Quando maiores, causam
              obstrução, dor intensa (cólica renal) e, se não tratados, podem comprometer a função
              do rim.
            </p>
            <p>
              O Brasil está entre os países com maior prevalência de litíase urinária, estimada em
              até 5% da população. Fatores como baixa ingestão hídrica, dieta rica em sal e
              proteínas animais, além de predisposição genética, aumentam o risco. O tratamento
              moderno é altamente eficaz, e quanto mais precoce, menor a necessidade de
              procedimentos complexos.
            </p>
          </div>
        </div>
      </section>

      {/* SINTOMAS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site" data-aos="fade-up">
          <h2 className="section-title text-center">SINTOMAS DO CÁLCULO RENAL</h2>
          <p className="text-center text-brand-muted italic mt-3">
            Procure um urologista se você apresentar:
          </p>
          <ul className="mt-10 grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {sintomas.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm"
                data-aos="fade-up"
                data-aos-delay={i * 40}
              >
                <Check size={16} className="mt-0.5 shrink-0 text-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-center mt-8 font-display italic text-brand-navy text-lg max-w-2xl mx-auto">
            A cólica renal é uma das dores mais intensas da medicina. Não espere: o diagnóstico
            precoce evita complicações e permite tratamentos menos invasivos.
          </p>
        </div>
      </section>

      {/* TRATAMENTOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Abordagens disponíveis</p>
            <h2 className="section-title mt-2">OPÇÕES DE TRATAMENTO</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tratamentos.map((card, i) => (
              <div
                key={card.titulo}
                className="bg-brand-beige-light rounded-2xl overflow-hidden shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.titulo} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{card.titulo}</h3>
                  <p className="text-sm text-brand-muted mt-2">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="section-title">
              Tratamento minimamente invasivo{' '}
              <span className="text-brand-gold">com recuperação rápida</span>
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                'Sem grandes cortes, acesso pela via urinária natural',
                'Alta hospitalar no mesmo dia na maioria dos casos',
                'Retorno às atividades em poucos dias',
                'Fragmentação precisa com laser de Holmium',
                'Análise do cálculo para prevenção de recidivas',
                'Tratamento personalizado conforme o tipo e tamanho do cálculo',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-green" />
                  <span className="text-brand-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/post/imgid04_02.webp"
                alt="Tratamento cálculo renal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">ESPECIALISTA EM LITÍASE URINÁRIA</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O Dr. Érico Diógenes é urologista formado pela Universidade Federal do Ceará, com
                especialização em cirurgias minimamente invasivas e endourologia.
              </p>
              <p>
                Sua atuação no tratamento de cálculos renais combina o uso de tecnologias de ponta
               , como o laser de Holmium, com uma avaliação individualizada de cada paciente,
                determinando a melhor abordagem para o tamanho, localização e composição do cálculo.
              </p>
              <p>
                Além do tratamento, o Dr. Érico orienta sobre prevenção de recidivas, incluindo
                ajustes na dieta e hidratação, reduzindo significativamente as chances de novos
                episódios.
              </p>
            </div>
            <Link href="/dr-erico-diogenes" className="btn-primary mt-8">
              Saiba Mais
            </Link>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-3.webp"
                alt="Dr. Érico Diógenes, Urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">
            PERGUNTAS FREQUENTES
          </h2>
          <CalculoRenalFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Está com dor ou suspeita de pedra nos rins? Agende agora." />
    </>
  )
}
