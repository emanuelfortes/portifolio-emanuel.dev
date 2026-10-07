import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Como se Preparar para a Consulta Urológica — Dr. Érico Diógenes' },
  description:
    'O que levar e como se preparar para a consulta com urologista em Fortaleza: documentos, exames, lista de medicamentos e diário urinário. Dr. Érico Diógenes orienta.',
  alternates: { canonical: '/exames-orientacoes/orientacoes/consulta' },
  openGraph: {
    title: 'Preparo para a Consulta Urológica | Dr. Érico Diógenes',
    description:
      'Chegar preparado muda o que a consulta consegue resolver. Veja a lista do que levar.',
    url: '/exames-orientacoes/orientacoes/consulta',
  },
}

const levar = [
  'Documento oficial com foto e CPF',
  'Cartão do convênio, se for usar plano',
  'Pedido ou encaminhamento médico, se houver',
  'Todos os exames anteriores, inclusive antigos: PSA, ultrassons, tomografias, urina, espermograma',
  'CDs ou links de exames de imagem, além dos laudos impressos',
  'Lista escrita dos medicamentos e suplementos em uso, com as doses',
  'Relatórios de cirurgias e internações anteriores',
  'Histórico de câncer urológico ou de mama em pais, irmãos e filhos',
  'Suas dúvidas anotadas, no papel ou no celular',
]

const diario = [
  {
    num: '1',
    nome: 'Anote por três dias',
    desc: 'Não precisa ser seguido. Escolha três dias representativos da sua rotina, incluindo pelo menos um fim de semana se a rotina mudar nesses dias.',
  },
  {
    num: '2',
    nome: 'Registre o horário de cada micção',
    desc: 'Toda vez que urinar, anote a hora. Inclusive as idas da madrugada, que são justamente as que mais informam.',
  },
  {
    num: '3',
    nome: 'Estime o volume',
    desc: 'Se puder, use um recipiente graduado. Se não, classifique em pouco, médio ou muito. Mesmo a estimativa grosseira ajuda.',
  },
  {
    num: '4',
    nome: 'Anote o que bebeu',
    desc: 'Quantidade aproximada e tipo, principalmente café, chá, refrigerante e bebida alcoólica. A relação entre o que entra e o que sai é o que dá sentido ao registro.',
  },
]

const perguntas = [
  'O que exatamente eu tenho, e como se chama?',
  'Quais são as opções de tratamento, e não apenas a primeira sugerida?',
  'O que acontece se eu não fizer nada agora?',
  'Quais efeitos indesejados devo esperar, e quais são passageiros?',
  'Em quanto tempo devo perceber melhora?',
  'Quais exames preciso repetir, e com que frequência?',
  'Quando é o retorno, e o que devo observar até lá?',
  'Em que situação devo procurar atendimento antes do retorno?',
]

const faq = [
  {
    q: 'Preciso levar exames antigos mesmo de anos atrás?',
    a: 'Sim, e eles costumam valer mais do que se imagina. Comparar um PSA de anos atrás com o atual mostra a velocidade de variação, informação que um resultado isolado não oferece. Vale o mesmo para ultrassons: a evolução de um achado importa mais do que sua existência.',
  },
  {
    q: 'Devo fazer exames antes da primeira consulta?',
    a: 'Não é necessário. Se já tiver exames recentes, leve. Fazer bateria de exames por conta própria costuma gerar repetição, porque sem a avaliação clínica não dá para saber quais são realmente úteis no seu caso.',
  },
  {
    q: 'Posso ir acompanhado?',
    a: 'Pode, e em muitos casos ajuda. Um acompanhante lembra informações que passam batido e ajuda a reter as orientações. Em qualquer momento da consulta, se preferir conversar a sós, basta dizer.',
  },
  {
    q: 'A consulta vai ter toque retal?',
    a: 'Não necessariamente. O exame é indicado conforme a idade, a queixa e os fatores de risco, é sempre explicado antes e depende do seu consentimento. Se preferir não fazer naquele momento, diga: isso é conversado e não compromete o atendimento.',
  },
  {
    q: 'Quanto tempo dura a consulta?',
    a: 'A primeira consulta costuma levar de trinta a quarenta e cinco minutos. Reserve pelo menos uma hora e meia no seu dia, contando deslocamento, estacionamento e eventual exame feito na mesma visita.',
  },
  {
    q: 'Vou coletar urina. Devo urinar antes de sair de casa?',
    a: 'Evite, se possível. Chegar com vontade de urinar facilita a coleta no mesmo dia e permite fazer exames que dependem de bexiga cheia sem precisar esperar. Se já urinou, não é problema: basta hidratar-se ao chegar.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Preparo para a Consulta', item: 'https://drericodiogenes.com.br/exames-orientacoes/orientacoes/consulta' },
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

export default function OrientacaoConsulta() {
  return (
    <>
      <MedicalWebPageSchema
        name="Como se Preparar para a Consulta Urológica"
        description="O que levar e como se preparar para a consulta com urologista. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/orientacoes/consulta"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Orientações ao Paciente · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Chegar preparado muda{' '}
                <span className="text-brand-gold">o que a consulta consegue resolver.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A diferença entre sair da consulta com um plano e sair com uma lista de exames costuma estar no que você levou. Exames antigos, a lista correta dos medicamentos e um diário de três dias mudam a conversa por completo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Consulta
                </a>
                <Link href="/contato" className="btn-silver">
                  Onde Fica o Consultório
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-3.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — CHECKLIST */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">A lista</p>
            <h2 className="section-title mt-2">O QUE LEVAR</h2>
            <p className="text-brand-muted mt-4">
              Fotografar as caixas dos medicamentos no celular resolve a parte mais esquecida dessa lista.
            </p>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {levar.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — DIÁRIO MICCIONAL */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Para queixas urinárias</p>
            <h2 className="section-title mt-2">O DIÁRIO DE TRÊS DIAS</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Se a sua queixa é urinar muitas vezes, urgência ou acordar à noite, este registro simples costuma informar mais do que qualquer exame inicial.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {diario.map((d, i) => (
              <div key={d.nome} className="flex gap-5 bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <span className="font-display text-3xl text-brand-gold shrink-0 leading-none">{d.num}</span>
                <div>
                  <h3 className="font-display text-base text-brand-navy">{d.nome}</h3>
                  <p className="text-sm text-brand-muted mt-1">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — PERGUNTAS */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Você também pergunta</p>
            <h2 className="section-title mt-2">O QUE VALE PERGUNTAR NA CONSULTA</h2>
            <p className="text-brand-muted mt-4">
              Consulta boa é conversa nos dois sentidos. Anote as que fizerem sentido para o seu caso.
            </p>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {perguntas.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-navy" />
                  <span className="text-sm text-brand-muted">{p}</span>
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
            <p className="eyebrow">Atendimento em Fortaleza</p>
            <h2 className="section-title mt-2">A CONSULTA COMEÇA COM CONVERSA</h2>
            <p className="text-brand-muted mt-4">
              A parte mais longa e mais importante da consulta urológica é a anamnese: entender há quanto tempo o sintoma existe, o que melhora, o que piora e como ele afeta sua rotina. O exame físico e os exames complementares vêm depois, guiados por essa conversa.
            </p>
            <p className="text-brand-muted mt-4">
              O consultório fica no Pátio Dom Luís, Avenida Dom Luís, 1200, sala 705, na Aldeota, com atendimento de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar pelo WhatsApp
              </a>
              <Link href="/exames-orientacoes" className="btn-silver">
                Exames e Orientações
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
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Separe seus exames antigos antes de agendar." />
    </>
  )
}
